"use strict";


gw.globals.chartInitializers = gw.globals.chartInitializers || [];

gw.globals.chartInitializers.push(function (gw, gwCharts) {
  var lineChart = gwCharts.lineChart = {};
  var LINE_CIRCLE_R = "3px";
  var LINE_STROKE_WIDTH = "2px";

  lineChart.initSeriesVisibility = gwCharts.initSeriesVisibilityForAxisChart;
  lineChart.toggleOneActiveSeries = gwCharts.toggleOneActiveSeriesForAxisChart;
  lineChart.toggleSeriesVisibility = gwCharts.toggleSeriesVisibilityForAxisChart;
  lineChart.getXAxisTicks = gwCharts.createXAxisLabels;

  lineChart.getRenderer = function(id, spec) {
    var yAxisMinMaxRange = gwCharts.axisRange(spec.yaxis, gwCharts.categoryDataMinMaxYRange(spec.data));
    var categories = spec.data.categories;

    var yScaleFactory = function (chartHeight) { return gwCharts.getNumericalAxisScale(spec.yaxis, yAxisMinMaxRange, chartHeight); };
    var xScaleFactory = function (chartWidth) { return d3.scalePoint().domain(spec.data.categories).range([0, chartWidth]); };
    var chart = new gwCharts.Chart(id, spec, yAxisMinMaxRange, xScaleFactory, yScaleFactory);

    var tooltipProvider = function (d, seriesName) { return seriesName + ": " + gwCharts.getTooltipFormatter()(d); };
    var xValueProvider = function (d, i) { return chart.xAxisDetails.scale(categories[i]); };
    var yValueProvider = function (d) { return chart.yAxisDetails.scale(d); };

    return {
      render: function (withAxes) {
        var keys = gwCharts.getActiveSeriesKeys(spec.data.series);
        var data = d3.transpose(spec.data.valuesPerCategory).filter(function(serialValues, id) {
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
          var dualYValueProvider = function(d) { return spec.dualAxisSpec.yScale(d); };
          gwCharts.renderSecondAxisLine(
              chart,
              spec,
              spec.dualAxisSpec,
              xValueProvider,
              dualYValueProvider,
              tooltipProvider,
              { transposeData: true }
          );
        }

        if (withAxes) {
          chart.renderHorizontalAxes(spec, chart.xAxisDetails.scale);
        }
      }
    };
  };

  lineChart.renderLine = function (chart, spec, className, tooltipProvider, xValueProvider, yValueProvider, data, seriesKeys, offset, ignoreColorPalette) {
    var selectName = 'g.' + className;
    // The offset is used when drawing a line chart on top of a bar chart
    var xOffset = (offset && offset.xOffset) ? offset.xOffset : 0;
    var seriesDetails = gwCharts.seriesDetails(spec.data.series);

    var lineGen = d3.line()
        .x(xValueProvider)
        .y(yValueProvider);

    // Lines
    chart.body
      .selectAll(selectName)
      .data(data)
      .enter()
      .append("g")
      .attr("data-gw-chart-series", function(d, i) { return seriesDetails.getNormalizedName(seriesKeys[i]); })
      .attr("data-gw-dblclick", "gwCharts.toggleOneActiveSeries")
      .attr("transform", function () { return "translate(" + xOffset + ", 0)"; })
      .attr("class", function (d, i) { return gwCharts.classes(!ignoreColorPalette && seriesDetails.getClassNames(seriesKeys[i]),  className); })
      .append("path")
      .attr("stroke", function(d, i) { return seriesDetails.getCustomStrokeColor(seriesKeys[i]); })
      .attr("stroke-width", LINE_STROKE_WIDTH)
      .style("fill", "none")
      .attr("d", lineGen);

    // Dots for values
    var seriesPointSelectName = 'g.' + className + '-series-point';
    var circleClassName = className + "-circle";
    chart.body
      .selectAll(seriesPointSelectName)
      .data(data)
      .enter()
      .append("g")
      .attr("data-gw-chart-series", function(d, i) { return seriesDetails.getNormalizedName(seriesKeys[i]); })
      .attr("data-gw-dblclick", "gwCharts.toggleOneActiveSeries")
      .attr("transform", function (d, i) { return "translate(" + xOffset + ", 0)"; })
      .attr("class", className + '-series-point')
      .each(function(seriesData, seriesIndex) {
        var seriesOffset = seriesKeys ? seriesKeys[seriesIndex] : seriesIndex;
        d3.select(this).selectAll('circle.' + circleClassName)
          .data(seriesData)
          .enter()
          .append("circle")
          .attr("class", className + "-circle")
          .attr("cx", xValueProvider)
          .attr("cy", yValueProvider)
          .attr("class", function() { return gwCharts.classes(!ignoreColorPalette && seriesDetails.getClassNames(seriesOffset), circleClassName); })
          .attr("stroke", function() { return seriesDetails.getCustomStrokeColor(seriesOffset); })
          .attr("fill", function() { return seriesDetails.getCustomFillColor(seriesOffset); })
          .attr("r", LINE_CIRCLE_R)
          .attr("stroke-width", LINE_STROKE_WIDTH);
      });

      if (spec.noData) {
          gwCharts.noDataGridChart(chart, spec.noData);
      }

      gwCharts.renderToolTips(chart, spec, className, tooltipProvider, xValueProvider, yValueProvider, data, xOffset, seriesKeys, ignoreColorPalette);
    };
});