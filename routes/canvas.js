const express = require('express');
const models = require('../models');

const router = express.Router();
const sequelize = models.sequelize;
const PixelsModel = models.Pixels;

router.get('/', (req, res) => {
  const query = `SELECT x, y, color
    FROM pixels
    where (x, y, "updatedAt") in (
      SELECT x, y, MAX("updatedAt") FROM pixels GROUP BY x, y
    );`;

  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  PixelsModel.create(req.body)
    .then((pixel) => {
      res.status(200).json(pixel);
    })
    .catch((error) => {
      console.log('here');
      console.log(error);
      res.status(500).json({ error });
    });
});

module.exports = router;
