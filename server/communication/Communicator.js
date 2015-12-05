var Communicator = function(io, room) {
    var defaultRoomName = 'room';
    var participantsCount = 0;

    function createOrJoinRoom(socket) {                
        socket.join(defaultRoomName);        
        ++participantsCount;
        io.sockets.in(defaultRoomName).emit('user joined', socket.id);
        socket.emit('joined', room);

    }    

    function onMessage(data) {      
        this.broadcast.to(defaultRoomName).emit('message', data);        
    }

    function getParticipants() {
        var self = this;
        var participants = rooms[defaultRoomName].filter(function(participant) {
            return participant.id !== self.id;
        });
        this.broadcast.to(defaultRoomName).emit('new user', this.id);
        this.emit('participants', participants, this.id);
    }

    function leaveRoom() {
        --participantsCount;
        this.leave(defaultRoomName);  
        io.sockets.in(defaultRoomName).emit('user left', this.id);              
    }

    function removeUselessChannels() {
        var channels = Object.keys(io.nsps);

        channels.forEach(function(channel) {
            if (io.nsps.hasOwnProperty(channel) && io.nsps[channel].sockets.length === 0)
                delete io.nsps[channel];
        });
    }

    function createChannel(id) {
        var channel = io.of('/' + id);
        var self = this;
        channel.on('connection', function(connection) {

            function onMessage(data) {
                var id = connection.nsp.name.slice(1).split('==').reverse().join('==');
                io.of('/' + id).emit('message', data);
            }

            function removeStream() {
                var id = connection.nsp.name.slice(1).split('==').reverse().join('==');

                removeUselessChannels();
                io.of('/' + id).emit('remove stream', self.id);
            }

            connection.removeAllListeners();
            connection.on('message', onMessage);
            connection.on('disconnect', removeStream);
        });
        this.emit('channel created', id);
    }

    io.on('connection', function(socket) {        
        createOrJoinRoom(socket);
        socket.on('create channel', createChannel);
        socket.on('participants', getParticipants);
        socket.on('message', onMessage);
        socket.on('disconnect', leaveRoom);
    });
};

module.exports = Communicator;