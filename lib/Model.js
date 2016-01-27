import pluralize from 'pluralize';

export default class Model {
  constructor() {
  }

  env() {
    return this.constructor.env;
  }

  static getById(id) {
    let modelObject = {};
    const modelPluralizedName = pluralize(this.name.toLowerCase());
    modelObject = new this.env[this.name](this.env.db.objects[modelPluralizedName][id]);
    return modelObject;
  }

  static getClassPluralizedName() {
    return pluralize(this.name.toLowerCase());
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
    let db = this.env.db;
    const ThisClass = this.getThisClass();
    const objects = {};
    const classObjects = this.getClassObjects();

    Object.keys(classObjects).forEach(function(causeId) {
      let objectData = classObjects[causeId];
      objects[causeId] = new ThisClass(objectData);
    });
    return objects;
  }

  // static findAllBy(prop, value, objects) {
  //   let participations = [];
  //   const participationObjects = Participation.env.db.objects.participations;

  //   for (const participationId in participationObjects) {
  //     const participation = participationObjects[participationId];

  //     if (participation[prop] === value) {
  //       participations.push(new Participation.env.Participation(participation));
  //     }
  //   }
  //   return participations;
  // }
}
