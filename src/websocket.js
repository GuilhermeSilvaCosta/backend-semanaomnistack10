const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server, {
        transports: [
          'websocket',
          'polling',
          'long-polling'
        ]
    });
    io.on('connection', socket => {
        console.log('aki')
        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: techs ? parseStringAsArray(techs) : '',
        });
    });
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item))
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    });
}