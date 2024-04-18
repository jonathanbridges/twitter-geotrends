# Twitter Geotrends

## Overview

Twitter Geotrends is a d3 data visualization of the most popular hashtags and Tweets on Twitter. The data can be sorted by geolocation to uncover trends and insight about regions other than your own.

The motivation for this project stems from my interest in world events and what is happening live in areas across the world. On a technical note, I wanted to gain experience with D3.js, VanillaJS, and Node/Express for backend routes.

### Functionality and MVP Features

* Visitors are presented with a bubblechart on landing.
* You can choose any city you like from a dropdown menu.
* You can click on any bubble to view the item on Twitter.

##### Architecture and Technologies

* VanillaJS, HTML5, CSS3
  * Primary logic and design
* D3.js
  * Data visualization
* Express/Node.js 
  * Handles calls to the Twitter `Trends` and `Search` API endpoints

### Development timeline

##### Weekend:
- [x] Set up repo and project workspace 
- [x] Set up Express BE and make successful requests to the Twitter API endpoints

##### Day 1:
- [x] Create d3 bubble chart
- [x] Integrate Twitter Trends information into D3

##### Day 2:
- [x] HTML/CSS
- [x] Fix Bugs
