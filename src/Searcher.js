import pluralize from 'pluralize';
import { firstLetterLowerCase } from './helpers';

export default class Searcher {
  constructor(db, name, Model, environment) {
    this.db = db;
    this.name = name;
    this.Model = Model;
    this.environment = environment;
  }
  getClassObjects() {
    return this.db.objects[this.getClassPluralizedName()];
  }

  getClassPluralizedName() {
    return pluralize(firstLetterLowerCase(this.name));
  }

  findBy(prop, value) {
    let classObjects = this.getClassObjects();
    let foundObject = null;

    for (let objectId in classObjects) {
      let object = classObjects[objectId];
      if (object[prop] === value && !foundObject) {
        foundObject = this.createModelInstance(object);
      }
    }
    return foundObject;
  }

  getById(id) {
    let modelObject = {};
    const modelPluralizedName = this.getClassPluralizedName();
    const modelObjects = this.db.objects[modelPluralizedName];
    if (modelObjects) {
      const object = modelObjects[id];
      if (object) {
        modelObject = this.createModelInstance(object);
      } else {
        throw new Error('Object of class "' + modelPluralizedName + '" with id ' + id + ' was not found');
      }
    } else {
      throw new Error('Maybe you forgot to send the corresponding "' + modelPluralizedName + '" object in your objects hash on your Environment initialization');
    }
    return modelObject;
  }

  all() {
    const objects = [];
    const classObjects = this.getClassObjects();

    Object.keys(classObjects).forEach((id) => {
      const objectData = classObjects[id];
      objects.push(this.createModelInstance(objectData));
    });
    return objects;
  }

  findAllBy(prop, value) {
    const classObjects = this.getClassObjects();
    const objects = [];
    for (const objectId in classObjects) {
      const object = classObjects[objectId];
      if (object[prop] === value) {
        objects.push(this.createModelInstance(object));
      }
    }
    return objects;
  }

  createModelInstance(data) {
    const object = new this.Model(data);
    object.env = () => this.environment;
    return object;
  }
}
