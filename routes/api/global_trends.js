const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const axios = require("axios");

router.get('/:id?', (req, res) => {

  const getTrends = () => {
    let locId = req.params.id || 1
    let url = `https://api.twitter.com/1.1/trends/place.json?id=${locId}`;
    let token = keys.twitterToken;
    return axios.get(url, { headers: { "Authorization": `Bearer ${token}` } })
      .then(response => response.data);
  };

  getTrends().then(data => {
    res.json({
      message: "Request received!",
      data: data[0].trends
    })
  })

});

module.exports = router;
