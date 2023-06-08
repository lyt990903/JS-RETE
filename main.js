const Action = require("./classes/common/Action");
const { Condition, AND, OR } = require("./classes/common/Condition");
const Fact = require("./classes/common/Fact");
const Production = require("./classes/common/Production");

const Network = require("./classes/Network");

// ------------------------------------------------- Create rete network ------------------------------------------------- //
const net = new Network();

// ------------------------------------------------- Initialize facts ------------------------------------------------- //
const f1 = new Fact({ type: "A", a1: 1, a2: 100, a3: 100 });
net.addFact(f1);
const f2 = new Fact({ type: "A", a1: 2, a2: 100, a3: 100 });
net.addFact(f2);
const f3 = new Fact({ type: "B", b1: 2, b2: 10, b3: 100 });
net.addFact(f3);
const f4 = new Fact({ type: "B", b1: 2, b2: 11, b3: 100 });
net.addFact(f4);
const f5 = new Fact({ type: "B", b1: 2, b2: 11, b3: 200 });
net.addFact(f5);
const f6 = new Fact({ type: "C", c1: 10 });
net.addFact(f6);
const f7 = new Fact({ type: "D", d1: 300, d2: 11 });
net.addFact(f7);
const f8 = new Fact({ type: "E", e1: 200 });
net.addFact(f8);

// ------------------------------------------------- Definition Rules ------------------------------------------------- //
const condition1_1 = AND(
  AND(
    OR(
      new Condition({ i: "A", a: "a1", o: "<", v: 2 }),
      new Condition({ i: "A", a: "a1", o: "=", v: 1 })
    ),
    new Condition({ i: "A", a: "a2", o: "=", v: 100 })
  ),
  new Condition({ i: "A", a: "a3", o: "save", v: '$x' })
);
const condition1_2 = AND(
  AND(
    new Condition({ i: "B", a: "b1", o: "=", v: 2 }),
    new Condition({ i: "B", a: "b2", o: "save", v: "$y" })
  ),
  new Condition({ i: "B", a: "b3", o: "=", v: "$x" })
)
const condition1_3 = new Condition({ i: "C", a: "c1", o: "=", v: "$y" })
/**
 * rule "rule_1"
 * when
 *  A(a1==1 || a1<2, a2==100, $x: a3)
 *  B(b1==2, $y: b2, b3==$x)
 *  C(c1==$y)
 * then
 *  some action
 */
const production1 = new Production([condition1_1, condition1_2, condition1_3], new Action("production1"));

const condition2_1 = AND(new Condition({ i: "B", a: "b1", o: "=", v: 2 }), new Condition({ i: "B", a: "b2", o: "save", v: "$y" }))
const condition2_2 = AND(new Condition({ i: "D", a: "d1", o: "=", v: 300 }), new Condition({ i: "D", a: "d2", o: "=", v: "$y" }))
/**
 * rule "rule_2"
 * when
 *  B(b1==2, $y: b2)
 *  D(d1==300, d2==$y)
 * then
 *  some action
 */
const production2 = new Production([condition2_1, condition2_2], new Action("production2"));

const condition3_1 = AND(
  AND(
    new Condition({ i: "B", a: "b1", o: "=", v: 2 }),
    new Condition({ i: "B", a: "b2", o: "save", v: "$y" })
  ),
  new Condition({ i: "B", a: "b3", o: "save", v: "$z" })
)
const condition3_2 = AND(
  new Condition({ i: "D", a: "d1", o: "=", v: 300 }),
  new Condition({ i: "D", a: "d2", o: "=", v: "$y" })
)
const Condition3_3 = new Condition({ i: "E", a: "e1", o: "=", v: "$z" })
/**
 * rule "rule_3"
 * when
 *  B(b1==2, $y: b2, $z: b3)
 *  D(d1==300, d2==$y)
 *  E(e1==$z)
 * then
 *  some action
 */
const production3 = new Production([condition3_1, condition3_2, Condition3_3], new Action("production3"))

net.addProduction(production1);
net.addProduction(production2);
net.addProduction(production3);
net.run();