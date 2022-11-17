var barG, barScale, width, height, xAxis, svg1, callAxis, svg2;

function drawAxis(domain, tickFormat){
    xAxis = d3.axisBottom(getScale(domain,[0, width - 40]))
        .tickSize(5)
        .tickPadding(15)
        .tickFormat(function (d) {
            return d + tickFormat;
        });
}

function getScale(domainValues, rangeValues) {
    return d3.scaleLinear()
        .domain(domainValues)
        .range(rangeValues)
}


function draw(axis, stroke_width, translate, cls) {
        callAxis.call(axis).attr("transform", translate)
        .style("stroke-width", stroke_width)
        .attr("class", cls);
}

// initializing the bar chart labels
function initDrawChart(barData) {
    width = document.getElementById("mainBarChart").offsetWidth - 100;
    height = 5000;

    let values = [42.5, 82.5, 85, 94, 80];
    let yAxisValues = []

    barData.forEach(function (d) {
        yAxisValues.push(d.yLabel);
    });

    barScale = d3.scaleBand()
        .domain(yAxisValues)
        .range([50, height - 200])
        .paddingInner("0.16")


    // add svg element inside div
    svg1 = d3.select("#mainBarChart")
        .append("svg")
        .attr("width", width + 20)
        .attr("height", height)
        .style("display", "block")
        .style("margin", "auto")
        .attr("transform", "translate(0,10)");

    callAxis = svg1.append("g")

    barG = svg1.append("g");

    // adding y axis labels
    let yLabels = svg1.append("g")
    yLabels.selectAll("text")
        .data(barData)
        .join(
            function (enter) {
                return enter.append("text")
                    .attr("x", 20)
                    .attr("y", (d, i) => (barScale(d.yLabel) - 2))
                    .attr("class", "ylabel")
                    .text(d => d.yLabel.replace("county", ""))
            }
        )
        .attr("transform", "translate(-17, 12)")

    drawChart(barData, true);
}

// plotting the points on the screen and drawing the bar chart
function drawChart(barData, flag) {

    if(flag) {
        drawAxis([0, 12],  "M");
        draw(xAxis, "2", "translate(49,710)", "fixedDiv");
    }
    else {
        drawAxis([0, 18000],  "");
        draw(xAxis, "2", "translate(49,710)", "fixedDiv");
    }

    barG.selectAll("rect")
        .data(barData)
        .join(
            function (enter) {
                return enter.append("rect")
                    .attr("x", 50)
                    .attr("y", (d, i) => (barScale(d.yLabel)))
                    .attr("fill", "#1e99e7").style("opacity", "0.7")
                    .attr("height", barScale.bandwidth())
                    .attr("width", function (d, i) {
                        return ((width - 40) * d.value) / 1200000;
                    })
                    .attr("id", function (d) {
                        return d.yLabel.replace("county","") + "1";
                    })
            },
            function (update) {
                return update.transition().duration(500)
                    .attr("x", 50)
                    .attr("y", (d, i) => (barScale(d.yLabel)))
                    .attr("fill", "#1e99e7").style("opacity", "0.7")
                    .attr("height", barScale.bandwidth())
                    .attr("width", function (d, i) {
                        if(flag){
                            return ((width - 40) * d.value) / 1200000;
                        }
                        else{
                            return ((width - 40) * d.value) / 18000 ;
                        }
                    })
                    .attr("id", function (d) {
                        return d.yLabel.replace("county","") + "1";
                    })
            },
            function (exit) {
                return exit.remove();
            }
        )
        .on("mouseover", function (d, i) {
            d3.select(this).transition().duration(100).style("fill", "#FF731D").style("stroke", "black").style("stroke-width", "3");
            var tempValue = d.srcElement.__data__.yLabel;
            console.log(tempValue)
            d3.select("#" + tempValue.replace("county",""))
                .style("stroke", "#3F0071")
                .style("stroke-width", 5)
                .style("cursor", "pointer")

        })
        .on("mouseout", function (d, i) {
            var tempValue = d.srcElement.__data__.yLabel;
            d3.select(this).transition().duration(100).style("fill", "#1e99e7").style("stroke", "#1e99e7");
            d3.select("#" + tempValue.replace("county",""))
                .style("stroke-width", 1)
                .style("stroke", "white")
        });
}