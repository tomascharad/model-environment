(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["model-environment"] = factory();
	else
		root["model-environment"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Model = exports.Environment = undefined;

	var _Environment2 = __webpack_require__(1);

	var _Environment3 = _interopRequireDefault(_Environment2);

	var _Model2 = __webpack_require__(5);

	var _Model3 = _interopRequireDefault(_Model2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Environment = _Environment3.default;
	exports.Model = _Model3.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Environment;

	var _pluralize = __webpack_require__(2);

	var _pluralize2 = _interopRequireDefault(_pluralize);

	var _Searcher = __webpack_require__(3);

	var _Searcher2 = _interopRequireDefault(_Searcher);

	var _helpers = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Environment(db, _Models) {
	  var Models = _Models;
	  var environment = {};

	  for (var modelName in Models) {
	    var Model = Models[modelName];
	    environment[modelName] = new _Searcher2.default(db, modelName, Model, environment);
	  }

	  this.parseDB = function () {
	    // TCT: TODO paseDB should return a searcher, which expose Models with its finder methods in order to find particular instances, parseing the whole DB is not efficient as other objects not used in the entry point won't be used
	    var modelObjects = {};
	    var modelObjectsDict = {};
	    var objects = db.objects;

	    for (var _modelName in Models) {
	      // TCT: See if we can inject the model name here, as it is an object key, minification doesn't mangle the name
	      // Models[modelName].modelEnviornmentName = () => modelName;
	      var pluralizedModelName = (0, _pluralize2.default)((0, _helpers.firstLetterLowerCase)(_modelName));

	      modelObjects[pluralizedModelName] = {};
	      modelObjectsDict[pluralizedModelName] = _modelName;
	    }

	    Object.keys(objects).forEach(function (classKey) {
	      var rows = objects[classKey];

	      Object.keys(rows).forEach(function (idKey) {
	        if (Models[modelObjectsDict[classKey]]) {
	          modelObjects[classKey][idKey] = new Models[modelObjectsDict[classKey]](objects[classKey][idKey]);
	          modelObjects[classKey][idKey].env = function () {
	            return environment;
	          };
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* global define */

	(function (root, pluralize) {
	  /* istanbul ignore else */
	  if (true) {
	    // Node.
	    module.exports = pluralize();
	  } else if (typeof define === 'function' && define.amd) {
	    // AMD, registers as an anonymous module.
	    define(function () {
	      return pluralize();
	    });
	  } else {
	    // Browser global.
	    root.pluralize = pluralize();
	  }
	})(this, function () {
	  // Rule storage - pluralize and singularize need to be run sequentially,
	  // while other rules can be optimized using an object for instant lookups.
	  var pluralRules = [];
	  var singularRules = [];
	  var uncountables = {};
	  var irregularPlurals = {};
	  var irregularSingles = {};

	  /**
	   * Title case a string.
	   *
	   * @param  {string} str
	   * @return {string}
	   */
	  function toTitleCase (str) {
	    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
	  }

	  /**
	   * Sanitize a pluralization rule to a usable regular expression.
	   *
	   * @param  {(RegExp|string)} rule
	   * @return {RegExp}
	   */
	  function sanitizeRule (rule) {
	    if (typeof rule === 'string') {
	      return new RegExp('^' + rule + '$', 'i');
	    }

	    return rule;
	  }

	  /**
	   * Pass in a word token to produce a function that can replicate the case on
	   * another word.
	   *
	   * @param  {string}   word
	   * @param  {string}   token
	   * @return {Function}
	   */
	  function restoreCase (word, token) {
	    // Upper cased words. E.g. "HELLO".
	    if (word === word.toUpperCase()) {
	      return token.toUpperCase();
	    }

	    // Title cased words. E.g. "Title".
	    if (word[0] === word[0].toUpperCase()) {
	      return toTitleCase(token);
	    }

	    // Lower cased words. E.g. "test".
	    return token.toLowerCase();
	  }

	  /**
	   * Interpolate a regexp string.
	   *
	   * @param  {string} str
	   * @param  {Array}  args
	   * @return {string}
	   */
	  function interpolate (str, args) {
	    return str.replace(/\$(\d{1,2})/g, function (match, index) {
	      return args[index] || '';
	    });
	  }

	  /**
	   * Sanitize a word by passing in the word and sanitization rules.
	   *
	   * @param  {String}   token
	   * @param  {String}   word
	   * @param  {Array}    collection
	   * @return {String}
	   */
	  function sanitizeWord (token, word, collection) {
	    // Empty string or doesn't need fixing.
	    if (!token.length || uncountables.hasOwnProperty(token)) {
	      return word;
	    }

	    var len = collection.length;

	    // Iterate over the sanitization rules and use the first one to match.
	    while (len--) {
	      var rule = collection[len];

	      // If the rule passes, return the replacement.
	      if (rule[0].test(word)) {
	        return word.replace(rule[0], function (match, index, word) {
	          var result = interpolate(rule[1], arguments);

	          if (match === '') {
	            return restoreCase(word[index - 1], result);
	          }

	          return restoreCase(match, result);
	        });
	      }
	    }

	    return word;
	  }

	  /**
	   * Replace a word with the updated word.
	   *
	   * @param  {Object}   replaceMap
	   * @param  {Object}   keepMap
	   * @param  {Array}    rules
	   * @return {Function}
	   */
	  function replaceWord (replaceMap, keepMap, rules) {
	    return function (word) {
	      // Get the correct token and case restoration functions.
	      var token = word.toLowerCase();

	      // Check against the keep object map.
	      if (keepMap.hasOwnProperty(token)) {
	        return restoreCase(word, token);
	      }

	      // Check against the replacement map for a direct word replacement.
	      if (replaceMap.hasOwnProperty(token)) {
	        return restoreCase(word, replaceMap[token]);
	      }

	      // Run all the rules against the word.
	      return sanitizeWord(token, word, rules);
	    };
	  }

	  /**
	   * Pluralize or singularize a word based on the passed in count.
	   *
	   * @param  {String}  word
	   * @param  {Number}  count
	   * @param  {Boolean} inclusive
	   * @return {String}
	   */
	  function pluralize (word, count, inclusive) {
	    var pluralized = count === 1
	      ? pluralize.singular(word) : pluralize.plural(word);

	    return (inclusive ? count + ' ' : '') + pluralized;
	  }

	  /**
	   * Pluralize a word.
	   *
	   * @type {Function}
	   */
	  pluralize.plural = replaceWord(
	    irregularSingles, irregularPlurals, pluralRules
	  );

	  /**
	   * Singularize a word.
	   *
	   * @type {Function}
	   */
	  pluralize.singular = replaceWord(
	    irregularPlurals, irregularSingles, singularRules
	  );

	  /**
	   * Add a pluralization rule to the collection.
	   *
	   * @param {(string|RegExp)} rule
	   * @param {string}          replacement
	   */
	  pluralize.addPluralRule = function (rule, replacement) {
	    pluralRules.push([sanitizeRule(rule), replacement]);
	  };

	  /**
	   * Add a singularization rule to the collection.
	   *
	   * @param {(string|RegExp)} rule
	   * @param {string}          replacement
	   */
	  pluralize.addSingularRule = function (rule, replacement) {
	    singularRules.push([sanitizeRule(rule), replacement]);
	  };

	  /**
	   * Add an uncountable word rule.
	   *
	   * @param {(string|RegExp)} word
	   */
	  pluralize.addUncountableRule = function (word) {
	    if (typeof word === 'string') {
	      uncountables[word.toLowerCase()] = true;
	      return;
	    }

	    // Set singular and plural references for the word.
	    pluralize.addPluralRule(word, '$0');
	    pluralize.addSingularRule(word, '$0');
	  };

	  /**
	   * Add an irregular word definition.
	   *
	   * @param {String} single
	   * @param {String} plural
	   */
	  pluralize.addIrregularRule = function (single, plural) {
	    plural = plural.toLowerCase();
	    single = single.toLowerCase();

	    irregularSingles[single] = plural;
	    irregularPlurals[plural] = single;
	  };

	  /**
	   * Irregular rules.
	   */
	  [
	    // Pronouns.
	    ['I', 'we'],
	    ['me', 'us'],
	    ['he', 'they'],
	    ['she', 'they'],
	    ['them', 'them'],
	    ['myself', 'ourselves'],
	    ['yourself', 'yourselves'],
	    ['itself', 'themselves'],
	    ['herself', 'themselves'],
	    ['himself', 'themselves'],
	    ['themself', 'themselves'],
	    ['is', 'are'],
	    ['this', 'these'],
	    ['that', 'those'],
	    // Words ending in with a consonant and `o`.
	    ['echo', 'echoes'],
	    ['dingo', 'dingoes'],
	    ['volcano', 'volcanoes'],
	    ['tornado', 'tornadoes'],
	    ['torpedo', 'torpedoes'],
	    // Ends with `us`.
	    ['genus', 'genera'],
	    ['viscus', 'viscera'],
	    // Ends with `ma`.
	    ['stigma', 'stigmata'],
	    ['stoma', 'stomata'],
	    ['dogma', 'dogmata'],
	    ['lemma', 'lemmata'],
	    ['schema', 'schemata'],
	    ['anathema', 'anathemata'],
	    // Other irregular rules.
	    ['ox', 'oxen'],
	    ['axe', 'axes'],
	    ['die', 'dice'],
	    ['yes', 'yeses'],
	    ['foot', 'feet'],
	    ['eave', 'eaves'],
	    ['goose', 'geese'],
	    ['tooth', 'teeth'],
	    ['quiz', 'quizzes'],
	    ['human', 'humans'],
	    ['proof', 'proofs'],
	    ['carve', 'carves'],
	    ['valve', 'valves'],
	    ['thief', 'thieves'],
	    ['genie', 'genies'],
	    ['groove', 'grooves'],
	    ['pickaxe', 'pickaxes'],
	    ['whiskey', 'whiskies']
	  ].forEach(function (rule) {
	    return pluralize.addIrregularRule(rule[0], rule[1]);
	  });

	  /**
	   * Pluralization rules.
	   */
	  [
	    [/s?$/i, 's'],
	    [/([^aeiou]ese)$/i, '$1'],
	    [/(ax|test)is$/i, '$1es'],
	    [/(alias|[^aou]us|tlas|gas|ris)$/i, '$1es'],
	    [/(e[mn]u)s?$/i, '$1s'],
	    [/([^l]ias|[aeiou]las|[emjzr]as|[iu]am)$/i, '$1'],
	    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
	    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
	    [/(seraph|cherub)(?:im)?$/i, '$1im'],
	    [/(her|at|gr)o$/i, '$1oes'],
	    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
	    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
	    [/sis$/i, 'ses'],
	    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
	    [/([^aeiouy]|qu)y$/i, '$1ies'],
	    [/([^ch][ieo][ln])ey$/i, '$1ies'],
	    [/(x|ch|ss|sh|zz)$/i, '$1es'],
	    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
	    [/(m|l)(?:ice|ouse)$/i, '$1ice'],
	    [/(pe)(?:rson|ople)$/i, '$1ople'],
	    [/(child)(?:ren)?$/i, '$1ren'],
	    [/eaux$/i, '$0'],
	    [/m[ae]n$/i, 'men'],
	    ['thou', 'you']
	  ].forEach(function (rule) {
	    return pluralize.addPluralRule(rule[0], rule[1]);
	  });

	  /**
	   * Singularization rules.
	   */
	  [
	    [/s$/i, ''],
	    [/(ss)$/i, '$1'],
	    [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(?:sis|ses)$/i, '$1sis'],
	    [/(^analy)(?:sis|ses)$/i, '$1sis'],
	    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
	    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
	    [/([^aeiouy]|qu)ies$/i, '$1y'],
	    [/(^[pl]|zomb|^(?:neck)?t|[aeo][lt]|cut)ies$/i, '$1ie'],
	    [/(\b(?:mon|smil))ies$/i, '$1ey'],
	    [/(m|l)ice$/i, '$1ouse'],
	    [/(seraph|cherub)im$/i, '$1'],
	    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|tlas|gas|(?:her|at|gr)o|ris)(?:es)?$/i, '$1'],
	    [/(e[mn]u)s?$/i, '$1'],
	    [/(movie|twelve)s$/i, '$1'],
	    [/(cris|test|diagnos)(?:is|es)$/i, '$1is'],
	    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
	    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
	    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
	    [/(alumn|alg|vertebr)ae$/i, '$1a'],
	    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
	    [/(matr|append)ices$/i, '$1ix'],
	    [/(pe)(rson|ople)$/i, '$1rson'],
	    [/(child)ren$/i, '$1'],
	    [/(eau)x?$/i, '$1'],
	    [/men$/i, 'man']
	  ].forEach(function (rule) {
	    return pluralize.addSingularRule(rule[0], rule[1]);
	  });

	  /**
	   * Uncountable rules.
	   */
	  [
	    // Singular words with no plurals.
	    'advice',
	    'agenda',
	    'bison',
	    'bream',
	    'buffalo',
	    'carp',
	    'chassis',
	    'cod',
	    'cooperation',
	    'corps',
	    'digestion',
	    'debris',
	    'diabetes',
	    'energy',
	    'equipment',
	    'elk',
	    'excretion',
	    'expertise',
	    'flounder',
	    'gallows',
	    'garbage',
	    'graffiti',
	    'headquarters',
	    'health',
	    'herpes',
	    'highjinks',
	    'homework',
	    'information',
	    'jeans',
	    'justice',
	    'kudos',
	    'labour',
	    'machinery',
	    'mackerel',
	    'media',
	    'mews',
	    'moose',
	    'news',
	    'pike',
	    'plankton',
	    'pliers',
	    'pollution',
	    'premises',
	    'rain',
	    'rice',
	    'salmon',
	    'scissors',
	    'series',
	    'sewage',
	    'shambles',
	    'shrimp',
	    'species',
	    'staff',
	    'swine',
	    'trout',
	    'tuna',
	    'whiting',
	    'wildebeest',
	    'wildlife',
	    'you',
	    // Regexes.
	    /pox$/i, // "chickpox", "smallpox"
	    /ois$/i,
	    /deer$/i, // "deer", "reindeer"
	    /fish$/i, // "fish", "blowfish", "angelfish"
	    /sheep$/i,
	    /measles$/i,
	    /[^aeiou]ese$/i // "chinese", "japanese"
	  ].forEach(pluralize.addUncountableRule);

	  return pluralize;
	});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _pluralize = __webpack_require__(2);

	var _pluralize2 = _interopRequireDefault(_pluralize);

	var _helpers = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Searcher = function () {
	  function Searcher(db, name, Model, environment) {
	    _classCallCheck(this, Searcher);

	    this.db = db;
	    this.name = name;
	    this.Model = Model;
	    this.environment = environment;
	  }

	  _createClass(Searcher, [{
	    key: 'getClassObjects',
	    value: function getClassObjects() {
	      return this.db.objects[this.getClassPluralizedName()];
	    }
	  }, {
	    key: 'getClassPluralizedName',
	    value: function getClassPluralizedName() {
	      return (0, _pluralize2.default)((0, _helpers.firstLetterLowerCase)(this.name));
	    }
	  }, {
	    key: 'findBy',
	    value: function findBy(prop, value) {
	      var classObjects = this.getClassObjects();
	      var foundObject = null;

	      for (var objectId in classObjects) {
	        var object = classObjects[objectId];
	        if (object[prop] === value && !foundObject) {
	          foundObject = this.createModelInstance(object);
	        }
	      }
	      return foundObject;
	    }
	  }, {
	    key: 'getById',
	    value: function getById(id) {
	      var modelObject = null;
	      var modelPluralizedName = this.getClassPluralizedName();
	      var modelObjects = this.db.objects[modelPluralizedName];
	      if (modelObjects) {
	        var object = modelObjects[id];
	        if (object) {
	          modelObject = this.createModelInstance(object);
	        }
	      } else {
	        throw new Error('Maybe you forgot to send the corresponding "' + modelPluralizedName + '" object in your objects hash on your Environment initialization');
	      }
	      return modelObject;
	    }
	  }, {
	    key: 'all',
	    value: function all() {
	      var _this = this;

	      var objects = [];
	      var classObjects = this.getClassObjects();

	      Object.keys(classObjects).forEach(function (id) {
	        var objectData = classObjects[id];
	        objects.push(_this.createModelInstance(objectData));
	      });
	      return objects;
	    }
	  }, {
	    key: 'findAllBy',
	    value: function findAllBy(prop, value) {
	      var classObjects = this.getClassObjects();
	      var objects = [];
	      for (var objectId in classObjects) {
	        var object = classObjects[objectId];
	        if (object[prop] === value) {
	          objects.push(this.createModelInstance(object));
	        }
	      }
	      return objects;
	    }
	  }, {
	    key: 'createModelInstance',
	    value: function createModelInstance(data) {
	      var _this2 = this;

	      var object = new this.Model(data);
	      object.env = function () {
	        return _this2.environment;
	      };
	      return object;
	    }
	  }]);

	  return Searcher;
	}();

	exports.default = Searcher;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.isFunction = isFunction;
	exports.firstLetterLowerCase = firstLetterLowerCase;
	function isFunction(functionToCheck) {
	  var getType = {};
	  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	function firstLetterLowerCase(string) {
	  return string.charAt(0).toLowerCase() + string.slice(1);
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Model = function Model() {
	  _classCallCheck(this, Model);
	};

	exports.default = Model;

/***/ }
/******/ ])
});
;