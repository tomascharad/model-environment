import pluralize from 'pluralize';

export default function Environment(db, Models) {
  this.db = db;
  const environment = this;

  for (const modelName in Models) {
    const Model = Models[modelName];

    this[modelName] = Object.assign(Model, {env: this});
  }

  this.parseDB = function() {
    const modelObjects = {};
    const modelObjectsDict = {};
    const objects = db.objects;

    for (const modelName in Models) {
      const pluralizedModelName = pluralize(modelName.toLowerCase());

      modelObjects[pluralizedModelName] = {};
      modelObjectsDict[pluralizedModelName] = modelName;
    }

    Object.keys(objects).forEach(function(classKey) {
      const rows = objects[classKey];

      Object.keys(rows).forEach(function(idKey) {
        modelObjects[classKey][idKey] = new environment[modelObjectsDict[classKey]](objects[classKey][idKey]);
      });
    });
    return {
      objects: modelObjects
    };
  };
}
