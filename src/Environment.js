import pluralize from 'pluralize';
import Searcher from './Searcher';
import {firstLetterLowerCase, isFunction} from './helpers';

export default function Environment(db, _Models) {
  const Models = _Models;
  const environment = {};

  for (const modelName in Models) {
    const Model = Models[modelName];
    environment[modelName] = new Searcher(db, modelName, Model, environment);
  }

  this.parseDB = function() {
    // TCT: TODO paseDB should return a searcher, which expose Models with its finder methods in order to find particular instances, parseing the whole DB is not efficient as other objects not used in the entry point won't be used
    const modelObjects = {};
    const modelObjectsDict = {};
    const objects = db.objects;

    for (const modelName in Models) {
      // TCT: See if we can inject the model name here, as it is an object key, minification doesn't mangle the name
      // Models[modelName].modelEnviornmentName = () => modelName;
      const pluralizedModelName = pluralize(firstLetterLowerCase(modelName));

      modelObjects[pluralizedModelName] = {};
      modelObjectsDict[pluralizedModelName] = modelName;
    }

    Object.keys(objects).forEach((classKey) => {
      const rows = objects[classKey];

      Object.keys(rows).forEach((idKey) => {
        if (Models[modelObjectsDict[classKey]]) {
          modelObjects[classKey][idKey] = new Models[modelObjectsDict[classKey]](objects[classKey][idKey]);
          modelObjects[classKey][idKey].env = () => environment;
        } else {
          console.log('Remember to add ' + classKey + ' To your models');
        }
      });
    });
    return {
      objects: modelObjects
    };
  };
}
