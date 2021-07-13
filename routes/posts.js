const express = require('express');
const passport = require('passport');
const Router = express.Router();

const postsController = require('../controllers/posts_controller');

Router.post('/create',passport.checkAuthentication,postsController.create);
Router.get('/destroy/:id',passport.checkAuthentication,postsController.destroy);
module.exports = Router;