"use strict";


gw.globals.chartInitializers = gw.globals.chartInitializers || [];

gw.globals.chartInitializers.push(function (gw, gwCharts) {
  var roundChart = gwCharts.roundChart = {};

  function sumArray(anArray) {
      if (Array.isArray(anArray)) {
          return anArray.reduce(function (acc, val) {
              return 0 + acc + val;
          }, 0);
      }
      throw "Unable to sum a non-array: " + anArray;
  }

  function getCustomCategoryColors(chartSpec) {
    if (chartSpec.data.series[0] && chartSpec.data.series[0].fills) {
      return chartSpec.data.series[0].fills.map(function(color, index) {
        return {
          colorSet: true,
          fill: color,
          stroke: chartSpec.data.series[0].strokes[index]
        }
      });
    }
  }

  roundChart.getRenderer = function(id, chartSpec, innerRadiusFactor) {
    var colors = getCustomCategoryColors(chartSpec);
    var colorsOffset = colors ? -colors.length : 0;
    var legendSeries = chartSpec.data.categories.map(function (category, index) {
      return $.extend({
        name: category,
        active: chartSpec.data.categoriesVisibility[index]
      }, colors && colors[index] || {colorSet: false});
    });
    var chart = chartSpec.tileChart
        ? new gwCharts.TileRoundChart(id, chartSpec, legendSeries, colorsOffset)
        : new gwCharts.Chart(id, chartSpec, null, null, null, legendSeries, colorsOffset);

    return {
      render : function() {
        var radius = Math.min(chart.width, chart.height) / 2;
        var innerRadius = radius * innerRadiusFactor;
        var activeCategories = chartSpec.data.categories.filter(function (category, index) {
          return chartSpec.data.categoriesVisibility[index];
        });
        var dataSet = d3.transpose(chartSpec.data.valuesPerCategory.filter(function (category, index) {
          return chartSpec.data.categoriesVisibility[index];
        }))[0];

        var valueSum = dataSet === undefined ? 0 : sumArray(dataSet);

        chart.body.selectAll(".gw-chart-pie").remove();

        if (valueSum === 0) { //no data or sum is 0
            var height = chart.height + chart.spacing.topMargin + chart.spacing.bottomMargin;
            var width = chart.width + chart.spacing.leftMargin + chart.spacing.rightMargin;

            chart.body
                .attr("transform", null)
                .append("circle")
                .attr("class", "gw-chart-pie gw-round-chart-placeholder")
                .attr("cx", width/2)
                .attr("cy", height/2)
                .attr("r", radius);

            if (chartSpec.noData) {
                chart.body
                    .append("g")
                    .attr("class", "gw-chart-placeholder")
                    .append("text")
                    .attr("x", width/2)
                    .attr("y", height/2)
                    .attr("text-anchor", "middle")
                    .text(chartSpec.noData);
            }
            return;
        }

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);

        var pie = d3.pie().sort(null);

        var theChart = chart.body
            .append("g")
            .attr("class", "gw-chart-pie");

        if (!chartSpec.tileChart) {
          theChart.attr("transform", "translate(" + (chart.width / 2 - radius) + ",0)");
        }

        var wedges = theChart
            .selectAll("g.gw-chart-pie-wedge")
            .data(pie(dataSet))
            .enter()
            .append("g")
            .attr("class","gw-chart-pie-wedge")
            .attr("transform", "translate(" + radius + ", " + radius + ")");

        var getValueDetailInfo = function(dataValue) {
          var formattedNumericValue = gwCharts.getTooltipFormatter()(dataValue);
          if (valueSum > 0) {
            return formattedNumericValue + "; " + d3.format(".0%")(dataValue / valueSum);
          }
          return formattedNumericValue;
        };

        var visibleIndexes = [];
        chartSpec.data.categoriesVisibility.forEach(function (isVisible, index) {
          if (isVisible) {
            visibleIndexes.push(index);
          }
        });

        var visibleCustomColors = colors && colors.filter(function (color, i) {
          return  visibleIndexes.indexOf(i) > -1;
        });

        var seriesDetails = gwCharts.seriesDetails(colors);
        wedges.append("path")
          .attr("class", function(d, i) { return gwCharts.classes(seriesDetails.getClassNames(visibleIndexes[i], colorsOffset),
              {"gw-chart-wedge": !(visibleCustomColors && visibleCustomColors[i] && visibleCustomColors[i].stroke)}); })
            .attr("d", arc)
            .attr("data-gw-tooltip", function(d, i) {
              return activeCategories[i] + " (" + getValueDetailInfo(d.data) + ")";
            })
            .attr("fill", function(d, i) { return seriesDetails.getCustomFillColor(visibleIndexes[i]); })
            .attr("stroke", function(d, i) { return seriesDetails.getCustomStrokeColor(visibleIndexes[i]);})
            .each(function(d) { this._current = d; });
      }
    }
  };

  roundChart.calculateSpacing = function(rect, chartSpec) {
    var radius = Math.min(rect.width, rect.height) / 2;
    return {
      leftMargin: chartSpec.insetPadding,
      rightMargin: chartSpec.insetPadding,
      topMargin: chartSpec.insetPadding + rect.height / 2 - radius,
      bottomMargin: chartSpec.insetPadding
    }
  };

});
