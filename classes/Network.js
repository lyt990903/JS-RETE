const TypeNodes = require("./alpha_part/TypeNodes");
const BetaMemoryNode = require("./beta_part/BetaMemoryNode");
const JoinNode = require("./beta_part/JoinNode");
const Fact = require("./common/Fact");

module.exports = class Network {
  // Work Memory Store all wme
  WM = new Set();
  // Production Memory Store all production
  PM = new Set();

  constructor() { }

  addFact(fact) {
    if (!(fact instanceof Fact)) throw new Error("this is not a fact instance");
    for (let wme of fact.wmes()) {
      this.addWme(wme);
    }
  }

  addWme(wme) {
    this.WM.add(wme);
  }

  addProduction(production) {
    this.PM.add(production)
  }

  run() {
    this.typesNodes = new TypeNodes(this.WM);
    for (let prod of this.PM) {
      let alpha_memory = this.alpha_net(prod);
      let endNode = this.beta_net(alpha_memory);
      // endNode = endNode.items.map(item => item.fact_id);
      prod.action.do();
      console.log(endNode.items)
    }
  }

  /**
   * alpha networks, alpha networks handle constraints on identical objects
   * @param {Production} production 
   */
  alpha_net(production) {
    let alpha_memory = [];
    for (let type of production.types.keys()) {
      let tree = production.types.get(type);
      let alphaMemory = tree.propagate(this.typesNodes.items[type]);
      alpha_memory.push(alphaMemory);
    }
    return alpha_memory;
  }

  /**
   * beta networks, beta networks handle constraints on different objects
   * @param {Array} alpha_memory All AlphaMemoryNodes under a certain production
   * @returns result
   */
  beta_net(alpha_memory) {
    let joinNode = new JoinNode();
    let betaMemoryNode = new BetaMemoryNode();
    let endNode;
    for (let alpha of alpha_memory) {
      joinNode.bindAlpha(alpha);
      joinNode.bindBeta(betaMemoryNode);
      betaMemoryNode.activate();
      endNode = alpha.activate();
    }
    return endNode;
  }
}