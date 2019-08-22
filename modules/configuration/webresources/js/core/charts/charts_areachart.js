"use strict";

gw.globals.chartInitializers = gw.globals.chartInitializers || [];

gw.globals.chartInitializers.push(function (gw, gwCharts) {
  var areaChart = gwCharts.areaChart = {};
  areaChart.initSeriesVisibility = gwCharts.initSeriesVisibilityForAxisChart;
  areaChart.toggleOneActiveSeries = gwCharts.toggleOneActiveSeriesForAxisChart;
  areaChart.toggleSeriesVisibility = gwCharts.toggleSeriesVisibilityForAxisChart;
  areaChart.getXAxisTicks = gwCharts.createXAxisLabels;

  areaChart.getRenderer = function(id, spec) {
    var className = 'gw-chart-series';
    var seriesCount = spec.data.series.length;
    var stack = d3.stack()
      .offset(d3.stackOffsetDiverging)
      .keys(d3.range(0, seriesCount));
    // Stacked data will be array of array of arrays, first index series, second category, then low/high values
    var stackedData = stack(spec.data.valuesPerCategory);
    var yAxisMinMaxRange = gwCharts.axisRange(spec.yaxis, gwCharts.stackedDataMinMaxYRange(stackedData));
    var categories = spec.data.categories;

    var xScaleFactory = function(chartWidth) { return d3.scalePoint().domain(categories).range([0, chartWidth]); };
    var yScaleFactory = function(chartHeight) { return gwCharts.getNumericalAxisScale(spec.yaxis, yAxisMinMaxRange, chartHeight); };
    var chart = new gwCharts.Chart(id, spec, yAxisMinMaxRange, xScaleFactory, yScaleFactory);

    var tooltipProvider = function(d, seriesName) {
      return seriesName + ": " + gwCharts.getTooltipFormatter()((Math.abs(d[0]) < Math.abs(d[1]) ? d[1] : d[0]));
    };
    var xValueProvider = function(d, i) { return chart.xAxisDetails.scale(categories[i]); };
    var yValueProvider = function(d) { return chart.yAxisDetails.scale(Math.abs(d[0]) < Math.abs(d[1]) ? d[1] : d[0]); };

    var area = d3.area()
        .x(xValueProvider)
        .y0(function(d) { return chart.yAxisDetails.scale(d[0]); })
        .y1(function(d) { return chart.yAxisDetails.scale(d[1]); });
    var stroke = d3.line()
        .x(xValueProvider)
        .y(yValueProvider);

    return {
      render: function(withAxes) {
        var keys = gwCharts.getActiveSeriesKeys(spec.data.series);
        var data = d3.stack()
          .offset(d3.stackOffsetDiverging)
          .keys(keys)(spec.data.valuesPerCategory);
        var seriesDetails = gwCharts.seriesDetails(spec.data.series);

        if (withAxes) {
          chart.renderVerticalAxes(spec);
        }

        chart.body.selectAll("g[data-gw-chart-series]").remove();
        var seriesGroup = chart.body
          .selectAll('g.' + className)
          .data(data)
          .enter()
          .append("g")
          .attr("class", className)
          .attr("data-gw-chart-series", function(d, i) { return seriesDetails.getNormalizedName(keys[i]); })
          .attr("data-gw-dblclick", "gwCharts.toggleOneActiveSeries");

        // append area
        seriesGroup
          .append("path")
          .attr("class", function(d, i) { return gwCharts.classes(seriesDetails.getClassNames(keys[i]), className); })
          .attr("fill", function(d, i) { return seriesDetails.getCustomFillColor(keys[i]); })
          .attr("stroke", function(d, i) { return seriesDetails.getCustomStrokeColor(keys[i]); })
          .attr("d", area);

        // append stroke line
        seriesGroup
          .append("path")
          .style("fill", "none")
          .attr("stroke", function(d, i) { return seriesDetails.getCustomStrokeColor(keys[i]); })
          .attr("class", function (d, i) { return seriesDetails.getClassNames(keys[i]); })
          .attr("d", stroke);

        gwCharts.renderToolTips(chart, spec, className, tooltipProvider, xValueProvider, yValueProvider, data, 0, keys);

        if (spec.dualAxisSpec) {
          var dualYValueProvider = function(d) { return spec.dualAxisSpec.yScale(d); };
          var dualAxisTooltipProvider = function (d, seriesName) { return seriesName + ": " + gwCharts.getTooltipFormatter()(d); };
          gwCharts.renderSecondAxisLine(
              chart,
              spec,
              spec.dualAxisSpec,
              xValueProvider,
              dualYValueProvider,
              dualAxisTooltipProvider,
              { transposeData: true }
          );
        }

        if (spec.noData) {
          gwCharts.noDataGridChart(chart, spec.noData);
        }

        if (withAxes) {
          chart.renderHorizontalAxes(spec, chart.xAxisDetails.scale);
        }
      }
    };
  };
});
