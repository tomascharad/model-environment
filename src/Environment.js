import pluralize from 'pluralize';

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function firstLetterLowerCase(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export default function Environment(db, Models) {
  this.db = db;
  const environment = this;

  for (const modelName in Models) {
    const Model = Models[modelName];

    this[modelName] = Object.assign(Model, { env: this });
  }

  this.parseDB = function () {
    const modelObjects = {};
    const modelObjectsDict = {};
    const objects = db.objects;

    for (const modelName in Models) {
      const pluralizedModelName = pluralize(firstLetterLowerCase(modelName));

      modelObjects[pluralizedModelName] = {};
      modelObjectsDict[pluralizedModelName] = modelName;
    }

    Object.keys(objects).forEach(function (classKey) {
      const rows = objects[classKey];

      Object.keys(rows).forEach(function (idKey) {
        if (isFunction(environment[modelObjectsDict[classKey]])) {
          modelObjects[classKey][idKey] = new environment[modelObjectsDict[classKey]](objects[classKey][idKey]);
        } else {
          console.log('Remember to add ' + classKey + ' To you models');
        }
      });
    });
    return {
      objects: modelObjects,
    };
  };
}
