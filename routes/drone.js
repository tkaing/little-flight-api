const spawn = require('child_process').spawn;
const express = require("express");
const endpoint = require('../endpoints/drone');
const WebSocket = require('ws');
const controller = require('./../api/api_controller');

const dgram = require('dgram');
const client = dgram.createSocket({ type: 'udp4' });

const PORT = 8889;
const HOST = '192.168.10.1';

let _bind = false;

const router = express.Router();

router.get(
    endpoint.land,
    async (request, response) => {
        try {
            if (!_bind) {
                client.bind(8001);
                _bind = true;
            }
            client.on('message', (msg) => {
                console.log('Data received from server : ' + msg.toString());
            });
            const commandStr = 'land';
            client.send(commandStr, 0, commandStr.length, PORT, HOST, function (err) {
                if (err) console.log(err);
            });
            return controller.json(response, 'success');
        } catch (e) {
            return controller.failure(response, e);
        }
    }
);

router.get(
    endpoint.takeoff,
    async (request, response) => {
        try {
            if (!_bind) {
                client.bind(8001);
                _bind = true;
            }
            client.on('message', (msg) => {
                console.log('Data received from server : ' + msg.toString());
            });
            const commandStr = 'takeoff';
            client.send(commandStr, 0, commandStr.length, PORT, HOST, function (err) {
                if (err) console.log(err);
            });
            return controller.json(response, 'success');
        } catch (e) {
            return controller.failure(response, e);
        }
    }
);

router.get(
    endpoint.command,
    async (request, response) => {
        try {
            console.log(_bind);
            if (!_bind) {
                client.bind(8002);
                _bind = true;
            }
            client.on('message', (msg) => {
                console.log('Data received from server : ' + msg.toString());
            });
            const commandStr = 'command';
            client.send(commandStr, 0, commandStr.length, PORT, HOST, function (err) {
                if (err) console.log(err);
            });
            return controller.json(response, 'success');
        } catch (e) {
            return controller.failure(response, e);
        }
    }
);

router.get(
    endpoint.streamon,
    async (request, response) => {
        try {
            if (!_bind) {
                client.bind(8003);
                _bind = true;
            }
            client.on('message', (msg) => {
                console.log('Data received from server : ' + msg.toString());
            });
            const commandStr = 'streamon';
            client.send(commandStr, 0, commandStr.length, PORT, HOST, function (err) {
                if (err) console.log(err);
            });
            return controller.json(response, 'success');
        } catch (e) {
            console.log(e);
            return controller.failure(response, e);
        }
    }
);

router.get(
    endpoint.video,
    async (request, response) => {
        try {
            return response.render('video');
        } catch (e) {
            console.log(e);
            return controller.failure(response, e);
        }
    }
);

module.exports = router;