/**
 * For each new wme added to the RTE network, we need to perform several constant tests on it
 * Each constant test is completed by a sequence of ConstantTestNodes
 * If this wme passes the current node's test, the current node performs two actions:
 *  1. detect whether the corresponding AlphaMemoryNode exists in the current test node, and if it exists, activate it and pass wme in
 *  2. activate the next test node of the current test node and pass this wme into
 * (Each condition of the rule may be a variable or a constant on each domain when we open the network according to the rule)
 */

const { Condition } = require("../common/Condition");
const AlphaMemoryNode = require("../alpha_part/AlphaMemoryNode");

class ConstantTestNode {
  // Specific property name
  field_to_test = "";
  // Specific operations
  field_to_operate = "";
  // Specific property values
  field_to_equal = "";
  // Header ConstantTestNode
  head = false;
  // Storing constants as variables
  variableSave = null;
  // Verifying constants as variables
  waitToVeirfy = null;

  /**
   * ConstantTestNode constructor
   * @param {Object} options attribute (if there is no attribute is the head node, the head node only exists as a connection node, the verification result is directly true)
   * @returns 
   */
  constructor(options) {
    if (!options) {
      this.head = true;
      return;
    }
    const { field_to_test, field_to_operate, field_to_equal } = options;
    this.field_to_test = field_to_test;
    this.field_to_operate = field_to_operate;
    this.field_to_equal = field_to_equal;
  }

  /**
   * Constructed by Condition
   * @param {Condition} condition condition
   * @returns ConstantTestNode instance
   */
  static fromCondition(condition) {
    if (!(condition instanceof Condition)) throw new Error("instance must be Condition");
    const { attribute, operation, value } = condition;
    let instance = new ConstantTestNode({
      field_to_test: attribute,
      field_to_operate: operation,
      field_to_equal: value
    })
    return instance;
  }

  /**
   * Used to activate the node and make the node perform a constant test on the incoming wme
   * @param {WME} wme wme to be tested
   * @returns Does it pass
   */
  activate(wme) {
    if (!this.head) {
      if (!(this.field_to_test && this.field_to_operate && this.field_to_equal)) throw new Error("ConstantTestNode need three operate");
      const { attribute, value } = wme;
      if (attribute != this.field_to_test) return false
      if ((typeof this.field_to_equal) == "string" && this.field_to_equal.charAt(0) == "$" && this.field_to_operate != "save") {
        this.waitToVeirfy = { a: this.field_to_test, o: this.field_to_operate, v: this.field_to_equal };
        return true;
      }
      switch (this.field_to_operate) {
        case "=":
          if (!(value == this.field_to_equal)) return false;
          break
        case ">":
          if (!(value > this.field_to_equal)) return false;
          break;
        case "<":
          if (!(value < this.field_to_equal)) return false;
          break;
        case ">=":
          if (!(value >= this.field_to_equal)) return false;
          break;
        case "<=":
          if (!(value <= this.field_to_equal)) return false;
          break;
        case "save":
          this.variableSave = { a: this.field_to_test, v: this.field_to_equal };
          break;
        default:
          throw new Error("operate type wrong");
          break;
      }
    }
    return true;
  }
}
exports.ConstantTestNode = ConstantTestNode;

/**
 * Alpha Tree Network
 */
class AlphaTree {
  // Tree top layer
  head = null;
  // Validation Nodes
  node = null;
  // Leaf Nodes
  leaves = null;

  /**
   * Alpha tree constructor
   * @param {ConstantTestNode} node Detection node at current location
   */
  constructor(node) {
    if (!node || !(node instanceof ConstantTestNode)) throw new Error("tree must build from ConstantTestNode")
    this.node = node;
    this.leaves = new Set();
  }

  /**
   * Get all the leaf nodes in the current count
   * @returns Leaf node array
   */
  getLast() {
    let result = new Set();
    let search = (list, leaves) => {
      for (let item of list) {
        if (item.leaves && item.leaves.size > 0) {
          search(item.leaves, leaves);
        } else {
          leaves.add(item);
        }
      }
    }
    if (this.leaves.size == 0) {
      return [this];
    }
    search(this.leaves, result)
    return result
  }

  toString() {
    let result = [];
    let search = (list, str) => {
      for (let item of list) {
        let newStr = str + `(${item.node.field_to_equal})->`;
        if (item.leaves && item.leaves.size > 0) {
          search(item.leaves, newStr)
        } else {
          str += `(${item.node.field_to_equal})`;
          result.push(str)
        }
      }
    }
    search([this], "")
    return result.join("\n")
  }

  /**
   * Forward propagation (wmes end up in alpha memory by propagating through the tree network)
   * @param {Set} wmes wme set
   * @returns alpha meomory
   */
  propagate(wmes) {
    if (!(wmes instanceof Set)) wmes = new Set([wmes]);
    let alphaMemoryNode = new AlphaMemoryNode();
    let dfs = (list) => {
      for (let item of list) {
        if (item.node && !item.node.head) {
          let pass = false;
          let temp = [];
          for (let wme of wmes) {
            if (item.node.activate(wme)) {
              if (alphaMemoryNode.hasFact(wme.fact_id)) {
                temp.push(wme.fact_id);
                pass = true;
              }
            }
          }
          if (!pass) return;
          for (let id of temp) alphaMemoryNode.addFact(id);
          item.node.waitToVeirfy && alphaMemoryNode.waitToVeirfy.push(item.node.waitToVeirfy);
          if (item.node.variableSave) {
            alphaMemoryNode.variableSave.set(item.node.variableSave.v, item.node.variableSave.a);
          }
        }
        if (item.leaves && item.leaves.size > 0) {
          dfs(item.leaves)
        } else { }
      }
    }
    dfs([this])
    return alphaMemoryNode;
  }
}
exports.AlphaTree = AlphaTree;