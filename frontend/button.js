// Button Functions

import { display } from './app.js'

const menu = document.getElementById("change-chart");

// This function queries the Twitter API when 
// a selection has been made from the dropdown menu

export const dropDown = (event) => {
  document.getElementById("vis").innerHTML = "";
  d3.json(`/api/global_trends/${menu.value}`).then(display);
}

menu.addEventListener("change", dropDown);