var width = d3.select('svg').attr('width');
var height = d3.select('svg').attr('height');

document.body.style.backgroundImage = "url('https://s-media-cache-ak0.pinimg.com/originals/7b/ef/15/7bef154dc7dd0cb3fdebaae1250ff2ce.jpg')";


var marginLeft = 100;
var marginTop = 100;

var nestedData = [];

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

//these are the size that the axes will be on the screen; set the domain values after the data loads.
var scaleX = d3.scaleBand().rangeRound([0, 800]).padding(0.3);
var scaleY = d3.scaleLinear().range([400, 200]);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//import the data from the .csv file
d3.csv('./dataFinal.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.key})
        .entries(dataIn);

    var loadData = nestedData.filter(function(d){return d.key == '2000'})[0].values;

    scaleX.domain(loadData.map(function(d){return d.state;}));
    scaleY.domain([0, d3.max(loadData.map(function(d){return +d.year}))]);

    // Add the x Axis
    svg.append("g")
        .attr('transform','translate(0,400)')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX))
        .style('stroke','green')
        .style('line-color','white')
        .style('fill','green');

    svg.append("g")
        .attr('class','yaxis')
        .call(d3.axisLeft(scaleY))
        .style('stroke','green')
        .style('line-color','white')
        .style('fill','green');


        svg.append('text')
            .text('Marijuana Laws Across the U.S.')
            .attr('transform','translate(300, 100)')
            .style('text-anchor','middle')
            .style('fill','green')
            .attr('font-size','36');

        svg.append('text')
        .text('The History of')
        .attr('transform','translate(300, 75)')
        .style('text-anchor','middle')
            .style('fill','green')
            .attr('font-size','24');

        svg.append('text')
            .text('State')
            .attr('transform','translate(400, 440)')
            .style('fill','green')
            .attr('font-size','24');

        svg.append('text')
            .text('Year of Legislation')
            .attr('transform', 'translate(-70,385)rotate(270)')
            .style('fill','green')
            .attr('font-size','24');

        svg.append('text')
        .text('Recreational, Medicinal')
        .attr('transform', 'translate(-50,400)rotate(270)')
            .style('fill','green')
            .attr('font-size','18');


    //bind the data to the d3 selection, but don't draw it yet
    svg.selectAll('rect')
        .data(loadData)
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('fill', "green")
        .attr('stroke', "greenYellow");

    //call the drawPoints function below, and hand it the data2016 variable with the 2016 object array in it
    drawPoints(loadData);

});

//this function draws the actual data points as circles. It's split from the enter() command because we want to run it many times
//without adding more circles each time.
function drawPoints(pointData){

    scaleY.domain([1930, d3.max(pointData.map(function(d){return +d.year}))]);

    svg.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));

    svg.selectAll('rect')
        .data(pointData)
        .attr('x',function(d){
            return scaleX(d.state);
        })
        .attr('y',function(d){
            return scaleY(d.year);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return 400 - scaleY(d.year);  //400 is the beginning domain value of the y axis, set above
        })

    .on("mouseover", function(d) {
        div.transition()
            .duration(500)
            .style("opacity", 1.0);
        div.html(d.year)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

}

function updateData(selectedYear){
    return nestedData.filter(function(d){return d.key == selectedYear})[0].values;
}


//this function runs when the HTML slider is moved
function sliderMoved(value){

    newData = updateData(value);
    drawPoints(newData);

}

/* svg.selectAll('.w_dataPoints')  //select all of the circles with dataPoints class that we made using the enter() commmand above
    .data(pointData)          //re-attach them to data (necessary for when the data changes from 2016 to 2017)
    .attr('cx',function(d){   //look up values for all the attributes that might have changed, and draw the new circles
        return scaleX(d.age);
    })
    .attr('cy',function(d){
        return scaleY(d.women);
    })
    .attr('data-toggle', 'tooltip')
    .attr('title', function(d) {
        return d.women;
    });
.on("mouseover", function(d) {
    div.transition()
        .duration(200)
        .style("opacity", .9);
    div.html(d.women)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
})
.on("mouseout", function(d) {
    div.transition()
        .duration(500)
        .style("opacity", 0);
});*/