//
// Copyright (C) Microsoft. All rights reserved.
//
// <!-- saved from url=(0016)http://localhost -->
// DataUtilities.ts
// 
// Copyright (C) Microsoft. All rights reserved.
//
var VisualProfiler;
(function (VisualProfiler) {
    var Graphs;
    (function (Graphs) {
        "use strict";
        /* A helper class to get graph data from the analyzer.
         */
        var DataUtilities = (function () {
            function DataUtilities() {
            }
            DataUtilities.getFilteredResult = function (dataWarehouse, analyzerId, counterId, timespan, customData) {
                var contextData = {
                    timeDomain: timespan,
                    customDomain: {
                        CounterId: counterId
                    }
                };
                if (customData) {
                    for (var key in customData) {
                        if (customData.hasOwnProperty(key)) {
                            contextData.customDomain[key] = customData[key];
                        }
                    }
                }
                return dataWarehouse.getFilteredData(contextData, analyzerId);
            };
            return DataUtilities;
        })();
        Graphs.DataUtilities = DataUtilities;
    })(Graphs = VisualProfiler.Graphs || (VisualProfiler.Graphs = {}));
})(VisualProfiler || (VisualProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/visualprofiler.csproj_1601524658/objr/x86/built/js/hubGraphs/DataUtilities.js.map

// GraphResources.ts
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../../../Common/Script/ExternalReferences.ts" />
var VisualProfiler;
(function (VisualProfiler) {
    var Graphs;
    (function (Graphs) {
        "use strict";
        /* A helper class to get the resource string either from the hub resource dictionary or from Microsoft.Plugin.
         */
        var GraphResources = (function () {
            function GraphResources(resources) {
                this._graphResources = resources;
            }
            GraphResources.prototype.getString = function (resourceId) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                // First try to get the resource from the dictionary
                if (this._graphResources) {
                    var resourceString = this._graphResources[resourceId];
                    if (resourceString !== undefined) {
                        resourceString = GraphResources.format(resourceId, resourceString, args);
                        return resourceString;
                    }
                }
                try {
                    return Microsoft.Plugin.Resources.getString.apply(Microsoft.Plugin.Resources, arguments);
                }
                catch (e) {
                }
                return resourceId;
            };
            GraphResources.format = function (resourceId, format, args) {
                return format.replace(GraphResources.FORMAT_REG_EXP, function (match, index) {
                    var replacer;
                    switch (match) {
                        case "{{":
                            replacer = "{";
                            break;
                        case "}}":
                            replacer = "}";
                            break;
                        case "{":
                        case "}":
                            throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPlugin.3002"));
                        default:
                            var argsIndex = parseInt(index);
                            if (args && argsIndex < args.length) {
                                replacer = args[argsIndex];
                            }
                            else {
                                throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPlugin.3003") + " (resourceId = " + resourceId + ")");
                            }
                            break;
                    }
                    if (replacer === undefined || replacer === null) {
                        replacer = "";
                    }
                    if (typeof replacer !== "string") {
                        replacer = replacer.toString();
                    }
                    return replacer;
                });
            };
            GraphResources.FORMAT_REG_EXP = /\{{2}|\{(\d+)\}|\}{2}|\{|\}/g;
            return GraphResources;
        })();
        Graphs.GraphResources = GraphResources;
    })(Graphs = VisualProfiler.Graphs || (VisualProfiler.Graphs = {}));
})(VisualProfiler || (VisualProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/visualprofiler.csproj_1601524658/objr/x86/built/js/hubGraphs/GraphResources.js.map

// StackedBarChart.ts
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../../../Common/Script/ExternalReferences.ts" />
/// <reference path="../../../../Common/Script/TimeSpan.ts" />
var VisualProfiler;
(function (VisualProfiler) {
    var Graphs;
    (function (Graphs) {
        "use strict";
        var DiagnosticsHub = Microsoft.VisualStudio.DiagnosticsHub;
        var DataSeriesInfo = (function () {
            function DataSeriesInfo(name, cssClass, sortOrder) {
                if (!name || sortOrder === undefined || sortOrder === null) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1044"));
                }
                this._name = name;
                this._cssClass = cssClass;
                this._sortOrder = sortOrder;
            }
            Object.defineProperty(DataSeriesInfo.prototype, "cssClass", {
                get: function () {
                    return this._cssClass;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataSeriesInfo.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataSeriesInfo.prototype, "sortOrder", {
                get: function () {
                    return this._sortOrder;
                },
                enumerable: true,
                configurable: true
            });
            return DataSeriesInfo;
        })();
        Graphs.DataSeriesInfo = DataSeriesInfo;
        var StackedBarChartPresenter = (function () {
            function StackedBarChartPresenter(options) {
                this._data = [];
                this._dataSeriesInfo = {};
                this._maximumYValue = Number.NEGATIVE_INFINITY;
                this.viewModel = [];
                this._options = options;
                this.validateOptions();
                this._pixelHorizontalValue = this.xWidth / this._options.width;
            }
            Object.defineProperty(StackedBarChartPresenter.prototype, "maximumYValue", {
                get: function () {
                    return this._maximumYValue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StackedBarChartPresenter.prototype, "xWidth", {
                get: function () {
                    return this._options.maxX - this._options.minX;
                },
                enumerable: true,
                configurable: true
            });
            StackedBarChartPresenter.prototype.addData = function (chartData) {
                var _this = this;
                chartData.forEach(function (dataItem) {
                    if (_this._dataSeriesInfo.hasOwnProperty(dataItem.series)) {
                        _this._data.push(dataItem);
                    }
                    else {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1043"));
                    }
                });
                this.generateViewModel();
            };
            StackedBarChartPresenter.prototype.addSeries = function (seriesInfo) {
                for (var i = 0; i < seriesInfo.length; i++) {
                    var info = seriesInfo[i];
                    if (this._dataSeriesInfo.hasOwnProperty(info.name)) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1045"));
                    }
                    this._dataSeriesInfo[info.name] = info;
                }
            };
            StackedBarChartPresenter.prototype.getViewOptions = function () {
                var viewOptions = {
                    ariaDescription: this._options.ariaDescription,
                    ariaLabelCallback: this._options.ariaLabelCallback,
                    height: this._options.height,
                    width: this._options.width,
                    tooltipCallback: this._options.tooltipCallback,
                    legendData: this._dataSeriesInfo
                };
                return viewOptions;
            };
            StackedBarChartPresenter.prototype.convertChartAreaPercentToDataValue = function (percent) {
                return Math.round(percent * this.xWidth / 100) + this._options.minX;
            };
            StackedBarChartPresenter.prototype.determineYAxisScale = function (allBars) {
                for (var i = 0; i < allBars.length; i++) {
                    var totalStackHeight = 0;
                    var currentBar = allBars[i];
                    for (var j = 0; j < currentBar.length; j++) {
                        var stackComponent = currentBar[j];
                        if (stackComponent.height > 0) {
                            totalStackHeight += stackComponent.height;
                        }
                    }
                    this._maximumYValue = Math.max(this._maximumYValue, totalStackHeight);
                }
                this._maximumYValue = Math.max(this._options.minYHeight, this._maximumYValue);
                // Round the max value to the next 100, taking into account real precision (to avoid scaling up by 100 to cater
                // for the 100.0000000001 case)
                this._maximumYValue = Math.ceil(Math.floor(this._maximumYValue) / 100) * 100;
                var availableAxisHight = this._options.height - StackedBarChartPresenter.YAXIS_PIXEL_PADDING;
                if (availableAxisHight <= 0) {
                    availableAxisHight = this._options.height;
                }
                this._pixelVerticalValue = this._maximumYValue / availableAxisHight;
                this._maximumYValue = this._options.height * this._pixelVerticalValue;
            };
            StackedBarChartPresenter.prototype.generateViewModel = function () {
                var allBars = [[]];
                var singleBar = [];
                var barWidthAndMargin = this._options.barWidth + this._options.barGap;
                var currentXValue = this._options.minX;
                var prevValue = Number.NEGATIVE_INFINITY;
                var x = 0;
                var i = 0;
                while (i < this._data.length) {
                    var dataItem = this._data[i];
                    if (dataItem.x < prevValue) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1046"));
                    }
                    if (dataItem.x > this._options.maxX) {
                        break;
                    }
                    prevValue = dataItem.x;
                    var currentXValue = Math.floor(x * this._pixelHorizontalValue + this._options.minX);
                    var currentBarMinValue = currentXValue;
                    var currentBarMaxValue = currentXValue + Math.floor((this._options.barWidth + this._options.barGap) * this._pixelHorizontalValue);
                    if (dataItem.x < currentBarMinValue) {
                        i++;
                        continue;
                    }
                    if (dataItem.x < currentBarMaxValue) {
                        dataItem.x = x;
                        singleBar.push(dataItem);
                        i++;
                    }
                    else {
                        allBars.push(singleBar);
                        singleBar = [];
                        x += barWidthAndMargin;
                    }
                }
                allBars.push(singleBar);
                this.determineYAxisScale(allBars);
                for (var i = 0; i < allBars.length; i++) {
                    this.generateViewModelForSingleStack(allBars[i]);
                }
            };
            StackedBarChartPresenter.prototype.generateViewModelForSingleStack = function (dataItems) {
                if (!dataItems || dataItems.length === 0) {
                    return;
                }
                dataItems.sort(this.sortBySeries.bind(this));
                var accumulatedHeight = 0;
                var maxHeightExceeded = false;
                var singleBarViewModel = [];
                for (var i = dataItems.length - 1; i >= 0; i--) {
                    var dataItem = dataItems[i];
                    if (dataItem.height <= 0) {
                        continue;
                    }
                    // We want to display the small amounts as 1-pixel bars, but need to round the rest
                    // to reduce the liklihood of exceeding 100% for the stack on the graph.
                    var barHeight = Math.round(dataItem.height / this._pixelVerticalValue);
                    if (dataItem.height > 0 && barHeight < 1) {
                        barHeight = 1;
                    }
                    var startY = this._options.height - (barHeight + accumulatedHeight) - 1;
                    if (startY < 0) {
                        barHeight = this._options.height - accumulatedHeight;
                        startY = 0;
                        maxHeightExceeded = true;
                    }
                    accumulatedHeight += barHeight;
                    if (this._options.showStackGap && barHeight > 1) {
                        barHeight -= 1;
                        startY += 1;
                    }
                    var rectangle = {
                        x: dataItem.x,
                        y: startY,
                        height: barHeight,
                        width: this._options.barWidth,
                        className: this._dataSeriesInfo[dataItem.series].cssClass,
                        chartItem: dataItem
                    };
                    this.viewModel.push(rectangle);
                    if (maxHeightExceeded) {
                        break;
                    }
                }
            };
            StackedBarChartPresenter.prototype.sortBySeries = function (chartItem1, chartItem2) {
                return this._dataSeriesInfo[chartItem2.series].sortOrder - this._dataSeriesInfo[chartItem1.series].sortOrder;
            };
            StackedBarChartPresenter.prototype.validateOptions = function () {
                if (!this._options) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1047"));
                }
                if ((this._options.minX === undefined || this._options.minX === null) || (this._options.maxX === undefined || this._options.maxX === null) || (this._options.minY === undefined || this._options.minY === null) || (this._options.minX > this._options.maxX) || (!this._options.height || !this._options.width || this._options.height < 0 || this._options.width < 0) || (!this._options.barWidth || this._options.barWidth < 0)) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1048"));
                }
                this._options.barGap = this._options.barGap || 0;
                this._options.showStackGap = this._options.showStackGap || false;
                this._options.minYHeight = this._options.minYHeight || this._options.minY;
            };
            StackedBarChartPresenter.YAXIS_PIXEL_PADDING = 10;
            return StackedBarChartPresenter;
        })();
        Graphs.StackedBarChartPresenter = StackedBarChartPresenter;
        var StackedBarChartView = (function () {
            function StackedBarChartView() {
                this._idCount = 0;
                this._selectedId = -1;
                this.rootElement = document.createElement("div");
                this.rootElement.style.width = this.rootElement.style.height = "100%";
            }
            Object.defineProperty(StackedBarChartView.prototype, "presenter", {
                set: function (value) {
                    this._presenter = value;
                    this._viewData = this._presenter.viewModel;
                    this._options = value.getViewOptions();
                    this._barGraphWidth = this._options.width;
                    this.drawChart();
                },
                enumerable: true,
                configurable: true
            });
            StackedBarChartView.prototype.convertPageXToChartAreaPercent = function (pageX) {
                var rect = this._chartAreaContainer.getBoundingClientRect();
                return (pageX - rect.left) / this._barGraphWidth * 100;
            };
            StackedBarChartView.prototype.createContainer = function () {
                if (!this._chartAreaContainer) {
                    this._chartAreaContainer = document.createElement("div");
                    this.rootElement.appendChild(this._chartAreaContainer);
                }
                else {
                    this._chartAreaContainer.innerHTML = "";
                }
                this._chartAreaContainer.style.width = this._options.width + "px";
                this._chartAreaContainer.style.height = this._options.height + "px";
                this._chartAreaContainer.classList.add("stackedBarChart");
                this._chartAreaContainer.style.display = "-ms-grid";
            };
            StackedBarChartView.prototype.createRect = function (x, y, height, width, className) {
                var rect = document.createElement("div");
                rect.id = StackedBarChartView._barIdPrefix + this._idCount;
                rect.tabIndex = -1;
                this._idCount++;
                rect.classList.add("bar");
                rect.classList.add(className);
                rect.style.left = x + "px";
                rect.style.bottom = (this._options.height - y - height) + "px";
                rect.style.height = height + "px";
                rect.style.width = width + "px";
                return rect;
            };
            StackedBarChartView.prototype.drawChart = function () {
                if (!this._viewData) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1049"));
                }
                this.createContainer();
                this.initializeBarGraph();
                this.renderViewData(this._barGraph, this._viewData);
                this._chartAreaContainer.appendChild(this._barGraph);
            };
            StackedBarChartView.prototype.initializeBarGraph = function () {
                var _this = this;
                this._selectedId = -1;
                this._idCount = 0;
                this._barGraph = document.createElement("div");
                this._barGraph.classList.add("barGraph");
                this._barGraph.tabIndex = 0;
                this._barGraph.style.height = this._options.height + "px";
                this._barGraph.style.width = this._barGraphWidth + "px";
                this._barGraph.addEventListener("keydown", this.onBarGraphKeydown.bind(this));
                this._barGraph.addEventListener("focus", function () {
                    _this._selectedId = -1;
                });
                if (this._options.ariaDescription) {
                    this._barGraph.setAttribute("aria-label", this._options.ariaDescription);
                }
            };
            StackedBarChartView.prototype.onBarBlur = function (event) {
                var bar = event.currentTarget;
                bar.classList.remove("focused");
                Microsoft.Plugin.Tooltip.dismiss();
            };
            StackedBarChartView.prototype.onBarFocus = function (chartItem, event) {
                var bar = event.currentTarget;
                bar.classList.add("focused");
                if (this._options.ariaLabelCallback) {
                    var ariaLabel = this._options.ariaLabelCallback(chartItem);
                    bar.setAttribute("aria-label", ariaLabel);
                }
            };
            StackedBarChartView.prototype.onBarGraphKeydown = function (event) {
                if (event.keyCode === 37 /* ArrowLeft */ || event.keyCode === 39 /* ArrowRight */) {
                    if (event.keyCode === 37 /* ArrowLeft */) {
                        if ((this._selectedId === 0) || (this._selectedId === -1)) {
                            this._selectedId = this._idCount;
                        }
                        this._selectedId--;
                    }
                    else if (event.keyCode === 39 /* ArrowRight */) {
                        this._selectedId++;
                        if (this._selectedId === this._idCount) {
                            this._selectedId = 0;
                        }
                    }
                    var bar = document.getElementById(StackedBarChartView._barIdPrefix + this._selectedId);
                    bar.focus();
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                return true;
            };
            StackedBarChartView.prototype.onBarKeydown = function (objectForTooltip, event) {
                if (event.keyCode === 13 /* Enter */) {
                    var element = event.currentTarget;
                    var offsetX = window.screenLeft + element.offsetLeft + element.clientWidth;
                    var offsetY = window.screenTop + element.offsetTop;
                    element = element.offsetParent;
                    while (element) {
                        offsetX += element.offsetLeft;
                        offsetY += element.offsetTop;
                        element = element.offsetParent;
                    }
                    this.showTooltip(objectForTooltip, offsetX, offsetY);
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                return true;
            };
            StackedBarChartView.prototype.renderViewData = function (container, viewData) {
                for (var i = 0; i < viewData.length; i++) {
                    var barInfo = viewData[i];
                    var rectangle = this.createRect(barInfo.x, barInfo.y, barInfo.height, barInfo.width, barInfo.className);
                    rectangle.addEventListener("mouseover", this.showTooltip.bind(this, barInfo.chartItem));
                    rectangle.addEventListener("mouseout", function () { return Microsoft.Plugin.Tooltip.dismiss(); });
                    rectangle.addEventListener("keydown", this.onBarKeydown.bind(this, barInfo.chartItem));
                    rectangle.addEventListener("focus", this.onBarFocus.bind(this, barInfo.chartItem));
                    rectangle.addEventListener("blur", this.onBarBlur.bind(this));
                    container.appendChild(rectangle);
                }
            };
            StackedBarChartView.prototype.showTooltip = function (chartItem, x, y) {
                if (this._options.tooltipCallback) {
                    var toolTipContent = this._options.tooltipCallback(chartItem);
                    var config = { content: toolTipContent, delay: 0, x: x, y: y, contentContainsHTML: true };
                    Microsoft.Plugin.Tooltip.show(config);
                }
            };
            StackedBarChartView._barIdPrefix = "bar";
            return StackedBarChartView;
        })();
        Graphs.StackedBarChartView = StackedBarChartView;
    })(Graphs = VisualProfiler.Graphs || (VisualProfiler.Graphs = {}));
})(VisualProfiler || (VisualProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/visualprofiler.csproj_1601524658/objr/x86/built/js/hubGraphs/StackedBarChart.js.map

// StackedBarGraph.ts
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="StackedBarChart.ts" />
/// <reference path="DataTypes.d.ts" />
/// <reference path="DataUtilities.ts" />
/// <reference path="GraphResources.ts" />
var VisualProfiler;
(function (VisualProfiler) {
    var Graphs;
    (function (Graphs) {
        "use strict";
        var DiagnosticsHub = Microsoft.VisualStudio.DiagnosticsHub;
        var Category = (function () {
            function Category() {
            }
            Category.parsingCategory = "Parsing_Category";
            Category.layoutCategory = "Layout_Category";
            Category.appCodeCategory = "AppCode_Category";
            Category.xamlOtherCategory = "XamlOther_Category";
            Category.renderCategory = "Render_Category";
            Category.ioCategory = "IO_Category";
            return Category;
        })();
        Graphs.Category = Category;
        var StackedBarGraph = (function () {
            function StackedBarGraph(config) {
                this._scaleChangedEvent = new DiagnosticsHub.AggregatedEvent();
                this._config = config;
                this._graphResources = new Graphs.GraphResources(this._config.resources);
                this._timeRange = this._config.timeRange || new DiagnosticsHub.JsonTimespan(new DiagnosticsHub.BigNumber(0, 0), new DiagnosticsHub.BigNumber(0, 0));
                this._container = document.createElement("div");
                StackedBarGraph.validateConfiguration(this._config);
                this._dataSource = this._config.jsonConfig.Series[0].DataSource;
                if (config.pathToScriptFolder && config.loadCss) {
                    config.loadCss(config.pathToScriptFolder + "/CSS/hubGraphs/StackedBarChart.css");
                    config.loadCss(config.pathToScriptFolder + "/DataCategoryStyles.css");
                }
                // Setup scale
                this._config.scale = this._config.scale || {};
                this._config.scale.minimum = 0;
                this._config.scale.maximum = 120;
                this._config.scale.axes = [];
                this._config.scale.axes.push({
                    value: 100
                });
                // add series and legend to config
                this._config.legend = this._config.legend || [];
                var seriesCollection = this._config.jsonConfig.Series;
                for (var i = 0; i < seriesCollection.length; i++) {
                    var series = seriesCollection[i];
                    this._config.legend.push({
                        color: series.Color,
                        legendText: this._graphResources.getString(series.Legend),
                        legendTooltip: (series.LegendTooltip ? this._graphResources.getString(series.LegendTooltip) : null)
                    });
                }
            }
            Object.defineProperty(StackedBarGraph.prototype, "container", {
                get: function () {
                    return this._container;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StackedBarGraph.prototype, "scaleChangedEvent", {
                get: function () {
                    return this._scaleChangedEvent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StackedBarGraph.prototype, "containerOffsetWidth", {
                get: function () {
                    if (this._containerOffsetWidth === undefined) {
                        this._containerOffsetWidth = this._container.offsetWidth;
                    }
                    return this._containerOffsetWidth;
                },
                enumerable: true,
                configurable: true
            });
            StackedBarGraph.prototype.onDataUpdate = function (timestampNs) {
                // Not implemented
            };
            StackedBarGraph.prototype.addSeriesData = function (counterId, points, fullRender, dropOldData) {
                // Not implemented
            };
            StackedBarGraph.prototype.getDataPresenter = function () {
                var presenterOptions = {
                    ariaDescription: this._graphResources.getString("UiThreadActivityAriaLabel"),
                    height: this._config.height,
                    width: this.containerOffsetWidth,
                    minX: parseInt(this._timeRange.begin.value),
                    maxX: parseInt(this._timeRange.end.value),
                    minY: 0,
                    minYHeight: 100,
                    barWidth: this._config.jsonConfig.BarWidth,
                    barGap: this._config.jsonConfig.BarGap,
                    showStackGap: this._config.jsonConfig.ShowStackGap,
                    tooltipCallback: this.createTooltip.bind(this),
                    ariaLabelCallback: this.createAriaLabel.bind(this)
                };
                var presenter = new Graphs.StackedBarChartPresenter(presenterOptions);
                //
                // Add series information to the presenter
                //
                var dataSeriesInfo = [];
                var stackedDataSeries = this._config.jsonConfig.Series;
                for (var i = 0; i < stackedDataSeries.length; i++) {
                    var seriesItem = stackedDataSeries[i];
                    dataSeriesInfo.push({
                        cssClass: seriesItem.CssClass,
                        name: seriesItem.Category,
                        sortOrder: i + 1
                    });
                }
                presenter.addSeries(dataSeriesInfo);
                return presenter;
            };
            StackedBarGraph.prototype.getGranularity = function () {
                var bucketWidth = this._config.jsonConfig.BarGap + this._config.jsonConfig.BarWidth;
                var graphDuration = parseInt(this._timeRange.elapsed.value);
                if (graphDuration <= 0 || this.containerOffsetWidth <= 0) {
                    return 0;
                }
                return Math.floor(bucketWidth / this.containerOffsetWidth * graphDuration);
            };
            StackedBarGraph.prototype.removeInvalidPoints = function (base) {
                // Not implemented
            };
            StackedBarGraph.prototype.render = function (fullRender) {
                if (this._config.jsonConfig.GraphBehaviour == 2 /* PostMortem */) {
                    this.setData(this._timeRange);
                }
            };
            StackedBarGraph.prototype.resize = function (evt) {
                this._containerOffsetWidth = undefined;
                this.render();
            };
            StackedBarGraph.prototype.onViewportChanged = function (viewportArgs) {
                if (this._timeRange.equals(viewportArgs.currentTimespan)) {
                    // Only selection changed, ignore this event
                    return;
                }
                this._timeRange = viewportArgs.currentTimespan;
                this.render();
            };
            StackedBarGraph.validateConfiguration = function (config) {
                if (!config) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1070"));
                }
                var jsonObject = config.jsonConfig;
                if (!jsonObject) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1071"));
                }
                if (!jsonObject.Series || jsonObject.Series.length === 0) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1072"));
                }
                jsonObject.BarWidth = jsonObject.BarWidth || 4;
                jsonObject.BarGap = jsonObject.BarGap || 0;
                jsonObject.ShowStackGap = jsonObject.ShowStackGap || false;
                if ((!config.height || config.height < 0) || jsonObject.BarWidth < 0) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1048"));
                }
            };
            StackedBarGraph.prototype.createTooltip = function (cpuUsage) {
                var tooltip = this._graphResources.getString(cpuUsage.series) + ": " + (Math.round(cpuUsage.height * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) + "%";
                return tooltip;
            };
            StackedBarGraph.prototype.createAriaLabel = function (cpuUsage) {
                var percentageUtilization = (Math.round(cpuUsage.height * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
                var formattedTime = DiagnosticsHub.RulerUtilities.formatTime(DiagnosticsHub.BigNumber.convertFromNumber(cpuUsage.x), 1 /* fullName */);
                return this._graphResources.getString("UiThreadActivityBarAriaLabel", this._graphResources.getString(cpuUsage.series), percentageUtilization, formattedTime);
            };
            StackedBarGraph.jsonTimeToNanoseconds = function (bigNumber) {
                var l = bigNumber.l;
                var h = bigNumber.h;
                if (l < 0) {
                    l = l >>> 0;
                }
                if (h < 0) {
                    h = h >>> 0;
                }
                var nsec = h * 0x100000000 + l;
                return nsec;
            };
            StackedBarGraph.prototype.setData = function (timeRange) {
                var _this = this;
                if (this._settingDataPromise) {
                    this._settingDataPromise.cancel();
                    this._settingDataPromise = null;
                }
                if (!this._dataSource || !this._dataSource.CounterId || !this._dataSource.AnalyzerId) {
                    // No data to set if there is no data source
                    return;
                }
                this._settingDataPromise = this.getDataWarehouse().then(function (dataWarehouse) {
                    var granuality = _this.getGranularity();
                    if (granuality > 0) {
                        return Graphs.DataUtilities.getFilteredResult(dataWarehouse, _this._dataSource.AnalyzerId, _this._dataSource.CounterId, timeRange, {
                            granularity: granuality.toString(),
                            task: "1" // AnalysisTaskType::GetUIThreadActivityData in XamlProfiler\DataModel\XamlAnalyzer.h
                        });
                    }
                    else {
                        return Microsoft.Plugin.Promise.wrap([]);
                    }
                }).then(function (cpuUsageResult) {
                    if (_this._chart) {
                        _this._container.removeChild(_this._chart.rootElement);
                        _this._chart = null;
                    }
                    if (cpuUsageResult) {
                        var chartItems = [];
                        for (var i = 0; i < cpuUsageResult.length; i++) {
                            var cpuUsagePoint = cpuUsageResult[i];
                            var parsingTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.ParsingTime);
                            var layoutTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.LayoutTime);
                            var appCodeTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.AppCodeTime);
                            var xamlOtherTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.XamlOther);
                            var unknownTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.Unknown);
                            var renderTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.RenderTime);
                            var ioTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.IOTime);
                            var startTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.StartTime);
                            var endTime = StackedBarGraph.jsonTimeToNanoseconds(cpuUsagePoint.EndTime);
                            var totalTime = endTime - startTime;
                            if (parsingTime > 0) {
                                chartItems.push({
                                    series: Category.parsingCategory,
                                    x: startTime,
                                    height: parsingTime * 100.0 / totalTime
                                });
                            }
                            if (layoutTime > 0) {
                                chartItems.push({
                                    series: Category.layoutCategory,
                                    x: startTime,
                                    height: layoutTime * 100.0 / totalTime
                                });
                            }
                            if (appCodeTime > 0) {
                                chartItems.push({
                                    series: Category.appCodeCategory,
                                    x: startTime,
                                    height: appCodeTime * 100.0 / totalTime
                                });
                            }
                            if (xamlOtherTime > 0) {
                                chartItems.push({
                                    series: Category.xamlOtherCategory,
                                    x: startTime,
                                    height: xamlOtherTime * 100.0 / totalTime
                                });
                            }
                            if (renderTime > 0) {
                                chartItems.push({
                                    series: Category.renderCategory,
                                    x: startTime,
                                    height: renderTime * 100.0 / totalTime
                                });
                            }
                            if (ioTime > 0) {
                                chartItems.push({
                                    series: Category.ioCategory,
                                    x: startTime,
                                    height: ioTime * 100.0 / totalTime
                                });
                            }
                        }
                        var dataPresenter = _this.getDataPresenter();
                        dataPresenter.addData(chartItems);
                        _this._chart = new Graphs.StackedBarChartView();
                        _this._chart.presenter = dataPresenter;
                        // Update the y-axis scale maximum
                        _this._scaleChangedEvent.invokeEvent({
                            minimum: 0,
                            maximum: dataPresenter.maximumYValue
                        });
                        _this._container.appendChild(_this._chart.rootElement);
                    }
                }).then(function () {
                    _this._settingDataPromise = null;
                });
            };
            StackedBarGraph.prototype.getDataWarehouse = function () {
                var _this = this;
                if (this._dataWarehouse) {
                    return Microsoft.Plugin.Promise.as(this._dataWarehouse);
                }
                else {
                    return DiagnosticsHub.DataWarehouse.loadDataWarehouse().then(function (dataWarehouse) {
                        _this._dataWarehouse = dataWarehouse;
                        return _this._dataWarehouse;
                    });
                }
            };
            return StackedBarGraph;
        })();
        Graphs.StackedBarGraph = StackedBarGraph;
    })(Graphs = VisualProfiler.Graphs || (VisualProfiler.Graphs = {}));
})(VisualProfiler || (VisualProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/visualprofiler.csproj_1601524658/objr/x86/built/js/hubGraphs/StackedBarGraph.js.map


// SIG // Begin signature block
// SIG // MIIaogYJKoZIhvcNAQcCoIIakzCCGo8CAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFEaG+QEN9OkY
// SIG // ENv2kGmUezPjRIPYoIIVgzCCBMMwggOroAMCAQICEzMA
// SIG // AACZqsWBn4yifYoAAAAAAJkwDQYJKoZIhvcNAQEFBQAw
// SIG // dzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBMB4XDTE2MDMzMDE5
// SIG // MjEyOFoXDTE3MDYzMDE5MjEyOFowgbMxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xDTALBgNVBAsTBE1PUFIxJzAlBgNVBAsT
// SIG // Hm5DaXBoZXIgRFNFIEVTTjo5OEZELUM2MUUtRTY0MTEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBAIqQrYfOhUbtcq7bD7tjS0le57+gP6FQHLxqxu1U
// SIG // MEZ/sBpV6wX+J8osmxxp/TMbgfbuBDLx/LO+XZLe91k+
// SIG // 5RiE9cgiIfVQvXbNYln5sR2bWLrVDjPdvmttrpEFtNE/
// SIG // FNsqMGehmr+EO/vTNVKz54mVw8DN1qptMJJJZsH4BBJv
// SIG // ssgmzJDURUghvTyM2apugrgb3Y4vZzL37k5asWlm2hYF
// SIG // UWoJYc/v3iyU9XuOQLBp4vV5Iyi+lSa2m8UQGMxDMOKk
// SIG // lrIaB7BIdjw9Yrioy72LKVr+BAQkDzyDqRmDsaTFkatL
// SIG // f4KgvqCZ14B8Og+X2dgnKpruP7t3Df2gLfvbsOMCAwEA
// SIG // AaOCAQkwggEFMB0GA1UdDgQWBBR21hL4ugVW8LHHssL5
// SIG // YyAraLcEETAfBgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7
// SIG // syuwwzWzDzBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9NaWNyb3NvZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsG
// SIG // AQUFBwEBBEwwSjBIBggrBgEFBQcwAoY8aHR0cDovL3d3
// SIG // dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBBQUAA4IBAQAWzWDDLdyY
// SIG // 3zAJ7Y0IR6zs+GlJPe9H/4ScNYy32LKRaavhpFt4zJFL
// SIG // txnr/z40Za/6w7HhSDFxKtrRH/8qe9npenIJRQdf3G3w
// SIG // 3HYpi0A+lj2UMgH66RHHAi2qLn+5s/QxkNG/QvoWvd12
// SIG // aJ08D6lpqeXXPmIk6XgCnNb2qNPq7v37mUTnsfGXffa+
// SIG // nqGcdLVCMWgObE1jFumPtOb2TdzpPP/ocKjJcIDUfzZ1
// SIG // QDoNorJPcKMfUtaMmPWkc2tYyOOn25gvPM/eOBAny6/Y
// SIG // I2t1CkTJAdz9uOpbbIh9X89JBQKv5dnrq5n6BJ4YPJ9z
// SIG // h2OWv2c6NPlvbNcpX1HnKGeFMIIE7TCCA9WgAwIBAgIT
// SIG // MwAAAUCWqe5wVv7MBwABAAABQDANBgkqhkiG9w0BAQUF
// SIG // ADB5MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSMwIQYDVQQDExpN
// SIG // aWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQTAeFw0xNjA4
// SIG // MTgyMDE3MTdaFw0xNzExMDIyMDE3MTdaMIGDMQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMQ0wCwYDVQQLEwRNT1BSMR4wHAYD
// SIG // VQQDExVNaWNyb3NvZnQgQ29ycG9yYXRpb24wggEiMA0G
// SIG // CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDbS4vpA2pf
// SIG // yBtdCgU55NUOktDE4YvopA0FGVjAPNcp3Ym3aG5Ln368
// SIG // mr1Uhjmp8Tg1FuYdrPuua9wJMO+4Ht9s+EqaVZdIyCOJ
// SIG // s1knNL2VMUecD85ANTI3/unzT6QapLN5vICbPySYxNFv
// SIG // 1X/nQ43k3PLS5q5m7QQ6IZSmV9wD2yzGG/8rOahdv1X+
// SIG // 3UnfVAWUqzPfpH0xpk29Vs8WMWg/hGscbfPu1TCK7mUb
// SIG // nrcIHCl+k73yfUJ2OCLUe3z0uLlxnsOU9IKGNYKmdL0C
// SIG // M/pUhoWjJb6qiV7iOV8mQZga3rnmRoV4u1EyAkfs5Pkf
// SIG // vQRRdeYSm3brhZcUIgqhE/dhAgMBAAGjggFhMIIBXTAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDAzAdBgNVHQ4EFgQUnOXo
// SIG // bYJXrjck3upeqcRfkB3O2XswUgYDVR0RBEswSaRHMEUx
// SIG // DTALBgNVBAsTBE1PUFIxNDAyBgNVBAUTKzIyOTgwMytm
// SIG // Nzg1YjFjMC01ZDlmLTQzMTYtOGQ2YS03NGFlNjQyZGRl
// SIG // MWMwHwYDVR0jBBgwFoAUyxHoytK0FlgByTcuMxYWuUya
// SIG // Ch8wVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWlj
// SIG // Q29kU2lnUENBXzA4LTMxLTIwMTAuY3JsMFoGCCsGAQUF
// SIG // BwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNDb2RTaWdQ
// SIG // Q0FfMDgtMzEtMjAxMC5jcnQwDQYJKoZIhvcNAQEFBQAD
// SIG // ggEBAGvkVuPXEx0gQPlt6d5O210exmwmo/flCYAM/1fh
// SIG // tNTZ+VxI4QZ/wqRUuJZ69Y3JgxMMcb/4/LsuzBVz8wBr
// SIG // TiWq9MQKcpRSn3dNKZMoCDEW2d9udKvE6E4VsZkFRE4a
// SIG // SUksrHnuv4VPhG5H777Y0otJaQ4pg/WlvaMbIa2ipT6Q
// SIG // IJz1nxI9ell1ZO/ao4WEMhICAmpkdwGmOZiz7qIoSWys
// SIG // JDIoPqiLZiz7AtiDLyOSkfdXZf+k1elRCJT21v3A1cAg
// SIG // Rf1DSU957mQZf2BO4sTKU04f+1qRDVvNJIN8c+jJQncS
// SIG // XzEmybDOU4phVPfCjXKZ8cW2HX6qkIQEOpd5rWAwggW8
// SIG // MIIDpKADAgECAgphMyYaAAAAAAAxMA0GCSqGSIb3DQEB
// SIG // BQUAMF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAXBgoJ
// SIG // kiaJk/IsZAEZFgltaWNyb3NvZnQxLTArBgNVBAMTJE1p
// SIG // Y3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0
// SIG // eTAeFw0xMDA4MzEyMjE5MzJaFw0yMDA4MzEyMjI5MzJa
// SIG // MHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNVBAMTGk1p
// SIG // Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsnJZXBkwZL8d
// SIG // mmAgIEKZdlNsPhvWb8zL8epr/pcWEODfOnSDGrcvoDLs
// SIG // /97CQk4j1XIA2zVXConKriBJ9PBorE1LjaW9eUtxm0cH
// SIG // 2v0l3511iM+qc0R/14Hb873yNqTJXEXcr6094Cholxqn
// SIG // pXJzVvEXlOT9NZRyoNZ2Xx53RYOFOBbQc1sFumdSjaWy
// SIG // aS/aGQv+knQp4nYvVN0UMFn40o1i/cvJX0YxULknE+RA
// SIG // MM9yKRAoIsc3Tj2gMj2QzaE4BoVcTlaCKCoFMrdL109j
// SIG // 59ItYvFFPeesCAD2RqGe0VuMJlPoeqpK8kbPNzw4nrR3
// SIG // XKUXno3LEY9WPMGsCV8D0wIDAQABo4IBXjCCAVowDwYD
// SIG // VR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUyxHoytK0FlgB
// SIG // yTcuMxYWuUyaCh8wCwYDVR0PBAQDAgGGMBIGCSsGAQQB
// SIG // gjcVAQQFAgMBAAEwIwYJKwYBBAGCNxUCBBYEFP3RMU7T
// SIG // JoqV4ZhgO6gxb6Y8vNgtMBkGCSsGAQQBgjcUAgQMHgoA
// SIG // UwB1AGIAQwBBMB8GA1UdIwQYMBaAFA6sgmBAVieX5SUT
// SIG // /CrhClOVWeSkMFAGA1UdHwRJMEcwRaBDoEGGP2h0dHA6
// SIG // Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1
// SIG // Y3RzL21pY3Jvc29mdHJvb3RjZXJ0LmNybDBUBggrBgEF
// SIG // BQcBAQRIMEYwRAYIKwYBBQUHMAKGOGh0dHA6Ly93d3cu
// SIG // bWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljcm9zb2Z0
// SIG // Um9vdENlcnQuY3J0MA0GCSqGSIb3DQEBBQUAA4ICAQBZ
// SIG // OT5/Jkav629AsTK1ausOL26oSffrX3XtTDst10OtC/7L
// SIG // 6S0xoyPMfFCYgCFdrD0vTLqiqFac43C7uLT4ebVJcvc+
// SIG // 6kF/yuEMF2nLpZwgLfoLUMRWzS3jStK8cOeoDaIDpVbg
// SIG // uIpLV/KVQpzx8+/u44YfNDy4VprwUyOFKqSCHJPilAcd
// SIG // 8uJO+IyhyugTpZFOyBvSj3KVKnFtmxr4HPBT1mfMIv9c
// SIG // Hc2ijL0nsnljVkSiUc356aNYVt2bAkVEL1/02q7UgjJu
// SIG // /KSVE+Traeepoiy+yCsQDmWOmdv1ovoSJgllOJTxeh9K
// SIG // u9HhVujQeJYYXMk1Fl/dkx1Jji2+rTREHO4QFRoAXd01
// SIG // WyHOmMcJ7oUOjE9tDhNOPXwpSJxy0fNsysHscKNXkld9
// SIG // lI2gG0gDWvfPo2cKdKU27S0vF8jmcjcS9G+xPGeC+VKy
// SIG // jTMWZR4Oit0Q3mT0b85G1NMX6XnEBLTT+yzfH4qerAr7
// SIG // EydAreT54al/RrsHYEdlYEBOsELsTu2zdnnYCjQJbRyA
// SIG // MR/iDlTd5aH75UcQrWSY/1AWLny/BSF64pVBJ2nDk4+V
// SIG // yY3YmyGuDVyc8KKuhmiDDGotu3ZrAB2WrfIWe/YWgyS5
// SIG // iM9qqEcxL5rc43E91wB+YkfRzojJuBj6DnKNwaM9rwJA
// SIG // av9pm5biEKgQtDdQCNbDPTCCBgcwggPvoAMCAQICCmEW
// SIG // aDQAAAAAABwwDQYJKoZIhvcNAQEFBQAwXzETMBEGCgmS
// SIG // JomT8ixkARkWA2NvbTEZMBcGCgmSJomT8ixkARkWCW1p
// SIG // Y3Jvc29mdDEtMCsGA1UEAxMkTWljcm9zb2Z0IFJvb3Qg
// SIG // Q2VydGlmaWNhdGUgQXV0aG9yaXR5MB4XDTA3MDQwMzEy
// SIG // NTMwOVoXDTIxMDQwMzEzMDMwOVowdzELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
// SIG // MIIBCgKCAQEAn6Fssd/bSJIqfGsuGeG94uPFmVEjUK3O
// SIG // 3RhOJA/u0afRTK10MCAR6wfVVJUVSZQbQpKumFwwJtoA
// SIG // a+h7veyJBw/3DgSY8InMH8szJIed8vRnHCz8e+eIHern
// SIG // TqOhwSNTyo36Rc8J0F6v0LBCBKL5pmyTZ9co3EZTsIbQ
// SIG // 5ShGLieshk9VUgzkAyz7apCQMG6H81kwnfp+1pez6CGX
// SIG // fvjSE/MIt1NtUrRFkJ9IAEpHZhEnKWaol+TTBoFKovmE
// SIG // pxFHFAmCn4TtVXj+AZodUAiFABAwRu233iNGu8QtVJ+v
// SIG // HnhBMXfMm987g5OhYQK1HQ2x/PebsgHOIktU//kFw8Ig
// SIG // CwIDAQABo4IBqzCCAacwDwYDVR0TAQH/BAUwAwEB/zAd
// SIG // BgNVHQ4EFgQUIzT42VJGcArtQPt2+7MrsMM1sw8wCwYD
// SIG // VR0PBAQDAgGGMBAGCSsGAQQBgjcVAQQDAgEAMIGYBgNV
// SIG // HSMEgZAwgY2AFA6sgmBAVieX5SUT/CrhClOVWeSkoWOk
// SIG // YTBfMRMwEQYKCZImiZPyLGQBGRYDY29tMRkwFwYKCZIm
// SIG // iZPyLGQBGRYJbWljcm9zb2Z0MS0wKwYDVQQDEyRNaWNy
// SIG // b3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHmC
// SIG // EHmtFqFKoKWtTHNY9AcTLmUwUAYDVR0fBEkwRzBFoEOg
// SIG // QYY/aHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9j
// SIG // cmwvcHJvZHVjdHMvbWljcm9zb2Z0cm9vdGNlcnQuY3Js
// SIG // MFQGCCsGAQUFBwEBBEgwRjBEBggrBgEFBQcwAoY4aHR0
// SIG // cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9N
// SIG // aWNyb3NvZnRSb290Q2VydC5jcnQwEwYDVR0lBAwwCgYI
// SIG // KwYBBQUHAwgwDQYJKoZIhvcNAQEFBQADggIBABCXisNc
// SIG // A0Q23em0rXfbznlRTQGxLnRxW20ME6vOvnuPuC7UEqKM
// SIG // bWK4VwLLTiATUJndekDiV7uvWJoc4R0Bhqy7ePKL0Ow7
// SIG // Ae7ivo8KBciNSOLwUxXdT6uS5OeNatWAweaU8gYvhQPp
// SIG // kSokInD79vzkeJkuDfcH4nC8GE6djmsKcpW4oTmcZy3F
// SIG // UQ7qYlw/FpiLID/iBxoy+cwxSnYxPStyC8jqcD3/hQoT
// SIG // 38IKYY7w17gX606Lf8U1K16jv+u8fQtCe9RTciHuMMq7
// SIG // eGVcWwEXChQO0toUmPU8uWZYsy0v5/mFhsxRVuidcJRs
// SIG // rDlM1PZ5v6oYemIp76KbKTQGdxpiyT0ebR+C8AvHLLvP
// SIG // Q7Pl+ex9teOkqHQ1uE7FcSMSJnYLPFKMcVpGQxS8s7Ow
// SIG // TWfIn0L/gHkhgJ4VMGboQhJeGsieIiHQQ+kr6bv0SMws
// SIG // 1NgygEwmKkgkX1rqVu+m3pmdyjpvvYEndAYR7nYhv5uC
// SIG // wSdUtrFqPYmhdmG0bqETpr+qR/ASb/2KMmyy/t9RyIwj
// SIG // yWa9nR2HEmQCPS2vWY+45CHltbDKY7R4VAXUQS5QrJSw
// SIG // pXirs6CWdRrZkocTdSIvMqgIbqBbjCW/oO+EyiHW6x5P
// SIG // yZruSeD3AWVviQt9yGnI5m7qp5fOMSn/DsVbXNhNG6HY
// SIG // +i+ePy5VFmvJE6P9MYIEizCCBIcCAQEwgZAweTELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0
// SIG // IENvZGUgU2lnbmluZyBQQ0ECEzMAAAFAlqnucFb+zAcA
// SIG // AQAAAUAwCQYFKw4DAhoFAKCBpDAZBgkqhkiG9w0BCQMx
// SIG // DAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYK
// SIG // KwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQUItLMyEo0
// SIG // 9p/0Iun2P5RA+rMNK9AwRAYKKwYBBAGCNwIBDDE2MDSg
// SIG // GoAYAEgAdQBiAEcAcgBhAHAAaABzAC4AagBzoRaAFGh0
// SIG // dHA6Ly9taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUA
// SIG // BIIBAM3Ty0hxxI8ZbnQWWxL0YtxqhWG+pVH/y1uEXmoN
// SIG // B5PIwzQx5NhzQkObt4/CZ/O/KOD8Y3bGlu+q6PD8SAZX
// SIG // Zif9LbGkbul0WW0PjUtMmBn4l9fZhCTM2//W7YBbkMFa
// SIG // 782hx9aevgiNLNonCVWMnNgiphuxX3EGCSQet90gI11K
// SIG // v8V4erR0EiDNTMUY6KyC+KC/YFuT6ojuSouvyk53mCd/
// SIG // xNkj6+mHBmKQYkIvpW5ApOY/xsuea/m3+92dFM4nMEnh
// SIG // vda2kK8oEvAoGqx0DrtE1+tgSdd5GD77amcctU5u2Rv+
// SIG // y+QS6pZj2EizYxsU/4c2zb5OCdIb8ArtO1l9XYOhggIo
// SIG // MIICJAYJKoZIhvcNAQkGMYICFTCCAhECAQEwgY4wdzEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgUENBAhMzAAAAmarFgZ+Mon2K
// SIG // AAAAAACZMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx
// SIG // CwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNjA5
// SIG // MDcwNDQ3NTBaMCMGCSqGSIb3DQEJBDEWBBQ5terE1Mll
// SIG // vi1gSGWcg3ydXhCPyDANBgkqhkiG9w0BAQUFAASCAQAm
// SIG // ulpelcTelp5YxBuR4zHI9ShNFBdGvCgH95O9K5Zt3g+F
// SIG // AZdbxPnkJ1b5BjV2rw55ojA1K0kfNMX7Pt/5LieHZhqx
// SIG // qd7aYqGsRWFVIqsWfHiIQkWbSJTrEhRI1t47D+ijorNm
// SIG // BavlPKJOJAkJhBhLo9SDfTv1J03ZU0eS95KMw3SSgbG0
// SIG // qymAbaMnEGBPMAkdTpZ8PEtMxYqt0pKToThzxASVrYh2
// SIG // IdkB0a9gGucmvKNJT/oK/72ji/8SmPL8W/ZPjoUwkyo8
// SIG // yEjPsCNOKCttZnQYZtTphyf8fWorDQKgKqLgHVeD0GNi
// SIG // SFcc7iBJ0ONl8kYHaIKX/Q93/xRrzwn7
// SIG // End signature block
