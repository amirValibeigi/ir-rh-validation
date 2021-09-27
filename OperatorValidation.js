import { OperatorValidation } from "./index";

/**
 * check that the object is a Number
 * @returns {OperatorValidation<Object>}
 */
const isNumber = () => {
  return new OperatorValidation((obj) => {
    return typeof obj === "number";
  });
};

/**
 * check that the object is a String
 * @returns {OperatorValidation<Object>}
 */
const isString = () => {
  return new OperatorValidation((obj) => {
    return typeof obj === "string";
  });
};

/**
 * check that the object is a Boolean
 * @returns {OperatorValidation<Object>}
 */
const isBoolean = () => {
  return new OperatorValidation((obj) => {
    return typeof obj === "boolean";
  });
};

/**
 * check that the object is a Function
 * @returns {OperatorValidation<Object>}
 */
const isFun = () => {
  return new OperatorValidation((obj) => {
    return typeof obj === "function";
  });
};

/**
 * check that the object is a Array
 * @returns {OperatorValidation<Object>}
 */
const isArray = () => {
  return new OperatorValidation((obj) => {
    return obj instanceof Array;
  });
};

/**
 * check that the string or array is not empty
 * @returns {OperatorValidation<Object>}
 */
const empty = () => {
  return new OperatorValidation((obj) => {
    if (obj instanceof Array || typeof obj === "string") return obj.length == 0;

    return false;
  });
};

/**
 * check that the string or array is empty
 * @returns {OperatorValidation<Array|String>}
 */
const notEmpty = () => {
  return new OperatorValidation((obj) => {
    return obj.length != 0;
  });
};

/**
 * check that the object is exist
 * @returns {OperatorValidation<Object>}
 */
const exist = () => {
  return new OperatorValidation((obj) => {
    return !(obj == undefined || obj == null);
  });
};

/**
 * check that the object is not exist
 * @returns {OperatorValidation<Object>}
 */
const notExist = () => {
  return new OperatorValidation((obj) => {
    return obj == undefined || obj == null;
  });
};

/**
 * check regex on String
 * @param {string | RegExp} regexp - An object that supports being matched against.
 *
 * @example
 * //check that string is only number
 * //12345
 * regex(/^[0-9]*$/g);
 * //return true
 *
 * @returns {OperatorValidation<String>}
 */
const regex = (regexp) => {
  return new OperatorValidation((obj) => {
    return (obj.match(regexp)?.length ?? 0) > 0;
  });
};

/**
 * check that object in values is exist
 * @template T
 * @param {...T} values - array of object
 *
 * @example
 * //check that item of array is 1 or 2 or 3
 * //2
 * hasIn(1,2,3);
 * //return true
 *
 *
 * @example
 * //check the permission user of array is 'admin' or 'user'
 * //guest
 * hasIn('admin','user');
 * //return false
 *
 * @returns {OperatorValidation<Array<T>|String|Number>}
 */
const hasIn = (...values) => {
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
 * check that object in values is not exist
 * @template T
 * @param {...T} values - array of object
 *
 * @example
 * //check that item of array is not 1 or 2 or 3
 * //2
 * hasIn(1,2,3);
 * //return false
 *
 *
 * @example
 * //check the permission user of array is not 'admin' or 'user'
 * //guest
 * hasIn('admin','user');
 * //return true
 *
 * @returns {OperatorValidation<Array<T>|String|Number>}
 */
const hasNotIn = (...values) => {
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
 * check that object is date
 * @returns {OperatorValidation<String>}
 */
const isDate = () => {
  return new OperatorValidation((obj) => {
    const d = new Date(isFinite(obj) ? Number(obj) : obj);

    return !(d == undefined || d == null || d == "Invalid Date");
  });
};

/**
 * check that date has between two date
 * @param {String|Number|Date} startDate - from date
 * @param {String|Number|Date} endDate - to date
 *
 * @example
 * //check that date has between two timestamp
 * //1631667600000
 * rangeDate(1630458000000,1632963600000)
 * //return true
 *
 * @example
 * //check that date has between two date
 * //1631667600000
 * rangeDate('Wednesday, September 1, 2021 1:00:00 AM','Thursday, September 30, 2021 1:00:00 AM')
 *
 * @returns {OperatorValidation<String>}
 */
const rangeDate = (startDate, endDate) => {
  return new OperatorValidation((obj) => {
    return betweenDate(isFinite(obj) ? Number(obj) : obj, startDate, endDate);
  });
};

/**
 *check that date is today
 * @returns {OperatorValidation<String>}
 */
const isTody = () => {
  return new OperatorValidation((obj) => {
    return equalDate(new Date(), isFinite(obj) ? Number(obj) : obj);
  });
};

/**
 * check that String is email address
 * @returns {OperatorValidation<String>}
 */
const isEmail = () => {
  return new OperatorValidation((obj) => {
    return (
      (obj.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )?.length ?? 0) >= 1
    );
  });
};

/**
 * check that Object is  json
 * @returns {OperatorValidation<String|Object>}
 */
const isJson = () => {
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
 * @param {Number} length - length of string or array
 *
 * @example
 * //['a','b','c'] or 'abc'
 * minLength(2)
 * //return true
 *
 * @returns {OperatorValidation<Array|String>}
 */
const minLength = (length) => {
  return new OperatorValidation((obj) => {
    if (typeof obj === "number") return String(obj).length >= length;

    return obj.length >= length;
  });
};

/**
 * check max length of string or array
 * @param {Number} length - length of string or array
 *
 * @example
 * //['a','b','c'] or 'abc'
 * maxLength(3)
 * //return true
 *
 * @returns {OperatorValidation<Array|String>}
 */
const maxLength = (length) => {
  return new OperatorValidation((obj) => {
    if (typeof obj === "number") return String(obj).length <= length;

    return obj.length <= length;
  });
};

/**
 * check min number
 * @param {Number} min - min number
 *
 * @example
 * //5
 * minNum(2)
 * //return true
 *
 * @returns {OperatorValidation<Number>}
 */
const minNum = (min) => {
  return new OperatorValidation((obj) => {
    return obj >= min;
  });
};

/**
 * check max number
 * @param {Number} max - max number
 *
 * @example
 * //5
 * maxNum(5)
 * //return true
 *
 * @returns {OperatorValidation<Number>}
 */
const maxNum = (max) => {
  return new OperatorValidation((obj) => {
    return obj <= max;
  });
};

/**
 * check number in range
 * @param {Number} start
 * @param {Number} end
 *
 * @example
 * //5
 * rangeNum(4,6)
 * //return true
 *
 * @returns {OperatorValidation<Number>}
 */
const rangeNum = (start, end) => {
  return new OperatorValidation((obj) => {
    return obj >= start && obj <= end;
  });
};

/**
 * unique item in sorted array
 * @param {String} nameProperty - name property of object
 *
 * @example
 * //[1,2,3,4,5,6]
 * unique()
 * //return true
 *
 * @example
 * //[1,1,3,4,5,6]
 * unique()
 * //return false
 *
 * @example
 * //[{id:1},{id:2},{id:3}]
 * unique('id')
 * //return true
 *
 * @returns {OperatorValidation<Object>}
 */
const unique = (nameProperty = undefined) => {
  return new OperatorValidation((obj, preObj) => {
    if (nameProperty) {
      if (preObj === undefined) return true;

      return preObj[nameProperty] != (obj[nameProperty] ?? undefined);
    }

    return preObj !== obj;
  });
};

/**
 * two date is equal
 * @param {String|Number|Date} oneDate - date
 * @param {String|Number|Date} twoDate - date
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
 * check that date has between two date
 * @param {String|Number|Date} date - date
 * @param {String|Number|Date} startDate - from date
 * @param {String|Number|Date} endDate - to date
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

module.exports = {
  isNumber: isNumber,
  isString: isString,
  isBoolean: isBoolean,
  isFun: isFun,
  isArray: isArray,
  empty: empty,
  notEmpty: notEmpty,
  exist: exist,
  notExist: notExist,
  regex: regex,
  hasIn: hasIn,
  hasNotIn: hasNotIn,
  isDate: isDate,
  rangeDate: rangeDate,
  isTody: isTody,
  isEmail: isEmail,
  isJson: isJson,
  minLength: minLength,
  maxLength: maxLength,
  minNum: minNum,
  maxNum: maxNum,
  rangeNum: rangeNum,
  unique: unique,
};
