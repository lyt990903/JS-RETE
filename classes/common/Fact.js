/**
 * A factual object, which is essentially an object
 * A fact object can get multiple wme
 */

const WME = require("./WME");

module.exports = class Fact {
  static list = new Map();

  /**
   * fact constructor
   * @param {Object} options Factual objects
   */
  constructor(options) {
    if (!options.type) throw new Error("fact must have type");
    if (!Fact.count) Fact.count = 1;
    else Fact.count++;
    this.id = Fact.count;
    Fact.list.set(this.id, this);
    this._options = options;
    for (let key in options) {
      this[key] = options[key];
    }
  }

  /**
   * Get all wme in fact
   * @returns List of wme in fact
   */
  wmes() {
    let type = this.type;
    let wmes = Object.keys(this._options).filter(key => key != "type").map(key => {
      return new WME(this.id, type, key, this._options[key]);
    })
    return wmes;
  }
}