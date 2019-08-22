"use strict";


gw.globals.chartInitializers = gw.globals.chartInitializers || [];

gw.globals.chartInitializers.push(function (gw, gwCharts) {
  var stackedBarChart = gwCharts.stackedBarChart = {};
    
  var BAR_STROKE_WIDTH = 1;
  stackedBarChart.initSeriesVisibility = gwCharts.initSeriesVisibilityForAxisChart;
  stackedBarChart.toggleOneActiveSeries = gwCharts.toggleOneActiveSeriesForAxisChart;
  stackedBarChart.toggleSeriesVisibility = gwCharts.toggleSeriesVisibilityForAxisChart;
  stackedBarChart.getXAxisTicks = gwCharts.createXAxisLabels;

  stackedBarChart.getRenderer = function(id, spec) {
    var seriesDetails = gwCharts.seriesDetails(spec.data.series);
    var seriesCount = spec.data.series.length;
    var stack = d3.stack()
      .offset(d3.stackOffsetDiverging)
      .keys(d3.range(0, seriesCount));
    // Stacked data will be array of array of arrays, first index series, second category, then low/high values
    var stackedData = stack(spec.data.valuesPerCategory);
    var yAxisMinMaxRange = gwCharts.axisRange(spec.yaxis, gwCharts.stackedDataMinMaxYRange(stackedData));

    var xScaleFactory = function(chartWidth) { return d3.scaleBand().padding(0.2).domain(spec.data.categories).range([0, chartWidth]); };
    var yScaleFactory = function(chartHeight) { return gwCharts.getNumericalAxisScale(spec.yaxis, yAxisMinMaxRange, chartHeight); };
    var chart = new gwCharts.Chart(id, spec, yAxisMinMaxRange, xScaleFactory, yScaleFactory);

    return {
      render: function (withAxes) {
        var activeSeriesKeys = gwCharts.getActiveSeriesKeys(spec.data.series);
        var data = d3.stack()
          .offset(d3.stackOffsetDiverging)
          .keys(activeSeriesKeys)(spec.data.valuesPerCategory);

        if (withAxes) {
          chart.renderVerticalAxes(spec);
        }

        chart.body.selectAll("g[data-gw-chart-series]").remove();
        chart.body
          .selectAll('g.gw-chart-series')
          .data(data)
          .enter()
          .append("g")
          .attr("data-gw-chart-series", function (d, i) { return seriesDetails.getNormalizedName(activeSeriesKeys[i]); })
          .attr("data-gw-dblclick", "gwCharts.toggleOneActiveSeries")
          .attr("class", function (d, i) { return gwCharts.classes(seriesDetails.getClassNames(activeSeriesKeys[i]), "gw-chart-series"); })
          .attr("fill", function (d, i) { return seriesDetails.getCustomFillColor(activeSeriesKeys[i]); })
          .attr("stroke", function (d, i) { return seriesDetails.getCustomStrokeColor(activeSeriesKeys[i]); })
          .each(function (seriesData, seriesIndex) {
            var seriesName = spec.data.series[activeSeriesKeys[seriesIndex]].name;
            d3.select(this).selectAll("g.gw-chart-bar")
              .data(seriesData)
              .enter()
              .append("g")
              .attr("class", "gw-chart-bar")
              .each(function (barData, barIndex) {
                var barGroupElement = d3.select(this);
                var hasCustomColor = seriesDetails.isCustomColor(activeSeriesKeys[seriesIndex]);
                drawBar(barGroupElement, barData, barIndex, seriesName, hasCustomColor);
              });
          });

        if (spec.dualAxisSpec) {
          gwCharts.barChart.renderSecondAxisLine(chart, spec);
        }

        if (spec.noData) {
          gwCharts.noDataGridChart(chart, spec.noData);
        }

        if (withAxes) {
          chart.renderHorizontalAxes(spec, chart.xAxisDetails.scale);
        }
      }
    };

    function drawBar(barGroupElement, barData, barIndex, seriesName, hasCustomColor) {
      var barHeight = Math.abs(chart.yAxisDetails.scale(barData[0]) - chart.yAxisDetails.scale(barData[1]));
      if (barHeight === 0) {
        return;
      }

      var scaleBandwidth = chart.xAxisDetails.scale.bandwidth();
      var barWidth = gwCharts.barChart.getBarWidth(scaleBandwidth);
      var xOffset = getXOffset(scaleBandwidth, barWidth);
      var xCoord = chart.xAxisDetails.scale(spec.data.categories[barIndex]) + xOffset;
      //adding margin for negative numbers, so it doesn't overlap with X axis
      var yCoord = chart.yAxisDetails.scale(Math.max(barData[1], barData[0])) + (barData[0] < 0 ? 1 : 0);
      var isBaseBar = barData[0] === 0 || barData[1] === 0;

      // draw bar itself
      barGroupElement
        .append("rect")
        .attr("class", "gw-bar-element")
        .attr("x", xCoord)
        .attr("y", yCoord)
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("data-gw-tooltip", function () {
          return seriesName + ": " + gwCharts.getTooltipFormatter()(barData[0] >= 0 ? barData[1] - barData[0] : barData[0] - barData[1]);
        });

      if (isBaseBar) {
        barGroupElement.attr("stroke-dasharray", gwCharts.calculateBarStroke(barWidth, barHeight, barData[1]));
      } else if (!hasCustomColor) {
        // draw bars separator line
        var y = yCoord + (barData[1] < 0 ? 0 : barHeight);
        barGroupElement
          .append("line")
          .attr("class", "gw-bars-separator")
          .attr("x1", xCoord - BAR_STROKE_WIDTH)
          .attr("y1", y)
          .attr("x2", xCoord + barWidth + BAR_STROKE_WIDTH)
          .attr("y2", y)
          .attr("stroke-width", BAR_STROKE_WIDTH);
      }
    }

    function getXOffset(scaleBandwidth, barWidth) {
      // when we decide to use smaller width value than the one calculated by D3
      // than the bar's X-axis position also needs to be adjusted against the
      // original coord
      if (barWidth < scaleBandwidth) {
        return (scaleBandwidth - barWidth) / 2;
      }
      return 0;
    }
  };
});
