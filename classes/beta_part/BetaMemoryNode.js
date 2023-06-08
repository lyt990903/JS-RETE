/**
 * Each BetaMemoryNode represents the union of several different types of conditions
 * The contents stored in the BetaMemoryNode are all the tokens that satisfy these union conditions
 */

module.exports = class BetaMemoryNode {
  // Used to store the children of the current node, it is a JoinNode object
  children = null;
  // Used to store the parent node of the current node, this parent must be a JoinNode or null
  parent = null;
  // Store all tokens that satisfy the union condition represented by the current node, which is a list of tokens
  items = [];

  /**
   * Used to activate the current node and validate all tokens deposited into the current node's items
   */
  activate() {
    for (let token of this.items) {
      if (!this.children.left_activate(token)) {
        this.delete(token.fact_id);
      }
    }
  }

  /**
   * Delete all tokens belonging to the same fact
   * @param {Number} id id of the fact
   */
  delete(id) {
    this.items = this.items.filter(item => item.fact_id != id);
  }
}