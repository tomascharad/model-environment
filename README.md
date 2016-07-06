Super lightweight environment that permits to define relations between objects when receiving data from normalized api's

# Motivation

Coming from [this](http://redux.js.org/docs/basics/Reducers.html#note-on-relationships) redux statement: 

> Note on Relationships

> In a more complex app, you’re going to want different entities to reference each other. We suggest that you keep your state as normalized as possible, without any nesting. Keep every entity in an object stored with an ID as a key, and use IDs to reference it from other entities, or lists. Think of the app’s state as a database. This approach is described in normalizr's documentation in detail. For example, keeping todosById: { id -> todo } and todos: array<id> inside the state would be a better idea in a real app, but we’re keeping the example simple.

And because it is [hard](https://groups.google.com/forum/#!topic/reactjs/jbh50-GJxpg) to consume data from nested API responses. You would like to have a normalized Api or normalize it with [normalizr](https://github.com/paularmstrong/normalizr)

But, we all know that is very difficult to recreate all of these relations in our client-side app... This is why model-environment was created for.

Have you ever wanted to do things like: `user.company().employees()` in your client-side app?

# Requirements

To have a normalized api (or normalize it), which provides of data with the following structure (we are currently working in the array version):
```javascript
{
  objects: {
    modelOneObjects: {
      1: {},
      2: {},
      ...
    },
    modelTwoObjects: {
      1: {},
      2: {},
      ...
    },
  },
}
```

# Installation: 

```bash
npm install --save model-enviroment
```

# Usage: 

```javascript
import ModelEnvironment from 'model-enviroment';
import * as Models from 'path/to/your/models/index';
```

All of your models must extend from Model

```javascript
import ModelEnvironment from 'model-enviroment';
class ModelOne extends ModelEnvironment.Model {
  ...
}
class ModelTwo extends ModelEnvironment.Model {
  ...
}
```

When you first load your data, update it (or in your component render view if you are using redux, or in your respective selector if you are using them wisely):

```javascript
import * as Models from 'path/to/your/models/index'
conts env = new Environment({this.props.objects}, Models).parseDB()
```
Then you can do:
```javascript
env.objects.parsedModelOneObjects[1]
```
or

```javascript
env.objects.parsedModelOneObjects[1].env().ModelTwo.findBy('modelOneId', 2);
```

You can also define relations on your models as this:
On ModelTwo.js

```javascript
modelOneObject() {
  return this.env().ModelOne.getById(this.modelOneId);
}
```

Or if it is a many to many relation:
```javascript
modelOneObjects() {
  let array = [];
  let thisRef = this;

  return this.modelOneIds.map((modelOneId) => {
    return thisRef.env().ModelOne.getById(modelOneId);
  });
}
```

# Notes

## Names are important
If you are passing the users objects like these:

```javascript
{
  objects: {
    users: {
      1: {
        email: tomas@tcit.cl
        name: Tomás
      },
      2: {
        email: felipe@tcit.cl
        name: Felipe
      },
    },
  },
}
```

Then your Model has to be named `User` (as in Rails conventions).

## Similarities with [redux-orm](https://github.com/tommikaikkonen/redux-orm)

### The main similarity 

Is the `extends Model`. But the differences are considerable.

### We focus
On translating a normalized api into objects that are built from classes that have relations between each other.

### The **most important** 
And remarkable difference is that model-environment is not coupled to redux, so you can use it with angular, angular2, backbone, ember, etc...
This also allows you to update your state as you would do it naturally with redux.

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
3. Allow for objects coming from api as arrays instead of objects: [obj1, obj2, obj3] instead of {1: obj1, 2: obj2, 3: obj3}
4. Optimize Environment creation with reselect?
