(function(exports) {
	'use strict';

	exports.createNamespace = createNamespace;

	function createNamespace(path) {
	    var parts = path.split('.'),
	        parent = window,
	        pathLength, i;
	    if (parts[0] == "myApp") {
	        parts = parts.slice(1);
	    }
	    pathLength = parts.length;
	    for (i = 0; i < pathLength; i++) {
	        //create a property if it doesnt exist
	        if (typeof parent[parts[i]] == 'undefined') {
	            parent[parts[i]] = {};
	        }
	        parent = parent[parts[i]];
	    }
	    return parent;
	}
})(window.App = {});