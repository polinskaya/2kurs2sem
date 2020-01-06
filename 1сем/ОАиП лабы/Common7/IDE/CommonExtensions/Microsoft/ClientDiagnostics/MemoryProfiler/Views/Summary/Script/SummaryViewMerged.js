//
// Copyright (C) Microsoft. All rights reserved.
//
// snapshotTileView.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../Common/Util/keyCodes.ts" />
/// <reference path="../../../../../common/script/Hub/plugin.redirect.d.ts" />
/// <reference path="../../Common/Controls/templateControl.ts" />
/// <reference path="../../Common/Util/formattingHelpers.ts" />
/// <reference path="../../Common/controls/componentModel.ts" />
/// <reference path="../../Common/Profiler/SnapshotSummary.ts" />
/// <reference path="SummaryView.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    "use strict";
    var SnapshotTileViewModel = (function (_super) {
        __extends(SnapshotTileViewModel, _super);
        function SnapshotTileViewModel(summary, snapshotSummaryCollection) {
            _super.call(this);
            this._summary = summary;
            this._snapshotSummaryCollection = snapshotSummaryCollection;
        }
        Object.defineProperty(SnapshotTileViewModel.prototype, "summaryData", {
            get: function () {
                return this._summary;
            },
            set: function (v) {
                this._summary = v;
                this.raisePropertyChanged("summaryData");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "timeTaken", {
            get: function () {
                var date = new Date(this._summary.snapshot.timestamp);
                return "(" + date.toLocaleTimeString() + ")";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "nativeSize", {
            get: function () {
                return this.summaryData.nativeTotalSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "nativeSizeDisplayString", {
            get: function () {
                return MemoryProfiler.Common.FormattingHelpers.getPrettyPrintSize(this.nativeSize);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "nativeCount", {
            get: function () {
                return this.summaryData.nativeTotalCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "nativeCountDisplayString", {
            get: function () {
                return Microsoft.Plugin.Resources.getString("NativeCount", MemoryProfiler.Common.FormattingHelpers.getDecimalLocaleString(this.nativeCount, true));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "nativeSizeDiff", {
            get: function () {
                var previousSnapshot = this.getPreviousSnapshot();
                if (previousSnapshot) {
                    return this._summary.nativeTotalSize - previousSnapshot.nativeTotalSize;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "nativeSizeDiffDisplayString", {
            get: function () {
                if (this.nativeSizeDiff === 0) {
                    return Microsoft.Plugin.Resources.getString("NoDiff");
                }
                else {
                    return MemoryProfiler.Common.FormattingHelpers.getPrettyPrintSize(this.nativeSizeDiff, true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "nativeCountDiff", {
            get: function () {
                var previousSnapshot = this.getPreviousSnapshot();
                if (previousSnapshot) {
                    return this._summary.nativeTotalCount - previousSnapshot.nativeTotalCount;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "nativeCountDiffDisplayString", {
            get: function () {
                if (this.nativeCountDiff === 0) {
                    return Microsoft.Plugin.Resources.getString("NoDiff");
                }
                else {
                    return MemoryProfiler.Common.FormattingHelpers.getDecimalLocaleString(this.nativeCountDiff, true, true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "managedSize", {
            get: function () {
                return this.summaryData.managedTotalSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "managedSizeDisplayString", {
            get: function () {
                return MemoryProfiler.Common.FormattingHelpers.getPrettyPrintSize(this.managedSize);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "managedCount", {
            get: function () {
                return this.summaryData.managedTotalCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "managedCountDisplayString", {
            get: function () {
                return Microsoft.Plugin.Resources.getString("ManagedCount", MemoryProfiler.Common.FormattingHelpers.getDecimalLocaleString(this.managedCount, true));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "managedSizeDiff", {
            get: function () {
                var previousSnapshot = this.getPreviousSnapshot();
                if (previousSnapshot) {
                    return this._summary.managedTotalSize - previousSnapshot.managedTotalSize;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "managedSizeDiffDisplayString", {
            get: function () {
                if (this.managedSizeDiff === 0) {
                    return Microsoft.Plugin.Resources.getString("NoDiff");
                }
                else {
                    return MemoryProfiler.Common.FormattingHelpers.getPrettyPrintSize(this.managedSizeDiff, true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "managedCountDiff", {
            get: function () {
                var previousSnapshot = this.getPreviousSnapshot();
                if (previousSnapshot) {
                    return this._summary.managedTotalCount - previousSnapshot.managedTotalCount;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "managedCountDiffDisplayString", {
            get: function () {
                if (this.managedCountDiff === 0) {
                    return Microsoft.Plugin.Resources.getString("NoDiff");
                }
                else {
                    return MemoryProfiler.Common.FormattingHelpers.getDecimalLocaleString(this.managedCountDiff, true, true);
                }
            },
            enumerable: true,
            configurable: true
        });
        SnapshotTileViewModel.prototype.getComparableSnapshots = function () {
            var result = [];
            for (var i = 0; i < this._snapshotSummaryCollection.length; i++) {
                var summary = this._snapshotSummaryCollection.getItem(i);
                if (summary.id !== this._summary.id) {
                    result.push(summary);
                }
            }
            return result;
        };
        Object.defineProperty(SnapshotTileViewModel.prototype, "isFirstSnapshot", {
            get: function () {
                return this.getPreviousSnapshot() === null;
            },
            enumerable: true,
            configurable: true
        });
        // Note we assume id === array index
        SnapshotTileViewModel.prototype.getPreviousSnapshot = function () {
            var previousId = this._summary.id - 1;
            if (previousId >= 0 && previousId < this._snapshotSummaryCollection.length) {
                return this._snapshotSummaryCollection.getItem(previousId);
            }
            return null;
        };
        return SnapshotTileViewModel;
    })(MemoryProfiler.Common.Controls.ObservableViewModel);
    MemoryProfiler.SnapshotTileViewModel = SnapshotTileViewModel;
    var SnapshotTileView = (function (_super) {
        __extends(SnapshotTileView, _super);
        function SnapshotTileView(controller, model) {
            _super.call(this, "SnapshotTileTemplate");
            this._controller = controller;
            this._model = model;
            this._controller.model.registerPropertyChanged(this);
            this._model.registerPropertyChanged(this);
            this._tileContextMenuItems = [];
            this._snapshotTile = this.findElement("snapshotTile");
            this._tileHeader = this.findElement("snapshotTileHeader");
            this.findElement("snapshotTileTitle").innerText = Microsoft.Plugin.Resources.getString("SnapshotNumber", this._model.summaryData.id + 1);
            this._screenshotHolder = this.findElement("snapshotTileImage");
            this._screenshotNotAvailableMessage = this.findElement("screenshotNotAvailableMessage");
            if (this._model.summaryData.snapshot.screenshotFile) {
                this._screenshotHolder.src = this._model.summaryData.snapshot.screenshotFile;
                this._screenshotNotAvailableMessage.style.display = "none";
            }
            this.findElement("snapshotTakenDate").innerText = this._model.timeTaken;
            this._screenshotNotAvailableMessage.innerText = Microsoft.Plugin.Resources.getString("ScreenshotNotAvailable");
            this._snapshotLoadingProgress = this.findElement("loadingSnapshotProgress");
            this.populateContextMenu();
            this.updateUI();
        }
        SnapshotTileView.prototype.updateUI = function () {
            this.populateWarningsSection();
            this.populateSummaryLinks();
            this.updateSnapshotDisplayType();
            this.updateLoadingProgress();
        };
        SnapshotTileView.prototype.populateWarningsSection = function () {
            var leakCount = this._model.summaryData.resourceLeakCount;
            if (leakCount && leakCount > 0) {
                var snapshotWarningsCount = this.findElement("snapshotTileWarningsCount");
                snapshotWarningsCount.innerText = MemoryProfiler.Common.FormattingHelpers.getDecimalLocaleString(leakCount, true);
                snapshotWarningsCount.setAttribute("data-plugin-vs-tooltip", Microsoft.Plugin.Resources.getString("SnapshotTileWarningsCountLinkTooltip"));
                snapshotWarningsCount.onclick = this.onLeaksCountClick.bind(this);
            }
            else {
                this.findElement("snapshotTileWarnings").style.visibility = "hidden";
            }
        };
        SnapshotTileView.prototype.onPropertyChanged = function (propertyName) {
            switch (propertyName) {
                case "snapshotDisplayType":
                    this.updateSnapshotDisplayType();
                    break;
                case "summaryData":
                    this.updateUI();
                    break;
            }
        };
        SnapshotTileView.prototype.updateLoadingProgress = function () {
            if (this._model.summaryData.isProcessingCompleted) {
                this._screenshotHolder.style.visibility = "";
                this._screenshotNotAvailableMessage.style.visibility = "";
                this._snapshotLoadingProgress.style.visibility = "hidden";
                this.updateSnapshotDisplayType();
            }
            else {
                this._managedSummaryDiv.style.visibility = "hidden";
                this._nativeSummaryDiv.style.visibility = "hidden";
                this._screenshotHolder.style.visibility = "hidden";
                this._screenshotNotAvailableMessage.style.visibility = "hidden";
                this._snapshotLoadingProgress.style.visibility = "";
            }
        };
        SnapshotTileView.prototype.updateSnapshotDisplayType = function () {
            if (this._controller.model.snapshotDisplayType === 0 /* managed */) {
                this._managedSummaryDiv.style.visibility = this._model.summaryData.isProcessingCompleted ? "" : "hidden";
                this._nativeSummaryDiv.style.visibility = "hidden";
            }
            else if (this._controller.model.snapshotDisplayType === 1 /* native */) {
                this._managedSummaryDiv.style.visibility = "hidden";
                this._nativeSummaryDiv.style.visibility = this._model.summaryData.isProcessingCompleted ? "" : "hidden";
            }
        };
        SnapshotTileView.prototype.onCollectionChanged = function (eventArgs) {
            if (eventArgs.action === 0 /* Add */) {
                var newSummary = eventArgs.newItems[0];
                if (this._model.summaryData.id !== newSummary.id) {
                    var contextMenuItem = {
                        callback: this.onDiffToSnapshot.bind(this, newSummary.id),
                        disabled: this.shouldDisableCompareMenu.bind(this),
                        label: Microsoft.Plugin.Resources.getString("SnapshotNumber", newSummary.id + 1),
                        type: 1 /* command */
                    };
                    this._tileContextMenuItems.push(contextMenuItem);
                }
                this.createContextMenu();
            }
        };
        SnapshotTileView.prototype.setFocus = function () {
            this._tileHeader.focus();
        };
        SnapshotTileView.prototype.createContextMenu = function () {
            if (this._tileContextMenu) {
                this._tileContextMenu.detach(this._snapshotTile);
            }
            if (this._tileContextMenuItems.length > 0) {
                var compareToMenuItem = {
                    callback: function () {
                    },
                    label: Microsoft.Plugin.Resources.getString("CompareTo"),
                    disabled: this.shouldDisableCompareMenu.bind(this),
                    submenu: this._tileContextMenuItems,
                    type: 1 /* command */
                };
                this._tileContextMenu = Microsoft.Plugin.ContextMenu.create([compareToMenuItem]);
                this._tileContextMenu.attach(this._snapshotTile);
            }
        };
        SnapshotTileView.prototype.shouldDisableCompareMenu = function () {
            return this._controller.model.restoringSnapshots;
        };
        SnapshotTileView.prototype.populateContextMenu = function () {
            var comparableSnapshots = this._model.getComparableSnapshots();
            for (var i = 0; i < comparableSnapshots.length; i++) {
                var comparable = comparableSnapshots[i];
                var contextMenuItem = {
                    callback: this.onDiffToSnapshot.bind(this, comparable.id),
                    disabled: this.shouldDisableCompareMenu.bind(this),
                    label: Microsoft.Plugin.Resources.getString("SnapshotNumber", comparable.id + 1),
                    type: 1 /* command */
                };
                this._tileContextMenuItems.push(contextMenuItem);
            }
            this.createContextMenu();
        };
        SnapshotTileView.prototype.populateSummaryLinks = function () {
            // Managed data
            this._managedSummaryDiv = this.findElement("managedSummaryData");
            var managedCountLink = this.findElement("managedCountLink");
            var managedSizeLink = this.findElement("managedSizeLink");
            var managedCountDiffLink = this.findElement("managedCountDiffLink");
            var managedCountDiffIndicatorIcon = this.findElement("managedCountDiffIndicatorIcon");
            var managedSizeDiffLink = this.findElement("managedSizeDiffLink");
            var managedSizeDiffIndicatorIcon = this.findElement("managedSizeDiffIndicatorIcon");
            managedCountLink.innerText = this._model.managedCountDisplayString;
            managedSizeLink.innerText = this._model.managedSizeDisplayString;
            managedSizeLink.setAttribute("data-plugin-vs-tooltip", Microsoft.Plugin.Resources.getString("ManagedSizeLinkTooltip"));
            managedCountLink.setAttribute("data-plugin-vs-tooltip", Microsoft.Plugin.Resources.getString("ManagedCountLinkTooltip"));
            managedSizeLink.onclick = this.onManagedSizeClick.bind(this);
            managedCountLink.onclick = this.onManagedCountClick.bind(this);
            if (!this._model.isFirstSnapshot) {
                managedSizeDiffLink.onclick = this.onManagedSizeDiffClick.bind(this);
                managedCountDiffLink.onclick = this.onManagedCountDiffClick.bind(this);
            }
            this.populateDiffLinks(managedSizeDiffLink, managedSizeDiffIndicatorIcon, this._model.managedSizeDiff, this._model.managedSizeDiffDisplayString, Microsoft.Plugin.Resources.getString("ManagedSizeDiffLinkTooltip"));
            this.populateDiffLinks(managedCountDiffLink, managedCountDiffIndicatorIcon, this._model.managedCountDiff, this._model.managedCountDiffDisplayString, Microsoft.Plugin.Resources.getString("ManagedCountDiffLinkTooltip"));
            // Native data
            this._nativeSummaryDiv = this.findElement("nativeSummaryData");
            var nativeCountLink = this.findElement("nativeCountLink");
            var nativeSizeLink = this.findElement("nativeSizeLink");
            var nativeCountDiffLink = this.findElement("nativeCountDiffLink");
            var nativeCountDiffIndicatorIcon = this.findElement("nativeCountDiffIndicatorIcon");
            var nativeSizeDiffLink = this.findElement("nativeSizeDiffLink");
            var nativeSizeDiffIndicatorIcon = this.findElement("nativeSizeDiffIndicatorIcon");
            nativeCountLink.innerText = this._model.nativeCountDisplayString;
            nativeSizeLink.innerText = this._model.nativeSizeDisplayString;
            nativeCountLink.setAttribute("data-plugin-vs-tooltip", Microsoft.Plugin.Resources.getString("NativeCountLinkTooltip"));
            nativeSizeLink.setAttribute("data-plugin-vs-tooltip", Microsoft.Plugin.Resources.getString("NativeSizeLinkTooltip"));
            nativeSizeLink.onclick = this.onNativeSizeClick.bind(this);
            nativeCountLink.onclick = this.onNativeCountClick.bind(this);
            if (!this._model.isFirstSnapshot) {
                nativeSizeDiffLink.onclick = this.onNativeSizeDiffClick.bind(this);
                nativeCountDiffLink.onclick = this.onNativeCountDiffClick.bind(this);
            }
            this.populateDiffLinks(nativeSizeDiffLink, nativeSizeDiffIndicatorIcon, this._model.nativeSizeDiff, this._model.nativeSizeDiffDisplayString, Microsoft.Plugin.Resources.getString("NativeSizeDiffLinkTooltip"));
            this.populateDiffLinks(nativeCountDiffLink, nativeCountDiffIndicatorIcon, this._model.nativeCountDiff, this._model.nativeCountDiffDisplayString, Microsoft.Plugin.Resources.getString("NativeCountDiffLinkTooltip"));
            var links = this.findElementsByClassName("BPT-FileLink");
            for (var linkIndex = 0; linkIndex < links.length; linkIndex++) {
                var linkElement = links[linkIndex];
                linkElement.onkeydown = this.onLinkElementKeyDown.bind(linkElement);
            }
        };
        SnapshotTileView.prototype.onLinkElementKeyDown = function (e) {
            if ((e.keyCode === 13 /* ENTER */ || e.keyCode === 32 /* SPACE */) && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                e.srcElement.click();
            }
        };
        SnapshotTileView.prototype.populateDiffLinks = function (element, iconElement, delta, deltaDisplayString, deltaTooltip) {
            if (!this._model.isFirstSnapshot) {
                element.innerText = deltaDisplayString;
                element.setAttribute("data-plugin-vs-tooltip", deltaTooltip);
                if (delta > 0) {
                    iconElement.classList.add("increaseIcon");
                }
                else if (delta < 0) {
                    iconElement.classList.add("decreaseIcon");
                }
            }
            else {
                element.classList.remove("BPT-FileLink");
                element.classList.add("baselineText");
                element.innerText = Microsoft.Plugin.Resources.getString("Baseline");
                element.tabIndex = -1;
            }
        };
        SnapshotTileView.prototype.onManagedSizeClick = function (e) {
            this._controller.openManagedSizeDetails(this._model.summaryData.id);
        };
        SnapshotTileView.prototype.onManagedCountClick = function (e) {
            this._controller.openManagedCountDetails(this._model.summaryData.id);
        };
        SnapshotTileView.prototype.onManagedSizeDiffClick = function (e) {
            this._controller.openManagedSizeDiffDetails(this._model.summaryData.id);
        };
        SnapshotTileView.prototype.onManagedCountDiffClick = function (e, target) {
            this._controller.openManagedCountDiffDetails(this._model.summaryData.id);
        };
        SnapshotTileView.prototype.onNativeSizeClick = function (e) {
            this._controller.openNativeSizeDetails(this._model.summaryData.id);
        };
        SnapshotTileView.prototype.onNativeCountClick = function (e) {
            this._controller.openNativeCountDetails(this._model.summaryData.id);
        };
        SnapshotTileView.prototype.onNativeSizeDiffClick = function (e) {
            this._controller.openNativeSizeDiffDetails(this._model.summaryData.id);
        };
        SnapshotTileView.prototype.onNativeCountDiffClick = function (e, target) {
            this._controller.openNativeCountDiffDetails(this._model.summaryData.id);
        };
        SnapshotTileView.prototype.onLeaksCountClick = function (e) {
            this._controller.openResourceLeaksDetails(this._model.summaryData.id);
        };
        SnapshotTileView.prototype.onDiffToSnapshot = function (id) {
            if (this._controller.model.snapshotDisplayType == 0 /* managed */) {
                this._controller.openManagedSnapshotDiffDetails(this._model.summaryData.id, id);
            }
            else {
                this._controller.openNativeSnapshotDiffDetails(this._model.summaryData.id, id);
            }
        };
        return SnapshotTileView;
    })(MemoryProfiler.Common.Controls.TemplateControl);
    MemoryProfiler.SnapshotTileView = SnapshotTileView;
})(MemoryProfiler || (MemoryProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/summaryview.csproj__1368025505/objr/x86/built/script/snapshotTileView.js.map

// SummaryView.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../common/controls/componentModel.ts" />
/// <reference path="../../common/controls/templateControl.ts" />
/// <reference path="../../common/util/errorFormatter.ts" />
/// <reference path="../../common/Profiler/MemoryProfilerViewHost.ts" />
/// <reference path="../../common/Profiler/Snapshot.ts" />
/// <reference path="../../common/Profiler/SnapshotSummary.ts" />
/// <reference path="../../common/Profiler/SnapshotEngine.ts" />
/// <reference path="../../common/Profiler/SummaryEngine.ts" />
/// <reference path="../../common/Profiler/SummaryAgent.ts" />
/// <reference path="../../common/Profiler/ClrSnapshotAgent.ts" />
/// <reference path="../../common/Profiler/ScreenshotSnapshotAgent.ts" />
/// <reference path="../../common/Profiler/NativeSummaryAgent.ts" />
/// <reference path="../../common/Profiler/ManagedSummaryAgent.ts" />
/// <reference path="../../common/Profiler/MemoryLeaksSummaryAgent.ts" />
/// <reference path="../../common/Profiler/FeedbackConstants.ts" />
/// <reference path="snapshotTileView.ts" />
/// <reference path="snapshotHeapTypeToggle.ts" />
var Common = MemoryProfiler.Common;
var MemoryProfiler;
(function (MemoryProfiler) {
    "use strict";
    var SummaryViewController = (function () {
        function SummaryViewController(sessionInfo) {
            this._pendingSnapshots = [];
            this._summaryAgents = [];
            MemoryProfiler.Common.MemoryProfilerViewHost.startCodeMarker(27202 /* perfMP_ViewLoadStart */, 27203 /* perfMP_ViewLoadEnd */);
            this.model = new SummaryViewModel();
            this.view = new SummaryView(this, this.model);
            // DiagHub uses the documentSessionId as the subdomain for ScriptedControls it creates. Since our tool creates details view
            // on its own it needs to know the documentSessionId of the active session so that Daytona would not create a new ScriptedBox
            // Process to run the new control on.
            this._loadDataWarehousePromise = Microsoft.VisualStudio.DiagnosticsHub.DataWarehouse.loadDataWarehouse();
            this._loadDataWarehousePromise.then(function (dataWareHouse) {
                MemoryProfiler.Common.MemoryProfilerViewHost.session.setScriptedContextId(dataWareHouse.getConfiguration().sessionId);
            });
            if (sessionInfo.snapshots.length === 0) {
                this.model.warningMessage = Microsoft.Plugin.Resources.getString("NoSnapshotsTakenWarning");
                ;
                MemoryProfiler.Common.MemoryProfilerViewHost.endCodeMarker(27202 /* perfMP_ViewLoadStart */);
                return;
            }
            this.loadExistingSnapshots(sessionInfo);
            // Determine what heaps we're supporting.  If supporting managed + native, we need a toggle-bar.
            // Until we hook up User Settings, we only know if target is managed(+native), or just native
            // Once we have User Settings, we'll have a 3rd option: managed-only
            if (sessionInfo.targetRuntime === 3 /* mixed */) {
                this.view.initializeToggleBar();
            }
            else if (sessionInfo.targetRuntime === 1 /* native */) {
                // We default to MANAGED unless we're only showing native.
                this.model.snapshotDisplayType = 1 /* native */;
            }
        }
        SummaryViewController.prototype.loadExistingSnapshots = function (sessioninfo) {
            var _this = this;
            var snapshots = sessioninfo.snapshots;
            var snapshotAgents = [];
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logBeginLoadSnapshots();
            snapshotAgents.push(new MemoryProfiler.Common.ScreenshotSnapshotAgent());
            if (sessioninfo.targetRuntime !== 1 /* native */) {
                snapshotAgents.push(new MemoryProfiler.Common.ClrSnapshotAgent());
                this._summaryAgents.push(new MemoryProfiler.Common.ManagedSummaryAgent());
            }
            if (sessioninfo.targetRuntime !== 2 /* managed */) {
                this._summaryAgents.push(new MemoryProfiler.Common.NativeSummaryAgent(this._loadDataWarehousePromise));
            }
            if (sessioninfo.isRLDEnabled === true) {
                this._summaryAgents.push(new MemoryProfiler.Common.MemoryLeaksSummaryAgent(this._loadDataWarehousePromise));
            }
            this.model.restoringSnapshots = true;
            this._pendingSnapshots = [];
            for (var i = 0; i < snapshots.length; i++) {
                var restoreEngine = new MemoryProfiler.Common.SnapshotRestoreEngine(i, snapshotAgents, snapshots[i]);
                restoreEngine.restore(function (snapshot) {
                    _this._pendingSnapshots.push(snapshot);
                    _this.model.snapshotSummaryCollection.add(new MemoryProfiler.Common.SnapshotSummary(snapshot));
                });
            }
            // OK, restoration complete.  That should have been the quick & easy part.
            // Initialize each summary agent in parallel
            MemoryProfiler.Common.MemoryProfilerViewHost.session.getSessionStartupTime().then(function (sessionStartTime) {
                var promises = [];
                _this._summaryAgents.forEach(function (agent) {
                    promises.push(agent.initializeAnalyzerData(sessionStartTime, _this._pendingSnapshots));
                });
                return Microsoft.Plugin.Promise.join(promises);
            }).done(function () {
                // Now, we kick off analysis by reversing the queue and popping of the first snapshot to tackle
                _this._pendingSnapshots.reverse();
                _this.processNextSnapshotSummary();
            });
        };
        SummaryViewController.prototype.openManagedSizeDetails = function (snapshotId) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenManagedHeapViewBySize, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.viewSnapshot(snapshotId, "ManagedHeap", "RetainedSize");
        };
        SummaryViewController.prototype.openManagedCountDetails = function (snapshotId) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenManagedHeapViewByCount, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.viewSnapshot(snapshotId, "ManagedHeap", "Count");
        };
        SummaryViewController.prototype.openManagedSizeDiffDetails = function (snapshotId) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenDiffManagedHeapViewBySize, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.compareSnapshots(snapshotId, snapshotId - 1, "ManagedHeap", "RetainedSizeDiff");
        };
        SummaryViewController.prototype.openManagedCountDiffDetails = function (snapshotId) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenDiffManagedHeapViewByCount, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.compareSnapshots(snapshotId, snapshotId - 1, "ManagedHeap", "CountDiff");
        };
        SummaryViewController.prototype.openManagedSnapshotDiffDetails = function (snapshotId1, snapshotId2) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenDiffManagedHeapView, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Menu, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.compareSnapshots(Math.max(snapshotId1, snapshotId2), Math.min(snapshotId1, snapshotId2), "ManagedHeap", "RetainedSizeDiff");
        };
        SummaryViewController.prototype.openNativeSizeDetails = function (snapshotId) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenNativeHeapViewBySize, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.viewSnapshot(snapshotId, "NativeHeap", "OutstandingSize");
        };
        SummaryViewController.prototype.openNativeCountDetails = function (snapshotId) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenNativeHeapViewByCount, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.viewSnapshot(snapshotId, "NativeHeap", "OutstandingCount");
        };
        SummaryViewController.prototype.openResourceLeaksDetails = function (snapshotId) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenMemoryLeaksView, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.viewSnapshot(snapshotId, "MemoryLeaks", "OutstandingSize");
        };
        SummaryViewController.prototype.openNativeSizeDiffDetails = function (snapshotId) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenDiffNativeHeapViewBySize, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.compareSnapshots(snapshotId, snapshotId - 1, "NativeHeap", "OutstandingSizeDiff");
        };
        SummaryViewController.prototype.openNativeCountDiffDetails = function (snapshotId) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenDiffNativeHeapViewByCount, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.compareSnapshots(snapshotId, snapshotId - 1, "NativeHeap", "OutstandingCountDiff");
        };
        SummaryViewController.prototype.openNativeSnapshotDiffDetails = function (snapshotId1, snapshotId2) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.OpenDiffNativeHeapView, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Menu, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
            this.compareSnapshots(Math.max(snapshotId1, snapshotId2), Math.min(snapshotId1, snapshotId2), "NativeHeap", "OutstandingSizeDiff");
        };
        SummaryViewController.prototype.viewSnapshot = function (snapshotId, target, sortProperty) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.openSnapshotDetails(snapshotId, target, sortProperty, this.shouldAddMemoryLeaksTab(snapshotId));
        };
        SummaryViewController.prototype.shouldAddMemoryLeaksTab = function (snapshotId) {
            if (this.model.snapshotSummaryCollection.getItem(snapshotId).resourceLeakCount && this.model.snapshotSummaryCollection.getItem(snapshotId).resourceLeakCount > 0) {
                return true;
            }
            return false;
        };
        SummaryViewController.prototype.compareSnapshots = function (lastSnapshotId, firstSnapshotId, target, sortProperty) {
            MemoryProfiler.Common.MemoryProfilerViewHost.session.openSnapshotDiff(firstSnapshotId, lastSnapshotId, target, sortProperty);
        };
        SummaryViewController.prototype.reset = function () {
            this.model.snapshotSummaryCollection.clear();
            MemoryProfiler.Common.MemoryProfilerViewHost.onIdle();
        };
        SummaryViewController.prototype.processNextSnapshotSummary = function () {
            if (this._pendingSnapshots.length == 0) {
                this.summaryProcessCleanup();
            }
            else {
                var snapshot = this._pendingSnapshots.pop();
                this._summaryEngine = new MemoryProfiler.Common.SummaryEngine(snapshot, this._summaryAgents);
                this._summaryEngine.processSummary().done(this.onSummaryProcessComplete.bind(this), this.onSummaryProcessError.bind(this), this.onSummaryProcessProgress.bind(this));
            }
        };
        SummaryViewController.prototype.cancelSummaryProcessing = function () {
            if (this._summaryEngine) {
                this._summaryEngine.cancel();
                this.summaryProcessCleanup();
            }
        };
        SummaryViewController.prototype.onSummaryProcessComplete = function (summary) {
            for (var i = 0; i < this.model.snapshotSummaryCollection.length; i++) {
                if (this.model.snapshotSummaryCollection.getItem(i).id === summary.id) {
                    this.model.snapshotSummaryCollection.replace(i, summary);
                    break;
                }
            }
            this.processNextSnapshotSummary();
        };
        SummaryViewController.prototype.onSummaryProcessError = function (error) {
            /// need to report the error!
            this.summaryProcessCleanup();
        };
        SummaryViewController.prototype.onSummaryProcessProgress = function (progress) {
            // UI during analysis would be nice :)
        };
        SummaryViewController.prototype.summaryProcessCleanup = function () {
            this._summaryEngine = null;
            this._summaryAgents = null;
            this._pendingSnapshots = [];
            this.model.restoringSnapshots = false;
            // If we had snapshots to restore, we're now done loading the view
            //
            // !! NOTE: The order of code markers is important for automation. !!
            // We need to make sure ViewLoad fires after RestoringSnapshots
            // (fired by setting restoringSnapshots above).
            //
            MemoryProfiler.Common.MemoryProfilerViewHost.endCodeMarker(27202 /* perfMP_ViewLoadStart */);
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logEndLoadSnapshots();
        };
        return SummaryViewController;
    })();
    MemoryProfiler.SummaryViewController = SummaryViewController;
    var SummaryViewModel = (function (_super) {
        __extends(SummaryViewModel, _super);
        function SummaryViewModel() {
            _super.call(this);
            this._warningMessage = "";
            this._restoringSnapshots = false;
            this._snapshotDisplayType = 0 /* managed */;
            this._snapshotSummaryCollection = new MemoryProfiler.Common.Controls.ObservableCollection();
            // Note: In the future, we may have per-view default settings. For now, log the defaults as coming from the corresponding views.
            this.LogSelectSnapshotViewCommand(this.snapshotDisplayType, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Default, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
        }
        Object.defineProperty(SummaryViewModel.prototype, "snapshotSummaryCollection", {
            get: function () {
                return this._snapshotSummaryCollection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SummaryViewModel.prototype, "warningMessage", {
            get: function () {
                return this._warningMessage;
            },
            set: function (v) {
                if (this._warningMessage !== v) {
                    this._warningMessage = v;
                    this.raisePropertyChanged("warningMessage");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SummaryViewModel.prototype, "snapshotDisplayType", {
            get: function () {
                return this._snapshotDisplayType;
            },
            set: function (v) {
                if (this._snapshotDisplayType !== v) {
                    this._snapshotDisplayType = v;
                    this.LogSelectSnapshotViewCommand(v, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.SummaryView);
                    this.raisePropertyChanged("snapshotDisplayType");
                }
            },
            enumerable: true,
            configurable: true
        });
        SummaryViewModel.prototype.LogSelectSnapshotViewCommand = function (v, invokeMethodName, commandSourceName) {
            var feedbackCommandName;
            if (v === 0 /* managed */) {
                feedbackCommandName = MemoryProfiler.Common.FeedbackCommandNames.SelectManagedHeapSnapshotView;
            }
            else {
                feedbackCommandName = MemoryProfiler.Common.FeedbackCommandNames.SelectNativeHeapSnapshotView;
            }
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(feedbackCommandName, invokeMethodName, commandSourceName);
        };
        Object.defineProperty(SummaryViewModel.prototype, "restoringSnapshots", {
            get: function () {
                return this._restoringSnapshots;
            },
            set: function (v) {
                if (this._restoringSnapshots !== v) {
                    this._restoringSnapshots = v;
                    this.raisePropertyChanged("restoringSnapshots");
                    if (this._restoringSnapshots) {
                        MemoryProfiler.Common.MemoryProfilerViewHost.startCodeMarker(27230 /* perfMP_SnapshotRestoreStart */, 27231 /* perfMP_SnapshotRestoreEnd */);
                    }
                    else {
                        MemoryProfiler.Common.MemoryProfilerViewHost.endCodeMarker(27230 /* perfMP_SnapshotRestoreStart */);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        return SummaryViewModel;
    })(MemoryProfiler.Common.Controls.ObservableViewModel);
    MemoryProfiler.SummaryViewModel = SummaryViewModel;
    var SummaryView = (function (_super) {
        __extends(SummaryView, _super);
        function SummaryView(controller, model) {
            _super.call(this, "SummaryViewTemplate");
            this._controller = controller;
            this._model = model;
            this._snapshotTileViewModelCollection = [];
            this._model.registerPropertyChanged(this);
            this._model.snapshotSummaryCollection.registerCollectionChanged(this);
            this._tilesContainer = this.findElement("tilesContainer");
            this._warningSection = this.findElement("warningSection");
        }
        Object.defineProperty(SummaryView.prototype, "snapshotTileViewModelCollection", {
            get: function () {
                return this._snapshotTileViewModelCollection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SummaryView.prototype, "tilesContainer", {
            get: function () {
                return this._tilesContainer;
            },
            enumerable: true,
            configurable: true
        });
        SummaryView.prototype.initializeToggleBar = function () {
            this._snapshotToggleBar = this.findElement("toggleTabSection");
            var toggle = new MemoryProfiler.SnapshotHeapTypeToggle(this._model);
            this._snapshotToggleBar.appendChild(toggle.rootElement);
        };
        SummaryView.prototype.onPropertyChanged = function (propertyName) {
            switch (propertyName) {
                case "warningMessage":
                    this.showWarningMessage(this._model.warningMessage);
                    break;
            }
        };
        SummaryView.prototype.onCollectionChanged = function (eventArgs) {
            switch (eventArgs.action) {
                case 0 /* Add */:
                    this.createTile(eventArgs.newItems[0]);
                    break;
                case 1 /* Reset */:
                    this.removeSnapshotTiles();
                    break;
                case 2 /* Replace */:
                    this.updateTile(eventArgs.newItems[0]);
                    break;
            }
        };
        SummaryView.prototype.updateTile = function (snapshotSummary) {
            for (var i = 0; i < this._snapshotTileViewModelCollection.length; i++) {
                if (this._snapshotTileViewModelCollection[i].summaryData.id === snapshotSummary.id) {
                    this._snapshotTileViewModelCollection[i].summaryData = snapshotSummary;
                    break;
                }
            }
        };
        SummaryView.prototype.createTile = function (snapshotSummary) {
            // Create the model and the view
            var model = new MemoryProfiler.SnapshotTileViewModel(snapshotSummary, this._model.snapshotSummaryCollection);
            var newTile = new MemoryProfiler.SnapshotTileView(this._controller, model);
            this._model.snapshotSummaryCollection.registerCollectionChanged(newTile);
            this._snapshotTileViewModelCollection.push(model);
            this._tilesContainer.appendChild(newTile.rootElement);
            newTile.rootElement.scrollIntoView(true);
            newTile.setFocus();
        };
        SummaryView.prototype.removeSnapshotTiles = function () {
            while (this._tilesContainer.hasChildNodes()) {
                this._tilesContainer.removeChild(this._tilesContainer.firstChild);
            }
            this._snapshotTileViewModelCollection = [];
        };
        SummaryView.prototype.toggleProgress = function (show) {
            if (this._snapshotProgress && this._snapshotError) {
                if (show) {
                    this._snapshotLabel.style.display = "none";
                    this._snapshotIcon.style.display = "none";
                    this._snapshotProgress.style.display = "block";
                    this._snapshotError.style.display = "none";
                }
                else {
                    this._snapshotLabel.style.display = "";
                    this._snapshotIcon.style.display = "";
                    this._snapshotProgress.style.display = "none";
                }
            }
        };
        SummaryView.prototype.showSnapshotError = function (error) {
            if (this._snapshotErrorMsg && this._snapshotError) {
                if (error) {
                    // Show the message
                    this._snapshotErrorMsg.innerText = MemoryProfiler.Common.ErrorFormatter.format(error);
                    this._snapshotError.style.display = "block";
                }
                else {
                    // Hide the message
                    this._snapshotErrorMsg.innerText = "";
                    this._snapshotError.style.display = "none";
                }
            }
        };
        SummaryView.prototype.showWarningMessage = function (warning) {
            if (!this._warningSection) {
                return;
            }
            if (warning) {
                this._warningSection.innerHTML = warning;
                this._warningSection.style.display = "-ms-grid";
            }
            else {
                this._warningSection.innerHTML = "";
                this._warningSection.style.display = "none";
            }
        };
        return SummaryView;
    })(MemoryProfiler.Common.Controls.TemplateControl);
    MemoryProfiler.SummaryView = SummaryView;
})(MemoryProfiler || (MemoryProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/summaryview.csproj__1368025505/objr/x86/built/script/SummaryView.js.map

// SummaryViewHost.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../Common/Extensions/Session.ts" />
/// <reference path="../../Common/controls/control.ts" />
/// <reference path="../../Common/controls/componentModel.ts" />
/// <reference path="../../Common/Profiler/MemoryProfilerViewHost.ts" />
/// <reference path="SummaryView.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    "use strict";
    var SummaryViewHost = (function (_super) {
        __extends(SummaryViewHost, _super);
        function SummaryViewHost() {
            _super.call(this);
        }
        SummaryViewHost.prototype.initializeView = function (sessionInfo) {
            this.summaryViewController = new MemoryProfiler.SummaryViewController(sessionInfo);
            document.getElementById('mainContainer').appendChild(this.summaryViewController.view.rootElement);
        };
        return SummaryViewHost;
    })(MemoryProfiler.Common.MemoryProfilerViewHostBase);
    MemoryProfiler.SummaryViewHost = SummaryViewHost;
    MemoryProfiler.SummaryViewHostInstance = new SummaryViewHost();
})(MemoryProfiler || (MemoryProfiler = {}));
MemoryProfiler.SummaryViewHostInstance.loadView();
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/summaryview.csproj__1368025505/objr/x86/built/script/SummaryViewHost.js.map

// snapshotHeapTypeToggle.ts
// 
// Copyright (C) Microsoft. All rights reserved.
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../Common/Controls/templateControl.ts" />
/// <reference path="SummaryView.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    "use strict";
    (function (SnapshotDisplayType) {
        SnapshotDisplayType[SnapshotDisplayType["managed"] = 0] = "managed";
        SnapshotDisplayType[SnapshotDisplayType["native"] = 1] = "native";
    })(MemoryProfiler.SnapshotDisplayType || (MemoryProfiler.SnapshotDisplayType = {}));
    var SnapshotDisplayType = MemoryProfiler.SnapshotDisplayType;
    var SnapshotHeapTypeToggle = (function (_super) {
        __extends(SnapshotHeapTypeToggle, _super);
        function SnapshotHeapTypeToggle(viewModel) {
            _super.call(this, "SnapshotHeapTypeToggleTemplate");
            this._summaryViewModel = viewModel;
            this._summaryViewModel.registerPropertyChanged(this);
            this._managedHeapButton = this.findElement("snapshotToggleTabManagedButton");
            this._nativeHeapButton = this.findElement("snapshotToggleTabdNativeButton");
            this.findElement("snapshotToggleTabLabel").innerText = Microsoft.Plugin.Resources.getString("SnapshotToggleTabLabel");
            ;
            this._managedHeapButton.innerHTML = Microsoft.Plugin.Resources.getString("SnapshotToggleTabManagedButton");
            this._nativeHeapButton.innerText = Microsoft.Plugin.Resources.getString("SnapshotToggleTabNativeButton");
            this._managedHeapButton.onclick = this.setManagedHeapToggleButtonSelected.bind(this);
            this._nativeHeapButton.onclick = this.setNativeHeapToggleButtonSelected.bind(this);
            var toggleButtons = this.findElementsByClassName("toggleTabButtonContainer");
            for (var buttomIndex = 0; buttomIndex < toggleButtons.length; buttomIndex++) {
                var buttonElement = toggleButtons[buttomIndex];
                buttonElement.onkeydown = this.onButtonElementKeyDown.bind(buttonElement);
            }
            this.updateUI();
        }
        SnapshotHeapTypeToggle.prototype.onButtonElementKeyDown = function (e) {
            if ((e.keyCode === 13 /* ENTER */ || e.keyCode === 32 /* SPACE */) && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                e.srcElement.click();
            }
        };
        SnapshotHeapTypeToggle.prototype.onPropertyChanged = function (propertyName) {
            switch (propertyName) {
                case "snapshotDisplayType":
                    this.updateUI();
                    break;
            }
        };
        SnapshotHeapTypeToggle.prototype.updateUI = function () {
            var isManagedSelected = this._summaryViewModel.snapshotDisplayType === 0 /* managed */;
            if (isManagedSelected) {
                this._managedHeapButton.classList.add("toggleTabSelectedButtonOutline");
                this._nativeHeapButton.classList.remove("toggleTabSelectedButtonOutline");
            }
            else if (this._summaryViewModel.snapshotDisplayType === 1 /* native */) {
                this._nativeHeapButton.classList.add("toggleTabSelectedButtonOutline");
                this._managedHeapButton.classList.remove("toggleTabSelectedButtonOutline");
            }
            this._nativeHeapButton.setAttribute("aria-checked", isManagedSelected ? "false" : "true");
            this._managedHeapButton.setAttribute("aria-checked", isManagedSelected ? "true" : "false");
        };
        SnapshotHeapTypeToggle.prototype.setManagedHeapToggleButtonSelected = function () {
            this._summaryViewModel.snapshotDisplayType = 0 /* managed */;
        };
        SnapshotHeapTypeToggle.prototype.setNativeHeapToggleButtonSelected = function () {
            this._summaryViewModel.snapshotDisplayType = 1 /* native */;
        };
        return SnapshotHeapTypeToggle;
    })(MemoryProfiler.Common.Controls.TemplateControl);
    MemoryProfiler.SnapshotHeapTypeToggle = SnapshotHeapTypeToggle;
})(MemoryProfiler || (MemoryProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/summaryview.csproj__1368025505/objr/x86/built/script/snapshotHeapTypeToggle.js.map


// SIG // Begin signature block
// SIG // MIIasgYJKoZIhvcNAQcCoIIaozCCGp8CAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFOx0tNXgzSL9
// SIG // AdtqalpOnq/X0CGZoIIVgzCCBMMwggOroAMCAQICEzMA
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
// SIG // +i+ePy5VFmvJE6P9MYIEmzCCBJcCAQEwgZAweTELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0
// SIG // IENvZGUgU2lnbmluZyBQQ0ECEzMAAAFAlqnucFb+zAcA
// SIG // AQAAAUAwCQYFKw4DAhoFAKCBtDAZBgkqhkiG9w0BCQMx
// SIG // DAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYK
// SIG // KwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQUjK83AsZw
// SIG // mGYdQDndfSHi2BqFtzkwVAYKKwYBBAGCNwIBDDFGMESg
// SIG // KoAoAFMAdQBtAG0AYQByAHkAVgBpAGUAdwBNAGUAcgBn
// SIG // AGUAZAAuAGoAc6EWgBRodHRwOi8vbWljcm9zb2Z0LmNv
// SIG // bTANBgkqhkiG9w0BAQEFAASCAQBkUOcqLl75V8jAAFvD
// SIG // AGaVIH+1mISB1uvRKgu4/DO/4IMLJbNkr0bpHjh41605
// SIG // A5Co1pg9/oyg27j/5u1N1nWdI98oNZOCdFHqEOi1iEa9
// SIG // s6ANXMwQPTW6HgHRC0z1t5OFzRTJbf8iM4kSLkB5DTzR
// SIG // 2KkU48PvOfsDoPnQv3L5vVHx6pN1azp1W/VPrzkoUFOj
// SIG // ruofAVuZuFPFnMU4UybZ0myPL14yfnFbFxggmv5aWCYY
// SIG // kO4nTCBZvcKr080Qz93SUA4fLX3SJneRp57B7MaPZfxi
// SIG // 63Ntrc8KroksXZuUM7Z1wpzTFUgn3+gO1jQYFTdg6/es
// SIG // gL4rnZpl9zGIVRnioYICKDCCAiQGCSqGSIb3DQEJBjGC
// SIG // AhUwggIRAgEBMIGOMHcxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // ITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0YW1wIFBD
// SIG // QQITMwAAAJmqxYGfjKJ9igAAAAAAmTAJBgUrDgMCGgUA
// SIG // oF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkq
// SIG // hkiG9w0BCQUxDxcNMTYwOTA3MDQ0NzI0WjAjBgkqhkiG
// SIG // 9w0BCQQxFgQUSVnC3CNZpnfJwiXS2SG39IxsRNQwDQYJ
// SIG // KoZIhvcNAQEFBQAEggEAZA21qoa5RFWQ+ZD5xe0iH5Z+
// SIG // kHTQl5uUxlMaMttMkpIlMsm6gWPxHzNPWQATSRY9B5bI
// SIG // 5bjb3tuwbOgy0GaWt56HM8Q5K+GvVoUmOKzrmIhPCO3A
// SIG // cKcUtHcKEj2p80my314xjNfNBC+IDY6wLCPv528z/0Qu
// SIG // N0r0FGhizACO2IwHBs64InpcwJgiGbNZVm84+t3EuX2P
// SIG // 7863DudXIyjFrjKhloolIwozS7/8WwNDhxvKDoHlG/Vb
// SIG // PEXyYzIDu6jizANmlhz9WykCChRBhSUcbNhnumvacnDp
// SIG // VSyBx4VAmjmR/G2rjiIq05iLals2Mow2fyrgBEzd15Xj
// SIG // 7v7vcSZvKw==
// SIG // End signature block
