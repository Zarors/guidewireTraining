"use strict";


gw.globals.chartInitializers = gw.globals.chartInitializers || [];

gw.globals.chartInitializers.push(function (gw, gwCharts) {
  var pieChart = gwCharts.pieChart = {};
    
  pieChart.initSeriesVisibility = gwCharts.initSeriesVisibilityForRoundChart;
  pieChart.toggleOneActiveSeries = gwCharts.toggleOneActiveSeriesForRoundChart;
  pieChart.toggleSeriesVisibility = gwCharts.toggleSeriesVisibilityForRoundChart;

  pieChart.getRenderer = function(id, spec) {
    return gwCharts.roundChart.getRenderer(id, spec, 0);
  };
});
