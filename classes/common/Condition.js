/**
 * The data type used to describe the "condition"
 * Assume that each wme is a triplet containing three fields: identitifier, attribute, value
 */

class Condition {
  identifier = ""
  attribute = ""
  operation = ""
  value = ""

  constructor(options) {
    this.identifier = options.i;
    this.attribute = options.a;
    this.operation = options.o;
    this.value = options.v;
  }

  toString() {
    return `In ${this.identifier},${this.attribute} must${this.operation}${this.value}`;
  }
}
exports.Condition = Condition;

/**
 * Chain table structure for storing conditional chains
 * @param {Array<ConditionaList> | Array<Condition>} val A unit in the chain table
 * @param {LinkNode} next Next in the chain table
 */
function LinkNode(val, next) {
  if (!(val instanceof Array)) val = [val];
  this.val = val;
  this.next = (next == undefined) ? null : this.next;
}

/**
 * Conditional chain after merging by AND, OR
 */
class ConditionaList {
  identifier = "";
  head = new LinkNode("head");
  cur = null;

  /**
   * An array consisting of <ConditionaList> or <Condition> is merged into a new ConditionaList
   * Mainly used to achieve OR function
   * @param {Array} conditions Both ends of the OR
   */
  constructor(conditions) {
    if (!(conditions instanceof Array)) conditions = [conditions];
    conditions.forEach(item => {
      if (!(item instanceof Condition) && !(item instanceof ConditionaList)) throw new Error("condition must be Condition");
    })
    let linkNode = new LinkNode(conditions);
    this.head.next = linkNode;
    this.cur = linkNode;
    this.identifier = conditions[0].identifier;
  }

  /**
   * Merge two ConditionaList
   * Mainly used to achieve AND function
   * @param {ConditionaList} conditionaList New condition chain
   * @returns this
   */
  concat(conditionaList) {
    if (!(conditionaList instanceof ConditionaList)) throw new Error("ConditionaList must concat with ConditionaList");
    this.cur.next = conditionaList.head.next;
    this.cur = conditionaList.cur;
    return this;
  }

  toString() {
    let str = "";
    let current = this.head.next;
    str += "( ";
    while (current.next) {
      str += `[${current.val.join(" OR ")}]`
      str += " AND "
      current = current.next;
    }
    str += `[${current.val.join(" OR ")}]`;
    str += " )";
    return str;
  }
}
exports.ConditionaList = ConditionaList;

/**
 * AND Function
 * @param {ConditionaList | Condition} conditionaList Conditional Chain
 * @param {ConditionaList | Condition} newCondition New condition chain
 * @returns New condition chain
 */
function AND(conditionaList, newCondition) {
  if (!(conditionaList instanceof ConditionaList) && (conditionaList instanceof Condition)) conditionaList = new ConditionaList(conditionaList);
  if (!(newCondition instanceof ConditionaList) && (newCondition instanceof Condition)) newCondition = new ConditionaList(newCondition);
  if (conditionaList.identifier != newCondition.identifier) throw new Error("The type of both sides of the AND needs to be the same!");
  return conditionaList.concat(newCondition);
}
exports.AND = AND;

/**
 * OR Function
 * @param {ConditionaList | Condition} conditionaList One of the condition chain of OR
 * @param {ConditionaList | Condition} newCondition Another condition chain of OR
 * @returns New condition chain
 */
function OR(conditionaList, newCondition) {
  if (!(conditionaList instanceof ConditionaList) && (conditionaList instanceof Condition)) conditionaList = new ConditionaList(conditionaList);
  if (!(newCondition instanceof ConditionaList) && (newCondition instanceof Condition)) newCondition = new ConditionaList(newCondition);
  if (conditionaList.identifier != newCondition.identifier) throw new Error("The type of both sides of the OR needs to be the same!");
  return new ConditionaList([conditionaList, newCondition]);
}
exports.OR = OR;