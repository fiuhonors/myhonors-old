/**
 * Explicit syncing. Provides a collection object you can modify.
 * 
 * Original code by @petebacondarwin and @firebase from:
 * https://github.com/petebacondarwin/angular-firebase/blob/master/ng-firebase-collection.js
 * and https://github.com/firebase/angularFire/blob/gh-pages/angularFire.js
 */

angular.module('Firebase').factory('FirebaseCollection', ['$timeout', function($timeout) {
	function angularFireItem(ref, index) {
		this.$ref = ref.ref();
		this.$id = ref.name();
		this.$index = index;
		angular.extend(this, ref.val());
	}

	/**
	 * Create a collection with data from Firebase
	 *
	 * @param	{String} collectionUrlOrRef	The firebase url where the collection lives
	 * @param	{Object} options			An object that can contain options (listed below)
	 *
	 *			- initialCb: method executed immediately after initial data load
	 *			- metaUrlOrRef: Firebase URL or reference to 'meta' data. Used when
	 * 			  dealing with denormalized data, it uses the name of each item in
	 *			  in collectionUrlOrRef (which is usually in the form of 'propertyName: true')
	 *			  to fetch data from metaUrlOrRef.child('propertyName') and save that into the
	 *			  collection instead. 
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

		var metaRef;
		if (options && options.metaUrlOrRef) {
			if (typeof options.metaUrlOrRef == "string") {
				metaRef = new Firebase(options.metaUrlOrRef);
			} else {
				metaRef = options.metaUrlOrRef;
			}
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
			if (metaRef) {
				metaRef.child(data.name()).once('value', function(metaData) {
					$timeout(function() {
						var index = getIndex(prevId);
						addChild(index, new angularFireItem(metaData, index));
						updateIndexes(index);
					});
				});
			} else {
				$timeout(function() {
					var index = getIndex(prevId);
					addChild(index, new angularFireItem(data, index));
					updateIndexes(index);
				});
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