const keu = require("kue");

const queue = keu.createQueue();

module.exports = queue;