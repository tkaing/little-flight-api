const express = require("express");
const controller = require('./../api/api_controller');
const endpoint = require('../endpoints/drone');
const router = express.Router();

const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const PORT = 8889;
const HOST = '192.168.10.1';

let already_bind = false;

router.get(
    endpoint.land,
    async (request, response) => {
        try {
            if (!already_bind) {
                client.bind(8001);
                already_bind = true;
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
            if (!already_bind) {
                client.bind(8001);
                already_bind = true;
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
            if (!already_bind) {
                client.bind(8001);
                already_bind = true;
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

module.exports = router;