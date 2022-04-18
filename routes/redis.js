const express = require('express');
const router = express.Router();
const Redis = require('redis');
const axios = require('axios');

// const redisUrl = 'redis://default:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@127.0.0.0:6379';
// const redisClient = new Redis.createClient({ url: redisUrl });
const redisClient = new Redis.createClient();
(async () => {
  await redisClient.connect();
  redisClient.sendCommand(['auth', process.env.REDIS_PASSWORD]);
})();

// redisClient.on('connect', () => console.log('::> Redis Client Connected'));
// redisClient.on('error', (err) => console.log('<:: Redis Client Error', err));

router.get('/photos', async (req, res) => {
  const albumId = req.query.albumId;

  const photos = await getOrSetCache(`photos?albumId=${albumId}`, async () => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/photos', {
      params: { albumId },
    });
    return data;
  });
  res.json(photos);
});

router.get('/photos/:id', async (req, res) => {
  const photo = await getOrSetCache(`photo:${req.params.id}`, async () => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
    );
    return data;
  });
  res.json(photo);
});

function getOrSetCache(key, cb) {
  return new Promise((resolve, reject) => {
    redisClient
      .get(key)
      .then(async (data) => {
        if (data != null) {
          console.log('Cached Data');
          return resolve(JSON.parse(data));
        }

        console.log('Fresh Data');
        const freshData = await cb();
        await redisClient.setEx(
          key,
          process.env.REDIS_DEFAULT_EXPIRATION,
          JSON.stringify(freshData)
        );
        resolve(freshData);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = router;
