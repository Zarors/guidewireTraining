"use strict";

gw.globals.chartInitializers = gw.globals.chartInitializers || [];

gw.globals.chartInitializers.push(function (gw, gwCharts) {
  var donutChart = gwCharts.donutChart = {};

  donutChart.initSeriesVisibility = gwCharts.initSeriesVisibilityForRoundChart;
  donutChart.toggleOneActiveSeries = gwCharts.toggleOneActiveSeriesForRoundChart;
  donutChart.toggleSeriesVisibility = gwCharts.toggleSeriesVisibilityForRoundChart;

  donutChart.getRenderer = function(id, spec) {
    return gwCharts.roundChart.getRenderer(id, spec, 0.6);
  };
});
