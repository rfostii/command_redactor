App.createNamespace('App.Utils');

(function(exports) {
	'use strict';

	exports.loadTemplate = loadTemplate;
		
	//////////////////////////////////////

	function loadTemplate(templateUrl) {	
		var xhr = new XMLHttpRequest();

		xhr.open('GET', templateUrl, true);
		xhr.send();

		return new Promise((resolve, reject) => {
		  xhr.onreadystatechange = () => {
		  		if (xhr.readyState === 4 && xhr.status === 200) {
		  			resolve(xhr.responseText);
		  		}
		  };
		  xhr.onerror = reject;
		});	
	}
	
})(window.App.Utils);
