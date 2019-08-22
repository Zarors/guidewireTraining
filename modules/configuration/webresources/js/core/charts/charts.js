"use strict";

(function (gw) {
    var charts = {};
    var renderedCharts = {};
    var chartObservers = {};

    function initChartTypes() {
        var chartInitializers = gw.globals.chartInitializers || [];
        for(var i = 0; i < chartInitializers.length; i++) {
            chartInitializers[i](gw, charts);
        }
    }

    charts.getSystemName = function () {
        return "gwCharts";
    };

    charts.init = function (isFullPageReload) {
        if (isFullPageReload) {
            initChartTypes();
            gw.globals.gwUtil.addCustomEventListener("themeChange", clearTextSizeCache);
            gw.globals.gwUtil.addCustomEventListener("localeChanged", charts.resize);
            gw.globals.gwResizer.addResizeCallback(charts.resize);
        }

        renderAllNeededCharts();
    };

    var renderAllNeededCharts = function () {
        gw.globals.gwUtil.forEach(gw.globals.gwUtil.getDomNodesByAttr("data-gw-chart-should-render"), function (el) {
            var id = el.getAttribute("data-gw-chart-id");
            var chartSpec = JSON.parse(el.getAttribute("data-gw-chart-spec"));
            el.removeAttribute("data-gw-chart-should-render");
            chartHandlersByType()[chartSpec.type].initSeriesVisibility(chartSpec);
            freshRender(id, chartSpec);
        });
    };
    
    gw.registerInitializableSystem(charts);
    gw.registerGlobalSystem(charts);


    //Labels longer than these values will wrap if a space is present, and/or ellipse if necessary.
    //TODO: these could become client config properties if we wanted it to be customer specific
    var MAX_LABEL_EM_WIDTH_HORIZONTAL = 10;
    var MAX_LABEL_EM_WIDTH_VERTICAL = 10;
    var MAX_LABEL_EM_WIDTH_DIAGONAL = 20;
    var BASE_TEXT_SIZE = 14;
    var X_AXIS_LABEL_PADDING_SIZE = 16;
    var Y_AXIS_LABEL_PADDING_SIZE = 16;
    var TICK_PADDING_SIZE = 8;
    var MIN_SPACE_BETWEEN_LABELS = 2;
    var TOOLTIP_CIRCLE_R = "3px";
    var D3_TICK_TEXT_OFFSET_IN_EM = 1.06714; // Based on d3 source and adjusted to the tick padding value applied
    var Y_AXIS_SUGGESTED_NO_TICKS = 10; //default number of ticks for d3 is 10 - can be overriden by this setting
    var Y_AXIS_MIN_LINE_HEIGHT = 20;
    var Y_AXIS_MAX_LINE_HEIGHT = 35;
    var AXIS_MAX_LINES = 3;
    var ELLIPSE_STR = "...";
    var LABEL_CLASSES = "gw-ChartPanelWidget tick-mock-label";
    var AXIS_CLASSES = "gw-axis-label";
    var SIN_45 = Math.sin(Math.PI / 4);
    var LINE_CHART_TYPES = ["Line", "Area", "XYLine", "TimeSeries"];

    var textSizeCache = {};

    function calculateTextSize(svg, string, className, enclosingElement) {
        var textRoot, text, rect;
        if (enclosingElement) {
            textRoot = svg.append(enclosingElement);
            text = textRoot.append("text");
        } else {
            textRoot = text = svg.append("text");
        }
        text.attr("class", className);
        // Move text above top of svg element so it's not visible to user
        text.attr("dy", "-1em")
            .text(string);
        rect = text.node().getBBox();
        textRoot.remove();
        return rect;
    }

    function textHeight(svg, className, enclosingElement) {
        var cacheKey = enclosingElement ? enclosingElement + "." + className : className;
        cacheKey = cacheKey + "_height";
        return textSizeCache[cacheKey]
            || (textSizeCache[cacheKey] = calculateTextSize(svg, "X", className, enclosingElement).height);
    }

    /**
     * Caches text width by text str value
     * @param svg
     * @param className
     * @param enclosingElement
     * @param text
     * @returns {*}
     */
    function textWidth(svg, className, enclosingElement, text) {
        var cacheKey = enclosingElement ? enclosingElement + "." + className : className;
        cacheKey = cacheKey + "_" + text + "_width";
        return textSizeCache[cacheKey]
            || (textSizeCache[cacheKey] = calculateTextSize(svg, text, className, enclosingElement).width);
    }

    function clearTextSizeCache() {
        textSizeCache = {};
    }

    function calculateSpacing(chart, chartSpec, chartRenderer) {
        var xAxisLabels = chartRenderer.getXAxisTicks(chartSpec, chart);

        var axisLabelHeight = textHeight(chart.svg, AXIS_CLASSES);
        var yAxisLabelPadding = Math.round(axisLabelHeight * Y_AXIS_LABEL_PADDING_SIZE / BASE_TEXT_SIZE);
        var xAxisLabelPadding = Math.round(axisLabelHeight * X_AXIS_LABEL_PADDING_SIZE / BASE_TEXT_SIZE);

        var tickTextHeightPx = textHeight(chart.svg, LABEL_CLASSES, "g");
        var textPaddingV = tickTextHeightPx * D3_TICK_TEXT_OFFSET_IN_EM;
        var xAxisHeight = 0;
        var yAxisWidth = 0;
        var dualAxisWidth = 0;

        function leftMargin() {
            var margin = chartSpec.insetPadding ;

            //d3 sometimes generates ticks with decimal part, even though all values are natural numbers. We need to check all of them, as that affects length.
            var useWholeNumbers = (chartSpec.yaxis && chartSpec.yaxis.useWholeNumbers);
            yAxisWidth = getRequiredLabelSize(charts.getTicksValues(chart.yAxisDetails, useWholeNumbers), chart.svg) + textPaddingV;
            margin += yAxisWidth;
            if (chartSpec.yaxis.label) {
                margin += axisLabelHeight * chart.axisLabels.yAxisLabel.length + yAxisLabelPadding;
            }

            var xTickLeftOffset = 0;
            var firstTick = xAxisLabels[0];
            if (chartSpec.xaxis.labelOrientation === "Up45") {
                xTickLeftOffset = Math.max(chart.calculateLabelWidth(firstTick)*SIN_45, xTickLeftOffset);
            } else if (chartSpec.xaxis.labelOrientation === "Horizontal" && chartSpec.type != "Bar") {
                xTickLeftOffset = Math.max(chart.calculateLabelWidth(firstTick)/2, xTickLeftOffset);
            }

            return Math.max(margin, xTickLeftOffset);
        }

        function rightMargin() {
            var margin = chartSpec.insetPadding + textPaddingV;
            if (chartSpec.dualAxis && chartSpec.dualAxis.label) {
                margin += axisLabelHeight * chart.axisLabels.dualAxisLabel.length + yAxisLabelPadding;
            }
            if (chartSpec.dualData) {
                var labelSize = getRequiredLabelSize(charts.getTicksValues(chart.dualYAxisDetails, chartSpec.useWholeNumbers), chart.svg);
                dualAxisWidth = labelSize + textPaddingV;
                margin += labelSize;
            }

            var xTickRightOffset = 0;
            var lastTick = xAxisLabels[xAxisLabels.length - 1];
            if (chartSpec.xaxis.labelOrientation === "Down45") {
                xTickRightOffset = Math.max(chart.calculateLabelWidth(lastTick)*SIN_45, xTickRightOffset);
            } else if (chartSpec.xaxis.labelOrientation === "Horizontal" && chartSpec.type != "Bar") {
                xTickRightOffset = Math.max(chart.calculateLabelWidth(lastTick)/2, xTickRightOffset);
            }
            return Math.max(margin, xTickRightOffset);
        }

        function topMargin() {
            return chartSpec.insetPadding + axisLabelHeight / 2; //Top label is inline with the top of the chart, so half of it is above highest point of the chart
        }

        /**
         * Uses the label orientation and the MAX_LABEL_EM_WIDTHs to calculate the net height of the largest label.
         * @returns {*}
         */
        function calculateXAxisHeight() {
            var labelOrientation = chartSpec.xaxis.labelOrientation;
            var xAxisLabelMaxWidth = 10;

            gw.globals.gwUtil.forEach(xAxisLabels, function (label) {
                xAxisLabelMaxWidth = Math.max(chart.calculateLabelWidth(label), xAxisLabelMaxWidth);
            });

            var finalHeightPx = tickTextHeightPx + textPaddingV / 2;
            // If the label is at a 45 degree angle, then we do math to figure out the height of the triangle
            if (labelOrientation === "Up45" || labelOrientation === "Down45") {
                // Opposite Side = Hypotenuse * sin(theta);
                finalHeightPx += xAxisLabelMaxWidth * SIN_45;
                // if the label is vertical, then we use the width of the text
            } else if (labelOrientation === "Vertical") {
                finalHeightPx = xAxisLabelMaxWidth + textPaddingV;
            }

            return finalHeightPx;
        }

        function bottomMargin() {
            var margin = chartSpec.insetPadding;
            if (chartSpec.xaxis) {
              xAxisHeight = calculateXAxisHeight();
              margin += xAxisHeight;
              if (chartSpec.xaxis.label) {
                    margin += axisLabelHeight * chart.axisLabels.xAxisLabel.length + xAxisLabelPadding;
                }
            }
            return margin;
        }

        return {
            leftMargin: leftMargin(),
            rightMargin: rightMargin(),
            topMargin: topMargin(),
            bottomMargin: bottomMargin(),
            xAxis: { height: xAxisHeight, labels: xAxisLabels },
            yAxis: { width: yAxisWidth, dualAxisWidth: dualAxisWidth },
            xAxisLabel: {height: axisLabelHeight, padding: xAxisLabelPadding},
            yAxisLabel: {height: axisLabelHeight, padding: yAxisLabelPadding}
        }
    }

    function constructSingleAxisLegend(id, chartSpec, legendSeries, offset) {
        var series = legendSeries || chartSpec.data.series;
        var $legendDiv = $("#" + id + " .gw-chart-legend");
        appendLegendToDOM(series, $legendDiv, offset || 0, null, chartSpec.type === "Line", chartSpec.seriesTogglingAllowed);
    }

    function constructDualAxisLegend(id, chartSpec) {
        var $legendDivLeft = $("#" + id + " .gw-chart-legend-left");
        var $legendDivRight = $("#" + id + " .gw-chart-legend-right");
        appendLegendToDOM(chartSpec.data.series, $legendDivLeft, 0, null, chartSpec.type === "Line", chartSpec.seriesTogglingAllowed);
        appendLegendToDOM(chartSpec.dualData.series, $legendDivRight, null, "gw-chart-series-dual", true, chartSpec.seriesTogglingAllowed);
    }

    function appendLegendToDOM(series, legendDiv, offset, seriesCssClass, isStrokeMainColor, isSeriesTogglingAllowed) {
        series.forEach(function (data, index) {
            var seriesDetails = charts.seriesDetails(series);
            var entryClass =  charts.classes('gw-chart-legend-entry', {'gw-chart-legend-entry-inactive': !data.active});
            var chartClass = seriesCssClass ||
              (!seriesDetails.isCustomColor(index) && seriesDetails.getDefaultClassName(index, offset));
            var customColor = isStrokeMainColor
              ? seriesDetails.getCustomStrokeColor(index)
              : seriesDetails.getCustomFillColor(index);

            if (!customColor) {
                chartClass = charts.classes(chartClass, isStrokeMainColor
                  ? seriesDetails.getStrokeLegendClassName(index)
                  : seriesDetails.getFillLegendClassName(index));
            }

            var legendEntry = $("<div>", {
                "class": entryClass,
                "data-gw-chart-series": seriesDetails.getNormalizedName(index),
                "data-gw-click": isSeriesTogglingAllowed ? "gw.globals.gwCharts.toggleSeriesVisibility" : null,
                "tabindex": isSeriesTogglingAllowed ? 0 : -1
            });
            var entryContainer = $("<div>", {
                "class": "gw-legend-entry-container",
                "tabindex": -1
            });
            var entryMarker = $("<div>", {
                "class": ["gw-chart-legend-marker", chartClass].join(" "),
                "style": customColor ? "background-color: " + customColor : null,
                "data-gw-focus": "gw.globals.gwCharts.focusLegendEntryContainer",
                "data-gw-no-tab-index": ""
            });
            var entryText = $("<div>", {
                "class": "gw-chart-legend-text",
                "data-gw-focus": "gw.globals.gwCharts.focusLegendEntryContainer",
                "data-gw-no-tab-index": ""
            });
            legendDiv.append(
                legendEntry.append(
                    entryContainer
                        .append(entryMarker)
                        .append(entryText.text(data.name))
                )
            );
        });
    }

    function constructLegend(id, chartSpec, legendSeries, offset) {
        if (!chartSpec.displayLegend) {
            return;
        }

        if (chartSpec.dualData) {
            constructDualAxisLegend(id, chartSpec);
        } else {
            constructSingleAxisLegend(id, chartSpec, legendSeries, offset);
        }
    }

    charts.focusLegendEntryContainer = function(targetElement) {
        // IE11-dedicated workaround - need to delegate all the focus events up
        var entryContainerElement = $(targetElement).closest(".gw-legend-entry-container").get(0);
        if (!entryContainerElement) {
            return;
        }
        if (entryContainerElement.setActive) {
            entryContainerElement.setActive(); // IE11/Edge
        } else {
            entryContainerElement.focus(); // all the rest
        }
    };

    charts.getTooltipFormatter = function () {
        return d3.format(",")
    };

    charts.calculateBarStroke = function(barWidth, barHeight, refPoint) {
        var dashNoTop = [
            0, barWidth, // top: break
            barHeight, 0, // right: dash
            barWidth, 0, // bottom: dash
            barHeight, 0 // left: dash
        ];
        var dashNoBottom = [
            barWidth, 0, // top: dash
            barHeight, 0, // right: dash
            0, barWidth, // bottom: break
            barHeight, 0 // left: dash
        ];
        return (refPoint < 0 ? dashNoTop : dashNoBottom).join(",");
    };

    function calculateAxisLabels(svg, chartSpec, height, width) {
        return {
            xAxisLabel: chartSpec.xaxis ? splitSvgTextToMatchPxSize(svg, AXIS_CLASSES, "g", chartSpec.xaxis.label, width) : [],
            yAxisLabel: chartSpec.yaxis ? splitSvgTextToMatchPxSize(svg, AXIS_CLASSES, "g", chartSpec.yaxis.label, height) : [],
            dualAxisLabel: chartSpec.dualAxis ? splitSvgTextToMatchPxSize(svg, AXIS_CLASSES, "g", chartSpec.dualAxis.label, height) : []
        };
    }

    /**
     * Object that manages the rectangular chart area, allocating space for axes and labels
     * @param id identifies the div containing the svg element
     * @param chartSpec chart specification sent from server
     * @param legendSeries override for legend series; if not given, use the series specified by the chart spec
     * @constructor
     */
    charts.Chart = function(id, chartSpec, yAxisMinMaxRange, xScaleFactory, yScaleFactory, legendSeries, offset) {
        // Construct legend right away so we can compute an accurate bounding box for the svg element
        constructLegend(id, chartSpec, legendSeries, offset);

        this.svg = d3.select("#" + id + " svg");
        var rect = this.svg.node().getBoundingClientRect();
        this.svg.attr("viewBox", "0 0 " + rect.width + " " + rect.height);
        this.svg.attr("preserveAspectRatio", "none");

        this.yAxisDetails = {
            minMaxRange: yAxisMinMaxRange,
            ticksAmount: Y_AXIS_SUGGESTED_NO_TICKS,
            scale: null
        };

        this.dualYAxisDetails = {
            minMaxRange: yAxisMinMaxRange,
            ticksAmount: Y_AXIS_SUGGESTED_NO_TICKS,
            scale: null
        };

        this.calculateLabelWidth = function(labelText) {
            return textWidth(this.svg, LABEL_CLASSES, "g", labelText);
        };

        this.axisLabels = {
            xAxisLabel: chartSpec.xaxis ? [chartSpec.xaxis.label]: [],
            yAxisLabel: chartSpec.yaxis ?[chartSpec.yaxis.label]: [],
            dualAxisLabel: chartSpec.dualAxis ?[chartSpec.dualAxis.label]: []
        };

        computeWidthAndHeight(this, chartSpec, rect);
        chartSpec.dualAxisSpec = getDualAxisSpec(this, chartSpec);

        if (this.axisLabels.xAxisLabel.length > 1 || this.axisLabels.yAxisLabel.length > 1 || this.axisLabels.dualAxisLabel.length > 1) {
            computeWidthAndHeight(this, chartSpec, rect);
        }

        //in some cases we want to automatically set label orientation
        if (chartSpec.tileChart && chartSpec.type !== 'Pie' && chartSpec.type !== 'Donut') {
            var dynamicLabelOrientation = getTileLabelOrientation(chartSpec, this);
            if (dynamicLabelOrientation !== chartSpec.xaxis.labelOrientation ) {
                chartSpec.xaxis.labelOrientation = dynamicLabelOrientation;
                // label orientation has impact on chart size so need to recalculate
                computeWidthAndHeight(this, chartSpec, rect);
                // also need to recalculate dual axis spec for the same reason
                chartSpec.dualAxisSpec = getDualAxisSpec(this, chartSpec);
            }
        }

        // scales and axes-related things (e.g. tick values) may require some adjustments based on the physical sizing
        var hasAxes = yScaleFactory && xScaleFactory;
        if (hasAxes) {
            this.yAxisDetails.scale = yScaleFactory(this.height);
            this.dualYAxisDetails.scale = chartSpec.dualAxisSpec ? chartSpec.dualAxisSpec.yScale : null;
            this.yAxisDetails.ticksAmount = this.adaptYTicksAmount(this.yAxisDetails.scale);
            this.dualYAxisDetails.ticksAmount = this.dualYAxisDetails.scale ? this.adaptYTicksAmount(this.dualYAxisDetails.scale) : null;
            computeWidthAndHeight(this, chartSpec, rect);
            this.xAxisDetails = { scale: xScaleFactory(this.width) };
        }

        // Create an SVG group element to contain the chart, translate down from top left corner so our coordinate space
        // is the body of the chart
        this.body = this.svg.append("g")
            .attr("transform", "translate(" + this.spacing.leftMargin + "," + this.spacing.topMargin + ")");
    };

    var computeWidthAndHeight = function(chart, chartSpec, rect) {
        chart.spacing = (chartSpec.type !== 'Pie'&& chartSpec.type !== 'Donut')
            ? calculateSpacing(chart, chartSpec, chartHandlersByType()[chartSpec.type])
            : gw.globals.gwCharts.roundChart.calculateSpacing(rect, chartSpec);
        chart.width = rect.width - chart.spacing.leftMargin - chart.spacing.rightMargin;
        chart.height = rect.height - chart.spacing.topMargin - chart.spacing.bottomMargin;
        chart.axisLabels =  calculateAxisLabels(chart.svg, chartSpec, chart.height, chart.width);
    };

    /**
     * Object that manages the square chart area, allocating space for the chart inside a Tile
     * @param id identifies the div containing the svg element
     * @param chartSpec chart specification sent from server
     * @param legendSeries override for legend series; if not given, use the series specified by the chart spec
     * @constructor
     */
    charts.TileRoundChart = function(id, chartSpec, legendSeries, offset) {
        constructLegend(id, chartSpec, legendSeries, offset);
        var svg = d3.select("#" + id + " svg");
        var parentDiv = d3.select("#" + id + " .gw-tcp-ChartContainer");
        var rect = parentDiv.node().getBoundingClientRect();
        var rectSize = Math.min(rect.width, rect.height);
        svg.node().setAttribute("viewBox", "0 0 " + rectSize + " " + rectSize);
        this.svg = svg;
        this.width = rect.width;
        this.height = rect.height;
        this.body = svg.append("g");
        this.spacing = {
            topMargin: 0,
            bottomMargin: 0,
            leftMargin: 0,
            rightMargin: 0
        }
    };


    /**
     * Takes a string and a maxlength and uses the ELLIPSE_STR and ELLIPSE_STR.length to determine if
     * the str should be ellipsed. If it should, returns it ellipsed. If it shouldn't, returns a copy of the str.
     * @param str
     * @param maxLength
     * @returns {*}
     */
    var possiblyEllipsify = function (str, maxLength) {
        if (str.length <= maxLength) {
            return str.slice(0);
        }
        return str.slice(0, maxLength - ELLIPSE_STR.length) + ELLIPSE_STR;
    };

    function trimTextToMatchPxSize(chart, text, pxSize) {

        if (chart.calculateLabelWidth(text) <= pxSize) {
            return text;
        }

        var minimal = text.length > 3 ? text.substring(0,3) + ELLIPSE_STR : text;
        if (chart.calculateLabelWidth(minimal) > pxSize) {
            // fallback: labels may overlap each other in this case
            // but that clearly means text orientation config may need to be changed
            return minimal;
        }

        var trimmed = text.substring(0, text.length - 1 - ELLIPSE_STR.length);
        var candidate = trimmed + ELLIPSE_STR;
        while (chart.calculateLabelWidth(candidate) > pxSize) {
            trimmed = trimmed.substring(0, trimmed.length - 1);
            candidate = trimmed + ELLIPSE_STR;
        }
        return candidate;
    }

    function splitLongLabel(words, svg, className, enclosingElement, pxSize) {
        var resultChunks = [];
        var currentText = "";
        var index = 0;
        while (index < words.length && resultChunks.length <= AXIS_MAX_LINES) {
            if (textWidth(svg, className, enclosingElement, currentText + words[index]) < pxSize) {
                currentText += words[index] + " ";
                index++;
            } else {
                //single word is longer than available space
                if (currentText.length === 0) {
                    var letterCount = pxSize / textWidth(svg, className, enclosingElement, words[index]) * words[index].length;
                    currentText = words[index].substr(0, letterCount);
                    words[index]  = words[index].substr(letterCount, words[index].length - letterCount);
                }
                resultChunks.push(currentText);
                currentText = "";
            }
        }
        if (currentText.length > 0) {
            resultChunks.push(currentText);
        }
        return resultChunks;
    }

    function splitSvgTextToMatchPxSize(svg, className, enclosingElement, text, pxSize) {
        var totalTextWidth = textWidth(svg, className, enclosingElement, text);
        if (totalTextWidth > pxSize) {
            return splitLongLabel(text.split(" "), svg, className, enclosingElement, pxSize);
        }
        return [text];
    }

    /** Returns length of the longest label */
    var getRequiredLabelSize = function (labels, svg) {
        var maxLabelLength = labels.map(function (category) {
            return textWidth(svg, LABEL_CLASSES, "g", category);
        }).reduce(function (a, b) {
            return Math.max(a, b);
        }, 0);

        return Math.min(MAX_LABEL_EM_WIDTH_HORIZONTAL * textHeight(svg, LABEL_CLASSES, "g"), maxLabelLength);
    };

    function isLineChart(chartType) {
        return LINE_CHART_TYPES.indexOf(chartType) >= 0;
    }

    /** Determines  label orientation for tiles, depending on available space */
    var getTileLabelOrientation = function(chartSpec, chart) {
        var labels = chartSpec.data.categories || chart.spacing.xAxis.labels;
        var spaceForLabel = getRequiredLabelSize(labels, chart.svg, false) + MIN_SPACE_BETWEEN_LABELS;
        var labelsFitAxis = chart.width / labels.length > spaceForLabel;
        var firstLabelFits = !isLineChart(chartSpec.type) || chart.calculateLabelWidth(labels[0])/2 < chart.spacing.leftMargin;
        var lastLabelFits = !isLineChart(chartSpec.type) || chart.calculateLabelWidth(labels[labels.length - 1])/2 < chart.spacing.rightMargin;
        return labelsFitAxis && lastLabelFits && firstLabelFits ? "Horizontal" : "Up45";
    };

    function setDefaultNumberFormat() {
        d3.formatDefaultLocale({
            "decimal": gw.globals.gwLocale.getDecimalSymbol(),
            "thousands": gw.globals.gwLocale.getThousandsSymbol(),
            "grouping": [3], // We are not supporting locale specific groupings
            "currency": ["$", ""] // We are not using currency so no need to localize
        });
    }

    /** Appends single line of the axis label */
    charts.Chart.prototype.appendLabelChunk = function(axisLabels, chunk, index) {
        var labelChunk = axisLabels
            .append('tspan')
            .attr('x', '0')
            .text(chunk);

        if (index > 0) {
            labelChunk
                .attr('dy', textHeight(this.svg, AXIS_CLASSES, "g"));
        }
    };

    /** Creates X axis at the bottom of the chart */
    charts.Chart.prototype.renderHorizontalAxes = function (chartSpec, scale) {
        var axisSpec = chartSpec.xaxis;
        var axisGen = d3.axisBottom(scale)
            .tickSizeOuter(0)
            .tickPadding(TICK_PADDING_SIZE);
        if(axisSpec.dateFormat) {
            axisGen.tickFormat(function (d) { return gw.globals.gwCharts.timeSeriesChart.dateFormatter(axisSpec.dateFormat, d); });
        } else if(axisSpec.useWholeNumbers && !chartSpec.data.categories) {
            axisGen.tickFormat(charts.formatWholeNumberTick);
        }

        var labelOrientation = axisSpec.labelOrientation;
        var xAxis = this.body.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .attr("class", "gw-axis gw-x-axis")
            .call(axisGen);

        var isCategoryData = !!chartSpec.data.categories;
        var chart = this;
        if (isCategoryData) {
            var maxLabelWidth = getMaxLabelWidth(labelOrientation);
        }

        /**
         * Called on each text element to add a tooltip, and possibly ellipse or line break long labels.
         */
        var modXLabels = function (d, index) {
            var self = d3.select(d);
            var textHeightPx = textHeight(d.ownerSVGElement, LABEL_CLASSES, "g");
            var currentText = self.text();
            if (isCategoryData) {
                self.text(charts.formatTickLabel(currentText, chartSpec.xaxis.labelOrientation, chartSpec.data.categories.length, maxLabelWidth, chart, chartSpec.type, index));
            }

            switch (labelOrientation) {
                case "Vertical":
                  self.attr("transform", "rotate(90) translate(" + textHeightPx + ", -" + 1.25 * textHeightPx + ")")
                        .style("text-anchor", "start")
                        .classed("vertical-labels", true);
                    break;
                case "Down45":
                    self.attr("transform", "rotate(45) translate(" + 0.5 * textHeightPx + ", -" + 0.25 * textHeightPx + ")")
                        .style("text-anchor", "start")
                        .classed("flip-45-labels", true);
                    break;
                case "Up45":
                    self.attr("transform", "rotate(315) translate(-" + 0.5 * textHeightPx + ", -" + 0.25 * textHeightPx + ")")
                        .style("text-anchor", "end")
                        .classed("flip-45-labels", true);
                    break;
                default:
                    self.style("text-anchor", "middle")
                        .classed("horizontal-labels", true); // Horizontal
            }

            self.attr("data-gw-tooltip", currentText);
        };

        xAxis.selectAll(".tick")
            .selectAll("text")
            .nodes()
            .forEach(modXLabels);

        if (axisSpec.label) {
            // Add X axis label, midway across the chart, axisLabelPadding pixels down from X axis
            var axisLabel = this.body.append("text")
                .attr("transform", "translate(" + (this.width/2) + " ,"
                    + (this.height + this.spacing.xAxis.height + this.spacing.xAxisLabel.padding) + ")")
                .style("text-anchor", "middle")
                .attr("dy", "1em")
                .attr("class", AXIS_CLASSES + " gw-x-axis");

            chart.axisLabels.xAxisLabel.forEach(function(chunk, index) {
                chart.appendLabelChunk(axisLabel, chunk, index);
            });

        }
    };

    /** Initializes Y axis node at the left of the chart */
    charts.Chart.prototype.renderYAxis = function(axisSpec) {
        var axisNode = this.body
            .append("g")
            .attr("class", "gw-axis gw-y-axis");
        var axisGen = d3.axisLeft(this.yAxisDetails.scale)
            .ticks(this.yAxisDetails.ticksAmount)
            .tickPadding(TICK_PADDING_SIZE);
        if (axisSpec.useWholeNumbers) {
            axisGen.tickFormat(charts.formatWholeNumberTick);
        }

        // render
        axisNode.call(axisGen);
        if (axisSpec.label) {
            this.renderYAxisLabel();
        }
    };

    charts.Chart.prototype.renderYAxisLabel = function() {
        // Add Y axisLabels label, midway up the chart. Coordinates are confusing because first the label has to be rotated -90
        // so X and Y switch; the body of the chart is now -height to 0 (X) and 0 to width (Y); the label has to be in the
        // middle of the X range and above the Y range - i.e. in negative Y - as it is outside the body of the chart
        var textChunks = this.axisLabels.yAxisLabel;

        var axisLabels = this.body.append("text")
            .attr("transform", "rotate(-90) translate(" + (-(this.height / 2)) + ","
                + (-(this.spacing.yAxis.width + this.spacing.yAxisLabel.padding + this.spacing.yAxisLabel.height * (textChunks.length-1))) + ")")
            .style("text-anchor", "middle")
            .attr("class", "gw-axisLabels-label gw-y-axisLabels");

        var chart = this;
        textChunks.forEach(function(chunk, index) {
            chart.appendLabelChunk(axisLabels, chunk, index);
        });
    };

    /** Initializes dual Y axis at the right of the chart */
    charts.Chart.prototype.renderDualYAxis = function(axisSpec) {
        var axisNode = this.body.append("g")
            .attr("class", "gw-axis gw-secondary-y-axis")
            .attr("transform", "translate( " + this.width + ", 0 )");
        var axisGen = d3.axisRight(this.dualYAxisDetails.scale)
            .ticks(this.dualYAxisDetails.ticksAmount)
            .tickPadding(TICK_PADDING_SIZE);
        if (axisSpec.useWholeNumbers) {
            axisGen.tickFormat(charts.formatWholeNumberTick);
        }

        // render
        axisNode.call(axisGen);
        if (axisSpec.label) {
            this.renderDualYAxisLabel();
        }
    };

    charts.Chart.prototype.renderDualYAxisLabel = function() {
        var axisLabels = this.body.append("text")
            .attr("transform", "rotate(-90) translate(" + (-(this.height / 2)) + ","
                + (this.width + this.spacing.yAxis.dualAxisWidth + MAX_LABEL_EM_WIDTH_VERTICAL + this.spacing.yAxisLabel.padding) + ")")
            .style("text-anchor", "middle")
            .attr("class", "gw-axis-label gw-secondary-y-axis");

        var chart = this;
        chart.axisLabels.dualAxisLabel.forEach(function(chunk, index) {
            chart.appendLabelChunk(axisLabels, chunk, index);
        });
    };

    /** Creates horizontal grid lines on the chart (for Y axis) */
    charts.Chart.prototype.renderHorizontalGrid = function() {
        var gridAxis = this.body.append("g")
            .attr("class", "gw-y-grid");
        var gridGen = d3.axisLeft(this.yAxisDetails.scale)
            .ticks(this.yAxisDetails.ticksAmount)
            .tickSize(-this.width) // need to use a negative value to get the lines drawn "inside" (instead of "outside") the chart
            .tickFormat("");

        // render
        gridAxis.call(gridGen);
    };

    /**
     * A formatter for Tick values that is used when the axis is set to "use whole numbers". Formats
     * non-whole numbers as an empty string.
     */
    charts.formatWholeNumberTick = function (num) {
        return Math.floor(num) === num ? num : '';
    };

    charts.Chart.prototype.renderVerticalAxes = function (chartSpec) {
        this.renderYAxis(chartSpec.yaxis);
        if (chartSpec.dualAxisSpec) {
            this.renderDualYAxis(chartSpec.dualAxis);
        }
        this.renderHorizontalGrid();
    };

    charts.Chart.prototype.adaptYTicksAmount = function(scale) {
        var initialTicks = scale.ticks();
        var lineHeight = Math.floor(this.height / initialTicks.length);
        var suggestedTicksDetails = {
            ticksAmount: initialTicks.length,
            startingValueMatches: true,
            endingValueMatches: true
        };

        var needsIncrease = lineHeight > Y_AXIS_MAX_LINE_HEIGHT;
        var needsDecrease = lineHeight < Y_AXIS_MIN_LINE_HEIGHT;
        if (needsIncrease || needsDecrease) {
            var lookupFactor = needsIncrease ? Y_AXIS_MAX_LINE_HEIGHT : Y_AXIS_MIN_LINE_HEIGHT;
            var lookupDirection = needsIncrease ? 1 : -1;
            var suggestedTicksAmount = Math.floor(this.height/lookupFactor);
            // d3 doesn't respect provided parameters too strictly so the only way to verify
            // if tick values match what's needed is to actually generate them and compare
            var suggestedTicks = scale.ticks(suggestedTicksAmount);
            suggestedTicksDetails = {
                ticksAmount: suggestedTicks.length,
                startingValueMatches: initialTicks[0] === suggestedTicks[0],
                endingValueMatches: initialTicks[initialTicks.length - 1] === suggestedTicks[suggestedTicks.length - 1]
            };

            // when not able to match bounding values after the first shot - continue lookup in the initial direction
            if (!suggestedTicksDetails.startingValueMatches || !suggestedTicksDetails.endingValueMatches) {
                suggestedTicksDetails = findAppropriateTicksAmount(scale, suggestedTicksAmount, lookupDirection);
            }

            // when still not able to find reasonable amount of ticks - try lookup in the opposite direction
            if (!suggestedTicksDetails.startingValueMatches || !suggestedTicksDetails.endingValueMatches) {
                suggestedTicksDetails = findAppropriateTicksAmount(scale, suggestedTicksAmount, -1 * lookupDirection);
            }
        }

        var useAdaptedValue = suggestedTicksDetails.ticksAmount !== Y_AXIS_SUGGESTED_NO_TICKS
            && suggestedTicksDetails.startingValueMatches && suggestedTicksDetails.endingValueMatches;
        return useAdaptedValue ? suggestedTicksDetails.ticksAmount : Y_AXIS_SUGGESTED_NO_TICKS;
    };

    function findAppropriateTicksAmount(scale, suggestedAmount, transitionFactor) {
        var initialTicks = scale.ticks();
        var startingValue = initialTicks[0];
        var endingValue = initialTicks[initialTicks.length-1];
        var ticksAmount = suggestedAmount;
        var newTicks = scale.ticks(ticksAmount);
        var startingValueMatches = startingValue === newTicks[0];
        var endingValueMatches = endingValue === newTicks[newTicks.length-1];

        function isReasonableAmount(amount) {
            // check if it make sense to continue lookup based on the direction?
            if (transitionFactor > 0) {
                // ...when increasing
                return amount < initialTicks.length;
            } else {
                // ...and when decreasing
                return amount > 1;
            }
        }

        while ((!startingValueMatches || !endingValueMatches) && isReasonableAmount(ticksAmount)) {
            ticksAmount += transitionFactor;
            newTicks = scale.ticks(ticksAmount);
            startingValueMatches = startingValue === newTicks[0];
            endingValueMatches = endingValue === newTicks[newTicks.length-1];
        }

        return {
            ticksAmount: ticksAmount,
            startingValueMatches: startingValueMatches,
            endingValueMatches: endingValueMatches
        };
    }

    charts.seriesDetails = function (series) {
        function strokeClassName(i) {
          return series[i].stroke && series[i].stroke.className || '';
        }

        function fillClassName(i) {
          return series[i].fill && series[i].fill.className || '';
        }
        return {
            getClassNames: function (serialIndex, offset) {
                return this.isCustomColor(serialIndex)
                  ? charts.classes(strokeClassName(serialIndex), fillClassName(serialIndex))
                  : this.getDefaultClassName(serialIndex, offset);
            },
            getDefaultClassName: function (serialIndex, offset) {
              var index = serialIndex + 1 + (offset ? offset : 0);
              return 'gw-chartcolor-' + index;
            },
            getFillLegendClassName: function (serialIndex) {
                return series[serialIndex].fill && series[serialIndex].fill.legendClassName || '';
            },
            getStrokeLegendClassName: function (serialIndex) {
              return series[serialIndex].stroke && series[serialIndex].stroke.legendClassName || '';
            },
            getCustomFillColor: function (serialIndex) {
                return this.isCustomColor(serialIndex) ?
                  series[serialIndex].fill && series[serialIndex].fill.hexColor
                  : '';
            },
            getCustomStrokeColor: function (serialIndex) {
                return this.isCustomColor(serialIndex) ?
                  series[serialIndex].stroke && series[serialIndex].stroke.hexColor
                  : '';
            },
            isCustomColor: function (serialIndex) {
                return series && series[serialIndex] && series[serialIndex].colorSet;
            },
            getNormalizedName: function (serialIndex) {
                return normalizeSeriesName(series[serialIndex]);
            }
        };
    };

    function normalizeSeriesName(seriesDetails) {
        if (!seriesDetails.name) {
            return '';
        }

        var escapedName = seriesDetails.name
            .replace(' ', '%20;')
            .replace('\'', '%22;')
            .replace('\"', '%22;')
            .replace('&', '%26;')
            .replace('<', '%3C;')
            .replace('>', '%3E;');
        return escapedName + (seriesDetails.id ? '-' + seriesDetails.id : '');
    }

    charts.redrawCharts = function () {
        Object.keys(renderedCharts).forEach(function (id) {
            var chartSpec = renderedCharts[id];
            if (chartSpec != null && chartSpec.type) {
                freshRender(id, chartSpec);
            }
        });
    };

    charts.resize = function () {
        gw.globals.gwCharts.redrawCharts();
    };

    function freshRender(id, chartSpec) {
        var chartNode = gw.globals.gwUtil.getDomNode("#" + id);
        gw.globals.gwCharts.cleanup(chartNode, chartSpec);
        setDefaultNumberFormat();

        getRenderer(id, chartSpec).render();
        renderedCharts[id] = chartSpec;
        registerChartExistenceObserver(id);
    }

    function registerChartExistenceObserver(id) {
        if (chartObservers[id]) {
            return;
        }

        var observer = new MutationObserver(function () {
            if (!document.getElementById(id)) {
                delete renderedCharts[id];
                delete chartObservers[id];
                this.disconnect();
            }
        });
        observer.observe(
            gw.globals.gwUtil.getDomNode(document.body),
            {childList: true, subtree: true}
        );
        chartObservers[id] = observer;
    }

    // ================================ common functions  ================================ //

    var getDualAxisSpec = function (chart, chartSpec) {
        if (chartSpec.dualData) {
            var dualYScale = d3.scaleLinear()
                .domain(dualAxisMinMaxRange(chartSpec))
                .range([chart.height, 0]);
            return {chartType: chartSpec.dualType, yScale: dualYScale, data: chartSpec.dualData};
        }
        return null;
    };

    charts.seriesMinMaxDataPointRange = function (data, dataPointValueAccessor) {
        var dataPointIdxValues = data.reduce(function (acc, series) {
            return acc.concat(series.reduce(function (acc2, dataPoint) {
                return acc2.concat(dataPointValueAccessor(dataPoint));
            }, []));
        }, []);
        return [d3.min(dataPointIdxValues), d3.max(dataPointIdxValues)];
    };

    charts.categoryDataMinMaxYRange = function (data) {
        var minY = d3.min(data.valuesPerCategory, function (arr) {
            return d3.min(arr);
        });
        var maxY = d3.max(data.valuesPerCategory, function (arr) {
            return d3.max(arr);
        });
        return [minY, maxY];
    };

    charts.stackedDataMinMaxYRange = function (data) {
        if (data.length === 0) {
            return [0, 0];
        }

        var minY = d3.min(data.map(function (d) {
            return d3.min(d, function (arr) {
                return arr[0];
            })
        }));
        var maxY = d3.max(data.map(function (d) {
            return d3.max(d, function (arr) {
                return arr[1];
            })
        }));
        return [minY, maxY];
    };

    charts.axisRange = function (axisSpec, minMaxRange) {
        var lowerBound = gw.globals.gwUtil.hasValue(axisSpec.lowerBound)
            ? Math.min(axisSpec.lowerBound, minMaxRange[0]) : minMaxRange[0];
        var upperBound = gw.globals.gwUtil.hasValue(axisSpec.upperBound)
            ? Math.max(axisSpec.upperBound, minMaxRange[1]) : minMaxRange[1];
        return [lowerBound, upperBound];
    };

    function dualAxisMinMaxRange(chartSpec) {
        return gw.globals.gwCharts.axisRange(
            chartSpec.dualAxis,
            chartSpec.dualData.valuesPerCategory
                ? gw.globals.gwCharts.categoryDataMinMaxYRange(chartSpec.dualData)
                : gw.globals.gwCharts.seriesMinMaxDataPointRange(chartSpec.dualData.seriesValues, function (d) {
                    return d.y
                }));
    }

    charts.getNumericalAxisScale = function (axisSpec, domain, chartSize, isXAxis) {
        var range = isXAxis ? [0, chartSize] : [chartSize, 0];
      return d3.scaleLinear().domain(domain).range(range).nice();
    };

    charts.getTicksValues = function(axisDetails, useWholeNumbers){
        var ticks = axisDetails.scale
            ? axisDetails.scale.ticks(axisDetails.ticksAmount)
            : d3.ticks(axisDetails.minMaxRange[0], axisDetails.minMaxRange[1], axisDetails.ticksAmount);

        if (useWholeNumbers) {
            return ticks.map(function (tick) {
                return charts.formatWholeNumberTick(tick);
            });
        }
        var format = d3.formatSpecifier(",f");
        format.precision = d3.precisionFixed(ticks[1] - ticks[0]);
        var formatter = d3.format(format);
        return ticks.map(function (tick) {
            return formatter(tick);
        });
    };

    charts.noDataGridChart = function(chart, message) {
        chart.body
            .selectAll('.gw-chart-placeholder')
            .remove();

        chart.body
            .selectAll('.gw-y-grid')
            .append("g")
            .attr("class", "gw-chart-placeholder")
            .append("text")
            .attr("x", chart.width/2)
            .attr("y", chart.height/2)
            .attr("text-anchor", "middle")
            .text(message);
    };

    charts.renderToolTips = function(chart, spec, className, tooltipProvider, xValueProvider, yValueProvider, data, xOffset, seriesKeys, ignoreColorPalette) {
        var tooltipsClassName = className + '-tooltips';
        var seriesDetails = charts.seriesDetails(spec.data.series);

        seriesKeys.forEach(function (i) {
            chart.body.selectAll('g.' + tooltipsClassName + '[data-gw-chart-series=\'' + seriesDetails.getNormalizedName(i) + '\']').remove();
        });

        chart.body
            .selectAll('g.' + tooltipsClassName)
            .data(data)
            .enter()
            .append("g")
            .attr("data-gw-chart-series", function(d, i) { return seriesDetails.getNormalizedName(seriesKeys[i]); })
            .attr("data-gw-dblclick", "gw.globals.gwCharts.toggleOneActiveSeries")
            .attr("data-gw-refuse-focus", true)
            .attr("transform", function (d, i) { return "translate(" + xOffset + ", 0)"; })
            .attr("class", tooltipsClassName)
            .each(function (seriesData, seriesIndex) {
                var seriesOffset = seriesKeys ? seriesKeys[seriesIndex] : seriesIndex;
                var seriesName = spec.data.series[seriesOffset].name;
                d3.select(this).selectAll("circle.gw-chart-tooltip-circle")
                    .data(seriesData)
                    .enter()
                    .append("circle")
                    .attr("cx", xValueProvider)
                    .attr("cy", yValueProvider)
                    .attr("class", function() { return charts.classes('gw-chart-tooltip-circle', !ignoreColorPalette && seriesDetails.getClassNames(seriesOffset)); })
                    .attr("stroke", function() { return seriesDetails.getCustomStrokeColor(seriesOffset); })
                    .attr("fill", function() { return seriesDetails.getCustomFillColor(seriesOffset); })
                    .attr("data-gw-tooltip", function (d) { return tooltipProvider(d, seriesName); })
                    .attr("r", TOOLTIP_CIRCLE_R);
            });
    };

    charts.renderSecondAxisLine = function (chart, spec, dualAxisSpec, xValueProvider, yValueProvider, tooltipProvider, options) {
        var keys = gw.globals.gwCharts.getActiveSeriesKeys(dualAxisSpec.data.series);
        var dualAxisData = options && options.transposeData ? d3.transpose(dualAxisSpec.data.valuesPerCategory) : dualAxisSpec.data.seriesValues;
        dualAxisData = dualAxisData.filter(function (serialValues, id) {
            return keys.indexOf(id) >= 0;
        });
        var offsetData = options && options.xOffset ? {
            seriesCount: spec.data.series.length,
            xOffset: options.xOffset
        } : {seriesCount: spec.data.series.length};

        gw.globals.gwCharts.lineChart.renderLine(
            chart,
            dualAxisSpec,
            'gw-chart-series-dual',
            tooltipProvider,
            xValueProvider,
            yValueProvider,
            dualAxisData,
            keys,
            offsetData,
            true
        );
    };

    charts.toggleSeriesVisibility = function (eventNode) {
        toggleSeriesVisibility(eventNode, false);
    };

    charts.toggleOneActiveSeries = function (eventNode) {
        toggleSeriesVisibility(eventNode, true);
    };

    function toggleSeriesVisibility(eventNode, leaveOnlyOneActive) {
        var $parentWidgetNode = $(eventNode).closest("div[class*=ChartPanelWidget]");
        var chartId = $parentWidgetNode.attr("id");
        var chartSpec = renderedCharts[chartId];

        if (!chartSpec.seriesTogglingAllowed) {
            return;
        }

        var renderer = getRenderer(chartId, chartSpec);
        var seriesTogglingMethod = leaveOnlyOneActive ? 'toggleOneActiveSeries' : 'toggleSeriesVisibility';
        var selectedSeriesName = $(eventNode).data().gwChartSeries;

        gw.globals.gwTooltips.hide();
        renderer[seriesTogglingMethod](chartSpec, selectedSeriesName, $parentWidgetNode[0]);
        renderer.render();
    }

    charts.cleanup = function (chartNode, chartSpec) {
        chartSpec.renderer = null;
        var svgNode = gw.globals.gwUtil.getDomNode("svg", chartNode);
        var legendEntries = gw.globals.gwUtil.getDomNodes(".gw-chart-legend-entry", chartNode);
        for(var i = legendEntries.length - 1; i >= 0; i--) {
          legendEntries[i].parentElement.removeChild(legendEntries[i]);
        }
        gw.globals.gwUtil.removeNodeIfExists("g", svgNode);
        gw.globals.gwUtil.removeNodeIfExists("script", chartNode);
    };

    charts.getActiveSeriesKeys = function (seriesData) {
        var keys = [];
        seriesData.forEach(function (data, index) {
            if (data.active) {
                keys.push(index);
            }
        });
        return keys;
    };

    charts.initSeriesVisibilityForRoundChart = function (chartSpec) {
        chartSpec.data.categoriesVisibility = [];
        chartSpec.data.categories.forEach(function () {
            chartSpec.data.categoriesVisibility.push(true);
        });
    };

    charts.initSeriesVisibilityForAxisChart = function (chartSpec) {
        getAllAvailableSeriesFromSpec(chartSpec).forEach(function (details, index) {
            details.id = index;
            details.active = true;
        });
    };

    charts.toggleSeriesVisibilityForRoundChart = function (chartSpec, selectedSeriesName, parentWidgetNode) {
        var categories = chartSpec.data.categories;
        for (var i = 0; i < categories.length; i++) {
            if (normalizeSeriesName({name: categories[i]}) === selectedSeriesName) {
                chartSpec.data.categoriesVisibility[i] = !chartSpec.data.categoriesVisibility[i];
                var allLegendEntriesDisabled = chartSpec.data.categoriesVisibility.every(function (isActive) {
                    return !isActive
                });
                //round charts need at least one active category
                if (allLegendEntriesDisabled) {
                    chartSpec.data.categoriesVisibility[i] = !chartSpec.data.categoriesVisibility[i];
                    return;
                }

            }
        }
        toggleLegendEntry(parentWidgetNode, selectedSeriesName);
    };

    charts.toggleSeriesVisibilityForAxisChart = function (chartSpec, selectedSeriesName, parentWidgetNode) {
        var allAvailableSeries = getAllAvailableSeriesFromSpec(chartSpec);
        for (var i = 0; i < allAvailableSeries.length; i++) {
            var entry = allAvailableSeries[i];
            if (normalizeSeriesName(entry) === selectedSeriesName) {
                entry.active = !entry.active;
                break;
            }
        }
        toggleLegendEntry(parentWidgetNode, selectedSeriesName);
    };

    charts.toggleOneActiveSeriesForAxisChart = function (chartSpec, selectedSeriesName, parentWidgetNode) {
        var numberOfActiveSeries = getAllAvailableSeriesFromSpec(chartSpec).filter(function (data) {
            return data.active;
        }).length;
        if (numberOfActiveSeries > 1) {
            getAllAvailableSeriesFromSpec(chartSpec)
                .filter(function (data) {
                    return normalizeSeriesName(data) !== selectedSeriesName;
                })
                .forEach(function (data) {
                    data.active = false;
                    switchOffLegendEntry(parentWidgetNode, normalizeSeriesName(data))
                });
        } else {
            getAllAvailableSeriesFromSpec(chartSpec)
                .forEach(function (data) {
                    data.active = true;
                    switchOnLegendEntry(parentWidgetNode, normalizeSeriesName(data))
                })
        }
    };

    charts.toggleOneActiveSeriesForRoundChart = function (chartSpec, selectedSeriesName, parentWidgetNode) {
    };

    charts.formatTickLabel = function(labelText, labelOrientation, noTicks, maxLabelWidth, chart, chartType, tickIndex) {
        var labelSpacing = MIN_SPACE_BETWEEN_LABELS * (noTicks + 1);
        if (labelOrientation === 'Horizontal') {
            var maxLabelWidthPx = Math.floor((chart.width - labelSpacing) / noTicks);

            if (isLineChart(chartType)) {
                if (tickIndex == 0) {
                    var pxSize = chart.spacing ? Math.min(maxLabelWidthPx, chart.spacing.leftMargin * 2) : maxLabelWidthPx;
                    return trimTextToMatchPxSize(chart, labelText, pxSize);
                }
                if (tickIndex == noTicks - 1) {
                    var pxSize = chart.spacing ? Math.min(maxLabelWidthPx, chart.spacing.rightMargin * 2) : maxLabelWidthPx;
                    return trimTextToMatchPxSize(chart, labelText, pxSize);
                }
            }

            return trimTextToMatchPxSize(chart, labelText, maxLabelWidthPx);
        } else {
            return possiblyEllipsify(labelText, maxLabelWidth);
        }
    };

    charts.createXAxisLabels = function (chartSpec, chart) {
        var maxLabelWidth = getMaxLabelWidth(chartSpec.xaxis.labelOrientation);
        var xAxisLabels = [];

        gw.globals.gwUtil.forEach(chartSpec.data.categories, function (currentText, i) {
            var labelChunks = charts.formatTickLabel(currentText, chartSpec.xaxis.labelOrientation, chartSpec.data.categories.length, maxLabelWidth, chart, chartSpec.type, i);
            xAxisLabels.push(labelChunks);
        });
        return xAxisLabels;
    };

    charts.classes = function () {
      var classes = [];

      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (!arg) continue;

        var argType = typeof arg;

        if (argType === 'string' || argType === 'number') {
          classes.push(arg);
        } else if (Array.isArray(arg) && arg.length) {
          var inner = charts.classes.apply(null, arg);
          if (inner) {
            classes.push(inner);
          }
        } else if (argType === 'object') {
          for (var key in arg) {
            if ({}.hasOwnProperty.call(arg, key) && arg[key]) {
              classes.push(key);
            }
          }
        }
      }

      return classes.join(' ');
    };

    function getMaxLabelWidth(labelOrientation) {
        if (labelOrientation === "Up45" || labelOrientation === "Down45") {
            return MAX_LABEL_EM_WIDTH_DIAGONAL;
        } else if (labelOrientation === "Vertical") {
            return MAX_LABEL_EM_WIDTH_VERTICAL;
        } else {
            return MAX_LABEL_EM_WIDTH_HORIZONTAL;
        }
    }

    function getRenderer(id, chartSpec) {
        var withAxes = false;
        var chartHandler = chartHandlersByType()[chartSpec.type];

        if (!chartSpec.renderer) {
            withAxes = true;
            chartSpec.renderer = chartHandler.getRenderer(id, chartSpec);
        }

        return {
            render: function () {
                chartSpec.renderer.render(withAxes);
                gw.globals.gwEvents.addInlineEventListenersToContainer(gw.globals.gwUtil.getDomNode("#" + id));
            },
            toggleSeriesVisibility: chartHandler.toggleSeriesVisibility,
            toggleOneActiveSeries: chartHandler.toggleOneActiveSeries
        };
    }

    function getAllAvailableSeriesFromSpec(chartSpec) {
        return chartSpec.dualData ? [].concat(chartSpec.data.series).concat(chartSpec.dualData.series) : chartSpec.data.series;
    }

    function toggleLegendEntry(parentWidgetNode, seriesName) {
        gw.globals.gwUtil.toggleClass(getLegendEntryNode(parentWidgetNode, seriesName), 'gw-chart-legend-entry-inactive');
    }

    function switchOnLegendEntry(parentWidgetNode, seriesName) {
        gw.globals.gwUtil.removeClass(getLegendEntryNode(parentWidgetNode, seriesName), 'gw-chart-legend-entry-inactive');
    }

    function switchOffLegendEntry(parentWidgetNode, seriesName) {
        gw.globals.gwUtil.addClass(getLegendEntryNode(parentWidgetNode, seriesName), 'gw-chart-legend-entry-inactive');
    }

    function getLegendEntryNode(parentWidgetNode, seriesName) {
        return parentWidgetNode.querySelector("div[data-gw-chart-series='" + seriesName + "']");
    }

    // ================================ Main Chart Renderers ================================ //

    var chartHandlersByType = function () {
        return {
            "Area": gw.globals.gwCharts.areaChart,
            "Bar": gw.globals.gwCharts.barChart,
            "Donut": gw.globals.gwCharts.donutChart,
            "Line": gw.globals.gwCharts.lineChart,
            "Pie": gw.globals.gwCharts.pieChart,
            "XYLine": gw.globals.gwCharts.xylineChart,
            "StackedBar": gw.globals.gwCharts.stackedBarChart,
            "TimeSeries": gw.globals.gwCharts.timeSeriesChart
        };
    };

})(gw);
