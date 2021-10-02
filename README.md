# ir-rh-validation

## **installation**

```npm
npm install ir-rh-validation
```

## **Usage**

### import class and operators

```javascript
import Validation from "ir-rh-validation";
import { isEmail } from "ir-rh-validation/OperatorValidation";

const validation = new Validation();
const user = {
  id: 1,
  name: "amir",
  email: "amir@example.com",
  code: "1234",
  created_at: "9/15/2021, 5:30:00 AM",
  colorSelect: ["red", "red", "green"],
  history: [
    { id: 1, site: "example.com", timeSecond: 100, urlClick: ["url1"] },
    { id: 2, site: "example1.com", timeSecond: 5000, urlClick: ["url2"] },
    { id: 3, site: "example2.com", timeSecond: 20000, urlClick: ["url3"] },
  ],
};

validation
  .validate(user, [
    {
      name: "email",
      matches: [isEmail()], //true
    },
  ])
  .then(
    () => {
      //true
    },
    (err) => {
      //false
    }
  );
```

## example

### regex

check regex on String

```javascript
import { regex } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "code",
    matches: [regex(/^[0-9]*$/g)], //true
  },
]);
```

### hasIn

check that object in values is exist

```javascript
import { hasIn } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "name",
    matches: [hasIn("amir", "ali")], //true
  },
]);
```

### hasNotIn

check that object in values is not exist

```javascript
import { hasNotIn } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "name",
    matches: [hasNotIn("amir", "ali")], //false
  },
]);
```

### rangeDate

check that date has between two date

```javascript
import { rangeDate } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "created_at",
    matches: [rangeDate(1630458000000, 1632963600000)], //true
  },
]);
```

### minLength

check min length of string or array

```javascript
import { minLength } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "email",
    matches: [minLength(5)], //true
  },
]);
```

### maxLength

check max length of string or array

```javascript
import { maxLength } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "email",
    matches: [maxLength(10)], //false
  },
]);
```

### minNum

check min number

```javascript
import { minNum } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "id",
    matches: [minNum(2)], //false
  },
]);
```

### maxNum

check max number

```javascript
import { maxNum } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "id",
    matches: [maxNum(2)], //true
  },
]);
```

### rangeNum

check number in range

```javascript
import { rangeNum } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "id",
    matches: [rangeNum(0, 1)], //true
  },
]);
```

### unique

unique item in sorted array

```javascript
import { unique } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "colorSelect.*",
    matches: [unique()], //false
  },
]);
```

### check property in array

```javascript
import { rangeNum, hasNotIn } from "ir-rh-validation/OperatorValidation";

validation.validate(user, [
  {
    name: "history.*.timeSecond",
    matches: [rangeNum(100, 100000)], //true
  },
  {
    name: "history.*.urlClick.*",
    matches: [hasNotIn("url4")], //true
  },
  {
    name: "history.*.site",
    matches: [hasNotIn("example2.com")], //false
  },
]); /// result false
```

## customize method

```javascript
import { OperatorValidation } from "ir-rh-validation";

/**
 *
 * @returns {OperatorValidation<Array<String>>}
 */
const hasColor = (color) =>
  new OperatorValidation((obj) => {
    return obj.includes(color);
  });

validation.validate(user, [
  {
    name: "colorSelect",
    matches: [hasColor("green")], //true
  },
]);
```

## usage on class

```javascript
import Validation from "ir-rh-validation";
import {
  isString,
  maxLength,
  minLength,
} from "ir-rh-validation/OperatorValidation";

export default class UserModel extends Validation {
  name = "amir";

  /**
   * @type {Array<import("ir-rh-validation").Rule<UserModel>>}
   */
  rules = [
    {
      name: "name",
      matches: [isString(), minLength(1)],
    },
  ];

  /**
   * @type {Array<import("ir-rh-validation").Rule<UserModel>>}
   */
  rules1 = [
    {
      name: "name",
      matches: [isString(), maxLength(3)],
    },
  ];
}
```

```javascript
import {
  exist,
  maxLength,
  minLength,
} from "ir-rh-validation/OperatorValidation";

const user = new UserModel();
user.validateClass(); //true

user.validateClass("rules1"); //false

user.validateClass([
  {
    name: "email",
    matches: [exist()], //false
  },
]);
```

## String Rules

```javascript
validation.validate(user, ["email:isEmail,maxLength 16"]); //true
```

## methods

- object (array, number, string, ...)

  - [minLength](#minlength)
  - [maxLength](#maxlength)
  - empty
  - notEmpty
  - isArray
  - isBoolean
  - isNumber
  - isString
  - isFun
  - exist
  - notExist
  - [hasIn](#hasin)
  - [hasNotIn](#hasNotin)
  - isJson
  - isDate
  - [rangeDate](#rangedate)
  - isTody

- number

  - [rangeNum](#rangenum)
  - [minNum](#minnum)
  - [maxNum](#maxnum)

- string

  - [regex](#regex)
  - isEmail

- array
  - [unique](#unique)
