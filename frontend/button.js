// Button Functions
import { display } from './app.js'

// export const addButtonListeners = () => {
//   document.getElementById("btn-sf").addEventListener("click", function () {
//     document.getElementById("vis").innerHTML = `<div class="header-text"><span class="location">San Francisco</span> Twitter Trends:</div>`;
//     document.getElementById("location").innerHTML = `<span>San Francisco</span>`;
//     d3.json('/api/global_trends/2487956').then(display);
//   });

//   document.getElementById("btn-mont").addEventListener("click", function () {
//     document.getElementById("vis").innerHTML = `<div class="header-text"><span class="location">Montréal</span> Twitter Trends:</div>`;
//     document.getElementById("location").innerHTML = `<span>Montréal</span>`;
//     d3.json('/api/global_trends/3534').then(display);
//   });
  
//   document.getElementById("btn-istan").addEventListener("click", function () {
//     document.getElementById("vis").innerHTML = `<div class="header-text"><span class="location">Istanbul</span> Twitter Trends:</div>`;
//     document.getElementById("location").innerHTML = `<span>Istanbul</span>`;
//     d3.json('/api/global_trends/2344116').then(display);
//   });
  
//   document.getElementById("btn-sp").addEventListener("click", function () {
//     document.getElementById("vis").innerHTML = `<div class="header-text"><span class="location">São Paulo</span> Twitter Trends:</div>`;
//     document.getElementById("location").innerHTML = `<span>São Paulo</span>`;
//     d3.json('/api/global_trends/455827').then(display);
//   });
  
//   document.getElementById("btn-lon").addEventListener("click", function () {
//     document.getElementById("vis").innerHTML = `<div class="header-text"><span class="location">London</span> Twitter Trends:</div>`;
//     document.getElementById("location").innerHTML = `<span>London</span>`;
//     d3.json('/api/global_trends/44418').then(display);
//   });
  
//   document.getElementById("btn-syd").addEventListener("click", function () {
//     document.getElementById("vis").innerHTML = `<div class="header-text"><span class="location">Sydney</span> Twitter Trends:</div>`;
//     document.getElementById("location").innerHTML = `<span>Sydney</span>`;
//     d3.json('/api/global_trends/1105779').then(display);
//   });
  
//   document.getElementById("btn-ny").addEventListener("click", function () {
//     document.getElementById("vis").innerHTML = `<div class="header-text"><span class="location">New York</span> Twitter Trends:</div>`;
//     document.getElementById("location").innerHTML = `<span>New York</span>`;
//     d3.json('/api/global_trends/2459115').then(display);
//   });
// }




const menu = document.getElementById("change_chart");

const dropDown = (event) => {

  document.getElementById("vis").innerHTML = "";
  d3.json(`/api/global_trends/${menu.value}`).then(display);
  console.log(`${menu.value} has loaded`)

}

menu.addEventListener("change", dropDown);

