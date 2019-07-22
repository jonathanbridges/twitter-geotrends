const express = require("express");
const app = express();
const global_trends = require("./routes/api/global_trends")
const bodyParser = require('body-parser')
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World"));
app.use("/api/global_trends", global_trends)
app.use(express.static('frontend'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
