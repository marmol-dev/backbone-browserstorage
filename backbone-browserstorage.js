'use strict';

(function(window) {

	/**
	 * Dependencies
	 */
	//TODO: AMD support
	var _ = window._,
		Backbone = window.Backbone;

	(function() {
		var unresolvedDependencies = [];

		if (!_) {
			unresolvedDependencies.push('lodash (or underscore)');
		}

		if (!Backbone) {
			unresolvedDependencies.push('Backbone');
		}

		if (unresolvedDependencies.length > 0) {
			throw new Error('Unresolved dependencies: ', unresolvedDependencies.join(','));
		}
	})();


	/**
	 * localStorage management
	 */
	var lS = (function() {
		var localStorage = window.localStorage;

		function set(name, value) {
			localStorage[name] = JSON.stringify(value);
		}

		function get(name) {
			var unparsedValue = localStorage[name],
				parsedValue;

			try {
				parsedValue = JSON.parse(unparsedValue);
			} catch (e) {
				parsedValue = unparsedValue;
			}

			return parsedValue;
		}

		return function(name, value) {
			if (arguments.length === 2)
				return set(name, value);
			else return get(name);
		};
	})();


	/**
	 * Definition
	 */

	var Model = Backbone.Model.extend({
		constructor: function(attrs, options) {
			var self = this;

			if (!_.isObject(options)) {
				throw new Error('Invalid options object');
			}

			if (typeof options.localStorageKey !== 'string') {
				throw new Error('Invalid localStorageKey in constructor options');
			}

			this.$localStorageKey = options.localStorageKey;

			Backbone.Model.apply(this, arguments);

			this.on('change', function(){
				self.$updateLocalStorage.apply(self, arguments);
			});

			//localstorage
			if (!lS(this.$localStorageKey)) {
				lS(this.$localStorageKey, []);
			}

			this.$updateCollection.call(this);
		},
		$updateCollection: function() {
			this.set(lS(this.$localStorageKey));
		},
		$updateLocalStorage: function() {
			var plainObject = this.toJSON();

			if (_.isArray(this.lsExcludedAttributes) ){
				_.each(this.lsExcludedAttributes, function(e){
					if (typeof e === 'string'){
						delete plainObject[e];
					} else if (e instanceof RegExp){
						_.forIn(plainObject, function(value, key){
							if (e.test(key)){
								delete plainObject[key];
							}
						});
					}
				});
			}

			lS(this.$localStorageKey, plainObject);
			this.trigger('localStorageUpdated');
		}
	});

	var Collection = Backbone.Collection.extend({
		constructor: function(items, options) {
			var self = this;
			
			//options validation
			if (!_.isObject(options)) {
				throw new Error('Invalid options object');
			}

			if (typeof options.localStorageKey !== 'string') {
				throw new Error('Invalid localStorageKey in constructor options');
			}

			this.$localStorageKey = options.localStorageKey;

			//parent constructor
			Backbone.Collection.apply(this, arguments);

			//events
			_.extend(this, Backbone.Events);
			var eventsToUpdate = ['reset', 'change'];
			if (options.updateOnlyOnReset !== true) {
				eventsToUpdate.push('add');
				eventsToUpdate.push('remove');
			}

			this.on(eventsToUpdate.join(' '), function(){
				self.$updateLocalStorage.apply(self, arguments);
			});

			//localstorage
			if (!lS(this.$localStorageKey)) {
				lS(this.$localStorageKey, []);
			}

			this.$updateCollection.call(this);
		},
		$updateCollection: function() {
			this.set(lS(this.$localStorageKey));
		},
		$updateLocalStorage: function() {
			this.trigger('localStorageUpdated');
			lS(this.$localStorageKey, this.toJSON());
		}
	});

	Backbone.LocalStorageModel = Backbone.BrowserStorageModel = Model;
	Backbone.LocalStorageCollection = Backbone.BrowserStorageCollection = Collection;
	Backbone.lS = lS;
})(this); /*jshint ignore: line */
