// Button Functions
import { display } from './app.js'

const menu = document.getElementById("change-chart");

const dropDown = (event) => {

  document.getElementById("vis").innerHTML = "";
  d3.json(`/api/global_trends/${menu.value}`).then(display);
  console.log(`${menu.value} has loaded`)

}

menu.addEventListener("change", dropDown);

