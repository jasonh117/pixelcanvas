const express = require('express');
const HTTPStatus = require('http-status');
const nconf = require('nconf');
const models = require('../models');
const { errorCodes } = require('../lib/error');
const jwt = require('../lib/jwt');

const router = express.Router();
const cookieConfig = nconf.get('cookieConfig');
const sequelize = models.sequelize;
const UserModel = models.Users;

router.post('/', (req, res) => {
  if (!req.body.email || !req.body.email.trim()) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_EMAIL });
    return;
  }

  if (!req.body.username || !req.body.username.trim()) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_USERNAME });
    return;
  }

  if (!req.body.password || !req.body.password.trim()) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_PASSWORD });
    return;
  }

  UserModel.create(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
});

router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.email.trim()) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_EMAIL });
    return;
  }

  if (!req.body.password || !req.body.password.trim()) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_PASSWORD });
    return;
  }

  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password.trim();
  const where = {
    email,
  };

  UserModel.findOne({ where })
    .then((user) => {
      if (!user) {
        res.status(HTTPStatus.NOT_FOUND).json({ error: errorCodes.USER_NOT_FOUND });
        return;
      }

      if (!user.comparePassword(password)) {
        res.status(HTTPStatus.UNAUTHORIZED).json({ error: errorCodes.USER_INVALID_CREDENTIALS });
        return;
      }

      const userObj = user.toJSON();
      const userJwt = jwt.generateToken(userObj);
      res.cookie(cookieConfig.name, userJwt);
      userObj.jwt = userJwt;
      res.cookie(cookieConfig.name, userJwt, cookieConfig.options);
      res.status(HTTPStatus.OK).json({ data: userObj });
    })
    .catch((err) => {
      res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ err });
    });
});

module.exports = router;
