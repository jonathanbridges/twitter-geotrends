const axios = require("axios");

console.log('this is coming from app.js');

let trends = [];

const fetchTrends = () => {
  let url = '/api/global_trends/'
  return axios.get(url)
    .then(res => trends = trends.concat(res.data.data))
};

// fetchTrends().then(data => console.log(trends));

// d3 information

fetchTrends()

// const center = {x: width / 2, y: height / 2};
// const forceStrength = 0.03;

// const simulation = d3.forceSimulation()
//   .velocityDecay(0.2)
//   .force('x', d3.forceX().strength(forceStrength).x(center.x))
//   .force('y', d3.forceY().strength(forceStrength).y(center.y))
//   .force('charge', d3.forceManyBody().strength(charge))
//   .on('tick', ticked);

// simulation.nodes(trends);
// simulation.force('center', d3.forceCenter(width / 2, height / 2));