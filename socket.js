const WebSocket = require('uws');

const wss = new WebSocket.Server({ port: 8080 });
// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

module.exports = wss;
