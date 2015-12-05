App.createNamespace('App.Services');

(function(exports) {
    'use strict';

    PeerConnection.prototype = new EventEmitter();

    exports.PeerConnection = PeerConnection;

    function PeerConnection(communicator) {
        var self = this;
        var pc;
        var dataChannel;
        var iceServers = {
            iceServers: [
                {url: "stun:23.21.150.121"},
                {url: "stun:stun.1.google.com:19302"}
            ]
        };
        var constraints = {video: false, audio: false},
            mediaConstraints = {
                'mandatory': {
                    'OfferToReceiveAudio': true,
                    'OfferToReceiveVideo': true
                }
            },
            optional = {
                optional: [
                    {
                        RtpDataChannels: true
                    }
                ]
            },
            messageHandlers = {
                offer: offer,
                candidate: createIceCandidate,
                answer: answer,
                bye: close
            };

        /*********************************************************************/
        /*private methods*/
        /********************************************************************/

        function errorCallback(error){
            console.error(error);
        }

        function onRemoteStreamAdded(event) {
            self.emit('got remote stream', event);
        }

        function receiveDataChannelMessage(message) {
            console.log('message');
        }

        function setLocalAndSendMessage(sessionDescription) {
            pc.setLocalDescription(sessionDescription);
            communicator.send(sessionDescription);
        }

        function addIceCandidate(evt) {
            if (!evt.candidate) return;

            communicator.send({
                type: "candidate",
                sdpMLineIndex: evt.candidate.sdpMLineIndex,
                sdpMid: evt.candidate.sdpMid,
                candidate: evt.candidate.candidate
            });
        }

        function createIceCandidate(options) {
            var candidate = new IceCandidate({
                sdpMLineIndex: options.sdpMLineIndex,
                sdpMid: options.sdpMid,
                candidate: options.candidate
            });
            pc.addIceCandidate(candidate);
        }

        function answer(options) {
            pc.setRemoteDescription(new SessionDescription(options));
        }

        function offer(options) {
            pc.setRemoteDescription(new SessionDescription(options), function () {
                pc.createAnswer(setLocalAndSendMessage, errorCallback, mediaConstraints);
            }, errorCallback);
        }

        function onMessage(evt) {
            var handler = messageHandlers[evt.type];

            if (handler) {
                handler(evt);
            }            
        }

        function dataChannelConnect(event) {
            dataChannel.onmessage = receiveDataChannelMessage;
        }

        function initEvents() {
            //communicator events
            communicator.on('message', onMessage);
            //room events
            pc.addEventListener('icecandidate', addIceCandidate, false);
            pc.addEventListener("addstream", onRemoteStreamAdded, false);
            dataChannel.addEventListener("open", dataChannelConnect);
        }

        function detachEvents() {
            pc.removeEventListener('icecandidate', addIceCandidate, false);
            pc.removeEventListener("addstream", onRemoteStreamAdded, false);
            dataChannel.removeEventListener("open", dataChannelConnect);
        }

        function close() {
            detachEvents();
            //can be already closed
            try { pc.close(); } catch (e) {}
            communicator.disconnect();
        }
        /*********************************************************************/
        /*public methods*/
        /********************************************************************/
        this.init = function() {
            pc = new RTCPeerConnection(iceServers);
            dataChannel = pc.createDataChannel("sendDataChannel", {});
            initEvents();            
            return this;
        };

        this.sendDataChannelMessage = function(message) {
            function sendMessageIfOpen(message) {
                dataChannel.send(message);
            }

            if (dataChannel.readyState === 'open') {
                dataChannel.send(message);
            } else {
                dataChannel.addEventListener("open", function() {
                    sendMessageIfOpen(message);
                    dataChannel.removeEventListener("open", sendMessageIfOpen);
                });
            }
        };

        this.offer = function() {
            pc.createOffer(setLocalAndSendMessage, errorCallback, mediaConstraints);
            return this;
        };

        this.answer = function (options) {
            pc.createAnswer(options);
            return this;
        };

        this.stop = function() {
            close();
            return this;
        };
    };

})(window.App.Services);

