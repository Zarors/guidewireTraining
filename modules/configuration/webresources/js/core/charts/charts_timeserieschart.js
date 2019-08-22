"use strict";


gw.globals.chartInitializers = gw.globals.chartInitializers || [];

gw.globals.chartInitializers.push(function (gw, gwCharts) {
  var timeSeriesChart = gwCharts.timeSeriesChart = {};

  function createXScale(chartSpec, width) {
    var minTimeValue = Math.min(chartSpec.dualData ? chartSpec.dualData.minTimeValue : chartSpec.data.minTimeValue, chartSpec.data.minTimeValue);
    var maxTimeValue = Math.max(chartSpec.dualData ? chartSpec.dualData.maxTimeValue : chartSpec.data.maxTimeValue, chartSpec.data.maxTimeValue);

    return d3.scaleTime()
      .domain(gwCharts.axisRange(chartSpec.xaxis, [minTimeValue, maxTimeValue]))
      .range([0, width])
      .nice();
  }

  timeSeriesChart.initSeriesVisibility = gwCharts.initSeriesVisibilityForAxisChart;
  timeSeriesChart.toggleOneActiveSeries = gwCharts.toggleOneActiveSeriesForAxisChart;
  timeSeriesChart.toggleSeriesVisibility = gwCharts.toggleSeriesVisibilityForAxisChart;
  timeSeriesChart.getXAxisTicks = function (chartSpec) {
    return createXScale(chartSpec, 100)
      .ticks().map(function(tick) {
        return timeSeriesChart.dateFormatter(chartSpec.xaxis.dateFormat, tick);
      });
  };

  // Renders a graph where the x values are assumed to be UTC time in milliseconds.
  // The x-axis scale is based on the difference in time between
  // the earliest and latest time/dates in the the values being graphed.
  timeSeriesChart.getRenderer = function(id, spec) {
    var data = spec.data.seriesValues;
    var yAxisMinMaxRange = gwCharts.axisRange(
      spec.yaxis,
      gwCharts.seriesMinMaxDataPointRange(data, function(dataPoint) { return dataPoint.y; })
    );

    var xScaleFactory = function(chartWidth) { return createXScale(spec, chartWidth); };
    var yScaleFactory = function(chartHeight) { return gwCharts.getNumericalAxisScale(spec.yaxis, yAxisMinMaxRange, chartHeight); };
    var chart = new gwCharts.Chart(id, spec, yAxisMinMaxRange, xScaleFactory, yScaleFactory);

    var xValueProvider = function(d) { return chart.xAxisDetails.scale(d.x); };
    var yValueProvider = function(d) { return chart.yAxisDetails.scale(d.y); };
    var tooltipProviderFactory = function(dateFormat, numberFormatter) {
      return function(d, seriesName) {
        return seriesName + ": (" + timeSeriesChart.dateFormatter(dateFormat, d.x) + "; " + numberFormatter(d.y) + ")";
      }
    };

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
            'gw-chart-time',
            tooltipProviderFactory(spec.xaxis.dateFormat, gwCharts.getTooltipFormatter()),
            xValueProvider,
            yValueProvider,
            data,
            keys
        );

        if (spec.dualAxisSpec) {
          var dualYValueProvider = function(d) { return spec.dualAxisSpec.yScale(d.y); };
          var dualAxisTooltipProvider = tooltipProviderFactory(spec.dualAxis.dateFormat, gwCharts.getTooltipFormatter());
          gwCharts.renderSecondAxisLine(
              chart,
              spec,
              spec.dualAxisSpec,
              xValueProvider,
              dualYValueProvider,
              dualAxisTooltipProvider
          );
        }

        if (withAxes) {
          chart.renderHorizontalAxes(spec, chart.xAxisDetails.scale);
        }
      }
    };
  };

  timeSeriesChart.dateFormatter = function (dateFormat, date) {
    return d3.timeFormatLocale({
      dateTime: dateFormat,
      periods: gw.globals.gwLocale.getPeriods(),
      days: gw.globals.gwLocale.getWeekdays(),
      shortDays: gw.globals.gwLocale.getShortWeekdays(),
      months: gw.globals.gwLocale.getMonths(),
      shortMonths: gw.globals.gwLocale.getShortMonths()
    })
      .format("%c")(date);
  };

});