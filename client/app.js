(function() {
	'use strict';

	var container = document.getElementById('app');
	var communicator = App.Services.Communicator.getCommunicator('');
	var peer = new App.Services.PeerConnection(communicator).init();
	var redactor = new App.Components.Redactor(container).render();
	

	redactor.on('startEdit', function() {
		peer.offer();		
	});

	redactor.on('dataChanged', function(text) {
		communicator.send(text);
	});

	communicator.on('message', function(message) {
		if (typeof message === 'string') {
			redactor.setText(message);
		}		
	});

	peer.on('got remote stream', function() {
		console.log('joined');
	});

	window.onunload = function() {
		peer.stop();
	}
	
})();