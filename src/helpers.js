export function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

export function firstLetterLowerCase(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}