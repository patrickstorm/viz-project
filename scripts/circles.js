$.getJSON( "json/fund_name.json", function( data ) {
    createGraph(data);
});

function createGraph(data){
    var graphData = manipulateData(data);
    console.log(graphData);
    graphIt(graphData);
}

// Ideally this would be done on the backend, but the project instructions said js,html,css
function manipulateData(data){
    var graphData = {};
    graphData.name = "2012 LA City Spending";
    graphData.children = [];
    $.each( data, function( key, val ) {
        var fundTypeExists = false;
        $.each(graphData.children,function(subkey,subval){
            if(subval.name == val['fund_type']){
                fundTypeExists = true;
                graphData.children[subkey].children.push({name: val['fund_name'], size: val['sum_dollar_amount']})
            }
        });
        if(fundTypeExists === false){
            var newFundType = {};
            newFundType.name = val['fund_type'];
            newFundType.children = [];
            newFundType.children.push({name: val['fund_name'], size: val['sum_dollar_amount']});
            graphData.children.push(newFundType);
        }

    });
    return graphData;
}


// Plot the data using d3
function graphIt(graphData){
    var margin = 20,
        diameter = $('.graph').width(),
        format = d3.format(",.2f");

    var div = d3.select(".graph").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var color = d3.scale.category20c();

    var pack = d3.layout.pack()
        .padding(2)
        .size([diameter - margin, diameter - margin])
        .value(function(d) { return d.size; })

    var svg = d3.select(".graph").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var focus = graphData,
        nodes = pack.nodes(graphData),
        view;

    var circle = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
        .style("fill", function(d) { return d.children ? color(d.depth) : null; })
        .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); })
        .on("mouseover", function(d) {
            if(typeof d.size != "undefined"){
                div.transition()
                    .duration(200)
                    .style("opacity", .99);
                div .html('<h3>' + d.name + '</h3><p class="spend">$' + format(d.size) + '</p>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            }

        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    var text = svg.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) { return d.parent === graphData ? 1 : 0; })
        .style("display", function(d) { return d.parent === graphData ? null : "none"; })
        .style("text-anchor", "middle")
        .text(function(d) { return d.name.substring(0, d.r / 3); });

    var node = svg.selectAll("circle,text");

    d3.select(".graph")
        .on("click", function() { zoom(graphData); });

    zoomTo([graphData.x, graphData.y, graphData.r * 2 + margin]);

    function zoom(d) {
        var focus0 = focus; focus = d;

        var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
                var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                return function(t) { zoomTo(i(t)); };
            });

        transition.selectAll("text")
            .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
            .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        circle.attr("r", function(d) { return d.r * k; });
    }

    d3.select(self.frameElement).style("height", diameter + "px");


}