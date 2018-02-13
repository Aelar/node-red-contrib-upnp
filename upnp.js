module.exports = function(RED) {
    function discoverDevices(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        /*node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });*/
        
        var dgram = require('dgram');
        var server = dgram.createSocket('udp4');
        server.on('listening', function () {
            var address = server.address();
            node.send('UDP Server listening on ' + address.address + ":" + address.port);
        });

        server.on('message', function (message, remote) {
            node.send(remote.address + ':' + remote.port +' - ' + message);
            server.close();
        });

        server.bind(1900,'239.255.255.250');


        var message = new Buffer("M-SEARCH * HTTP/1.1\r\nHost: 239.255.255.250:1900\r\nMan: \"ssdp:discover\"\r\nST: roku:ecp\r\n\r\n");
        //node.send('My KungFu is Good!');

        var client = dgram.createSocket('udp4');
        client.send(message, 0, message.length, 1900, "239.255.255.250", function (err, bytes) {
            if (err) throw err;
            node.send('UDP message sent to ' + "239.255.255.250" + ':' + 1900);
            client.close();
        });





    }
    RED.nodes.registerType("upnp_discover",discoverDevices);
}