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

//declare range global vars
var ARrange, EMrange, UNrange, OBrange, IMrange, 
	VUrange, WUrange, VBrange, WBrange, 
	ESwrange, ESmrange, ERwrange, ERmrange;


function rowFinish(d) {
    /* compute here the information about each state that will be needed for
       visualization later (e.g. unemployment rate)) */

    // loading in the variables
    	d.Area = +d.Area;
    	d.Population = +d.Population;
   	// calculating unemployment rate
    	d.UnempRate = 100-100*(+d.Employed/+d.LaborForce);
    // calculating employment rate
    	d.EmpRate = 100*(+d.Employed/+d.Population);
    	d.WomenEarning = +d.WomenEarning;
    	d.MenEarning = +d.MenEarning;
    	d.Obesity = +d.Obesity;
    	d.InfantMortality = +d.InfantMortality;
    // calculating political leanings in the elections
    	d.PL1 = (+d.Obama)/(1+(+d.Romney)+(+d.Obama));
    	d.PL2 = (+d.Clinton)/(1+(+d.Trump)+(+d.Clinton));
    // calculating total voters, initiating variables for further use
    	d.VT = Math.max(((+d.Obama)+(+d.Romney)), ((+d.Clinton)+(+d.Trump)));
    	d.VF = 0;
    	d.VA = 0;
    	d.WF = 0;
    	d.WA = 0;
    	d.esw = 0;
    	d.esm = 0;
    	d.erw = 0;
    	d.erm = 0;

   		console.log(d);

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


    // calculating parameters for voter maps
       var VTmax = d3.max(data, function(d) { return +d.VT; });
       data.map(function(d) { d.VF = ((+d.Obama)+(+d.Romney))/VTmax});
       data.map(function(d) { d.VA = 1 - Math.pow((1-d.VF),3) });
       data.map(function(d) { d.WF = ((+d.Clinton)+(+d.Trump))/VTmax});
       data.map(function(d) { d.WA = 1 - Math.pow((1-d.WF),3) });
    // calculating params for earnings
       var Emax = d3.max(data, function(d) { return Math.max(d.WomenEarning,d.MenEarning); });
       var EWmax = d3.max(data, function(d) { return +d.WomenEarning});
       var EMmax = d3.max(data, function(d) { return +d.MenEarning});
       var EWmin = d3.min(data, function(d) { return +d.WomenEarning});
       var EMmin = d3.min(data, function(d) { return +d.MenEarning});
       data.map(function(d) { d.esw = d.WomenEarning/Emax});
       data.map(function(d) { d.esm = d.MenEarning/Emax});
       data.map(function(d) { d.erw = (d.WomenEarning-EWmin)/(EWmax-EWmin)});
       data.map(function(d) { d.erm = (d.MenEarning-EMmin)/(EMmax-EMmin)});
    // calculating ranges
       ARrange = d3.extent(data, function(d){ return +d.Area});
       EMrange = d3.extent(data, function(d){ return +d.EmpRate});
       UNrange = d3.extent(data, function(d){ return +d.UnempRate});
       OBrange = d3.extent(data, function(d){ return +d.Obesity});
       IMrange = d3.extent(data, function(d){ return +d.InfantMortality});
       VUrange = d3.extent(data, function(d){ return +d.PL1});
       WUrange = d3.extent(data, function(d){ return +d.PL2});
       VBrange = d3.extent(data, function(d){ return +d.VA});
       WBrange = d3.extent(data, function(d){ return +d.WA});
       ESwrange = d3.extent(data, function(d){ return +d.esw});
       ESmrange = d3.extent(data, function(d){ return +d.esm});
       ERwrange = d3.extent(data, function(d){ return +d.erw});
       ERmrange = d3.extent(data, function(d){ return +d.erm});

}

// function that returns appropriate colorscale given type of map
function getColorScale(wat) {

	var cs;

	switch(wat) {
	// area : simple cube root scale
	case "AR":
		cs = d3.scalePow()
				.domain(ARrange)
				.range([d3.rgb(0,0,0), d3.rgb(255,255,255)])
				.exponent(1/3);
		return cs;

	// unemployment rate: rgb scale with 4 steps
	case "UN":
		cs = d3.scaleLinear()
				.domain([UNrange[0], 
					(1/3)*(UNrange[1]-UNrange[0])+UNrange[0],
					(2/3)*(UNrange[1]-UNrange[0])+UNrange[0], 
					UNrange[1]])
				.range([d3.rgb(0,0,0), 
					d3.rgb(230,0,0), 
					d3.rgb(255,230,0), 
					d3.rgb(255,255,255)]);
		return cs;

	// employment rate: inverse of above
	case "EM":
		cs = d3.scaleLinear()
				.domain([EMrange[0], 
					(1/3)*(EMrange[1]-EMrange[0])+EMrange[0],
					(2/3)*(EMrange[1]-EMrange[0])+EMrange[0],  
					EMrange[1]])
				//.interpolate(d3.interpolateRgb)
				.range([d3.rgb(255,255,255), 
					d3.rgb(255,230,0), 
					d3.rgb(230,0,0), 
					d3.rgb(0,0,0)]);
		return cs;

	// infant mortality: transform domain to [0,1], hcl scales
	case "IM":
		var X = d3.scaleLinear().domain(IMrange).range([0,1]);
		var H = d3.scaleLinear().domain([0,1])
					.range([330,0]);
		function C(x) { return 23*Math.pow(Math.sin(Math.PI*x),2)};
		function L(x) { return 10+90*x};
		cs = function(a) { return d3.hcl(H(X(a)), C(X(a)), L(X(a)))};
		return cs;	
	// obesity: hsl scale with 3 steps, 10 ticks
	case "OB":
		var mid = (1/2)*(OBrange[1]-OBrange[0]) + OBrange[0];
		var hslcolors = ["hsl(150,100%,50%)",
						"hsl(150,0%,50%)",
						"hsl(330,100%,50%)"];
		var quant = d3.scaleQuantile()
						.domain([OBrange[0], mid, OBrange[1]])
						.range([0,1,2,3,4,5,6,7,8]);
		cs = d3.scaleLinear()
				.domain([0,4,8])
				.range(hslcolors);
		return function(x){return cs(quant(x))};

	// earnings: simple lab mapping
	case "ES":
	cs = function (a,b) { return d3.lab((30+45*(a+b)),
						0,
						230*(a-b))};
		return cs;
	case "ER":
		cs = function (a,b) { return d3.lab((30+45*(a+b)),
						0,
						230*(a-b))};
		return cs;
	// Obama/Romney uni :
	case "VU":
		var c1 = d3.rgb(210,0,0);
		var c2 = d3.rgb(0,0,210);
		var H1 = d3.hcl(c1).h;
		var H2 = d3.hcl(c2).h;
		console.log(H1,H2);
		function Hu(x) { if (x<0.5)
						 {return H1}
						else 
						 {return H2}};
		var Cmin = d3.hcl(c1).c;
		var Cmax = d3.hcl(c2).c;
		function Cu(x) { if (x<0.5) 
						 {return Cmin*(1-Math.pow((1-Math.abs(x-0.5)/0.5),4))}
						else 
						 {return Cmax*(1-Math.pow((1-Math.abs(x-0.5)/0.5),4))}};
		var Lu = d3.scaleLinear()
					.domain([0,0.5,1])
					.range([d3.hcl(c1).l,
							d3.hcl("darkgray").l,
							d3.hcl(c2).l]);
		cs = function(xu) {return d3.hcl(Hu(xu),Cu(xu),Lu(xu))};
		return cs;
	}
	//return d3.rgb(12, 67, 199);
}

//apply coloscale for appropriate data
function colorme(wat,d){
	var cs = getColorScale(wat);
	var dt = getData(wat,d);
	if (uni(wat)){ 
		return cs(dt);
	} else {
		return cs(dt[0], dt[1]);
	}
}

//return range given type of map
function getRange(wat){
	var cs = getColorScale(wat);
	switch(wat){
		case "AR": return ARrange;
		case "UN": return UNrange;
		case "EM": return EMrange;
		case "OB": return OBrange;
		case "IM": return IMrange;
		case "ES": return ESmrange;
		case "ER": return ERmrange;
		case "VU": return [0,1]
	}
}

//return the appropriate data for map
function getData(wat,d){
	switch(wat){
		case "AR": return (d.Area);
		case "UN": return (d.UnempRate);
		case "EM": return (d.EmpRate);
		case "OB": return (d.Obesity);
		case "IM": return (d.InfantMortality);
		case "ES": return [d.esm, d.esw];
		case "ER": return [d.erm, d.erw];
		case "VU": return (d.PL1);
	}
}

//color the canvas with appropriate scheme
function canvasme(wat,d){
// so far only univariate
	var watrange = getRange(wat);
	var canvasscl = d3.scaleLinear()
						.range(watrange)
						.domain([0,p2.cmlSize]);
	var cs = getColorScale(wat);

	for (var j=0, k=0; j < p2.cmlSize; ++j) {
      for (var i=0; i < p2.cmlSize; ++i) {
      	var cc = cs(canvasscl(i));
          p2.cmlImage.data[k++] = d3.rgb(cc).r; // red
          p2.cmlImage.data[k++] = d3.rgb(cc).g; // green
          p2.cmlImage.data[k++] = d3.rgb(cc).b; // blue
          p2.cmlImage.data[k++] = 255; // opacity; keep at 255
      }
  }
}

//get horizontal position of cml ticks
function getPos(wat,d){
	var r = getRange(wat);
	var cmlScale = d3.scaleLinear()
						.domain(r)
						.range([0,p2.cmlSize]);
	var dt = getData(wat,d);
	return cmlScale(dt);
}

function uni(wat){
	switch(wat){
		case "ES":
		case "ER":
		case "WU":
		case "WB":
			return 0;
		}
		return 1;
}

function choiceSet(wat) {
    /* is this a univariate map? */
    var uni = (["AR", "EM", "UN", "OB", "IM", "VU", "WU"].indexOf(wat) >= 0);

    console.log("choiceSet(", wat, ", ", (uni ? "uni" : "bi") + "variate)"); /* feel free to remove this line before handing in */

    // define transition properties
    var t = d3.transition()
    		.duration(p2.transDur)
    		.ease(d3.easeLinear);
    /* 0) based on "wat", get all the information (created in dataFinish())
       about how to visualize "wat" */

    /* 1) apply colormap to the states in #mapUS.  Be sure to use a transition
       of duration p2.transDur.  Try starting with:
       d3.select("#mapUS").selectAll("path").data(p2.usData) ... and set the
       color with .style("fill", function(d){ return ... color ...; })*/

    d3.select("#mapUS").selectAll("path").data(p2.usData)
    	.transition(t)
    	.style("fill", function(d){ return colorme(wat,d)});
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

       canvasme(wat,p2.usData);
  		p2.cmlContext.putImageData(p2.cmlImage, 0, 0);

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
           if (uni){
           d3.select("#cmlMarks").selectAll("ellipse").data(p2.usData)
           		.transition(t)
           		.attr("rx",0.5)
           		.attr("ry", p2.cmlSize/4)
           		.attr("cx", function(d){ return getPos(wat,d)})
           		.attr("cy", p2.cmlSize/2)
           	}
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
