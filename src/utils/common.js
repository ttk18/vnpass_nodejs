/**
 * Check if object is null or undefined
 * @param obj
 * @returns {boolean}
 */
const objectIsNull = (obj) => {
  return obj === undefined || obj === null;
};

/**
 * Check if object is empty
 * @param {Object} obj
 * @returns {boolean}
 */
function objectIsEmpty(obj) {
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

/**
 * Check if object is null or empty
 * @param obj
 * @returns {boolean}
 */
const objectIsNullOrEmpty = (obj) => {
  if (obj === undefined || obj === null) {
    return true;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
};

/**
 * Compare to string ignore case and difference locality.
 * @param str1
 * @param str2
 * @returns {boolean}
 */
const equalIgnoreCase = (str1, str2) => {
  if (objectIsNull(str1) || objectIsNull(str2)) {
    return false;
  }
  return str1.localeCompare(str2, undefined, { sensitivity: 'base' }) === 0;
};

module.exports = {
  objectIsNull,
  objectIsEmpty,
  objectIsNullOrEmpty,
  equalIgnoreCase,
};
