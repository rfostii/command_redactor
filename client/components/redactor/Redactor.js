App.createNamespace('App.Components');

(function(loadTemplate, exports) {
	'use strict';

	Redactor.prototype = new EventEmitter();

	exports.Redactor = Redactor;

	function Redactor(container) {
		var _selectors = {
			redactor: '.redactor',
			startEditButton: '.start-edit',
			redactorTextArea: '.redactor-textarea'
		};

		var self = this;		
		var template = "/client/components/redactor/redactorTemplate.html";

		self.render = render;
		self.setText = setText;
		//self.addUser = addUser;

		/**
		* @method
		* @public
		*/
		function render() {

			loadTemplate(template).then(function(template) {
				container.innerHTML = template;
				_attachEvents();
			});

			return self;
		}

		function setText(text) {
			var redactorTextArea = document.querySelector(_selectors.redactorTextArea);

			if (redactorTextArea) {
				redactorTextArea.value = text;
			}
		}

		/**
		* @method
		* @private
		*/
		function _attachEvents() {
			var redactorTextArea = document.querySelector(_selectors.redactorTextArea);
			
			document.querySelector(_selectors.startEditButton).addEventListener('click', function() {
					if (redactorTextArea && redactorTextArea.disabled) {
						redactorTextArea.disabled = false;
						self.emit('startEdit');
					}					
				}, false);
			redactorTextArea.addEventListener('keyup', function(event) {
					self.emit('dataChanged', event.target.value);
				});
		}
	};	

})(App.Utils.loadTemplate, App.Components);