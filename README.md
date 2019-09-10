# Twitter Geotrends

## Overview

Twitter Geotrends is a data visualization of the most popular hashtags and Tweets on Twitter. The data can be sorted by geolocation to uncover trends and insight about regions other than your own.

The motivation for this project stems from my interest in world events and what is popular in regions across the world. Technically I wanted more experience working on dynamic data visualization and using external APIs.

### Functionality and MVP Features

* Visitors are presented with a bubblechart of of globally trending hashtags and tweets.
* Selecting a city sorts the data.
* Selecting a specific item displays the thread on Twitter.

### Wireframe

<img src="https://raw.githubusercontent.com/jonathanbridges/twitter-geotrends/master/assets/Wireframe.png" alt="wireframe" width="100%" height="auto" />

##### Architecture and Technologies

* Vanilla JS for game logic.
* D3 for data visualization
  * Justification
* Node.js 
  * Avoid CORS issues for calls to the Twitter `Trends` and `Search` API endpoints

### Development timeline

##### Weekend:
- [x] Set up repo and project workspace 
- [x] Set up Express BE and make successful requests to the Twitter API endpoints

##### Day 1:
- [x] Complete d3 bubble chart tutorial
- [x] Integrate Twitter Trends invformation into d3

##### Day 2:
- [x] HTML/CSS
- [x] Fix Bugs
