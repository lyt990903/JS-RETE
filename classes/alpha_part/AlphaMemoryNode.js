/**
 * Each constant test is implemented as a sequence of ConstantTestNodes
 * The last ConstantTestNode of each constant test mounts an AlphaMemoryNode
 * Used to store all facts that have passed a specific constant test
*/

const Fact = require("../common/Fact");

module.exports = class AlphaMemoryNode {
  // A list that stores all fact ids that have passed a particular constant test
  facts = new Set();
  // A list to store all the wme
  items = [];
  // Used to store the children of the current node, it is a JoinNode object
  children = null;
  // Check constants as variables (waiting to be verified in the beta network)
  waitToVeirfy = [];
  // Store constants as variables (waiting to be verified in the beta network)
  variableSave = new Map();

  // Activate the current node and pass all the wme nodes to the JoinNode, thus activating the checking process of the beta network
  activate() {
    let groups = this.items.reduce((group, item) => {
      const key = item.fact_id;
      if (!group[key]) {
        group[key] = []
      }
      group[key].push(item);
      return group
    }, {})
    for (let id in groups) {
      for (let wme of groups[id]) {
        if (!this.children.right_activate(wme)) break;
      }
    }
    return this.children.children;
  }

  /**
   * add fact
   * @param {Number} fact_id The id of the added fact
   */
  addFact(fact_id) {
    if (!this.facts.has(fact_id)) this.items.push(...Fact.list.get(fact_id).wmes());
    this.facts.add(fact_id);
  }

  /**
   * delete fact
   * @param {Number} fact_id The id of the deleted fact
   */
  deleteFact(fact_id) {
    if (this.facts.has(fact_id)) this.facts.delete(fact_id)
    this.items = this.items.filter(item => item.fact_id != fact_id);
  }

  /**
   * Does the new fact meet the requirements to join the current AlphaMemory
   * @param {Number} fact_id Newfact's id
   * @returns Does it meet the requirements
   */
  hasFact(fact_id) {
    if (this.facts.size == 0) return true
    return this.facts.has(fact_id);
  }
}