const express = require("express");
const nconf = require("nconf");
const models = require("../models");
const nyanCat = require("../pixelimages/nyanCat.json");
const jwt = require("../lib/jwt");
const jwtConfig = nconf.get("jwt");
const wss = require('../socket');

const router = express.Router();
const sequelize = models.sequelize;
const PixelsModel = models.Pixels;
const UserModel = models.Users;

router.get("/", (req, res) => {
  const query = `SELECT x, y, color
    FROM pixels
    where (x, y, "updatedAt") in (
      SELECT x, y, MAX("updatedAt") FROM pixels GROUP BY x, y
    );`;

  sequelize
    .query(query, { type: sequelize.QueryTypes.SELECT })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", jwt.authenticate, (req, res) => {
  const body = req.body;
  body.userid = req.user.id;
  
  const query = `SELECT MAX("updatedAt") AS "time" FROM pixels WHERE "userid" = ${req.user.id};`;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    .then((lastTime) => {
      const time = lastTime[0].time;
      const now = new Date();
      const diff = now - time;
      
      if (diff > (10 * 1000)) {
        PixelsModel.create(body)
          .then(pixel => {
            console.log(JSON.stringify(pixel));
            wss.broadcast(JSON.stringify(pixel));
            res.status(201).json(pixel);
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error });
          });
      } else {
        res.status(400).json({ error: 'Cannot place pixel yet. Try again later.' });
      }
    });
});

router.post("/nyancat", (req, res) => {
  // res.status(200).json(nyanCat);
  let x = 0;
  let y = 0;
  const addPixels = [];
  nyanCat.data.map(color => {
    addPixels.push(PixelsModel.create({ color, x, y }));
    if (x === nyanCat.x - 1) {
      x = 0;
      y += 1;
    } else {
      x += 1;
    }
  });

  Promise.all(addPixels)
    .then(pixel => {
      res.status(200).json(pixel);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

module.exports = router;
