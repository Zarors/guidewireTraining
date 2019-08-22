"use strict";


gw.globals.chartInitializers = gw.globals.chartInitializers || [];

gw.globals.chartInitializers.push(function (gw, gwCharts) {
  var xylineChart = gwCharts.xylineChart = {};

  function getXAxisRange(spec) {
    var dataPoints = spec.data.seriesValues;
    dataPoints = spec.dualData ? dataPoints.concat(spec.dualData.seriesValues) : dataPoints;

    return gwCharts.axisRange(
      spec.xaxis,
      gwCharts.seriesMinMaxDataPointRange(dataPoints, function(d) { return d.x; }));
  }

  xylineChart.initSeriesVisibility = gwCharts.initSeriesVisibilityForAxisChart;
  xylineChart.toggleOneActiveSeries = gwCharts.toggleOneActiveSeriesForAxisChart;
  xylineChart.toggleSeriesVisibility = gwCharts.toggleSeriesVisibilityForAxisChart;
  xylineChart.getXAxisTicks = function (chartSpec) {
    return gwCharts.getTicksValues(
      { scale: gwCharts.getNumericalAxisScale(chartSpec.xaxis, getXAxisRange(chartSpec), 100, true) },
      chartSpec.xaxis.useWholeNumber
    );
  };

  xylineChart.getRenderer = function(id, spec) {
    var yAxisMinMaxRange = gwCharts.axisRange(
      spec.yaxis,
      gwCharts.seriesMinMaxDataPointRange(spec.data.seriesValues, function(dataPoint) { return dataPoint.y; })
    );
    var xScaleFactory = function(chartWidth) {
        return gwCharts.getNumericalAxisScale(spec.xaxis, getXAxisRange(spec), chartWidth, true);
    };
    var yScaleFactory = function(chartHeight) {
        return gwCharts.getNumericalAxisScale(spec.yaxis, yAxisMinMaxRange, chartHeight);
    };
    var chart = new gwCharts.Chart(id, spec, yAxisMinMaxRange, xScaleFactory, yScaleFactory);

    var tooltipProvider= function(d, seriesName) { return seriesName + ": (" + gwCharts.getTooltipFormatter()(d.x) + "; " + gwCharts.getTooltipFormatter()(d.y) + ")"; };
    var xValueProvider = function(d) { return chart.xAxisDetails.scale(d.x); };
    var yValueProvider = function(d) { return chart.yAxisDetails.scale(d.y); };

    return {
      render: function(withAxes) {
        var keys = gwCharts.getActiveSeriesKeys(spec.data.series);
        var data = spec.data.seriesValues.filter(function(serialValues, id) {
          return keys.indexOf(id) >= 0;
        });

        if (withAxes) {
          chart.renderVerticalAxes(spec);
        }

        chart.body.selectAll("g[data-gw-chart-series]").remove();
        gwCharts.lineChart.renderLine(
          chart,
          spec,
          'gw-chart-series',
          tooltipProvider,
          xValueProvider,
          yValueProvider,
          data,
          keys
        );

        if (spec.dualAxisSpec) {
          var dualYValueProvider = function(d) { return spec.dualAxisSpec.yScale(d.y); };
          var dualTooltipProvider = function(d, seriesName) { return seriesName + ": (" + gwCharts.getTooltipFormatter()(d.x) + "; " + gwCharts.getTooltipFormatter()(d.y) + ")"; };
          gwCharts.renderSecondAxisLine(
              chart,
              spec,
              spec.dualAxisSpec,
              xValueProvider,
              dualYValueProvider,
              dualTooltipProvider
          );
        }

        if (withAxes) {
          chart.renderHorizontalAxes(spec, chart.xAxisDetails.scale);
        }
      }
    };
  };
});
