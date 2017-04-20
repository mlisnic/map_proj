/*
  You do your work for Project 2 in this file, within the region
  indicated below.  Comments throughout give details.

  The information exported from this "p2" (see bottom) are:
  p2.transDur: duration of transitions (in ms)
  p2.hexWidth: per-state hexagon size
  p2.circRad: radius of circles use to indicate states in bivarate maps
  p2.cmlSize: width=height of colormap legend picture
  p2.rowFinish: function called for each datum (row of .csv) by d3.csv()
  p2.dataFinish: function called once at the end data read by d3.csv()
  p2.choiceSet: function called with radioButton changes

  Note that index.html sets:
  p2.usData: data as read by d3.csv() and post-processed by p2.dataFinish()
  p2.cmlContext, p2.cmlImage: canvas context and image for colormap legend

  Beyond that, how you set this up is entirely up to you, and what you
  put in here, is up to you.  New functions or variables that are created
  by rowFinish or dataFinish, that are used by choiceSet, should be in the
  "p2" namespace (their names should started with "p2." e.g. "p2.helper")
*/

/* module syntax directly copied from d3.v4.js */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (factory((global.p2 = global.p2 || {})));
}(this, (function (exports) { 'use strict';

// the marks in the colormap legend should transition() with this duration
const transDur = 500;
const hexWidth = 60; // size of hexagons in US map
const circRad = 5; // size of circle marks in bivariate map
const cmlSize = 210; // width and height of picture of colormap

/* ------------------------- Do not change anything above this line */

/* ALL YOUR WORK GOES IN HERE: the three important functions (rowFinish,
  dataFinish and choiceSet), as well as any other variables or utility
  functions you want to help implement those three functions. All the comments
  (including this) are tips/hints that you can erase if you want. */

function rowFinish(d) {
    /* compute here the information about each state that will be needed for
       visualization later (e.g. unemployment rate)) */
    return d;  // keep this line, or else data becomes empty
}

function dataFinish(data) {
    /* compute here, with the help of one or more "data.map(function(d) {
       ... })", per-state information that can only be computed once all the
       data has read in (e.g. the political leaning variable). Also, learn
       here (once) the extents (the min-to-max range, as learned by
       d3.extent()) for variables that need to be displayed with the colormap
       and indicated in the colormap legend.  Then, create some convenient and
       uniform way to refer to the information needed for every variable
       display: e.g. how to retrieve that variable from each element of the
       data array, the min-to-max extent (as from d3.extent()) of that
       variable, and which colormap to use. */
}

function choiceSet(wat) {
    /* is this a univariate map? */
    var uni = (["AR", "EM", "UN", "OB", "IM", "VU", "WU"].indexOf(wat) >= 0);

    console.log("choiceSet(", wat, ", ", (uni ? "uni" : "bi") + "variate)"); /* feel free to remove this line before handing in */

    /* 0) based on "wat", get all the information (created in dataFinish())
       about how to visualize "wat" */

    /* 1) apply colormap to the states in #mapUS.  Be sure to use a transition
       of duration p2.transDur.  Try starting with:
       d3.select("#mapUS").selectAll("path").data(p2.usData) ... and set the
       color with .style("fill", function(d){ return ... color ...; })*/

    /* 2) reset pixels of cmlImage.data, by traversing it via (see index.html):
       for (var j=0, k=0; j < p2.cmlSize; j++) {
           for (var i=0; i < p2.cmlSize; i++) {
               p2.cmlImage.data[k++] =  ... red (from 0 to 255) ... ;
               p2.cmlImage.data[k++] =  ... green ... ;
               p2.cmlImage.data[k++] =  ... blue ... ;
               p2.cmlImage.data[k++] =  255; // opacity
           }
       }
       For the univariate colormaps, only compute the colormap values for the
       first row, and then on subsequent rows just copy the values from
       previous row. Finally, redisplay image with:
       p2.cmlContext.putImageData(p2.cmlImage, 0, 0);
       Transitions on canvases are more work, so it is okay for this colormap
       image to change suddenly (w/out transition of duration p2.transDur) */

    /* 3) Update the labels at the corners of the colormap with
       d3.select("#xminlabel").html("<text>" + x0 + "</text>"); where x0 is
       the minimum value shown along the X axis of the colormap, and similarly
       for the other three labels (xmaxlabel, yminlabel, ymaxlabel). The
       labels should show the range of the "wat" values that are being
       colormapped.  For univariate maps, set xminlabel and yminlabel to show
       the range, and set yminlabel and ymaxlabel to an empty string.  For
       bivariate maps, set all labels to show the X and Y ranges. */

    /* 4) update (with a transition of duration p2.transDur) the attributes of
       the #cmlMarks ellipses to display the appropriate set of per-state
       marks over the colormap legend.  For univariate maps, set:
           rx = 0.5         (e.g. .attr("rx", 0.5))
           ry = p2.cmlSize/4
           cx = ... position to indicate data value ...
           cy = p2.cmlSize/2
       For bivariate maps, set:
           rx = p2.circRad
           ry = p2.circRad
           cx = ... position to indicate data value along X ...
           cy = ... position to indicate data value along Y ... */

}

/* ------------------------- Do not change anything below this line */

exports.hexWidth = hexWidth;
exports.transDur = transDur;
exports.circRad = circRad;
exports.cmlSize = cmlSize;
exports.rowFinish = rowFinish;
exports.dataFinish = dataFinish;
exports.choiceSet = choiceSet;
Object.defineProperty(exports, '__esModule', { value: true });
})));
