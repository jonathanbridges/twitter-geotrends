const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const axios = require("axios");

const locIds = {
  SanFrancisco: 2487956,
  Montreal: 3534,
  Istanbul: 2344116,
  SaoPaulo: 455827,
  London: 44418,
  Sydney: 1105779
}

router.get("/test", (req, res) => res.json({ msg: "This is the global trends route" }));

router.get('/global_trends', (req, res) => {

  const getTrends = (locId = 1) => {
    let url = `https://api.twitter.com/1.1/trends/place.json?id=${locId}`;
    let token = keys.twitterToken;
    return axios.get(url, { headers: { "Authorization": `Bearer ${token}` } })
      .then(response => response.data);
  };

  getTrends().then(data => {
    res.json({
      message: "Request received!",
      data
    })
  })

});

module.exports = router;
