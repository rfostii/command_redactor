App.createNamespace('App.Services');

(function(io, exports) {
    'use strict';

    var Communicator = (function (io) {
        var communicator = null;    
        var local = 'http://localhost:4000/';

        function createCommunicator(id) {
            var socket = io.connect(local + id);
            return socket;
        }

        function getCommunicator(id) {
            return createCommunicator(id);

        }

        return {
            getCommunicator: getCommunicator
        }

    })(io);

    exports.Communicator = Communicator;

})(io, window.App.Services);
