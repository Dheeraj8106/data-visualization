var world, unemploymentRate, data;

function fetchingData(option, flag) {
    d3.json("UT-49-utah-counties.json")
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

function preprocessing(option, flag){
    var populationData = {}, barData = [];
    data.forEach(function (d) {
        if (d.STNAME == "Utah" && d.CTYNAME != "Utah") {
            if (option === "population") {
                populationData[d.CTYNAME.replaceAll(" ", "")] = {
                    county: d.COUNTY,
                    value: d.POPESTIMATE2016,
                    unemploymentRate:0
                }
            } else if (option === "birth") {
                populationData[d.CTYNAME.replaceAll(" ", "")] = {
                    county: d.COUNTY,
                    value: d.BIRTHS2016,
                    unemploymentRate:0
                }
            }
        }
    });

    unemploymentRate.forEach(function (d){
        if (d.State === "Utah") {
            if (option === "population") {
                populationData[d.County.replaceAll(" ", "")].unemploymentRate = d.Rate;
            }
            else if (option === "birth") {
                populationData[d.County.replaceAll(" ", "")].unemploymentRate = d.Rate;
            }
        }
    })

    for (const county in populationData) {
        barData.push({
            yLabel: county.replaceAll("County", "").trim(),
            value: populationData[county].value,
        })
    }

    if (flag) {
        drawMap(world, populationData, barData);
        initDrawChart(barData);
    } else {
        drawChart(barData, option === "population" ? true : false);
    }
};