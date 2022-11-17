var world, unemploymentRate, data;

// fetching the data from json file
function fetchingData(option, flag) {
    d3.json("TX-48-texas-counties.json")
        .then(function (world) {
            d3.csv("us-unemployment-rate.csv").then(function (unemploymentRate) {
                d3.csv("allFile.csv").then(function (data) {
                    this.world = world;
                    this.unemploymentRate = unemploymentRate;
                    this.data = data;
                    preprocessing(option, flag);
                });
            });
        });
};

// doing preprocessing and taking population and birth data
function preprocessing(option, flag){
    var populationData = {}, barData = [];
    data.forEach(function (d) {
        if (d.STNAME == "Texas" && d.CTYNAME != "Texas") {
            if (option === "population") {
                populationData[d.CTYNAME.replaceAll(" ", "").toLowerCase()] = {
                    county: d.COUNTY,
                    value: d.POPESTIMATE2016,
                    unemploymentRate:0
                }
            } else if (option === "birth") {
                populationData[d.CTYNAME.replaceAll(" ", "").toLowerCase()] = {
                    county: d.COUNTY,
                    value: d.BIRTHS2016,
                    unemploymentRate:0
                }
            }
        }
    });

    console.log(populationData)

    // fetching unemployment rate data and adding it to the population data
    unemploymentRate.forEach(function (d){
        if (d.State === "Texas") {
            if (option === "population") {
                populationData[d.County.replaceAll(" ", "").toLowerCase()].unemploymentRate = d.Rate;
            }
            else if (option === "birth") {
                populationData[d.County.replaceAll(" ", "").toLowerCase()].unemploymentRate = d.Rate;
            }
        }
    })

    for (const county in populationData) {
        barData.push({
            yLabel: county.replaceAll("County", "").trim(),
            value: populationData[county].value,
        })
    }

    // calling map and bar chart function to draw
    if (flag) {
        drawMap(world, populationData, barData);
        initDrawChart(barData);
    } else {
        drawChart(barData, option === "population" ? true : false);
    }
};