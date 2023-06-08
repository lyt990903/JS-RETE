/**
 * Classification of all current wme(fact) according to type
 */
module.exports = class TypeNodes {
  items = {};

  /**
   * TypeNode constructor
   * @param {Array} wmes wme array
   */
  constructor(wmes) {
    for (let wme of wmes) {
      let { identifier } = wme;
      if (!this.items[identifier]) {
        this.items[identifier] = new Set();
      }
      this.items[identifier].add(wme);
    }
  }

  /**
   * Get a list of wme of a specific type
   * @param {String} type Type of Need
   * @returns All wme that match the type
   */
  get(type) {
    if (!this.items[type]) return [];
    return this.items[type];
  }
}