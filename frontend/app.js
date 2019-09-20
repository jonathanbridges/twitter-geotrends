import { floatingTooltip } from './tooltip.js'
import { dropDown } from './button.js'

function bubbleChart() {

  // Function that allows for selected circle to be appended as the last node on hover
  d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
      this.parentNode.appendChild(this);
    });
  };

  // Retrieve window size for chart sizing
  var width = document.getElementsByClassName("data-wrapper")[0].clientWidth;
  var height = document.getElementsByClassName("data-wrapper")[0].clientHeight;

  // tooltip for mouseover functionality
  var tooltip = floatingTooltip('gates_tooltip', 240);

  // moves bubbles near center
  var center = { x: width / 2, y: height / 2 };

  // strength to apply to the position forces
  var forceStrength = 0.03;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Charge function that is called for each node
  // This is what creates the repulsion between nodes
  //
  // Charge is proportional to the radius attribute of the
  // circle
  //
  // Charge is negative so that nodes repel

  function charge(d) {
    return -Math.pow(d.radius, 2) * forceStrength;
  }

  // Create force simulation layout and add forces
  let simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  //  Stop force from starting automatically, as there are no nodes yet
  simulation.stop();

  // Add colors based off of scale of nodes
  let fillColor = d3.scaleOrdinal()
    .domain(['low', 'medium-low', 'medium', 'medium-height', 'high'])
    .range(['#109BF2', '#26E2FF', '#B74567', '#A0B3FF', '#DEFFFC']);

  /*
   * Takes raw data from JSON returned by Twitter
   * Converts it into an array of node objects
   * Adds attributes to each node
   * Returns new node array, with a node array for each element in raw data
   */
  function createNodes(rawData) {
    // Use the max total_amount in the data as the max in the scale's domain
    let maxAmount = d3.max(rawData, function (d) { return d.tweet_volume; });

    // Sizes bubbles based on area
    let radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 85])
      .domain([0, maxAmount]);

    // Use map() to convert raw data into node data
    // If API returns null values assign values
    let myNodes = rawData.map((d, index) => {
      if (d.tweet_volume === null) {
        d.tweet_volume = Math.floor(Math.random() * ((maxAmount/6) - 1000 + 1)) + 1000
      }

      return {
        id: index,
        radius: radiusScale(d.tweet_volume),
        originalRadius: radiusScale(d.tweet_volume),
        value: d.tweet_volume,
        name: d.name,
        url: d.url,
        group: d.query,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });

    // Sort to prevent occlusion of smaller nodes
    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

  /*
   * This function is returned by the parent closure. 
   * It prepares the rawData for visualization, adds an svg element 
   * to the provided selector, and starts the visualization creation process
   *
   * Selector is a DOM element that points to the parent element of the bubble chart. 
   * Inside this element, the code will add the SVG continer for the visualization.
   */

  let chart = function chart(selector, rawData) {
    // convert raw data into node data
    nodes = createNodes(rawData.data);

    // Create a SVG element inside the provided selector
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind node data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { 
        return d.id; 
      });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.

    let bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.group); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
      .attr('stroke-width', 2)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail)
      .on('click', function (d) {
        window.open(
          d.url,
          '_blank'
        );
      });

    // Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Transition to make bubbles appear ending with the correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to newly created nodes array
    // Once we set the nodes, the simulation will start running automatically
    simulation.nodes(nodes);

    // Set initial layout to single group
    groupBubbles();
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation
   * Repositions the SVG circles based on the current x and y values 
   * of their bound node data
   * The x and y values are modified by the force simulation
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

    // Reset the 'x' force to draw the bubbles to the center
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    // Reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  // Hide Name displays

  function hideNames() {
    svg.selectAll('.name').remove();
  }

   // This function calls the tooltip on mouseover

  function showDetail(d) {
    // changes outline to indicate hover state
    // calls moveToFront to move circle to top level
    // increases radius of circle
    
    d3.select(this)
    .moveToFront()
    .attr('stroke', 'black')
    .transition()
    .duration(300)
    .style("opacity", 1.0)
    .attr("r", d.radius*1.25);

    let content = '<span class="name">Trending: </span><span class="value">' +
      d.name + '</span><br/>' +
                  '<span class="  name">Tweet Volume: </span><span class="value">' +
      d.value + '</span>';

    tooltip.showTooltip(content, d3.event);
  }

  // Hides tooltip

  function hideDetail(d) {
    // reset styles from showDetail()

    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.group)).darker())
      .transition()
      .duration(200)
      .attr("r", d.originalRadius)
      .style("opacity", .9);

    tooltip.hideTooltip();
  }

  // return the chart function from closure
  return chart;
}

/*
 * Initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

const myBubbleChart = bubbleChart();

// Function called once data is loaded from Twitter API.
// Calls bubble chart function to display inside #vis div

export function display(data) {
  myBubbleChart('#vis', data);
}

d3.json('/api/global_trends/1').then(display);