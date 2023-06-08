/**
 * Action after passing the production test
 * The current version of this board does not work
 */

module.exports = class Action {
  str = "";
  constructor(str) {
    this.str = str;
  }
  do() {
    console.log(this.str);
  }
}
