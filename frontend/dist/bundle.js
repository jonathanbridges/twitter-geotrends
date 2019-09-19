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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"display\", function() { return display; });\n/* harmony import */ var _tooltip_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tooltip.js */ \"./tooltip.js\");\n/* harmony import */ var _button_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button.js */ \"./button.js\");\n\n// import { addButtonListeners } from './button.js'\n\n\nfunction bubbleChart() {\n\n  // Constants for sizing\n  // var width = 940;\n  var width = document.getElementsByClassName(\"data-wrapper\")[0].clientWidth;\n\n  // var height = 600;\n  var height = document.getElementsByClassName(\"data-wrapper\")[0].clientHeight;\n\n\n  // tooltip for mouseover functionality\n  var tooltip = Object(_tooltip_js__WEBPACK_IMPORTED_MODULE_0__[\"floatingTooltip\"])('gates_tooltip', 240);\n\n  // moves bubbles near center\n  var center = { x: width / 2, y: height / 2 };\n\n  // @v4 strength to apply to the position forces\n  var forceStrength = 0.03;\n\n  // These will be set in create_nodes and create_vis\n  var svg = null;\n  var bubbles = null;\n  var nodes = [];\n\n  // Charge function that is called for each node.\n  // As part of the ManyBody force.\n  // This is what creates the repulsion between nodes.\n  //\n  // Charge is proportional to the diameter of the\n  // circle (which is stored in the radius attribute\n  // of the circle's associated data.\n  //\n  // This is done to allow for accurate collision\n  // detection with nodes of different sizes.\n  //\n  // Charge is negative because we want nodes to repel.\n  // @v4 Before the charge was a stand-alone attribute\n  //  of the force layout. Now we can use it as a separate force!\n  function charge(d) {\n    return -Math.pow(d.radius, 2.0) * forceStrength;\n  }\n\n  // Here we create a force layout and\n  // @v4 We create a force simulation now and\n  //  add forces to it.\n  let simulation = d3.forceSimulation()\n    .velocityDecay(0.2)\n    .force('x', d3.forceX().strength(forceStrength).x(center.x))\n    .force('y', d3.forceY().strength(forceStrength).y(center.y))\n    .force('charge', d3.forceManyBody().strength(charge))\n    .on('tick', ticked);\n\n  // @v4 Force starts up automatically,\n  //  which we don't want as there aren't any nodes yet.\n  simulation.stop();\n\n  // Nice looking colors - no reason to buck the trend\n  // @v4 scales now have a flattened naming scheme\n  let fillColor = d3.scaleOrdinal()\n    .domain(['low', 'medium-low', 'medium', 'medium-height', 'high'])\n    .range(['#109BF2', '#26E2FF', '#B74567', '#A0B3FF', '#DEFFFC']);\n\n  /*\n   * This data manipulation function takes the raw data from\n   * the CSV file and converts it into an array of node objects.\n   * Each node will store data and visualization values to visualize\n   * a bubble.\n   *\n   * rawData is expected to be an array of data objects, read in from\n   * one of d3's loading functions like d3.csv.\n   *\n   * This function returns the new node array, with a node in that\n   * array for each element in the rawData input.\n   */\n  function createNodes(rawData) {\n    // Use the max total_amount in the data as the max in the scale's domain\n    // note we have to ensure the total_amount is a number.\n    let maxAmount = d3.max(rawData, function (d) { return d.tweet_volume; });\n\n    // Sizes bubbles based on area.\n    // @v4: new flattened scale names.\n    let radiusScale = d3.scalePow()\n      .exponent(0.5)\n      .range([2, 85])\n      .domain([0, maxAmount]);\n\n    // Use map() to convert raw data into node data.\n    let myNodes = rawData.map((d, index) => {\n      if (d.tweet_volume === null) {\n        d.tweet_volume = Math.floor(Math.random() * ((maxAmount/6) - 1000 + 1)) + 1000\n      }\n\n      return {\n        id: index,\n        radius: radiusScale(d.tweet_volume),\n        value: d.tweet_volume,\n        name: d.name,\n        url: d.url,\n        group: d.query,\n        x: Math.random() * 900,\n        y: Math.random() * 800\n      };\n    });\n\n    // sort them to prevent occlusion of smaller nodes.\n    myNodes.sort(function (a, b) { return b.value - a.value; });\n\n    return myNodes;\n  }\n\n  /*\n   * Main entry point to the bubble chart. This function is returned\n   * by the parent closure. It prepares the rawData for visualization\n   * and adds an svg element to the provided selector and starts the\n   * visualization creation process.\n   *\n   * selector is expected to be a DOM element or CSS selector that\n   * points to the parent element of the bubble chart. Inside this\n   * element, the code will add the SVG continer for the visualization.\n   *\n   * rawData is expected to be an array of data objects as provided by\n   * a d3 loading function like d3.csv.\n   */\n  let chart = function chart(selector, rawData) {\n    // convert raw data into nodes data\n    nodes = createNodes(rawData.data);\n\n    // Create a SVG element inside the provided selector\n    // with desired size.\n    svg = d3.select(selector)\n      .append('svg')\n      .attr('width', width)\n      .attr('height', height);\n\n    // Bind nodes data to what will become DOM elements to represent them.\n    bubbles = svg.selectAll('.bubble')\n      .data(nodes, function (d) { \n        return d.id; \n      });\n\n      // .data(nodes, function (d) { return d.index; });\n\n    // Create new circle elements each with class `bubble`.\n    // There will be one circle.bubble for each object in the nodes array.\n    // Initially, their radius (r attribute) will be 0.\n    // @v4 Selections are immutable, so lets capture the\n    //  enter selection to apply our transtition to below.\n    let bubblesE = bubbles.enter().append('circle')\n      .classed('bubble', true)\n      .attr('r', 0)\n      .attr('fill', function (d) { return fillColor(d.group); })\n      .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })\n      .attr('stroke-width', 2)\n      .on('mouseover', showDetail)\n      .on('mouseout', hideDetail)\n      .on('click', function (d) {\n        console.log('open tab')\n        window.open(\n          d.url,\n          '_blank' // <- This is what makes it open in a new window.\n        );\n      });\n\n    // @v4 Merge the original empty selection and the enter selection\n    bubbles = bubbles.merge(bubblesE);\n\n    // Fancy transition to make bubbles appear, ending with the\n    // correct radius\n    bubbles.transition()\n      .duration(2000)\n      .attr('r', function (d) { return d.radius; });\n\n    // Set the simulation's nodes to our newly created nodes array.\n    // @v4 Once we set the nodes, the simulation will start running automatically!\n    simulation.nodes(nodes);\n\n    // Set initial layout to single group.\n    groupBubbles();\n  };\n\n  /*\n   * Callback function that is called after every tick of the\n   * force simulation.\n   * Here we do the acutal repositioning of the SVG circles\n   * based on the current x and y values of their bound node data.\n   * These x and y values are modified by the force simulation.\n   */\n  function ticked() {\n    bubbles\n      .attr('cx', function (d) { return d.x; })\n      .attr('cy', function (d) { return d.y; });\n  }\n\n  /*\n   * Sets visualization.\n   * tick function is set to move all nodes to the\n   * center of the visualization.\n   */\n  function groupBubbles() {\n    hideNames();\n\n    // @v4 Reset the 'x' force to draw the bubbles to the center.\n    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));\n\n    // @v4 We can reset the alpha value and restart the simulation\n    simulation.alpha(1).restart();\n  }\n  /*\n   * Hides Name displays.\n   */\n  function hideNames() {\n    // debugger\n    svg.selectAll('.name').remove();\n  }\n\n  /*\n   * Function called on mouseover to display the\n   * details of a bubble in the tooltip.\n   */\n  function showDetail(d) {\n    // change outline to indicate hover state.\n    d3.select(this).attr('stroke', 'black');\n    let content = '<span class=\"name\">Trending: </span><span class=\"value\">' +\n      d.name + '</span><br/>' +\n                  '<span class=\"name\">Tweet Volume: </span><span class=\"value\">' +\n      d.value + '</span>';\n\n    tooltip.showTooltip(content, d3.event);\n  }\n\n  // Hides tooltip\n\n  function hideDetail(d) {\n    // reset outline\n    d3.select(this)\n      .attr('stroke', d3.rgb(fillColor(d.group)).darker());\n\n    tooltip.hideTooltip();\n  }\n\n  // return the chart function from closure.\n  return chart;\n}\n\n/*\n * Below is the initialization code as well as some helper functions\n * to create a new bubble chart instance, load the data, and display it.\n */\n\nconst myBubbleChart = bubbleChart();\n\n// Function called once data is loaded from Twitter API.\n// Calls bubble chart function to display inside #vis div.\n\nfunction display(data) {\n  myBubbleChart('#vis', data);\n}\n\nd3.json('/api/global_trends/1').then(display);\n\n\n// addButtonListeners();\n\n\n\n//# sourceURL=webpack:///./app.js?");

/***/ }),

/***/ "./button.js":
/*!*******************!*\
  !*** ./button.js ***!
  \*******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.js */ \"./app.js\");\n// Button Functions\n\n\nconst menu = document.getElementById(\"change-chart\");\n\nconst dropDown = (event) => {\n\n  document.getElementById(\"vis\").innerHTML = \"\";\n  d3.json(`/api/global_trends/${menu.value}`).then(_app_js__WEBPACK_IMPORTED_MODULE_0__[\"display\"]);\n  console.log(`${menu.value} has loaded`)\n\n}\n\nmenu.addEventListener(\"change\", dropDown);\n\n\n\n//# sourceURL=webpack:///./button.js?");

/***/ }),

/***/ "./tooltip.js":
/*!********************!*\
  !*** ./tooltip.js ***!
  \********************/
/*! exports provided: floatingTooltip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"floatingTooltip\", function() { return floatingTooltip; });\n/*\n * Creates tooltip with provided id that\n * floats on top of visualization.\n * Most styling is expected to come from CSS\n * so check out bubble_chart.css for more details.\n */\nvar floatingTooltip = (tooltipId, width) => {\n  // Local variable to hold tooltip div for\n  // manipulation in other functions.\n  var tt = d3.select('body')\n    .append('div')\n    .attr('class', 'tooltip')\n    .attr('id', tooltipId)\n    .style('pointer-events', 'none');\n\n  // Set a width if it is provided.\n  if (width) {\n    tt.style('width', width);\n  }\n\n  // Initially it is hidden.\n  hideTooltip();\n\n  /*\n   * Display tooltip with provided content.\n   *\n   * content is expected to be HTML string.\n   *\n   * event is d3.event for positioning.\n   */\n  function showTooltip(content, event) {\n    tt.style('opacity', 1.0)\n      .html(content);\n\n    updatePosition(event);\n  }\n\n  /*\n   * Hide the tooltip div.\n   */\n  function hideTooltip() {\n    tt.style('opacity', 0.0);\n  }\n\n  /*\n   * Figure out where to place the tooltip\n   * based on d3 mouse event.\n   */\n  function updatePosition(event) {\n    var xOffset = 20;\n    var yOffset = 10;\n\n    var ttw = tt.style('width');\n    var tth = tt.style('height');\n\n    var wscrY = window.scrollY;\n    var wscrX = window.scrollX;\n\n    var curX = (document.all) ? event.clientX + wscrX : event.pageX;\n    var curY = (document.all) ? event.clientY + wscrY : event.pageY;\n    var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?\n      curX - ttw - xOffset * 2 : curX + xOffset;\n\n    if (ttleft < wscrX + xOffset) {\n      ttleft = wscrX + xOffset;\n    }\n\n    var tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?\n      curY - tth - yOffset * 2 : curY + yOffset;\n\n    if (tttop < wscrY + yOffset) {\n      tttop = curY + yOffset;\n    }\n\n    tt\n      .style('top', tttop + 'px')\n      .style('left', ttleft + 'px');\n  }\n\n  return {\n    showTooltip: showTooltip,\n    hideTooltip: hideTooltip,\n    updatePosition: updatePosition\n  };\n}\n\n\n//# sourceURL=webpack:///./tooltip.js?");

/***/ })

/******/ });