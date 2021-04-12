const express = require("express");

const schema = require('./../api/api_schema');
const mongodb = require('./../api/api_mongodb');
const security = require('./../api/api_security');
const validator = require('./../api/api_validator');

const router = express.Router();
const collection = schema.multimedias;

module.exports = router;
