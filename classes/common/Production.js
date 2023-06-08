/**
 * Rules
 * Consists of a set of conditions
 * Static and dynamic conditions in classified storage conditions
 * Converting ConditionaList to ConstantTestNode
 */

const { Condition, ConditionaList } = require("./Condition");
const { ConstantTestNode, AlphaTree } = require("../alpha_part/ConstantTestNode");

module.exports = class Production {
  // TypeNode
  types = new Map();

  /**
   * Production constructor
   * @param {Array<Codition|ConditionaList>} conditions LHS List of conditions contained in a rule
   * @param {Action} action RHS
   */
  constructor(conditions, action) {
    conditions.forEach(item => {
      if (!(item instanceof ConditionaList)) item = new ConditionaList(item)
      if (this.types.has(item.identifier)) {
        // Duplication occurs
        throw new Error("conditionIdentifier of production can not repeat");
      } else {
        this.types.set(item.identifier, this.convert(item))
      }
    })
    this.action = action
  }

  /**
   * Convert ConditionaList structure to AlphaTree structure (graph type construction to tree network)
   * @param {ConditionaList} conditionaList Conditional Chain
   * @returns AlphaTree
   */
  convert(conditionaList) {
    let tree = new AlphaTree(new ConstantTestNode());
    let toTestNode = (list, tree) => {
      let cur = list.head.next;
      while (cur) {
        let leaves = tree.getLast();
        for (let item of cur.val) {
          let node = null;
          if (item instanceof Condition) {
            node = new AlphaTree(ConstantTestNode.fromCondition(item));
          } else if (item instanceof ConditionaList) {
            node = toTestNode(item, new AlphaTree(new ConstantTestNode()))
          }
          for (let leaf of leaves) {
            leaf.leaves.add(node)
          }
        }
        cur = cur.next;
      }
      return tree;
    }
    toTestNode(conditionaList, tree);
    return tree;
  }
}

