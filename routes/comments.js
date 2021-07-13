const express = require('express');
const passport = require('passport');
const Router = express.Router();

const commentsController = require('../controllers/comments_controller');

Router.post('/create',passport.checkAuthentication,commentsController.create);
Router.get('/destroy/:id',passport.checkAuthentication,commentsController.destroy);

module.exports = Router;