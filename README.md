# JS_RETE



## Introduction

The purpose of js_rete is to implement a Rete engine in the local node.

The **Rete algorithm** is a [pattern matching](https://en.wikipedia.org/wiki/Pattern_matching) [algorithm](https://en.wikipedia.org/wiki/Algorithm) for implementing [rule-based systems](https://en.wikipedia.org/wiki/Rule-based_system). The algorithm was developed to efficiently apply many [rules](https://en.wikipedia.org/wiki/Rule_of_inference) or patterns to many objects, or [facts](https://en.wikipedia.org/wiki/Fact), in a [knowledge base](https://en.wikipedia.org/wiki/Knowledge_base). It is used to determine which of the system's rules should fire based on its data store, its facts. The Rete algorithm was designed by [Charles L. Forgy](https://en.wikipedia.org/wiki/Charles_Forgy) of [Carnegie Mellon University](https://en.wikipedia.org/wiki/Carnegie_Mellon_University), first published in a working paper in 1974, and later elaborated in his 1979 Ph.D. thesis and a 1982 paper.



## Basics

Reasoning about facts is done through a production, which consists of a string of conditions connected by AND and OR

### fact

A Fact represents a data object that describes a particular state or property. A Fact is typically represented as a data structure, and it can be a simple primitive data type (such as an integer or string) or a complex object. Each Fact consists of a set of attribute-value pairs that describe its characteristics.

During the process of rule-based inference, Facts are used as input in the Alpha network and as matching conditions in the Beta network. The Alpha network filters and tests Facts using Alpha nodes to determine which Facts are potentially matching with the rules. The Facts that meet the conditions are stored in the Alpha Memory for further inference.

In the Beta network, Facts are matched against the conditional patterns in the rules using Beta nodes. The Beta network establishes associations and reasoning among the Facts. When a match occurs between Facts and the conditions of a rule, the rule's execution is triggered.

In summary, Facts in the RETE algorithm represent data objects that describe states or properties. They play crucial roles in the Alpha network and Beta network by filtering, matching, and supporting reasoning processes.

**example**

```js
const exampleFact = new Fact({
    type: "A", // this attribute is required
    attr: "value"
})
```

### condition

A Condition is a logical expression or pattern that specifies the conditions for matching facts.

A condition contains a property-value test or constraint. These tests define the conditions that need to be satisfied in order to be matched against the facts. Conditions can include operations such as equality comparisons, range comparisons, logical operations, etc., for filtering facts that match the rule.

Conditions play a key role in the rule inference process; they help determine which facts are eligible for the rule and provide an efficient way to filter and match facts to support the rule application and inference process.

**example**

```js
const exampleCondition = new Condition({
    i: "identify", // this condition detects the fact that a specific type
    a: "attribute", // the properties detected by this condition
    o: "operation", // Relationship between attribute to be tested and required value
    v: "value" // required value
})
```

AND

```js
const exampleAndCondition = AND(
	new Condition({...}),
    AND(
    	new Condtion({...}),
    	...
	)
)
```

OR

```js
const exampleOrCondition = Or(
	new Condition({...}),
    Or(
    	new Condtion({...}),
    	...
	)
)
```

### production

A Production represents a rule that describes a particular inference rule or operation. It consists of a string of conditions (Condition) and an action (Action).

The Condition part defines the preconditions of the rule, i.e., the conditions that need to be satisfied in order to trigger the rule. The Condition can consist of one or more condition elements, each describing a set of attribute-value pairs or other logical expressions for matching facts.

The action part defines the result of the execution of the rule, i.e. the action that needs to be performed when the rule matches successfully. The action can be to modify the fact, to generate a new fact or to perform other specific actions.

When a fact is propagated in the RTE network, it is matched against a condition and if the condition of the rule is satisfied, the rule is triggered for execution and the corresponding action is executed. This can lead to generating new facts, modifying the properties of existing facts, or triggering other related reasoning processes.

Generative is used in the RETE algorithm to describe inference rules that help drive the inference engine for rule matching and execution. It provides a canonical way to express and manipulate inference rules, thus enabling a rule-based inference process.

**example**

```js
const exampleProduction = new Production([exampleCondition, exampleAndCondition, exampleOrCondition], new Action())
// Each condition in the condition array of production requires identify to be consistent
```

### RETE Network

A network is a structure composed of nodes and connections that supports the process of rule-based reasoning. The RETE network consists of two main components: the Alpha network and the Beta network.

The Alpha network is responsible for filtering and testing facts. It consists of a series of Alpha nodes, each representing a simple condition or test to filter facts. When facts propagate through the Alpha network, they are tested against the conditions of each Alpha node. If a fact satisfies a node's condition, it is passed to the next node or stored in the Alpha Memory for further inference.

The Beta network handles the relationships and logical operations between multiple facts. It consists of a series of Beta nodes, each representing a complex pattern or rule that involves multiple facts and conditions. The Beta nodes are connected to form a directed acyclic graph (DAG) that represents the relationships and inference logic among the facts. When facts propagate through the Beta network, they are matched against the conditions of the rules. If a rule's conditions are satisfied by the facts, the rule is triggered for execution.

The nodes and connections in the network form the basic structure of a rule-based reasoning engine, responsible for handling the propagation, matching, and inference of facts. Nodes can be simple condition tests (Alpha nodes) or complex pattern matchers (Beta nodes), while connections are used to establish data flow and reasoning paths between different nodes.

By combining and connecting Alpha nodes and Beta nodes, the RETE network efficiently performs rule matching and inference, enabling the functionality of a rule-based reasoning engine. It provides a flexible and scalable structure to handle various complex rules and reasoning requirements.

**example**

```js
const exampleNetwork = new Network();
exampleNetwork.addFact(...);
exampleNetwork.addProduction(...);
exampleNetwork.run();
```



## DEMO

Execute `node . /main.js` to run the project demo

**the facts of this demo**

![image-20230608145809967](https://s2.loli.net/2023/06/08/g1QsW7ScIGRhAKN.png)

**the productions of this demo**

<img src="https://s2.loli.net/2023/06/08/5ZahzL28kxqdycI.png" alt="image-20230608150406363" style="zoom:50%;" />

**result**

![image-20230608150946711](https://s2.loli.net/2023/06/08/sWJRp2jIq8xAVLF.png)