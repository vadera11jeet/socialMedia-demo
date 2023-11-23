const io = require("socket.io");

const socketConnection = {
  socket: null,

  connectSocketServer: function (expressServer) {
    this.socket = new io.Server(expressServer, {
      pingTimeOut: 60000,
      cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      },
    });

    return this.socket;
  },
  getSocket: function () {
    return this.socket;
  },
};

module.exports = socketConnection;
