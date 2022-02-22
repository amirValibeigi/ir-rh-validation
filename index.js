/**
 * @template O
 * @typedef Rule
 * @property {String} name
 * @property {Array<OperatorValidation<O>>} matches
 * @returns {Boolean}
 */

import MessageHandler from "./MessageHandler";

/**
 * validation object
 * @template T
 */
export default class Validation {
  #error = null;
  /**
   * @type {MessageHandler}
   */
  #messageHandler = null;

  /**
   * validation object
   *
   * @param {'en'|String} lan
   * @param {object} messages
   * @param {object} messages.validations
   * @param {object} messages.attributes
   */
  constructor(lan = "en", messages = undefined) {
    this.#messageHandler = new MessageHandler(lan, messages);
  }

  /**
   * @param {T} obj
   * @param {Array<Rule<T>|String>} rules
   *
   * @example
   * validate({email: "amir@example.com"}, [{ name: "email", matches: [Operators.isEmail(), Operators.maxLength(16)] },])
   * //return true
   *
   * @example
   * validate({email: "amir@example.com"}, ["email:isEmail,maxLength 16"])
   * //return true
   *
   * @returns {boolean}
   */
  validate = (obj, rules) => {
    try {
      let tmpRules = [];

      this.#error = undefined;

      try {
        tmpRules = this.#makeRules(rules);
      } catch (error) {
        this.#error = {
          message: "error make rules",
          error,
        };
        return false;
      }

      for (const rule of tmpRules) {
        let lastMatch = 0;
        let tmpObject = undefined;
        const len = rule.matches.length;

        try {
          tmpObject = this.#getPropertyOfObject(obj, rule.name);
        } catch (error) {
          const ov = rule.matches[lastMatch];

          this.#error = {
            nameProperty: rule.name,
            nameFun: ov.name,
            attributes: ov.attributes,
            index: lastMatch,
            message: "error find property",
            error,
          };
          return false;
        }

        for (; lastMatch < len; lastMatch++) {
          if (
            this.#checkProperties(rule.matches[lastMatch], tmpObject) === false
          )
            break;
        }

        if (lastMatch < len) {
          const ov = rule.matches[lastMatch];

          this.#error = {
            nameProperty: rule.name,
            nameFun: ov.name,
            attributes: ov.attributes,
            index: lastMatch,
            message: "not matches",
          };

          return false;
        }
      }

      return true;
    } catch (error) {
      this.#error = error;
      return false;
    }
  };

  /**
   * @param {T} obj
   * @param {Array<Rule<T>|String>} rules
   *
   * @example
   * validate({email: "amir@example.com"}, [{ name: "email", matches: [Operators.isEmail(), Operators.maxLength(16)] },])
   * //return true
   *
   * @example
   * validate({email: "amir@example.com"}, ["email:isEmail,maxLength 16"])
   * //return true
   *
   * @returns {Promise<void>}
   */
  validatePromise = (obj, rules) =>
    new Promise((resolve, reject) => {
      if (this.validate(obj, rules)) {
        resolve();
        return;
      }

      reject(this.getMessageError());
    });

  /**
   * @param {String|Array<Rule<T>>} [arg]
   * @returns {Promise<void>}
   */
  validateClass = (arg = "rules") =>
    this.validate(this, typeof arg === "string" ? this[arg] : arg);

  /**
   * get property of object
   * @private
   * @param {Object} obj
   * @param {String|Array<String>} name
   * @returns {{obj:Object,type:('object'|'array'),name:Array<String>}}
   */
  #getPropertyOfObject = (obj, name) => {
    if (
      typeof name === "string" &&
      (name.match(/\w*(\.|\*){1}\w*/g)?.length ?? 0) == 0
    )
      return { obj: obj[name], type: "object" };

    const names =
      typeof name === "string"
        ? name.split(".")
        : typeof name === "number"
        ? [name]
        : name;
    const key = names[0];
    const nextNames = names.length > 1 ? names.slice(1, names.length) : [key];

    if (key !== "*")
      return {
        obj: obj[key],
        type: names.length > 1 ? "array" : "object",
        name: nextNames,
      };

    return { obj: obj, type: "array", name: nextNames };
  };

  /**
   * @template O
   * @param {OperatorValidation<O>} match
   * @param {{obj:Object,type:('object'|'array'),name:Array<String>}} property
   * @param {Object} prevObj
   */
  #checkProperties = (match, property, prevObj) => {
    if (property === undefined) return false;

    if (property.type === "object")
      return match.callback.call(this, property.obj, prevObj);

    /**
     * @type {Array}
     */
    const arr = property.obj,
      names = property.name,
      name = names[0];

    const isFull = name === "*",
      isNumber = isFinite(name);

    if (!isNumber && !isFull)
      return this.#checkProperties(
        match,
        this.#getPropertyOfObject(arr, names),
        prevObj
      );

    let index = isFull ? 0 : name,
      len = isFull ? arr.length : Number(name) + 1,
      tPreObj = prevObj,
      tPreResult = false;

    for (; index < len; index++) {
      const obj = this.#getPropertyOfObject(
        arr,
        isFull ? [index, ...names.slice(1, names.length)] : names
      );
      tPreResult = this.#checkProperties(match, obj, tPreObj);

      tPreObj = obj.obj;

      if (tPreResult === false) return false;
    }

    return isFull ? arr.length <= index : true;
  };

  /**
   * @param {Array<Rule<T>|String>} rules
   * @returns {Array<Rule<T>>}
   */
  #makeRules = (rules) => {
    const tmpRules = [];
    for (let iRule = 0; iRule < rules.length; iRule++) {
      if (typeof rules[iRule] === "string") {
        const propertiesAndMethod = rules[iRule].split(":");
        const rule = { name: propertiesAndMethod[0], matches: [] };
        const methods = propertiesAndMethod[1].split(",");

        for (const method of methods) {
          const nameAndArgs = method.split(" ");

          rule.matches.push(
            require("./OperatorValidation")[nameAndArgs[0]].call(
              this,
              ...nameAndArgs.slice(1)
            )
          );
        }

        tmpRules.push(rule);

        continue;
      }
      tmpRules.push(rules[iRule]);
    }

    return tmpRules;
  };

  getError = () => {
    return this.#error;
  };

  getMessageError = () => {
    if (this.#error == undefined) return undefined;

    if (this.#error?.message) {
      try {
        return this.#messageHandler.getMessage(
          this.#error.nameFun,
          this.#error.nameProperty,
          this.#error.attributes
        );
      } catch (error) {
        return this.#messageHandler.getMessage("validation.KeyException");
      }
    }

    return this.#messageHandler.getMessage("validation.Exception");
  };
}

/**
 * @template O
 */
export class OperatorValidation {
  /**
   * @type {(obj:O)=>Boolean}
   */
  callback;

  /**
   * @type {String}
   */
  name;

  /**
   * @type {object}
   */
  attributes;

  /**
   * @param {(obj:O,preObj:O=undefined)=>Boolean} callback
   * @param {String} name
   * @param {object} attributes
   */
  constructor(callback, name, attributes = undefined) {
    this.callback = callback;
    this.name = name;
    this.attributes = attributes;
  }
}
