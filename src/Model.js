import pluralize from 'pluralize';

function firstLetterLowerCase(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export default class Model {
  constructor() {
  }

  env() {
    return this.constructor.env;
  }

  static getById(id) {
    let modelObject = {};
    const modelPluralizedName = pluralize(firstLetterLowerCase(this.name));
    const modelObjects = this.env.db.objects[modelPluralizedName];
    if (modelObjects) {
      const object = modelObjects[id];
      if (object) {
        modelObject = new this.env[this.name](object);
      } else {
        throw new Error('Object of class "' + modelPluralizedName + '" with id ' + id + ' was not found');
      }
    } else {
      throw new Error('Maybe you forgot to send the corresponding "' + modelPluralizedName + '" object in your objects hash on your Environment initialization');
    }
    return modelObject;
  }

  static getClassPluralizedName() {
    return pluralize(firstLetterLowerCase(this.name));
  }

  static getClassObjects() {
    return this.env.db.objects[this.getClassPluralizedName()];
  }

  static getThisClass() {
    return this.env[this.name];
  }

  static findBy(prop, value) {
    let classObjects = this.getClassObjects();
    let ThisClass = this.getThisClass();

    for (let objectId in classObjects) {
      let object = classObjects[objectId];
      if (object[prop] === value) {
        return new ThisClass(object);
      }
    }
  }

  static all() {
    const db = this.env.db;
    const ThisClass = this.getThisClass();
    const objects = {};
    const classObjects = this.getClassObjects();

    Object.keys(classObjects).forEach((causeId) => {
      const objectData = classObjects[causeId];
      objects[causeId] = new ThisClass(objectData);
    });
    return objects;
  }

  static findAllBy(prop, value) {
    const classObjects = this.getClassObjects();
    const ThisClass = this.getThisClass();
    const objects = [];
    for (const objectId in classObjects) {
      const object = classObjects[objectId];
      if (object[prop] === value) {
        objects.push(new ThisClass(object));
      }
    }
    return objects;
  }
}
