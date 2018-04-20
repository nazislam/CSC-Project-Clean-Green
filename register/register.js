/* jshint esversion: 6 */
/* jshint node: true */


'use strict';

const express = require('express');
const registerRouter = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const validator = require('express-validator');
const {check, validationResult} = require('express-validator/check');

function getModel() {
  return require('./model-datastore');
}

registerRouter.use(bodyParser.json());
registerRouter.use(bodyParser.urlencoded({ extended: false }));
registerRouter.use(validator());

registerRouter.route('/')
  .get((req, res) => {
    res.render('../views/register');
  })
  .post((req, res) => {
    req.login(req.body, () => {
      const data = req.body;
      if (data.userType === 'client') {
        data.sentRequests = [];
        getModel().createClient(data);
        res.redirect('/register/clientUI');
      }
      else {
        data.listOfpickups = [];
        getModel().createDriver(data);
        res.redirect('/register/driverUI');
      }

    });
  });

registerRouter.route('/signIn').post(
  passport.authenticate(['local', 'local2'], { session: true, 
    // successRedirect: '/register/profile', 
    failureRedirect: '/' }),
  (req, res) => {
    // res.redirect('/register/profile');
    console.log(req.user);
    if (req.user.userType === 'client')
      res.redirect('/register/clientUI');
    else
      res.redirect('/register/driverUI');
  }
);


registerRouter.route('/profile')
  .all(function(req, res, next) {
    if (!req.user) {
      res.redirect('/');
    }
    next();
  })
  .get((req, res) => {
    res.render('profile', { user: req.user });
  });


registerRouter.route('/clientUI')
  .all(function(req, res, next) {
    if (!req.user) {
      res.redirect('/');
    }
    next();
  })
  .get((req, res) => {
    const message = '';
    res.render('clientUI', { user: req.user, location: {}, response: message });
  });


registerRouter.route('/driverUI')
  .all(function(req, res, next) {
    if (!req.user) {
      res.redirect('/');
    }
    next();
  })
  .get((req, res) => {
    const message = '';
    res.render('driverUI', { user: req.user, location: {}, response: message });
  });

registerRouter.route('/mapui/mylist')
  .all(function(req, res, next) {
    if (!req.user) {
      res.redirect('/');
    }
    next();
  })
  .get((req, res) => {
    res.render('myList', { user: req.user });
  });



module.exports = registerRouter;
