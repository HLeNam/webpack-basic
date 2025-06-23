import "core-js/modules/es.object.values";
import "core-js/modules/es.promise";

import sum from "./utils";

import "./styles/style.css";

import "./styles/style.scss";

const result = sum(1, 2);
console.log(result);

// ES6 Spread Operator
const person = { name: "Duoc" };
const personClone = { ...person };
console.log("personClone", personClone);

// ES7 Object.values
console.log("Object.values", Object.values(personClone));
