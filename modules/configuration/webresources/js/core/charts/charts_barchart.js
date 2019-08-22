"use strict";

gw.globals.chartInitializers = gw.globals.chartInitializers || [];

gw.globals.chartInitializers.push(function (gw, gwCharts) {
  var barChart = gwCharts.barChart = {};
  var MAX_BAR_WIDTH = 64;
  var BARS_INNER_PADDING = 1;

  barChart.initSeriesVisibility = gwCharts.initSeriesVisibilityForAxisChart;
  barChart.toggleOneActiveSeries = gwCharts.toggleOneActiveSeriesForAxisChart;
  barChart.toggleSeriesVisibility = gwCharts.toggleSeriesVisibilityForAxisChart;
  barChart.getXAxisTicks = gwCharts.createXAxisLabels;

  barChart.getRenderer = function(id, spec) {
    var minMaxRange = gwCharts.categoryDataMinMaxYRange(spec.data);
    //bar charts start at 0, unless there are negative values
    var yAxisMinMaxRange = gwCharts.axisRange(spec.yaxis, [Math.min(minMaxRange[0], 0), minMaxRange[1]]);
    var yScaleFactory = function(chartHeight) { return gwCharts.getNumericalAxisScale(spec.yaxis, yAxisMinMaxRange, chartHeight); };
    var xScaleFactory = function(chartWidth) { return d3.scaleBand().padding(0.2).domain(spec.data.categories).range([0, chartWidth]); };
    var chart = new gwCharts.Chart(id, spec, yAxisMinMaxRange, xScaleFactory, yScaleFactory);

    var seriesDetails = gwCharts.seriesDetails(spec.data.series);
    var dualAxisSeriesCount = spec.dualAxisSpec ? spec.dualAxisSpec.data.series.length : 0;

    return {
      render: function (withAxes) {
        var keys = gwCharts.getActiveSeriesKeys(spec.data.series);
        var data = d3.transpose(spec.data.valuesPerCategory).filter(function(serialValues, id) {
          return keys.indexOf(id) >= 0;
        });
        var xBandScale = d3.scaleBand()
            .domain(d3.range(0, dualAxisSeriesCount + data.length))
            .range([0, chart.xAxisDetails.scale.bandwidth()])
            .paddingInner(BARS_INNER_PADDING/chart.xAxisDetails.scale.bandwidth());

        if (withAxes) {
          chart.renderVerticalAxes(spec);
        }

        chart.body.selectAll("g[data-gw-chart-series]").remove();
        chart.body
          .selectAll("g.gw-chart-series")
          .data(data)
          .enter()
          .append("g")
          .attr("data-gw-chart-series", function(d, i) { return seriesDetails.getNormalizedName(keys[i]); })
          .attr("data-gw-dblclick", "gwCharts.toggleOneActiveSeries")
          .attr("class", function (d, i) {
            return gwCharts.classes(seriesDetails.getClassNames(keys[i]), "gw-chart-series");
          })
          .attr("fill", function (d, i) {
            return seriesDetails.getCustomFillColor(keys[i]);
          })
          .attr("stroke", function (d, i) {
            return seriesDetails.getCustomStrokeColor(keys[i]);
          })
          .attr("transform", function (d, i) {
            return "translate(" + xBandScale(i) + ", 0)";
          })
          .each(function (seriesData, seriesIndex) {
            var seriesOffset = keys[seriesIndex];
            var seriesName = spec.data.series[seriesOffset].name;
            var scaleBandwidth = xBandScale.bandwidth();
            var barWidth = barChart.getBarWidth(scaleBandwidth);
            var barHeightProvider = function(d) { return Math.abs(chart.yAxisDetails.scale(d) - chart.yAxisDetails.scale(0)); };

            d3.select(this).selectAll("rect.gw-chart-bar")
              .data(seriesData)
              .enter()
              .append("rect")
              .attr("class", "gw-chart-bar")
              .attr("x", function (d, i) {
                var xOffset = getXOffset(scaleBandwidth, barWidth, seriesIndex, keys.length);
                return chart.xAxisDetails.scale(spec.data.categories[i]) + xOffset;
              })
              .attr("y", function (d) {
                  var yPosition = chart.yAxisDetails.scale(Math.max(0, d));
                  return d < 0 ? yPosition + 1 : yPosition;
              })
              .attr("data-gw-tooltip", function (d) {
                return seriesName + ": " + gwCharts.getTooltipFormatter()(d);
              })
              .attr("width", barWidth)
              .attr("height", function (d) { return Math.abs(chart.yAxisDetails.scale(d) -  chart.yAxisDetails.scale(0)); })
              .attr("stroke-dasharray", function(d) {
                return gwCharts.calculateBarStroke(barWidth, barHeightProvider(d), d);
              })
          });

        if (spec.dualAxisSpec) {
          barChart.renderSecondAxisLine(chart, spec);
        }

        if (spec.noData) {
          gwCharts.noDataGridChart(chart, spec.noData);
        }

        if (withAxes) {
          chart.renderHorizontalAxes(spec, chart.xAxisDetails.scale);
        }
      }
    };

    function getXOffset(scaleBandwidth, barWidth, seriesIndex, seriesCount) {
      // when we decide to use smaller width value than the one calculated by D3
      // than the bar's X-axis position also needs to be adjusted against the
      // original coord
      var offset = scaleBandwidth - barWidth;
      if (offset === 0) {
        return offset;
      }

      var middleSeriesIndex = seriesCount/2;
      var evenSeriesCount = seriesCount % 2 == 0;
      var oddSeriesFactor = evenSeriesCount ? 0 : 0.5;
      var oddSeriesOffset = evenSeriesCount ? 0 : offset/2;

      if (seriesIndex < middleSeriesIndex) {
        // before or in the middle -> shift right
        var factor = middleSeriesIndex - seriesIndex - oddSeriesFactor;
        return factor * offset + oddSeriesOffset;
      } else {
        // after middle -> shift left
        var factor = -1 * (seriesIndex - middleSeriesIndex - oddSeriesFactor);
        return factor * offset - oddSeriesOffset;
      }
    }
  };

  barChart.renderSecondAxisLine = function (chart, chartSpec) {
    var dualAxisTooltipProvider = function (d, seriesName) { return seriesName + ": " + gwCharts.getTooltipFormatter()(d); };
    var xValueProvider = function (d, i) { return chart.xAxisDetails.scale(chartSpec.data.categories[i]); };
    var yValueProvider = function (d) { return chartSpec.dualAxisSpec.yScale(d); };

    gwCharts.renderSecondAxisLine(
        chart,
        chartSpec,
        chartSpec.dualAxisSpec,
        xValueProvider,
        yValueProvider,
        dualAxisTooltipProvider,
        { transposeData: true, xOffset: chart.xAxisDetails.scale.bandwidth() / 2 }
    );
  };

  barChart.getBarWidth = function(scaleBandwidth) {
    return scaleBandwidth <= MAX_BAR_WIDTH ? scaleBandwidth : MAX_BAR_WIDTH;
  };
});