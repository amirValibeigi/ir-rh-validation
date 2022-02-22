let validationMessages = {
  en: require("./locales/messages.en.json"),
  fa: require("./locales/messages.fa.json"),
};

/**
 * Simple object check.
 * @param item
 * @returns {Boolean}
 */
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export default class MessageHandler {
  #lan = "en";

  /**
   * validation object
   *
   * @param {'en'|String} lan
   * @param {object} messages
   * @param {object} messages.validations
   * @param {object} messages.attributes
   */
  constructor(lan = "en", messages = undefined) {
    this.#lan = lan;

    if (messages)
      validationMessages[lan] = mergeDeep(validationMessages[lan], messages);
  }

  /**
   * @private
   * @param {object} obj
   * @param {String} key
   *
   * @returns {String}
   */
  getValue(obj, key) {
    try {
      const keys = key.split(".");
      let tmp = obj;

      for (const k of keys) {
        tmp = tmp[k];
      }

      return tmp;
    } catch (error) {
      return key;
    }
  }

  getValidationValue(key) {
    let message = undefined;

    if (
      (message = this.getValue(
        validationMessages[this.#lan]?.validations,
        key
      )) === key
    ) {
      return this.getValue(validationMessages["en"]?.validations, key);
    }

    return message;
  }

  /**
   * @private
   * @param {String} message
   *
   * @returns {String}
   */
  getAttribute(message, nameProperty, attributes) {
    const keys = message.match(/:[a-zAZ_]+/g);
    if (keys)
      for (const key of keys) {
        let tmp = null;
        const tKey = key.substring(1);

        if (tKey == "attribute") {
          if (
            (tmp = this.getValue(
              validationMessages[this.#lan]?.attributes,
              nameProperty
            )) !== undefined
          ) {
            message = message.replace(key, tmp);

            continue;
          }

          message = message.replace(key, nameProperty);
        } else if ((tmp = attributes[tKey]) !== undefined) {
          message = message.replace(key, tmp);
        }
      }

    return message;
  }

  getMessage(key, nameProperty, attributes = undefined) {
    return this.getAttribute(
      this.getValidationValue(key),
      nameProperty,
      attributes
    );
  }
}
