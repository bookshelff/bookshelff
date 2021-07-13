const express = require('express');
const passport = require('passport');
const Router = express.Router();

const likesController = require('../controllers/likes_controller');

Router.get('/toggle',passport.checkAuthentication,likesController.toggleLike);

module.exports = Router;