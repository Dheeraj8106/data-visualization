function drawMap(world, populationData) {
    var width = document.getElementById("mainMapChart").offsetWidth,
        height = 500;

    var svg = d3.select("#mainMapChart")
        .append("svg")
        .style("cursor", "move");

    svg.attr("viewBox", "10 5 " + width + " " + (height + 200))
        .attr("preserveAspectRatio", "xMinYMin");

    var worldMap = svg.append('a').attr("href", "https://utah.gov/").attr("target", "_blank").append("g")
        .attr("class", "map");

    // var zoom = d3.zoom()
    //     .on("zoom", function () {
    //         var transform = d3.zoomTransform(this);
    //         worldMap.attr("transform", transform);
    //     });
    //
    // svg.call(zoom);


    let colors = ["#3D8361" ,"#CFB997" ,"#E14D2A" ,"#61764B" ,"#FD841F"];
    let fillRange = [];
    let legendWidth = 250;
    let legendHeight = 20;
    var max = 80;
    var min = -20;

    // plot the map
    var projection = d3.geoMercator()
        .scale(1)
        .translate([0, 0]);

    var path = d3.geoPath().projection(projection);

    var ut = topojson.feature(world, world.objects.cb_2015_texas_county_20m);

    let b = path.bounds(ut),
        s = 1.2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    //Update the projection to use computed scale & translate.
    projection
        .scale(s)
        .translate(t);

    var features = ut.features;

    // adding the population data to the features data of the map
    features.forEach(function (d) {
        d.details = populationData[d.properties.NAME.replaceAll(" ", "").toLowerCase().trim() + "county"] ? populationData[d.properties.NAME.replaceAll(" ", "").toLowerCase().trim() + "county"] : {};
    });

    features.sort(function (a, b){
        return a.details.unemploymentRate - b.details.unemploymentRate;
    });

    // creating and adding the legend
    for(let i = 0;i <= colors.length;i++)
        fillRange.push(legendWidth/colors.length * i);

    let axisScale = d3.scaleQuantile().range(fillRange);

    let diff = (max - min)/colors.length;
    let LegendScale = [];
    for(let i = 0;i <= colors.length;i++)
        LegendScale.push(diff * (i + 1) + min);

    var colorScale = d3.scaleLinear()
        .domain([0,20])
        .range(["white", "#61764B"]);

    for(let idx = 0; idx < features.length;idx++){
        var color = colorScale(features[idx].details.unemploymentRate);
        colors.push(color);
    }

    colors = colors.slice(5);

    axisScale.domain(LegendScale);

    let legendaxis = d3.axisBottom(axisScale).tickFormat(x=>  x.toFixed(1) + "%");

    let legend = svg.selectAll(".legend").data(colors).enter().append("g").attr("transform", "translate(760,810)")

    legend.append("rect").attr("width", legendWidth/colors.length).attr("height", legendHeight).style("fill", d=>d)
        .attr("x", (d,i)=> legendWidth/colors.length * i)


    svg.append("g").attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .call(legendaxis);


    // ploting the points to draw a map
    worldMap.append("g")
        .selectAll("path")
        .data(features)
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("id", function (d) {
                        return d.properties.NAME.replaceAll(" ", "").toLowerCase();
                    })
                    .attr("name", function (d) {
                        return d.properties.NAME.replaceAll(" ", "").toLowerCase();
                    })
                    .attr("d", path)
                    .attr("fill", function (d, i) {
                        return colorScale(d.details.unemploymentRate);
                    })
                    .style("stroke", "white")
                    .style("stroke-width", 1)
                    .attr("transform", "translate(0, 100)")
                    .on('mouseover', function (d) {
                        d3.select(this)
                            .style("stroke", "#3F0071")
                            .style("stroke-width", 5)
                            .style("cursor", "pointer")

                        var tempValue = d.srcElement.__data__.properties.NAME.replaceAll(" ", "").toLowerCase();
                        d3.select("#" + tempValue + "1").transition().duration(100).style("fill", "#FF731D").style("stroke", "black").style("stroke-width", "3");
                        document.getElementById(tempValue + "1").scrollIntoView({behavior: "smooth", block:"center" , inline: "nearest"});
                    })
                    .on('mouseout', function (d) {
                        d3.select(this)
                            .style("stroke-width", 1)
                            .style("stroke", "white")
                        var tempValue = d.srcElement.__data__.properties.NAME.replaceAll(" ", "").toLowerCase();
                        d3.select("#" + tempValue + "1").transition().duration(100).style("fill", "#1e99e7").style("stroke", "#1e99e7");
                    });
            },
            function (update) {

            },
            function (exit) {
                return exit.remove();
            }
        )
}