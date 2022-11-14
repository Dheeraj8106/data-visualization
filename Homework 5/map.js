function drawMap(world, populationData) {
    var width = document.getElementById("mainMapChart").offsetWidth,
        height = 700;

    var svg = d3.select("#mainMapChart")
        .append("svg")
        .style("cursor", "move");

    svg.attr("viewBox", "10 5 " + width + " " + (height + 200))
        .attr("preserveAspectRatio", "xMinYMin");

    var worldMap = svg.append("g")
        .attr("class", "map");

    let colors = ["#3D8361" ,"#CFB997" ,"#E14D2A" ,"#61764B" ,"#FD841F"];
    let fillRange = [];
    let legendWidth = 250;
    let legendHeight = 20;
    var max = 80;
    var min = -20;

    // var zoom = d3.zoom()
    //     .on("zoom", function () {
    //         var transform = d3.zoomTransform(this);
    //         worldMap.attr("transform", transform);
    //     });
    //
    // svg.call(zoom);

    var projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    var path = d3.geoPath().projection(projection);
    var features = topojson.feature(world, world.objects.cb_2015_utah_county_20m).features;

    features.forEach(function (d) {
        d.details = populationData[d.properties.NAME.replaceAll(" ", "").trim() + "County"] ? populationData[d.properties.NAME.replaceAll(" ", "").trim() + "County"] : {};
    });

    features.sort(function (a, b){
        return a.details.unemploymentRate - b.details.unemploymentRate;
    });

    console.log(features)

    for(let i = 0;i <= colors.length;i++)
        fillRange.push(legendWidth/colors.length * i);

    let axisScale = d3.scaleQuantile().range(fillRange);

    let diff = (max - min)/colors.length;
    let LegendScale = [];
    for(let i = 0;i <= colors.length;i++)
        LegendScale.push(diff * (i + 1) + min);

    var colorScale = d3.scaleLinear()
        .domain([0,12])
        .range(["white", "#61764B"]);

    for(let idx = 0; idx < features.length;idx++){
        var color = colorScale(features[idx].details.unemploymentRate);
        colors.push(color);
    }

    colors = colors.slice(5);

    axisScale.domain(LegendScale);

    let legendaxis = d3.axisBottom(axisScale).tickFormat(x=>  x.toFixed(1) + "%");

    let legend = svg.selectAll(".legend").data(colors).enter().append("g").attr("transform", "translate(250,810)")

    legend.append("rect").attr("width", legendWidth/colors.length).attr("height", legendHeight).style("fill", d=>d)
        .attr("x", (d,i)=> legendWidth/colors.length * i)


    svg.append("g").attr("class", "axis")
        .attr("transform", "translate(250,830)")
        .call(legendaxis);


    worldMap.append("g")
        .selectAll("path")
        .data(features)
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("id", function (d) {
                        return d.properties.NAME.replaceAll(" ", "");
                    })
                    .attr("name", function (d) {
                        return d.properties.NAME.replaceAll(" ", "");
                    })
                    .attr("d", path)
                    .attr("fill", function (d, i) {
                        return colorScale(d.details.unemploymentRate)
                    })
                    .style("stroke", "white")
                    .style("stroke-width", 0.015)
                    .on('mouseover', function (d) {
                        d3.select(this)
                            .style("stroke", "white")
                            .style("stroke-width", 0.15)
                            .style("cursor", "pointer")

                        var tempValue = d.srcElement.__data__.properties.NAME.replaceAll(" ", "");
                        d3.select("#" + tempValue + "1").transition().duration(100).style("fill", "#FF731D").style("stroke", "black").style("stroke-width", "3");
                    })
                    .on('mouseout', function (d) {
                        d3.select(this)
                            .style("stroke-width", 0.025)

                        var tempValue = d.srcElement.__data__.properties.NAME.replaceAll(" ", "");
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