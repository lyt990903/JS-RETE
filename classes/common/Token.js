/**
 * Simple version of token
 * Corresponds to wme
 */

const WME = require("./WME");

module.exports = class Token {
  /**
   * Token constructor
   * @param {WME} wme and token corresponding to the wme
   */
  constructor(wme) {
    if (!(wme instanceof WME)) throw new Error("token must made by a wme");
    this.identifier = wme.identifier;
    this.attribute = wme.attribute;
    this.value = wme.value;
    this.fact_id = wme.fact_id;
  }
}