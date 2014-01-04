// Generated by CoffeeScript 1.6.3
(function() {
  var WebSocketServer, ids, mc, sids, states, wss;

  mc = require('minecraft-protocol');

  WebSocketServer = (require('ws')).Server;

  states = mc.protocol.states;

  ids = mc.protocol.packetIDs.play.toClient;

  sids = mc.protocol.packetIDs.play.toServer;

  wss = new WebSocketServer({
    port: 1234
  });

  wss.on('connection', function(ws) {
    var client;
    ws.on('message', function(msg) {
      return console.log("websocket received: " + msg);
    });
    ws.send('hello');
    ws.send('connecting to Minecraft...');
    client = mc.createClient({
      host: 'localhost',
      port: 25565,
      username: 'webuser',
      password: null
    });
    client.on('packet', function(p) {
      var name;
      name = mc.protocol.packetNames.play.toClient[p.id];
      p.name = name;
      return ws.send(JSON.stringify(p));
    });
    client.on('connect', function() {
      return console.log('Successfully connected');
    });
    client.on([states.PLAY, ids.chat], function(p) {});
    return client.on([states.PLAY, ids.disconnect], function(p) {
      return console.log("Kicked for " + p.reason);
    });
  });

}).call(this);
