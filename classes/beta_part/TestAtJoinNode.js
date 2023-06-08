/**
 * Each TestAtJoinNode represents a test
 * Suppose there is a token that holds a wme1, which satisfies "condition" c1; then there is a wme2 that satisfies "condition" c2
 * We want to determine whether the new token formed by wme1 and wme2 can satisfy the union condition "c1 AND c2", so we need to determine whether there are variables with the same name in c1 and c2
 * If so, determine whether "the variable in c1 corresponds to the constant in wme1" is the same as "the variable in c2 corresponds to the constant in wme2" (this is also known as the test for "consistency of variable and constant binding")
 * Each TestAtJoinNode represents a test of a variable with the same name
 * How to do it: Assume that the variable x exists in both c1 and c2, then TestAtJoinNode records the domain in which x is located in c1 and the domain in which x is located in c2
 * When you want to test wme1 and wme2, just pull the constants on their corresponding fields from wme1 and wme2 respectively according to the records in TestAtJoinNode, and check if they are the same
 */

module.exports = class TestAtJoinNode {
  // The domain in which the "variable with the same name" checked by the current node is located in the newly added "condition"
  field_of_arg1 = null;
  // The attribute records the index value of the condition to be checked in the token
  viariableName = null;
  // arg1和arg2之间的关系
  operate = null;
  // The "variable with the same name" checked by the current node is already in the domain of the "condition" in the token
  field_of_arg2 = null;

  /**
   * TestAtJoinNode constructor
   * @param {String} viariableName Variable names in conditional chains
   * @param {String} field_of_arg1 Name of Variable 1
   * @param {String} operate Relationship between variable 1 and variable 2
   * @param {String} field_of_arg2 Name of Variable 2
   */
  constructor(viariableName, field_of_arg1, operate, field_of_arg2) {
    this.viariableName = viariableName || null;
    this.field_of_arg1 = field_of_arg1 || null;
    this.operate = operate || null;
    this.field_of_arg2 = field_of_arg2 || null;
  }

  /**
   * Verify that variables 1 and 2 meet the current test requirements
   * @param {Any} arg1 variables 1
   * @param {Any} arg2 variables 2
   * @returns Does it meet
   */
  activate(arg1, arg2) {
    switch (this.operate) {
      case "=":
        return arg1 == arg2;
      case ">=":
        return arg1 >= arg2;
      case ">":
        return arg1 > arg2;
      case "<=":
        return arg1 <= arg2
      case "<":
        return arg1 < arg2;
      default:
        return false;
    }
  }
}