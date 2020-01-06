var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var CommandIds = (function () {
                function CommandIds() {
                }
                CommandIds.ZoomIn = "ZoomIn";
                CommandIds.ZoomToSelection = "ZoomToSelection";
                CommandIds.ZoomOut = "ZoomOut";
                CommandIds.ResetZoom = "ResetZoom";
                CommandIds.ResetView = "ResetView";
                CommandIds.ClearSelection = "ClearSelection";
                return CommandIds;
            })();
            DiagnosticsHub.CommandIds = CommandIds;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var Constants = (function () {
                function Constants() {
                }
                Object.defineProperty(Constants, "GridLineZIndex", {
                    get: function () {
                        return 2;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Constants, "MultiLineGraphZIndex", {
                    get: function () {
                        return 30;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Constants, "SelectionOverlayZIndex", {
                    get: function () {
                        return 130;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Constants, "DropDownMenuZIndex", {
                    get: function () {
                        return 1000;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Constants, "DefaultSwimlaneGraphHeight", {
                    get: function () {
                        return 70;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Constants, "MinimumSwimlaneGraphHeight", {
                    get: function () {
                        return 50;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Constants, "MaximumSwimlaneGraphHeight", {
                    get: function () {
                        return 200;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Constants, "TimeoutImmediate", {
                    get: function () {
                        return 0;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Constants, "WindowResizeThrottle", {
                    get: function () {
                        return 200;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Constants, "TooltipTimeoutMs", {
                    get: function () {
                        return 750;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Constants;
            })();
            DiagnosticsHub.Constants = Constants;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (Common) {
                "use strict";

                var QpcTimeProperties = (function () {
                    function QpcTimeProperties(collectionStartTime, frequency) {
                        this._collectionStartTime = collectionStartTime;
                        this._frequency = frequency;

                        this._hundredPicosecondsPerQpcRatio = (QpcTimeProperties.NanosecondsInASecond / this._frequency) * 10;
                    }
                    QpcTimeProperties.prototype.getCollectionStartTime = function () {
                        return this._collectionStartTime;
                    };

                    QpcTimeProperties.prototype.getFrequency = function () {
                        return this._frequency;
                    };

                    QpcTimeProperties.prototype.convertQpcTimestampToNanoseconds = function (qpcValue) {
                        var qpcTicks = DiagnosticsHub.BigNumber.subtract(qpcValue, this._collectionStartTime);

                        var hundredsOfPicoseconds = DiagnosticsHub.BigNumber.multiplyNumber(qpcTicks, this._hundredPicosecondsPerQpcRatio);
                        return DiagnosticsHub.BigNumber.divideNumber(hundredsOfPicoseconds, 10);
                    };
                    QpcTimeProperties.NanosecondsInASecond = 1000000000;
                    return QpcTimeProperties;
                })();
                Common.QpcTimeProperties = QpcTimeProperties;
            })(DiagnosticsHub.Common || (DiagnosticsHub.Common = {}));
            var Common = DiagnosticsHub.Common;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var ViewportController = (function () {
                function ViewportController(initialViewport) {
                    var _this = this;
                    this._viewportStateChangedEvent = new DiagnosticsHub.AggregatedEvent();
                    this._isSelecting = false;
                    this._commands = [];
                    this._currentSelection = null;
                    this._viewportTimeRange = initialViewport;
                    this._viewableTimeRange = initialViewport;

                    this._scrollbar = new DiagnosticsHub.Scrollbar();
                    this._scrollbar.onScroll = this.onScroll.bind(this);

                    this._onSelectionChangedBoundFunction = this.onSelectionChanged.bind(this);

                    this._telemetry = new DiagnosticsHub.Telemetry.ViewportController();

                    this._viewEventManager = Microsoft.VisualStudio.DiagnosticsHub.getViewEventManager();
                    this._viewEventManager.selectionChanged.addEventListener(this._onSelectionChangedBoundFunction);

                    this._commands.push({
                        id: DiagnosticsHub.CommandIds.ZoomIn,
                        callback: this.zoomToSelection.bind(this),
                        label: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomInButton"),
                        ariaLabel: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomInAriaLabel"),
                        tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomInButton"),
                        type: 1 /* command */,
                        iconEnabled: "vs-image-toolbar-chartzoom-in",
                        iconDisabled: "vs-image-toolbar-chartzoom-in-disabled",
                        accessKey: null,
                        hidden: function () {
                            return false;
                        },
                        disabled: function () {
                            return !_this.canZoomTo();
                        },
                        checked: function () {
                            return false;
                        },
                        cssClass: null,
                        submenu: null,
                        displayOnToolbar: true,
                        displayOnContextMenu: true
                    });

                    this._commands.push({
                        id: DiagnosticsHub.CommandIds.ResetZoom,
                        callback: this.resetZoom.bind(this),
                        label: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarResetZoomButton"),
                        ariaLabel: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarResetZoomAriaLabel"),
                        tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarResetZoomButton"),
                        type: 1 /* command */,
                        iconEnabled: "vs-image-toolbar-chartzoom-reset",
                        iconDisabled: "vs-image-toolbar-chartzoom-reset-disabled",
                        accessKey: null,
                        hidden: function () {
                            return false;
                        },
                        disabled: function () {
                            return !_this.canResetZoom();
                        },
                        checked: function () {
                            return false;
                        },
                        cssClass: null,
                        submenu: null,
                        displayOnToolbar: true,
                        displayOnContextMenu: true
                    });

                    this._commands.push({
                        id: DiagnosticsHub.CommandIds.ClearSelection,
                        callback: this.clearSelection.bind(this),
                        label: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarClearSelectionButton"),
                        ariaLabel: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarClearSelectionAriaLabel"),
                        tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarClearSelectionButton"),
                        type: 1 /* command */,
                        iconEnabled: "vs-image-toolbar-chartselection-clear",
                        iconDisabled: "vs-image-toolbar-chartselection-clear-disabled",
                        accessKey: null,
                        hidden: function () {
                            return false;
                        },
                        disabled: function () {
                            return !_this.canClearSelection();
                        },
                        checked: function () {
                            return false;
                        },
                        cssClass: null,
                        submenu: null,
                        displayOnToolbar: true,
                        displayOnContextMenu: true
                    });

                    this._viewportStateChangedEvent.addEventListener(function () {
                        _this._commands.forEach(function (command) {
                            if (command.onDisabledChanged) {
                                command.onDisabledChanged();
                            }
                        });
                    });
                }
                Object.defineProperty(ViewportController.prototype, "container", {
                    get: function () {
                        return this._scrollbar.container;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewportController.prototype, "viewportStateChanged", {
                    get: function () {
                        return this._viewportStateChangedEvent;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewportController.prototype, "visible", {
                    get: function () {
                        return this._viewportTimeRange;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewportController.prototype, "viewable", {
                    get: function () {
                        return this._viewableTimeRange;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewportController.prototype, "selection", {
                    get: function () {
                        return this._currentSelection;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewportController.prototype, "scrollbar", {
                    get: function () {
                        return this._scrollbar;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewportController.prototype, "commands", {
                    get: function () {
                        return this._commands;
                    },
                    enumerable: true,
                    configurable: true
                });

                ViewportController.prototype.dispose = function () {
                    this._scrollbar.onScroll = null;
                    this._scrollbar.dispose();

                    this._viewEventManager.selectionChanged.removeEventListener(this._onSelectionChangedBoundFunction);

                    this._viewportStateChangedEvent.dispose();
                };

                ViewportController.prototype.resize = function (evt) {
                    this._scrollbar.resize(evt);
                };

                ViewportController.prototype.requestViewportChange = function (viewport) {
                    if (this._isSelecting) {
                        return false;
                    }

                    var canSetViewport = this._viewableTimeRange.contains(viewport.currentTimespan.begin) && this._viewableTimeRange.contains(viewport.currentTimespan.end);

                    var canSetSelection = !viewport.selectionTimespan || (this._viewableTimeRange.contains(viewport.selectionTimespan.begin) && this._viewableTimeRange.contains(viewport.selectionTimespan.end));

                    if (!canSetViewport || !canSetSelection) {
                        DiagnosticsHub.Debug.Assert.isTrue(canSetViewport, "Invalid viewport specified");
                        DiagnosticsHub.Debug.Assert.isTrue(canSetSelection, "Invalid selection specified");
                        return false;
                    }

                    var selectionChanged = !this.isSameSelection(viewport.selectionTimespan);

                    if (!selectionChanged && this._viewportTimeRange.equals(viewport.currentTimespan)) {
                        return false;
                    }

                    this._viewportTimeRange = viewport.currentTimespan;
                    if (selectionChanged) {
                        this._currentSelection = viewport.selectionTimespan;
                        this._viewEventManager.selectionChanged.raiseEvent({
                            position: this._currentSelection,
                            isIntermittent: false
                        });
                    }

                    this.fireViewportStateChanged(false);
                    return true;
                };

                ViewportController.prototype.canZoomTo = function () {
                    return typeof this._currentSelection !== "undefined" && this._currentSelection !== null && !this._viewportTimeRange.equals(this._currentSelection) && !this._viewableTimeRange.equals(this._currentSelection) && !ViewportController.MinimumZoomTimeInMs.greater(this._currentSelection.elapsed);
                };

                ViewportController.prototype.zoomToSelection = function () {
                    if (!this.canZoomTo()) {
                        return;
                    }

                    this._telemetry.zoomIn();
                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25225 /* perfDiagnosticsHub_ZoomSelectionBegin */);

                    this._viewportTimeRange = this._currentSelection;
                    this._scrollbar.update(this._viewableTimeRange, this._viewportTimeRange);
                    this.fireViewportStateChanged();

                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25226 /* perfDiagnosticsHub_ZoomSelectionEnd */);
                };

                ViewportController.prototype.canResetZoom = function () {
                    return !this._viewableTimeRange.equals(this._viewportTimeRange);
                };

                ViewportController.prototype.resetZoom = function () {
                    if (!this.canResetZoom()) {
                        return;
                    }

                    this._telemetry.resetZoom();
                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25237 /* perfDiagnosticsHub_ResetZoomBegin */);

                    this._viewportTimeRange = this._viewableTimeRange;
                    this._scrollbar.update(this._viewableTimeRange, this._viewportTimeRange);
                    this.fireViewportStateChanged();

                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25238 /* perfDiagnosticsHub_ResetZoomEnd */);
                };

                ViewportController.prototype.canClearSelection = function () {
                    return typeof this._currentSelection !== "undefined" && this._currentSelection !== null && !this._currentSelection.equals(this._viewableTimeRange);
                };

                ViewportController.prototype.clearSelection = function () {
                    if (!this.canClearSelection()) {
                        return;
                    }

                    this._telemetry.clearSelection();

                    this._viewEventManager.selectionChanged.raiseEvent({
                        position: this._viewableTimeRange,
                        isIntermittent: false
                    });
                };

                ViewportController.prototype.onScroll = function (scrollArgs) {
                    if (!scrollArgs.totalLength) {
                        return;
                    }

                    var begin = DiagnosticsHub.BigNumber.addNumber(this._viewableTimeRange.begin, parseInt(this._viewableTimeRange.elapsed.value) * scrollArgs.position / scrollArgs.totalLength);

                    var end = DiagnosticsHub.BigNumber.add(begin, this._viewportTimeRange.elapsed);
                    this._viewportTimeRange = new DiagnosticsHub.JsonTimespan(begin, end);
                    this.fireViewportStateChanged();
                };

                ViewportController.prototype.onSelectionChanged = function (event) {
                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25233 /* perfDiagnosticsHub_OnSelectionChangedBegin */);

                    this._isSelecting = event.isIntermittent;

                    if (event.position !== null && typeof event.position !== "undefined" && event.position.end.greater(this._viewableTimeRange.end)) {
                        this._viewEventManager.selectionChanged.raiseEvent({
                            position: new DiagnosticsHub.JsonTimespan(event.position.begin, this._viewableTimeRange.end),
                            isIntermittent: event.isIntermittent
                        });
                    } else if (!this.isSameSelection(event.position)) {
                        this._currentSelection = event.position;
                        this.fireViewportStateChanged(this._isSelecting);
                    }

                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25234 /* perfDiagnosticsHub_OnSelectionChangedEnd */);
                };

                ViewportController.prototype.fireViewportStateChanged = function (isIntermittent) {
                    if (typeof isIntermittent === "undefined") { isIntermittent = false; }
                    this._viewportStateChangedEvent.invokeEvent({
                        currentTimespan: this._viewportTimeRange,
                        selectionTimespan: this._currentSelection,
                        isIntermittent: isIntermittent
                    });
                };

                ViewportController.prototype.isSameSelection = function (timestamp) {
                    return (!this._currentSelection && !timestamp) || (this._currentSelection && timestamp && this._currentSelection.equals(timestamp));
                };
                ViewportController.MinimumZoomTimeInMs = DiagnosticsHub.BigNumber.convertFromNumber(10000);
                return ViewportController;
            })();
            DiagnosticsHub.ViewportController = ViewportController;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var ContextMenu = (function () {
                function ContextMenu(commands) {
                    if (commands) {
                        commands.forEach(function (command) {
                            command.iconEnabled = null;
                            command.iconDisabled = null;
                        });
                    }

                    this._contextMenu = Microsoft.Plugin.ContextMenu.create(commands, null, null, null, function () {
                    });
                }
                ContextMenu.prototype.onMouseDown = function (event) {
                    if (this._contextMenu && event.which === 3 /* Right */) {
                        var xPos = event.clientX;
                        var yPos = event.clientY;
                        this._contextMenu.show(xPos, yPos);
                        return false;
                    }

                    return true;
                };
                return ContextMenu;
            })();
            DiagnosticsHub.ContextMenu = ContextMenu;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var ControlDecorator = (function () {
                function ControlDecorator(decorated) {
                    this._decoratedControl = decorated;
                }
                Object.defineProperty(ControlDecorator.prototype, "container", {
                    get: function () {
                        return this._decoratedControl.container;
                    },
                    enumerable: true,
                    configurable: true
                });

                ControlDecorator.prototype.onDataUpdate = function (timestampNs) {
                    if (this._decoratedControl.onDataUpdate) {
                        this._decoratedControl.onDataUpdate(timestampNs);
                    }
                };

                ControlDecorator.prototype.resize = function (evt) {
                    if (this._decoratedControl.resize) {
                        this._decoratedControl.resize(evt);
                    }
                };

                ControlDecorator.prototype.onViewportChanged = function (viewportArgs) {
                    if (this._decoratedControl.onViewportChanged) {
                        this._decoratedControl.onViewportChanged(viewportArgs);
                    }
                };

                ControlDecorator.prototype.dispose = function () {
                    if (this._decoratedControl.dispose) {
                        this._decoratedControl.dispose();
                    }
                };
                return ControlDecorator;
            })();
            DiagnosticsHub.ControlDecorator = ControlDecorator;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var InformationBarControl = (function () {
                function InformationBarControl(message, link) {
                    var _this = this;
                    this._container = document.createElement("div");
                    this._container.id = "informationContainer";
                    this._container.classList.add("main-information-container");

                    var icon = document.createElement("div");
                    icon.classList.add("information-icon");
                    icon.appendChild(DiagnosticsHub.Utilities.getSVGPlaceHolder("vs-image-information-icon"));
                    Microsoft.Plugin.Theme.processInjectedSvg(icon);
                    this._container.appendChild(icon);

                    var messageElement = document.createElement("div");
                    messageElement.classList.add("information-message");
                    messageElement.innerHTML = message;
                    this._container.appendChild(messageElement);

                    if (link) {
                        var externalLinkDiv = document.createElement("div");
                        externalLinkDiv.classList.add("information-link");
                        this._container.appendChild(externalLinkDiv);

                        var externalLink = document.createElement("a");
                        externalLink.href = link || "";
                        externalLink.target = "blank";
                        externalLink.text = Microsoft.Plugin.Resources.getString("/DiagnosticsHubResources/InformationLink");
                        externalLink.setAttribute("role", "link");
                        externalLink.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("/DiagnosticsHubResources/InformationLink"));
                        externalLinkDiv.appendChild(externalLink);
                    }

                    var closeDiv = document.createElement("div");
                    closeDiv.classList.add("information-close-div");
                    this._container.appendChild(closeDiv);

                    var close = document.createElement("div");
                    close.classList.add("information-close");
                    close.innerHTML = "r";
                    close.tabIndex = 0;
                    close.setAttribute("role", "button");
                    close.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("/DiagnosticsHubResources/InformationClose"));
                    close.setAttribute("data-plugin-vs-tooltip", JSON.stringify({
                        content: Microsoft.Plugin.Resources.getString("/DiagnosticsHubResources/InformationClose"),
                        delay: 0
                    }));

                    close.onkeypress = function (evt) {
                        if (13 /* Enter */ === evt.keyCode) {
                            _this.collapse();
                        }
                    };

                    close.onclick = this.collapse.bind(this);
                    closeDiv.appendChild(close);
                }
                Object.defineProperty(InformationBarControl.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                InformationBarControl.prototype.collapse = function () {
                    this._container.classList.add("main-information-container-hidden");
                    if (this.onClose) {
                        this.onClose();
                    }
                };
                return InformationBarControl;
            })();
            DiagnosticsHub.InformationBarControl = InformationBarControl;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var LocalizedUnitConverter = (function () {
                function LocalizedUnitConverter(config, resources) {
                    var _this = this;
                    this._localizedUnits = [];
                    var logger = Microsoft.VisualStudio.DiagnosticsHub.getLogger();

                    if (!config) {
                        return;
                    }

                    config.forEach(function (unit) {
                        if (resources && resources[unit.Unit]) {
                            _this._localizedUnits.push({
                                Decimals: unit.Decimals,
                                Divider: unit.Divider,
                                LowerBound: unit.LowerBound,
                                Unit: resources[unit.Unit]
                            });
                        } else {
                            _this._localizedUnits.push({
                                Decimals: unit.Decimals,
                                Divider: unit.Divider,
                                LowerBound: unit.LowerBound,
                                Unit: unit.Unit
                            });

                            logger.error("Missing resource string for: " + unit.Unit);
                        }
                    });

                    config.sort(function (left, right) {
                        if (left.LowerBound < right.LowerBound) {
                            return -1;
                        } else if (left.LowerBound > right.LowerBound) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                }
                LocalizedUnitConverter.prototype.formatNumber = function (value, decimalPlaces) {
                    var scaledNumber = this.scaleValue(value);

                    var decimals = typeof (decimalPlaces) === "number" ? decimalPlaces : scaledNumber.decimals;
                    var formattedNumber = DiagnosticsHub.Utilities.formatNumber(scaledNumber.value, decimals);

                    if (scaledNumber.unit) {
                        return Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/FormattedNumberWithUnits", formattedNumber, scaledNumber.unit);
                    } else {
                        return formattedNumber;
                    }
                };

                LocalizedUnitConverter.prototype.scaleValue = function (value) {
                    var scaledValue = value;
                    var unit;
                    var unitDecimals = 0;

                    for (var unitNumber = 0; unitNumber < this._localizedUnits.length; ++unitNumber) {
                        var units = this._localizedUnits[unitNumber];
                        if (units.LowerBound <= value) {
                            scaledValue = value;
                            unitDecimals = units.Decimals;

                            if (units.Divider) {
                                scaledValue = scaledValue / units.Divider;
                            }

                            var decimals = Math.pow(10, units.Decimals);
                            scaledValue = Math.round(scaledValue * decimals) / (decimals);
                            unit = units.Unit;
                        } else {
                            break;
                        }
                    }

                    return {
                        value: scaledValue,
                        unit: unit,
                        decimals: unitDecimals
                    };
                };
                return LocalizedUnitConverter;
            })();
            DiagnosticsHub.LocalizedUnitConverter = LocalizedUnitConverter;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var RegisterNamespace = (function () {
                function RegisterNamespace() {
                }
                RegisterNamespace.registerClass = function (name) {
                    if (name) {
                        var main = window || this;
                        var arr = name.split(".");
                        var className = null;
                        for (var i = 0; i < arr.length; i++) {
                            className = main[arr[i]];
                            if (className) {
                                main = className;
                            } else {
                                throw new Error("Invalid class name.");
                            }
                        }

                        this.RegisteredClasses[name] = className;
                    } else {
                        throw new Error("Invalid class name.");
                    }
                };

                RegisterNamespace.registerFunction = function (name) {
                    var main = window || this;
                    var arr = name.split(".");
                    var functionName = null;
                    for (var i = 0; i < arr.length; i++) {
                        functionName = main[arr[i]];
                        if (functionName) {
                            main = functionName;
                        } else {
                            throw new Error("Invalid function name.");
                        }
                    }

                    this.RegisteredFunctions[name] = functionName;
                };

                RegisterNamespace.getRegisteredClass = function (name) {
                    return this.RegisteredClasses[name];
                };

                RegisterNamespace.getRegisteredFunction = function (name) {
                    return this.RegisteredFunctions[name];
                };
                RegisterNamespace.RegisteredClasses = {};
                RegisterNamespace.RegisteredFunctions = {};
                return RegisterNamespace;
            })();
            DiagnosticsHub.RegisterNamespace = RegisterNamespace;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var Scrollbar = (function () {
                function Scrollbar() {
                    this._logger = Microsoft.VisualStudio.DiagnosticsHub.getLogger();
                    this._container = document.createElement("div");
                    this._container.classList.add("scrollbar");
                    this._onScrollBoundFunction = this.onScrollEvent.bind(this);
                    this._container.onscroll = this._onScrollBoundFunction;

                    this._scrollbarCalculator = document.createElement("div");
                    this._scrollbarCalculator.classList.add("scrollbar-width-calculator");
                    this._scrollbarCalculator.id = "scrollbarWidthCalculator";
                    this._container.appendChild(this._scrollbarCalculator);

                    this._scrollbarCalculator.style.left = this._container.clientWidth - 2 + "px";

                    this._container.scrollLeft = this._container.scrollWidth - this._container.offsetWidth;
                }
                Object.defineProperty(Scrollbar.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                Scrollbar.prototype.dispose = function () {
                    this._container.onscroll = null;
                    if (this._animationFrameHandle) {
                        window.cancelAnimationFrame(this._animationFrameHandle);
                    }
                };

                Scrollbar.prototype.resize = function (evt) {
                    var _this = this;
                    if (!this._animationFrameHandle) {
                        this._animationFrameHandle = window.requestAnimationFrame(function () {
                            return _this.onScrollAnimation();
                        });
                    }
                };

                Scrollbar.prototype.update = function (viewable, viewport) {
                    var _this = this;
                    var viewportElapsedValue = parseInt(viewport.elapsed.value);
                    var viewportStartValue = parseInt(viewport.begin.value);

                    var viewableElapsedValue = parseInt(viewable.elapsed.value);
                    var viewableStartValue = parseInt(viewable.begin.value);

                    if (isNaN(viewportElapsedValue) || isNaN(viewportStartValue) || isNaN(viewableElapsedValue) || isNaN(viewableStartValue) || viewportElapsedValue === 0) {
                        return;
                    }

                    this._startPages = (viewportStartValue - viewableStartValue) / viewportElapsedValue;
                    this._totalPages = viewableElapsedValue / viewportElapsedValue;

                    if (!this._animationFrameHandle) {
                        this._animationFrameHandle = window.requestAnimationFrame(function () {
                            return _this.onScrollAnimation();
                        });
                    }
                };

                Scrollbar.prototype.scrollTo = function (position) {
                    var _this = this;
                    this._startPages = position * this._totalPages / 100;

                    if (!this._animationFrameHandle) {
                        window.cancelAnimationFrame(this._animationFrameHandle);
                    }

                    this._animationFrameHandle = window.requestAnimationFrame(function () {
                        return _this.onScrollAnimation(false);
                    });
                };

                Scrollbar.prototype.onScrollAnimation = function (shouldIgnore) {
                    if (typeof shouldIgnore === "undefined") { shouldIgnore = true; }
                    var pixelsPerPage = this._container.clientWidth;
                    var totalPixels = this._totalPages * pixelsPerPage;

                    var startPixels = this._totalPages <= 1 ? 0 : this._startPages * pixelsPerPage;

                    this._scrollbarCalculator.style.left = totalPixels - 2 + "px";

                    if (this._container.scrollLeft !== startPixels) {
                        if (shouldIgnore) {
                            this._container.onscroll = null;
                            this._container.scrollLeft = startPixels;
                            this._container.onscroll = this._onScrollBoundFunction;
                        } else {
                            this._container.scrollLeft = startPixels;
                        }
                    }

                    this._animationFrameHandle = null;
                };

                Scrollbar.prototype.onScrollEvent = function (evt) {
                    this._startPages = this._container.scrollLeft / this._container.clientWidth;

                    if (this.onScroll) {
                        this.onScroll({
                            position: this._container.scrollLeft,
                            visibleLength: this._container.clientWidth,
                            totalLength: this._container.scrollWidth
                        });
                    }
                };
                return Scrollbar;
            })();
            DiagnosticsHub.Scrollbar = Scrollbar;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var RollingViewportController = (function () {
                function RollingViewportController(timeInNsPerPixel) {
                    if (typeof timeInNsPerPixel === "undefined") { timeInNsPerPixel = 60000000; }
                    var _this = this;
                    this._viewportStateChangedEvent = new DiagnosticsHub.AggregatedEvent();
                    this._isZoomed = false;
                    this._isScrolling = false;
                    this._isSelecting = false;
                    this._isUserInteracting = false;
                    this._commands = [];
                    var startOfTime = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.zero, DiagnosticsHub.BigNumber.zero);
                    this._currentSelection = null;
                    this._viewportTimeRange = startOfTime;
                    this._viewableTimeRange = startOfTime;
                    this._rolledViewableTimeRange = startOfTime;
                    this._timeInNsPerPixel = timeInNsPerPixel;

                    this._maxViewableWidthInNs = DiagnosticsHub.BigNumber.convertFromNumber(100 * this._timeInNsPerPixel);

                    this._scrollbar = new DiagnosticsHub.Scrollbar();
                    this._scrollbar.onScroll = this.onScroll.bind(this);
                    this._scrollbar.update(this._viewableTimeRange, this._viewportTimeRange);

                    this._onSelectionChangedBoundFunction = this.onSelectionChanged.bind(this);
                    this._onChangeViewportBoundFunction = this.onChangeViewport.bind(this);

                    this._telemetry = new DiagnosticsHub.Telemetry.ViewportController();
                    this._viewEventManager = Microsoft.VisualStudio.DiagnosticsHub.getViewEventManager();
                    this._viewEventManager.selectionChanged.addEventListener(this._onSelectionChangedBoundFunction);
                    this._viewEventManager.changeViewport.addEventListener(this._onChangeViewportBoundFunction);

                    this._commands.push({
                        id: DiagnosticsHub.CommandIds.ZoomIn,
                        callback: this.zoomIn.bind(this),
                        label: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomInButton"),
                        ariaLabel: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomInAriaLabel"),
                        tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomInButton"),
                        type: 1 /* command */,
                        iconEnabled: "vs-image-toolbar-chartzoom-in",
                        iconDisabled: "vs-image-toolbar-chartzoom-in-disabled",
                        accessKey: null,
                        hidden: function () {
                            return false;
                        },
                        disabled: function () {
                            return !_this.canZoomIn();
                        },
                        checked: function () {
                            return false;
                        },
                        cssClass: null,
                        submenu: null,
                        displayOnToolbar: true,
                        displayOnContextMenu: true
                    });

                    this._commands.push({
                        id: DiagnosticsHub.CommandIds.ZoomToSelection,
                        callback: this.zoomToSelection.bind(this),
                        label: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomToSelectionButton"),
                        ariaLabel: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomToSelectionAriaLabel"),
                        tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomToSelectionButton"),
                        type: 1 /* command */,
                        iconEnabled: "vs-image-toolbar-chartzoom-in",
                        iconDisabled: "vs-image-toolbar-chartzoom-in-disabled",
                        accessKey: null,
                        hidden: function () {
                            return false;
                        },
                        disabled: function () {
                            return !_this.canZoomToSelection();
                        },
                        checked: function () {
                            return false;
                        },
                        cssClass: null,
                        submenu: null,
                        displayOnToolbar: false,
                        displayOnContextMenu: true
                    });

                    this._commands.push({
                        id: DiagnosticsHub.CommandIds.ZoomOut,
                        callback: this.zoomOut.bind(this),
                        label: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomOutButton"),
                        ariaLabel: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomOutAriaLabel"),
                        tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarZoomOutButton"),
                        type: 1 /* command */,
                        iconEnabled: "vs-image-toolbar-chartzoom-reset",
                        iconDisabled: "vs-image-toolbar-chartzoom-reset-disabled",
                        accessKey: null,
                        hidden: function () {
                            return false;
                        },
                        disabled: function () {
                            return !_this.canZoomOut();
                        },
                        checked: function () {
                            return false;
                        },
                        cssClass: null,
                        submenu: null,
                        displayOnToolbar: true,
                        displayOnContextMenu: true
                    });

                    this._commands.push({
                        id: DiagnosticsHub.CommandIds.ResetView,
                        callback: this.resetView.bind(this),
                        label: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarResetViewButton"),
                        ariaLabel: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarResetViewAriaLabel"),
                        tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarResetViewButton"),
                        type: 1 /* command */,
                        iconEnabled: "vs-image-toolbar-reset-view",
                        iconDisabled: "vs-image-toolbar-reset-view-disabled",
                        accessKey: null,
                        hidden: function () {
                            return false;
                        },
                        disabled: function () {
                            return !_this.canResetView();
                        },
                        checked: function () {
                            return false;
                        },
                        cssClass: null,
                        submenu: null,
                        displayOnToolbar: true,
                        displayOnContextMenu: true
                    });

                    this._viewportStateChangedEvent.addEventListener(function () {
                        _this._commands.forEach(function (command) {
                            if (command.onDisabledChanged) {
                                command.onDisabledChanged();
                            }
                        });
                    });
                }
                Object.defineProperty(RollingViewportController.prototype, "container", {
                    get: function () {
                        return this._scrollbar.container;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RollingViewportController.prototype, "viewportStateChanged", {
                    get: function () {
                        return this._viewportStateChangedEvent;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RollingViewportController.prototype, "visible", {
                    get: function () {
                        return this._viewportTimeRange;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RollingViewportController.prototype, "viewable", {
                    get: function () {
                        return this._viewableTimeRange;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RollingViewportController.prototype, "selection", {
                    get: function () {
                        return this._currentSelection;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RollingViewportController.prototype, "scrollbar", {
                    get: function () {
                        return this._scrollbar;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RollingViewportController.prototype, "commands", {
                    get: function () {
                        return this._commands;
                    },
                    enumerable: true,
                    configurable: true
                });

                RollingViewportController.prototype.dispose = function () {
                    this._scrollbar.onScroll = null;
                    this._scrollbar.dispose();

                    this._viewEventManager.selectionChanged.removeEventListener(this._onSelectionChangedBoundFunction);
                    this._viewEventManager.changeViewport.removeEventListener(this._onChangeViewportBoundFunction);

                    this._viewportStateChangedEvent.dispose();
                };

                RollingViewportController.prototype.resize = function (evt) {
                    this._scrollbar.resize(evt);

                    var width = Math.max(this.container.clientWidth, 100);
                    this._maxViewableWidthInNs = DiagnosticsHub.BigNumber.convertFromNumber(width * this._timeInNsPerPixel);
                    this.rollTimeRange(true);
                };

                RollingViewportController.prototype.onDataUpdate = function (timestampNs) {
                    if (DiagnosticsHub.BigNumber.subtract(timestampNs, RollingViewportController.DropPointLimitInNs).greater(this._viewableTimeRange.begin)) {
                        this._viewableTimeRange = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.subtract(timestampNs, RollingViewportController.OneHourInNs), timestampNs);
                        this.rollTimeRange(true);
                    } else {
                        this._viewableTimeRange = new DiagnosticsHub.JsonTimespan(this._viewableTimeRange.begin, timestampNs);
                        this.rollTimeRange();
                    }
                };

                RollingViewportController.prototype.canZoomIn = function () {
                    var zoomedInTime = DiagnosticsHub.BigNumber.divideNumber(this._viewportTimeRange.elapsed, 2);
                    return !RollingViewportController.MinimumZoomTimeInNs.greater(zoomedInTime);
                };

                RollingViewportController.prototype.zoomIn = function () {
                    if (!this.canZoomIn()) {
                        return;
                    }

                    this._telemetry.zoomIn();
                    var newViewportStart;
                    var newViewportEnd;
                    var quarterViewportElapsed = DiagnosticsHub.BigNumber.divideNumber(this._viewportTimeRange.elapsed, 4);

                    if (this._currentSelection) {
                        var selectionMid = DiagnosticsHub.BigNumber.add(this._currentSelection.begin, DiagnosticsHub.BigNumber.divideNumber(this._currentSelection.elapsed, 2));
                        newViewportStart = DiagnosticsHub.BigNumber.subtract(selectionMid, quarterViewportElapsed);
                        newViewportEnd = DiagnosticsHub.BigNumber.add(selectionMid, quarterViewportElapsed);
                    } else if (this._viewableTimeRange.elapsed.greater(this._viewportTimeRange.elapsed)) {
                        newViewportStart = DiagnosticsHub.BigNumber.add(this._viewportTimeRange.begin, quarterViewportElapsed);
                        newViewportEnd = DiagnosticsHub.BigNumber.subtract(this._viewportTimeRange.end, quarterViewportElapsed);
                    } else {
                        newViewportStart = this._viewableTimeRange.begin;
                        newViewportEnd = DiagnosticsHub.BigNumber.add(newViewportStart, DiagnosticsHub.BigNumber.divideNumber(this._viewportTimeRange.elapsed, 2));
                    }

                    this._viewportTimeRange = new DiagnosticsHub.JsonTimespan(newViewportStart, newViewportEnd);
                    this._isZoomed = true;
                    this._isUserInteracting = true;
                    this._scrollbar.update(this._rolledViewableTimeRange, this._viewportTimeRange);
                    this.fireViewportStateChanged();
                };

                RollingViewportController.prototype.canZoomToSelection = function () {
                    return this._currentSelection && !this._currentSelection.equals(this._viewportTimeRange) && !RollingViewportController.MinimumZoomTimeInNs.greater(this._currentSelection.elapsed);
                };

                RollingViewportController.prototype.zoomToSelection = function () {
                    if (!this.canZoomToSelection()) {
                        return;
                    }

                    this._telemetry.zoomIn();
                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25225 /* perfDiagnosticsHub_ZoomSelectionBegin */);

                    this._viewportTimeRange = this._currentSelection;
                    this._isZoomed = true;
                    this._scrollbar.update(this._rolledViewableTimeRange, this._viewportTimeRange);
                    this.fireViewportStateChanged();

                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25226 /* perfDiagnosticsHub_ZoomSelectionEnd */);
                };

                RollingViewportController.prototype.canZoomOut = function () {
                    return RollingViewportController.OneHourInNs.greater(this._viewportTimeRange.elapsed);
                };

                RollingViewportController.prototype.zoomOut = function () {
                    if (!this.canZoomOut()) {
                        return;
                    }

                    this._telemetry.zoomOut();
                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25255 /* perfDiagnosticsHub_ZoomOutBegin */);

                    var newViewportOneFourth = DiagnosticsHub.BigNumber.divideNumber(this._viewportTimeRange.elapsed, 2);
                    var newViewportStart = DiagnosticsHub.BigNumber.subtract(this._viewportTimeRange.begin, newViewportOneFourth);
                    newViewportStart = newViewportStart.greater(this._viewableTimeRange.begin) ? newViewportStart : this._viewableTimeRange.begin;

                    var newViewportLength = DiagnosticsHub.BigNumber.min(RollingViewportController.OneHourInNs, DiagnosticsHub.BigNumber.multiplyNumber(newViewportOneFourth, 4));
                    this._viewportTimeRange = new DiagnosticsHub.JsonTimespan(newViewportStart, DiagnosticsHub.BigNumber.add(newViewportStart, newViewportLength));

                    if (this._viewportTimeRange.end.greater(this._rolledViewableTimeRange.end)) {
                        this._rolledViewableTimeRange = new DiagnosticsHub.JsonTimespan(this._rolledViewableTimeRange.begin, this._viewportTimeRange.end);
                    }

                    this._isZoomed = true;
                    this._scrollbar.update(this._rolledViewableTimeRange, this._viewportTimeRange);
                    this.fireViewportStateChanged();

                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25256 /* perfDiagnosticsHub_ZoomOutEnd */);
                };

                RollingViewportController.prototype.canResetView = function () {
                    return (typeof this._currentSelection !== "undefined" && this._currentSelection !== null) || this._isZoomed || this._isScrolling;
                };

                RollingViewportController.prototype.resetView = function () {
                    if (!this.canResetView()) {
                        return;
                    }

                    this._telemetry.clearSelection();
                    this._isZoomed = false;
                    this._isScrolling = false;
                    this._isUserInteracting = false;
                    this.rollTimeRange(true);

                    this._viewEventManager.selectionChanged.raiseEvent({
                        position: null,
                        isIntermittent: false
                    });
                };

                RollingViewportController.prototype.requestViewportChange = function (viewport) {
                    if (this._isSelecting) {
                        return false;
                    }

                    var canSetViewport = (viewport.currentTimespan.begin.equals(DiagnosticsHub.BigNumber.zero) && viewport.currentTimespan.end.equals(DiagnosticsHub.BigNumber.zero)) || (this._rolledViewableTimeRange.contains(viewport.currentTimespan.begin) && this._rolledViewableTimeRange.contains(viewport.currentTimespan.end));

                    var canSetSelection = !viewport.selectionTimespan || (this._viewableTimeRange.contains(viewport.selectionTimespan.begin) && this._viewableTimeRange.contains(viewport.selectionTimespan.end));

                    if (!canSetViewport || !canSetSelection) {
                        DiagnosticsHub.Debug.Assert.isTrue(canSetViewport, "Invalid viewport specified");
                        DiagnosticsHub.Debug.Assert.isTrue(canSetSelection, "Invalid selection specified");
                        return false;
                    }

                    var newViewportTimeRange = viewport.currentTimespan;
                    var zeroTimeRage = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.zero, DiagnosticsHub.BigNumber.zero);
                    var resetView = viewport.currentTimespan.equals(zeroTimeRage);
                    if (resetView) {
                        newViewportTimeRange = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.subtract(this._rolledViewableTimeRange.end, DiagnosticsHub.BigNumber.min(this._viewportTimeRange.elapsed, this._rolledViewableTimeRange.end)), this._rolledViewableTimeRange.end);
                    }

                    if (newViewportTimeRange.begin.greaterOrEqual(this._rolledViewableTimeRange.end) || this._rolledViewableTimeRange.begin.greaterOrEqual(newViewportTimeRange.end)) {
                        return false;
                    }

                    if (resetView || (newViewportTimeRange.end.greater(this._viewableTimeRange.end) && this._rolledViewableTimeRange.end.greater(newViewportTimeRange.end))) {
                        this._rolledViewableTimeRange = new DiagnosticsHub.JsonTimespan(this._rolledViewableTimeRange.begin, newViewportTimeRange.end);
                        this._isScrolling = false;
                        this._isUserInteracting = false;
                    } else {
                        this._isUserInteracting = true;
                    }

                    newViewportTimeRange = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.max(newViewportTimeRange.begin, this._rolledViewableTimeRange.begin), DiagnosticsHub.BigNumber.min(newViewportTimeRange.end, this._rolledViewableTimeRange.end));

                    if (RollingViewportController.MinimumZoomTimeInNs.greater(newViewportTimeRange.elapsed)) {
                        var newStartTime = DiagnosticsHub.BigNumber.subtract(newViewportTimeRange.end, RollingViewportController.MinimumZoomTimeInNs);
                        if (newStartTime.greaterOrEqual(this._rolledViewableTimeRange.begin)) {
                            newViewportTimeRange = new DiagnosticsHub.JsonTimespan(newStartTime, newViewportTimeRange.end);
                        } else {
                            var newEndTime = DiagnosticsHub.BigNumber.add(newViewportTimeRange.begin, RollingViewportController.MinimumZoomTimeInNs);
                            if (this._rolledViewableTimeRange.end.greaterOrEqual(newEndTime)) {
                                newViewportTimeRange = new DiagnosticsHub.JsonTimespan(newViewportTimeRange.begin, newEndTime);
                            } else {
                                return false;
                            }
                        }
                    }

                    var selectionChanged = !this.isSameSelection(viewport.selectionTimespan);

                    if (!selectionChanged && this._viewportTimeRange.equals(newViewportTimeRange)) {
                        return false;
                    }

                    this._isZoomed = true;
                    this._viewportTimeRange = newViewportTimeRange;
                    this._scrollbar.update(this._rolledViewableTimeRange, this._viewportTimeRange);

                    if (selectionChanged) {
                        this._currentSelection = viewport.selectionTimespan;
                        this._viewEventManager.selectionChanged.raiseEvent({
                            position: this._currentSelection,
                            isIntermittent: false
                        });
                    }

                    this.fireViewportStateChanged(false);
                    return true;
                };

                RollingViewportController.prototype.rollTimeRange = function (reset) {
                    if (typeof reset === "undefined") { reset = false; }
                    var updateScrollBar = false;

                    if (this._viewableTimeRange.end.greater(this._rolledViewableTimeRange.end) || reset) {
                        var rolledViewable = reset ? new DiagnosticsHub.JsonTimespan(this._viewableTimeRange.begin, DiagnosticsHub.BigNumber.add(this._viewableTimeRange.begin, this._maxViewableWidthInNs)) : this._rolledViewableTimeRange;

                        while (this._viewableTimeRange.end.greater(rolledViewable.end)) {
                            var segmentWidthInNs = DiagnosticsHub.BigNumber.divideNumber(this._maxViewableWidthInNs, 3);
                            rolledViewable = new DiagnosticsHub.JsonTimespan(rolledViewable.begin, DiagnosticsHub.BigNumber.add(rolledViewable.end, segmentWidthInNs));
                        }

                        updateScrollBar = !this._rolledViewableTimeRange.equals(rolledViewable);
                        this._rolledViewableTimeRange = rolledViewable;
                    }

                    if (!this._isSelecting && !this._currentSelection && !this._isUserInteracting && !this._isScrolling) {
                        var viewportDuration = reset ? this._maxViewableWidthInNs : DiagnosticsHub.BigNumber.max(this._maxViewableWidthInNs, this._viewportTimeRange.elapsed);

                        var viewport = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.subtract(this._rolledViewableTimeRange.end, viewportDuration), this._rolledViewableTimeRange.end);
                        if (!this._viewportTimeRange.equals(viewport)) {
                            updateScrollBar = true;
                            this._viewportTimeRange = viewport;
                            this.fireViewportStateChanged();
                        }
                    }

                    if (updateScrollBar) {
                        this._scrollbar.update(this._rolledViewableTimeRange, this._viewportTimeRange);
                    }
                };

                RollingViewportController.prototype.onChangeViewport = function (eventArgs) {
                    var zeroTimeRage = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.zero, DiagnosticsHub.BigNumber.zero);
                    var resetView = eventArgs.equals(zeroTimeRage);
                    if (resetView) {
                        eventArgs = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.subtract(this._rolledViewableTimeRange.end, DiagnosticsHub.BigNumber.min(this._viewportTimeRange.elapsed, this._rolledViewableTimeRange.end)), this._rolledViewableTimeRange.end);
                    }

                    if (eventArgs.begin.greaterOrEqual(this._rolledViewableTimeRange.end) || this._rolledViewableTimeRange.begin.greaterOrEqual(eventArgs.end)) {
                        return false;
                    }

                    if (resetView || (eventArgs.end.greater(this._viewableTimeRange.end) && this._rolledViewableTimeRange.end.greater(eventArgs.end))) {
                        this._rolledViewableTimeRange = new DiagnosticsHub.JsonTimespan(this._rolledViewableTimeRange.begin, eventArgs.end);
                        this._isScrolling = false;
                        this._isUserInteracting = false;
                    } else {
                        this._isUserInteracting = true;
                    }

                    var newViewportTimeRange = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.max(eventArgs.begin, this._rolledViewableTimeRange.begin), DiagnosticsHub.BigNumber.min(eventArgs.end, this._rolledViewableTimeRange.end));

                    if (RollingViewportController.MinimumZoomTimeInNs.greater(newViewportTimeRange.elapsed)) {
                        var newStartTime = DiagnosticsHub.BigNumber.subtract(newViewportTimeRange.end, RollingViewportController.MinimumZoomTimeInNs);
                        if (newStartTime.greaterOrEqual(this._rolledViewableTimeRange.begin)) {
                            newViewportTimeRange = new DiagnosticsHub.JsonTimespan(newStartTime, newViewportTimeRange.end);
                        } else {
                            var newEndTime = DiagnosticsHub.BigNumber.add(newViewportTimeRange.begin, RollingViewportController.MinimumZoomTimeInNs);
                            if (this._rolledViewableTimeRange.end.greaterOrEqual(newEndTime)) {
                                newViewportTimeRange = new DiagnosticsHub.JsonTimespan(newViewportTimeRange.begin, newEndTime);
                            } else {
                                return false;
                            }
                        }
                    }

                    if (this._viewportTimeRange.equals(newViewportTimeRange)) {
                        return false;
                    }

                    this._isZoomed = true;
                    this._viewportTimeRange = newViewportTimeRange;
                    this._scrollbar.update(this._rolledViewableTimeRange, this._viewportTimeRange);
                    this.fireViewportStateChanged();

                    return true;
                };

                RollingViewportController.prototype.onSelectionChanged = function (event) {
                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25233 /* perfDiagnosticsHub_OnSelectionChangedBegin */);

                    this._isSelecting = event.isIntermittent;

                    if (event.position !== null && typeof event.position !== "undefined" && event.position.end.greater(this._viewableTimeRange.end)) {
                        var start = DiagnosticsHub.BigNumber.min(event.position.begin, this._viewableTimeRange.end);
                        this._viewEventManager.selectionChanged.raiseEvent({
                            position: new DiagnosticsHub.JsonTimespan(start, this._viewableTimeRange.end),
                            isIntermittent: this._isSelecting
                        });
                    } else if (!this.isSameSelection(event.position)) {
                        this._currentSelection = event.position;
                        this.fireViewportStateChanged(this._isSelecting);
                    }

                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25234 /* perfDiagnosticsHub_OnSelectionChangedEnd */);
                };

                RollingViewportController.prototype.onScroll = function (scrollArgs) {
                    if (!scrollArgs.totalLength) {
                        return;
                    }

                    if (Math.abs((scrollArgs.position + scrollArgs.visibleLength) - scrollArgs.totalLength) > 1) {
                        this._isScrolling = true;
                    } else {
                        this._isScrolling = false;
                        this._isUserInteracting = false;
                    }

                    var begin = DiagnosticsHub.BigNumber.addNumber(this._rolledViewableTimeRange.begin, parseInt(this._rolledViewableTimeRange.elapsed.value) * scrollArgs.position / scrollArgs.totalLength);

                    var end = DiagnosticsHub.BigNumber.add(begin, this._viewportTimeRange.elapsed);
                    this._viewportTimeRange = new DiagnosticsHub.JsonTimespan(begin, end);
                    this.fireViewportStateChanged();
                };

                RollingViewportController.prototype.fireViewportStateChanged = function (isIntermittent) {
                    if (typeof isIntermittent === "undefined") { isIntermittent = false; }
                    this._viewportStateChangedEvent.invokeEvent({
                        currentTimespan: this._viewportTimeRange,
                        selectionTimespan: this._currentSelection,
                        isIntermittent: isIntermittent
                    });
                };

                RollingViewportController.prototype.isSameSelection = function (timestamp) {
                    return (!this._currentSelection && !timestamp) || (this._currentSelection && timestamp && this._currentSelection.equals(timestamp));
                };
                RollingViewportController.MinimumZoomTimeInNs = DiagnosticsHub.BigNumber.convertFromNumber(10000);
                RollingViewportController.OneHourInNs = DiagnosticsHub.BigNumber.convertFromNumber(60 * 60 * 1000000000);

                RollingViewportController.DropPointLimitInNs = DiagnosticsHub.BigNumber.convertFromNumber(61 * 60 * 1000000000);
                return RollingViewportController;
            })();
            DiagnosticsHub.RollingViewportController = RollingViewportController;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var SeriesType = (function () {
                function SeriesType() {
                }
                Object.defineProperty(SeriesType, "Line", {
                    get: function () {
                        return "Line";
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(SeriesType, "StepLine", {
                    get: function () {
                        return "StepLine";
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(SeriesType, "Mark", {
                    get: function () {
                        return "Mark";
                    },
                    enumerable: true,
                    configurable: true
                });
                return SeriesType;
            })();
            DiagnosticsHub.SeriesType = SeriesType;

            var ViewType = (function () {
                function ViewType() {
                }
                Object.defineProperty(ViewType, "Graph", {
                    get: function () {
                        return "Graph";
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewType, "Ruler", {
                    get: function () {
                        return "Ruler";
                    },
                    enumerable: true,
                    configurable: true
                });
                return ViewType;
            })();
            DiagnosticsHub.ViewType = ViewType;

            (function (GraphBehaviourType) {
                GraphBehaviourType[GraphBehaviourType["None"] = 0] = "None";
                GraphBehaviourType[GraphBehaviourType["Live"] = 1] = "Live";
                GraphBehaviourType[GraphBehaviourType["PostMortem"] = 2] = "PostMortem";
            })(DiagnosticsHub.GraphBehaviourType || (DiagnosticsHub.GraphBehaviourType = {}));
            var GraphBehaviourType = DiagnosticsHub.GraphBehaviourType;

            var GraphEvents = (function () {
                function GraphEvents() {
                }
                Object.defineProperty(GraphEvents, "ScaleInfoChanged", {
                    get: function () {
                        return "scaleInfoChanged";
                    },
                    enumerable: true,
                    configurable: true
                });
                return GraphEvents;
            })();
            DiagnosticsHub.GraphEvents = GraphEvents;

            (function (ScaleType) {
                ScaleType[ScaleType["Left"] = 0] = "Left";
                ScaleType[ScaleType["Right"] = 1] = "Right";
            })(DiagnosticsHub.ScaleType || (DiagnosticsHub.ScaleType = {}));
            var ScaleType = DiagnosticsHub.ScaleType;

            (function (PointToFind) {
                PointToFind[PointToFind["LessThanOrEqual"] = 0] = "LessThanOrEqual";
                PointToFind[PointToFind["Nearest"] = 1] = "Nearest";
                PointToFind[PointToFind["GreaterThanOrEqual"] = 2] = "GreaterThanOrEqual";
            })(DiagnosticsHub.PointToFind || (DiagnosticsHub.PointToFind = {}));
            var PointToFind = DiagnosticsHub.PointToFind;

            (function (SwimlaneType) {
                SwimlaneType[SwimlaneType["Unknown"] = 0] = "Unknown";
                SwimlaneType[SwimlaneType["Standard"] = 1] = "Standard";
                SwimlaneType[SwimlaneType["Custom"] = 2] = "Custom";
                SwimlaneType[SwimlaneType["FullCustom"] = 3] = "FullCustom";
            })(DiagnosticsHub.SwimlaneType || (DiagnosticsHub.SwimlaneType = {}));
            var SwimlaneType = DiagnosticsHub.SwimlaneType;

            (function (MarkType) {
                MarkType[MarkType["LifeCycleEvent"] = 1] = "LifeCycleEvent";
                MarkType[MarkType["UserMark"] = 2] = "UserMark";
                MarkType[MarkType["Custom"] = 3] = "Custom";
            })(DiagnosticsHub.MarkType || (DiagnosticsHub.MarkType = {}));
            var MarkType = DiagnosticsHub.MarkType;

            (function (TickMarkType) {
                TickMarkType[TickMarkType["Big"] = 0] = "Big";

                TickMarkType[TickMarkType["Medium"] = 1] = "Medium";

                TickMarkType[TickMarkType["Small"] = 2] = "Small";
            })(DiagnosticsHub.TickMarkType || (DiagnosticsHub.TickMarkType = {}));
            var TickMarkType = DiagnosticsHub.TickMarkType;

            (function (UnitFormat) {
                UnitFormat[UnitFormat["italicizedAbbreviations"] = 0] = "italicizedAbbreviations";
                UnitFormat[UnitFormat["fullName"] = 1] = "fullName";
            })(DiagnosticsHub.UnitFormat || (DiagnosticsHub.UnitFormat = {}));
            var UnitFormat = DiagnosticsHub.UnitFormat;

            (function (ControlsCodeMarkers) {
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_ZoomSelectionBegin"] = 25225] = "perfDiagnosticsHub_ZoomSelectionBegin";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_ZoomSelectionEnd"] = 25226] = "perfDiagnosticsHub_ZoomSelectionEnd";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_SwimlaneFullRenderBegin"] = 25227] = "perfDiagnosticsHub_SwimlaneFullRenderBegin";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_SwimlaneFullRenderEnd"] = 25228] = "perfDiagnosticsHub_SwimlaneFullRenderEnd";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_GraphContentFullRenderBegin"] = 25229] = "perfDiagnosticsHub_GraphContentFullRenderBegin";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_GraphContentFullRenderEnd"] = 25230] = "perfDiagnosticsHub_GraphContentFullRenderEnd";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_GraphContentPartialRenderBegin"] = 25231] = "perfDiagnosticsHub_GraphContentPartialRenderBegin";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_GraphContentPartialRenderEnd"] = 25232] = "perfDiagnosticsHub_GraphContentPartialRenderEnd";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_OnSelectionChangedBegin"] = 25233] = "perfDiagnosticsHub_OnSelectionChangedBegin";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_OnSelectionChangedEnd"] = 25234] = "perfDiagnosticsHub_OnSelectionChangedEnd";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_OnDataUpdateBegin"] = 25235] = "perfDiagnosticsHub_OnDataUpdateBegin";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_OnDataUpdateEnd"] = 25236] = "perfDiagnosticsHub_OnDataUpdateEnd";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_ResetZoomBegin"] = 25237] = "perfDiagnosticsHub_ResetZoomBegin";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_ResetZoomEnd"] = 25238] = "perfDiagnosticsHub_ResetZoomEnd";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_ZoomOutBegin"] = 25255] = "perfDiagnosticsHub_ZoomOutBegin";
                ControlsCodeMarkers[ControlsCodeMarkers["perfDiagnosticsHub_ZoomOutEnd"] = 25256] = "perfDiagnosticsHub_ZoomOutEnd";
            })(DiagnosticsHub.ControlsCodeMarkers || (DiagnosticsHub.ControlsCodeMarkers = {}));
            var ControlsCodeMarkers = DiagnosticsHub.ControlsCodeMarkers;

            var Padding = (function () {
                function Padding(left, top, right, bottom) {
                    this.left = left;
                    this.top = top;
                    this.right = right;
                    this.bottom = bottom;
                }
                return Padding;
            })();
            DiagnosticsHub.Padding = Padding;

            var RectangleDimension = (function (_super) {
                __extends(RectangleDimension, _super);
                function RectangleDimension(left, top, right, bottom) {
                    _super.call(this, left, top, right, bottom);

                    if (this.left > this.right || this.top > this.bottom) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                    }
                }
                Object.defineProperty(RectangleDimension.prototype, "width", {
                    get: function () {
                        return this.right - this.left;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RectangleDimension.prototype, "height", {
                    get: function () {
                        return this.bottom - this.top;
                    },
                    enumerable: true,
                    configurable: true
                });
                return RectangleDimension;
            })(Padding);
            DiagnosticsHub.RectangleDimension = RectangleDimension;

            var MinMaxNumber = (function () {
                function MinMaxNumber(min, max) {
                    this.min = min;
                    this.max = max;
                }
                Object.defineProperty(MinMaxNumber.prototype, "range", {
                    get: function () {
                        if ((this.min || this.min === 0) && (this.max || this.max === 0)) {
                            return this.max - this.min;
                        }

                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });
                return MinMaxNumber;
            })();
            DiagnosticsHub.MinMaxNumber = MinMaxNumber;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var DiagnosticsHubDataManager = (function () {
                function DiagnosticsHubDataManager() {
                    this._graphConfigurationMarshaler = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.SwimLanesViewMarshaler", {}, true);
                    if (!this._graphConfigurationMarshaler) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1007"));
                    }
                }
                DiagnosticsHubDataManager.prototype.getConfigurations = function (func) {
                    this._graphConfigurationMarshaler._call("getConfigurations").done(func);
                };

                DiagnosticsHubDataManager.prototype.dataUpdate = function (func) {
                    this._graphConfigurationMarshaler.addEventListener("dataUpdate", func);
                };
                return DiagnosticsHubDataManager;
            })();
            DiagnosticsHub.DiagnosticsHubDataManager = DiagnosticsHubDataManager;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (Common) {
                var DependencyManager = (function () {
                    function DependencyManager() {
                    }
                    DependencyManager.loadCss = function (fullCssFilePath) {
                        if (typeof fullCssFilePath !== "string" && fullCssFilePath.lastIndexOf(".css") !== fullCssFilePath.length - 4) {
                            throw new Error("file name is null or undefined.");
                        }

                        var nameArr = fullCssFilePath.substring(fullCssFilePath.lastIndexOf("\\") + 1, fullCssFilePath.lastIndexOf(".css"));
                        var oldCss = document.getElementById(nameArr);
                        if (!oldCss) {
                            return Microsoft.Plugin.Theme.processCSSFileForThemeing(fullCssFilePath).then(function (str) {
                                var themedStyle = document.createElement("style");
                                themedStyle.setAttribute("data-plugin-theme", "true");
                                themedStyle.setAttribute("data-plugin-theme-href", fullCssFilePath);
                                themedStyle.type = "text/css";
                                themedStyle.innerHTML = str;
                                document.getElementsByTagName("head")[0].appendChild(themedStyle);
                            });
                        }
                    };

                    DependencyManager.loadDependency = function (dependency) {
                        var fileUri = DependencyManager.toFileUri(dependency.url).toUpperCase();

                        if (DependencyManager.isScriptAppended(fileUri)) {
                            var loadingPromise = Microsoft.Plugin.Promise.wrap(null);
                            if (DependencyManager.LoadingDependenciesMap[fileUri]) {
                                loadingPromise = DependencyManager.LoadingDependenciesMap[fileUri];
                            }

                            return loadingPromise.then(function () {
                                return DependencyManager.registerDependency(dependency);
                            });
                        }

                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = dependency.url;

                        DependencyManager.LoadingDependenciesMap[fileUri] = new Microsoft.Plugin.Promise(function (completed, error, progress) {
                            script.onload = function () {
                                delete DependencyManager.LoadingDependenciesMap[fileUri];
                                DependencyManager.registerDependency(dependency);
                                completed(null);
                            };

                            script.onerror = function () {
                                if (error) {
                                    error(null);
                                } else {
                                    throw new Error("Unable to load resource: " + dependency.url);
                                }
                            };
                        });

                        document.getElementsByTagName("head")[0].appendChild(script);
                        return DependencyManager.LoadingDependenciesMap[fileUri];
                    };

                    DependencyManager.registerDependency = function (dependency) {
                        if (dependency.objType) {
                            Microsoft.VisualStudio.DiagnosticsHub.RegisterNamespace.registerClass(dependency.objType);
                        }

                        if (dependency.functionName) {
                            Microsoft.VisualStudio.DiagnosticsHub.RegisterNamespace.registerFunction(dependency.functionName);
                        }
                    };

                    DependencyManager.isScriptAppended = function (uri) {
                        for (var scriptNumber = 0; scriptNumber < document.scripts.length; ++scriptNumber) {
                            var script = document.scripts[scriptNumber];
                            if (script.src && decodeURIComponent(script.src).toUpperCase() === uri.toUpperCase()) {
                                return true;
                            }
                        }

                        return false;
                    };

                    DependencyManager.toFileUri = function (url) {
                        var fileUri = url.split("\\").join("/");
                        if (fileUri.substr(0, DependencyManager.FileUriPrefix.length).toUpperCase() !== DependencyManager.FileUriPrefix.toUpperCase()) {
                            fileUri = DependencyManager.FileUriPrefix + fileUri;
                        }

                        return fileUri;
                    };
                    DependencyManager.LoadingDependenciesMap = {};
                    DependencyManager.FileUriPrefix = "file:///";
                    return DependencyManager;
                })();
                Common.DependencyManager = DependencyManager;
            })(DiagnosticsHub.Common || (DiagnosticsHub.Common = {}));
            var Common = DiagnosticsHub.Common;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (Common) {
                "use strict";

                (function (KeyCodes) {
                    KeyCodes[KeyCodes["Tab"] = 9] = "Tab";
                    KeyCodes[KeyCodes["Enter"] = 13] = "Enter";
                    KeyCodes[KeyCodes["Escape"] = 27] = "Escape";
                    KeyCodes[KeyCodes["Space"] = 32] = "Space";
                    KeyCodes[KeyCodes["PageUp"] = 33] = "PageUp";
                    KeyCodes[KeyCodes["PageDown"] = 34] = "PageDown";
                    KeyCodes[KeyCodes["End"] = 35] = "End";
                    KeyCodes[KeyCodes["Home"] = 36] = "Home";
                    KeyCodes[KeyCodes["ArrowLeft"] = 37] = "ArrowLeft";
                    KeyCodes[KeyCodes["ArrowFirst"] = 37] = "ArrowFirst";
                    KeyCodes[KeyCodes["ArrowUp"] = 38] = "ArrowUp";
                    KeyCodes[KeyCodes["ArrowRight"] = 39] = "ArrowRight";
                    KeyCodes[KeyCodes["ArrowDown"] = 40] = "ArrowDown";
                    KeyCodes[KeyCodes["ArrowLast"] = 40] = "ArrowLast";
                    KeyCodes[KeyCodes["Delete"] = 46] = "Delete";
                    KeyCodes[KeyCodes["B"] = 66] = "B";
                    KeyCodes[KeyCodes["C"] = 67] = "C";
                    KeyCodes[KeyCodes["Plus"] = 107] = "Plus";
                    KeyCodes[KeyCodes["Minus"] = 109] = "Minus";
                    KeyCodes[KeyCodes["F1"] = 112] = "F1";
                    KeyCodes[KeyCodes["F2"] = 113] = "F2";
                    KeyCodes[KeyCodes["F3"] = 114] = "F3";
                    KeyCodes[KeyCodes["F4"] = 115] = "F4";
                    KeyCodes[KeyCodes["F5"] = 116] = "F5";
                    KeyCodes[KeyCodes["F6"] = 117] = "F6";
                    KeyCodes[KeyCodes["F7"] = 118] = "F7";
                    KeyCodes[KeyCodes["F8"] = 119] = "F8";
                    KeyCodes[KeyCodes["F9"] = 120] = "F9";
                    KeyCodes[KeyCodes["F10"] = 121] = "F10";
                    KeyCodes[KeyCodes["F11"] = 122] = "F11";
                    KeyCodes[KeyCodes["F12"] = 123] = "F12";
                })(Common.KeyCodes || (Common.KeyCodes = {}));
                var KeyCodes = Common.KeyCodes;

                (function (MouseCodes) {
                    MouseCodes[MouseCodes["Left"] = 1] = "Left";
                    MouseCodes[MouseCodes["Right"] = 3] = "Right";
                    MouseCodes[MouseCodes["Middle"] = 2] = "Middle";
                })(Common.MouseCodes || (Common.MouseCodes = {}));
                var MouseCodes = Common.MouseCodes;
            })(DiagnosticsHub.Common || (DiagnosticsHub.Common = {}));
            var Common = DiagnosticsHub.Common;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var ToolbarButton = (function () {
                function ToolbarButton(command) {
                    var _this = this;
                    this._command = command;

                    this._command.disabled = this._command.disabled || (function () {
                        return false;
                    });

                    this._container = document.createElement("button");
                    this._container.classList.add(ToolbarButton.ButtonDisabledCss);
                    this._container.classList.add(this._command.cssClass);
                    this._container.disabled = this._command.disabled();

                    if (this._command.tooltip) {
                        this._container.setAttribute("data-plugin-vs-tooltip", JSON.stringify({ content: this._command.tooltip }));
                    }

                    this._container.setAttribute("role", "button");
                    this._container.setAttribute("aria-label", this._command.ariaLabel || this._command.label);

                    if (this._command.iconEnabled) {
                        var enabled = document.createElement("div");
                        enabled.classList.add(ToolbarButton.ButtonImageCss);
                        enabled.classList.add(ToolbarButton.SvgEnabled);
                        enabled.appendChild(DiagnosticsHub.Utilities.getSVGPlaceHolder(this._command.iconEnabled));
                        this._container.appendChild(enabled);
                        Microsoft.Plugin.Theme.processInjectedSvg(enabled);
                    }

                    if (this._command.iconDisabled) {
                        var disabled = document.createElement("div");
                        disabled.classList.add(ToolbarButton.ButtonImageCss);
                        disabled.classList.add(ToolbarButton.SvgDisabled);
                        disabled.appendChild(DiagnosticsHub.Utilities.getSVGPlaceHolder(this._command.iconDisabled));
                        this._container.appendChild(disabled);
                        Microsoft.Plugin.Theme.processInjectedSvg(disabled);
                    }

                    var textDiv = document.createElement("div");
                    textDiv.innerHTML = this._command.label;
                    textDiv.classList.add(ToolbarButton.ButtonTextCss);
                    textDiv.classList.add(ToolbarButton.ButtonTextDisabledCss);
                    this._container.appendChild(textDiv);

                    this._container.onclick = this.onClick.bind(this);
                    this._container.onkeydown = this.onKeyDown.bind(this);

                    this._command.onDisabledChanged = function () {
                        _this.setEnabled(!_this._command.disabled());
                    };

                    Microsoft.Plugin.Theme.addEventListener("themechanged", function () {
                        _this.setEnabled(!_this._command.disabled());
                    });

                    this._currentState = this._container.disabled;
                    this.setEnabled(!this._container.disabled);
                }
                Object.defineProperty(ToolbarButton.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                ToolbarButton.prototype.onKeyDown = function (event) {
                    if (!this._container.disabled && 13 /* Enter */ === event.keyCode) {
                        this._command.callback();
                    }
                };

                ToolbarButton.prototype.onClick = function (event) {
                    if (!this._container.disabled) {
                        this._command.callback();
                    }
                };

                ToolbarButton.prototype.setEnabled = function (state) {
                    if (this._currentState === state) {
                        return;
                    }

                    this._currentState = state;
                    this._container.disabled = !state;
                    var text = this._container.getElementsByClassName(ToolbarButton.ButtonTextCss)[0];
                    if (state) {
                        text.classList.remove(ToolbarButton.ButtonTextDisabledCss);

                        this._container.tabIndex = 0;
                        this._container.classList.remove(ToolbarButton.ButtonDisabledCss);
                        this._container.classList.add(ToolbarButton.ButtonCss);
                    } else {
                        text.classList.add(ToolbarButton.ButtonTextDisabledCss);

                        this._container.tabIndex = -1;
                        this._container.classList.add(ToolbarButton.ButtonDisabledCss);
                        this._container.classList.remove(ToolbarButton.ButtonCss);
                    }
                };
                ToolbarButton.ButtonCss = "toolbar-button";
                ToolbarButton.ButtonDisabledCss = "toolbar-button-disabled";
                ToolbarButton.ButtonImageCss = "button-image";
                ToolbarButton.ButtonTextCss = "button-text";
                ToolbarButton.ButtonTextDisabledCss = "button-text-disabled";
                ToolbarButton.SvgDisabled = "svg-disabled";
                ToolbarButton.SvgEnabled = "svg-enabled";
                return ToolbarButton;
            })();
            DiagnosticsHub.ToolbarButton = ToolbarButton;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var ToolbarSeparator = (function () {
                function ToolbarSeparator() {
                    this._container = document.createElement("div");
                    this._container.classList.add("toolbar-separator");
                    this._container.innerHTML = "&nbsp;";
                }
                Object.defineProperty(ToolbarSeparator.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                ToolbarSeparator.prototype.setEnabled = function (state) {
                };
                return ToolbarSeparator;
            })();
            DiagnosticsHub.ToolbarSeparator = ToolbarSeparator;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var Toolbar = (function () {
                function Toolbar() {
                    var _this = this;
                    this._items = [];
                    this._container = document.createElement("div");
                    this._container.classList.add("toolbar-container");

                    this._collapseCallback = function (mql) {
                        if (mql.matches) {
                            _this._container.classList.add("limitedSpace");
                        } else {
                            _this._container.classList.remove("limitedSpace");
                        }
                    };

                    this.updateCollapsingWidth();
                }
                Object.defineProperty(Toolbar.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                Toolbar.prototype.addCommand = function (command) {
                    if (command.displayOnToolbar) {
                        this.addToolbarItem(new DiagnosticsHub.ToolbarButton(command));
                    }
                };

                Toolbar.prototype.addCommandGroup = function (commands) {
                    var _this = this;
                    if (this._items.length > 0 && commands.length > 0) {
                        this.addSeparator();
                    }

                    commands.forEach(function (command) {
                        _this.addCommand(command);
                    });
                };

                Toolbar.prototype.addToolbarItem = function (item) {
                    this._items.push(item);

                    this._container.appendChild(item.container);
                    this.updateCollapsingWidth();
                };

                Toolbar.prototype.addSeparator = function () {
                    this.addToolbarItem(new DiagnosticsHub.ToolbarSeparator());
                };

                Toolbar.prototype.updateCollapsingWidth = function () {
                    if (this._collapseMediaQuery) {
                        this._collapseMediaQuery.removeListener(this._collapseCallback);
                    }

                    var preferredWidth = 60;
                    this._items.forEach(function (item) {
                        preferredWidth += item.container.offsetWidth;
                    });

                    this._collapseMediaQuery = window.matchMedia(DiagnosticsHub.Utilities.formatString("(max-width: {0}px)", preferredWidth.toString()));
                    this._collapseMediaQuery.addListener(this._collapseCallback);

                    this._collapseCallback(this._collapseMediaQuery);
                };
                return Toolbar;
            })();
            DiagnosticsHub.Toolbar = Toolbar;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var Utilities = (function () {
                function Utilities() {
                }
                Utilities.findChildById = function (element, id) {
                    var queue = [];
                    var currentElement = element;

                    while (currentElement) {
                        if (currentElement.id === id) {
                            return currentElement;
                        }

                        for (var child = 0; child < currentElement.children.length; ++child) {
                            queue.push(currentElement.children[child]);
                        }

                        currentElement = queue.shift();
                    }

                    return null;
                };

                Utilities.findLessThan = function (list, value, comp, minIndex, maxIndex) {
                    if (typeof minIndex === "undefined") { minIndex = 0; }
                    if (typeof maxIndex === "undefined") { maxIndex = list.length - 1; }
                    if (maxIndex === minIndex) {
                        return minIndex;
                    } else if (maxIndex - minIndex <= 1) {
                        return comp(list[maxIndex], value) ? maxIndex : minIndex;
                    }

                    var index = Math.floor((maxIndex + minIndex) / 2);

                    return comp(value, list[index]) ? Utilities.findLessThan(list, value, comp, minIndex, index) : Utilities.findLessThan(list, value, comp, index, maxIndex);
                };

                Utilities.findGreaterThan = function (list, value, comp, minIndex, maxIndex) {
                    if (typeof minIndex === "undefined") { minIndex = 0; }
                    if (typeof maxIndex === "undefined") { maxIndex = list.length - 1; }
                    if (maxIndex === minIndex) {
                        return maxIndex;
                    } else if (maxIndex - minIndex <= 1) {
                        return comp(value, list[minIndex]) ? minIndex : maxIndex;
                    }

                    var index = Math.floor((maxIndex + minIndex) / 2);

                    return comp(value, list[index]) ? Utilities.findGreaterThan(list, value, comp, minIndex, index) : Utilities.findGreaterThan(list, value, comp, index, maxIndex);
                };

                Utilities.scaleToRange = function (value, valueMin, valueMax, newMin, newMax) {
                    if (valueMax === valueMin) {
                        return 0;
                    }

                    return ((newMax - newMin) * (value - valueMin)) / (valueMax - valueMin) + newMin;
                };

                Utilities.linearInterpolate = function (x, x0, y0, x1, y1) {
                    if (x0.equals(x1)) {
                        return y0;
                    }

                    var xDelta = parseInt(DiagnosticsHub.BigNumber.subtract(x, x0).value);
                    var xRange = parseInt(DiagnosticsHub.BigNumber.subtract(x1, x0).value);
                    return y0 + (y1 - y0) * xDelta / xRange;
                };

                Utilities.convertToPixel = function (time, timeRange, pixelRange, validateInput) {
                    if (typeof validateInput === "undefined") { validateInput = true; }
                    if (validateInput && (timeRange.elapsed.equals(DiagnosticsHub.BigNumber.zero) || pixelRange <= 0)) {
                        return 0;
                    }

                    var sign = 1;
                    var timeFromRangeStart;

                    if (timeRange.begin.greater(time)) {
                        sign = -1;
                        timeFromRangeStart = parseInt(DiagnosticsHub.BigNumber.subtract(timeRange.begin, time).value);
                    } else {
                        timeFromRangeStart = parseInt(DiagnosticsHub.BigNumber.subtract(time, timeRange.begin).value);
                    }

                    return sign * (timeFromRangeStart / parseInt(timeRange.elapsed.value)) * pixelRange;
                };

                Utilities.getTimestampAtPixel = function (numPixelsFromLeft, pixelRange, timeRange) {
                    if (pixelRange > 0) {
                        return DiagnosticsHub.BigNumber.addNumber(timeRange.begin, (parseInt(timeRange.elapsed.value) / pixelRange) * numPixelsFromLeft);
                    }

                    return DiagnosticsHub.BigNumber.zero;
                };

                Utilities.translateNumPixelToDuration = function (pixels, pixelRange, timeRange) {
                    if (pixelRange > 0) {
                        return (parseInt(timeRange.elapsed.value) / pixelRange) * pixels;
                    }

                    return 0;
                };

                Utilities.formatNumber = function (value, decimalPlaces) {
                    var valueToFormat;
                    if (decimalPlaces === null || typeof (decimalPlaces) === "undefined") {
                        valueToFormat = value.toString();
                    } else {
                        valueToFormat = value.toFixed(decimalPlaces);
                    }

                    var numberFormat = Utilities.getNumberFormat();
                    return valueToFormat.replace(".", numberFormat.numberDecimalSeparator);
                };

                Utilities.formatString = function (stringToFormat) {
                    var values = [];
                    for (var _i = 0; _i < (arguments.length - 1); _i++) {
                        values[_i] = arguments[_i + 1];
                    }
                    var formatted = stringToFormat;
                    values.forEach(function (value, i) {
                        formatted = formatted.replace("{" + i + "}", value);
                    });

                    return formatted;
                };

                Utilities.getNumberFormat = function () {
                    var nf = Microsoft.Plugin.Culture.NumberFormat;
                    if (!nf || nf.length === 0) {
                        nf = { numberDecimalSeparator: "." };
                    }

                    return nf;
                };

                Utilities.containsPoint = function (boundingRect, x, y) {
                    return boundingRect.left <= x && boundingRect.right >= x && boundingRect.top <= y && boundingRect.bottom >= y;
                };

                Utilities.getSVGPlaceHolder = function (token) {
                    var svg = document.createElement("div");
                    svg.setAttribute("data-plugin-svg", token);
                    return svg;
                };

                Utilities.setCapture = function (element) {
                    if (!element) {
                        return;
                    }

                    try  {
                        if (element.setCapture) {
                            element.setCapture(true);
                            return;
                        }

                        if (element.msSetPointerCapture) {
                            element.msSetPointerCapture(Utilities.MousePointerId);
                            return;
                        }

                        if (element.setPointerCapture) {
                            element.setPointerCapture(Utilities.MousePointerId);
                            return;
                        }
                    } catch (e) {
                        DiagnosticsHub.getLogger().error(e.message);
                    }
                };

                Utilities.releaseCapture = function (element) {
                    if (!element) {
                        return;
                    }

                    try  {
                        if (element.releaseCapture) {
                            element.releaseCapture();
                            return;
                        }

                        if (element.msReleasePointerCapture) {
                            element.msReleasePointerCapture(Utilities.MousePointerId);
                            return;
                        }

                        if (element.releasePointerCapture) {
                            element.releasePointerCapture(Utilities.MousePointerId);
                            return;
                        }
                    } catch (e) {
                        DiagnosticsHub.getLogger().error(e.message);
                    }
                };
                Utilities.MousePointerId = 1;
                return Utilities;
            })();
            DiagnosticsHub.Utilities = Utilities;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (Common) {
                var ElementRecyclerFactory = (function () {
                    function ElementRecyclerFactory(container, elementCreator) {
                        this._container = container;
                        this._elementCreator = elementCreator;
                        this._index = null;

                        this._elements = [];
                        this._recycledElements = [];
                    }
                    ElementRecyclerFactory.forDivWithClass = function (container, className) {
                        return new ElementRecyclerFactory(container, function () {
                            var element = document.createElement("div");
                            element.className = className;
                            return element;
                        });
                    };

                    ElementRecyclerFactory.prototype.start = function () {
                        this._index = 0;
                    };

                    ElementRecyclerFactory.prototype.getNext = function () {
                        if (this._index === null) {
                            throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1035"));
                        }

                        var element = this._elements[this._index];
                        if (!element) {
                            if (this._recycledElements.length > 0) {
                                element = this._recycledElements.pop();
                            } else {
                                element = this._elementCreator();
                            }

                            this._elements.push(element);
                            this._container.appendChild(element);
                        }

                        this._index++;
                        return element;
                    };

                    ElementRecyclerFactory.prototype.stop = function () {
                        if (this._index === null) {
                            return;
                        }

                        for (var i = this._elements.length - 1; i >= this._index; --i) {
                            var element = this._elements.pop();
                            this._recycledElements.push(element);

                            if (this._container.children.length > 0 && element.parentElement) {
                                this._container.removeChild(element);
                            }
                        }

                        this._index = null;
                    };

                    ElementRecyclerFactory.prototype.recycleAll = function () {
                        for (var i = this._elements.length - 1; i >= 0; --i) {
                            var element = this._elements.pop();
                            this._recycledElements.push(element);

                            if (this._container.children.length > 0 && element.parentElement) {
                                this._container.removeChild(element);
                            }
                        }
                    };

                    ElementRecyclerFactory.prototype.removeAll = function () {
                        for (var i = this._elements.length - 1; i >= 0; --i) {
                            var element = this._elements.pop();

                            if (this._container.children.length > 0 && element.parentElement) {
                                this._container.removeChild(element);
                            }
                        }

                        this._elements = [];
                        this._recycledElements = [];
                    };
                    return ElementRecyclerFactory;
                })();
                Common.ElementRecyclerFactory = ElementRecyclerFactory;
            })(DiagnosticsHub.Common || (DiagnosticsHub.Common = {}));
            var Common = DiagnosticsHub.Common;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var MarkData = (function () {
                function MarkData(time, tooltip) {
                    this.time = time;
                    this.tooltip = tooltip;
                }
                return MarkData;
            })();
            DiagnosticsHub.MarkData = MarkData;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var RulerScale = (function () {
                function RulerScale(timeRange, markSeries, imageTokenList, aggregatedMarkImageToken, showZero) {
                    if (typeof showZero === "undefined") { showZero = false; }
                    var _this = this;
                    this._clientWidth = 0;
                    this._clientHeight = 0;
                    this._rulerMarksImageWidth = 9;
                    this._minimumMarkDistance = 7;
                    this._timeRange = timeRange;
                    this._container = document.createElement("div");
                    this._container.classList.add("ruler-scale-main");
                    this._container.classList.add("fullsizeOverlay");

                    this._seriesList = markSeries;
                    this._imageTokenList = imageTokenList;
                    this._aggregatedMarkImageToken = aggregatedMarkImageToken;
                    this._showZero = showZero;
                    this._rulerMarks = [];

                    this._canvas = document.createElement("canvas");
                    this._canvas.classList.add("fullsizeOverlay");
                    this._context = this._canvas.getContext("2d");
                    this._context.lineWidth = 1;
                    this._strokeStyle = Microsoft.Plugin.Theme.getValue("diagnostics-host-ruler-tickmark");
                    this._fontSize = Microsoft.Plugin.Theme.getValue("plugin-font-size");
                    this._fontColor = Microsoft.Plugin.Theme.getValue("plugin-color");
                    this._fontFamily = Microsoft.Plugin.Theme.getValue("plugin-font-family");
                    this._container.appendChild(this._canvas);

                    this._scaleMarksDiv = document.createElement("div");
                    this._scaleMarksDiv.id = "scaleMarks";
                    this._scaleMarksDiv.classList.add("fullsizeOverlay");
                    this._scaleMarksDiv.tabIndex = 0;
                    this._scaleMarksDiv.onkeydown = function (event) {
                        return _this.onKeyDown(event);
                    };
                    this._scaleMarksDiv.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerMarkNavigation"));
                    this._container.appendChild(this._scaleMarksDiv);

                    this._scaleMarkElementsFactory = new DiagnosticsHub.Common.ElementRecyclerFactory(this._scaleMarksDiv, function () {
                        return _this.createMarkVisual("ruler-scale-mark-image-event");
                    });

                    this._onThemeChangedBoundFunction = this.onThemeChanged.bind(this);
                    Microsoft.Plugin.Theme.addEventListener("themechanged", this._onThemeChangedBoundFunction);

                    this.renderTickMarks();
                    this.renderMarks(true);
                }
                Object.defineProperty(RulerScale.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                RulerScale.prototype.dispose = function () {
                    Microsoft.Plugin.Theme.removeEventListener("themechanged", this._onThemeChangedBoundFunction);
                    this._scaleMarkElementsFactory.recycleAll();
                    this._scaleMarkElementsFactory.removeAll();
                };

                RulerScale.prototype.resize = function (evt) {
                    var width = this._container.clientWidth;

                    if (this._clientWidth === width) {
                        return;
                    }

                    this._clientWidth = width;
                    this._clientHeight = this._container.clientHeight;

                    this._canvas.width = this._clientWidth;
                    this._canvas.height = this._clientHeight;

                    this.renderTickMarks();
                    this.renderMarks(true);
                };

                RulerScale.prototype.onViewportChanged = function (viewportArgs) {
                    if (this._timeRange.equals(viewportArgs.currentTimespan)) {
                        return;
                    }

                    this._timeRange = viewportArgs.currentTimespan;
                    this.renderTickMarks();
                    this.renderMarks(true);
                };

                RulerScale.prototype.addMark = function (id, markData, shouldRender) {
                    if (typeof shouldRender === "undefined") { shouldRender = true; }
                    if (this._seriesList && markData && markData.time) {
                        for (var j = 0; j < this._seriesList.length; j++) {
                            if (this._seriesList[j].id === id) {
                                var series = this._seriesList[j];
                                if (!series.data) {
                                    series.data = [];
                                }

                                series.data.push(markData);
                                this.createAggregatedMark(markData, series.id - 1);
                                break;
                            }
                        }

                        this._rulerMarks.sort(function (a, b) {
                            return a.time.compareTo(b.time);
                        });

                        if (shouldRender || this._timeRange.contains(markData.time)) {
                            this.renderMarks(false);
                        }
                    }
                };

                RulerScale.prototype.onThemeChanged = function () {
                    this._strokeStyle = Microsoft.Plugin.Theme.getValue("diagnostics-host-ruler-tickmark");
                    this._fontSize = Microsoft.Plugin.Theme.getValue("plugin-font-size");
                    this._fontColor = Microsoft.Plugin.Theme.getValue("plugin-color");
                    this._fontFamily = Microsoft.Plugin.Theme.getValue("plugin-font-family");
                    this.renderTickMarks();
                    this.renderMarks(true);
                };

                RulerScale.prototype.renderTickMarks = function () {
                    var _this = this;
                    if (this._timeRange.elapsed.equals(DiagnosticsHub.BigNumber.zero)) {
                        return;
                    }

                    this._context.clearRect(0, 0, this._clientWidth, this._clientHeight);
                    this._context.strokeStyle = this._strokeStyle;
                    this._context.fillStyle = this._fontColor;
                    this._context.font = this._fontSize + " " + this._fontFamily;
                    this._context.textBaseline = "hanging";

                    var bigHeight = this._clientHeight;
                    var mediumHeight = this._clientHeight * .4;
                    var smallHeight = this._clientHeight * .2;

                    DiagnosticsHub.RulerUtilities.getTickMarksPosition(this._timeRange, this._clientWidth, this._showZero).forEach(function (tick) {
                        var position = DiagnosticsHub.Utilities.convertToPixel(tick.value, _this._timeRange, _this._clientWidth, false);
                        var height = 0;

                        switch (tick.type) {
                            case 0 /* Big */:
                                _this._context.fillText(DiagnosticsHub.RulerUtilities.formatTime(tick.value), position + 2.5, 0);
                                height = bigHeight;
                                break;
                            case 1 /* Medium */:
                                height = mediumHeight;
                                break;
                            case 2 /* Small */:
                                height = smallHeight;
                                break;
                        }

                        _this._context.beginPath();
                        _this._context.moveTo(position + .5, _this._clientHeight);
                        _this._context.lineTo(position + .5, _this._clientHeight - height);
                        _this._context.stroke();
                    });
                };

                RulerScale.prototype.renderMarks = function (fullRender) {
                    var _this = this;
                    if (fullRender) {
                        this.createAggregateMarkList();
                    }

                    if (!this._rulerMarks) {
                        return;
                    }

                    this._scaleMarkElementsFactory.start();

                    this._rulerMarks.forEach(function (mark) {
                        if (mark.time && _this._timeRange.contains(mark.time)) {
                            var markDiv = _this._scaleMarkElementsFactory.getNext();
                            if (mark.glyphIndex === null || typeof mark.glyphIndex === "undefined" || mark.glyphIndex === -1 || !_this._imageTokenList[mark.glyphIndex]) {
                                markDiv.style.backgroundImage = "url(" + Microsoft.Plugin.Theme.getValue(_this._aggregatedMarkImageToken) + ")";
                            } else {
                                markDiv.style.backgroundImage = "url(" + Microsoft.Plugin.Theme.getValue(_this._imageTokenList[mark.glyphIndex]) + ")";
                            }

                            markDiv.style.left = mark.pixelPosition + "px";
                            markDiv.onmouseover = function () {
                                return _this.showMarkTooltip(mark);
                            };
                            markDiv.onmouseout = Microsoft.Plugin.Tooltip.dismiss;
                            markDiv.onfocus = function () {
                                markDiv.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerMarkLabel", mark.getAriaContent()));
                            };
                        }
                    });

                    this._scaleMarkElementsFactory.stop();
                };

                RulerScale.prototype.createAggregateMarkList = function () {
                    var _this = this;
                    this._rulerMarks = [];

                    if (!this._seriesList) {
                        return;
                    }

                    this._seriesList.forEach(function (series) {
                        if (series.data) {
                            series.data.forEach(function (dataPoint) {
                                if (_this._timeRange.contains(dataPoint.time)) {
                                    _this.createAggregatedMark(dataPoint, series.id - 1);
                                }
                            });
                        }
                    });

                    this._rulerMarks.sort(function (a, b) {
                        return a.time.compareTo(b.time);
                    });
                };

                RulerScale.prototype.createAggregatedMark = function (mark, markGlyphIndex) {
                    var markPosition = DiagnosticsHub.Utilities.convertToPixel(mark.time, this._timeRange, this._clientWidth) - (this._rulerMarksImageWidth / 2);

                    var isNewAggregatedMark = true;

                    for (var markIndex = 0; markIndex < this._rulerMarks.length; ++markIndex) {
                        var currentAggregatedMark = this._rulerMarks[markIndex];

                        if (Math.abs(currentAggregatedMark.pixelPosition - markPosition) <= this._minimumMarkDistance) {
                            currentAggregatedMark.push(mark);

                            if (currentAggregatedMark.glyphIndex !== markGlyphIndex) {
                                currentAggregatedMark.glyphIndex = (currentAggregatedMark.glyphIndex === 0 || currentAggregatedMark.glyphIndex === 1) && (markGlyphIndex === 0 || markGlyphIndex === 1) ? 0 : -1;
                            }

                            isNewAggregatedMark = false;
                            break;
                        }
                    }

                    if (isNewAggregatedMark) {
                        var newAggregatedMark = new DiagnosticsHub.AggregatedMarkData();
                        newAggregatedMark.push(mark);
                        newAggregatedMark.glyphIndex = markGlyphIndex;
                        newAggregatedMark.pixelPosition = markPosition;
                        this._rulerMarks.push(newAggregatedMark);
                    }
                };

                RulerScale.prototype.showMarkTooltip = function (mark) {
                    var toolTipContent = mark.getTooltipContent();
                    if (toolTipContent) {
                        Microsoft.Plugin.Tooltip.show({
                            content: toolTipContent
                        });
                    }
                };

                RulerScale.prototype.createMarkVisual = function (className) {
                    var markDiv = document.createElement("div");
                    markDiv.classList.add(className);
                    markDiv.classList.add("ruler-scale-mark-image-position");
                    return markDiv;
                };

                RulerScale.prototype.onKeyDown = function (event) {
                    if (this._scaleMarksDiv.children.length === 0 || (event.keyCode !== 9 /* Tab */ && event.keyCode !== 39 /* ArrowRight */ && event.keyCode !== 37 /* ArrowLeft */)) {
                        return;
                    }

                    if (event.keyCode === 9 /* Tab */) {
                        if (this._focusedMark) {
                            this._focusedMark.blur();
                            this._focusedMark.tabIndex = -1;
                            this._focusedMark = null;

                            this._container.focus();
                        }

                        return;
                    }

                    var element = event.currentTarget;

                    var sibling;
                    if (!this._focusedMark) {
                        if (event.keyCode === 39 /* ArrowRight */) {
                            sibling = element.firstElementChild;
                        } else if (event.keyCode === 37 /* ArrowLeft */) {
                            sibling = element.lastElementChild;
                        }
                    } else {
                        this._focusedMark.tabIndex = -1;
                        if (event.keyCode === 39 /* ArrowRight */) {
                            sibling = this._focusedMark.nextElementSibling || element.firstElementChild;
                        } else if (event.keyCode === 37 /* ArrowLeft */) {
                            sibling = this._focusedMark.previousElementSibling || element.lastElementChild;
                        }
                    }

                    if (!sibling) {
                        return;
                    }

                    this._focusedMark = sibling;
                    sibling.tabIndex = 0;
                    sibling.focus();
                };
                return RulerScale;
            })();
            DiagnosticsHub.RulerScale = RulerScale;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var DoubleSlider = (function (_super) {
                __extends(DoubleSlider, _super);
                function DoubleSlider(timerange, decoratedControl) {
                    _super.call(this, decoratedControl);

                    this._container = document.createElement("div");
                    this._container.classList.add("ruler-doubleSlider");
                    this._container.classList.add("fullsizeOverlay");

                    this._currentTimeRange = timerange;
                    this._selectionTimeRange = this._currentTimeRange;

                    this._viewEventManager = Microsoft.VisualStudio.DiagnosticsHub.getViewEventManager();
                    this._telemetry = new DiagnosticsHub.Telemetry.ViewportController();

                    this._container.onmousedown = this.onStartSelection.bind(this);
                    this._container.onmousemove = this.onDragSelection.bind(this);
                    this._container.onmouseup = this.onStopSelection.bind(this);

                    this._lSlider = document.createElement("div");
                    this._lSlider.className = "ruler-slider";
                    this._lSlider.style.width = DoubleSlider.SliderWidth + "px";
                    this._lSlider.tabIndex = 0;
                    this._lSlider.setAttribute("role", "slider");
                    this._lSlider.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerLeftSliderAriaLabel"));
                    this._container.appendChild(this._lSlider);

                    this._lSlider.onmousedown = this.onStartSelection.bind(this);
                    this._lSlider.onkeydown = this.onKeyDown.bind(this);
                    this._lSlider.onkeyup = this.onKeyUp.bind(this);
                    this._lSlider.onfocus = this.sliderFocus.bind(this);

                    this._lUnselectedRegion = document.createElement("div");
                    this._lUnselectedRegion.className = "ruler-unselected";
                    this._container.appendChild(this._lUnselectedRegion);

                    this._container.appendChild(decoratedControl.container);

                    this._rSlider = document.createElement("div");
                    this._rSlider.className = "ruler-slider";
                    this._rSlider.style.width = DoubleSlider.SliderWidth + "px";
                    this._rSlider.tabIndex = 0;
                    this._rSlider.setAttribute("role", "slider");
                    this._rSlider.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerRightSliderAriaLabel"));
                    this._container.appendChild(this._rSlider);

                    this._rSlider.onmousedown = this.onStartSelection.bind(this);
                    this._rSlider.onkeydown = this.onKeyDown.bind(this);
                    this._rSlider.onkeyup = this.onKeyUp.bind(this);
                    this._rSlider.onfocus = this.sliderFocus.bind(this);

                    this._rUnselectedRegion = document.createElement("div");
                    this._rUnselectedRegion.className = "ruler-unselected";
                    this._container.appendChild(this._rUnselectedRegion);

                    this.updateAriaLabels();
                }
                Object.defineProperty(DoubleSlider.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                DoubleSlider.prototype.onViewportChanged = function (viewportArgs) {
                    this._currentTimeRange = viewportArgs.currentTimespan;
                    this._selectionTimeRange = viewportArgs.selectionTimespan;

                    this.setSliderHandlePosition(viewportArgs.selectionTimespan || viewportArgs.currentTimespan);
                    this.updateAriaLabels();
                    _super.prototype.onViewportChanged.call(this, viewportArgs);
                };

                DoubleSlider.prototype.resize = function (evt) {
                    var width = this._container.clientWidth;
                    if (width === this._clientWidth) {
                        return;
                    }

                    this._clientWidth = width;

                    this.setSliderHandlePosition(this._selectionTimeRange || this._currentTimeRange);
                    _super.prototype.resize.call(this, evt);
                };

                DoubleSlider.prototype.setSliderHandlePosition = function (position) {
                    var lSliderLeft = DiagnosticsHub.Utilities.convertToPixel(position.begin, this._currentTimeRange, this._clientWidth);
                    var rSliderLeft = DiagnosticsHub.Utilities.convertToPixel(position.end, this._currentTimeRange, this._clientWidth);

                    this._lSlider.style.visibility = lSliderLeft < 0 || lSliderLeft > (this._clientWidth - DoubleSlider.SliderWidth) ? "hidden" : "visible";
                    this._lSlider.style.left = (lSliderLeft - DoubleSlider.SliderWidth) + "px";
                    this._lUnselectedRegion.style.width = lSliderLeft > this._clientWidth ? this._clientWidth + "px" : Math.max(lSliderLeft, 0) + "px";

                    this._rSlider.style.visibility = rSliderLeft < 0 || rSliderLeft > this._clientWidth ? "hidden" : "visible";
                    this._rSlider.style.left = rSliderLeft + "px";

                    var rightRegionWidth = this._clientWidth - rSliderLeft;
                    this._rUnselectedRegion.style.width = rightRegionWidth > this._clientWidth ? this._clientWidth + "px" : Math.max(this._clientWidth - rSliderLeft, 0) + "px";
                    this._rUnselectedRegion.style.left = rightRegionWidth > this._clientWidth ? "0px" : rSliderLeft + "px";
                };

                DoubleSlider.prototype.sliderFocus = function (event) {
                    var selection = this._selectionTimeRange || this._currentTimeRange;

                    if (event.currentTarget === this._lSlider && !this._currentTimeRange.contains(selection.begin)) {
                        var sliderWidthTime = (parseInt(this._currentTimeRange.elapsed.value) / this._clientWidth) * (DoubleSlider.SliderWidth + 1);
                        var position = DiagnosticsHub.BigNumber.subtractNumber(selection.begin, sliderWidthTime);

                        this._viewEventManager.changeViewport.raiseEvent(new DiagnosticsHub.JsonTimespan(position, DiagnosticsHub.BigNumber.add(position, this._currentTimeRange.elapsed)));
                    } else if (event.currentTarget === this._rSlider && !this._currentTimeRange.contains(selection.end)) {
                        var sliderWidthTime = (parseInt(this._currentTimeRange.elapsed.value) / this._clientWidth) * (DoubleSlider.SliderWidth + 1);
                        var position = DiagnosticsHub.BigNumber.subtract(selection.end, this._currentTimeRange.elapsed);
                        position = DiagnosticsHub.BigNumber.addNumber(position, sliderWidthTime);

                        this._viewEventManager.changeViewport.raiseEvent(new DiagnosticsHub.JsonTimespan(position, DiagnosticsHub.BigNumber.add(position, this._currentTimeRange.elapsed)));
                    }
                };

                DoubleSlider.prototype.onKeyDown = function (e) {
                    if (this.handleKeyEvent(e) && !this._animationFrameHandle) {
                        this._animationFrameHandle = window.requestAnimationFrame(this.onSelectionAnimation.bind(this));
                    }
                };

                DoubleSlider.prototype.onKeyUp = function (e) {
                    if (!this.handleKeyEvent(e)) {
                        return;
                    }

                    window.cancelAnimationFrame(this._animationFrameHandle);
                    this._animationFrameHandle = null;

                    this.raiseSelectionTimeRangeChangedEvent(this._selectionTimeRange, false);

                    var isMinSelection = DiagnosticsHub.Utilities.getTimestampAtPixel(DiagnosticsHub.SwimlaneViewConstants.MinSelectionInPixels, this._clientWidth, this._currentTimeRange).greaterOrEqual(this._selectionTimeRange.elapsed);
                    this._telemetry.selectionChanged(1 /* DoubleSlider */, isMinSelection);
                };

                DoubleSlider.prototype.handleKeyEvent = function (e) {
                    if (e.keyCode !== 37 /* ArrowLeft */ && e.keyCode !== 39 /* ArrowRight */) {
                        return false;
                    }

                    this._selectionTimeRange = this._selectionTimeRange || this._currentTimeRange;

                    var keyStep = DiagnosticsHub.BigNumber.subtract(DiagnosticsHub.Utilities.getTimestampAtPixel(1, this._clientWidth, this._currentTimeRange), this._currentTimeRange.begin);

                    var leftHandleTime = this._selectionTimeRange.begin;
                    var rightHandleTime = this._selectionTimeRange.end;

                    if (e.keyCode === 37 /* ArrowLeft */) {
                        if (e.srcElement === this._lSlider) {
                            leftHandleTime = DiagnosticsHub.BigNumber.subtract(leftHandleTime, keyStep);
                            leftHandleTime = DiagnosticsHub.BigNumber.max(leftHandleTime, this._currentTimeRange.begin);
                        } else if (e.srcElement === this._rSlider) {
                            rightHandleTime = DiagnosticsHub.BigNumber.subtract(rightHandleTime, keyStep);
                            rightHandleTime = DiagnosticsHub.BigNumber.max(leftHandleTime, rightHandleTime);
                        }
                    }

                    if (e.keyCode === 39 /* ArrowRight */) {
                        if (e.srcElement === this._lSlider) {
                            leftHandleTime = DiagnosticsHub.BigNumber.add(leftHandleTime, keyStep);
                            leftHandleTime = DiagnosticsHub.BigNumber.min(leftHandleTime, rightHandleTime);
                        } else if (e.srcElement === this._rSlider) {
                            rightHandleTime = DiagnosticsHub.BigNumber.add(rightHandleTime, keyStep);
                            rightHandleTime = DiagnosticsHub.BigNumber.min(rightHandleTime, this._currentTimeRange.end);
                        }
                    }

                    this._selectionTimeRange = new DiagnosticsHub.JsonTimespan(leftHandleTime, rightHandleTime);
                    return true;
                };

                DoubleSlider.prototype.onStartSelection = function (event) {
                    if (event.which !== 1 /* Left */) {
                        return;
                    }

                    this._selectionTimeRange = this._selectionTimeRange || this._currentTimeRange;

                    if (event.target === this._lSlider) {
                        this._selectionTimeAnchor = this._selectionTimeRange.end;
                    } else if (event.target === this._rSlider) {
                        this._selectionTimeAnchor = this._selectionTimeRange.begin;
                    } else {
                        this._selectionTimeAnchor = DiagnosticsHub.Utilities.getTimestampAtPixel(event.offsetX, this._clientWidth, this._currentTimeRange);
                        this._selectionTimeRange = new DiagnosticsHub.JsonTimespan(this._selectionTimeAnchor, DiagnosticsHub.BigNumber.addNumber(this._selectionTimeAnchor, DiagnosticsHub.Utilities.translateNumPixelToDuration(DiagnosticsHub.SwimlaneViewConstants.MinSelectionInPixels, this._clientWidth, this._currentTimeRange)));
                    }

                    DiagnosticsHub.Utilities.setCapture(this._container);

                    if (this._animationFrameHandle) {
                        window.cancelAnimationFrame(this._animationFrameHandle);
                    }

                    this._animationFrameHandle = window.requestAnimationFrame(this.onSelectionAnimation.bind(this));
                    event.stopPropagation();
                };

                DoubleSlider.prototype.onDragSelection = function (event) {
                    if (event.target !== this._lSlider && event.target !== this._rSlider && event.target !== this._container) {
                        return;
                    } else if (event.which !== 1 /* Left */) {
                        return;
                    } else if (!this._animationFrameHandle) {
                        return;
                    }

                    var xPixels = Math.max(event.offsetX, 0);
                    xPixels = Math.min(this._clientWidth, xPixels);
                    var xTime = DiagnosticsHub.Utilities.getTimestampAtPixel(xPixels, this._clientWidth, this._currentTimeRange);

                    if (this._selectionTimeAnchor.greater(xTime)) {
                        this._selectionTimeRange = new DiagnosticsHub.JsonTimespan(xTime, this._selectionTimeAnchor);
                    } else {
                        this._selectionTimeRange = new DiagnosticsHub.JsonTimespan(this._selectionTimeAnchor, xTime);
                    }

                    event.stopPropagation();
                };

                DoubleSlider.prototype.onStopSelection = function (event) {
                    if (event.which !== 1 /* Left */ || !this._lSlider || !this._rSlider) {
                        return;
                    }

                    DiagnosticsHub.Utilities.releaseCapture(this._container);

                    window.cancelAnimationFrame(this._animationFrameHandle);
                    this._animationFrameHandle = null;

                    this._lSlider.blur();
                    this._rSlider.blur();
                    if (DiagnosticsHub.Utilities.containsPoint(this._lSlider.getBoundingClientRect(), event.clientX, event.clientY)) {
                        this._lSlider.focus();
                    } else if (DiagnosticsHub.Utilities.containsPoint(this._rSlider.getBoundingClientRect(), event.clientX, event.clientY)) {
                        this._rSlider.focus();
                    }

                    this.raiseSelectionTimeRangeChangedEvent(this._selectionTimeRange, false);

                    var isMinSelection = DiagnosticsHub.Utilities.getTimestampAtPixel(DiagnosticsHub.SwimlaneViewConstants.MinSelectionInPixels, this._clientWidth, this._currentTimeRange).greaterOrEqual(this._selectionTimeRange.elapsed);
                    this._telemetry.selectionChanged(1 /* DoubleSlider */, isMinSelection);
                    event.stopPropagation();
                };

                DoubleSlider.prototype.onSelectionAnimation = function () {
                    this._animationFrameHandle = window.requestAnimationFrame(this.onSelectionAnimation.bind(this));
                    this.raiseSelectionTimeRangeChangedEvent(this._selectionTimeRange, true);
                };

                DoubleSlider.prototype.raiseSelectionTimeRangeChangedEvent = function (position, isIntermittent) {
                    if (typeof isIntermittent === "undefined") { isIntermittent = false; }
                    this._viewEventManager.selectionChanged.raiseEvent({
                        position: position,
                        isIntermittent: isIntermittent
                    });
                };

                DoubleSlider.prototype.updateAriaLabels = function () {
                    var currentTimeBeginFullName = DiagnosticsHub.RulerUtilities.formatTime(this._currentTimeRange.begin, 1 /* fullName */);
                    var currentTimeEndFullName = DiagnosticsHub.RulerUtilities.formatTime(this._currentTimeRange.end, 1 /* fullName */);

                    if (this._selectionTimeRange) {
                        var selectionTimeBegin = DiagnosticsHub.RulerUtilities.formatTime(this._selectionTimeRange.begin);
                        var selectionTimeEnd = DiagnosticsHub.RulerUtilities.formatTime(this._selectionTimeRange.end);
                        var currentTimeBegin = DiagnosticsHub.RulerUtilities.formatTime(this._currentTimeRange.begin);
                        var currentTimeEnd = DiagnosticsHub.RulerUtilities.formatTime(this._currentTimeRange.end);

                        var selectionTimeBeginFullName = DiagnosticsHub.RulerUtilities.formatTime(this._selectionTimeRange.begin, 1 /* fullName */);
                        var selectionTimeEndFullName = DiagnosticsHub.RulerUtilities.formatTime(this._selectionTimeRange.end, 1 /* fullName */);

                        var lSliderLabel = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerSliderAriaValueText", selectionTimeBeginFullName, currentTimeBeginFullName, selectionTimeEndFullName);
                        this._lSlider.setAttribute("aria-valuetext", lSliderLabel);
                        this._lSlider.setAttribute("aria-valuenow", selectionTimeBegin);
                        this._lSlider.setAttribute("aria-valuemin", currentTimeBegin);
                        this._lSlider.setAttribute("aria-valuemax", selectionTimeEnd);

                        var rSliderLabel = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerSliderAriaValueText", selectionTimeEndFullName, selectionTimeBeginFullName, currentTimeEndFullName);
                        this._rSlider.setAttribute("aria-valuetext", rSliderLabel);
                        this._rSlider.setAttribute("aria-valuenow", selectionTimeEnd);
                        this._rSlider.setAttribute("aria-valuemin", selectionTimeBegin);
                        this._rSlider.setAttribute("aria-valuemax", currentTimeEnd);
                    }
                };
                DoubleSlider.SliderWidth = 5;
                return DoubleSlider;
            })(DiagnosticsHub.ControlDecorator);
            DiagnosticsHub.DoubleSlider = DoubleSlider;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var RulerLegend = (function () {
                function RulerLegend(legendItems) {
                    var _this = this;
                    this._colorDivs = [];
                    this._container = document.createElement("div");
                    this._container.id = "rulerLegendContainer";
                    this._container.className = "ruler-legend-container";

                    this._onThemeChangedBoundFunction = this.onThemeChange.bind(this);
                    Microsoft.Plugin.Theme.addEventListener("themechanged", this._onThemeChangedBoundFunction);

                    legendItems.forEach(function (legendItemData) {
                        var colorDiv = document.createElement("div");
                        colorDiv.className = "ruler-label-mark-image";
                        colorDiv.setAttribute("data-imageToken", legendItemData.imageToken);
                        colorDiv.style.backgroundImage = "url(" + Microsoft.Plugin.Theme.getValue(legendItemData.imageToken) + ")";
                        _this._colorDivs.push(colorDiv);

                        var legendTextDiv = document.createElement("div");
                        legendTextDiv.className = "ruler-legend-text-div";
                        legendTextDiv.innerHTML = legendItemData.text;

                        var individualLegendBox = document.createElement("div");
                        individualLegendBox.className = "ruler-legend-div";
                        individualLegendBox.appendChild(colorDiv);
                        individualLegendBox.appendChild(legendTextDiv);

                        if (legendItemData.tooltip) {
                            individualLegendBox.setAttribute("data-plugin-vs-tooltip", legendItemData.tooltip);
                        }

                        _this._container.appendChild(individualLegendBox);
                    });
                }
                Object.defineProperty(RulerLegend.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                RulerLegend.prototype.dispose = function () {
                    Microsoft.Plugin.Theme.removeEventListener("themechanged", this._onThemeChangedBoundFunction);
                };

                RulerLegend.prototype.onThemeChange = function () {
                    this._colorDivs.forEach(function (colorDiv) {
                        var imageToken = colorDiv.getAttribute("data-imageToken");
                        colorDiv.style.backgroundImage = "url(" + Microsoft.Plugin.Theme.getValue(imageToken) + ")";
                    });
                };
                return RulerLegend;
            })();
            DiagnosticsHub.RulerLegend = RulerLegend;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var RulerUtilities = (function () {
                function RulerUtilities() {
                }
                RulerUtilities.getUniqueId = function () {
                    return RulerUtilities.Counter++;
                };

                RulerUtilities.getTickMarksPosition = function (timeRange, width, showZero) {
                    if (typeof showZero === "undefined") { showZero = false; }
                    var range = timeRange.elapsed;
                    var rangeNum = parseInt(range.value);
                    var begin = timeRange.begin;

                    var tickMarkList = [];

                    var intervalDuration = Math.pow(10, Math.floor(Math.log(rangeNum) / Math.LN10));

                    var intervalWidth = (width / rangeNum) * intervalDuration;

                    if (intervalWidth < 100) {
                        if (intervalWidth < 25) {
                            intervalDuration *= 8;
                        } else if (intervalWidth < 50) {
                            intervalDuration *= 4;
                        } else if (intervalWidth < 100) {
                            intervalDuration *= 2;
                        }
                    } else if (intervalWidth > 250) {
                        if (intervalWidth < 400) {
                            intervalDuration /= 2;
                        } else if (intervalWidth < 800) {
                            intervalDuration /= 4;
                        } else if (intervalWidth < 1600) {
                            intervalDuration /= 8;
                        } else {
                            intervalDuration /= 10;
                        }
                    }

                    if (intervalDuration > 0) {
                        var smallTickDuration = intervalDuration / 10;
                        var mediumTickDuration = intervalDuration / 2;
                        intervalWidth = (width / rangeNum) * intervalDuration;
                        if (intervalWidth < 130) {
                            smallTickDuration = intervalDuration / 5;
                        }

                        tickMarkList = RulerUtilities.generateTickMarks(timeRange, DiagnosticsHub.BigNumber.subtract(begin, DiagnosticsHub.BigNumber.moduloNumber(begin, intervalDuration)), DiagnosticsHub.BigNumber.convertFromNumber(intervalDuration), DiagnosticsHub.BigNumber.convertFromNumber(mediumTickDuration), DiagnosticsHub.BigNumber.convertFromNumber(smallTickDuration), showZero);
                    }

                    return tickMarkList;
                };

                RulerUtilities.getVerticalLinePositions = function (timeRange, width) {
                    var positions = [];
                    var marks = RulerUtilities.getTickMarksPosition(timeRange, width);

                    for (var i = 0; i < marks.length; ++i) {
                        var mark = marks[i];

                        if (mark.type === 0 /* Big */) {
                            var position = parseInt(DiagnosticsHub.BigNumber.subtract(mark.value, timeRange.begin).value) / parseInt(timeRange.elapsed.value) * 100;

                            positions.push(position);
                        }
                    }

                    return positions;
                };

                RulerUtilities.formatTime = function (value, unitFormat) {
                    if (typeof unitFormat === "undefined") { unitFormat = 0 /* italicizedAbbreviations */; }
                    var time = "0";
                    var nf = DiagnosticsHub.Utilities.getNumberFormat();

                    if (value.greaterOrEqual(DiagnosticsHub.BigNumber.convertFromNumber(RulerUtilities.OneSecond - RulerUtilities.NanosecondsSignificanceThreshold))) {
                        var splitTime = RulerUtilities.getSplittedTime(value, (RulerUtilities.OneMillisecond / 2));
                        var hasMinutes = parseInt(splitTime.minString) ? true : false;
                        var hasSeconds = parseInt(splitTime.secString) ? true : false;
                        var hasMillis = parseInt(splitTime.msString) ? true : false;

                        time = hasMinutes ? (splitTime.minString + ":") : "";
                        time += hasSeconds ? splitTime.secString : (hasMinutes ? "00" : "0");

                        if (hasMillis) {
                            time += nf.numberDecimalSeparator + this.removeTrailingZeros(splitTime.msString);
                        }
                    } else {
                        var splitTime = RulerUtilities.getSplittedTime(value);
                        var hasMillis = parseInt(splitTime.msString) ? true : false;
                        var hasNanos = parseInt(splitTime.nsString) ? true : false;

                        time = hasMillis ? splitTime.msString : "0";
                        if (hasNanos) {
                            time += nf.numberDecimalSeparator + this.removeTrailingZeros(splitTime.nsString);
                        }
                    }

                    var unit = RulerUtilities.getUnit(parseInt(value.value), unitFormat);
                    return time + unit;
                };

                RulerUtilities.formatTitleTime = function (value, unitFormat, isLive, truncateNs) {
                    if (typeof unitFormat === "undefined") { unitFormat = 1 /* fullName */; }
                    if (typeof isLive === "undefined") { isLive = false; }
                    if (typeof truncateNs === "undefined") { truncateNs = false; }
                    var threshold = truncateNs ? RulerUtilities.OneMillisecond : RulerUtilities.NanosecondsSignificanceThreshold;
                    var splitTime = RulerUtilities.getSplittedTime(value, threshold);
                    var time = "0";
                    var nf = DiagnosticsHub.Utilities.getNumberFormat();

                    var hasMinutes = parseInt(splitTime.minString) ? true : false;
                    var hasSeconds = parseInt(splitTime.secString) ? true : false;
                    var hasMillis = isLive ? false : (parseInt(splitTime.msString) ? true : false);
                    var hasNanos = isLive ? false : (parseInt(splitTime.nsString) ? true : false);

                    if (hasMinutes) {
                        var secondsPart = hasSeconds ? splitTime.secString : "00";
                        time = splitTime.minString + ":" + secondsPart;
                    } else if (hasSeconds) {
                        time = splitTime.secString;
                        if (hasMillis) {
                            time += nf.numberDecimalSeparator + this.removeTrailingZeros(splitTime.msString);
                        }
                    } else if (hasMillis || hasNanos) {
                        time = hasMillis ? splitTime.msString : hasNanos ? "0" : "";
                        if (hasNanos) {
                            time += nf.numberDecimalSeparator + this.removeTrailingZeros(splitTime.nsString);
                        }
                    }

                    return time;
                };

                RulerUtilities.formatSelectionTime = function (value, unitFormat, truncateNs) {
                    if (typeof unitFormat === "undefined") { unitFormat = 1 /* fullName */; }
                    if (typeof truncateNs === "undefined") { truncateNs = false; }
                    var time = RulerUtilities.formatTitleTime(value, unitFormat, false, truncateNs);
                    var unit = RulerUtilities.getUnit(parseInt(value.value), unitFormat);
                    return Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerTimeSelected", time, unit);
                };

                RulerUtilities.formatTotalTime = function (value, unitFormat, isLive) {
                    if (typeof unitFormat === "undefined") { unitFormat = 1 /* fullName */; }
                    if (typeof isLive === "undefined") { isLive = false; }
                    var time = RulerUtilities.formatTitleTime(value, unitFormat, isLive);
                    var unit = RulerUtilities.getUnit(parseInt(value.value), unitFormat, isLive);
                    return time + unit;
                };

                RulerUtilities.generateTickMarks = function (timeRange, start, bigTick, mediumTick, step, showZero) {
                    var tickMarkList = [];
                    var beginNsec = timeRange.begin;
                    var endNsec = timeRange.end;

                    if (showZero) {
                        tickMarkList.push({ type: 0 /* Big */, value: new DiagnosticsHub.BigNumber(0, 0), label: "0" });
                    }

                    if (step.equals(DiagnosticsHub.BigNumber.zero)) {
                        step = new DiagnosticsHub.BigNumber(0, 1);
                    }

                    for (var i = start; endNsec.greater(i); i = DiagnosticsHub.BigNumber.add(i, step)) {
                        if (i.greater(beginNsec)) {
                            var tickMarkTime = i;
                            if (DiagnosticsHub.BigNumber.modulo(i, bigTick).equals(DiagnosticsHub.BigNumber.zero)) {
                                tickMarkList.push({ type: 0 /* Big */, value: tickMarkTime });
                            } else if (DiagnosticsHub.BigNumber.modulo(i, mediumTick).equals(DiagnosticsHub.BigNumber.zero)) {
                                tickMarkList.push({ type: 1 /* Medium */, value: tickMarkTime });
                            } else {
                                tickMarkList.push({ type: 2 /* Small */, value: tickMarkTime });
                            }
                        }
                    }

                    return tickMarkList;
                };

                RulerUtilities.getUnit = function (valueNs, unitFormat, isLive) {
                    if (typeof isLive === "undefined") { isLive = false; }
                    var units = RulerUtilities.getUnits(unitFormat);

                    var unit;
                    if (valueNs < RulerUtilities.OneSecond - RulerUtilities.NanosecondsSignificanceThreshold && !isLive) {
                        unit = units.milliseconds;
                    } else if (valueNs < RulerUtilities.OneMinute - RulerUtilities.NanosecondsSignificanceThreshold) {
                        unit = units.seconds;
                    } else {
                        unit = units.minutes;
                    }

                    return unit;
                };

                RulerUtilities.getUnits = function (unitFormat) {
                    var unitLabelFormat;

                    if (unitFormat === 1 /* fullName */) {
                        unitLabelFormat = {
                            milliseconds: " " + Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/MillisecondsLabel"),
                            seconds: " " + Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/SecondsLabel"),
                            minutes: " " + Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/MinutesLabel")
                        };
                    } else {
                        unitLabelFormat = {
                            milliseconds: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/MillisecondsAbbreviation"),
                            seconds: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/SecondsAbbreviation"),
                            minutes: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/MinutesAbbreviation")
                        };
                    }

                    return unitLabelFormat;
                };

                RulerUtilities.getSplittedTime = function (value, nanosecondsSignificance) {
                    if (typeof nanosecondsSignificance === "undefined") { nanosecondsSignificance = RulerUtilities.NanosecondsSignificanceThreshold; }
                    var nanoseconds = DiagnosticsHub.BigNumber.moduloNumber(value, RulerUtilities.OneMillisecond);
                    var valueUnaccountedFor = DiagnosticsHub.BigNumber.subtract(value, nanoseconds);
                    var nanosecondsNum = parseInt(nanoseconds.value);

                    var ns = "";
                    if (nanosecondsNum < RulerUtilities.OneMillisecond - nanosecondsSignificance) {
                        ns = Math.round(nanosecondsNum / 1000).toString();
                        ns = this.padLeadingZeros(ns, 3);
                    } else {
                        valueUnaccountedFor = DiagnosticsHub.BigNumber.addNumber(valueUnaccountedFor, RulerUtilities.OneMillisecond);
                    }

                    var milliseconds = DiagnosticsHub.BigNumber.moduloNumber(valueUnaccountedFor, RulerUtilities.OneSecond);
                    valueUnaccountedFor = DiagnosticsHub.BigNumber.subtract(valueUnaccountedFor, milliseconds);
                    var millisecondsNum = parseInt(milliseconds.value) / RulerUtilities.OneMillisecond;

                    var seconds = DiagnosticsHub.BigNumber.moduloNumber(valueUnaccountedFor, RulerUtilities.OneMinute);
                    valueUnaccountedFor = DiagnosticsHub.BigNumber.subtract(valueUnaccountedFor, seconds);
                    var secondsNum = parseInt(seconds.value) / RulerUtilities.OneSecond;

                    var minutes = valueUnaccountedFor;
                    var minutesNum = parseInt(minutes.value) / RulerUtilities.OneMinute;

                    var ms = "";
                    if (ns || millisecondsNum) {
                        ms = millisecondsNum.toString();
                        if (secondsNum || minutesNum) {
                            ms = this.padLeadingZeros(ms, 3);
                        }
                    }

                    var sec = "";
                    if (ns || ms || secondsNum) {
                        sec = secondsNum.toString();
                        if (minutesNum) {
                            sec = this.padLeadingZeros(sec, 2);
                        }
                    }

                    var min = "";
                    if (minutesNum) {
                        min = minutesNum.toString();
                    }

                    return {
                        nsString: ns,
                        msString: ms,
                        secString: sec,
                        minString: min
                    };
                };

                RulerUtilities.removeTrailingZeros = function (numericString) {
                    return numericString.replace(/0*$/, "");
                };

                RulerUtilities.padLeadingZeros = function (value, totalLength) {
                    var padded = value;
                    var zeros = "00000000";

                    if (padded && totalLength && totalLength > 0) {
                        while (totalLength - padded.length >= 8) {
                            padded = zeros + padded;
                        }

                        padded = zeros.substr(0, totalLength - padded.length) + padded;
                    }

                    return padded;
                };
                RulerUtilities.OneMillisecond = 1000000;
                RulerUtilities.OneSecond = 1000 * 1000000;
                RulerUtilities.OneMinute = 60 * 1000 * 1000000;
                RulerUtilities.Counter = 0;

                RulerUtilities.NanosecondsSignificanceThreshold = 500;
                return RulerUtilities;
            })();
            DiagnosticsHub.RulerUtilities = RulerUtilities;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var RulerConfig = (function () {
                function RulerConfig() {
                    this.isLive = false;
                    this.isPerformanceDebugger = false;
                    this.isSelectionEnabled = true;
                    this.showLegend = true;
                    this.markSeries = [];
                }
                return RulerConfig;
            })();
            DiagnosticsHub.RulerConfig = RulerConfig;

            var Ruler = (function () {
                function Ruler(config) {
                    this._controls = [];
                    this._logger = Microsoft.VisualStudio.DiagnosticsHub.getLogger();
                    this._totalTimespan = null;
                    this._selectionTimespan = null;
                    this._aggregatedMarkImageToken = "vs-image-graph-aggregated-event";
                    this._imageTokenList = [
                        "vs-image-graph-app-event",
                        "vs-image-graph-user-mark",
                        "vs-image-graph-third-event",
                        "vs-image-graph-fourth-event",
                        "vs-image-graph-fifth-event",
                        "vs-image-graph-sixth-event"
                    ];
                    if (!config) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1002"));
                    }

                    this._config = config;
                    this._totalTimespan = this._config.timeRange;

                    this._container = document.createElement("div");
                    this._container.classList.add("ruler-container");

                    var headerDiv = document.createElement("div");
                    headerDiv.className = "ruler-header";
                    this._container.appendChild(headerDiv);

                    var bodyDiv = document.createElement("div");
                    bodyDiv.className = "ruler-body";
                    this._container.appendChild(bodyDiv);

                    while (this._config.markSeries.length > this._imageTokenList.length) {
                        this._logger.error("Series removed due to excess count: " + JSON.stringify(this._config.markSeries.pop()));
                    }

                    if (this._config.showLegend) {
                        var legendData = [];

                        for (var i = 0; i < this._imageTokenList.length && i < this._config.markSeries.length; i++) {
                            var series = this._config.markSeries[i];
                            series.index = i;
                            legendData.push({
                                text: series.label,
                                imageToken: this._imageTokenList[series.id - 1],
                                tooltip: series.tooltip
                            });
                        }

                        for (var i = 0; i < this._config.markSeries.length; i++) {
                            if (this._config.markSeries[i].id === 3 /* Custom */) {
                                legendData.push({
                                    text: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerAggregatedMarks"),
                                    imageToken: this._aggregatedMarkImageToken,
                                    tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/MergedMarkTooltip")
                                });
                                break;
                            }
                        }

                        var legend = new DiagnosticsHub.RulerLegend(legendData);
                        headerDiv.appendChild(legend.container);
                        this._controls.push(legend);
                    }

                    this._title = document.createElement("div");
                    this._title.className = "ruler-title-text";
                    this._title.setAttribute("aria-live", "off");
                    this._title.innerHTML = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerTitle", DiagnosticsHub.RulerUtilities.formatTotalTime(this._totalTimespan.elapsed, 1 /* fullName */));
                    headerDiv.appendChild(this._title);

                    this._scale = new DiagnosticsHub.RulerScale(this._totalTimespan, this._config.markSeries, this._imageTokenList, this._aggregatedMarkImageToken);

                    var scaleControl = this._config.isSelectionEnabled ? new DiagnosticsHub.DoubleSlider(this._totalTimespan, this._scale) : this._scale;
                    bodyDiv.appendChild(scaleControl.container);
                    this._controls.push(scaleControl);
                }
                Object.defineProperty(Ruler.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                Ruler.prototype.dispose = function () {
                    this._controls.forEach(function (control) {
                        if (control.dispose) {
                            control.dispose();
                        }
                    });
                };

                Ruler.prototype.onViewportChanged = function (viewportArgs) {
                    this._selectionTimespan = viewportArgs.selectionTimespan;

                    if (this._selectionTimespan) {
                        this._title.innerHTML = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerTitleWithSelection", DiagnosticsHub.RulerUtilities.formatTotalTime(this._totalTimespan.elapsed, 1 /* fullName */, this._config.isLive || viewportArgs.isIntermittent), DiagnosticsHub.RulerUtilities.formatSelectionTime(viewportArgs.selectionTimespan.elapsed, 0 /* italicizedAbbreviations */, this._config.isPerformanceDebugger));
                    } else {
                        this._title.innerHTML = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerTitle", DiagnosticsHub.RulerUtilities.formatTotalTime(this._totalTimespan.elapsed, 1 /* fullName */, this._config.isLive || viewportArgs.isIntermittent));
                    }

                    this._controls.forEach(function (control) {
                        if (control.onViewportChanged) {
                            control.onViewportChanged(viewportArgs);
                        }
                    });
                };

                Ruler.prototype.onDataUpdate = function (timestampNs) {
                    this._totalTimespan = new DiagnosticsHub.JsonTimespan(this._totalTimespan.begin, timestampNs);

                    if (this._markLoaders) {
                        this._markLoaders.forEach(function (loader) {
                            return loader.onDataUpdate(timestampNs);
                        });
                    }

                    if (this._selectionTimespan) {
                        this._title.innerHTML = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerTitleWithSelection", DiagnosticsHub.RulerUtilities.formatTotalTime(timestampNs, 1 /* fullName */, true), DiagnosticsHub.RulerUtilities.formatSelectionTime(this._selectionTimespan.elapsed, 0 /* italicizedAbbreviations */, this._config.isPerformanceDebugger));
                    } else {
                        this._title.innerHTML = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerTitle", DiagnosticsHub.RulerUtilities.formatTotalTime(timestampNs, 1 /* fullName */, true));
                    }
                };

                Ruler.prototype.resize = function (evt) {
                    this._controls.forEach(function (control) {
                        if (control.resize) {
                            control.resize(evt);
                        }
                    });
                };

                Ruler.prototype.addMark = function (id, timeStamp, toolTip, shouldRender) {
                    if (typeof shouldRender === "undefined") { shouldRender = true; }
                    var markData = new DiagnosticsHub.MarkData(timeStamp, toolTip);
                    this._scale.addMark(id, markData, shouldRender);
                };

                Ruler.prototype.loadMarks = function (series) {
                    var _this = this;
                    this._markLoaders = series.map(function (config) {
                        var dataSource = config.DataSource;
                        if (!dataSource || !dataSource.CounterId || !dataSource.AnalyzerId) {
                            return null;
                        }

                        return new DiagnosticsHub.MarkDataFetcher(config, _this._scale);
                    }).filter(function (fetcher) {
                        return fetcher !== null;
                    });
                };
                return Ruler;
            })();
            DiagnosticsHub.Ruler = Ruler;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var _swimlaneViewStateServiceSingleton = null;

            var SwimlaneViewStateService = (function () {
                function SwimlaneViewStateService() {
                    this._swimlaneViewStateMarshaler = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject(SwimlaneViewStateService.SwimlaneViewStateServiceMarshalerName, {}, true);
                }
                SwimlaneViewStateService.prototype.getSwimlaneVisibility = function (viewId) {
                    if (Microsoft.Plugin.F12) {
                        return Microsoft.Plugin.Promise.wrap(true);
                    }

                    return this._swimlaneViewStateMarshaler._call("getSwimlaneVisibility", viewId);
                };

                SwimlaneViewStateService.prototype.setSwimlaneVisibility = function (viewId, visible) {
                    if (Microsoft.Plugin.F12) {
                        return;
                    }

                    this._swimlaneViewStateMarshaler._call("setSwimlaneVisibility", viewId, visible);
                };
                SwimlaneViewStateService.SwimlaneViewStateServiceMarshalerName = "Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.SwimLaneViewStateServiceMarshaler";
                return SwimlaneViewStateService;
            })();

            function getSwimlaneViewStateService() {
                if (_swimlaneViewStateServiceSingleton === null) {
                    _swimlaneViewStateServiceSingleton = new SwimlaneViewStateService();
                }

                return _swimlaneViewStateServiceSingleton;
            }
            DiagnosticsHub.getSwimlaneViewStateService = getSwimlaneViewStateService;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var SwimlaneBase = (function () {
                function SwimlaneBase(titleConfig, contentHeight, currentTimespan, selectionTimespan) {
                    if (typeof selectionTimespan === "undefined") { selectionTimespan = null; }
                    var _this = this;
                    this._clientWidth = 0;
                    this._clientHeight = 0;
                    this._isVisible = true;
                    this._controls = [];
                    this._swimlaneVisibilityChangedEvent = new DiagnosticsHub.AggregatedEvent();
                    this._container = document.createElement("div");
                    this._container.classList.add("swimlaneBase");

                    this._currentTimespan = currentTimespan;
                    this._selectionTimespan = selectionTimespan;
                    this._isVisible = titleConfig.isBodyExpanded;

                    this._titleRegion = document.createElement("div");
                    this._contentRegion = document.createElement("div");
                    this._leftRegion = document.createElement("div");
                    this._mainRegion = document.createElement("div");
                    this._rightRegion = document.createElement("div");

                    this._titleRegion.classList.add("titleRegion");
                    this._contentRegion.classList.add("contentRegion");
                    this._leftRegion.classList.add("leftRegion");
                    this._mainRegion.classList.add("mainRegion");
                    this._rightRegion.classList.add("rightRegion");

                    this._contentRegion.style.height = contentHeight + "px";
                    this._contentRegion.appendChild(this._leftRegion);
                    this._contentRegion.appendChild(this._mainRegion);
                    this._contentRegion.appendChild(this._rightRegion);

                    this._titleText = titleConfig.titleText;
                    this._unit = titleConfig.unit;

                    this._titleContainer = document.createElement("div");
                    this._titleContainer.className = "title-container";

                    this._titleCollapseExpandButton = document.createElement("div");
                    this._titleCollapseExpandButton.setAttribute("role", "button");
                    this._titleCollapseExpandButton.tabIndex = 0;
                    this._titleCollapseExpandButton.onclick = this.toggleVisibility.bind(this);
                    this._titleCollapseExpandButton.onkeydown = this.onKeyDown.bind(this);
                    this._titleContainer.appendChild(this._titleCollapseExpandButton);

                    this._titleTextElement = document.createElement("div");
                    this._titleTextElement.className = "title-text";
                    this._titleContainer.appendChild(this._titleTextElement);

                    this._container.appendChild(this._titleContainer);
                    this._container.appendChild(this._titleRegion);
                    this._container.appendChild(this._contentRegion);

                    this.updateTitle();
                    this.updateContentVisibility();

                    this._collapseCallback = function (mql) {
                        if (mql.matches) {
                            _this._titleRegion.classList.add("limitedSpace");
                        } else {
                            _this._titleRegion.classList.remove("limitedSpace");
                        }
                    };

                    this.updateCollapsingWidth();
                }
                Object.defineProperty(SwimlaneBase.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(SwimlaneBase.prototype, "swimlaneVisibilityChangedEvent", {
                    get: function () {
                        return this._swimlaneVisibilityChangedEvent;
                    },
                    enumerable: true,
                    configurable: true
                });

                SwimlaneBase.prototype.dispose = function () {
                    this._swimlaneVisibilityChangedEvent.dispose();
                    this._titleCollapseExpandButton.onclick = null;
                    this._titleCollapseExpandButton.onkeydown = null;

                    this._controls.forEach(function (control) {
                        if (control.dispose) {
                            control.dispose();
                        }
                    });
                };

                SwimlaneBase.prototype.resize = function (evt) {
                    if (!this._clientWidth && !this._clientHeight) {
                        this.updateCollapsingWidth();
                    }

                    if (this._clientWidth === this._container.clientWidth && this._clientHeight === this._container.clientHeight) {
                        return;
                    }

                    this._clientHeight = this._container.clientHeight;
                    this._clientWidth = this._container.clientWidth;

                    if (!this._isVisible) {
                        return;
                    }

                    this._controls.forEach(function (control) {
                        if (control.resize) {
                            control.resize(evt);
                        }
                    });
                };

                SwimlaneBase.prototype.onViewportChanged = function (viewportArgs) {
                    this._currentTimespan = viewportArgs.currentTimespan;
                    this._selectionTimespan = viewportArgs.selectionTimespan;

                    if (this._isVisible) {
                        this._controls.forEach(function (control) {
                            if (control.onViewportChanged) {
                                control.onViewportChanged(viewportArgs);
                            }
                        });
                    }
                };

                SwimlaneBase.prototype.onDataUpdate = function (timestampNs) {
                    this._controls.forEach(function (control) {
                        if (control.onDataUpdate) {
                            control.onDataUpdate(timestampNs);
                        }
                    });
                };

                SwimlaneBase.prototype.onScaleChanged = function (args) {
                    this._unit = args.unit || this._unit;
                    this.updateTitle();
                };

                SwimlaneBase.prototype.addTitleControl = function (control) {
                    this._titleRegion.appendChild(control.container);
                    this._controls.push(control);
                    this.updateCollapsingWidth();
                };

                SwimlaneBase.prototype.addLeftRegionControl = function (control) {
                    this._leftRegion.appendChild(control.container);
                    this._controls.push(control);
                };

                SwimlaneBase.prototype.addRightRegionControl = function (control) {
                    this._rightRegion.appendChild(control.container);
                    this._controls.push(control);
                };

                SwimlaneBase.prototype.addMainRegionControl = function (control) {
                    this._mainRegion.appendChild(control.container);
                    this._controls.push(control);
                };

                SwimlaneBase.prototype.onKeyDown = function (e) {
                    if (13 /* Enter */ === e.keyCode) {
                        this.toggleVisibility();
                    }
                };

                SwimlaneBase.prototype.toggleVisibility = function () {
                    this._isVisible = !this._isVisible;
                    this.updateContentVisibility();

                    if (this._isVisible) {
                        this.resize(null);
                        this.onViewportChanged({
                            currentTimespan: this._currentTimespan,
                            selectionTimespan: this._selectionTimespan,
                            isIntermittent: false
                        });
                    }

                    this._swimlaneVisibilityChangedEvent.invokeEvent(this._isVisible);
                };

                SwimlaneBase.prototype.updateTitle = function () {
                    var text = this._titleText;
                    if (this._unit) {
                        text += " (" + this._unit + ")";
                    }

                    this._titleTextElement.innerHTML = text;
                };

                SwimlaneBase.prototype.updateContentVisibility = function () {
                    if (this._isVisible) {
                        this._titleCollapseExpandButton.className = "title-expanded-button";
                        this._titleCollapseExpandButton.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/SwimlaneCollapseAriaLabel", this._titleText));
                        this._contentRegion.style.display = "-ms-grid";
                    } else {
                        this._titleCollapseExpandButton.className = "title-collapsed-button";
                        this._titleCollapseExpandButton.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/SwimlaneExpandAriaLabel", this._titleText));
                        this._contentRegion.style.display = "none";
                    }
                };

                SwimlaneBase.prototype.updateCollapsingWidth = function () {
                    if (this._collapseMediaQuery) {
                        this._collapseMediaQuery.removeListener(this._collapseCallback);
                    }

                    var preferredWidth = this._titleContainer.offsetWidth + this._titleRegion.offsetWidth;

                    this._collapseMediaQuery = window.matchMedia(DiagnosticsHub.Utilities.formatString("(max-width: {0}px)", preferredWidth.toString()));
                    this._collapseMediaQuery.addListener(this._collapseCallback);
                };
                return SwimlaneBase;
            })();
            DiagnosticsHub.SwimlaneBase = SwimlaneBase;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var SelectionOverlay = (function (_super) {
                __extends(SelectionOverlay, _super);
                function SelectionOverlay(controlToOverlay, currentTimespan, currentSelection, sourceId) {
                    _super.call(this, controlToOverlay);
                    this._selectionTimeAnchor = null;
                    this._animationFrameHandle = null;

                    this._currentTimespan = currentTimespan;
                    this._currentSelection = currentSelection;
                    this._sourceId = sourceId;

                    this._container = document.createElement("div");
                    this._container.className = "selectionOverlay";
                    this._container.style.zIndex = DiagnosticsHub.Constants.SelectionOverlayZIndex.toString();

                    this._leftUnselectedRegion = document.createElement("div");
                    this._rightUnselectedRegion = document.createElement("div");

                    this._leftUnselectedRegion.className = "unselected";
                    this._leftUnselectedRegion.style.top = "0px";
                    this._rightUnselectedRegion.className = "unselected";
                    this._rightUnselectedRegion.style.top = "0px";

                    this._container.appendChild(this._leftUnselectedRegion);
                    this._container.appendChild(controlToOverlay.container);
                    this._container.appendChild(this._rightUnselectedRegion);

                    this._container.onmousedown = this.onStartSelection.bind(this);
                    this._container.onmousemove = this.onDragSelection.bind(this);
                    this._container.onmouseup = this.onStopSelection.bind(this);

                    this._telemetry = new DiagnosticsHub.Telemetry.ViewportController();
                    this._viewEventManager = Microsoft.VisualStudio.DiagnosticsHub.getViewEventManager();
                }
                Object.defineProperty(SelectionOverlay.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                SelectionOverlay.prototype.dispose = function () {
                    this._container.onmousedown = null;
                    this._container.onmousemove = null;
                    this._container.onmouseup = null;
                    _super.prototype.dispose.call(this);
                };

                SelectionOverlay.prototype.resize = function (evt) {
                    this._clientWidth = this._container.clientWidth;
                    this._clientRect = this._container.getBoundingClientRect();
                    this.updateDom();
                    _super.prototype.resize.call(this, evt);
                };

                SelectionOverlay.prototype.onViewportChanged = function (viewportArgs) {
                    this._currentTimespan = viewportArgs.currentTimespan;
                    this._currentSelection = viewportArgs.selectionTimespan;
                    this.updateDom();
                    _super.prototype.onViewportChanged.call(this, viewportArgs);
                };

                SelectionOverlay.prototype.onStartSelection = function (event) {
                    if (event.which !== 1 /* Left */) {
                        return;
                    }

                    this._selectionTimeAnchor = DiagnosticsHub.Utilities.getTimestampAtPixel(event.clientX - this._clientRect.left, this._clientWidth, this._currentTimespan);
                    this._currentSelection = new DiagnosticsHub.JsonTimespan(this._selectionTimeAnchor, DiagnosticsHub.BigNumber.addNumber(this._selectionTimeAnchor, DiagnosticsHub.Utilities.translateNumPixelToDuration(DiagnosticsHub.SwimlaneViewConstants.MinSelectionInPixels, this._clientWidth, this._currentTimespan)));

                    DiagnosticsHub.Utilities.setCapture(this._container);

                    if (this._animationFrameHandle) {
                        window.cancelAnimationFrame(this._animationFrameHandle);
                    }

                    this._animationFrameHandle = window.requestAnimationFrame(this.onSelectionAnimation.bind(this));
                    event.stopPropagation();
                };

                SelectionOverlay.prototype.onDragSelection = function (event) {
                    if (event.target !== this._container || event.which !== 1 /* Left */) {
                        return;
                    } else if (!this._animationFrameHandle) {
                        return;
                    }

                    var left = Math.max(event.clientX - this._clientRect.left, 0);
                    left = Math.min(left, this._clientWidth);
                    var xTime = DiagnosticsHub.Utilities.getTimestampAtPixel(left, this._clientWidth, this._currentTimespan);

                    if (this._selectionTimeAnchor.greater(xTime)) {
                        this._currentSelection = new DiagnosticsHub.JsonTimespan(xTime, this._selectionTimeAnchor);
                    } else {
                        this._currentSelection = new DiagnosticsHub.JsonTimespan(this._selectionTimeAnchor, xTime);
                    }

                    event.stopPropagation();
                };

                SelectionOverlay.prototype.onStopSelection = function (event) {
                    if (event.which !== 1 /* Left */) {
                        return;
                    }

                    DiagnosticsHub.Utilities.releaseCapture(this._container);

                    window.cancelAnimationFrame(this._animationFrameHandle);
                    this._animationFrameHandle = null;

                    this.raiseSelectionChanged(false);

                    var isMinSelection = false;
                    if (this._currentSelection) {
                        isMinSelection = DiagnosticsHub.Utilities.getTimestampAtPixel(DiagnosticsHub.SwimlaneViewConstants.MinSelectionInPixels, this._clientWidth, this._currentTimespan).greaterOrEqual(this._currentSelection.elapsed);
                    }

                    this._telemetry.selectionChanged(0 /* SwimLane */, isMinSelection, this._sourceId);
                };

                SelectionOverlay.prototype.onSelectionAnimation = function () {
                    this.raiseSelectionChanged(true);
                    this._animationFrameHandle = window.requestAnimationFrame(this.onSelectionAnimation.bind(this));
                };

                SelectionOverlay.prototype.raiseSelectionChanged = function (isIntermittent) {
                    if (typeof isIntermittent === "undefined") { isIntermittent = false; }
                    this._viewEventManager.selectionChanged.raiseEvent({
                        position: this._currentSelection,
                        isIntermittent: isIntermittent
                    });
                };

                SelectionOverlay.prototype.updateDom = function () {
                    if (this._currentSelection) {
                        var left = DiagnosticsHub.Utilities.convertToPixel(this._currentSelection.begin, this._currentTimespan, this._clientWidth);
                        left = Math.max(left, 0);

                        var right = DiagnosticsHub.Utilities.convertToPixel(this._currentSelection.end, this._currentTimespan, this._clientWidth);
                        var rightWidth = (this._clientWidth - right);
                        rightWidth = Math.max(rightWidth, 0);

                        this._leftUnselectedRegion.style.width = left + "px";
                        this._rightUnselectedRegion.style.left = right + "px";
                        this._rightUnselectedRegion.style.width = rightWidth + "px";
                    } else {
                        this._leftUnselectedRegion.style.width = "0px";
                        this._rightUnselectedRegion.style.left = this._clientWidth + "px";
                        this._rightUnselectedRegion.style.width = "0px";
                    }
                };
                return SelectionOverlay;
            })(DiagnosticsHub.ControlDecorator);
            DiagnosticsHub.SelectionOverlay = SelectionOverlay;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var SwimlaneConfiguration = (function () {
                function SwimlaneConfiguration(graphConfig, visibleTimeRange, graphBehavior) {
                    if (typeof graphBehavior === "undefined") { graphBehavior = 1 /* Live */; }
                    this._swimlaneId = "00000000-0000-0000-0000-000000000000";
                    this.header = {
                        isBodyExpanded: true,
                        titleText: "Graph",
                        description: "Graph"
                    };
                    this.graph = {
                        height: DiagnosticsHub.Constants.DefaultSwimlaneGraphHeight,
                        registeredClass: null,
                        loadCss: DiagnosticsHub.Common.DependencyManager.loadCss,
                        jsonConfig: {},
                        description: null,
                        scale: {
                            minimum: 0,
                            maximum: 100,
                            axes: []
                        },
                        legend: [],
                        unit: "",
                        swimlaneId: this._swimlaneId
                    };
                    if (graphConfig.JavaScriptClassName) {
                        this.graph.registeredClass = DiagnosticsHub.RegisterNamespace.getRegisteredClass(graphConfig.JavaScriptClassName);
                    } else {
                        this.graph.registeredClass = DiagnosticsHub.RegisterNamespace.getRegisteredClass("Microsoft.VisualStudio.DiagnosticsHub.MultiLineGraph");
                    }

                    this._swimlaneId = graphConfig.Id;
                    this.graph.swimlaneId = graphConfig.Id;

                    this.graph.jsonConfig = graphConfig.JsonObject;
                    this.graph.jsonConfig.GraphBehaviour = graphBehavior;
                    this.graph.scale.minimum = graphConfig.JsonObject.MinValue || this.graph.scale.minimum;
                    this.graph.scale.maximum = graphConfig.JsonObject.MaxValue || this.graph.scale.minimum;
                    this.graph.scale.isFixed = graphConfig.JsonObject.IsScaleFixed;
                    this.graph.resources = graphConfig.Resources;
                    this.graph.description = graphConfig.Description;
                    this.graph.pathToScriptFolder = graphConfig.PathToScriptFolder;
                    graphConfig.JsonObject.RefreshDataOnResizeAndZoom = graphConfig.JsonObject.RefreshDataOnResizeAndZoom || false;

                    var height = graphConfig.JsonObject.Height || this.graph.height;
                    height = Math.max(height, DiagnosticsHub.Constants.MinimumSwimlaneGraphHeight);
                    this.graph.height = Math.min(height, DiagnosticsHub.Constants.MaximumSwimlaneGraphHeight);

                    this.timeRange = visibleTimeRange;
                    this.graph.timeRange = visibleTimeRange;

                    this.header.titleText = graphConfig.Title;
                }
                Object.defineProperty(SwimlaneConfiguration.prototype, "id", {
                    get: function () {
                        return this._swimlaneId;
                    },
                    enumerable: true,
                    configurable: true
                });
                return SwimlaneConfiguration;
            })();
            DiagnosticsHub.SwimlaneConfiguration = SwimlaneConfiguration;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var Renderer = (function () {
                function Renderer(config) {
                    this._logger = Microsoft.VisualStudio.DiagnosticsHub.getLogger();
                    this._controls = [];
                    this._graphs = [];
                    this._markSeriesConfig = [];
                    this._maxHeight = 600;
                    this._previousHeight = 0;
                    this._dataWarehouse = null;
                    this._defaultAnalyzerId = "89fb2d7a-1239-4952-811b-d77e2ee6f2aa";
                    this._countersAnalyzerId = "66EDDDF1-2277-40F3-983A-6FF57A433ECB";
                    this._isResizeRegistered = false;
                    if (!config) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1002"));
                    }

                    if (!config.dataManager) {
                        config.dataManager = new DiagnosticsHub.DiagnosticsHubDataManager();
                    }

                    if (!config.collectorTimeService) {
                        config.collectorTimeService = DiagnosticsHub.getCollectorTimeService();
                    }

                    this._onResizeBoundFunction = DiagnosticsHub.eventThrottler(this.onResize.bind(this), DiagnosticsHub.Constants.WindowResizeThrottle);

                    this._config = config;
                    this._config.isSelectionEnabled = typeof this._config.isSelectionEnabled === "undefined" || this._config.isSelectionEnabled;

                    this._eventAggregator = Microsoft.VisualStudio.DiagnosticsHub.getEventAggregator();

                    var containerId = this._config.containerId || "mainContainer";
                    var container = document.getElementById(containerId);
                    container.classList.add("base-container");

                    this._headerContainer = document.createElement("div");
                    this._headerContainer.id = "header-float";
                    this._headerContainer.classList.add("header-float");

                    if (this._config.isToolbarFloating) {
                        this._headerContainer.style.position = "fixed";
                    }

                    container.appendChild(this._headerContainer);

                    this._swimlaneContainer = document.createElement("div");
                    this._swimlaneContainer.id = "mainSwimlaneContainer";
                    this._swimlaneContainer.classList.add("main-swimlane-container");
                    container.appendChild(this._swimlaneContainer);

                    this._footerContainer = document.createElement("div");
                    this._footerContainer.id = "footer";
                    this._footerContainer.classList.add("footer-container");
                    container.appendChild(this._footerContainer);

                    if (this._config.isToolbarRequired) {
                        this._toolbar = new DiagnosticsHub.Toolbar();
                        this.addControl(this._toolbar, DiagnosticsHub.SwimlaneViewConstants.ToolbarRendererPriority);
                    }

                    this._config.dataManager.getConfigurations(this.initialize.bind(this));
                }
                Object.defineProperty(Renderer, "headerSwimlanePriority", {
                    get: function () {
                        return 128;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Renderer.prototype, "viewportController", {
                    get: function () {
                        return _viewportController;
                    },
                    enumerable: true,
                    configurable: true
                });

                Renderer.prototype.dispose = function () {
                    this._controls.forEach(function (control) {
                        if (control.dispose) {
                            control.dispose();
                        }
                    });

                    window.removeEventListener("resize", this._onResizeBoundFunction);
                };

                Renderer.prototype.addToolbarItem = function (item) {
                    if (this._toolbar) {
                        this._toolbar.addToolbarItem(item);
                    }
                };

                Renderer.prototype.addControl = function (control, priority) {
                    if (isNaN(priority) || priority < 0) {
                        return;
                    }

                    control.container.setAttribute("data-stackPriority", priority.toFixed());

                    var container;
                    if (priority >= Renderer.headerSwimlanePriority) {
                        container = this._swimlaneContainer;
                    } else {
                        container = this._headerContainer;
                    }

                    var node = container.firstChild;
                    while (node && parseInt(node.getAttribute("data-stackPriority")) < priority) {
                        node = node.nextSibling;
                    }

                    container.insertBefore(control.container, node);
                    this._controls.push(control);

                    if (this._isResizeRegistered) {
                        if (control.resize) {
                            control.resize(null);
                        }

                        this.resizeHost();
                    }
                };

                Renderer.prototype.removeControl = function (control) {
                    if (control.container.parentElement !== this._headerContainer && control.container.parentElement !== this._swimlaneContainer) {
                        return;
                    }

                    if (control.dispose) {
                        control.dispose();
                    }

                    control.container.parentElement.removeChild(control.container);

                    var controlIndex = this._controls.indexOf(control);
                    if (controlIndex !== -1) {
                        this._controls.splice(controlIndex, 1);
                    }

                    this.resizeHost();
                };

                Renderer.prototype.onResize = function (args) {
                    if (this._config.isToolbarFloating) {
                        this._swimlaneContainer.style.marginTop = this._headerContainer.clientHeight + "px";
                    } else {
                        this._swimlaneContainer.style.marginTop = "0px";
                    }

                    if (window) {
                        if (window.innerHeight <= (this._footerContainer.clientHeight * 2)) {
                            this._footerContainer.style.visibility = "collapse";
                        } else {
                            this._footerContainer.style.visibility = "visible";
                        }
                    }

                    this._controls.forEach(function (control) {
                        if (control.resize) {
                            control.resize(args);
                        }
                    });

                    this._swimlaneContainer.style.marginBottom = this._footerContainer.clientHeight + "px";
                };

                Renderer.prototype.initialize = function (managedConfiguration, dataWarehouseConfig) {
                    var _this = this;
                    if (typeof dataWarehouseConfig === "undefined") { dataWarehouseConfig = null; }
                    var isPerformanceDebugger = this._config.isPerformanceDebugger;
                    if (this._config.isLive && this._toolbar && !isPerformanceDebugger) {
                        this._toolbar.addCommand(new DiagnosticsHub.StopCollectionCommand());
                    }

                    if (managedConfiguration.GraphConfigurations.length === 0) {
                        window.addEventListener("resize", this._onResizeBoundFunction);
                        this._isResizeRegistered = true;
                        return;
                    }

                    managedConfiguration.GraphConfigurations.forEach(function (config) {
                        config.JsonObject = JSON.parse(config.JsonConfiguration);
                    });

                    Microsoft.VisualStudio.DiagnosticsHub.DataWarehouse.loadDataWarehouse(dataWarehouseConfig).then(function (dw) {
                        _this._dataWarehouse = dw;

                        if (!isPerformanceDebugger) {
                            return dw.getContextService().getGlobalContext().then(function (globalContext) {
                                return globalContext.getTimeDomain();
                            }, function () {
                                return new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.zero, DiagnosticsHub.BigNumber.zero);
                            });
                        }

                        return Microsoft.Plugin.Promise.wrap(new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.zero, DiagnosticsHub.BigNumber.zero));
                    }).then(function (timeDomain) {
                        _this.initializeViewportController(timeDomain);
                        _this.parseTimeProperties(managedConfiguration);
                    }).then(function () {
                        return !_this._config.isLive ? _this.getLostEvents() : null;
                    }).then(function () {
                        return _this.loadScripts(managedConfiguration.GraphConfigurations);
                    }).then(function () {
                        return _this.adjustConfigForNewArchitecture(managedConfiguration.GraphConfigurations);
                    }).then(function (componentConfigurations) {
                        if (!Microsoft.Plugin.F12) {
                            var commands = _this.viewportController.commands.filter(function (command) {
                                return command.displayOnContextMenu;
                            });

                            _this._contextMenu = new DiagnosticsHub.ContextMenu(commands);
                            _this._headerContainer.onmousedown = _this._contextMenu.onMouseDown.bind(_this._contextMenu);
                            _this._swimlaneContainer.onmousedown = _this._contextMenu.onMouseDown.bind(_this._contextMenu);
                        }

                        _this.addRuler(componentConfigurations);
                        return _this.addSwimlanes(componentConfigurations);
                    }).then(function () {
                        window.addEventListener("resize", _this._onResizeBoundFunction);
                        _this._isResizeRegistered = true;

                        _this._controls.forEach(function (control) {
                            if (control.resize) {
                                control.resize(null);
                            }
                        });

                        _this.resizeHost();
                    }).then(function () {
                        _this._config.dataManager.dataUpdate(_this.onDataUpdate.bind(_this));
                    }).done(function () {
                        return _this._eventAggregator.raiseEvent("Microsoft.DiagnosticsHub.RendererReadyEvent", null);
                    }, this.logExecuteError.bind(this));
                };

                Renderer.prototype.logExecuteError = function (error) {
                    this._logger.error("executeCallback failed: " + JSON.stringify(error));
                    return Microsoft.Plugin.Promise.wrapError(error);
                };

                Renderer.prototype.onDataUpdate = function (eventArgs) {
                    var _this = this;
                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25235 /* perfDiagnosticsHub_OnDataUpdateBegin */);

                    var newTimestampNs;

                    if (this._config.newArchitecture) {
                        var timestampDTO = eventArgs;
                        newTimestampNs = new DiagnosticsHub.BigNumber(timestampDTO.h, timestampDTO.l);
                    } else {
                        var graphData = eventArgs;
                        var newTimestampQpc = new DiagnosticsHub.BigNumber(graphData.TimestampH, graphData.TimestampL);
                        newTimestampNs = this._timeProperties.convertQpcTimestampToNanoseconds(newTimestampQpc);

                        graphData.UpdatedSeries.forEach(function (newSeries) {
                            if (newSeries.NewPoints) {
                                _this.addSeriesEvent(newSeries);
                                _this.addMarkEvent(newSeries);
                            }
                        });
                    }

                    if (DiagnosticsHub.BigNumber.subtract(newTimestampNs, DiagnosticsHub.RollingViewportController.DropPointLimitInNs).greater(this.viewportController.viewable.begin)) {
                        var base = DiagnosticsHub.BigNumber.subtract(newTimestampNs, DiagnosticsHub.SwimlaneViewConstants.OneHourInNs);
                        this._graphs.forEach(function (graph) {
                            return graph.removeInvalidPoints(base);
                        });
                    }

                    this._controls.forEach(function (control) {
                        if (control.onDataUpdate) {
                            control.onDataUpdate(newTimestampNs);
                        }
                    });

                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25236 /* perfDiagnosticsHub_OnDataUpdateEnd */);
                };

                Renderer.prototype.parseTimeProperties = function (data) {
                    if (data.QpcTimeProperties) {
                        this._timeProperties = new DiagnosticsHub.Common.QpcTimeProperties(new DiagnosticsHub.BigNumber(data.QpcTimeProperties.CollectionStartTimeH, data.QpcTimeProperties.CollectionStartTimeL), data.QpcTimeProperties.Frequency);
                    } else {
                        this._timeProperties = new DiagnosticsHub.Common.QpcTimeProperties(DiagnosticsHub.BigNumber.zero, 1000);
                    }
                };

                Renderer.prototype.initializeViewportController = function (timeDomain) {
                    this._logger.info("Got timespan, elapsed=" + timeDomain.elapsed.value);
                    _viewportController = this._config.isLive ? new DiagnosticsHub.RollingViewportController(this._config.timeInNsPerPixel) : new DiagnosticsHub.ViewportController(timeDomain);

                    this._footerContainer.appendChild(this.viewportController.container);
                    this._controls.push(this.viewportController);

                    if (this._toolbar) {
                        this._toolbar.addCommandGroup(this.viewportController.commands);
                    }
                };

                Renderer.prototype.getLostEvents = function () {
                    var _this = this;
                    var contextData = {
                        customDomain: { task: "get-total-lost-events" }
                    };

                    return this._dataWarehouse.getFilteredData(contextData, this._defaultAnalyzerId).then(function (args) {
                        if (args && typeof args.lostEvents === "number" && args.lostEvents > 0) {
                            var infobar = new DiagnosticsHub.InformationBarControl(Microsoft.Plugin.Resources.getString("/DiagnosticsHubResources/InformationDroppedEvents", args.lostEvents), "http://go.microsoft.com/fwlink/p/?LinkId=391662");
                            infobar.onClose = function () {
                                return _this.removeControl(infobar);
                            };
                            _this.addControl(infobar, DiagnosticsHub.SwimlaneViewConstants.InfobarRendererPriority);

                            var telemetry = new DiagnosticsHub.Telemetry.CollectedData();
                            telemetry.lostEvents(args.lostEvents);
                        }
                    }, function (error) {
                        _this._logger.error("Could not get lost events, error: " + JSON.stringify(error));
                    });
                };

                Renderer.prototype.loadScripts = function (componentConfigurations) {
                    var dependencyLoadPromiseChain = [];
                    componentConfigurations.forEach(function (config) {
                        if (config.PathToScript) {
                            var lastPathIndex = config.PathToScript.lastIndexOf("\\");

                            if (lastPathIndex !== -1) {
                                config.PathToScriptFolder = config.PathToScript.substring(0, lastPathIndex);
                            }

                            dependencyLoadPromiseChain.push(DiagnosticsHub.Common.DependencyManager.loadDependency({
                                objType: config.JavaScriptClassName,
                                functionName: config.JavaScriptFactoryFunction,
                                url: config.PathToScript
                            }));
                        }
                    });

                    return Microsoft.Plugin.Promise.join(dependencyLoadPromiseChain);
                };

                Renderer.prototype.resizeHost = function () {
                    var controlsHeight = 0;
                    this._controls.forEach(function (control) {
                        controlsHeight += control.container.offsetHeight;
                    });

                    var height = Math.ceil(controlsHeight);
                    var diff = height - this._previousHeight;
                    this._previousHeight = height;
                    this._eventAggregator.raiseEvent("Microsoft.DiagnosticsHub.SwimlaneResizeHeight", {
                        Delta: diff,
                        MaxValue: Math.min(this._maxHeight, height),
                        Value: Math.min(this._maxHeight, height)
                    });
                };

                Renderer.prototype.convertDtoToIPointArray = function (dto) {
                    return dto.map(function (dtoPoint) {
                        return {
                            Timestamp: new DiagnosticsHub.BigNumber(dtoPoint.TimestampH, dtoPoint.TimestampL),
                            Value: dtoPoint.Value,
                            ToolTip: dtoPoint.ToolTip,
                            CustomData: dtoPoint.CustomData
                        };
                    });
                };

                Renderer.prototype.addSeriesEvent = function (newSeries) {
                    var convertedPoints = this.convertDtoToIPointArray(newSeries.NewPoints);
                    this._graphs.forEach(function (graph) {
                        graph.addSeriesData(newSeries.DataSource.CounterId, convertedPoints, false);
                    });
                };

                Renderer.prototype.addMarkEvent = function (newSeries) {
                    var _this = this;
                    this._markSeriesConfig.forEach(function (series) {
                        if (series.DataSource.CounterId === newSeries.DataSource.CounterId) {
                            var convertedPoints = _this.convertDtoToIPointArray(newSeries.NewPoints);
                            convertedPoints.forEach(function (point) {
                                var timestamp = _this._timeProperties.convertQpcTimestampToNanoseconds(point.Timestamp);
                                var tooltip = point.ToolTip || _this.formatMarkTooltip(timestamp);

                                _this._ruler.addMark(series.MarkTypeId, timestamp, tooltip);
                            });
                        }
                    });
                };

                Renderer.prototype.formatMarkTooltip = function (timestamp) {
                    return Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/TooltipTimeLabel") + ": " + DiagnosticsHub.RulerUtilities.formatTime(timestamp, 0 /* italicizedAbbreviations */);
                };

                Renderer.prototype.adjustConfigForNewArchitecture = function (componentConfigurations) {
                    var _this = this;
                    var adjustSeries = function (series) {
                        var contextData = {
                            customDomain: {
                                Task: "HasCounter",
                                CounterId: series.DataSource.CounterId
                            }
                        };

                        return _this._dataWarehouse.getFilteredData(contextData, _this._countersAnalyzerId).then(function (result) {
                            if (result.isPresent) {
                                series.DataSource.AnalyzerId = _this._countersAnalyzerId;
                            }

                            return series;
                        });
                    };

                    return Microsoft.Plugin.Promise.thenEach(componentConfigurations, function (config) {
                        if ((!_this._config.newArchitecture) || (config.Type === 3 /* FullCustom */) || (config.JavaScriptClassName && config.JavaScriptClassName !== "Microsoft.VisualStudio.DiagnosticsHub.MultiLineGraph")) {
                            return Microsoft.Plugin.Promise.wrap(config);
                        }

                        return Microsoft.Plugin.Promise.thenEach(config.JsonObject.Series, adjustSeries).then(function (adjustedSeries) {
                            config.JsonObject.Series = adjustedSeries;
                            return config;
                        });
                    });
                };

                Renderer.prototype.addSwimlanes = function (componentConfigurations) {
                    var _this = this;
                    var swimlaneCount = 0;
                    var viewStateService = DiagnosticsHub.getSwimlaneViewStateService();
                    var graphBehavior = this._config.isLive ? 1 /* Live */ : 2 /* PostMortem */;

                    var promises = [];

                    componentConfigurations.forEach(function (config) {
                        if (config.JsonObject.View && config.JsonObject.View !== DiagnosticsHub.ViewType.Graph) {
                            return;
                        }

                        var swimlaneNumber = ++swimlaneCount;
                        var promise = viewStateService.getSwimlaneVisibility(config.Id).then(function (isVisible) {
                            var factoryFunction;
                            if (config.Type === 3 /* FullCustom */) {
                                factoryFunction = DiagnosticsHub.RegisterNamespace.getRegisteredFunction(config.JavaScriptFactoryFunction);
                            } else {
                                factoryFunction = _this.swimlaneFactory.bind(_this);
                            }

                            var swimlane = factoryFunction(config, isVisible, _this._config.isSelectionEnabled, graphBehavior, _this.viewportController.visible, _this.viewportController.selection);
                            swimlane.swimlaneVisibilityChangedEvent.addEventListener(function (visible) {
                                viewStateService.setSwimlaneVisibility(config.Id, visible);
                                _this.resizeHost();
                            });
                            _this.viewportController.viewportStateChanged.addEventListener(swimlane.onViewportChanged.bind(swimlane));
                            _this.addControl(swimlane, Renderer.headerSwimlanePriority + swimlaneNumber);

                            swimlane.onViewportChanged({
                                currentTimespan: _this.viewportController.visible,
                                selectionTimespan: _this.viewportController.selection,
                                isIntermittent: false
                            });
                        });
                        promises.push(promise);
                    });
                    return Microsoft.Plugin.Promise.join(promises);
                };

                Renderer.prototype.swimlaneFactory = function (componentConfig, isVisible, selectionEnabled, graphBehaviour, currentTimespan, selectionTimespan) {
                    var swimlaneConfig = new DiagnosticsHub.SwimlaneConfiguration(componentConfig, currentTimespan, graphBehaviour);

                    if (this._config.newArchitecture && swimlaneConfig.graph.registeredClass === DiagnosticsHub.RegisterNamespace.getRegisteredClass("Microsoft.VisualStudio.DiagnosticsHub.MultiLineGraph")) {
                        swimlaneConfig.graph.registeredClass = DiagnosticsHub.RegisterNamespace.getRegisteredClass("Microsoft.VisualStudio.DiagnosticsHub.MultiSeriesGraph");
                    }

                    swimlaneConfig.graph.jsonConfig.TimeProperties = this._timeProperties;

                    var graph = new swimlaneConfig.graph.registeredClass(swimlaneConfig.graph);
                    var unitConverter = new DiagnosticsHub.LocalizedUnitConverter(swimlaneConfig.graph.jsonConfig.Units, swimlaneConfig.graph.resources);

                    if (!this._config.newArchitecture) {
                        this._graphs.push(graph);
                    }

                    swimlaneConfig.header.isBodyExpanded = isVisible;
                    swimlaneConfig.header.unit = swimlaneConfig.graph.unit;

                    var graphStack = graph;
                    if (selectionEnabled) {
                        graphStack = new DiagnosticsHub.SelectionOverlay(graph, currentTimespan, selectionTimespan, swimlaneConfig.id);
                    }

                    var swimlane = new DiagnosticsHub.SwimlaneBase(swimlaneConfig.header, swimlaneConfig.graph.height, currentTimespan, selectionTimespan);
                    graph.scaleChangedEvent.addEventListener(swimlane.onScaleChanged.bind(swimlane));

                    var leftScale = new DiagnosticsHub.Scale(swimlaneConfig.graph.scale, 0 /* Left */, unitConverter);
                    var rightScale = new DiagnosticsHub.Scale(swimlaneConfig.graph.scale, 1 /* Right */, unitConverter);
                    graph.scaleChangedEvent.addEventListener(leftScale.onScaleChanged.bind(leftScale));
                    graph.scaleChangedEvent.addEventListener(rightScale.onScaleChanged.bind(rightScale));

                    if (swimlaneConfig.graph.scale.axes) {
                        swimlaneConfig.graph.scale.axes.forEach(function (axisLine) {
                            var axis = new DiagnosticsHub.Axes(axisLine, swimlaneConfig.graph.scale.minimum, swimlaneConfig.graph.scale.maximum);
                            graph.scaleChangedEvent.addEventListener(axis.onScaleChangedEvent.bind(axis));
                            swimlane.addMainRegionControl(axis);
                        });
                    }

                    swimlane.addTitleControl(new DiagnosticsHub.Legend(swimlaneConfig.graph.legend));
                    swimlane.addMainRegionControl(graphStack);
                    swimlane.addMainRegionControl(new DiagnosticsHub.GridLineRenderer(currentTimespan));
                    swimlane.addLeftRegionControl(leftScale);
                    swimlane.addRightRegionControl(rightScale);

                    return swimlane;
                };

                Renderer.prototype.addRuler = function (componentConfigurations) {
                    var _this = this;
                    var config = new DiagnosticsHub.RulerConfig();

                    config.showLegend = !this._config.isPerformanceDebugger;
                    config.isLive = this._config.isLive;
                    config.isSelectionEnabled = this._config.isSelectionEnabled;
                    config.timeRange = this.viewportController.visible;
                    config.isPerformanceDebugger = this._config.isPerformanceDebugger;

                    var markSeriesConfig = [];
                    var markTypeIdCounter = 3;
                    var dictionary = {};
                    var legendDictionary = {};

                    componentConfigurations.forEach(function (componentConfig) {
                        if (!componentConfig.JsonObject.View || componentConfig.JsonObject.View !== DiagnosticsHub.ViewType.Ruler) {
                            return;
                        }

                        componentConfig.JsonObject.Series.forEach(function (series) {
                            var cId = series.DataSource.CounterId || typeof series.DataSource.CounterId;
                            var aId = series.DataSource.AnalyzerId || typeof series.DataSource.AnalyzerId;
                            if (!dictionary[cId.toLowerCase() + "," + aId.toLowerCase()]) {
                                dictionary[cId.toLowerCase() + "," + aId.toLowerCase()] = true;

                                var id = 0;
                                if (typeof series.MarkType === "number" && (series.MarkType === 1 /* LifeCycleEvent */ || series.MarkType === 2 /* UserMark */)) {
                                    id = series.MarkType;
                                } else {
                                    id = markTypeIdCounter;
                                }

                                if (id === 1 /* LifeCycleEvent */) {
                                    var appLegend = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerLifecycleMarkLabel");
                                    if (!legendDictionary[appLegend]) {
                                        legendDictionary[appLegend] = id;
                                        config.markSeries.push({ id: id, label: appLegend, tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/LifecycleMarkTooltip") });
                                    } else {
                                        id = legendDictionary[legend];
                                    }
                                } else if (id === 2 /* UserMark */) {
                                    var appLegend = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerUserMarkLabel");
                                    if (!legendDictionary[appLegend]) {
                                        legendDictionary[appLegend] = id;
                                        config.markSeries.push({ id: id, label: appLegend, tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/UserMarkTooltip") });
                                    } else {
                                        id = legendDictionary[legend];
                                    }
                                } else {
                                    var tooltip = series.LegendTooltip;
                                    if (componentConfig.Resources && componentConfig.Resources[tooltip]) {
                                        tooltip = componentConfig.Resources[tooltip];
                                    }

                                    var legend = series.Legend;
                                    if (componentConfig.Resources && componentConfig.Resources[legend]) {
                                        legend = componentConfig.Resources[legend];
                                    }

                                    if (!legendDictionary[legend]) {
                                        legendDictionary[legend] = id;
                                        config.markSeries.push({ id: id, label: legend, tooltip: tooltip || "" });
                                        markTypeIdCounter++;
                                    } else {
                                        id = legendDictionary[legend];
                                    }
                                }

                                series.MarkTypeId = id;
                                _this._markSeriesConfig.push(series);
                            }
                        });
                    });

                    this._ruler = new DiagnosticsHub.Ruler(config);
                    this.addControl(this._ruler, DiagnosticsHub.SwimlaneViewConstants.RulerRendererPriority);
                    this.viewportController.viewportStateChanged.addEventListener(this._ruler.onViewportChanged.bind(this._ruler));

                    if (this._config.newArchitecture || !this._config.isLive) {
                        this._ruler.loadMarks(this._markSeriesConfig);
                    }
                };
                return Renderer;
            })();
            DiagnosticsHub.Renderer = Renderer;

            var _viewportController = null;

            function getViewportController() {
                return _viewportController;
            }
            DiagnosticsHub.getViewportController = getViewportController;

            var _renderer = null;

            function getRenderer(args) {
                if (!_renderer && !args) {
                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1002"));
                }

                if (!_renderer) {
                    _renderer = new Renderer(args);
                }

                return _renderer;
            }
            DiagnosticsHub.getRenderer = getRenderer;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var DiagnosticsHubCollectorTimeService = (function () {
                function DiagnosticsHubCollectorTimeService() {
                    this._timeServiceConfigurationMarshaler = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.CollectionTimeServiceMarshaler", {}, true);
                    if (!this._timeServiceConfigurationMarshaler) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1007"));
                    }
                }
                DiagnosticsHubCollectorTimeService.prototype.bindTimestampUpdateListener = function (func) {
                    this._timeServiceConfigurationMarshaler.addEventListener("timestampUpdate", func);
                };

                DiagnosticsHubCollectorTimeService.prototype.getCurrentCollectionTime = function () {
                    return this._timeServiceConfigurationMarshaler._call("getCurrentCollectionTime").then(function (collectionTime) {
                        return new DiagnosticsHub.BigNumber(collectionTime.h, collectionTime.l);
                    });
                };
                return DiagnosticsHubCollectorTimeService;
            })();

            var _collectorTimeService = null;

            function getCollectorTimeService() {
                if (_collectorTimeService === null) {
                    _collectorTimeService = new DiagnosticsHubCollectorTimeService();
                }

                return _collectorTimeService;
            }
            DiagnosticsHub.getCollectorTimeService = getCollectorTimeService;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var StopCollectionCommand = (function () {
                function StopCollectionCommand() {
                    var _this = this;
                    this._isDisabled = false;
                    this.id = "stopCollection";
                    this.label = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarStopCollectionButton");
                    this.ariaLabel = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarStopCollectionAriaLabel");
                    this.tooltip = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolbarStopCollectionTooltip");
                    this.type = 1 /* command */;
                    this.iconEnabled = "vs-image-toolbar-stopcollection";
                    this.iconDisabled = "vs-image-toolbar-stopcollection-disabled";
                    this.displayOnToolbar = true;
                    this.displayOnContextMenu = false;
                    this.checkStopCollection();
                    DiagnosticsHub.getCurrentSession().addStateChangedEventListener(function () {
                        return _this.checkStopCollection();
                    });
                }
                StopCollectionCommand.prototype.callback = function () {
                    DiagnosticsHub.getCurrentSession().stopCollection();
                };

                StopCollectionCommand.prototype.hidden = function () {
                    return false;
                };

                StopCollectionCommand.prototype.disabled = function () {
                    return this._isDisabled;
                };

                StopCollectionCommand.prototype.checkStopCollection = function () {
                    var _this = this;
                    DiagnosticsHub.getCurrentSession().canStopCollection().then(function (canStop) {
                        _this._isDisabled = !canStop;

                        if (_this.onDisabledChanged) {
                            _this.onDisabledChanged();
                        }
                    });
                };
                return StopCollectionCommand;
            })();
            DiagnosticsHub.StopCollectionCommand = StopCollectionCommand;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var SwimlaneViewConstants = (function () {
                function SwimlaneViewConstants() {
                }
                SwimlaneViewConstants.OneHourInNs = DiagnosticsHub.BigNumber.convertFromNumber(60 * 60 * 1000000000);

                SwimlaneViewConstants.MinSelectionInPixels = 10;

                SwimlaneViewConstants.InfobarRendererPriority = 0;
                SwimlaneViewConstants.ToolbarRendererPriority = 5;
                SwimlaneViewConstants.RulerRendererPriority = 10;
                return SwimlaneViewConstants;
            })();
            DiagnosticsHub.SwimlaneViewConstants = SwimlaneViewConstants;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var CountersDataSeries = (function () {
                function CountersDataSeries(counterId, timespan, unitConverter, colorScheme, drawFill, title, tooltip) {
                    var _this = this;
                    this._cachedPoints = [];
                    this._drawFill = false;
                    this._dataWarehouseRequestHandle = 1;
                    this._droppedRequest = false;
                    this._currentTimespan = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.zero, DiagnosticsHub.BigNumber.zero);
                    this._seriesMin = 0;
                    this._seriesMax = 0;
                    this._newDataEvent = new DiagnosticsHub.AggregatedEvent();
                    this._samples = 250;
                    this._currentTimespan = timespan;
                    this._unitConverter = unitConverter;
                    this._colorScheme = colorScheme;
                    this._drawFill = drawFill;
                    this._title = title;
                    this._tooltip = tooltip;

                    this._marker = document.createElement("div");
                    this._marker.classList.add("countersDataSeries-marker");
                    this._marker.style.backgroundColor = this._colorScheme.lineColor;
                    this._marker.style.width = (2 * CountersDataSeries.PointRadiusInPixels) + "px";
                    this._marker.style.height = (2 * CountersDataSeries.PointRadiusInPixels) + "px";

                    Microsoft.VisualStudio.DiagnosticsHub.DataWarehouse.loadDataWarehouse().then(function (dw) {
                        var countersContextData = {
                            customDomain: {
                                Task: "GetCounter",
                                CounterId: counterId
                            }
                        };

                        return dw.getFilteredData(countersContextData, CountersDataSeries.analyzerId);
                    }).then(function (responseData) {
                        _this._countersResult = responseData;
                    }).done(function () {
                        _this._dataWarehouseRequestHandle = null;
                        _this._droppedRequest = false;
                        _this.requestUpdate();
                    });
                }
                Object.defineProperty(CountersDataSeries, "analyzerId", {
                    get: function () {
                        return "66EDDDF1-2277-40F3-983A-6FF57A433ECB";
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(CountersDataSeries.prototype, "minValue", {
                    get: function () {
                        return this._seriesMin;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(CountersDataSeries.prototype, "maxValue", {
                    get: function () {
                        return this._seriesMax;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(CountersDataSeries.prototype, "marker", {
                    get: function () {
                        return this._marker;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(CountersDataSeries.prototype, "title", {
                    get: function () {
                        return this._title;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(CountersDataSeries.prototype, "tooltip", {
                    get: function () {
                        return this._tooltip;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(CountersDataSeries.prototype, "newDataEvent", {
                    get: function () {
                        return this._newDataEvent;
                    },
                    enumerable: true,
                    configurable: true
                });

                CountersDataSeries.prototype.dispose = function () {
                    this._countersResult.dispose();
                    this._newDataEvent.dispose();
                };

                CountersDataSeries.prototype.onViewportChanged = function (viewport) {
                    this._currentTimespan = viewport;
                    this.requestUpdate();
                };

                CountersDataSeries.prototype.onDataUpdate = function (timestampNs) {
                    var cachedPointCount = this._cachedPoints.length;
                    if (this._currentTimespan.contains(timestampNs) || cachedPointCount === 0) {
                        this.requestUpdate();
                    } else if (cachedPointCount > 0 && this._currentTimespan.end.greater(this._cachedPoints[cachedPointCount - 1].Timestamp)) {
                        this.requestUpdate();
                    }
                };

                CountersDataSeries.prototype.getPointAtTimestamp = function (timestamp, pointToFind) {
                    if (typeof pointToFind === "undefined") { pointToFind = 1 /* Nearest */; }
                    if (this._cachedPoints.length === 0) {
                        return null;
                    }

                    var point = { Timestamp: timestamp, Value: 0 };
                    var pointCompare = function (left, right) {
                        return right.Timestamp.greater(left.Timestamp);
                    };

                    switch (pointToFind) {
                        case 0 /* LessThanOrEqual */:
                            var index = DiagnosticsHub.Utilities.findLessThan(this._cachedPoints, point, pointCompare);
                            point = this._cachedPoints[index];
                            break;
                        case 2 /* GreaterThanOrEqual */:
                            var index = DiagnosticsHub.Utilities.findGreaterThan(this._cachedPoints, point, pointCompare);
                            point = this._cachedPoints[index];
                            break;
                        case 1 /* Nearest */:
                        default:
                            var minIndex = DiagnosticsHub.Utilities.findLessThan(this._cachedPoints, point, pointCompare);
                            var maxIndex = Math.min(minIndex + 1, this._cachedPoints.length - 1);
                            var minDelta = DiagnosticsHub.BigNumber.subtract(timestamp, this._cachedPoints[minIndex].Timestamp);
                            var maxDelta = DiagnosticsHub.BigNumber.subtract(this._cachedPoints[maxIndex].Timestamp, timestamp);
                            var index = minDelta.greater(maxDelta) ? maxIndex : minIndex;
                            point = this._cachedPoints[index];

                            break;
                    }

                    return {
                        timestamp: point.Timestamp,
                        tooltip: Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ChartSeriesFormattableTooltipLabel", this._unitConverter.formatNumber(point.Value)),
                        value: point.Value,
                        color: this._colorScheme
                    };
                };

                CountersDataSeries.prototype.draw = function (context, graphInformation) {
                    if (this._cachedPoints.length === 0 || graphInformation.gridX.elapsed.equals(DiagnosticsHub.BigNumber.zero) || graphInformation.chartRect.width <= 0) {
                        return;
                    }

                    if (graphInformation.chartRect.width !== this._samples) {
                        this._samples = graphInformation.chartRect.width;
                        this.requestUpdate();
                    }

                    var getYCoordinate = function (value) {
                        return graphInformation.chartRect.height - DiagnosticsHub.Utilities.scaleToRange(value, graphInformation.gridY.min, graphInformation.gridY.max, 0, graphInformation.chartRect.height);
                    };
                    var getXCoordinate = function (timestamp) {
                        return DiagnosticsHub.Utilities.convertToPixel(timestamp, graphInformation.gridX, graphInformation.chartRect.width, false);
                    };

                    context.save();

                    context.lineWidth = (graphInformation.chartRect.height < 100 ? 1 : 2);
                    context.fillStyle = this._colorScheme.lineFillColor;
                    context.strokeStyle = this._colorScheme.lineColor;

                    var initialxPx = Microsoft.Plugin.F12 ? 0 : getXCoordinate(this._cachedPoints[0].Timestamp);

                    context.beginPath();
                    context.moveTo(initialxPx, getYCoordinate(this._cachedPoints[0].Value));
                    this._cachedPoints.forEach(function (point) {
                        return context.lineTo(getXCoordinate(point.Timestamp), getYCoordinate(point.Value));
                    });
                    context.stroke();

                    if (this._drawFill) {
                        context.lineTo(getXCoordinate(this._cachedPoints[this._cachedPoints.length - 1].Timestamp), getYCoordinate(graphInformation.gridY.min));
                        context.lineTo(initialxPx, graphInformation.chartRect.height);
                        context.closePath();
                        context.fill();
                    }

                    var elapsedPerPixel = DiagnosticsHub.BigNumber.divideNumber(graphInformation.gridX.elapsed, graphInformation.chartRect.width);
                    if (DiagnosticsHub.BigNumber.convertFromNumber(CountersDataSeries.CounterFrequencyPerPixel).greater(elapsedPerPixel)) {
                        this._cachedPoints.forEach(function (point) {
                            context.beginPath();
                            context.arc(getXCoordinate(point.Timestamp), getYCoordinate(point.Value), CountersDataSeries.PointRadiusInPixels, 0, 2 * Math.PI);
                            context.fill();
                        });
                    }

                    context.restore();
                };

                CountersDataSeries.prototype.requestUpdate = function () {
                    var _this = this;
                    if (this._dataWarehouseRequestHandle) {
                        this._droppedRequest = true;
                        return;
                    }

                    this._dataWarehouseRequestHandle = window.setTimeout(function () {
                        if (_this._currentTimespan.elapsed.equals(DiagnosticsHub.BigNumber.zero)) {
                            _this._dataWarehouseRequestHandle = null;
                            return;
                        }

                        var bufferTime = DiagnosticsHub.BigNumber.divideNumber(_this._currentTimespan.elapsed, 2);
                        var bufferStart = DiagnosticsHub.BigNumber.subtract(_this._currentTimespan.begin, DiagnosticsHub.BigNumber.min(bufferTime, _this._currentTimespan.begin));

                        var snappedStart = DiagnosticsHub.BigNumber.multiply(DiagnosticsHub.BigNumber.divide(bufferStart, _this._currentTimespan.elapsed), _this._currentTimespan.elapsed);
                        var snappedEnd = DiagnosticsHub.BigNumber.add(snappedStart, DiagnosticsHub.BigNumber.multiplyNumber(_this._currentTimespan.elapsed, 3));

                        var requestData = {
                            type: "SamplePoints",
                            begin: snappedStart.jsonValue,
                            end: snappedEnd.jsonValue,
                            samples: Math.max(_this._samples, 2)
                        };

                        _this._countersResult.getResult(requestData).then(function (result) {
                            return _this.cachePoints(result);
                        }).done(function () {
                            _this._dataWarehouseRequestHandle = null;
                            if (_this._droppedRequest) {
                                window.setTimeout(_this.requestUpdate.bind(_this), DiagnosticsHub.Constants.TimeoutImmediate);
                                _this._droppedRequest = false;
                            }
                        });
                    }, DiagnosticsHub.Constants.TimeoutImmediate);
                };

                CountersDataSeries.prototype.cachePoints = function (result) {
                    var _this = this;
                    this._cachedPoints = result.p.map(function (point) {
                        var timestamp = new DiagnosticsHub.BigNumber(point.t.h, point.t.l);

                        _this._seriesMin = Math.min(_this._seriesMin, point.v);
                        _this._seriesMax = Math.max(_this._seriesMax, point.v);

                        return {
                            Timestamp: timestamp,
                            Value: point.v,
                            ToolTip: point.tt
                        };
                    });

                    this._newDataEvent.invokeEvent(this);
                };
                CountersDataSeries.PointRadiusInPixels = 2.5;

                CountersDataSeries.CounterFrequencyPerPixel = (100 * 1000 * 1000) / ((CountersDataSeries.PointRadiusInPixels * 2) + 4);
                return CountersDataSeries;
            })();
            DiagnosticsHub.CountersDataSeries = CountersDataSeries;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var ChartSeries = (function () {
                function ChartSeries(index, counterId, legendText, formattableTooltipText, type, color, unitConverter) {
                    this._minValue = Number.MAX_VALUE;
                    this._maxValue = Number.MIN_VALUE;
                    this._renderedPoints = [];
                    this._newDataEvent = new DiagnosticsHub.AggregatedEvent();
                    this._data = [];
                    this.counterId = counterId;
                    this._legendText = legendText;

                    this._formattableTooltipText = formattableTooltipText || Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ChartSeriesFormattableTooltipLabel");
                    this._unitConverter = unitConverter;
                    this._type = type;
                    this._color = color;

                    this._marker = document.createElement("div");
                    this._marker.classList.add("countersDataSeries-marker");
                    this._marker.style.backgroundColor = color.lineColor;

                    this._marker.style.width = "5px";
                    this._marker.style.height = "5px";

                    if (this._type && this._type === DiagnosticsHub.SeriesType.StepLine) {
                        this._renderer = new DiagnosticsHub.StepLineSeriesRenderer(index, color);
                    } else {
                        this._renderer = new DiagnosticsHub.LineSeriesRenderer(index, color);
                    }
                }
                Object.defineProperty(ChartSeries.prototype, "length", {
                    get: function () {
                        return this._data.length;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ChartSeries.prototype, "index", {
                    get: function () {
                        return this._renderer.index;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ChartSeries.prototype, "minValue", {
                    get: function () {
                        return this._minValue;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ChartSeries.prototype, "maxValue", {
                    get: function () {
                        return this._maxValue;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ChartSeries.prototype, "marker", {
                    get: function () {
                        return this._marker;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ChartSeries.prototype, "title", {
                    get: function () {
                        return this._legendText;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ChartSeries.prototype, "newDataEvent", {
                    get: function () {
                        return this._newDataEvent;
                    },
                    enumerable: true,
                    configurable: true
                });

                ChartSeries.getYCoordinate = function (y, top, height, yMax, yRange) {
                    return top + ((yMax - y) / yRange) * height;
                };

                ChartSeries.prototype.dispose = function () {
                    this._newDataEvent.dispose();
                };

                ChartSeries.prototype.onViewportChanged = function (viewport) {
                };

                ChartSeries.prototype.draw = function (context, info) {
                    var _this = this;
                    if (this._data.length === 0) {
                        return;
                    }

                    var pixelsPerGroup = 2;

                    this._renderedPoints = [];

                    var numberOfGroups = Math.floor(info.chartRect.width / pixelsPerGroup);
                    var dataTimespan = new DiagnosticsHub.JsonTimespan(this._data[0].Timestamp, this._data[this._data.length - 1].Timestamp);
                    var timePerGroup = DiagnosticsHub.BigNumber.divideNumber(info.gridX.elapsed, numberOfGroups);

                    var startGroup = Math.floor(parseInt(DiagnosticsHub.BigNumber.subtract(info.gridX.begin, dataTimespan.begin).value) / parseInt(timePerGroup.value));
                    var startTime = DiagnosticsHub.BigNumber.add(DiagnosticsHub.BigNumber.multiplyNumber(timePerGroup, startGroup), dataTimespan.begin);

                    var endTime = DiagnosticsHub.BigNumber.add(DiagnosticsHub.BigNumber.add(startTime, info.gridX.elapsed), timePerGroup);
                    var startIndex = this.getPointIndex(this._data, startTime, 0, this._data.length - 1, 0 /* LessThanOrEqual */);
                    var endIndex = this.getPointIndex(this._data, endTime, 0, this._data.length - 1, 2 /* GreaterThanOrEqual */);

                    var filter = function (startIdx, endIdx) {
                        var point = _this._data[startIdx];
                        var value = 0;

                        for (var index = startIdx; index <= endIdx; ++index) {
                            value = Math.max(value, _this._data[index].Value);
                        }

                        return {
                            Timestamp: point.Timestamp,
                            seriesIndex: _this._renderer.index,
                            ToolTip: point.ToolTip,
                            Value: value,
                            xPx: parseInt(DiagnosticsHub.BigNumber.subtract(point.Timestamp, info.gridX.begin).value) / parseInt(info.gridX.elapsed.value) * info.chartRect.width,
                            yPx: Math.floor(ChartSeries.getYCoordinate(value, info.chartRect.top, info.chartRect.height, info.gridY.max, info.gridY.range))
                        };
                    };

                    var partition = function (timestamp, startIdx, endIdx, numOfGroups) {
                        if (numOfGroups >= endIdx - startIdx) {
                            for (var point = startIdx; point <= endIdx; ++point) {
                                _this._renderedPoints.push(filter(point, point));
                            }
                        } else if (numOfGroups === 1) {
                            _this._renderedPoints.push(filter(startIdx, endIdx));
                        } else {
                            var leftGroups = Math.floor(numOfGroups / 2);
                            var rightGroups = numOfGroups - leftGroups;

                            var partitionTimestamp = DiagnosticsHub.BigNumber.add(timestamp, DiagnosticsHub.BigNumber.multiplyNumber(timePerGroup, leftGroups));
                            var partitionIndex = _this.getPointIndex(_this._data, partitionTimestamp, startIdx, endIdx, 0 /* LessThanOrEqual */);

                            partition(timestamp, startIdx, partitionIndex, leftGroups);
                            partition(partitionTimestamp, partitionIndex, endIdx, rightGroups);
                        }
                    };

                    partition(startTime, startIndex, endIndex, numberOfGroups);
                    this._renderer.render(context, this._renderedPoints, info);
                };

                ChartSeries.prototype.addData = function (points) {
                    var _this = this;
                    if (!points || points.length === 0) {
                        return;
                    }

                    var previousPoint;
                    if (this._data.length !== 0) {
                        previousPoint = this._data[this._data.length - 1];
                    } else {
                        previousPoint = points[0];
                    }

                    var filteredList = points.filter(function (point) {
                        if (!point.Timestamp || !point.Timestamp.greaterOrEqual(previousPoint.Timestamp)) {
                            return false;
                        }

                        _this._maxValue = Math.max(_this._maxValue, point.Value);
                        _this._minValue = Math.min(_this._minValue, point.Value);

                        previousPoint = point;
                        return true;
                    });

                    this._data.push.apply(this._data, filteredList);
                    this._newDataEvent.invokeEvent(this);
                };

                ChartSeries.prototype.removeInvalidPoints = function (base) {
                    if (this._data.length === 0) {
                        return;
                    }

                    this._data.splice(0, this.getPointIndex(this._data, base, 0, this._data.length - 1, 0 /* LessThanOrEqual */));
                };

                ChartSeries.prototype.clearData = function () {
                    this._data = [];
                    this._maxValue = Number.MIN_VALUE;
                    this._minValue = Number.MAX_VALUE;
                };

                ChartSeries.prototype.getPointAtTimestamp = function (timestamp, pointToFind) {
                    if (typeof pointToFind === "undefined") { pointToFind = 1 /* Nearest */; }
                    if (this._renderedPoints.length === 0) {
                        return null;
                    }

                    var pointTime = timestamp;
                    var pointValue = 0;

                    if (pointToFind === 1 /* Nearest */) {
                        var lowIndex = this.getPointIndex(this._renderedPoints, timestamp, 0, this._renderedPoints.length - 1, 0 /* LessThanOrEqual */);
                        var lowPoint = this._renderedPoints[lowIndex];

                        if (lowIndex === this._renderedPoints.length - 1 || this._renderedPoints[0].Timestamp.greater(timestamp)) {
                            pointValue = lowPoint.Value;
                            pointTime = lowPoint.Timestamp;
                        } else if (this._type === DiagnosticsHub.SeriesType.StepLine) {
                            pointValue = lowPoint.Value;
                        } else {
                            var highPoint = this._renderedPoints[Math.min(lowIndex + 1, this._renderedPoints.length - 1)];
                            var pointValue = DiagnosticsHub.Utilities.linearInterpolate(timestamp, lowPoint.Timestamp, lowPoint.Value, highPoint.Timestamp, highPoint.Value);
                        }
                    } else {
                        var point = this._renderedPoints[this.getPointIndex(this._renderedPoints, timestamp, 0, this._renderedPoints.length - 1, pointToFind)];
                        pointValue = point.Value;
                        pointTime = point.Timestamp;
                    }

                    return {
                        timestamp: pointTime,
                        tooltip: DiagnosticsHub.Utilities.formatString(this._formattableTooltipText, this._unitConverter.formatNumber(pointValue)),
                        color: this._color,
                        value: pointValue
                    };
                };

                ChartSeries.prototype.getPointIndex = function (list, timestamp, minIndex, maxIndex, indexToFind) {
                    var pointComparator = function (left, right) {
                        return right.Timestamp.greater(left.Timestamp);
                    };

                    var pointToFind = { Timestamp: timestamp, Value: 0 };

                    switch (indexToFind) {
                        case 0 /* LessThanOrEqual */:
                            return DiagnosticsHub.Utilities.findLessThan(list, pointToFind, pointComparator, minIndex, maxIndex);
                        case 2 /* GreaterThanOrEqual */:
                            return DiagnosticsHub.Utilities.findGreaterThan(list, pointToFind, pointComparator, minIndex, maxIndex);
                        case 1 /* Nearest */:
                        default:
                            var minIndex = DiagnosticsHub.Utilities.findLessThan(list, pointToFind, pointComparator);
                            var maxIndex = Math.min(minIndex + 1, list.length - 1);
                            var minDelta = DiagnosticsHub.BigNumber.subtract(timestamp, list[minIndex].Timestamp);
                            var maxDelta = DiagnosticsHub.BigNumber.subtract(list[maxIndex].Timestamp, timestamp);
                            return minDelta.greater(maxDelta) ? maxIndex : minIndex;
                    }
                };
                return ChartSeries;
            })();
            DiagnosticsHub.ChartSeries = ChartSeries;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var CustomCounterDataSeries = (function (_super) {
                __extends(CustomCounterDataSeries, _super);
                function CustomCounterDataSeries(counterId, analyzerId, legendText, formattableTooltipText, type, color, unitConverter) {
                    var _this = this;
                    _super.call(this, 0, counterId, legendText, formattableTooltipText, type, color, unitConverter);
                    this._dataWarehouseRequestHandle = 1;
                    this._droppedRequest = false;

                    this._analyzerId = analyzerId;
                    this._context = {
                        customDomain: {
                            Task: "GetCounter",
                            CounterId: counterId
                        }
                    };

                    Microsoft.VisualStudio.DiagnosticsHub.DataWarehouse.loadDataWarehouse().done(function (dw) {
                        _this._dataWarehouseHandle = dw;
                        _this._dataWarehouseRequestHandle = null;
                        _this._droppedRequest = false;
                        _this.requestUpdate();
                    });
                }
                CustomCounterDataSeries.prototype.onDataUpdate = function (timestamp) {
                    this.requestUpdate();
                };

                CustomCounterDataSeries.prototype.requestUpdate = function () {
                    var _this = this;
                    if (this._dataWarehouseRequestHandle) {
                        this._droppedRequest = true;
                        return;
                    }

                    this._dataWarehouseRequestHandle = window.setTimeout(function () {
                        _this._dataWarehouseHandle.getFilteredData(_this._context, _this._analyzerId).then(function (result) {
                            if (typeof result.getResult === "function") {
                                return result.getResult(null).then(function (counterResult) {
                                    result.dispose();
                                    return counterResult;
                                });
                            }

                            return result;
                        }).then(function (counterResult) {
                            return counterResult.p;
                        }).then(function (counterResultPoints) {
                            return _this.convertDtoToIPointArray(counterResultPoints);
                        }).then(function (convertedPoints) {
                            _this.clearData();
                            _this.addData(convertedPoints);
                        }).done(function () {
                            _this._dataWarehouseRequestHandle = null;
                            if (_this._droppedRequest) {
                                window.setTimeout(_this.requestUpdate.bind(_this), DiagnosticsHub.Constants.TimeoutImmediate);
                                _this._droppedRequest = false;
                            }
                        });
                    }, DiagnosticsHub.Constants.TimeoutImmediate);
                };

                CustomCounterDataSeries.prototype.convertDtoToIPointArray = function (dto) {
                    return dto.map(function (dtoPoint) {
                        return {
                            Timestamp: new DiagnosticsHub.BigNumber(dtoPoint.t.h, dtoPoint.t.l),
                            Value: dtoPoint.v,
                            ToolTip: dtoPoint.tt,
                            CustomData: dtoPoint.d
                        };
                    });
                };
                return CustomCounterDataSeries;
            })(DiagnosticsHub.ChartSeries);
            DiagnosticsHub.CustomCounterDataSeries = CustomCounterDataSeries;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var MultiSeriesGraph = (function () {
                function MultiSeriesGraph(config, additionalGraphSeries) {
                    var _this = this;
                    this._logger = Microsoft.VisualStudio.DiagnosticsHub.getLogger();
                    this._colorScheme = new DiagnosticsHub.ChartColorScheme("rgb(118, 174, 200)", "rgba(118, 174, 200, 0.65)");
                    this._currentTimespan = new DiagnosticsHub.JsonTimespan(DiagnosticsHub.BigNumber.zero, DiagnosticsHub.BigNumber.zero);
                    this._dataSeries = [];
                    this._clientWidth = 0;
                    this._clientHeight = 0;
                    this._scaleIncreaseRatio = 1.1;
                    this._scaleChangedEvent = new DiagnosticsHub.AggregatedEvent();
                    this._container = document.createElement("div");
                    this._container.classList.add("graphContainer");
                    this._container.tabIndex = 0;

                    this._canvas = document.createElement("canvas");
                    this._canvas.classList.add("graph-canvas");

                    this._context = this._canvas.getContext("2d");

                    this._unitConverter = new DiagnosticsHub.LocalizedUnitConverter(config.jsonConfig.Units, config.resources);
                    this._currentTimespan = config.timeRange;
                    this._scaleMin = config.scale.minimum;
                    this._scaleMax = config.scale.maximum;
                    this._isScaleFixed = config.scale.isFixed;
                    this._onNewSeriesDataBoundFunction = this.onNewSeriesData.bind(this);

                    if (config.jsonConfig.Unit) {
                        config.unit = config.resources[config.jsonConfig.Unit];
                    }

                    this._container.appendChild(this._canvas);

                    var drawFill = true;
                    config.jsonConfig.Series.forEach(function (seriesConfig) {
                        var series;
                        if (seriesConfig.DataSource.AnalyzerId.toLowerCase() === DiagnosticsHub.CountersDataSeries.analyzerId.toLowerCase()) {
                            series = new DiagnosticsHub.CountersDataSeries(seriesConfig.DataSource.CounterId, _this._currentTimespan, _this._unitConverter, _this._colorScheme, drawFill, config.resources[seriesConfig.Legend], config.resources[seriesConfig.LegendTooltip]);
                        } else {
                            series = new DiagnosticsHub.CustomCounterDataSeries(seriesConfig.DataSource.CounterId, seriesConfig.DataSource.AnalyzerId, config.resources[seriesConfig.Legend], config.resources[seriesConfig.LegendTooltip], seriesConfig.SeriesType, _this._colorScheme, _this._unitConverter);
                        }

                        config.legend.push({
                            legendText: series.title,
                            legendTooltip: series.tooltip,
                            marker: series.marker
                        });

                        series.newDataEvent.addEventListener(_this._onNewSeriesDataBoundFunction);
                        _this._dataSeries.push(series);
                    });

                    if (additionalGraphSeries) {
                        additionalGraphSeries.forEach(function (additionalSeries) {
                            additionalSeries.newDataEvent.addEventListener(_this._onNewSeriesDataBoundFunction);
                            _this._dataSeries.push(additionalSeries);
                        });
                    }

                    if (config.jsonConfig.Unit) {
                        config.unit = config.resources[config.jsonConfig.Unit];
                    }

                    this._dataCursor = new DiagnosticsHub.DataCursor(this._container, this._dataSeries, this._currentTimespan, config.swimlaneId, this._scaleMin, this._scaleMax);
                    this._scaleChangedEvent.addEventListener(this._dataCursor.onScaleChanged.bind(this._dataCursor));
                    this._container.appendChild(this._dataCursor.container);
                }
                Object.defineProperty(MultiSeriesGraph.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(MultiSeriesGraph.prototype, "scaleChangedEvent", {
                    get: function () {
                        return this._scaleChangedEvent;
                    },
                    enumerable: true,
                    configurable: true
                });

                MultiSeriesGraph.prototype.dispose = function () {
                    var _this = this;
                    this._dataCursor.dispose();
                    this._dataSeries.forEach(function (series) {
                        series.newDataEvent.removeEventListener(_this._onNewSeriesDataBoundFunction);

                        if (series.dispose) {
                            series.dispose();
                        }
                    });

                    this._scaleChangedEvent.dispose();
                };

                MultiSeriesGraph.prototype.resize = function (evt) {
                    var width = this._container.clientWidth;
                    var height = this._container.clientHeight;

                    if (this._clientWidth === width && this._clientHeight === height) {
                        return;
                    }

                    this._clientWidth = width;
                    this._clientHeight = height;

                    this._canvas.width = this._clientWidth;
                    this._canvas.height = this._clientHeight;

                    this._dataCursor.resize(evt);

                    this.draw();
                };

                MultiSeriesGraph.prototype.onDataUpdate = function (timestampNs) {
                    this._dataSeries.forEach(function (series) {
                        if (series.onDataUpdate) {
                            series.onDataUpdate(timestampNs);
                        }
                    });
                };

                MultiSeriesGraph.prototype.addSeriesData = function (counterId, points, fullRender, dropOldData) {
                };

                MultiSeriesGraph.prototype.removeInvalidPoints = function (base) {
                };

                MultiSeriesGraph.prototype.render = function (fullRender, refresh) {
                };

                MultiSeriesGraph.prototype.onViewportChanged = function (viewportArgs) {
                    var _this = this;
                    if (viewportArgs.isIntermittent || this._currentTimespan.equals(viewportArgs.currentTimespan)) {
                        return;
                    }

                    this._currentTimespan = viewportArgs.currentTimespan;
                    this._dataCursor.onViewportChanged(viewportArgs);

                    this._dataSeries.forEach(function (series) {
                        series.onViewportChanged(_this._currentTimespan);
                    });

                    this.draw();
                };

                MultiSeriesGraph.prototype.onNewSeriesData = function (series) {
                    var scaleChanged = false;

                    if (!this._isScaleFixed && !isNaN(series.minValue) && series.minValue < this._scaleMin) {
                        this._scaleMin = series.minValue;
                        scaleChanged = true;
                    }

                    if (!this._isScaleFixed && !isNaN(series.maxValue) && series.maxValue * this._scaleIncreaseRatio > this._scaleMax) {
                        this._scaleMax = series.maxValue * this._scaleIncreaseRatio;
                        scaleChanged = true;
                    }

                    this.draw();

                    if (scaleChanged) {
                        var scaledMax = this._unitConverter.scaleValue(this._scaleMax);
                        this._scaleChangedEvent.invokeEvent({
                            minimum: this._scaleMin,
                            maximum: this._scaleMax,
                            unit: scaledMax.unit
                        });
                    }
                };

                MultiSeriesGraph.prototype.draw = function () {
                    var _this = this;
                    this._context.clearRect(0, 0, this._clientWidth, this._clientHeight);
                    this._context.save();

                    var graphInfo = {
                        gridX: this._currentTimespan,
                        gridY: new DiagnosticsHub.MinMaxNumber(this._scaleMin, this._scaleMax),
                        chartRect: new DiagnosticsHub.RectangleDimension(0, 0, this._clientWidth, this._clientHeight)
                    };

                    this._dataSeries.forEach(function (series) {
                        series.draw(_this._context, graphInfo);
                    });

                    this._context.restore();
                };
                return MultiSeriesGraph;
            })();
            DiagnosticsHub.MultiSeriesGraph = MultiSeriesGraph;

            Microsoft.VisualStudio.DiagnosticsHub.RegisterNamespace.registerClass("Microsoft.VisualStudio.DiagnosticsHub.MultiSeriesGraph");
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var DataCursor = (function () {
                function DataCursor(parent, series, viewport, swimlaneId, scaleMin, scaleMax) {
                    var _this = this;
                    this._parentClientWidth = 0;
                    this._parentClientHeight = 0;
                    this._timePerPixel = DiagnosticsHub.BigNumber.one;
                    this._cursors = [];
                    this._showingTooltip = false;
                    this._tooltipTimer = null;
                    this._telemetry = new DiagnosticsHub.Telemetry.ViewportController();
                    this._parent = parent;
                    this._series = series;
                    this._viewport = viewport;
                    this._previousTime = this._viewport.begin;
                    this._scaleMin = scaleMin;
                    this._scaleMax = scaleMax;

                    this._container = document.createElement("div");
                    this._container.classList.add("dataCursor");
                    this._container.classList.add("hidden");

                    this._cursors = series.map(function (dataSeries) {
                        var cursorDomElement = dataSeries.marker.cloneNode(true);
                        cursorDomElement.classList.add("dataCursorPoint");

                        document.body.appendChild(cursorDomElement);
                        var width = cursorDomElement.clientWidth + 2;
                        var height = cursorDomElement.clientHeight + 2;
                        document.body.removeChild(cursorDomElement);

                        cursorDomElement.style.left = (-width / 2) + "px";
                        cursorDomElement.style.width = width + "px";
                        cursorDomElement.style.height = height + "px";
                        _this._container.appendChild(cursorDomElement);

                        return {
                            domElement: cursorDomElement,
                            width: width,
                            height: height
                        };
                    });

                    this._swimlaneId = swimlaneId;

                    this._onMouseEnterBoundFunction = this.onMouseEnter.bind(this);
                    this._onMouseMoveBoundFunction = this.onMouseMove.bind(this);
                    this._onMouseLeaveBoundFunction = this.onMouseLeave.bind(this);
                    this._onKeyDownBoundFunction = this.onKeyDown.bind(this);

                    this._parent.setAttribute("role", "slider");
                    this._parent.setAttribute("aria-live", "polite");
                    this._parent.addEventListener("mouseenter", this._onMouseEnterBoundFunction);
                    this._parent.addEventListener("mousemove", this._onMouseMoveBoundFunction);
                    this._parent.addEventListener("mouseleave", this._onMouseLeaveBoundFunction);
                    this._parent.addEventListener("keydown", this._onKeyDownBoundFunction);
                }
                Object.defineProperty(DataCursor.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                DataCursor.prototype.dispose = function () {
                    this._parent.removeEventListener("mouseenter", this._onMouseEnterBoundFunction);
                    this._parent.removeEventListener("mousemove", this._onMouseMoveBoundFunction);
                    this._parent.removeEventListener("mouseleave", this._onMouseLeaveBoundFunction);
                    this._parent.removeEventListener("keydown", this._onKeyDownBoundFunction);
                };

                DataCursor.prototype.resize = function (evt) {
                    this._parentClientWidth = this._parent.clientWidth;
                    this._parentClientHeight = this._parent.clientHeight;

                    this._timePerPixel = this._parentClientWidth !== 0 ? DiagnosticsHub.BigNumber.divideNumber(this._viewport.elapsed, this._parentClientWidth) : DiagnosticsHub.BigNumber.one;
                };

                DataCursor.prototype.onViewportChanged = function (viewportArgs) {
                    if (this._viewport.equals(viewportArgs.currentTimespan)) {
                        return;
                    }

                    this._viewport = viewportArgs.currentTimespan;
                    this._previousTime = this._viewport.begin;

                    this._timePerPixel = this._parentClientWidth !== 0 ? DiagnosticsHub.BigNumber.divideNumber(this._viewport.elapsed, this._parentClientWidth) : DiagnosticsHub.BigNumber.one;

                    this.dismissTooltip();
                    this._container.classList.add("hidden");
                };

                DataCursor.prototype.onScaleChanged = function (scaleArgs) {
                    this._scaleMax = scaleArgs.maximum;
                    this._scaleMax = scaleArgs.maximum;
                };

                DataCursor.prototype.onKeyDown = function (event) {
                    if (event.keyCode !== 37 /* ArrowLeft */ && event.keyCode !== 39 /* ArrowRight */) {
                        return;
                    }

                    event.preventDefault();

                    var boundingRect = event.currentTarget.getBoundingClientRect();
                    var previousTimestamp = this._previousTime;

                    var pointToFind;
                    if (event.keyCode === 39 /* ArrowRight */) {
                        this._previousTime = DiagnosticsHub.BigNumber.add(this._previousTime, this._timePerPixel);
                        pointToFind = 2 /* GreaterThanOrEqual */;
                    } else {
                        this._previousTime = this._previousTime.greater(this._timePerPixel) ? DiagnosticsHub.BigNumber.subtract(this._previousTime, this._timePerPixel) : DiagnosticsHub.BigNumber.zero;
                        pointToFind = 0 /* LessThanOrEqual */;
                    }

                    var currentPoints = this.getPointsAt(this._previousTime, pointToFind);
                    if (currentPoints.length === 0) {
                        return;
                    }

                    var nearestTimestamp = currentPoints[0].seriesElement.timestamp;
                    if (nearestTimestamp.equals(previousTimestamp) || nearestTimestamp.greater(this._viewport.end) || this._viewport.begin.greater(nearestTimestamp)) {
                        this._previousTime = event.keyCode === 39 /* ArrowRight */ ? this._viewport.begin : this._viewport.end;
                        currentPoints = this.getPointsAt(this._previousTime, pointToFind);
                        nearestTimestamp = currentPoints[0].seriesElement.timestamp;
                    }

                    this._previousTime = nearestTimestamp;
                    this.updateCursorLocation(nearestTimestamp, currentPoints);

                    this.dismissTooltip();
                    this.displayTooltip(boundingRect, nearestTimestamp, currentPoints);
                };

                DataCursor.prototype.onMouseEnter = function (event) {
                    this._container.classList.remove("hidden");
                };

                DataCursor.prototype.onMouseMove = function (event) {
                    var boundingRect = event.currentTarget.getBoundingClientRect();
                    var mouseTimestamp = DiagnosticsHub.Utilities.getTimestampAtPixel(event.clientX - boundingRect.left, this._parentClientWidth, this._viewport);

                    if (mouseTimestamp.equals(this._previousTime)) {
                        return;
                    }

                    this._previousTime = mouseTimestamp;
                    var boundingRect = event.currentTarget.getBoundingClientRect();
                    var points = this.getPointsAt(mouseTimestamp);

                    if (points.length === 0) {
                        this._container.classList.add("hidden");
                        return;
                    }

                    var nearestTimestamp = points[0].seriesElement.timestamp;
                    var delta = DiagnosticsHub.BigNumber.subtract(DiagnosticsHub.BigNumber.max(nearestTimestamp, mouseTimestamp), DiagnosticsHub.BigNumber.min(nearestTimestamp, mouseTimestamp));
                    var threshold = DiagnosticsHub.BigNumber.multiplyNumber(this._timePerPixel, DataCursor.SnapThresholdInPixels);
                    var isInterpolating = delta.greater(threshold);

                    if (isInterpolating) {
                        this._container.classList.add("interpolating");
                        this.updateCursorLocation(mouseTimestamp, points);
                    } else {
                        this._container.classList.remove("interpolating");
                        this.updateCursorLocation(nearestTimestamp, points);
                    }

                    this.dismissTooltip();
                    this.displayTooltip(boundingRect, mouseTimestamp, points, isInterpolating);
                };

                DataCursor.prototype.onMouseLeave = function (event) {
                    var mouseTimestamp = DiagnosticsHub.Utilities.getTimestampAtPixel(event.x, this._parentClientWidth, this._viewport);

                    if (this._showingTooltip && mouseTimestamp.equals(this._previousTime)) {
                        return;
                    }

                    this.dismissTooltip();
                    this._container.classList.add("hidden");
                    this._previousTime = this._viewport.begin;
                };

                DataCursor.prototype.getPointsAt = function (timestamp, pointToFind) {
                    var _this = this;
                    if (typeof pointToFind === "undefined") { pointToFind = 1 /* Nearest */; }
                    return this._series.map(function (series, seriesNumber) {
                        return {
                            seriesElement: series.getPointAtTimestamp(timestamp, pointToFind),
                            cursor: _this._cursors[seriesNumber]
                        };
                    }).filter(function (point) {
                        return point.seriesElement !== null;
                    }).sort(function (point1, point2) {
                        var delta1 = DiagnosticsHub.BigNumber.subtract(DiagnosticsHub.BigNumber.max(timestamp, point1.seriesElement.timestamp), DiagnosticsHub.BigNumber.min(timestamp, point1.seriesElement.timestamp));
                        var delta2 = DiagnosticsHub.BigNumber.subtract(DiagnosticsHub.BigNumber.max(timestamp, point2.seriesElement.timestamp), DiagnosticsHub.BigNumber.min(timestamp, point2.seriesElement.timestamp));
                        return delta1.compareTo(delta2);
                    }).filter(function (element, index, sortedElements) {
                        var delta = DiagnosticsHub.BigNumber.subtract(DiagnosticsHub.BigNumber.max(sortedElements[0].seriesElement.timestamp, element.seriesElement.timestamp), DiagnosticsHub.BigNumber.min(sortedElements[0].seriesElement.timestamp, element.seriesElement.timestamp));
                        return _this._timePerPixel.greater(delta);
                    });
                };

                DataCursor.prototype.updateCursorLocation = function (timestamp, elements) {
                    var _this = this;
                    var x = DiagnosticsHub.Utilities.convertToPixel(timestamp, this._viewport, this._parentClientWidth);
                    this._container.style.left = Math.floor(x) + "px";

                    this._cursors.forEach(function (cursor) {
                        return cursor.domElement.style.visibility = "hidden";
                    });
                    elements.forEach(function (element) {
                        if (typeof (element.seriesElement.value) === "number") {
                            var y = DiagnosticsHub.Utilities.scaleToRange(element.seriesElement.value, _this._scaleMin, _this._scaleMax, 0, _this._parentClientHeight);
                            element.cursor.domElement.style.bottom = (y - element.cursor.height / 2) + "px";
                            element.cursor.domElement.style.visibility = "visible";
                        } else {
                            element.cursor.domElement.style.visibility = "visible";
                        }
                    });

                    this._container.classList.remove("hidden");
                };

                DataCursor.prototype.displayTooltip = function (boundingRect, timestamp, elements, isInterpolating) {
                    var _this = this;
                    if (typeof isInterpolating === "undefined") { isInterpolating = false; }
                    this._tooltipTimer = null;
                    this._showingTooltip = true;
                    var x = DiagnosticsHub.Utilities.convertToPixel(timestamp, this._viewport, this._parentClientWidth);

                    var toolTips = elements.map(function (element) {
                        return element.seriesElement.tooltip;
                    });

                    if (isInterpolating) {
                        toolTips.unshift(Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/DataCursorInterpolatingTooltip"));
                    }

                    if (toolTips.length > 0) {
                        var tooltip = toolTips.join("\n");
                        var ariaLabel = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ChartSeriesFormattableTimeLabel", DiagnosticsHub.RulerUtilities.formatTime(timestamp, 1 /* fullName */)) + "\n" + tooltip;
                        this._parent.setAttribute("aria-valuenow", ariaLabel);
                        this._parent.setAttribute("aria-valuetext", ariaLabel);

                        this._tooltipTimer = setTimeout(function () {
                            var message = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ChartSeriesFormattableTimeLabel", DiagnosticsHub.RulerUtilities.formatTime(timestamp)) + "\n" + tooltip;
                            var config = {
                                content: message,
                                delay: 0,
                                x: x + boundingRect.left + 10,
                                y: boundingRect.top
                            };

                            Microsoft.Plugin.Tooltip.show(config);
                            _this._telemetry.showGraphTooltip(_this._swimlaneId);
                        }, DiagnosticsHub.Constants.TooltipTimeoutMs);
                    }
                };

                DataCursor.prototype.dismissTooltip = function () {
                    clearTimeout(this._tooltipTimer);
                    this._tooltipTimer = null;
                    this._showingTooltip = false;
                    Microsoft.Plugin.Tooltip.dismiss();
                };
                DataCursor.SnapThresholdInPixels = 10;
                return DataCursor;
            })();
            DiagnosticsHub.DataCursor = DataCursor;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var GridLineRenderer = (function () {
                function GridLineRenderer(currentTimespan) {
                    this._clientWidth = 0;
                    this._clientHeight = 0;
                    this._container = document.createElement("canvas");
                    this._container.className = "gridLines";
                    this._container.style.zIndex = DiagnosticsHub.Constants.GridLineZIndex.toString();

                    this._context = this._container.getContext("2d");
                    this._context.lineWidth = 1;
                    this._strokeStyle = Microsoft.Plugin.Theme.getValue("diagnostics-host-graph-line");

                    this._currentTimespan = currentTimespan;

                    this._onThemeChangeBoundFunction = this.onThemeChange.bind(this);
                    Microsoft.Plugin.Theme.addEventListener("themechanged", this._onThemeChangeBoundFunction);
                }
                Object.defineProperty(GridLineRenderer.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                GridLineRenderer.prototype.dispose = function () {
                    Microsoft.Plugin.Theme.removeEventListener("themechanged", this._onThemeChangeBoundFunction);
                };

                GridLineRenderer.prototype.resize = function (evt) {
                    this._clientWidth = this._container.clientWidth;
                    this._clientHeight = this._container.clientHeight;

                    this._container.width = this._clientWidth;
                    this._container.height = this._clientHeight;
                    this.render();
                };

                GridLineRenderer.prototype.onViewportChanged = function (viewportArgs) {
                    if (this._currentTimespan.equals(viewportArgs.currentTimespan)) {
                        return;
                    }

                    this._currentTimespan = viewportArgs.currentTimespan;
                    this.render();
                };

                GridLineRenderer.prototype.onThemeChange = function () {
                    this._strokeStyle = Microsoft.Plugin.Theme.getValue("diagnostics-host-graph-line");
                    this.render();
                };

                GridLineRenderer.prototype.render = function () {
                    var _this = this;
                    var tickMarks = DiagnosticsHub.RulerUtilities.getTickMarksPosition(this._currentTimespan, this._clientWidth);
                    var elapsedTime = parseInt(this._currentTimespan.elapsed.value);

                    this._context.clearRect(0, 0, this._clientWidth, this._clientHeight);
                    this._context.strokeStyle = this._strokeStyle;

                    tickMarks.forEach(function (tickMark) {
                        if (tickMark.type === 0 /* Big */) {
                            var position = Math.round((_this._clientWidth * parseInt(DiagnosticsHub.BigNumber.subtract(tickMark.value, _this._currentTimespan.begin).value) / elapsedTime));

                            _this._context.beginPath();
                            _this._context.moveTo(position + .5, 0);
                            _this._context.lineTo(position + .5, _this._clientHeight);
                            _this._context.stroke();
                        }
                    });
                };
                return GridLineRenderer;
            })();
            DiagnosticsHub.GridLineRenderer = GridLineRenderer;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var ToolViewModel = (function () {
                function ToolViewModel(toolConfig, toolService) {
                    var _this = this;
                    this._subscriptions = [];
                    this._toolName = toolConfig.toolName;
                    this._toolId = toolConfig.toolId;

                    this._isActive = ko.observable((toolConfig.toolState & 1 /* Active */) === 1 /* Active */);
                    this._isSupported = ko.observable((toolConfig.toolState & 2 /* Supported */) === 2 /* Supported */);
                    this._hasFocus = ko.observable(false);

                    this._subscriptions.push(this._isActive.subscribe(function (enabled) {
                        toolService.setToolEnabled(_this._toolId, enabled);
                    }));
                }
                Object.defineProperty(ToolViewModel.prototype, "toolName", {
                    get: function () {
                        return this._toolName;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ToolViewModel.prototype, "toolId", {
                    get: function () {
                        return this._toolId;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ToolViewModel.prototype, "isActive", {
                    get: function () {
                        return this._isActive;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ToolViewModel.prototype, "isSupported", {
                    get: function () {
                        return this._isSupported;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ToolViewModel.prototype, "hasFocus", {
                    get: function () {
                        return this._hasFocus;
                    },
                    enumerable: true,
                    configurable: true
                });

                ToolViewModel.prototype.dispose = function () {
                    this._subscriptions.forEach(function (value) {
                        value.dispose();
                    });
                };
                return ToolViewModel;
            })();

            var ToolSelectionViewModel = (function () {
                function ToolSelectionViewModel() {
                    var _this = this;
                    this._toolsChangedInfoBarVisible = false;
                    this._previousActiveStates = {};
                    this._flyoutVisible = ko.observable(false);
                    this._tools = ko.observableArray();
                    this._onToolStateChangedBoundFunction = this.onToolStateChanged.bind(this);

                    this._toolsService = new DiagnosticsHub.PerformanceDebuggerToolsService();

                    this._infoBarService = DiagnosticsHub.getInfoBarService();
                    this._subscription = this._flyoutVisible.subscribe(function (visible) {
                        return _this.onFlyoutVisibilityChanged(visible);
                    });

                    this._telemetry = new DiagnosticsHub.Telemetry.PerformanceDebugger();

                    this._toolsService.getAvailableToolsInformationAndState().done(function (toolsConfig) {
                        toolsConfig.forEach(function (toolConfig) {
                            var tool = new ToolViewModel(toolConfig, _this._toolsService);
                            _this._tools.push(tool);
                        });

                        _this._toolsService.toolStateChangedEvent.addEventListener(_this._onToolStateChangedBoundFunction);
                    });
                }
                Object.defineProperty(ToolSelectionViewModel.prototype, "flyoutVisible", {
                    get: function () {
                        return this._flyoutVisible;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ToolSelectionViewModel.prototype, "tools", {
                    get: function () {
                        return this._tools;
                    },
                    enumerable: true,
                    configurable: true
                });

                ToolSelectionViewModel.prototype.dispose = function () {
                    this._toolsService.toolStateChangedEvent.removeEventListener(this._onToolStateChangedBoundFunction);
                    this._subscription.dispose();
                    this._tools().forEach(function (tool) {
                        return tool.dispose();
                    });
                };

                ToolSelectionViewModel.prototype.onFlyoutVisibilityChanged = function (visible) {
                    var _this = this;
                    if (visible) {
                        this.saveToolState();
                        this._telemetry.selectToolsDropdown();

                        return;
                    }

                    if (this._toolsChangedInfoBarVisible || !this.isToolStateDirty()) {
                        return;
                    }

                    this._toolsChangedInfoBarVisible = true;
                    this._infoBarService.addInfoMessage(Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ToolSelectionChangesNextDebugSession"), null, function () {
                        _this._toolsChangedInfoBarVisible = false;
                    });
                };

                ToolSelectionViewModel.prototype.onToolStateChanged = function (eventArgs) {
                    var _this = this;
                    eventArgs.toolsState.forEach(function (toolConfig) {
                        for (var toolNumber = 0; toolNumber < _this._tools().length; ++toolNumber) {
                            if (toolConfig.toolId === _this._tools()[toolNumber].toolId) {
                                _this._tools()[toolNumber].isActive((toolConfig.toolState & 1 /* Active */) === 1 /* Active */);
                                _this._tools()[toolNumber].isSupported((toolConfig.toolState & 2 /* Supported */) === 2 /* Supported */);
                                break;
                            }
                        }

                        _this.saveToolState();
                    });
                };

                ToolSelectionViewModel.prototype.saveToolState = function () {
                    var _this = this;
                    this._tools().forEach(function (tool) {
                        _this._previousActiveStates[tool.toolId] = tool.isActive();
                    });
                };

                ToolSelectionViewModel.prototype.isToolStateDirty = function () {
                    var _this = this;
                    return this._tools().some(function (tool) {
                        return _this._previousActiveStates[tool.toolId] !== tool.isActive();
                    });
                };
                return ToolSelectionViewModel;
            })();

            var ToolSelectionDropDownControl = (function () {
                function ToolSelectionDropDownControl() {
                    this.registerKnockoutBindings();

                    this._container = document.createElement("div");
                    this._container.id = "toolSelectionControl";
                    this._container.innerHTML = document.getElementById("toolSelectionView").innerHTML;

                    this._viewModel = new ToolSelectionViewModel();

                    this._flyout = DiagnosticsHub.Utilities.findChildById(this._container, "toolSelectionFlyout");
                    this._flyout.style.zIndex = DiagnosticsHub.Constants.DropDownMenuZIndex.toString();

                    this._dropDownButton = DiagnosticsHub.Utilities.findChildById(this._container, "toolSelectionDropdown");
                    this._dropDownButton.style.zIndex = (DiagnosticsHub.Constants.DropDownMenuZIndex + 1).toString();
                    this._dropDownButton.onclick = this.toggleFlyout.bind(this);
                    this._dropDownButton.onkeydown = this.onKeyDown.bind(this);

                    var toolSelectionDropdownImage = DiagnosticsHub.Utilities.findChildById(this._dropDownButton, "toolSelectionDropdownImage");
                    toolSelectionDropdownImage.appendChild(DiagnosticsHub.Utilities.getSVGPlaceHolder("vs-image-tools-settings"));
                    Microsoft.Plugin.Theme.processInjectedSvg(toolSelectionDropdownImage);

                    this._onMouseDownBoundFunction = this.onMouseDown.bind(this);
                    window.addEventListener("mousedown", this._onMouseDownBoundFunction);

                    ko.applyBindings(this._viewModel, this.container);
                }
                Object.defineProperty(ToolSelectionDropDownControl.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                ToolSelectionDropDownControl.prototype.dispose = function () {
                    this._dropDownButton.onclick = null;
                    this._dropDownButton.onkeydown = null;
                    window.removeEventListener("mousedown", this._onMouseDownBoundFunction);
                    this._viewModel.dispose();
                };

                ToolSelectionDropDownControl.prototype.setEnabled = function (state) {
                };

                ToolSelectionDropDownControl.prototype.onKeyDown = function (e) {
                    if (e.keyCode === 40 /* ArrowDown */) {
                        this._viewModel.flyoutVisible(true);
                    } else if (e.keyCode === 13 /* Enter */) {
                        this.toggleFlyout();
                    }
                };

                ToolSelectionDropDownControl.prototype.toggleFlyout = function () {
                    var filterVisible = this._viewModel.flyoutVisible();
                    this._viewModel.flyoutVisible(!filterVisible);
                };

                ToolSelectionDropDownControl.prototype.onMouseDown = function (event) {
                    if (!this._viewModel.flyoutVisible()) {
                        return;
                    }

                    var flyoutBoundingBox = this._flyout.getBoundingClientRect();
                    var dropdownBoundingBox = this._dropDownButton.getBoundingClientRect();

                    if (!DiagnosticsHub.Utilities.containsPoint(flyoutBoundingBox, event.clientX, event.clientY) && !DiagnosticsHub.Utilities.containsPoint(dropdownBoundingBox, event.clientX, event.clientY)) {
                        this._viewModel.flyoutVisible(false);
                    }
                };

                ToolSelectionDropDownControl.prototype.registerKnockoutBindings = function () {
                    if (ko.bindingHandlers["focus"]) {
                        return;
                    }

                    ko.bindingHandlers["focus"] = {
                        previousElement: null,
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var onFocus = function () {
                                var hasFocusObservable = valueAccessor();

                                if (ko.bindingHandlers["focus"].previousElement && ko.bindingHandlers["focus"].previousElement !== element) {
                                    var e = document.createEvent("Event");

                                    e.initEvent("blur", false, false);
                                    ko.bindingHandlers["focus"].previousElement.dispatchEvent(e);
                                }

                                if (!hasFocusObservable()) {
                                    hasFocusObservable(true);
                                }

                                ko.bindingHandlers["focus"].previousElement = element;
                            };

                            var onBlur = function () {
                                var hasFocusObservable = valueAccessor();

                                if (!!hasFocusObservable()) {
                                    hasFocusObservable(false);
                                }
                            };

                            element.addEventListener("focus", onFocus);
                            element.addEventListener("blur", onBlur);
                        },
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            if (!ko.unwrap(valueAccessor())) {
                                element.blur();
                            } else {
                                element.focus();
                            }
                        }
                    };
                };
                return ToolSelectionDropDownControl;
            })();
            DiagnosticsHub.ToolSelectionDropDownControl = ToolSelectionDropDownControl;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var UserMessageControl = (function () {
                function UserMessageControl(message) {
                    this._container = document.createElement("div");
                    this._container.classList.add("main-usermessage-container");

                    var messageSpan = document.createElement("span");
                    messageSpan.classList.add("usermessage-message");
                    messageSpan.innerHTML = message;
                    this._container.appendChild(messageSpan);
                }
                Object.defineProperty(UserMessageControl.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });
                return UserMessageControl;
            })();
            DiagnosticsHub.UserMessageControl = UserMessageControl;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var Axes = (function () {
                function Axes(axis, graphMin, graphMax) {
                    this._container = document.createElement("div");
                    this._container.classList.add("graph-axis-line");

                    if (axis.isThresholdAxis) {
                        this._container.classList.add("threshold-axis");
                    }

                    this._value = axis.value;
                    this.updatePosition(graphMin, graphMax);
                }
                Object.defineProperty(Axes.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                Axes.prototype.onScaleChangedEvent = function (eventArgs) {
                    this.updatePosition(eventArgs.minimum, eventArgs.maximum);
                };

                Axes.prototype.updatePosition = function (min, max) {
                    if (this._value < min || this._value > max) {
                        this._container.style.display = "none";
                    } else {
                        this._container.style.display = "block";

                        var position = (this._value - min) / (max - min) * 100;
                        this._container.style.top = (100 - position) + "%";
                    }
                };
                return Axes;
            })();
            DiagnosticsHub.Axes = Axes;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var Legend = (function () {
                function Legend(graphLegendData) {
                    var _this = this;
                    if (!graphLegendData) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1002"));
                    }

                    this._container = document.createElement("div");
                    this._container.className = "legend-container";

                    graphLegendData.forEach(function (legendData) {
                        var legendMarker;

                        if (legendData.marker) {
                            legendMarker = legendData.marker.cloneNode(true);
                        } else {
                            legendMarker = document.createElement("div");
                            legendMarker.style.backgroundColor = legendData.color;
                        }

                        legendMarker.classList.add("legend-marker");

                        legendMarker.style.width = "1em";
                        legendMarker.style.height = "1em";

                        var legendTextDiv = document.createElement("div");
                        legendTextDiv.classList.add("legend-text-div");
                        legendTextDiv.innerText = legendData.legendText;

                        var individualLegendBox = document.createElement("div");
                        individualLegendBox.classList.add("legend-div");
                        individualLegendBox.appendChild(legendMarker);
                        individualLegendBox.appendChild(legendTextDiv);

                        if (legendData.legendTooltip) {
                            individualLegendBox.setAttribute("data-plugin-vs-tooltip", JSON.stringify({
                                content: legendData.legendTooltip,
                                delay: DiagnosticsHub.Constants.TimeoutImmediate
                            }));
                        }

                        _this._container.appendChild(individualLegendBox);
                    });
                }
                Object.defineProperty(Legend.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Legend;
            })();
            DiagnosticsHub.Legend = Legend;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var Scale = (function () {
                function Scale(config, scaleType, unitConverter) {
                    if (!config) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1002"));
                    }

                    this._minimum = config.minimum;
                    this._maximum = config.maximum;
                    this._axes = config.axes;
                    this._unitConverter = unitConverter;

                    this._scaleType = scaleType;
                    this._container = document.createElement("div");
                    this._container.className = this._scaleType === 0 /* Left */ ? "graph-scale-left" : "graph-scale-right";
                }
                Object.defineProperty(Scale.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                Scale.prototype.resize = function (evt) {
                    var height = this._container.clientHeight;
                    if (this._clientHeight === height) {
                        return;
                    }

                    this._clientHeight = height;
                    this.render();
                };

                Scale.prototype.onScaleChanged = function (args) {
                    this._minimum = args.minimum;
                    this._maximum = args.maximum;
                    this.render();
                };

                Scale.prototype.render = function () {
                    while (this._container.childNodes.length > 0) {
                        this._container.removeChild(this._container.firstChild);
                    }

                    var hasThresholdAxis = false;
                    if (this._axes && this._axes.length > 0) {
                        for (var i = 0; i < this._axes.length; i++) {
                            var axis = this._axes[i];
                            this.drawAxisValue(axis.value);
                            if (axis.isThresholdAxis) {
                                hasThresholdAxis = true;
                            }
                        }
                    } else {
                        this.drawAxisValue(this._maximum);
                        this.drawAxisValue(this._minimum);
                    }

                    if (hasThresholdAxis) {
                        this.drawAxisValue(this._maximum);
                    }
                };

                Scale.prototype.drawAxisValue = function (value) {
                    if (value > this._maximum || value < this._minimum) {
                        return;
                    }

                    var axisDiv = document.createElement("div");
                    axisDiv.className = this._scaleType === 0 /* Left */ ? "graph-axis-left" : "graph-axis-right";

                    var scaledValue = this._unitConverter.scaleValue(value);
                    axisDiv.innerHTML = DiagnosticsHub.Utilities.formatNumber(scaledValue.value, 0);
                    this._container.appendChild(axisDiv);

                    var top = 0;

                    var y = Math.floor(((this._maximum - value) / (this._maximum - this._minimum)) * this._clientHeight) - (axisDiv.offsetHeight / 2);

                    y = Math.max(0, y);
                    y = Math.min(y, this._clientHeight - axisDiv.offsetHeight);
                    axisDiv.style.top = y + "px";
                };
                return Scale;
            })();
            DiagnosticsHub.Scale = Scale;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var ChartColorScheme = (function () {
                function ChartColorScheme(lineColorString, lineFillColorString) {
                    this._lineColorString = "#FF0000";
                    this._lineFillColorString = "#FF0000";
                    this._lineColorString = lineColorString;
                    this._lineFillColorString = lineFillColorString;
                }
                Object.defineProperty(ChartColorScheme.prototype, "lineColor", {
                    get: function () {
                        return this._lineColorString;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ChartColorScheme.prototype, "lineFillColor", {
                    get: function () {
                        return this._lineFillColorString;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ChartColorScheme;
            })();
            DiagnosticsHub.ChartColorScheme = ChartColorScheme;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var LineSeriesRenderer = (function () {
                function LineSeriesRenderer(index, color) {
                    this._colorScheme = color;
                    this._index = index;
                }
                Object.defineProperty(LineSeriesRenderer.prototype, "index", {
                    get: function () {
                        return this._index;
                    },
                    enumerable: true,
                    configurable: true
                });

                LineSeriesRenderer.prototype.render = function (context, pointsToRender, info) {
                    if (pointsToRender.length === 0) {
                        return;
                    }

                    context.save();

                    context.lineWidth = (info.chartRect.height < 100 ? 1 : 2);
                    context.fillStyle = this._colorScheme.lineFillColor;
                    context.strokeStyle = this._colorScheme.lineColor;

                    var initialxPx = Microsoft.Plugin.F12 ? 0 : pointsToRender[0].xPx;

                    context.beginPath();
                    context.moveTo(initialxPx, pointsToRender[0].yPx);
                    pointsToRender.forEach(function (point) {
                        return context.lineTo(point.xPx, point.yPx);
                    });
                    context.stroke();

                    if (info.chartDrawFill) {
                        var y = DiagnosticsHub.ChartSeries.getYCoordinate(0, info.chartRect.top, info.chartRect.height, info.gridY.max, info.gridY.range);
                        context.lineTo(pointsToRender[pointsToRender.length - 1].xPx, y);
                        context.lineTo(initialxPx, y);
                        context.closePath();
                        context.fill();
                    }

                    context.restore();
                };
                return LineSeriesRenderer;
            })();
            DiagnosticsHub.LineSeriesRenderer = LineSeriesRenderer;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var StepLineSeriesRenderer = (function () {
                function StepLineSeriesRenderer(index, color) {
                    this._colorScheme = color;
                    this._index = index;
                }
                Object.defineProperty(StepLineSeriesRenderer.prototype, "index", {
                    get: function () {
                        return this._index;
                    },
                    enumerable: true,
                    configurable: true
                });

                StepLineSeriesRenderer.prototype.render = function (context, pointsToRender, info) {
                    if (pointsToRender.length === 0) {
                        return;
                    }

                    context.save();

                    context.lineWidth = (info.chartRect.height < 100 ? 1 : 2);
                    context.fillStyle = this._colorScheme.lineFillColor;
                    context.strokeStyle = this._colorScheme.lineColor;

                    var previousPoint = pointsToRender[0];

                    context.beginPath();
                    context.moveTo(previousPoint.xPx, previousPoint.yPx);
                    pointsToRender.forEach(function (point) {
                        context.lineTo(point.xPx, previousPoint.yPx);
                        context.lineTo(point.xPx, point.yPx);
                        previousPoint = point;
                    });
                    context.stroke();

                    if (info.chartDrawFill) {
                        var y = DiagnosticsHub.ChartSeries.getYCoordinate(0, info.chartRect.top, info.chartRect.height, info.gridY.max, info.gridY.range);
                        context.lineTo(previousPoint.xPx, y);
                        context.lineTo(pointsToRender[0].xPx, y);
                        context.closePath();
                        context.fill();
                    }

                    context.restore();
                };
                return StepLineSeriesRenderer;
            })();
            DiagnosticsHub.StepLineSeriesRenderer = StepLineSeriesRenderer;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var MultiLineGraph = (function () {
                function MultiLineGraph(config) {
                    this._series = [];
                    this._dataWarehouse = null;
                    this._colorSchemes = [
                        new DiagnosticsHub.ChartColorScheme("rgb(118, 174, 200)", "rgba(118, 174, 200, 0.65)"),
                        new DiagnosticsHub.ChartColorScheme("rgb(158, 202, 0)", "rgba(158, 202, 0, 0.65)"),
                        new DiagnosticsHub.ChartColorScheme("rgb(198, 198, 198)", "rgba(198, 198, 198, 0.75)"),
                        new DiagnosticsHub.ChartColorScheme("rgb(167, 148, 50)", "rgba(167, 148, 50, 0.25)")
                    ];
                    this._animationFrameHandle = null;
                    this._droppedFrame = null;
                    this._firstRender = true;
                    this._scaleChangedEvent = new DiagnosticsHub.AggregatedEvent();
                    this._chartAxisIncreaseRatio = 1.1;
                    this._scaleForWhiteSpace = 0.05;
                    this._maxSeriesValue = Number.MIN_VALUE;
                    this._minSeriesValue = Number.MAX_VALUE;
                    if (!config) {
                        throw new Error("Invalid configuration");
                    }

                    this._config = config;
                    this._logger = Microsoft.VisualStudio.DiagnosticsHub.getLogger();
                    this._onThemeChangedBoundFunction = this.onThemeChanged.bind(this);

                    this.initialize();

                    this._container = document.createElement("div");
                    this._container.classList.add("graphContainer");
                    this._container.style.height = this._config.height + "px";

                    this._canvasDiv = document.createElement("div");
                    this._canvasDiv.className = "graph-canvas-div";
                    this._canvasDiv.style.zIndex = DiagnosticsHub.Constants.MultiLineGraphZIndex.toString();
                    this._container.appendChild(this._canvasDiv);

                    this._canvas = document.createElement("canvas");
                    this._canvas.tabIndex = 0;
                    this._canvas.setAttribute("aria-label", this._config.description);

                    this._canvas.className = "graph-canvas";
                    this._dataCursor = new DiagnosticsHub.DataCursor(this._canvasDiv, this._series, this._config.timeRange, this._config.swimlaneId, this._graphInfo.gridY.min, this._graphInfo.gridY.max);

                    this._canvasDiv.appendChild(this._dataCursor.container);
                    this._canvasDiv.appendChild(this._canvas);

                    this._scaleChangedEvent.addEventListener(this._dataCursor.onScaleChanged.bind(this._dataCursor));

                    this._context = this._canvas.getContext("2d");

                    Microsoft.Plugin.Theme.addEventListener("themechanged", this._onThemeChangedBoundFunction);

                    this._telemetry = new DiagnosticsHub.Telemetry.ViewportController();
                }
                Object.defineProperty(MultiLineGraph.prototype, "container", {
                    get: function () {
                        return this._container;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(MultiLineGraph.prototype, "scaleChangedEvent", {
                    get: function () {
                        return this._scaleChangedEvent;
                    },
                    enumerable: true,
                    configurable: true
                });

                MultiLineGraph.prototype.dispose = function () {
                    Microsoft.Plugin.Theme.removeEventListener("themechanged", this._onThemeChangedBoundFunction);
                    this._dataCursor.dispose();
                    this._scaleChangedEvent.dispose();
                };

                MultiLineGraph.prototype.resize = function (evt) {
                    this._graphInfo.chartRect = new DiagnosticsHub.RectangleDimension(0, 0, this._container.clientWidth, this._container.clientHeight);
                    this._canvas.height = this._graphInfo.chartRect.height;
                    this._canvas.width = this._graphInfo.chartRect.width;
                    this._dataCursor.resize(evt);

                    if (this._refreshDataOnResizeAndZoom && 2 /* PostMortem */ === this._graphBehaviour) {
                        this.setData();
                        this._logger.debug("function: resize. Set new data for post mortem graph.");
                    } else {
                        this.render();
                        this._logger.debug("function: resize. render only. graph behaviour type: " + this._graphBehaviour);
                    }
                };

                MultiLineGraph.prototype.removeInvalidPoints = function (base) {
                    this._series.forEach(function (series) {
                        return series.removeInvalidPoints(base);
                    });
                };

                MultiLineGraph.prototype.onViewportChanged = function (viewportArgs) {
                    if (this._graphInfo.gridX.equals(viewportArgs.currentTimespan)) {
                        return;
                    }

                    this._graphInfo.gridX = viewportArgs.currentTimespan;
                    this._dataCursor.onViewportChanged(viewportArgs);

                    if (this._refreshDataOnResizeAndZoom && 2 /* PostMortem */ === this._graphBehaviour) {
                        this.setData();
                        this._logger.debug("function: setViewPortTimeRange. Set new data for post mortem graph.");
                    } else {
                        this.render();
                        this._logger.debug("function: setViewPortTimeRange. render only. graph behaviour type: " + this._graphBehaviour);
                    }
                };

                MultiLineGraph.prototype.addSeriesData = function (counterId, points, fullRender, dropOldData) {
                    var _this = this;
                    if (typeof fullRender === "undefined") { fullRender = true; }
                    if (typeof dropOldData === "undefined") { dropOldData = false; }
                    if (!counterId || !points || points.length === 0) {
                        return;
                    }

                    for (var i = 0; i < this._series.length; i++) {
                        var series = this._series[i];
                        if (series.counterId === counterId) {
                            if (dropOldData) {
                                series.clearData();
                            }

                            var newPoints = [];

                            if (this._timeProperties && 1 /* Live */ === this._graphBehaviour) {
                                for (var j = 0; j < points.length; j++) {
                                    var toolTip = points[j].ToolTip;
                                    if (toolTip === null || typeof toolTip === "undefined") {
                                        var prependText = "";
                                        if (this._series.length > 1) {
                                            prependText = (series.title || Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/TooltipValueLabel") || "Value") + ": ";
                                        } else {
                                            prependText = (Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/TooltipValueLabel") || "Value") + ": ";
                                        }

                                        toolTip = prependText + this._unitConverter.formatNumber(points[j].Value);
                                    }

                                    newPoints.push({
                                        CustomData: points[j].CustomData,
                                        Timestamp: this._timeProperties.convertQpcTimestampToNanoseconds(points[j].Timestamp),
                                        ToolTip: toolTip,
                                        Value: points[j].Value
                                    });
                                }
                            } else {
                                newPoints = points;
                            }

                            series.addData(newPoints);
                            this.updateScaleInfo(series);

                            if (this._graphBehaviour === 1 /* Live */) {
                                var queueRender = function () {
                                    _this.render();
                                    _this._animationFrameHandle = _this._droppedFrame ? window.requestAnimationFrame(queueRender) : null;
                                    _this._droppedFrame = false;
                                };

                                if (!this._animationFrameHandle) {
                                    queueRender();
                                } else {
                                    this._droppedFrame = true;
                                }
                            }
                        }
                    }
                };

                MultiLineGraph.prototype.render = function () {
                    var _this = this;
                    if (this._graphInfo.gridX.elapsed.equals(DiagnosticsHub.BigNumber.zero) || this._graphInfo.chartRect.width === 0) {
                        return;
                    }

                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25229 /* perfDiagnosticsHub_GraphContentFullRenderBegin */);

                    if (this._firstRender) {
                        this._firstRender = false;
                        if (this._config.jsonConfig.GraphBehaviour === 2 /* PostMortem */) {
                            this.setData();
                        }
                    }

                    this._context.clearRect(0, 0, this._graphInfo.chartRect.width, this._graphInfo.chartRect.height);
                    this._series.forEach(function (series) {
                        series.draw(_this._context, _this._graphInfo);
                    });

                    Microsoft.Plugin.VS.Internal.CodeMarkers.fire(25230 /* perfDiagnosticsHub_GraphContentFullRenderEnd */);
                };

                MultiLineGraph.prototype.updateScaleInfo = function (series) {
                    if (series.length === 0 || this._isScaleFixed || this._setScaleValueViaAnalyzer) {
                        return;
                    }

                    this._maxSeriesValue = Math.max(series.maxValue, this._maxSeriesValue);
                    this._minSeriesValue = Math.min(series.minValue, this._minSeriesValue);

                    var potentialGridYMax = Math.ceil(this._maxSeriesValue * this._chartAxisIncreaseRatio);

                    if (this._minSeriesValue < this._graphInfo.gridY.min || this._graphInfo.gridY.max < potentialGridYMax) {
                        this._graphInfo.gridY.min = Math.min(this._minSeriesValue, this._graphInfo.gridY.min);
                        this._graphInfo.gridY.max = Math.max(potentialGridYMax, this._graphInfo.gridY.max);
                        var scaledMax = this._unitConverter.scaleValue(this._graphInfo.gridY.max);

                        this._scaleChangedEvent.invokeEvent({
                            minimum: this._graphInfo.gridY.min,
                            maximum: this._graphInfo.gridY.max,
                            unit: scaledMax.unit
                        });
                    }
                };

                MultiLineGraph.prototype.initialize = function () {
                    if (this._config.resources) {
                        this._resource = this._config.resources;
                    }

                    var jsonObject = this._config.jsonConfig;
                    this._setScaleValueViaAnalyzer = jsonObject.SetScaleValueViaAnalyzer || false;

                    this._isScaleFixed = jsonObject.IsScaleFixed || false;

                    this._config.scale.axes = jsonObject.Axes || [];

                    if (jsonObject.TimeProperties) {
                        this._timeProperties = jsonObject.TimeProperties;
                    }

                    if (jsonObject.GraphBehaviour) {
                        this._graphBehaviour = jsonObject.GraphBehaviour;
                    }

                    this._unitConverter = new DiagnosticsHub.LocalizedUnitConverter(jsonObject.Units, this._config.resources);
                    this._config.legend = this._config.legend || [];

                    var colorIndex = 0;
                    for (var i = 0; i < jsonObject.Series.length; i++) {
                        var series = jsonObject.Series[i];
                        if (this._resource && this._resource[series.Legend]) {
                            series.Legend = this._resource[series.Legend];
                        }

                        if (this._resource && this._resource[series.LegendTooltip]) {
                            series.LegendTooltip = this._resource[series.LegendTooltip];
                        }

                        var color = series.Color ? new DiagnosticsHub.ChartColorScheme(series.Color.Line, series.Color.Fill) : colorIndex < this._colorSchemes.length ? this._colorSchemes[colorIndex++] : this._colorSchemes[colorIndex % this._colorSchemes.length];

                        var seriesToolTip = series.Legend ? series.Legend + ": {0}" : Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ChartSeriesFormattableTooltipLabel");

                        var tooltip = jsonObject.Series.length > 1 ? seriesToolTip : Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ChartSeriesFormattableTooltipLabel");

                        this._series.push(new DiagnosticsHub.ChartSeries(this._series.length, series.DataSource.CounterId, series.Legend, tooltip, series.SeriesType, color, this._unitConverter));

                        this._config.legend.push({
                            legendText: series.Legend,
                            color: color.lineColor,
                            legendTooltip: series.LegendTooltip
                        });
                    }

                    this._graphInfo = {
                        gridX: this._config.timeRange,
                        gridY: new DiagnosticsHub.MinMaxNumber(this._config.scale.minimum, this._config.scale.maximum),
                        chartDrawFill: this._series.length <= 1,
                        chartRect: new DiagnosticsHub.RectangleDimension(0, 0, 0, 0)
                    };

                    if (jsonObject.Unit && typeof jsonObject.Unit === "string") {
                        this._config.unit = jsonObject.Unit;
                        if (this._resource && this._resource[jsonObject.Unit]) {
                            this._config.unit = this._resource[jsonObject.Unit];
                        }
                    }

                    this._refreshDataOnResizeAndZoom = jsonObject.RefreshDataOnResizeAndZoom || false;

                    if (this._config.loadCss) {
                        this._config.loadCss("MultiLineGraph.css");
                    }
                };

                MultiLineGraph.prototype.setData = function () {
                    var _this = this;
                    this._logger.info("Collect configurations from json configuration for which we expect to load data from data warehouse.");
                    var dlConfiguration = [];

                    for (var i = 0; i < this._config.jsonConfig.Series.length; i++) {
                        var series = this._config.jsonConfig.Series[i];
                        var dataSource = series.DataSource;
                        if (dataSource && dataSource.CounterId && dataSource.AnalyzerId) {
                            var seriesConfig = { counterId: dataSource.CounterId, analyzerId: dataSource.AnalyzerId };
                            if (dataSource.CustomDomain) {
                                seriesConfig.customDomain = dataSource.CustomDomain;
                            }

                            dlConfiguration.push(seriesConfig);
                            this._logger.debug("Configuration for series: " + JSON.stringify(seriesConfig));
                        }
                    }

                    if (dlConfiguration.length === 0) {
                        this._logger.debug("Current multiline graph does not expect data from analyzers.");
                        return;
                    }

                    var dwLoadTask = null;

                    if (!this._dataWarehouse) {
                        dwLoadTask = Microsoft.VisualStudio.DiagnosticsHub.DataWarehouse.loadDataWarehouse().then(function (dw) {
                            _this._dataWarehouse = dw;
                            return Microsoft.Plugin.Promise.wrap(_this._dataWarehouse);
                        });
                    } else {
                        dwLoadTask = Microsoft.Plugin.Promise.wrap(this._dataWarehouse);
                    }

                    var convertToGraphDataPoints = function (counterId, dataPoint) {
                        var arr = [];

                        for (var i = 0; i < _this._series.length; i++) {
                            var series = _this._series[i];
                            if (series.counterId === counterId) {
                                for (var i = 0; i < dataPoint.length; i++) {
                                    var toolTipValue = dataPoint[i].tt;
                                    if (!toolTipValue && typeof dataPoint[i].v === "number") {
                                        var formattedPoint = _this._unitConverter.formatNumber(dataPoint[i].v);

                                        if (_this._series.length > 1 && series.title) {
                                            toolTipValue = series.title + ": " + formattedPoint;
                                        } else {
                                            toolTipValue = Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/ChartSeriesFormattableTooltipLabel", formattedPoint);
                                        }
                                    }

                                    arr.push({
                                        Timestamp: new DiagnosticsHub.BigNumber(dataPoint[i].t.h, dataPoint[i].t.l),
                                        Value: dataPoint[i].v,
                                        ToolTip: toolTipValue
                                    });
                                }

                                break;
                            }
                        }

                        return arr;
                    };

                    dwLoadTask.then(function (dw) {
                        _this._logger.info("Data warehouse is loaded. Starting to load the data.");
                        var promises = [];
                        dlConfiguration.forEach(function (dlConfig) {
                            _this._logger.debug("Loading data for counter name '" + dlConfig.counterId + "' from analyzer '" + dlConfig.analyzerId + "'");
                            _this._logger.debug("Graph height: " + JSON.stringify(_this._config.height) + " Graph Width: " + _this._graphInfo.chartRect.width);
                            var contextData = {
                                customDomain: {
                                    Task: "GetCounter",
                                    CounterId: dlConfig.counterId,
                                    Height: _this._config.height.toString(),
                                    Width: _this._graphInfo.chartRect.width.toString()
                                },
                                timeDomain: _this._graphInfo.gridX
                            };

                            _this._logger.debug("Data Context: " + JSON.stringify(contextData));

                            if (dlConfig.customDomain) {
                                for (var propertyName in dlConfig.customDomain) {
                                    if (dlConfig.customDomain.hasOwnProperty(propertyName)) {
                                        var value = dlConfig.customDomain[propertyName];
                                        if (value !== null && typeof value !== "string") {
                                            _this._logger.warning("Custom domain property '" + propertyName + "' is not a string, it will be converted to string");
                                            value = value.toString();
                                        }

                                        contextData.customDomain[propertyName] = value;
                                    }
                                }
                            }

                            promises.push(dw.getFilteredData(contextData, dlConfig.analyzerId).then(function (dhResultMaybe) {
                                if (!dhResultMaybe) {
                                    dhResultMaybe = {};
                                }

                                if (typeof dhResultMaybe.getResult !== "function") {
                                    dhResultMaybe.counterId = dlConfig.counterId;
                                    return Microsoft.Plugin.Promise.wrap(dhResultMaybe);
                                }

                                var dhResult = dhResultMaybe;
                                return dhResult.getResult(null).then(function (jsonResult) {
                                    if (!jsonResult) {
                                        jsonResult = {};
                                    }

                                    jsonResult.counterId = dlConfig.counterId;
                                    dhResult.dispose();
                                    return jsonResult;
                                });
                            }));
                        });

                        Microsoft.Plugin.Promise.join(promises).done(function (data) {
                            if (data && data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].p) {
                                        if (_this._setScaleValueViaAnalyzer && (data[i].mn !== null && typeof data[i].mn !== "undefined") && (data[i].mx !== null && typeof data[i].mx !== "undefined")) {
                                            _this._graphInfo.gridY.min = data[i].mn;
                                            _this._graphInfo.gridY.max = data[i].mx;

                                            var scaledMax = _this._unitConverter.scaleValue(_this._graphInfo.gridY.max);
                                            _this._scaleChangedEvent.invokeEvent({
                                                minimum: _this._graphInfo.gridY.min,
                                                maximum: _this._graphInfo.gridY.max,
                                                unit: scaledMax.unit
                                            });

                                            _this._logger.debug("new scale min: " + _this._graphInfo.gridY.min + " and max: " + _this._graphInfo.gridY.max);
                                        }

                                        _this.addSeriesData(data[i].counterId, convertToGraphDataPoints(data[i].counterId, data[i].p), true, true);
                                    }
                                }

                                _this.render();
                            }
                        }, function (err) {
                            _this._logger.error("Could not load data points for counter - error: " + JSON.stringify(err));
                        });
                    }, function (err) {
                        _this._logger.error("Error on datawarehouse loading:" + JSON.stringify(err));
                        throw err;
                    });
                };

                MultiLineGraph.prototype.onThemeChanged = function (args) {
                    this.render();
                };
                return MultiLineGraph;
            })();
            DiagnosticsHub.MultiLineGraph = MultiLineGraph;

            Microsoft.VisualStudio.DiagnosticsHub.RegisterNamespace.registerClass("Microsoft.VisualStudio.DiagnosticsHub.MultiLineGraph");
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var PerformanceDebuggerSwimlanesView = (function () {
                function PerformanceDebuggerSwimlanesView() {
                    var _this = this;
                    Microsoft.Plugin.Tooltip.defaultTooltipContentToHTML = false;

                    Microsoft.Plugin.VS.Keyboard.setZoomState(false);
                    var rendererConfig = {
                        dataManager: null,
                        collectorTimeService: null,
                        containerId: null,
                        isToolbarRequired: true,
                        isToolbarFloating: true,
                        isPerformanceDebugger: true,
                        isSelectionEnabled: true,
                        isLive: true,
                        newArchitecture: true,
                        timeInNsPerPixel: 60000000
                    };

                    this._onSessionTargetAddFailedBoundFunction = this.onSessionTargetAddFailed.bind(this);
                    this._onStatusMessageUpdateBoundFunction = this.onStatusMessageChanged.bind(this);

                    this._eventAggregator = DiagnosticsHub.getEventAggregator();
                    this._renderer = Microsoft.VisualStudio.DiagnosticsHub.getRenderer(rendererConfig);

                    var performanceDebuggerInfo = DiagnosticsHub.getPerformanceDebuggerStateService();
                    performanceDebuggerInfo.isDocumentActiveSession().then(function (isActiveSession) {
                        return _this.setupInitialWindow(isActiveSession);
                    });
                }
                PerformanceDebuggerSwimlanesView.prototype.addInfoMessage = function (message, link, onClose) {
                    var _this = this;
                    var infoBar = new DiagnosticsHub.InformationBarControl(message, link);
                    infoBar.onClose = function () {
                        _this._renderer.removeControl(infoBar);
                        if (onClose) {
                            onClose();
                        }
                    };

                    this._renderer.addControl(infoBar, DiagnosticsHub.SwimlaneViewConstants.InfobarRendererPriority);
                };

                PerformanceDebuggerSwimlanesView.prototype.setupInitialWindow = function (isActiveSession) {
                    var _this = this;
                    this._renderer.addToolbarItem(new Microsoft.VisualStudio.DiagnosticsHub.ToolSelectionDropDownControl());

                    if (isActiveSession) {
                        this._currentSession = Microsoft.VisualStudio.DiagnosticsHub.getCurrentSession();
                        this._eventAggregator.addEventListener("DiagnosticsHub.EventAggregator.SessionTargetAddFailedEvent", this._onSessionTargetAddFailedBoundFunction);
                        this._currentSession.getPerformanceDebuggerSessionTargetProcessInformation().then(function (sessionProcessInfo) {
                            if (sessionProcessInfo.addTargetFailureCount > 0) {
                                _this.onSessionTargetAddFailed();
                            }
                        });
                    } else {
                        var performanceDebuggerInfo = DiagnosticsHub.getPerformanceDebuggerStateService();
                        performanceDebuggerInfo.statusMessageChangedEvent.addEventListener(this._onStatusMessageUpdateBoundFunction);
                        performanceDebuggerInfo.getLastNonActiveStatusMessage().then(function (message) {
                            return _this.showMessage(message);
                        });
                    }
                };

                PerformanceDebuggerSwimlanesView.prototype.onSessionTargetAddFailed = function () {
                    var _this = this;
                    this._eventAggregator.removeEventListener("DiagnosticsHub.EventAggregator.SessionTargetAddFailedEvent", this._onSessionTargetAddFailedBoundFunction);

                    this._currentSession.getPerformanceDebuggerSessionTargetProcessInformation().then(function (sessionProcessInfo) {
                        _this.addInfoMessage(Microsoft.Plugin.Resources.getString("/DiagnosticsHubResources/InformationPerfDebuggerSingleTarget", sessionProcessInfo.processName, sessionProcessInfo.processId));
                    });
                };

                PerformanceDebuggerSwimlanesView.prototype.onStatusMessageChanged = function (eventArgs) {
                    this.showMessage(eventArgs.statusMessage);
                };

                PerformanceDebuggerSwimlanesView.prototype.showMessage = function (localizedMessage) {
                    if (this._userMessage !== null && typeof this._userMessage !== "undefined") {
                        this._renderer.removeControl(this._userMessage);
                    }

                    this._userMessage = new DiagnosticsHub.UserMessageControl(localizedMessage);
                    this._renderer.addControl(this._userMessage, DiagnosticsHub.Renderer.headerSwimlanePriority);
                };
                return PerformanceDebuggerSwimlanesView;
            })();

            var _swimlanesView = null;

            function getInfoBarService() {
                if (!_swimlanesView) {
                    throw new Error("Not initialized correctly");
                }

                return _swimlanesView;
            }
            DiagnosticsHub.getInfoBarService = getInfoBarService;

            function getPerformanceDebuggerSwimlanesView() {
                if (!_swimlanesView) {
                    _swimlanesView = new PerformanceDebuggerSwimlanesView();
                }

                return _swimlanesView;
            }
            DiagnosticsHub.getPerformanceDebuggerSwimlanesView = getPerformanceDebuggerSwimlanesView;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var AggregatedMarkData = (function () {
                function AggregatedMarkData() {
                    this._content = [];
                    this._ariaContent = [];
                    this.marks = [];
                }
                AggregatedMarkData.prototype.getTooltipContent = function () {
                    this.updateData();
                    return this._content.join("\r\n");
                };

                AggregatedMarkData.prototype.getAriaContent = function () {
                    this.updateData();
                    return this._ariaContent.join(", ");
                };

                AggregatedMarkData.prototype.push = function (mark) {
                    if (!this.time || this.time > mark.time) {
                        this.time = mark.time;
                    }

                    this.marks.push(mark);
                };

                AggregatedMarkData.prototype.updateData = function () {
                    if (this._content.length === this.marks.length) {
                        return;
                    }

                    this._content = [];
                    this._ariaContent = [];
                    for (var i = 0; i < this.marks.length; i++) {
                        if (this.marks[i].tooltip !== null && typeof this.marks[i].tooltip !== "undefined") {
                            var mark = this.marks[i];
                            var tooltip = mark.tooltip;
                            var ariaTooltip = mark.tooltip;
                            tooltip += Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerMarkTooltipLabel", DiagnosticsHub.RulerUtilities.formatTime(mark.time));
                            ariaTooltip += Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/RulerMarkTooltipLabel", DiagnosticsHub.RulerUtilities.formatTime(mark.time, 1 /* fullName */));

                            this._content.push(tooltip);
                            this._ariaContent.push(ariaTooltip);
                        }
                    }
                };
                return AggregatedMarkData;
            })();
            DiagnosticsHub.AggregatedMarkData = AggregatedMarkData;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var MarkDataFetcher = (function () {
                function MarkDataFetcher(config, rulerScale) {
                    var _this = this;
                    this._droppedRequest = false;
                    this._dataWarehouseRequestHandle = 1;
                    this._logger = Microsoft.VisualStudio.DiagnosticsHub.getLogger();
                    this._scale = rulerScale;
                    this._markId = config.MarkTypeId;
                    this._analyzerId = config.DataSource.AnalyzerId;

                    Microsoft.VisualStudio.DiagnosticsHub.DataWarehouse.loadDataWarehouse().done(function (dw) {
                        _this._dataWarehouse = dw;

                        var dataSource = config.DataSource;
                        _this._dataWarehouseContext = {
                            customDomain: { CounterId: dataSource.CounterId }
                        };

                        if (dataSource.CustomDomain) {
                            for (var propertyName in dataSource.CustomDomain) {
                                if (dataSource.CustomDomain.hasOwnProperty(propertyName)) {
                                    var value = dataSource.CustomDomain[propertyName];
                                    if (value !== null && typeof value !== "string") {
                                        _this._logger.warning("Custom domain property '" + propertyName + "' is not a string, it will be converted to string");
                                        value = value.toString();
                                    }

                                    _this._dataWarehouseContext.customDomain[propertyName] = value;
                                }
                            }
                        }

                        _this._dataWarehouseRequestHandle = null;
                        _this._droppedRequest = false;
                        _this.requestUpdate();
                    });
                }
                MarkDataFetcher.prototype.onDataUpdate = function (timestampNs) {
                    this.requestUpdate();
                };

                MarkDataFetcher.prototype.dispose = function () {
                    if (this._countersResult) {
                        this._countersResult.dispose();
                    }
                };

                MarkDataFetcher.prototype.requestUpdate = function () {
                    var _this = this;
                    if (this._dataWarehouseRequestHandle) {
                        this._droppedRequest = true;
                        return;
                    }

                    this._dataWarehouseRequestHandle = window.setTimeout(function () {
                        var dataPromise;
                        if (_this._countersResult) {
                            dataPromise = _this._countersResult.getResult(null);
                        } else {
                            dataPromise = _this._dataWarehouse.getFilteredData(_this._dataWarehouseContext, _this._analyzerId).then(function (result) {
                                if (typeof result.getResult === "function") {
                                    _this._countersResult = result;
                                    return _this._countersResult.getResult(null);
                                }

                                return result;
                            });
                        }

                        dataPromise.then(function (dataPoints) {
                            if (!dataPoints || !dataPoints.p) {
                                return;
                            }

                            dataPoints.p.forEach(function (point) {
                                var timestamp = new DiagnosticsHub.BigNumber(point.t.h, point.t.l);
                                var tooltip = point.tt || _this.formatMarkTooltip(timestamp);
                                var markData = new DiagnosticsHub.MarkData(timestamp, tooltip);
                                _this._scale.addMark(_this._markId, markData, false);
                            });
                        }).done(function () {
                            _this._dataWarehouseRequestHandle = null;
                            if (_this._droppedRequest) {
                                window.setTimeout(_this.requestUpdate.bind(_this), DiagnosticsHub.Constants.TimeoutImmediate);
                                _this._droppedRequest = false;
                            }
                        });
                    }, DiagnosticsHub.Constants.TimeoutImmediate);
                };

                MarkDataFetcher.prototype.formatMarkTooltip = function (timestamp) {
                    return Microsoft.Plugin.Resources.getString("/DiagnosticsHubControlsResources/TooltipTimeLabel") + ": " + DiagnosticsHub.RulerUtilities.formatTime(timestamp, 0 /* italicizedAbbreviations */);
                };
                return MarkDataFetcher;
            })();
            DiagnosticsHub.MarkDataFetcher = MarkDataFetcher;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));

// SIG // Begin signature block
// SIG // MIIapgYJKoZIhvcNAQcCoIIalzCCGpMCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFOBIHVJeur8f
// SIG // vzf67TLl4g3rADcfoIIVgzCCBMMwggOroAMCAQICEzMA
// SIG // AACu7D+ttou5LdIAAAAAAK4wDQYJKoZIhvcNAQEFBQAw
// SIG // dzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBMB4XDTE2MDUwMzE3
// SIG // MTMyNVoXDTE3MDgwMzE3MTMyNVowgbMxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xDTALBgNVBAsTBE1PUFIxJzAlBgNVBAsT
// SIG // Hm5DaXBoZXIgRFNFIEVTTjpCOEVDLTMwQTQtNzE0NDEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBAMU1NKkcd7KmYPBjeGAq6gNQs5mD6fPlPzBu2sR1
// SIG // z2RnTLzW0Uj5dvW2vPIwmEbrf+qeTo7whjXESDD1ihTK
// SIG // ilXmPM1KEDaeOo2LF3p5eL0wICdnFAnmhsvb8S2Exrl7
// SIG // WgoZ/oyKT7kesVEOtGOODNo8qbG3EGWHOjrpMOHKPgiM
// SIG // PHyqsT3A43ZtXP4Ms1Z4UmE17L/EtDQcJYroTQjROA/G
// SIG // 9CzY+xMY+c31WBrz+mfibRmOy0/u3GlAk9LiLSpRNA/4
// SIG // g75WOcy625blG+Fi1AaYJTMO21NAUgHL3DcdF8le/gHX
// SIG // JoYhUBreKWY21czrF7Nzzlh06uPyl0ZrRhyn7zMCAwEA
// SIG // AaOCAQkwggEFMB0GA1UdDgQWBBQcOHLSWpK6QYm6QfUy
// SIG // ZGCbCYBgVDAfBgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7
// SIG // syuwwzWzDzBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9NaWNyb3NvZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsG
// SIG // AQUFBwEBBEwwSjBIBggrBgEFBQcwAoY8aHR0cDovL3d3
// SIG // dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBBQUAA4IBAQAAGbFWyVTR
// SIG // WVDTHF0cSnnpXNQ4IkBywutEopGvfDsAxV6JmGpJOsrx
// SIG // PnydwyApw1CvZJn/N7GEzkOWO4d0M8B3D3coSzx0gQZr
// SIG // j5JY+o3FhrrxyqVLj/T048igcNAj2dT0ztSXOUY7EGL8
// SIG // artNfhuVL2aJZzOlsO0KZgaAxMs3uSfnYBsK1jISCg8y
// SIG // i1fXaOkeaLmULy71e24x+dAF9rStp986WWLwJfy2sixx
// SIG // TSDuwNg0NVc1mt59ssmL2pnml9TZEiwN9j6owF8pJpA3
// SIG // x0OgxVbg1eJ6qzSPrNeBCYDEMvA81PV+/iiJAsyxTav2
// SIG // 3Nlg6NearEIgAj1UimNSDhoiMIIE7TCCA9WgAwIBAgIT
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
// SIG // +i+ePy5VFmvJE6P9MYIEjzCCBIsCAQEwgZAweTELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0
// SIG // IENvZGUgU2lnbmluZyBQQ0ECEzMAAAFAlqnucFb+zAcA
// SIG // AQAAAUAwCQYFKw4DAhoFAKCBqDAZBgkqhkiG9w0BCQMx
// SIG // DAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYK
// SIG // KwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQUgHGYrKJN
// SIG // uI3iTSXD21fyMaX2tdcwSAYKKwYBBAGCNwIBDDE6MDig
// SIG // HoAcAGgAdQBiAEMAbwBuAHQAcgBvAGwAcwAuAGoAc6EW
// SIG // gBRodHRwOi8vbWljcm9zb2Z0LmNvbTANBgkqhkiG9w0B
// SIG // AQEFAASCAQCgyRpxwy6FV/Th/3p063Tm/JaALzGB6ScV
// SIG // VzLdji/5E9ND+RP4KQ7N7hztBo9RJ7qD7IpBqH+8KTQV
// SIG // GFQhvMj3zc3FPFaiPM5LBcRRCEjRRx+LLfD90xzk9SR0
// SIG // IORkNEzotvUpAfXYVMPF9yriLd9boMQxguzOAyxvDQZt
// SIG // b9bcwe2VDoOgV48ivtPdZE54bGb+VxKMp+Oz9Eh1bbqQ
// SIG // TWGxn2lYSRN0pQz3L527U9UeSVQqGFIiGbyDqcIAIWJJ
// SIG // akeKvSoXJ1F0w1sfws0G8Q6ZYn0xehusQZUbHru1dwNz
// SIG // 8ze8i8zT8T7mONTAO1go0dM7pROcK6yckt4qQNU8Rjst
// SIG // oYICKDCCAiQGCSqGSIb3DQEJBjGCAhUwggIRAgEBMIGO
// SIG // MHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xITAfBgNVBAMTGE1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFBDQQITMwAAAK7sP622
// SIG // i7kt0gAAAAAArjAJBgUrDgMCGgUAoF0wGAYJKoZIhvcN
// SIG // AQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcN
// SIG // MTYwOTA3MDQ0NzQ1WjAjBgkqhkiG9w0BCQQxFgQUbJKM
// SIG // LmGGFJPLlHFQph11WoVYQ8AwDQYJKoZIhvcNAQEFBQAE
// SIG // ggEAGLIsW6Mwjc5t2tZDfIw5zowgCF9/aFjOZo7R3pz6
// SIG // vENmtvTQGroX5ktgqZ4C+jy6gbQ+X27/kHGA84nQ/1fY
// SIG // vx3GbssDny3eIPP2tGaLai75hxnhz8zjVJwA6g6tel4V
// SIG // FZjj+1Qy440F8HIsNm7RJySd6bTcqstX91SfE6RVfKUt
// SIG // YHMm79y3Z9F0l7NYnk7kUNPvNDZ40GGJ0AdKQXos8hqN
// SIG // oeL2K15v4GIG+tBPJSiw/FOTYTBsydpzxyGQZSV3LNTf
// SIG // jKGxC/ayUogVM7AvoppLyCpA2VNPCF5/KxtNdzZvowVF
// SIG // djA8N9oIqOShhQnBnTt3ghah8x7e7jxjikB4lg==
// SIG // End signature block
