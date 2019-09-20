/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! exports provided: display */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"display\", function() { return display; });\n/* harmony import */ var _tooltip_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tooltip.js */ \"./tooltip.js\");\n/* harmony import */ var _button_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button.js */ \"./button.js\");\n\n\n\nfunction bubbleChart() {\n\n  // Function that allows for selected circle to be appended as the last node on hover\n  d3.selection.prototype.moveToFront = function () {\n    return this.each(function () {\n      this.parentNode.appendChild(this);\n    });\n  };\n\n  // Retrieve window size for chart sizing\n  var width = document.getElementsByClassName(\"data-wrapper\")[0].clientWidth;\n  var height = document.getElementsByClassName(\"data-wrapper\")[0].clientHeight;\n\n  // tooltip for mouseover functionality\n  var tooltip = Object(_tooltip_js__WEBPACK_IMPORTED_MODULE_0__[\"floatingTooltip\"])('gates_tooltip', 240);\n\n  // moves bubbles near center\n  var center = { x: width / 2, y: height / 2 };\n\n  // strength to apply to the position forces\n  var forceStrength = 0.03;\n\n  // These will be set in create_nodes and create_vis\n  var svg = null;\n  var bubbles = null;\n  var nodes = [];\n\n  // Charge function that is called for each node\n  // This is what creates the repulsion between nodes\n  //\n  // Charge is proportional to the radius attribute of the\n  // circle\n  //\n  // Charge is negative so that nodes repel\n\n  function charge(d) {\n    return -Math.pow(d.radius, 2) * forceStrength;\n  }\n\n  // Create force simulation layout and add forces\n  let simulation = d3.forceSimulation()\n    .velocityDecay(0.2)\n    .force('x', d3.forceX().strength(forceStrength).x(center.x))\n    .force('y', d3.forceY().strength(forceStrength).y(center.y))\n    .force('charge', d3.forceManyBody().strength(charge))\n    .on('tick', ticked);\n\n  //  Stop force from starting automatically, as there are no nodes yet\n  simulation.stop();\n\n  // Add colors based off of scale of nodes\n  let fillColor = d3.scaleOrdinal()\n    .domain(['low', 'medium-low', 'medium', 'medium-height', 'high'])\n    .range(['#109BF2', '#26E2FF', '#B74567', '#A0B3FF', '#DEFFFC']);\n\n  /*\n   * Takes raw data from JSON returned by Twitter\n   * Converts it into an array of node objects\n   * Adds attributes to each node\n   * Returns new node array, with a node array for each element in raw data\n   */\n  function createNodes(rawData) {\n    // Use the max total_amount in the data as the max in the scale's domain\n    let maxAmount = d3.max(rawData, function (d) { return d.tweet_volume; });\n\n    // Sizes bubbles based on area\n    let radiusScale = d3.scalePow()\n      .exponent(0.5)\n      .range([2, 85])\n      .domain([0, maxAmount]);\n\n    // Use map() to convert raw data into node data\n    // If API returns null values assign values\n    let myNodes = rawData.map((d, index) => {\n      if (d.tweet_volume === null) {\n        d.tweet_volume = Math.floor(Math.random() * ((maxAmount/6) - 1000 + 1)) + 1000\n      }\n\n      return {\n        id: index,\n        radius: radiusScale(d.tweet_volume),\n        originalRadius: radiusScale(d.tweet_volume),\n        value: d.tweet_volume,\n        name: d.name,\n        url: d.url,\n        group: d.query,\n        x: Math.random() * 900,\n        y: Math.random() * 800\n      };\n    });\n\n    // Sort to prevent occlusion of smaller nodes\n    myNodes.sort(function (a, b) { return b.value - a.value; });\n\n    return myNodes;\n  }\n\n  /*\n   * This function is returned by the parent closure. \n   * It prepares the rawData for visualization, adds an svg element \n   * to the provided selector, and starts the visualization creation process\n   *\n   * Selector is a DOM element that points to the parent element of the bubble chart. \n   * Inside this element, the code will add the SVG continer for the visualization.\n   */\n\n  let chart = function chart(selector, rawData) {\n    // convert raw data into node data\n    nodes = createNodes(rawData.data);\n\n    // Create a SVG element inside the provided selector\n    svg = d3.select(selector)\n      .append('svg')\n      .attr('width', width)\n      .attr('height', height);\n\n    // Bind node data to what will become DOM elements to represent them.\n    bubbles = svg.selectAll('.bubble')\n      .data(nodes, function (d) { \n        return d.id; \n      });\n\n    // Create new circle elements each with class `bubble`.\n    // There will be one circle.bubble for each object in the nodes array.\n    // Initially, their radius (r attribute) will be 0.\n\n    let bubblesE = bubbles.enter().append('circle')\n      .classed('bubble', true)\n      .attr('r', 0)\n      .attr('fill', function (d) { return fillColor(d.group); })\n      .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })\n      .attr('stroke-width', 2)\n      .on('mouseover', showDetail)\n      .on('mouseout', hideDetail)\n      .on('click', function (d) {\n        window.open(\n          d.url,\n          '_blank'\n        );\n      });\n\n    // Merge the original empty selection and the enter selection\n    bubbles = bubbles.merge(bubblesE);\n\n    // Transition to make bubbles appear ending with the correct radius\n    bubbles.transition()\n      .duration(2000)\n      .attr('r', function (d) { return d.radius; });\n\n    // Set the simulation's nodes to newly created nodes array\n    // Once we set the nodes, the simulation will start running automatically\n    simulation.nodes(nodes);\n\n    // Set initial layout to single group\n    groupBubbles();\n  };\n\n  /*\n   * Callback function that is called after every tick of the\n   * force simulation\n   * Repositions the SVG circles based on the current x and y values \n   * of their bound node data\n   * The x and y values are modified by the force simulation\n   */\n\n  function ticked() {\n    bubbles\n      .attr('cx', function (d) { return d.x; })\n      .attr('cy', function (d) { return d.y; });\n  }\n\n  /*\n   * Sets visualization.\n   * tick function is set to move all nodes to the\n   * center of the visualization.\n   */\n\n  function groupBubbles() {\n    hideNames();\n\n    // Reset the 'x' force to draw the bubbles to the center\n    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));\n\n    // Reset the alpha value and restart the simulation\n    simulation.alpha(1).restart();\n  }\n\n  // Hide Name displays\n\n  function hideNames() {\n    svg.selectAll('.name').remove();\n  }\n\n   // This function calls the tooltip on mouseover\n\n  function showDetail(d) {\n    // changes outline to indicate hover state\n    // calls moveToFront to move circle to top level\n    // increases radius of circle\n    \n    d3.select(this)\n    .moveToFront()\n    .attr('stroke', 'black')\n    .transition()\n    .duration(300)\n    .style(\"opacity\", 1.0)\n    .attr(\"r\", d.radius*1.25);\n\n    let content = '<span class=\"name\">Trending: </span><span class=\"value\">' +\n      d.name + '</span><br/>' +\n                  '<span class=\"  name\">Tweet Volume: </span><span class=\"value\">' +\n      d.value + '</span>';\n\n    tooltip.showTooltip(content, d3.event);\n  }\n\n  // Hides tooltip\n\n  function hideDetail(d) {\n    // reset styles from showDetail()\n\n    d3.select(this)\n      .attr('stroke', d3.rgb(fillColor(d.group)).darker())\n      .transition()\n      .duration(200)\n      .attr(\"r\", d.originalRadius)\n      .style(\"opacity\", .9);\n\n    tooltip.hideTooltip();\n  }\n\n  // return the chart function from closure\n  return chart;\n}\n\n/*\n * Initialization code as well as some helper functions\n * to create a new bubble chart instance, load the data, and display it.\n */\n\nconst myBubbleChart = bubbleChart();\n\n// Function called once data is loaded from Twitter API.\n// Calls bubble chart function to display inside #vis div\n\nfunction display(data) {\n  myBubbleChart('#vis', data);\n}\n\nd3.json('/api/global_trends/1').then(display);\n\n//# sourceURL=webpack:///./app.js?");

/***/ }),

/***/ "./button.js":
/*!*******************!*\
  !*** ./button.js ***!
  \*******************/
/*! exports provided: dropDown */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"dropDown\", function() { return dropDown; });\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.js */ \"./app.js\");\n// Button Functions\n\n\n\nconst menu = document.getElementById(\"change-chart\");\n\n// This function queries the Twitter API when \n// a selection has been made from the dropdown menu\n\nconst dropDown = (event) => {\n\n  document.getElementById(\"vis\").innerHTML = \"\";\n  d3.json(`/api/global_trends/${menu.value}`).then(_app_js__WEBPACK_IMPORTED_MODULE_0__[\"display\"]);\n  console.log(`${menu.value} has loaded`)\n\n}\n\nmenu.addEventListener(\"change\", dropDown);\n\n//# sourceURL=webpack:///./button.js?");

/***/ }),

/***/ "./tooltip.js":
/*!********************!*\
  !*** ./tooltip.js ***!
  \********************/
/*! exports provided: floatingTooltip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"floatingTooltip\", function() { return floatingTooltip; });\n/*\n * Creates tooltip with provided id that\n * floats on top of visualization.\n */\n\nvar floatingTooltip = (tooltipId, width) => {\n  // Local variable to hold tooltip div for\n  // manipulation in other functions\n  var tt = d3.select('body')\n    .append('div')\n    .attr('class', 'tooltip')\n    .attr('id', tooltipId)\n    .style('pointer-events', 'none');\n\n  // Set a width if it is provided\n  if (width) {\n    tt.style('width', width);\n  }\n\n  // Hide tooltip initially\n  hideTooltip();\n\n  /*\n   * Display tooltip with provided content (HTML string)\n   * event is d3.event for positioning.\n   */\n\n  function showTooltip(content, event) {\n    tt.style('opacity', 1.0)\n      .html(content);\n\n    updatePosition(event);\n  }\n\n  // hides tooltip div\n\n  function hideTooltip() {\n    tt.style('opacity', 0.0);\n  }\n\n  /*\n   * Figure out where to place the tooltip\n   * based on d3 mouse event.\n   */\n  \n  function updatePosition(event) {\n    var xOffset = 20;\n    var yOffset = 10;\n\n    var ttw = tt.style('width');\n    var tth = tt.style('height');\n\n    var wscrY = window.scrollY;\n    var wscrX = window.scrollX;\n\n    var curX = (document.all) ? event.clientX + wscrX : event.pageX;\n    var curY = (document.all) ? event.clientY + wscrY : event.pageY;\n    var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?\n      curX - ttw - xOffset * 2 : curX + xOffset;\n\n    if (ttleft < wscrX + xOffset) {\n      ttleft = wscrX + xOffset;\n    }\n\n    var tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?\n      curY - tth - yOffset * 2 : curY + yOffset;\n\n    if (tttop < wscrY + yOffset) {\n      tttop = curY + yOffset;\n    }\n\n    tt\n      .style('top', tttop + 'px')\n      .style('left', ttleft + 'px');\n  }\n\n  return {\n    showTooltip: showTooltip,\n    hideTooltip: hideTooltip,\n    updatePosition: updatePosition\n  };\n}\n\n\n//# sourceURL=webpack:///./tooltip.js?");

/***/ })

/******/ });