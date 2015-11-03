var width = $('#chart').width(),
    height = 700;

var $colorScale = d3.scale.category20c();

var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.sum_dollar_amount; });

var div = d3.select("#chart").append("div")
    .style("position", "relative")
    .style("width", width + "px")
    .style("height", height + "px");

d3.json("json/gov_activity.json", function(error, root) {
    if (error) throw error;
    var toor = {};
    toor.government_activity = "Government Activity";
    toor.children = root;
    root = toor;

    var node = div.datum(root).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function(d) { return $colorScale(d.government_activity); })
        .text(function(d) { return d.children ? null : d.government_activity; });
});

function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}