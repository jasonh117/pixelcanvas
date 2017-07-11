const express = require('express');
const jwt = require('jsonwebtoken');
const nconf = require('nconf');
const models = require('../models');

const jwtConfig = nconf.get('jwt');
const router = express.Router();
const UserModel = models.Users;

router.get('/', function(req, res) {
  const jwtOptions = {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  };

  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, jwtConfig.secret, jwtOptions, (err, payload) => {
      if (err) {
        res.render('index');
        return;
      }

      UserModel.findOne({
        where: {
          id: payload.id,
        },
      })
        .then((user) => {
          if (!user) {
            res.render('index');
            return;
          }
          res.render('index', { user });
        });
    });
  } else {
    res.render('index');
  }
});

module.exports = router;
