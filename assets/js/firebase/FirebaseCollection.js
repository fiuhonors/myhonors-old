/**
 * Explicit syncing. Provides a collection object you can modify.
 * 
 * Original code by @petebacondarwin and @firebase from:
 * https://github.com/petebacondarwin/angular-firebase/blob/master/ng-firebase-collection.js
 * and https://github.com/firebase/angularFire/blob/gh-pages/angularFire.js
 */

angular.module('Firebase').factory('FirebaseCollection', ['$timeout', function($timeout) {
	// sometimes we grab extra data (usually via metaFunction()) when navigating through Firebase.
	// since we can't directly attach this extra data to the immutable Firebase reference, we just
	// pass it into here and attach it alongside the actual ref.val()
	function angularFireItem(ref, index, extraData) {
		this.$ref = ref.ref();
		this.$id = ref.name();
		this.$index = index;
		angular.extend(this, ref.val(), extraData);
	}

	/**
	 * Create a collection with data from Firebase
	 *
	 * @param	{String} collectionUrlOrRef	The firebase url where the collection lives
	 * @param	{Object} options			An object that can contain options (listed below)
	 *
	 *			- initialCb: method executed immediately after initial data load
	 *			- metaFunction(doAdd, data): method to help us customize our traversals through
	 *			  Firebase, in order to grab different sets of data and link them together. This
	 *			  method MUST call doAdd(ref [, extraData]) somewhere in order to properly add
	 *			  the item to the FirebaseCollection
	 * 
	 * @return	{Array}						An array that will hold the items in the collection
	 */
	return function(collectionUrlOrRef, options) {
		var collection = [];
		var indexes = {};

		var collectionRef;
		if (typeof collectionUrlOrRef == "string") {
			collectionRef = new Firebase(collectionUrlOrRef);
		} else {
			collectionRef = collectionUrlOrRef;
		}

		var metaFunction;
		if (options && options.metaFunction) {
			metaFunction = options.metaFunction;
		}

		function getIndex(prevId) {
			return prevId ? indexes[prevId] + 1 : 0;
		}

		function addChild(index, item) {
			indexes[item.$id] = index;
			collection.splice(index, 0, item);
		}

		function removeChild(id) {
			var index = indexes[id];
			// Remove the item from the collection.
			collection.splice(index, 1);
			indexes[id] = undefined;
		}

		function updateChild (index, item) {
			collection[index] = item;
		}

		function moveChild (from, to, item) {
			collection.splice(from, 1);
			collection.splice(to, 0, item);
			updateIndexes(from, to);
		}

		function updateIndexes(from, to) {
			var length = collection.length;
			to = to || length;
			if (to > length) {
				to = length;
			}
			for (var index = from; index < to; index++) {
				var item = collection[index];
				item.$index = indexes[item.$id] = index;
			}
		}

		if (options && options.initialCb && typeof options.initialCb == 'function') {
			collectionRef.once('value', options.initialCb);
		}

		collectionRef.on('child_added', function(data, prevId) {
			// For reference on what we're doing with metaRef here, see
			// https://www.firebase.com/blog/2013-04-12-denormalizing-is-normal.html
			var doAdd = function(ref, extraData) {
				$timeout(function() {
					var index = getIndex(prevId);
					addChild(index, new angularFireItem(ref, index, extraData));
					updateIndexes(index);
				});
			};

			if(metaFunction) {
				metaFunction(doAdd, data);
			} else {
				doAdd(data);
			}
		});

		collectionRef.on('child_removed', function(data) {
			$timeout(function() {
				var id = data.name();
				var pos = indexes[id];
				removeChild(id);
				updateIndexes(pos);
			});
		});

		collectionRef.on('child_changed', function(data, prevId) {
			$timeout(function() {
				var index = indexes[data.name()];
				var newIndex = getIndex(prevId);
				var item = new angularFireItem(data, index);

				updateChild(index, item);
				if (newIndex !== index) {
					moveChild(index, newIndex, item);
				}
			});
		});

		collectionRef.on('child_moved', function(ref, prevId) {
			$timeout(function() {
				var oldIndex = indexes[ref.name()];
				var newIndex = getIndex(prevId);
				var item = collection[oldIndex];
				moveChild(oldIndex, newIndex, item);
			});
		});

		collection.add = function(item, cb) {
			if (!cb) {
				collectionRef.ref().push(item);
			} else {
				collectionRef.ref().push(item, cb);
			}
		};
		collection.remove = function(itemOrId) {
			var item = angular.isString(itemOrId) ? collection[indexes[itemOrId]] : itemOrId;
			item.$ref.remove();
		};

		collection.update = function(itemOrId) {
			var item = angular.isString(itemOrId) ? collection[indexes[itemOrId]] : itemOrId;
			var copy = {};
			angular.forEach(item, function(value, key) {
				if (key.indexOf('$') !== 0) {
					copy[key] = value;
				}
			});
			item.$ref.set(copy);
		};

		return collection;
	};
}]);