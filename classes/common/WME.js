/**
 * Working Memory Element (fact)
 * The smallest unit used to describe the state of the system, which is assumed to be a triplet, with three fields identifier, attribute, and value
 */

module.exports = class WME {
  identifier = null;
  attribute = null;
  value = null;
  // Record the id of fact
  fact_id = "";

  /**
   * WME constructor
   * @param {String} fact_id The current wme corresponds to the fact id
   * @param {String} identifier Current wme fact type
   * @param {String} attribute Factual properties of the current wme
   * @param {String} value Current wme's fact property value
   */
  constructor(fact_id, identifier = "", attribute = "", value = "") {
    this.fact_id = fact_id;
    this.identifier = identifier;
    this.attribute = attribute;
    this.value = value;
  }

  toString() {
    let str = `wme：identifier=${this.identifier}, attribute=${this.attribute}, value=${this.value}.`;
    return str;
  }
}