#!/usr/bin/env node

const debug = require('debug')('http-service:server');
const HTTP_PORT = process.env.HTTP_PORT || 8080;

console.log(`SERVER UP ON PORT ${HTTP_PORT}`);
