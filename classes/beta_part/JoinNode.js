/**
 * JoinNode nodes necessarily have two parents, an AlphaMemoryNode and a BetaMemoryNode.
 * JoinNode is used to detect the wme passed by any of the parent nodes (may be the wme passed by the AlphaMemoryNode or the token passed by the BetaMemoryNode)
 * Whether there is a "consistent binding of variables and constants" with an item stored in items of another parent node
 * If so, activate the child node of the JoinNode and pass the "variable and constant bindings are consistent" wme and token into a larger token to the child node
 */

const AlphaMemoryNode = require("../alpha_part/AlphaMemoryNode");
const BetaMemoryNode = require("./BetaMemoryNode");
const TestAtJoinNode = require("./TestAtJoinNode");
const Token = require("../common/Token");

module.exports = class JoinNode {
  // Child nodes of the current node. Although the children of a JoinNode in the current base version of RETE necessarily have only one BetaMemoryNode
  children = null;
  // One of the parent nodes of JoinNode, type BeraMemoryNode
  parent = null;
  // Another parent of JoinNode, type AlphaMemoryNode
  alpha_memory = null;
  // A list of TestAtJoinNode objects
  tests = [];

  constructor() {
    this.children = new BetaMemoryNode();
    this.children.parent = this;
  }

  /**
   * This method is called when a BetaMemoryNode in the parent node wants to activate the JoinNode
   * Pass in a token and the method will test the token against all the wme stored in the AlphaMemoryNode of the other parent node for "variable and constant binding consistency" based on the tests stored in the tests property.
   * @param {Token} token The token to be tested
   * @returns Whether the current token passes the test
   */
  left_activate(token) {
    let result = true;
    for (let test of this.tests) {
      if (!test.field_of_arg1 || !test.field_of_arg2) {
        continue; // test attribute is incomplete, skip detection
      }
      if (token.attribute == test.field_of_arg1) {
        let list = this.alpha_memory.items.filter(wme => wme.attribute == test.field_of_arg2);
        if (list.length == 0) {
          continue; // wme has no attr
        }
        let needToDelete = true;
        for (let wme of list) {
          if (test.activate(token.value, wme.value)) needToDelete = false
        }
        if (needToDelete) {
          result = false;
        }
      } else if (token.attribute == test.field_of_arg2) {
        let list = this.alpha_memory.items.filter(wme => wme.attribute == test.field_of_arg1);
        if (list.length == 0) {
          continue; // wme has no attr
        }
        let needToDelete = true;
        for (let wme of list) {
          if (test.activate(wme.value, token.value)) needToDelete = false
        }
        if (needToDelete) {
          result = false;
        }
      } else {
        // token without attr
      }
    }
    return result;
  }

  /**
   * This method is called when the AlphaMemoryNode in the parent node wants to activate the JoinNode
   * The effect is similar to left_activate, except that this method receives the wme passed in from the AlphaMemoryNode
   * @param {WME} wme The wme to be tested
   * @returns Whether the current wme passes the test
   */
  right_activate(wme) {
    this.children = this.parent;
    let isAdded = false; // Whether the current wme has been added to the BetaMemoryNode
    let hasAttr = false; // Whether the current wme has the attribute of variable consistency detection
    for (let test of this.tests) {
      if (wme.attribute == test.field_of_arg1) {
        // The current wme needs to be validated, traversing the token of the betaMemoryNode
        hasAttr = true;
        if (!test.field_of_arg2) {
          if (!isAdded) {
            this.children.items.push(new Token(wme));
            isAdded = true;
            // If no variables are provided in the current test, add them directly to
          }
        } else {
          let list = this.parent.items.filter(token => token.attribute == test.field_of_arg2);
          let inList = false; // Whether the current wme can correspond to one of the token
          for (let token of list) {
            if (test.activate(wme.value, token.value)) {
              inList = true;
              if (!isAdded) {
                this.children.items.push(new Token(wme));
                isAdded = true;
                // The condition is sufficient, the current wme and the token in the BetaMemoryNode are consistent with the variable, join the BetaMemoryNode
              }
              break;
            }
          }
          if (!inList) {
            this.children.delete(wme.fact_id);
            // The current wme and token can not correspond to either one of them, delete the wme under this fact in BetaMemoryNode
            isAdded = false;
          }
        }
      } else if (wme.attribute == test.field_of_arg2) {
        // The current wme provides variables to iterate through the token of the betaMemoryNode for deletion
        hasAttr = true;
        if (!test.field_of_arg1) {
          if (!isAdded) {
            this.children.items.push(new Token(wme));
            isAdded = true;
            // The current test has no variable requirements and is added directly to
          }
        } else {
          let list = this.parent.items.filter(token => token.attribute == test.field_of_arg1);
          let inList = false; // Whether the current wme can correspond to one of the token
          for (let token of list) {
            if (test.activate(token.value, wme.value)) {
              inList = true;
              if (!isAdded) {
                this.children.items.push(new Token(wme));
                isAdded = true;
                // The condition is sufficient, the current wme and the token in the BetaMemoryNode are consistent with the variable, join the BetaMemoryNode
              }
              break;
            }
          }
          if (!inList) {
            this.children.delete(wme.fact_id);
            // The current wme and token can not correspond to either one of them, delete the wme under this fact in BetaMemoryNode
            isAdded = false;
          }
        }
      }
    }
    if (!hasAttr && !isAdded) {
      this.children.items.push(new Token(wme));
      isAdded = true;
      // There is no variable consistency requirement, add BetaMemoryNode directly
    }
    return isAdded;
  }

  /**
   * Binding alpha parent node
   * @param {AlphaMemoryNode} alphaMemoryNode alpha parent node
   */
  bindAlpha(alphaMemoryNode) {
    if (!(alphaMemoryNode instanceof AlphaMemoryNode)) throw new Error("param of 'bindAlpha' need to be AlphaMemoryNode");
    for (let item of alphaMemoryNode.waitToVeirfy) {
      let testAtJoinNode = this.findTest(item.v);
      if (testAtJoinNode) {
        testAtJoinNode.field_of_arg1 = item.a;
        testAtJoinNode.operate = item.o;
      } else {
        testAtJoinNode = new TestAtJoinNode(item.v, item.a, item.o, null);
        this.tests.push(testAtJoinNode);
      }
    }
    for (let item of alphaMemoryNode.variableSave.keys()) {
      let testAtJoinNode = this.findTest(item);
      if (testAtJoinNode) {
        testAtJoinNode.field_of_arg2 = alphaMemoryNode.variableSave.get(item);
      } else {
        testAtJoinNode = new TestAtJoinNode(item, null, null, alphaMemoryNode.variableSave.get(item));
        this.tests.push(testAtJoinNode);
      }
    }
    this.alpha_memory = alphaMemoryNode;
    alphaMemoryNode.children = this;
  }

  /**
   * Binding beta nodes
   * @param {BetaMemoryNode} betaMemoryNode beta parent node
   */
  bindBeta(betaMemoryNode) {
    if (!(betaMemoryNode instanceof BetaMemoryNode)) throw new Error("param of 'bindBeta' need to be BetaMemoryNode");
    this.parent = betaMemoryNode;
    betaMemoryNode.children = this;
  }

  /**
   * Find the test corresponding to the consistency according to the variable name in the conditional chain
   * @param {String} viariableName Variable names in conditional chains
   * @returns The test corresponding to the current name
   */
  findTest(viariableName) {
    let res = null;
    for (let item of this.tests) {
      if (item.viariableName == viariableName) {
        res = item;
      }
    }
    return res;
  }
}