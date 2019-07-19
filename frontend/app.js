import axios from 'axios';

console.log('this is coming from app.js');

let trends = [];

const fetchTrends = () => {
  let url = '/api/global_trends/global_trends'
  return axios.get(url)
    .then(res => trends = trends.concat(res.data.data))
};

fetchTrends().then(data => console.log(trends));
