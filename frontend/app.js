// const axios = require("axios");

console.log('this is coming from app.js');

// let trends = [];

// const fetchTrends = () => {
//   let url = '/api/global_trends/'
//   return axios.get(url)
//     .then(res => trends = trends.concat(res.data.data))
// };

// fetchTrends().then(data => console.log(trends));

// d3 information
/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */

function floatingTooltip(tooltipId, width) {
  // Local variable to hold tooltip div for
  // manipulation in other functions.
  // // debugger
  let tt = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', tooltipId)
    .style('pointer-events', 'none');
  // Set a width if it is provided.
  if (width) {
    tt.style('width', width);
  }

  // Initially it is hidden.
  hideTooltip();

  /*
   * Display tooltip with provided content.
   *
   * content is expected to be HTML string.
   *
   * event is d3.event for positioning.
   */

  function showTooltip(content, event) {
    // debugger
    tt.style('opacity', 1.0)
      .append(content);

    updatePosition(event, tt);
  }

  /*
   * Hide the tooltip div.
   */
  function hideTooltip() {
    tt.style('opacity', 0.0);
  }

  /*
   * Figure out where to place the tooltip
   * based on d3 mouse event.
   */
  function updatePosition(event, tt) {
    // debugger
    let xOffset = 20;
    let yOffset = 10;

    let ttw = tt.style('width', '100%');
    let tth = tt.style('height', '200px');

    // debugger
    let wscrY = window.scrollY;
    let wscrX = window.scrollX;

    let curX = (document.all) ? event.clientX + wscrX : event.pageX;
    let curY = (document.all) ? event.clientY + wscrY : event.pageY;
    let ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?
      curX - ttw - xOffset * 2 : curX + xOffset;

    if (ttleft < wscrX + xOffset) {
      ttleft = wscrX + xOffset;
    }

    let tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?
      curY - tth - yOffset * 2 : curY + yOffset;

    if (tttop < wscrY + yOffset) {
      tttop = curY + yOffset;
    }
    // // debugger
    tt
      .style('top', tttop + 'px')
      .style('left', ttleft + 'px');
  }

  return {
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    updatePosition: updatePosition
  };
}

function bubbleChart() {
  // Constants for sizing
  let width = 940;
  let height = 600;

  // tooltip for mouseover functionality
  let tooltip = floatingTooltip('trends_tooltip', 240);

  // moves bubbles near center
  let center = { x: width / 2, y: height / 2 };

  // @v4 strength to apply to the position forces
  let forceStrength = 0.03;

  // These will be set in create_nodes and create_vis
  let svg = null;
  let bubbles = null;
  let nodes = [];

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  // This is what creates the repulsion between nodes.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!
  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  let simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme
  let fillColor = d3.scaleOrdinal()
    .domain(['low', 'medium', 'high'])
    .range(['#d84b2a', '#beccae', '#7aa25c']);


  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number.
    let maxAmount = d3.max(rawData, function (d) { return d.tweet_volume; });

    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
    let radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 85])
      .domain([0, maxAmount]);

    // Use map() to convert raw data into node data.
    let myNodes = rawData.map((d, index) => {
      // // debugger
      if (d.tweet_volume === null) {
        d.tweet_volume = 25000
      }

      // debugger
      return {
        id: index,
        radius: radiusScale(d.tweet_volume),
        value: d.tweet_volume,
        name: d.name,
        url: d.url,
        group: d.query,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  let chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData.data);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { 
        return d.id; 
      });

      // .data(nodes, function (d) { return d.index; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    let bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.group); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
      .attr('stroke-width', 2)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y values of their bound node data.
   * These x and y values are modified by the force simulation.
   */
  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  /*
   * Sets visualization.
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideNames();

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  /*
   * Hides Name displays.
   */
  function hideNames() {
    // debugger
    svg.selectAll('.name').remove();
  }

  /*
   * Shows Name displays.
   */
  function showNames() {
    // debugger
    // Another way to do this would be to create
    // the name texts once and then just hide them.

    let namesData = d3.keys(namesX);
    let names = svg.selectAll('.name')
      .data(namesData);

    names.enter().append('text')
      .attr('class', 'name')
      .attr('x', function (d) { return namesX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');
    let content = '<span class="name">Trending: </span><span class="value">' +
      d.name + '</span><br/>';

    d3.select(this).append("text")
      
    // tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.group)).darker());

    tooltip.hideTooltip();
  }

  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

const myBubbleChart = bubbleChart();


// Function called once data is loaded from Twitter API.
// Calls bubble chart function to display inside #vis div.


function display(data) {
  myBubbleChart('#vis', data);
}

// load data

d3.json('/api/global_trends/').then(display);


/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
// function addCommas(nStr) {
//   nStr += '';
//   let x = nStr.split('.');
//   let x1 = x[0];
//   let x2 = x.length > 1 ? '.' + x[1] : '';
//   let rgx = /(\d+)(\d{3})/;
//   while (rgx.test(x1)) {
//     x1 = x1.replace(rgx, '$1' + ',' + '$2');
//   }

//   return x1 + x2;
// }
  

