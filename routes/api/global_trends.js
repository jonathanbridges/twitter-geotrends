const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const axios = require("axios");

router.get("/test", (req, res) => res.json({ msg: "This is the global trends route" }));

router.get('/global_trends', (req, res) => {

  const getTweets = () => {
    let url = `https://api.twitter.com/1.1/trends/place.json?id=2487956`;
    let token = keys.twitterToken;
    return axios.get(url, { headers: { "Authorization": `Bearer ${token}` } })
      .then(response => response.data);
  };

  getTweets().then(data => {
    res.json({
      message: "Request received!",
      data
    })
  })

});

module.exports = router;
