import { OperatorValidation } from "./index";

/**
 * check object is Number
 * @returns {OperatorValidation<Object>}
 */
export const isNumber = () => {
  return new OperatorValidation((obj) => {
    return typeof obj === "number";
  });
};

/**
 * check object is String
 * @returns {OperatorValidation<Object>}
 */
export const isString = () => {
  return new OperatorValidation((obj) => {
    return typeof obj === "string";
  });
};

/**
 * check object is Boolean
 * @returns {OperatorValidation<Object>}
 */
export const isBoolean = () => {
  return new OperatorValidation((obj) => {
    return typeof obj === "boolean";
  });
};

/**
 * check object is Function
 * @returns {OperatorValidation<Object>}
 */
export const isFun = () => {
  return new OperatorValidation((obj) => {
    return typeof obj === "function";
  });
};

/**
 * check object is Array
 * @returns {OperatorValidation<Object>}
 */
export const isArray = () => {
  return new OperatorValidation((obj) => {
    return obj instanceof Array;
  });
};

/**
 * check empty String or Array
 * @returns {OperatorValidation<Object>}
 */
export const empty = () => {
  return new OperatorValidation((obj) => {
    if (obj instanceof Array || typeof obj === "string") return obj.length == 0;

    return false;
  });
};

/**
 * check not empty String or Array
 * @returns {OperatorValidation<Array|String>}
 */
export const notEmpty = () => {
  return new OperatorValidation((obj) => {
    return obj.length != 0;
  });
};

/**
 * check exist object
 * @returns {OperatorValidation<Object>}
 */
export const exist = () => {
  return new OperatorValidation((obj) => {
    return !(obj == undefined || obj == null);
  });
};

/**
 * check not exist object
 * @returns {OperatorValidation<Object>}
 */
export const notExist = () => {
  return new OperatorValidation((obj) => {
    return obj == undefined || obj == null;
  });
};

/**
 * check regex on String
 * @param {string | RegExp} regex
 * @returns {OperatorValidation<String>}
 */
export const regex = (regex) => {
  return new OperatorValidation((obj) => {
    return (obj.match(regex)?.length ?? 0) > 0;
  });
};

/**
 * check has object in values
 * @template T
 * @param {...T} values
 * @returns {OperatorValidation<Array<T>|String|Number>}
 */
export const hasIn = (...values) => {
  return new OperatorValidation((obj) => {
    if (typeof obj === "string" || typeof obj === "number") {
      return values.includes(obj);
    }

    if (obj instanceof Array) {
      for (const v of values) {
        if (obj.includes(v)) {
          return true;
        }
      }
    }

    return false;
  });
};

/**
 * check has not object in values
 * @template T
 * @param {...T} values
 * @returns {OperatorValidation<Array<T>|String|Number>}
 */
export const hasNotIn = (...values) => {
  return new OperatorValidation((obj) => {
    if (typeof obj === "string" || typeof obj === "number") {
      return !values.includes(obj);
    }

    if (obj instanceof Array) {
      for (const v of values) {
        if (obj.includes(v)) {
          return false;
        }
      }
      return true;
    }

    return false;
  });
};

/**
 * check object is date
 * @returns {OperatorValidation<String>}
 */
export const isDate = () => {
  return new OperatorValidation((obj) => {
    const d = new Date(isFinite(obj) ? Number(obj) : obj);

    return !(d == undefined || d == null || d == "Invalid Date");
  });
};

/**
 * check date has between two date
 * @param {String|Number|Date} startDate
 * @param {String|Number|Date} endDate
 * @returns {OperatorValidation<String>}
 */
export const rangeDate = (startDate, endDate) => {
  return new OperatorValidation((obj) => {
    return betweenDate(isFinite(obj) ? Number(obj) : obj, startDate, endDate);
  });
};

/**
 * check date has today
 * @returns {OperatorValidation<String>}
 */
export const isTody = () => {
  return new OperatorValidation((obj) => {
    return equalDate(new Date(), isFinite(obj) ? Number(obj) : obj);
  });
};

/**
 * check string is email or not
 * @returns {OperatorValidation<String>}
 */
export const isEmail = () => {
  return new OperatorValidation((obj) => {
    return (
      (obj.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )?.length ?? 0) >= 1
    );
  });
};

/**
 * check object is json
 * @returns {OperatorValidation<String>}
 */
export const isJson = () => {
  return new OperatorValidation((obj) => {
    try {
      JSON.parse(obj);
      return true;
    } catch (error) {}

    return false;
  });
};

/**
 * check min length of string or array
 * @param {Number} length
 * @returns {OperatorValidation<Array|String>}
 */
export const minLength = (length) => {
  return new OperatorValidation((obj) => {
    if (typeof obj === "number") return String(obj).length >= length;

    return obj.length >= length;
  });
};

/**
 * check max length of string or array
 * @param {Number} length
 * @returns {OperatorValidation<Array|String>}
 */
export const maxLength = (length) => {
  return new OperatorValidation((obj) => {
    if (typeof obj === "number") return String(obj).length <= length;

    return obj.length <= length;
  });
};

/**
 * check number in range
 * @param {Number} start
 * @param {Number} end
 * @returns {OperatorValidation<Number>}
 */
export const rangeNum = (start, end) => {
  return new OperatorValidation((obj) => {
    return obj >= start && obj <= end;
  });
};

/**
 * equal two date
 * @param {String|Number|Date} oneDate
 * @param {String|Number|Date} twoDate
 * @returns
 */
const equalDate = (oneDate, twoDate) => {
  var one = new Date(oneDate);
  var two = new Date(twoDate);

  return (
    one.getFullYear() == two.getFullYear() &&
    one.getMonth() == two.getMonth() &&
    one.getDate() == two.getDate()
  );
};

/**
 * date has between two date
 * @param {String|Number|Date} date
 * @param {String|Number|Date} startDate
 * @param {String|Number|Date} endDate
 * @returns
 */
const betweenDate = (date, startDate, endDate) => {
  var tmpDate = new Date(date);
  var tmpStartDate = new Date(startDate);
  var tmpEndDate = new Date(endDate);

  return (
    //year
    tmpDate.getFullYear() >= tmpStartDate.getFullYear() &&
    tmpDate.getFullYear() <= tmpEndDate.getFullYear() &&
    //month
    tmpDate.getMonth() >= tmpStartDate.getMonth() &&
    tmpDate.getMonth() <= tmpEndDate.getMonth() &&
    //day
    tmpDate.getDate() >= tmpStartDate.getDate() &&
    tmpDate.getDate() <= tmpEndDate.getDate()
  );
};
