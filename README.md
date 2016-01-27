Creates an environment that permits to define relations between objects when receiving objects from normalized api's

Requirements: To have a normalized api, which provides adata with the following structure:

{objects: {
    modelOneObjects: {
      1: {},
      2: {},
      ...
    }
    modelTwoObjects: {
      1: {},
      2: {},
      ...
    }
  }
}

Installation: npm install --save model-enviroment

Usage: 

import {Environment} from 'model-enviroment'
import * as Models from 'path/to/your/models/index'

All of your models must extend from Model
import {Model} from 'model-enviroment'

class ModelOne extends Model {
  ...
}

class ModelTwo extends Model {
  ...
}

In your component render view

conts env = new Environment({this.props.objects}, Models).parseDB
Then you can do:
env.objects.parsedModelOneObjects[1]
or
env.objects.parsedModelOneObjects[1].env().ModelTwo.findBy('modelOneId', 2);

You can also define relations on your models as this:

On ModelTwo.js

modelOneObject() {
  return this.env().ModelOne.getById(this.modelOneId);
}

Or if it is a many to many relation:

modelOneObjects() {
  let array = [];
  let thisRef = this;

  this.modelOneIds.forEach(function(modelOneId) {
    array.push(thisRef.env().ModelOne.getById(modelOneId));
  });

  return array;
}

Model static methods api:
Finder methods:
getById
findBy
all

Others:
getClassPluralizedName
getClassObjects
getThisClass

To be done:
1. Somehow declare the relation name as: belongs_to or has_many to automatically expose the relations
2. Implement more finderMethods: findAllBy, etc...


