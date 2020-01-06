//
// Copyright (C) Microsoft. All rights reserved.
//
// SnapshotTileView.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../../../common/script/Hub/plugin.redirect.d.ts" />
/// <reference path="../../Common/Controls/templateControl.ts" />
/// <reference path="../../Common/Util/formattingHelpers.ts" />
/// <reference path="../../Common/controls/componentModel.ts" />
/// <reference path="../../Common/Profiler/Snapshot.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    "use strict";
    var SnapshotTileViewModel = (function () {
        function SnapshotTileViewModel(summary) {
            this._summary = summary;
        }
        Object.defineProperty(SnapshotTileViewModel.prototype, "summaryData", {
            get: function () {
                return this._summary;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SnapshotTileViewModel.prototype, "timeTaken", {
            get: function () {
                var date = new Date(this._summary.timestamp);
                return "(" + date.toLocaleTimeString() + ")";
            },
            enumerable: true,
            configurable: true
        });
        return SnapshotTileViewModel;
    })();
    MemoryProfiler.SnapshotTileViewModel = SnapshotTileViewModel;
    var SnapshotTileView = (function (_super) {
        __extends(SnapshotTileView, _super);
        function SnapshotTileView(model) {
            _super.call(this, "SnapshotTileTemplate");
            this._model = model;
            this._snapshotTile = this.findElement("snapshotTile");
            this._tileHeader = this.findElement("snapshotTileHeader");
            this._screenshotNotAvailableMessage = this.findElement("screenshotNotAvailableMessage");
            this.findElement("snapshotTileTitle").innerText = Microsoft.Plugin.Resources.getString("SnapshotNumber", this._model.summaryData.id);
            if (this._model.summaryData.screenshotFile) {
                var imgHolder = this.findElement("snapshotTileImage");
                imgHolder.src = this._model.summaryData.screenshotFile;
                this._screenshotNotAvailableMessage.style.display = "none";
            }
            this.findElement("snapshotTakenDate").innerText = this._model.timeTaken;
            this.findElement("stopToSeeSnapshotDetails").innerText = Microsoft.Plugin.Resources.getString("StopToSeeSnapshotMessage");
            this._screenshotNotAvailableMessage.innerText = Microsoft.Plugin.Resources.getString("ScreenshotNotAvailable");
        }
        SnapshotTileView.prototype.setFocus = function () {
            this._tileHeader.focus();
        };
        return SnapshotTileView;
    })(MemoryProfiler.Common.Controls.TemplateControl);
    MemoryProfiler.SnapshotTileView = SnapshotTileView;
})(MemoryProfiler || (MemoryProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/collectionview.csproj_795261541/objr/x86/built/Script/SnapshotTileView.js.map

// CollectionView.ts
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
/// <reference path="../../common/util/EnumHelper.ts" />
/// <reference path="../../../../../common/script/util/notifications.ts" />
/// <reference path="../../common/Profiler/MemoryNotifications.ts" />
/// <reference path="../../common/util/errorFormatter.ts" />
/// <reference path="snapshotTileView.ts" />
/// <reference path="../../common/Profiler/MemoryProfilerViewHost.ts" />
/// <reference path="../../../../../common/script/Hub/Plugin.redirect.d.ts" />
/// <reference path="../../../../../common/script/Hub/DiagnosticsHub.redirect.d.ts" />
/// <reference path="../../common/Profiler/SnapshotEngine.ts" />
/// <reference path="../../common/Profiler/ClrSnapshotAgent.ts" />
/// <reference path="../../common/Profiler/ScreenshotSnapshotAgent.ts" />
/// <reference path="../../common/Profiler/FeedbackConstants.ts" />
/// <reference path="CollectionAgentTask.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    "use strict";
    var CollectionViewController = (function () {
        function CollectionViewController(initializeView) {
            if (initializeView === void 0) { initializeView = true; }
            this._screenshotHeight = 150;
            this._screenshotKeepAspectRatio = true;
            this._screenshotWidth = 200;
            this._agentGuid = "2E8E6F4B-6107-4F46-8BEA-A920EA880452"; // This is the guid of MemoryProfilerCollectionAgent
            this._activeCollectionAgentTasks = [];
            this.model = new CollectionViewModel();
            if (initializeView) {
                this.view = new CollectionView(this, this.model);
            }
            this._standardCollector = Microsoft.VisualStudio.DiagnosticsHub.Collectors.getStandardTransportService();
            if (this._standardCollector) {
                this._standardCollector.addMessageListener(new Microsoft.VisualStudio.DiagnosticsHub.Guid(this._agentGuid), this.onMessageReceived.bind(this));
            }
            this._takeSnapshotTask = new MemoryProfiler.TakeSnapshotTask(this);
            this._forceGcTask = new MemoryProfiler.ForceGcCollectionAgentTask(this);
        }
        Object.defineProperty(CollectionViewController.prototype, "isCollectionAgentTaskActive", {
            get: function () {
                return this._activeCollectionAgentTasks.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectionViewController.prototype, "managedDataSeen", {
            get: function () {
                return this._managedDataSeen;
            },
            set: function (v) {
                this._managedDataSeen = v;
            },
            enumerable: true,
            configurable: true
        });
        CollectionViewController.prototype.takeSnapshot = function () {
            this._activeCollectionAgentTasks.push(this._takeSnapshotTask);
            return this._takeSnapshotTask.start();
        };
        CollectionViewController.prototype.forceGarbageCollection = function () {
            this._activeCollectionAgentTasks.push(this._forceGcTask);
            return this._forceGcTask.start();
        };
        CollectionViewController.prototype.setScreenshotSize = function (targetWidth, targetHeight, keepAspectRatio) {
            // Set the size of all future screenshots that are taken of the application
            this._screenshotWidth = targetWidth;
            this._screenshotHeight = targetHeight;
            this._screenshotKeepAspectRatio = keepAspectRatio;
        };
        CollectionViewController.prototype.reset = function () {
            CollectionViewController._nextIdentifier = 1;
            this.model.snapshotSummaryCollection.clear();
            MemoryProfiler.Common.MemoryProfilerViewHost.onIdle();
        };
        CollectionViewController.prototype.sendStringToCollectionAgent = function (request) {
            return this._standardCollector.sendStringToCollectionAgent(this._agentGuid, request);
        };
        CollectionViewController.prototype.downloadFile = function (targetFilePath, localFilePath) {
            var transportService = Microsoft.VisualStudio.DiagnosticsHub.Collectors.getStandardTransportService();
            return transportService.downloadFile(targetFilePath, localFilePath);
        };
        CollectionViewController.prototype.getSnapshotSummary = function (snapshotId) {
            var foundSnapshotSummary = null;
            for (var i = 0; i < this.model.snapshotSummaryCollection.length; i++) {
                var snapshotSummary = this.model.snapshotSummaryCollection.getItem(i);
                if (snapshotSummary.id === snapshotId) {
                    foundSnapshotSummary = snapshotSummary;
                    break;
                }
            }
            return foundSnapshotSummary;
        };
        CollectionViewController.prototype.onMessageReceived = function (message) {
            if (message) {
                var obj = JSON.parse(message);
                if (obj.eventName) {
                    switch (obj.eventName) {
                        case "notifyManagedPresent":
                            this.managedDataSeen = true;
                            MemoryProfiler.Common.MemoryProfilerViewHost.session.getSessionInfo().then(function (info) {
                                if (info.targetRuntime === 2 /* managed */ || info.targetRuntime === 3 /* mixed */) {
                                    MemoryProfiler.CollectionViewHost.VsCommandChain.onTargetIsManaged();
                                }
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
            for (var i = this._activeCollectionAgentTasks.length - 1; i >= 0; i--) {
                if (this._activeCollectionAgentTasks[i].isCompleted(message)) {
                    this._activeCollectionAgentTasks.splice(i, 1);
                }
            }
        };
        CollectionViewController.prototype.sendMessage = function (message) {
            this._standardCollector.sendStringToCollectionAgent(this._agentGuid, message).done(function (response) {
                if (response) {
                    var obj = JSON.parse(response);
                    if (!obj.succeeded) {
                        throw new Error(obj.errorMessage);
                    }
                }
            });
        };
        CollectionViewController._snapshotChunkSize = 32768;
        CollectionViewController._nextIdentifier = 1;
        return CollectionViewController;
    })();
    MemoryProfiler.CollectionViewController = CollectionViewController;
    var CollectionViewModel = (function (_super) {
        __extends(CollectionViewModel, _super);
        function CollectionViewModel() {
            _super.call(this);
            this._warningMessage = "";
            this._latestSnapshotError = null;
            this._isTakingSnapshot = false;
            this._isForcingGarbageCollection = false;
            this._snapshotSummaryCollection = new MemoryProfiler.Common.Controls.ObservableCollection();
        }
        Object.defineProperty(CollectionViewModel.prototype, "snapshotSummaryCollection", {
            get: function () {
                return this._snapshotSummaryCollection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectionViewModel.prototype, "warningMessage", {
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
        Object.defineProperty(CollectionViewModel.prototype, "latestSnapshotError", {
            get: function () {
                return this._latestSnapshotError;
            },
            set: function (v) {
                if (this._latestSnapshotError !== v) {
                    this._latestSnapshotError = v;
                    this.raisePropertyChanged("latestSnapshotError");
                    // Create the WER
                    MemoryProfiler.Common.MemoryProfilerViewHost.reportError(v, "SnapshotCapturingFailure");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectionViewModel.prototype, "isTakingSnapshot", {
            get: function () {
                return this._isTakingSnapshot;
            },
            set: function (v) {
                if (this._isTakingSnapshot !== v) {
                    this._isTakingSnapshot = v;
                    this.raisePropertyChanged("isTakingSnapshot");
                    this.raisePropertyChanged("isViewBusy");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectionViewModel.prototype, "isForcingGarbageCollection", {
            get: function () {
                return this._isForcingGarbageCollection;
            },
            set: function (v) {
                if (this._isForcingGarbageCollection !== v) {
                    this._isForcingGarbageCollection = v;
                    this.raisePropertyChanged("isForcingGarbageCollection");
                    this.raisePropertyChanged("isViewBusy");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectionViewModel.prototype, "isViewBusy", {
            get: function () {
                return this._isForcingGarbageCollection || this._isTakingSnapshot;
            },
            enumerable: true,
            configurable: true
        });
        return CollectionViewModel;
    })(MemoryProfiler.Common.Controls.ObservableViewModel);
    MemoryProfiler.CollectionViewModel = CollectionViewModel;
    var CollectionView = (function (_super) {
        __extends(CollectionView, _super);
        function CollectionView(controller, model) {
            _super.call(this, "CollectionViewTemplate");
            this._screenshotWidth = 280;
            this._screenshotHeight = 160;
            this._screenshotKeepAspectRatio = true;
            this._controller = controller;
            this._model = model;
            this._model.registerPropertyChanged(this);
            this._model.snapshotSummaryCollection.registerCollectionChanged(this);
            this._snapshotTileViewModelCollection = [];
            this._tilesContainer = this.findElement("tilesContainer");
            this._warningSection = this.findElement("warningSection");
            this._onSnapshotClickHandler = this.onSnapshotClick.bind(this);
            this._takeSnapshotTile = this.findElement("takeSnapshotTile");
            this._snapshotError = this.findElement("snapshotError");
            this._snapshotErrorMsg = this.findElement("snapshotErrorMsg");
            this._snapshotProgress = this.findElement("takeSnapshotProgress");
            this._snapshotButton = this.findElement("takeSnapshotButton");
            this._snapshotLabel = this.findElement("takeSnapshotLabel");
            this._snapshotIcon = this.findElement("takeSnapshotIcon");
            this._snapshotLabel.innerText = Microsoft.Plugin.Resources.getString("TakeSnapshot");
            this._snapshotProgress.innerText = Microsoft.Plugin.Resources.getString("Loading");
            this.toggleProgress(this._model.isViewBusy);
            this.updateTakeSnapshotButton();
            this._snapshotButton.addEventListener("click", this._onSnapshotClickHandler);
            this._controller.setScreenshotSize(this._screenshotWidth, this._screenshotHeight, this._screenshotKeepAspectRatio);
        }
        Object.defineProperty(CollectionView.prototype, "snapshotTileViewModelCollection", {
            get: function () {
                return this._snapshotTileViewModelCollection;
            },
            enumerable: true,
            configurable: true
        });
        CollectionView.prototype.onPropertyChanged = function (propertyName) {
            switch (propertyName) {
                case "warningMessage":
                    this.showWarningMessage(this._model.warningMessage);
                    break;
                case "latestSnapshotError":
                    this.showSnapshotError(this._model.latestSnapshotError);
                    break;
                case "isTakingSnapshot":
                    this.toggleProgress(this._model.isViewBusy);
                    this.updateTakeSnapshotButton();
                    break;
                case "isForcingGarbageCollection":
                    this.updateTakeSnapshotButton();
                    break;
            }
        };
        CollectionView.prototype.onCollectionChanged = function (eventArgs) {
            switch (eventArgs.action) {
                case 0 /* Add */:
                    this.createTile(eventArgs.newItems[0]);
                    break;
                case 1 /* Reset */:
                    this.removeSnapshotTiles();
                    break;
            }
        };
        CollectionView.prototype.createTile = function (snapshotSummary) {
            // Create the model and the view
            var model = new MemoryProfiler.SnapshotTileViewModel(snapshotSummary);
            var newTile = new MemoryProfiler.SnapshotTileView(model);
            this._snapshotTileViewModelCollection.push(model);
            this._tilesContainer.insertBefore(newTile.rootElement, this._takeSnapshotTile);
            newTile.rootElement.scrollIntoView(true);
            newTile.setFocus();
        };
        CollectionView.prototype.removeSnapshotTiles = function () {
            while (this._tilesContainer.hasChildNodes()) {
                this._tilesContainer.removeChild(this._tilesContainer.firstChild);
            }
            this._tilesContainer.appendChild(this._takeSnapshotTile);
            this._snapshotTileViewModelCollection = [];
        };
        CollectionView.prototype.toggleProgress = function (show) {
            if (this._snapshotProgress && this._snapshotError) {
                if (show) {
                    this._snapshotLabel.style.display = "none";
                    this._snapshotIcon.style.display = "none";
                    this._snapshotProgress.style.display = "block";
                    this._snapshotError.style.display = "none";
                    this._snapshotButton.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("Loading"));
                }
                else {
                    this._snapshotLabel.style.display = "";
                    this._snapshotIcon.style.display = "";
                    this._snapshotProgress.style.display = "none";
                    this._snapshotButton.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("TakeSnapshot"));
                }
            }
        };
        CollectionView.prototype.showSnapshotError = function (error) {
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
        CollectionView.prototype.showWarningMessage = function (warning) {
            if (!this._warningSection) {
                return;
            }
            if (warning) {
                this._warningSection.innerHTML = warning;
                this._warningSection.style.display = "inline";
            }
            else {
                this._warningSection.innerHTML = "";
                this._warningSection.style.display = "none";
            }
        };
        CollectionView.prototype.onSnapshotClick = function (e) {
            this._controller.takeSnapshot();
        };
        CollectionView.prototype.updateTakeSnapshotButton = function () {
            if (this._snapshotButton) {
                if (!this._model.isViewBusy) {
                    this._snapshotButton.classList.remove("disabled");
                    this._snapshotButton.disabled = false;
                }
                else {
                    if (this._model.isForcingGarbageCollection)
                        this._snapshotButton.classList.add("disabled");
                    this._snapshotButton.disabled = true;
                }
            }
        };
        return CollectionView;
    })(MemoryProfiler.Common.Controls.TemplateControl);
    MemoryProfiler.CollectionView = CollectionView;
})(MemoryProfiler || (MemoryProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/collectionview.csproj_795261541/objr/x86/built/Script/CollectionView.js.map

// CollectionViewHost.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../../../common/script/Hub/Plugin.redirect.d.ts" />
/// <reference path="../../Common/Extensions/Session.ts" />
/// <reference path="../../Common/controls/control.ts" />
/// <reference path="../../Common/controls/componentModel.ts" />
/// <reference path="../../Common/Profiler/MemoryProfilerViewHost.ts" />
/// <reference path="CollectionView.ts" />
/// <reference path="VsPluginCommandHelper.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    "use strict";
    var CollectionViewHost = (function (_super) {
        __extends(CollectionViewHost, _super);
        function CollectionViewHost() {
            _super.call(this);
        }
        CollectionViewHost.prototype.sessionStateChanged = function (eventArgs) {
            var currentState = eventArgs.currentState;
            switch (currentState) {
                case 400 /* CollectionFinishing */:
                    CollectionViewHost.VsCommandChain.onCollectionFinishing();
                    break;
                case 500 /* CollectionFinished */:
                    Microsoft.VisualStudio.DiagnosticsHub.getCurrentSession().removeStateChangedEventListener(this.sessionStateChanged);
                    // Have session persist our session metadata now
                    var eventCompleteDeferral = eventArgs.getDeferral();
                    var onSaveCompleted = function (success) {
                        eventCompleteDeferral.complete();
                    };
                    this.session.save(this.collectionViewController.managedDataSeen === true).done(onSaveCompleted);
                    break;
            }
        };
        CollectionViewHost.prototype.onPropertyChanged = function (propertyName) {
            CollectionViewHost.VsCommandChain.onPropertyChanged(propertyName);
        };
        CollectionViewHost.prototype.initializeView = function (sessionInfo) {
            this.collectionViewController = new MemoryProfiler.CollectionViewController();
            document.getElementById('mainContainer').appendChild(this.collectionViewController.view.rootElement);
            this.collectionViewController.model.registerPropertyChanged(this);
            Microsoft.VisualStudio.DiagnosticsHub.getCurrentSession().addStateChangedEventListener(this.sessionStateChanged.bind(this));
            Microsoft.Plugin.addEventListener("close", function () {
                CollectionViewHost.VsCommandChain.onClose();
            });
            this.initCommands();
        };
        CollectionViewHost.prototype.initCommands = function () {
            if (Microsoft.Plugin.VS && Microsoft.Plugin.VS.Commands) {
                var takeSnapshotCommand = new MemoryProfiler.TakeSnapshotVsCommand(this);
                var forceGcCommand = new MemoryProfiler.ForceGcVsCommand(this);
                takeSnapshotCommand.setNext(forceGcCommand);
                CollectionViewHost.VsCommandChain = takeSnapshotCommand;
            }
        };
        return CollectionViewHost;
    })(MemoryProfiler.Common.MemoryProfilerViewHostBase);
    MemoryProfiler.CollectionViewHost = CollectionViewHost;
    MemoryProfiler.CollectionViewHostInstance = new CollectionViewHost();
})(MemoryProfiler || (MemoryProfiler = {}));
MemoryProfiler.CollectionViewHostInstance.loadView();
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/collectionview.csproj_795261541/objr/x86/built/Script/CollectionViewHost.js.map

// VsPluginCommandHelper.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../../../Common/Script/Hub/plugin.redirect.d.ts" />
/// <reference path="../../Common/controls/componentModel.ts" />
/// <reference path="CollectionViewHost.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    "use strict";
    var DynamicVsPluginCommandBase = (function () {
        function DynamicVsPluginCommandBase(host, commandBinding) {
            this._commandBinding = commandBinding;
            this._host = host;
        }
        DynamicVsPluginCommandBase.prototype.setNext = function (nextCommand) {
            this._nextCommand = nextCommand;
        };
        DynamicVsPluginCommandBase.prototype.onCollectionFinishing = function () {
            this.updateCommandButton(false, this._commandBinding._visible);
            if (this._nextCommand) {
                this._nextCommand.onCollectionFinishing();
            }
        };
        DynamicVsPluginCommandBase.prototype.onTargetIsManaged = function () {
            if (this._nextCommand) {
                this._nextCommand.onTargetIsManaged();
            }
        };
        DynamicVsPluginCommandBase.prototype.onPropertyChanged = function (propertyName) {
            if (propertyName === "isViewBusy") {
                this.updateCommandButton(!this._host.collectionViewController.model.isViewBusy, this._commandBinding._visible);
            }
            if (this._nextCommand) {
                this._nextCommand.onPropertyChanged(propertyName);
            }
        };
        DynamicVsPluginCommandBase.prototype.onClose = function () {
            this.updateCommandButton(false, false);
            if (this._nextCommand) {
                this._nextCommand.onClose();
            }
        };
        /* protected */ DynamicVsPluginCommandBase.prototype.updateCommandButton = function (shouldEnable, shouldDisplay) {
            if (Microsoft.Plugin.VS && Microsoft.Plugin.VS.Commands) {
                Microsoft.Plugin.VS.Commands.setStates({
                    command: this._commandBinding,
                    enabled: shouldEnable,
                    visible: shouldDisplay
                });
            }
        };
        return DynamicVsPluginCommandBase;
    })();
    MemoryProfiler.DynamicVsPluginCommandBase = DynamicVsPluginCommandBase;
    var TakeSnapshotVsCommand = (function (_super) {
        __extends(TakeSnapshotVsCommand, _super);
        function TakeSnapshotVsCommand(host) {
            this._host = host;
            var takeSnapshotCommand = Microsoft.Plugin.VS.Commands.bindCommand({
                name: "takesnapshotcommand",
                onexecute: this.execute.bind(this),
                enabled: !host.collectionViewController.model.isViewBusy,
                visible: true
            });
            _super.call(this, host, takeSnapshotCommand);
        }
        TakeSnapshotVsCommand.prototype.execute = function () {
            this._host.collectionViewController.takeSnapshot();
        };
        return TakeSnapshotVsCommand;
    })(DynamicVsPluginCommandBase);
    MemoryProfiler.TakeSnapshotVsCommand = TakeSnapshotVsCommand;
    var ForceGcVsCommand = (function (_super) {
        __extends(ForceGcVsCommand, _super);
        function ForceGcVsCommand(host) {
            this._host = host;
            var forceGcCommand = Microsoft.Plugin.VS.Commands.bindCommand({
                name: "forcegccommand",
                onexecute: this.execute.bind(this),
                enabled: false,
                visible: false
            });
            _super.call(this, host, forceGcCommand);
        }
        ForceGcVsCommand.prototype.execute = function () {
            this._host.collectionViewController.forceGarbageCollection();
        };
        ForceGcVsCommand.prototype.onTargetIsManaged = function () {
            this.updateCommandButton(true, true);
            _super.prototype.onTargetIsManaged.call(this);
        };
        return ForceGcVsCommand;
    })(DynamicVsPluginCommandBase);
    MemoryProfiler.ForceGcVsCommand = ForceGcVsCommand;
})(MemoryProfiler || (MemoryProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/collectionview.csproj_795261541/objr/x86/built/Script/VsPluginCommandHelper.js.map

// CollectionAgentTask.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../common/controls/componentModel.ts" />
/// <reference path="../../common/controls/templateControl.ts" />
/// <reference path="CollectionView.ts" />
var MemoryProfiler;
(function (MemoryProfiler) {
    "use strict";
    var TakeSnapshotTask = (function () {
        function TakeSnapshotTask(controller) {
            this._snapshotAgents = [];
            this._controller = controller;
            this._snapshotAgents.push(new MemoryProfiler.Common.ClrSnapshotAgent());
            this._snapshotAgents.push(new MemoryProfiler.Common.ScreenshotSnapshotAgent());
        }
        TakeSnapshotTask.prototype.start = function () {
            var _this = this;
            return new Microsoft.Plugin.Promise(function (completed, error) {
                if (!_this.takeSnapshotInternal()) {
                    if (error) {
                        error(new Error("Snapshot Not Currently Enabled"));
                    }
                }
                else {
                    _this._snapshotCompleted = completed;
                    _this._snapshotError = error;
                }
            });
        };
        TakeSnapshotTask.prototype.isCompleted = function (message) {
            if (message) {
                var obj = JSON.parse(message);
                if (obj.eventName) {
                    if (obj.eventName === "snapshotData") {
                        if (this._controller.model.isViewBusy) {
                            var snapshotData = obj;
                            if (this._activeSnapshot && snapshotData.id == this._activeSnapshot.id) {
                                this._activeSnapshot.processAgentData(snapshotData.data.agent, snapshotData.data.data);
                            }
                        }
                    }
                }
                else {
                    if (this._controller.model.isViewBusy) {
                        if (obj.snapshotResults) {
                            this.onSnapshotResult(obj);
                        }
                        else {
                            var response = obj;
                            this.onSnapshotFailed(new Error(response.errorMessage));
                        }
                        return true;
                    }
                }
            }
            return false;
        };
        TakeSnapshotTask.prototype.takeSnapshotInternal = function () {
            if (this._controller.model.isViewBusy) {
                return false;
            }
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.TakeSnapshot, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.CollectionView);
            MemoryProfiler.Common.MemoryProfilerViewHost.startCodeMarker(27200 /* perfMP_TakeSnapshotStart */, 27201 /* perfMP_TakeSnapshotEnd */);
            this._controller.model.isTakingSnapshot = true;
            this._activeSnapshot = new MemoryProfiler.Common.SnapshotEngine(MemoryProfiler.CollectionViewController._nextIdentifier, this._snapshotAgents, this._controller);
            var message = "{ \"commandName\": \"takeSnapshot\", \"snapshotId\": \"" + MemoryProfiler.CollectionViewController._nextIdentifier + "\", \"agentMask\": \"65535\" }";
            this._controller.sendMessage(message);
            return true;
        };
        TakeSnapshotTask.prototype.onSnapshotResult = function (snapshotResult) {
            var _this = this;
            if (!snapshotResult) {
                throw new Error("<move to resources>: snapshotAsync ended with no response");
            }
            if (!this._activeSnapshot) {
                this._controller.model.isTakingSnapshot = false;
            }
            else {
                this._activeSnapshot.processSnapshotResults(snapshotResult.snapshotResults, function (snapshot) {
                    MemoryProfiler.Common.MemoryProfilerViewHost.session.addSnapshot(snapshot).then(function () {
                        _this.onSnapshotCompleted(_this._activeSnapshot.snapshot);
                    });
                }, this.onSnapshotFailed);
            }
        };
        TakeSnapshotTask.prototype.onSnapshotCompleted = function (snapshot) {
            if (this._snapshotCompleted) {
                this._snapshotCompleted(Microsoft.Plugin.Promise.wrap(snapshot));
            }
            this._snapshotCompleted = null;
            this._snapshotError = null;
            if (!snapshot) {
                throw new Error(Microsoft.Plugin.Resources.getErrorString("MemProf.1014"));
            }
            MemoryProfiler.CollectionViewController._nextIdentifier++;
            this._controller.model.snapshotSummaryCollection.add(snapshot);
            this._controller.model.isTakingSnapshot = false;
            this._activeSnapshot = null;
            MemoryProfiler.Common.MemoryProfilerViewHost.endCodeMarker(27200 /* perfMP_TakeSnapshotStart */);
        };
        TakeSnapshotTask.prototype.onSnapshotFailed = function (error) {
            if (!error) {
                throw new Error(Microsoft.Plugin.Resources.getErrorString("MemProf.1015"));
            }
            error.message = Microsoft.Plugin.Resources.getString("SnapshotCreationFailed", error.message);
            this._controller.model.latestSnapshotError = error;
            this._controller.model.isTakingSnapshot = false;
            this._activeSnapshot = null;
            if (this._snapshotError) {
                this._snapshotError(error);
            }
            this._snapshotCompleted = null;
            this._snapshotError = null;
            MemoryProfiler.Common.MemoryProfilerViewHost.endCodeMarker(27200 /* perfMP_TakeSnapshotStart */);
            MemoryProfiler.Common.MemoryProfilerViewHost.onIdle();
        };
        return TakeSnapshotTask;
    })();
    MemoryProfiler.TakeSnapshotTask = TakeSnapshotTask;
    var ForceGcCollectionAgentTask = (function () {
        function ForceGcCollectionAgentTask(controller) {
            this._controller = controller;
        }
        ForceGcCollectionAgentTask.prototype.start = function () {
            var _this = this;
            MemoryProfiler.Common.MemoryProfilerViewHost.session.logCommandUsage(MemoryProfiler.Common.FeedbackCommandNames.ForceGarbageCollection, MemoryProfiler.Common.FeedbackCommandInvokeMethodNames.Control, MemoryProfiler.Common.FeedbackCommandSourceNames.CollectionView);
            MemoryProfiler.Common.MemoryProfilerViewHost.startCodeMarker(27232 /* prefMP_ForceGarbageCollectionStart */, 27233 /* prefMP_ForceGarbageCollectionEnd */);
            return new Microsoft.Plugin.Promise(function (completed) {
                _this._controller.model.isForcingGarbageCollection = true;
                var message = "{ \"commandName\": \"forceGarbageCollection\"}";
                _this._controller.sendMessage(message);
                _this._forceGcCompleted = completed;
            });
        };
        ForceGcCollectionAgentTask.prototype.isCompleted = function (message) {
            var result = false;
            if (message) {
                var obj = JSON.parse(message);
                if (obj.eventName && obj.eventName === "forcedGarbageCollectionComplete") {
                    this._controller.model.isForcingGarbageCollection = false;
                    MemoryProfiler.Common.MemoryProfilerViewHost.endCodeMarker(27232 /* prefMP_ForceGarbageCollectionStart */);
                    result = true;
                }
            }
            if (this._forceGcCompleted) {
                this._forceGcCompleted();
            }
            this._forceGcCompleted = null;
            return result;
        };
        return ForceGcCollectionAgentTask;
    })();
    MemoryProfiler.ForceGcCollectionAgentTask = ForceGcCollectionAgentTask;
})(MemoryProfiler || (MemoryProfiler = {}));
//# sourceMappingURL=file:///f:/binaries/Intermediate/ClientDiagnostics/collectionview.csproj_795261541/objr/x86/built/Script/CollectionAgentTask.js.map


// SIG // Begin signature block
// SIG // MIIauAYJKoZIhvcNAQcCoIIaqTCCGqUCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFFJ8tl+fRT0p
// SIG // C+vD84C6gy6nv4RooIIVgzCCBMMwggOroAMCAQICEzMA
// SIG // AACb4HQ3yz1NjS4AAAAAAJswDQYJKoZIhvcNAQEFBQAw
// SIG // dzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBMB4XDTE2MDMzMDE5
// SIG // MjEyOVoXDTE3MDYzMDE5MjEyOVowgbMxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xDTALBgNVBAsTBE1PUFIxJzAlBgNVBAsT
// SIG // Hm5DaXBoZXIgRFNFIEVTTjo3MjhELUM0NUYtRjlFQjEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBAI2j4s+Bi9fLvwOiYPY7beLUGLA3BdWNNpwOc85N
// SIG // f6IQsnxDeywYV7ysp6aGfXmhtd4yZvmO/CDNq3N3z3ed
// SIG // b2Cca3jzxa2pvVtMK1WqUoBBQ0FmmaXwMGiGug8hch/D
// SIG // dT+SdsEA15ksqFk/wWKRbQn2ztMiui0An2bLU9HKVjpY
// SIG // TCGyhaOYZYzHiUpFWHurU0CfjGqyBcX+HuL/CqGootvL
// SIG // IY18lTDeMReKDelfzEJwyqQVFG6ED8LC/WwCTJOxTLbO
// SIG // tuzitc2aGhD1SOVXEHfqgd1fhEIycETJyryw+/dIOdhg
// SIG // dUmts79odC6UDhy+wXBydBAOzNtrUB8x6jT6bD0CAwEA
// SIG // AaOCAQkwggEFMB0GA1UdDgQWBBSWlbGeE1O6WCFGNOJ8
// SIG // xzlKbCDwdzAfBgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7
// SIG // syuwwzWzDzBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9NaWNyb3NvZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsG
// SIG // AQUFBwEBBEwwSjBIBggrBgEFBQcwAoY8aHR0cDovL3d3
// SIG // dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBBQUAA4IBAQAhHbNT6TtG
// SIG // gaH6KhPjWiAkunalO7Z3yJFyBNbq/tKbIi+TCKKwbu8C
// SIG // pblWXv1l9o0Sfeon3j+guC4zMteWWj/DdDnJD6m2utr+
// SIG // EGjPiP2PIN6ysdZdKJMnt8IHpEclZbtS1XFNKWnoC1DH
// SIG // jJWWoF6sNzkC1V7zVCh5cdsXw0P8zWor+Q85QER8LGjI
// SIG // 0oHomSKrIFbm5O8khptmVk474u64ZPfln8p1Cu58lp9Z
// SIG // 4aygt9ZpvUIm0vWlh1IB7Cl++wW05tiXfBOAcTVfkybn
// SIG // 5F90lXF8A421H3X1orZhPe7EbIleZAR/KUts1EjqSkpM
// SIG // 54JutTq/VyYRyHiA1YDNDrtkMIIE7TCCA9WgAwIBAgIT
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
// SIG // +i+ePy5VFmvJE6P9MYIEoTCCBJ0CAQEwgZAweTELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0
// SIG // IENvZGUgU2lnbmluZyBQQ0ECEzMAAAFAlqnucFb+zAcA
// SIG // AQAAAUAwCQYFKw4DAhoFAKCBujAZBgkqhkiG9w0BCQMx
// SIG // DAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYK
// SIG // KwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQUKVoJUvBF
// SIG // b9HC0s7ccJJjvk71CS8wWgYKKwYBBAGCNwIBDDFMMEqg
// SIG // MIAuAEMAbwBsAGwAZQBjAHQAaQBvAG4AVgBpAGUAdwBN
// SIG // AGUAcgBnAGUAZAAuAGoAc6EWgBRodHRwOi8vbWljcm9z
// SIG // b2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBgr9t7r9vk
// SIG // wAQGQ9QLCFL6fBQnmyayg3i4RdvTvRToVH8YcpFNLqa6
// SIG // hnvc/8GUIuxCJZJ6WiCAAI79tt8CvA2WBaJw5V+KUZ6n
// SIG // 8uYseyh+MwNoJMcYCo+H2E/9aomzZiDGo0eOt+hYxAXq
// SIG // dsqLQOdWWPTE7G86uZw2Ts6DQ473kRa3WEnzDUuyap1w
// SIG // qMb9ORJvvgFtauVVhPmI/2jHgsUUBoSd2ZAZKCl5pDir
// SIG // qNESIfug4USSqD2xBeyXRyFUoUfCPHLHNRkLKeq6JN0N
// SIG // Syr88Fc2bVarlGiUv6qvCLsh9sb79reyHcjwYkysbvX5
// SIG // BkqrOqi/5OpI2y4cYMh4pXNJoYICKDCCAiQGCSqGSIb3
// SIG // DQEJBjGCAhUwggIRAgEBMIGOMHcxCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFBDQQITMwAAAJvgdDfLPU2NLgAAAAAAmzAJBgUr
// SIG // DgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEH
// SIG // ATAcBgkqhkiG9w0BCQUxDxcNMTYwOTA3MDQ0NzA4WjAj
// SIG // BgkqhkiG9w0BCQQxFgQUdDtqwRfmbh0mYLhNq3k/ei23
// SIG // IbAwDQYJKoZIhvcNAQEFBQAEggEAPYIh9YyKKVkBl919
// SIG // ljXd/Qdgmq0Z2r5oXOQxc/kR7/f5enIjOp47xjttlhWk
// SIG // 8L9GKZILH9WdVHrlTNuC6X1x3HEm1a5722MCtQDhOcky
// SIG // 9naadWgrRziNaPzUAEechBqaR3QcrIOV3BrfETaYsjZa
// SIG // 6+VrAm2HOMA2dU/j+CYTwGicVgVhoZZ4eTlOqe/I+IeC
// SIG // Ki8GetPaJw6X7lj4r6NacVpgHlIui6KPfrTM8Q8LfuDj
// SIG // Ikedze3cU+JW4CZ8Qq/xAjb31pBYKFwuzhyCPZbsACHP
// SIG // sdlwKZ7Oher/MD22Al/09J9LRCWwUM+X3AZUDLlTub59
// SIG // 2ZBeGpVM78bXQl97uw==
// SIG // End signature block
