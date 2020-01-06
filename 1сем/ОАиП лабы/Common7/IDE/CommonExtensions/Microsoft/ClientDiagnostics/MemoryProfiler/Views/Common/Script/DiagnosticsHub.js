﻿var Microsoft;
(function (Microsoft) {
    (function (VsHub) {
        (function (Utility) {
            "use strict";

            function xhr(options, apiVersion) {
                if (!options) {
                    throw new Error("Cannot give a null 'options' argument to Microsoft.VsHub.Utility.xhr");
                }

                if (!apiVersion) {
                    throw new Error("Cannot omit the 'apiVersion' argument");
                }

                if (typeof apiVersion !== "number") {
                    throw new Error("Cannot pass a non-number for the 'apiVersion' argument");
                }

                options.headers = options.headers || {};

                if (!options.headers["Accept"]) {
                    throw new Error("Must include an Accept header in your XHR options to use Microsoft.VsHub.Utility.xhr");
                }

                var newAcceptHeader = options.headers["Accept"].replace(/[^,]+/g, function (match) {
                    return match + ";api-version=" + apiVersion.toFixed(1);
                });
                options.headers["Accept"] = newAcceptHeader;

                return Microsoft.Plugin.Utilities.xhr(options);
            }
            Utility.xhr = xhr;
        })(VsHub.Utility || (VsHub.Utility = {}));
        var Utility = VsHub.Utility;
    })(Microsoft.VsHub || (Microsoft.VsHub = {}));
    var VsHub = Microsoft.VsHub;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            "use strict";

            var AggregatedEvent = (function () {
                function AggregatedEvent() {
                    this._eventListeners = [];
                }
                AggregatedEvent.prototype.invokeEvent = function (args) {
                    this._eventListeners.forEach(function (func) {
                        return func(args);
                    });
                };

                AggregatedEvent.prototype.addEventListener = function (func) {
                    this._eventListeners.push(func);
                };

                AggregatedEvent.prototype.removeEventListener = function (func) {
                    var location = this._eventListeners.indexOf(func);

                    if (location > -1) {
                        this._eventListeners.splice(location, 1);
                    }
                };

                AggregatedEvent.prototype.dispose = function () {
                    this._eventListeners = null;
                };
                return AggregatedEvent;
            })();
            DiagnosticsHub.AggregatedEvent = AggregatedEvent;
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

            (function (Debug) {
                var Assert = (function () {
                    function Assert() {
                    }
                    Assert.isUndefined = function (val, errorMessage) {
                    };

                    Assert.isNotUndefined = function (val, errorMessage) {
                    };

                    Assert.isNull = function (val, errorMessage) {
                    };

                    Assert.isNotNull = function (val, errorMessage) {
                    };

                    Assert.isTrue = function (val, errorMessage) {
                    };

                    Assert.isFalse = function (val, errorMessage) {
                    };

                    Assert.fail = function (errorMessage) {
                    };

                    Assert.isDebugBuild = function () {
                        return false;
                    };
                    return Assert;
                })();
                Debug.Assert = Assert;
            })(DiagnosticsHub.Debug || (DiagnosticsHub.Debug = {}));
            var Debug = DiagnosticsHub.Debug;
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

            var Automation = (function () {
                function Automation(logger) {
                    this._postFilters = {};
                    this._preFilters = {};
                    this._alertFilters = {};
                    this._confirmationFilters = {};
                    this._logger = logger;
                }
                Automation.prototype.getAutomationPromise = function (key, promiseFunc, oncancel, args) {
                    var _this = this;
                    var postFilter = this._postFilters[key];
                    var preFilter = this._preFilters[key];
                    this._logger.debug("getting automation promise for key '" + key + "'");
                    var currentPromise = null;

                    if (preFilter) {
                        currentPromise = this.getPreFilterPromise(preFilter, args);
                        if (postFilter) {
                            currentPromise = currentPromise.then(function () {
                                return _this.getPostFilterPromise(postFilter, promiseFunc, oncancel, args);
                            }, function (error) {
                                _this._logger.debug("Error '" + JSON.stringify(error) + "' while executing prefiler'");
                            });
                        } else {
                            currentPromise = currentPromise.then(function () {
                                return new Microsoft.Plugin.Promise(function (comp, err, prog) {
                                    promiseFunc(comp, err, prog, args);
                                }, oncancel);
                            }, function (error) {
                                _this._logger.debug("Error '" + JSON.stringify(error) + "' while executing prefiler'");
                            });
                        }
                    } else {
                        if (postFilter) {
                            this._logger.debug("only injecting postFilter");
                            currentPromise = this.getPostFilterPromise(postFilter, promiseFunc, oncancel, args);
                        } else {
                            this._logger.debug("not injecting any filters");
                            currentPromise = new Microsoft.Plugin.Promise(function (comp, err, prog) {
                                promiseFunc(comp, err, prog, args);
                            }, oncancel);
                        }
                    }

                    return currentPromise;
                };

                Automation.prototype.getAlertPromise = function (key, message) {
                    var alertFilter = this._alertFilters[key];
                    if (!alertFilter) {
                        return new Microsoft.Plugin.Promise(function (comp, err, prog) {
                            window.alert(message);
                            comp(true);
                        });
                    } else {
                        return alertFilter.bypass(message);
                    }
                };

                Automation.prototype.getConfirmationPromise = function (key, message) {
                    var confirmationFilter = this._confirmationFilters[key];
                    if (!confirmationFilter) {
                        return new Microsoft.Plugin.Promise(function (comp, err, prog) {
                            comp(window.confirm(message));
                        });
                    } else {
                        return confirmationFilter.bypass(message);
                    }
                };

                Automation.prototype.addAutomationPostFilter = function (key, filter) {
                    this.addAutomationFilter(this._postFilters, key, "IAutomationPostFilter", filter);
                };

                Automation.prototype.removeAutomationPostFilter = function (key) {
                    this.removeAutomationFilter(this._postFilters, key, "IAutomationPostFilter");
                };

                Automation.prototype.addAutomationPreFilter = function (key, filter) {
                    this.addAutomationFilter(this._preFilters, key, "IAutomationPreFilter", filter);
                };

                Automation.prototype.removeAutomationPreFilter = function (key) {
                    this.removeAutomationFilter(this._preFilters, key, "IAutomationPreFilter");
                };

                Automation.prototype.addAutomationAlertBypassFilter = function (key, filter) {
                    this.addAutomationFilter(this._alertFilters, key, "IAutomationAlertBypassFilter", filter);
                };

                Automation.prototype.removeIAutomationAlertBypassFilter = function (key) {
                    this.removeAutomationFilter(this._alertFilters, key, "IAutomationAlertBypassFilter");
                };

                Automation.prototype.addAutomationConfirmationBypassFilter = function (key, filter) {
                    this.addAutomationFilter(this._confirmationFilters, key, "IAutomationConfirmationBypassFilter", filter);
                };

                Automation.prototype.removeAutomationConfirmationBypassFilter = function (key) {
                    this.removeAutomationFilter(this._confirmationFilters, key, "IAutomationConfirmationBypassFilter");
                };

                Automation.prototype.getPreFilterPromise = function (preFilter, args) {
                    if (preFilter) {
                        return preFilter.onFilter(args);
                    }

                    throw "preFilter is null or undefined";
                };

                Automation.prototype.removeAutomationFilter = function (filterStore, key, automationFilterType) {
                    if (!key) {
                        throw new Error("key is null, undefined or evaluates to false");
                    }

                    if (!filterStore) {
                        throw new Error("key is null, undefined or evaluates to false");
                    }

                    if (!automationFilterType) {
                        throw new Error("automationFilterType is null, undefined or evaluates to false");
                    }

                    delete filterStore[key];
                    this._logger.debug(automationFilterType + " with key '" + key + "' has been removed");
                };

                Automation.prototype.addAutomationFilter = function (filterStore, key, automationFilterType, filter) {
                    if (!filterStore) {
                        throw new Error("filterStore is null or undefined");
                    }

                    if (!filter) {
                        throw new Error("filter is null or undefined");
                    }

                    if (!key) {
                        throw new Error("key is null, undefined or evaluates to false");
                    }

                    if (!automationFilterType) {
                        throw new Error("automationFilterType is null, undefined or evaluates to false");
                    }

                    if (filterStore[key]) {
                        this._logger.debug("Replacing existing " + automationFilterType + " with key '" + key + "'");
                    }

                    filterStore[key] = filter;
                    this._logger.debug(automationFilterType + " with key '" + key + "' has been added");
                };

                Automation.prototype.getPostFilterPromise = function (filter, promiseFunc, oncancel, args) {
                    var _this = this;
                    return new Microsoft.Plugin.Promise(function (complete, err, prog) {
                        var filterComplete = function (value) {
                            _this._logger.debug("filterComplete called");
                            return filter.onComplete(value, args).then(function () {
                                complete(value);
                            }, function () {
                                _this._logger.error("Error occured during execution of postfilter onComplete handler");
                            });
                        };

                        var filterError = function (value) {
                            return filter.onError(value, args).then(function () {
                                err(value);
                            }, function () {
                                _this._logger.error("Error occured during execution of postfilter onError handler");
                            });
                        };

                        var filterProgress = function (value) {
                            return filter.onProgress(value, args).then(function () {
                                prog(value);
                            }, function () {
                                _this._logger.error("Error occured during execution of postfilter onProgess handler");
                            });
                        };

                        promiseFunc(filterComplete, filterError, filterProgress, args);
                    }, oncancel);
                };
                return Automation;
            })();

            var AutomationConstants = (function () {
                function AutomationConstants() {
                }
                AutomationConstants.SearchNoResultsAlertKey = "Microsoft.VisualStudio.DiagnosticsHub.CpuUsageTreeGrid.Search";

                AutomationConstants.SearchNoResultsConfirmationKey = "Microsoft.VisualStudio.DiagnosticsHub.CpuUsageTreeGrid.Search";

                AutomationConstants.DataWarehouseRequestKey = "Microsoft.VisualStudio.DiagnosticsHub.DatawarehouseRequest";
                return AutomationConstants;
            })();
            DiagnosticsHub.AutomationConstants = AutomationConstants;

            var automationManager = null;

            function getAutomationManager(logger) {
                if (automationManager === null) {
                    automationManager = new Automation(logger);
                }

                return automationManager;
            }
            DiagnosticsHub.getAutomationManager = getAutomationManager;
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

            var BigNumber = (function () {
                function BigNumber(high, low) {
                    this._isHighNegative = false;
                    this._isLowNegative = false;
                    if (!(typeof high === "number" && high < 0x100000000 && high >= -1 * 0x80000000) || !(typeof low === "number" && low < 0x100000000 && low >= -1 * 0x80000000)) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                    }

                    if (high < 0) {
                        high = (high >>> 0);
                        this._isHighNegative = true;
                    }

                    if (low < 0) {
                        low = (low >>> 0);
                        this._isLowNegative = true;
                    }

                    this._value = {
                        h: high,
                        l: low
                    };
                }
                Object.defineProperty(BigNumber, "oldest", {
                    get: function () {
                        return BigNumber.OldestTimestampFormat;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(BigNumber, "latest", {
                    get: function () {
                        return BigNumber.LatestTimestampFormat;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(BigNumber, "zero", {
                    get: function () {
                        if (!BigNumber.Zero) {
                            BigNumber.Zero = new BigNumber(0, 0);
                        }

                        return BigNumber.Zero;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(BigNumber, "one", {
                    get: function () {
                        if (!BigNumber.One) {
                            BigNumber.One = new BigNumber(0, 1);
                        }

                        return BigNumber.One;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(BigNumber.prototype, "jsonValue", {
                    get: function () {
                        if (!this._jsonValue) {
                            var high = this._value.h;
                            if (this._isHighNegative || high > 0x7fffffff) {
                                high = high << 0;
                            }

                            var low = this._value.l;
                            if (this._isLowNegative || low > 0x7fffffff) {
                                low = low << 0;
                            }

                            this._jsonValue = {
                                h: high,
                                l: low
                            };
                        }

                        return this._jsonValue;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(BigNumber.prototype, "value", {
                    get: function () {
                        if (!this._stringValue) {
                            if (this._value.h > 0) {
                                this._stringValue = "0x" + this._value.h.toString(16) + BigNumber.padLeadingZeros(this._value.l.toString(16), 8);
                            } else {
                                this._stringValue = "0x" + this._value.l.toString(16);
                            }
                        }

                        return this._stringValue;
                    },
                    enumerable: true,
                    configurable: true
                });

                BigNumber.max = function (first, second) {
                    return first.greaterOrEqual(second) ? first : second;
                };

                BigNumber.min = function (first, second) {
                    return first.greaterOrEqual(second) ? second : first;
                };

                BigNumber.add = function (first, second) {
                    return BigNumber.addition(first, second);
                };

                BigNumber.subtract = function (first, second) {
                    if (second.greater(first)) {
                        return BigNumber.zero;
                    }

                    var otherTime = BigNumber.convertToManagedTimeFormat(second.jsonValue);
                    var negateHigh = ~(otherTime.h);
                    var negateLow = ~(otherTime.l);
                    var twosComplement = BigNumber.addition(new BigNumber(negateHigh, negateLow), BigNumber.one, true);

                    return BigNumber.addition(first, twosComplement, true);
                };

                BigNumber.multiply = function (first, second) {
                    return BigNumber.multiplication(first, second);
                };

                BigNumber.divide = function (first, second) {
                    return BigNumber.division(first, second, false);
                };

                BigNumber.modulo = function (first, second) {
                    return BigNumber.division(first, second, true);
                };

                BigNumber.addNumber = function (first, second) {
                    if (second < 0) {
                        return BigNumber.subtract(first, BigNumber.convertFromNumber(-second));
                    } else {
                        return BigNumber.addition(first, BigNumber.convertFromNumber(second));
                    }

                    return null;
                };

                BigNumber.subtractNumber = function (first, second) {
                    if (second < 0) {
                        return BigNumber.addition(first, BigNumber.convertFromNumber(-second));
                    } else {
                        return BigNumber.subtract(first, BigNumber.convertFromNumber(second));
                    }

                    return null;
                };

                BigNumber.multiplyNumber = function (first, second) {
                    if (second < 0) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                    }

                    return BigNumber.multiply(first, BigNumber.convertFromNumber(second));
                };

                BigNumber.divideNumber = function (first, second) {
                    if (second < 0) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                    }

                    return BigNumber.divide(first, BigNumber.convertFromNumber(second));
                };

                BigNumber.moduloNumber = function (first, second) {
                    if (second < 0) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                    }

                    return BigNumber.modulo(first, BigNumber.convertFromNumber(second));
                };

                BigNumber.convertFromNumber = function (num) {
                    if ((num < 0) || !(num < 0x20000000000000)) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                    }

                    num = Math.floor(num);
                    var low = num & 0xFFFFFFFF;
                    if (num <= 0xFFFFFFFF) {
                        return new BigNumber(0, low);
                    }

                    var highStr = num.toString(16);
                    highStr = highStr.substring(0, highStr.length - 8);
                    var high = parseInt(highStr, 16);

                    return new BigNumber(high, low);
                };

                BigNumber.convertFromBinaryString = function (bits) {
                    if (!bits || bits.match("[^10]") || bits.length > 64) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000" + " " + bits));
                    }

                    var high = 0;
                    var low = 0;

                    if (bits.length <= 32) {
                        low = parseInt(bits, 2);
                    } else {
                        low = parseInt(bits.slice(bits.length - 32), 2);
                        high = parseInt(bits.slice(0, bits.length - 32), 2);
                    }

                    return new BigNumber(high, low);
                };

                BigNumber.getBinaryString = function (timestamp) {
                    var lowPart = timestamp._value.l.toString(2);
                    if (timestamp._value.h > 0) {
                        return timestamp._value.h.toString(2) + Microsoft.VisualStudio.DiagnosticsHub.BigNumber.padLeadingZeros(lowPart, 32);
                    } else {
                        return lowPart;
                    }
                };

                BigNumber.padLeadingZeros = function (value, totalLength) {
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

                BigNumber.prototype.equals = function (other) {
                    var isEqual = false;
                    var otherTime = BigNumber.convertToManagedTimeFormat(other.jsonValue);
                    isEqual = (this._value.h === otherTime.h && this._value.l === otherTime.l);

                    return isEqual;
                };

                BigNumber.prototype.greater = function (other) {
                    var isGreater = false;
                    var otherTime = BigNumber.convertToManagedTimeFormat(other.jsonValue);
                    if (this._value.h > otherTime.h) {
                        isGreater = true;
                    } else if (this._value.h === otherTime.h) {
                        if (this._value.l > otherTime.l) {
                            isGreater = true;
                        }
                    }

                    return isGreater;
                };

                BigNumber.prototype.greaterOrEqual = function (other) {
                    var isGreaterOrEqual = false;
                    var otherTime = BigNumber.convertToManagedTimeFormat(other.jsonValue);
                    if (this._value.h > otherTime.h) {
                        isGreaterOrEqual = true;
                    } else if (this._value.h === otherTime.h) {
                        if (this._value.l >= otherTime.l) {
                            isGreaterOrEqual = true;
                        }
                    }

                    return isGreaterOrEqual;
                };

                BigNumber.prototype.compareTo = function (other) {
                    if (this.greater(other)) {
                        return 1;
                    } else if (this.equals(other)) {
                        return 0;
                    } else {
                        return -1;
                    }
                };

                BigNumber.convertToManagedTimeFormat = function (time) {
                    var high = time.h < 0 ? time.h >>> 0 : time.h;
                    var low = time.l < 0 ? time.l >>> 0 : time.l;
                    return {
                        h: high,
                        l: low
                    };
                };

                BigNumber.addition = function (first, second, ignoreOverflow) {
                    if (typeof ignoreOverflow === "undefined") { ignoreOverflow = false; }
                    var firstTime = BigNumber.convertToManagedTimeFormat(first.jsonValue);
                    var secondTime = BigNumber.convertToManagedTimeFormat(second.jsonValue);

                    var low = 0;
                    var high = 0;
                    var low0 = (firstTime.l & 0xff) + (secondTime.l & 0xff);
                    var low8 = (low0 >>> 8) + ((firstTime.l >>> 8) & 0xff) + ((secondTime.l >>> 8) & 0xff);
                    low0 = low0 & 0xff;
                    var low16 = (low8 >>> 8) + ((firstTime.l >>> 16) & 0xff) + ((secondTime.l >>> 16) & 0xff);
                    low8 = low8 & 0xff;
                    var low24 = (low16 >>> 8) + ((firstTime.l >>> 24) & 0xff) + ((secondTime.l >>> 24) & 0xff);
                    low16 = low16 & 0xff;

                    var high0 = (low24 >>> 8) + (firstTime.h & 0xff) + (secondTime.h & 0xff);
                    low24 = low24 & 0xff;
                    var high8 = (high0 >>> 8) + ((firstTime.h >>> 8) & 0xff) + ((secondTime.h >>> 8) & 0xff);
                    high0 = high0 & 0xff;
                    var high16 = (high8 >>> 8) + ((firstTime.h >>> 16) & 0xff) + ((secondTime.h >>> 16) & 0xff);
                    high8 = high8 & 0xff;
                    var high24 = (high16 >>> 8) + ((firstTime.h >>> 24) & 0xff) + ((secondTime.h >>> 24) & 0xff);
                    high16 = high16 & 0xff;

                    if (!ignoreOverflow && (high24 >>> 8) > 0) {
                        Microsoft.VisualStudio.DiagnosticsHub.getLogger().error("Addition overflow. Lost upper bits from: 0x" + high24.toString(16));
                        return new BigNumber(0xffffffff, 0xffffffff);
                    }

                    high24 = high24 & 0xff;

                    var finalLow16 = low24 << 8 | low16;
                    var finalLow0 = low8 << 8 | low0;
                    var finalHigh16 = high24 << 8 | high16;
                    var finalHigh0 = high8 << 8 | high0;

                    low = (finalLow16 << 16) | finalLow0;
                    high = (finalHigh16 << 16) | finalHigh0;

                    return new BigNumber(high, low);
                };

                BigNumber.multiplication = function (first, second) {
                    var firstTime = BigNumber.convertToManagedTimeFormat(first.jsonValue);
                    var secondTime = BigNumber.convertToManagedTimeFormat(second.jsonValue);

                    if (firstTime.h === 0 && secondTime.h === 0 && 0 < firstTime.l && firstTime.l <= 0x4000000 && 0 < secondTime.l && secondTime.l <= 0x4000000) {
                        var product = firstTime.l * secondTime.l;
                        return BigNumber.convertFromNumber(product);
                    }

                    var a1 = firstTime.l & 0xFFFF;
                    var a2 = firstTime.l >>> 0x10;
                    var a3 = firstTime.h & 0xFFFF;
                    var a4 = firstTime.h >>> 0x10;

                    var b1 = secondTime.l & 0xFFFF;
                    var b2 = secondTime.l >>> 0x10;
                    var b3 = secondTime.h & 0xFFFF;
                    var b4 = secondTime.h >>> 0x10;

                    var c1 = a1 * b1;
                    var c2 = c1 >>> 0x10;
                    c1 &= 0xFFFF;

                    c2 += a2 * b1;
                    var c3 = c2 >>> 0x10;
                    c2 &= 0xFFFF;

                    c2 += a1 * b2;
                    c3 += c2 >>> 0x10;
                    c2 &= 0xFFFF;

                    c3 += a3 * b1;
                    var c4 = c3 >>> 0x10;
                    c3 &= 0xFFFF;

                    c3 += a2 * b2;
                    c4 += c3 >>> 0x10;
                    c3 &= 0xFFFF;

                    c3 += a1 * b3;
                    c4 += c3 >>> 0x10;
                    c3 &= 0xFFFF;

                    c4 += a4 * b1 + a3 * b2 + a2 * b3 + a1 * b4;
                    if (c4 > 0xFFFF) {
                        Microsoft.VisualStudio.DiagnosticsHub.getLogger().error("Multiplication overflow. Lost upper 16-bits from: 0x" + c4.toString(16));
                    }

                    c4 &= 0xFFFF;

                    var productHigh = (c4 << 0x10) | c3;
                    var productLow = (c2 << 0x10) | c1;
                    return new BigNumber(productHigh, productLow);
                };

                BigNumber.division = function (dividend, divisor, wantRemainder) {
                    if (divisor.greater(dividend)) {
                        return wantRemainder ? dividend : BigNumber.zero;
                    }

                    if (divisor.equals(BigNumber.zero)) {
                        if (wantRemainder) {
                            return dividend;
                        }

                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                    }

                    var dividendBits = BigNumber.getBinaryString(dividend);
                    var divisorBits = BigNumber.getBinaryString(divisor);

                    var divisorLength = divisorBits.length;
                    var dividendLength = dividendBits.length;

                    var timeStamp2toThe53 = new BigNumber(0x200000, 0);
                    if (timeStamp2toThe53.greater(dividend)) {
                        var dividendNum = parseInt(dividend.value);
                        var divisorNum = parseInt(divisor.value);
                        return wantRemainder ? BigNumber.convertFromNumber(dividendNum % divisorNum) : BigNumber.convertFromNumber(dividendNum / divisorNum);
                    }

                    var quotientString = "";
                    var nextIndex = divisorLength;
                    var currDividend = BigNumber.convertFromBinaryString(dividendBits.substr(0, divisorLength));

                    while (nextIndex <= dividendLength) {
                        if (currDividend.greater(divisor) || currDividend.equals(divisor)) {
                            quotientString += "1";
                            currDividend = BigNumber.subtract(currDividend, divisor);
                        } else {
                            quotientString += "0";
                        }

                        if (nextIndex !== dividendLength) {
                            currDividend = BigNumber.convertFromBinaryString(BigNumber.getBinaryString(currDividend) + dividendBits[nextIndex]);
                        }

                        nextIndex++;
                    }

                    return wantRemainder ? currDividend : BigNumber.convertFromBinaryString(quotientString);
                };
                BigNumber.OldestTimestampFormat = {
                    h: 0,
                    l: 0
                };

                BigNumber.LatestTimestampFormat = {
                    h: 0xffffffff,
                    l: 0xffffffff
                };
                return BigNumber;
            })();
            DiagnosticsHub.BigNumber = BigNumber;

            var JsonTimespan = (function () {
                function JsonTimespan(begin, end) {
                    if (begin.greater(end)) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                    }

                    this._begin = begin;
                    this._end = end;
                }
                Object.defineProperty(JsonTimespan.prototype, "begin", {
                    get: function () {
                        return this._begin;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(JsonTimespan.prototype, "end", {
                    get: function () {
                        return this._end;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(JsonTimespan.prototype, "elapsed", {
                    get: function () {
                        if (!this._elapsed) {
                            this._elapsed = BigNumber.subtract(this.end, this.begin);
                        }

                        return this._elapsed;
                    },
                    enumerable: true,
                    configurable: true
                });

                JsonTimespan.prototype.equals = function (other) {
                    return this.begin.equals(other.begin) && this.end.equals(other.end);
                };

                JsonTimespan.prototype.contains = function (time) {
                    return time.greaterOrEqual(this.begin) && this.end.greaterOrEqual(time);
                };
                return JsonTimespan;
            })();
            DiagnosticsHub.JsonTimespan = JsonTimespan;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (DataWarehouse) {
                "use strict";

                var DhContextData = (function () {
                    function DhContextData() {
                    }
                    return DhContextData;
                })();
                DataWarehouse.DhContextData = DhContextData;
            })(DiagnosticsHub.DataWarehouse || (DiagnosticsHub.DataWarehouse = {}));
            var DataWarehouse = DiagnosticsHub.DataWarehouse;
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

            var Logger = (function () {
                function Logger() {
                    var _this = this;
                    this._isInfoOn = true;
                    this._isDebugOn = true;
                    this._isWarningOn = true;
                    this._isErrorOn = true;
                    this._loggerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.LoggerPortMarshaler", {}, true);

                    this._loggerProxy._call("isInfoOn").done(function (infoOn) {
                        _this._isInfoOn = infoOn;
                    });
                    this._loggerProxy._call("isDebugOn").done(function (debugOn) {
                        _this._isDebugOn = debugOn;
                    });
                    this._loggerProxy._call("isWarningOn").done(function (warningOn) {
                        _this._isWarningOn = warningOn;
                    });
                    this._loggerProxy._call("isErrorOn").done(function (errorOn) {
                        _this._isErrorOn = errorOn;
                    });

                    try  {
                        var apex = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.Test.Apex.DiagnosticsHub.ApexJSExtension", {}, true);
                        if (apex !== null) {
                            apex._call("getApexJavaScript").done(function (result) {
                                if (result) {
                                    _this.debug("got apex javascript files");
                                    var scriptObj = document.createElement("script");
                                    scriptObj.setAttribute("type", "text/javascript");
                                    scriptObj.setAttribute("src", result);
                                    var head = document.getElementsByTagName("head");
                                    if (!head) {
                                        _this.debug("Unable to add apex script to document");
                                    } else {
                                        head[0].appendChild(scriptObj);
                                        _this.debug("Added ApexJSExtension '" + result + "' to document");
                                    }
                                } else {
                                    _this.debug("no file was returned by getApexJavaScript, cannot inject TestExtension.ts for ApexJS framework");
                                }
                            }, function (error) {
                                _this.debug("Error when calling getApexJavaScript function:" + String(error));
                            });
                        } else {
                            this.debug("Unable to connect to port marshaler 'Microsoft.Test.Apex.DiagnosticsHub.ApexJSExtension'");
                        }
                    } catch (e) {
                        this.error(e.toString());
                    }
                }
                Logger.prototype.info = function (message) {
                    if (this._isInfoOn) {
                        this._loggerProxy._call("logInfo", message);
                    }
                };

                Logger.prototype.debug = function (message) {
                    if (this._isDebugOn) {
                        this._loggerProxy._call("logDebug", message);
                    }
                };

                Logger.prototype.warning = function (message) {
                    if (this._isWarningOn) {
                        this._loggerProxy._call("logWarning", message);
                    }
                };

                Logger.prototype.error = function (message) {
                    if (this._isErrorOn) {
                        this._loggerProxy._call("logError", message);
                    }
                };
                return Logger;
            })();

            var _logger = null;

            function getLogger() {
                if (_logger === null) {
                    _logger = new Logger();
                }

                return _logger;
            }
            DiagnosticsHub.getLogger = getLogger;

            Microsoft.Plugin.addEventListener("pluginready", function () {
                getLogger();
            });
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (Collectors) {
                "use strict";

                var CollectionResultUpdateService = (function () {
                    function CollectionResultUpdateService() {
                        this._proxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.CollectionResultUpdateServiceMarshaler", {}, true);
                    }
                    CollectionResultUpdateService.prototype.flushCurrentResult = function () {
                        return this._proxy._call("flushCurrentResult");
                    };

                    CollectionResultUpdateService.prototype.start = function (updateInterval) {
                        return this._proxy._call("start", updateInterval);
                    };

                    CollectionResultUpdateService.prototype.stop = function () {
                        return this._proxy._call("stop");
                    };

                    CollectionResultUpdateService.prototype.isStarted = function () {
                        return this._proxy._call("isStarted");
                    };
                    return CollectionResultUpdateService;
                })();

                var _collectionResultUpdateService = null;

                function getCollectionResultService() {
                    if (_collectionResultUpdateService === null) {
                        _collectionResultUpdateService = new CollectionResultUpdateService();
                    }

                    return _collectionResultUpdateService;
                }
                Collectors.getCollectionResultService = getCollectionResultService;

                function getCollectionResultUpdateService() {
                    if (_collectionResultUpdateService === null) {
                        _collectionResultUpdateService = new CollectionResultUpdateService();
                    }

                    return _collectionResultUpdateService;
                }
                Collectors.getCollectionResultUpdateService = getCollectionResultUpdateService;
            })(DiagnosticsHub.Collectors || (DiagnosticsHub.Collectors = {}));
            var Collectors = DiagnosticsHub.Collectors;
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

            function InitializeErrorReporting() {
                window.onerror = function (message, filename, lineno, colno, error) {
                    var logger = DiagnosticsHub.getLogger();
                    var errorMessage = "Script error caught in: " + (filename || "unknown script file") + " at " + lineno + "\n" + message;
                    logger.error(errorMessage);
                    Microsoft.VisualStudio.DiagnosticsHub.Debug.Assert.fail(errorMessage);
                    Microsoft.Plugin.Diagnostics.reportError(message, filename, lineno, message, colno);

                    Microsoft.Plugin.Diagnostics.terminate();
                };
            }
            DiagnosticsHub.InitializeErrorReporting = InitializeErrorReporting;
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

            function eventThrottler(callback, timeout) {
                var shouldDrop = false;
                var droppedEvent = false;
                var latestArgs = null;

                var throttle = function () {
                    var args = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        args[_i] = arguments[_i + 0];
                    }
                    latestArgs = args;
                    if (!shouldDrop) {
                        callback.apply(null, args);
                        shouldDrop = true;

                        window.setTimeout(function () {
                            shouldDrop = false;
                            if (droppedEvent) {
                                window.setTimeout(throttle, 0, latestArgs);
                            }

                            droppedEvent = false;
                        }, timeout);
                    } else {
                        droppedEvent = true;
                    }
                };

                return throttle;
            }
            DiagnosticsHub.eventThrottler = eventThrottler;
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

            var DiagnosticsHubNativeHost = (function () {
                function DiagnosticsHubNativeHost(logger) {
                    this._externalObject = null;
                    this._logger = logger;

                    var hostObj = Microsoft.Plugin.F12 || Microsoft.Plugin.VS;
                    if (!hostObj) {
                        this._logger.error("External object creator does not exist");
                        throw "Unable to determine the ScriptedSandbox host";
                    }

                    this._externalObject = hostObj.Utilities.createExternalObject("DiagnosticsHub.DataWarehouseHost", "{339B3787-FC17-4BF5-A0DC-CBEF24DB2EDE}");
                    this._automationManager = DiagnosticsHub.getAutomationManager(this._logger);
                }
                DiagnosticsHubNativeHost.prototype.requestSync = function (controllerId, actionId, sessionId, request) {
                    if (this._externalObject) {
                        this._externalObject.requestSync(controllerId, actionId, sessionId, (typeof request === "string") ? request : (request !== null && (typeof request !== "undefined")) ? JSON.stringify(request) : "");
                    } else {
                        this._logger.warning("External object is null. Verify that DiagnosticsHub.ScriptedSandboxPlugin.dll was loaded into ScriptedSandbox.");
                    }
                };

                DiagnosticsHubNativeHost.prototype.request = function (controllerId, actionId, sessionId, request) {
                    var _this = this;
                    var safeInvoke = function (callback, response) {
                        try  {
                            callback(response);
                        } catch (e) {
                            _this._logger.error(JSON.stringify(e));
                        }
                    };

                    var result = null;
                    var response = null;
                    var oncancel = function () {
                        if (_this._externalObject && _this._externalObject.cancel && response && response.requestId) {
                            _this._externalObject.cancel(response.requestId);
                        }
                    };

                    var dispatchCallback = function (promiseHandler, jsonResponse, promiseType) {
                        if (promiseHandler !== null) {
                            var result = null;

                            if (jsonResponse !== null) {
                                try  {
                                    result = (jsonResponse === null || jsonResponse === "" || (typeof jsonResponse !== "string")) ? jsonResponse : JSON.parse(jsonResponse);
                                } catch (e) {
                                    _this._logger.error("Could not parse " + promiseType + " response: " + jsonResponse);
                                    _this._logger.error(e.Message);
                                }
                            }

                            safeInvoke(promiseHandler, result);
                        } else {
                            _this._logger.warning("DiagnosticsHubNativeHost: " + promiseType + " callback is null.");
                        }
                    };

                    var promiseInitialization = function (completePromise, errorPromise, progressPromise) {
                        if (_this._externalObject) {
                            result = _this._externalObject.request(controllerId, actionId, sessionId, (typeof request === "string") ? request : (request !== null && (typeof request !== "undefined")) ? JSON.stringify(request) : "", function (jsonResponse) {
                                dispatchCallback(completePromise, jsonResponse, "completePromise");
                            }, function (jsonResponse) {
                                dispatchCallback(errorPromise, jsonResponse, "errorPromise");
                            }, function (jsonResponse) {
                                dispatchCallback(progressPromise, jsonResponse, "progressPromise");
                            });
                        } else {
                            _this._logger.warning("External object is null. Verify that DiagnosticsHub.ScriptedSandboxPlugin.dll was loaded into ScriptedSandbox.");
                        }

                        if (result === null || typeof result !== "string") {
                            response = { hresult: 1 };
                        } else {
                            response = JSON.parse(result);
                        }

                        if (response.hresult !== 0) {
                            _this._logger.error("Could not invoke request method of native host: " + result);

                            var error = new Error();
                            error.message = error.name = response.hresult.toString(16);
                            errorPromise(error);
                        }
                    };

                    var requestArgs = {
                        controllerId: controllerId,
                        actionId: actionId,
                        sessionId: sessionId,
                        request: request
                    };

                    var resultPromise = this._automationManager.getAutomationPromise(DiagnosticsHub.AutomationConstants.DataWarehouseRequestKey, promiseInitialization, oncancel, requestArgs);
                    return resultPromise;
                };
                return DiagnosticsHubNativeHost;
            })();
            DiagnosticsHub.DiagnosticsHubNativeHost = DiagnosticsHubNativeHost;
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

            var EventDeferral = (function () {
                function EventDeferral(onHandlerCompleted) {
                    this._onHandlerCompleted = onHandlerCompleted;
                }
                EventDeferral.prototype.complete = function () {
                    this._onHandlerCompleted();
                };
                return EventDeferral;
            })();

            var StateChangedEventArgs = (function () {
                function StateChangedEventArgs(eventArgs, onHandlerCompleted) {
                    this._eventArgs = eventArgs;
                    this._waitHandler = false;
                    this._onHandlerCompleted = onHandlerCompleted;
                    this._eventDeferral = null;
                }
                Object.defineProperty(StateChangedEventArgs.prototype, "currentState", {
                    get: function () {
                        return this._eventArgs.CurrentState;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(StateChangedEventArgs.prototype, "previousState", {
                    get: function () {
                        return this._eventArgs.PreviousState;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(StateChangedEventArgs.prototype, "waitHandler", {
                    get: function () {
                        return this._eventDeferral !== null;
                    },
                    enumerable: true,
                    configurable: true
                });

                StateChangedEventArgs.prototype.getDeferral = function () {
                    if (this._eventDeferral === null) {
                        this._eventDeferral = new EventDeferral(this._onHandlerCompleted);
                    }

                    return this._eventDeferral;
                };
                return StateChangedEventArgs;
            })();

            var Session = (function () {
                function Session(logger) {
                    var _this = this;
                    this._eventsListeners = new Array();
                    this._logger = logger;
                    this._isInitialized = false;
                    this._sessionProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.SessionPortMarshaler", {}, true);

                    this._initializationPromise = this._sessionProxy._call("initialize");

                    this._initializationPromise.done(function () {
                        _this._logger.debug("JavaScript session object connected to host. Ready to get session state notification events.");
                        _this._isInitialized = true;
                    }, function (error) {
                        _this._logger.error("Cannot initialize session, error name: '" + error.name + "', error message: '" + error.message + "'");
                    });

                    this._sessionProxy.addEventListener("sessionStateChanged", this.stateChangedHandler.bind(this));
                }
                Session.prototype.stopCollection = function () {
                    return this._sessionProxy._call("stopCollection");
                };

                Session.prototype.canStopCollection = function () {
                    return this._sessionProxy._call("canStopCollection");
                };

                Session.prototype.getPerformanceDebuggerSessionTargetProcessInformation = function () {
                    return this._sessionProxy._call("getPerformanceDebuggerSessionTargetProcessInformation");
                };

                Session.prototype.getState = function () {
                    return this._sessionProxy._call("getState");
                };

                Session.prototype.addStateChangedEventListener = function (listener) {
                    this._eventsListeners.push(listener);
                    this._logger.debug("State changed event handler added.");
                };

                Session.prototype.isInitialized = function () {
                    return this._isInitialized;
                };

                Session.prototype.removeStateChangedEventListener = function (listener) {
                    for (var i = 0; i < this._eventsListeners.length; i++) {
                        if (this._eventsListeners[i] === listener) {
                            this._logger.debug("State changed event handler removed.");
                            this._eventsListeners.splice(i, 1);
                            break;
                        }
                    }
                };

                Session.prototype.stateChangedHandler = function (eventArgs) {
                    var _this = this;
                    this._logger.debug("Invoking JavaScript handlers for State Change Event.");

                    var handlersCount = 0;
                    var onCompleted = function () {
                        handlersCount--;
                        if (handlersCount <= 0) {
                            _this._sessionProxy._call("sessionStateChangedCompleted", eventArgs.Token);
                        } else {
                            _this._logger.debug("Still waiting when all event state change handlers will complete their work. Handlers count: " + handlersCount);
                        }
                    };

                    for (var propertyName in this._eventsListeners) {
                        var handler = this._eventsListeners[propertyName];

                        if (this._eventsListeners.hasOwnProperty(propertyName)) {
                            if (typeof handler === "function") {
                                try  {
                                    var jsEventArgs = new StateChangedEventArgs(eventArgs, onCompleted);
                                    handler(jsEventArgs);
                                    if (jsEventArgs.waitHandler) {
                                        handlersCount++;
                                        this._logger.debug("JavaScipt handlers for event state changed asked to wait while they will finish. Handlers count: " + handlersCount);
                                    }
                                } catch (e) {
                                    this._logger.error(e.toString());
                                }
                            } else {
                                this._logger.warning("One of the listeners not a 'function', it has type " + (typeof handler));
                            }
                        }
                    }

                    if (handlersCount === 0) {
                        onCompleted();
                    }
                };
                return Session;
            })();

            var _currentSession = null;

            function getCurrentSession() {
                if (_currentSession === null) {
                    _currentSession = new Session(DiagnosticsHub.getLogger());
                }

                return _currentSession;
            }
            DiagnosticsHub.getCurrentSession = getCurrentSession;

            Microsoft.Plugin.addEventListener("pluginready", function () {
                getCurrentSession();
            });
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (DataWarehouse) {
                "use strict";

                var DataWarehouseService = (function () {
                    function DataWarehouseService() {
                        this._serviceProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.DataWarehouseServiceMarshaler", {}, true);
                        this._logger = DiagnosticsHub.getLogger();
                    }
                    DataWarehouseService.prototype.getAllDataSourceInfos = function (callback) {
                        var _this = this;
                        this._serviceProxy._call("getAllDataSourceInfos").done(function (result) {
                            var infos = [];

                            for (var i = 0; i < result.length; i++) {
                                var dataSource = result[i];
                                if (dataSource.type === 1 /* File */ || dataSource.type === 2 /* Directory */ || dataSource.type === 4 /* Package */) {
                                    infos.push(dataSource);
                                } else {
                                    _this._logger.error("Unknown data source info type: " + dataSource.type);
                                }
                            }

                            callback(infos);
                        });
                    };
                    return DataWarehouseService;
                })();

                var _service = null;

                function getDataWarehouseService() {
                    if (_service === null) {
                        _service = new DataWarehouseService();
                    }

                    return _service;
                }
                DataWarehouse.getDataWarehouseService = getDataWarehouseService;

                Microsoft.Plugin.addEventListener("pluginready", function () {
                    getDataWarehouseService();
                });
            })(DiagnosticsHub.DataWarehouse || (DiagnosticsHub.DataWarehouse = {}));
            var DataWarehouse = DiagnosticsHub.DataWarehouse;
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

            var Guid = (function () {
                function Guid(value) {
                    if (value.length === 38 && value[0] === "{" && value[37] === "}") {
                        value = value.substr(1, 36);
                    }

                    if (value.length !== 36) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1010"));
                    }

                    this._value = value.toLowerCase();
                    if (!Guid.GuidRegEx.test(this._value)) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1010"));
                    }
                }
                Object.defineProperty(Guid, "empty", {
                    get: function () {
                        return new Guid("00000000-0000-0000-0000-000000000000");
                    },
                    enumerable: true,
                    configurable: true
                });

                Guid.newGuid = function () {
                    return new Guid(Guid.createRandomToken());
                };

                Guid.prototype.equals = function (other) {
                    return this._value.toLowerCase() === other._value.toLowerCase();
                };

                Guid.prototype.toString = function () {
                    return this._value;
                };

                Guid.createRandomToken = function () {
                    return "rrrrrrrr-rrrr-4rrr-srrr-rrrrrrrrrrrr".replace(/[rs]/g, function (character) {
                        var randomNumber = Math.random() * 16 | 0;
                        if (character !== "r") {
                            randomNumber = (randomNumber & 0x3 | 0x8);
                        }

                        return randomNumber.toString(16);
                    });
                };
                Guid.GuidRegEx = new RegExp("^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$");
                return Guid;
            })();
            DiagnosticsHub.Guid = Guid;
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

            var _documentToolsServiceProxy = null;

            var DocumentToolsService = (function () {
                function DocumentToolsService() {
                    if (_documentToolsServiceProxy === null) {
                        _documentToolsServiceProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.DocumentToolsServiceMarshaler", {}, true);
                    }
                }
                DocumentToolsService.prototype.addTool = function (toolId) {
                    return _documentToolsServiceProxy._call("addTool", toolId.toString());
                };

                DocumentToolsService.prototype.removeTool = function (toolId) {
                    return _documentToolsServiceProxy._call("removeTool", toolId.toString());
                };

                DocumentToolsService.prototype.getAvailableTools = function () {
                    return _documentToolsServiceProxy._call("getAvailableTools");
                };
                return DocumentToolsService;
            })();
            DiagnosticsHub.DocumentToolsService = DocumentToolsService;
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

            var Publisher = (function () {
                function Publisher(events) {
                    if (typeof events === "undefined") { events = null; }
                    this._events = {};
                    this._listeners = {};
                    if (events && events.length > 0) {
                        for (var i = 0; i < events.length; i++) {
                            var type = events[i];
                            if (type) {
                                this._events[type] = type;
                            }
                        }
                    } else {
                        this._events = null;
                    }
                }
                Publisher.prototype.dispose = function () {
                    delete this._events;
                    delete this._listeners;
                };

                Publisher.prototype.addEventListener = function (eventType, func) {
                    if (eventType && func) {
                        if (this._events === null || this._events[eventType]) {
                            var callbacks = this._listeners[eventType] ? this._listeners[eventType] : this._listeners[eventType] = [];
                            callbacks.push(func);
                        }
                    }
                };

                Publisher.prototype.removeEventListener = function (eventType, func) {
                    if (eventType && func) {
                        if (this._events === null || this._events[eventType]) {
                            var callbacks = this._listeners[eventType];
                            if (callbacks) {
                                for (var i = 0; i < callbacks.length; i++) {
                                    if (func === callbacks[i]) {
                                        callbacks.splice(i, 1);
                                        break;
                                    }
                                }

                                if (callbacks.length === 0) {
                                    delete this._listeners[eventType];
                                }
                            }
                        }
                    }
                };

                Publisher.prototype.invokeListener = function (eventType, args) {
                    if (eventType) {
                        if (this._events === null || this._events[eventType]) {
                            var callbacks = this._listeners[eventType];
                            if (callbacks) {
                                for (var i = 0; i < callbacks.length; i++) {
                                    var func = callbacks[i];
                                    if (func) {
                                        func(args);
                                    }
                                }
                            }
                        }
                    }
                };
                return Publisher;
            })();
            DiagnosticsHub.Publisher = Publisher;
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

            var EventAggregator = (function () {
                function EventAggregator(logger) {
                    var _this = this;
                    this._eventsListeners = {};
                    this._publisher = new DiagnosticsHub.Publisher();

                    this._logger = logger;
                    this._eventAggregatorProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.EventAggregatorMarshaler", {}, true);
                    this._eventAggregatorProxy.addEventListener("globalEventHandler", function (eventArgs) {
                        _this.globalEventHandler(eventArgs);
                    });
                }
                EventAggregator.prototype.addEventListener = function (eventType, listener) {
                    this._publisher.addEventListener(eventType, listener);
                    this._logger.debug("EventAggregator:: Event listener added for event type '" + eventType + "'");
                };

                EventAggregator.prototype.removeEventListener = function (eventType, listener) {
                    this._publisher.removeEventListener(eventType, listener);
                    this._logger.debug("EventAggregator:: Event listener removed for event type '" + eventType + "'");
                };

                EventAggregator.prototype.globalEventHandler = function (eventArgs) {
                    var eventType = eventArgs.EventType;

                    this._logger.debug("EventAggregator:: Handling event type " + eventType + ".");

                    var dataString = eventArgs.Data.Json;
                    this._logger.debug("EventAggregator:: Raise handler for event type " + eventType + " with data " + dataString + ".");

                    try  {
                        var data = null;
                        if (dataString !== null && typeof dataString === "string" && dataString !== "") {
                            data = JSON.parse(dataString);
                        }

                        this._publisher.invokeListener(eventType, data);
                    } catch (e) {
                        this._logger.error(e.toString());
                    }
                };

                EventAggregator.prototype.raiseEvent = function (eventType, data) {
                    var dataString = null;
                    if (data !== null && typeof data !== "undefined") {
                        dataString = JSON.stringify(data);
                    }

                    this._logger.debug("EventAggregator:: Raising event type " + eventType + " with data " + dataString + ".");
                    this._eventAggregatorProxy._call("raiseEvent", eventType, dataString);
                };
                return EventAggregator;
            })();

            var LocalEventAggregator = (function () {
                function LocalEventAggregator() {
                    this._publisher = new DiagnosticsHub.Publisher();
                }
                LocalEventAggregator.prototype.addEventListener = function (eventType, listener) {
                    this._publisher.addEventListener(eventType, listener);
                };

                LocalEventAggregator.prototype.removeEventListener = function (eventType, listener) {
                    this._publisher.removeEventListener(eventType, listener);
                };

                LocalEventAggregator.prototype.raiseEvent = function (eventType, data) {
                    this._publisher.invokeListener(eventType, data);
                };
                return LocalEventAggregator;
            })();
            DiagnosticsHub.LocalEventAggregator = LocalEventAggregator;

            var _eventAggregator = null;

            function getEventAggregator() {
                if (_eventAggregator === null) {
                    if (Microsoft.Plugin.F12) {
                        _eventAggregator = new LocalEventAggregator();
                    } else {
                        _eventAggregator = new EventAggregator(DiagnosticsHub.getLogger());
                    }
                }

                return _eventAggregator;
            }
            DiagnosticsHub.getEventAggregator = getEventAggregator;

            Microsoft.Plugin.addEventListener("pluginready", function () {
                getEventAggregator();
            });
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

            var DiagnosticsHubRestWebHost = (function () {
                function DiagnosticsHubRestWebHost() {
                    this._logger = DiagnosticsHub.getLogger();
                    this._endPointMapping = [];
                    this._automationManager = DiagnosticsHub.getAutomationManager(this._logger);
                    this._vsHubService = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.VsHubServiceMarshaler", {}, true);
                }
                DiagnosticsHubRestWebHost.prototype.request = function (controllerId, actionId, sessionId, request) {
                    var _this = this;
                    var ajaxRequest = new XMLHttpRequest();

                    var statusToken;
                    var requestPromiseFunc = function (completed, error, progress) {
                        ajaxRequest.onload = function () {
                            if (ajaxRequest.status === DiagnosticsHubRestWebHost.HTTP_STATUS_ACCEPTED) {
                                if (!statusToken) {
                                    statusToken = ajaxRequest.response;
                                } else if (ajaxRequest.response && ajaxRequest.response.length > 0 && progress) {
                                    progress(JSON.parse(ajaxRequest.response));
                                }

                                _this.sendRequest(ajaxRequest, controllerId, DiagnosticsHub.DataWarehouse.Constants.ACTION_DATAWAREHOUSE_GETSTATUS, statusToken);
                            } else if (ajaxRequest.status >= 200 && ajaxRequest.status < 400) {
                                var response = ajaxRequest.response && ajaxRequest.response.length > 0 ? JSON.parse(ajaxRequest.response) : "";
                                completed(response);
                            } else {
                                var response = ajaxRequest.response && ajaxRequest.response.length > 0 ? ajaxRequest.response : "[EMPTY]";
                                _this._vsHubService._post("reportError", controllerId, actionId, sessionId, ajaxRequest.status, response);
                                if (error) {
                                    error(new Error(response));
                                }
                            }
                        };
                    };

                    var requestPromiseCancelFunc = function () {
                        ajaxRequest.abort();

                        if (statusToken) {
                            ajaxRequest.onload = null;
                            _this.sendRequest(ajaxRequest, controllerId, DiagnosticsHub.DataWarehouse.Constants.ACTION_DATAWAREHOUSE_CANCELTASK, statusToken);
                        }
                    };

                    request = request || {};
                    request["sessionId"] = sessionId;

                    var requestArgs = {
                        controllerId: controllerId,
                        actionId: actionId,
                        sessionId: sessionId,
                        request: request
                    };

                    var requestPromise = this._automationManager.getAutomationPromise(DiagnosticsHub.AutomationConstants.DataWarehouseRequestKey, requestPromiseFunc, requestPromiseCancelFunc, requestArgs);
                    this.sendRequest(ajaxRequest, controllerId, actionId, JSON.stringify(request));
                    return requestPromise;
                };

                DiagnosticsHubRestWebHost.prototype.requestSync = function (controllerId, actionId, sessionId, request) {
                    throw new Error("Not Implemented.");
                };

                DiagnosticsHubRestWebHost.prototype.sendRequest = function (request, controllerId, actionId, json) {
                    var _this = this;
                    var endPoint;

                    if (!this._endPointMapping[controllerId] || !this._endPointMapping[controllerId].actions[actionId]) {
                        this._endPointMapping[controllerId] = this._endPointMapping[controllerId] || { actions: [] };

                        endPoint = this._vsHubService._call("getUri", controllerId, actionId).then(function (serviceUri) {
                            _this._endPointMapping[controllerId].actions[actionId] = { uri: serviceUri.uri };
                            return serviceUri.uri;
                        }, function (error) {
                            return _this.logError(error);
                        });
                    } else {
                        endPoint = Microsoft.Plugin.Promise.wrap(this._endPointMapping[controllerId].actions[actionId].uri);
                    }

                    endPoint.done(function (uri) {
                        request.open("POST", uri, true);
                        request.timeout = DiagnosticsHubRestWebHost.DEFAULT_REQUEST_TIMEOUT;
                        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        request.send(json);
                    }, function (error) {
                        return _this.logError(error);
                    });
                };

                DiagnosticsHubRestWebHost.prototype.logError = function (error) {
                    this._logger.error(error.message);
                    return error;
                };
                DiagnosticsHubRestWebHost.HTTP_STATUS_ACCEPTED = 202;

                DiagnosticsHubRestWebHost.DEFAULT_REQUEST_TIMEOUT = 100000;
                return DiagnosticsHubRestWebHost;
            })();
            DiagnosticsHub.DiagnosticsHubRestWebHost = DiagnosticsHubRestWebHost;
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

            var Guids = (function () {
                function Guids() {
                }
                Object.defineProperty(Guids, "standardCollectorClassId", {
                    get: function () {
                        return "44d04ed9-f786-458c-93a9-7207a3cc52e1";
                    },
                    enumerable: true,
                    configurable: true
                });
                return Guids;
            })();
            DiagnosticsHub.Guids = Guids;
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

            var OutputWindowsService = (function () {
                function OutputWindowsService() {
                    this._loggerProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.OutputWindowServiceMarshaler", {}, true);
                }
                OutputWindowsService.prototype.outputLine = function (message) {
                    this._loggerProxy._call("outputLine", message);
                };

                OutputWindowsService.prototype.outputLineAndShow = function (message) {
                    this._loggerProxy._call("outputLineAndShow", message);
                };

                OutputWindowsService.prototype.outputString = function (message) {
                    this._loggerProxy._call("outputString", message);
                };

                OutputWindowsService.prototype.outputStringAndShow = function (message) {
                    this._loggerProxy._call("outputStringAndShow", message);
                };
                return OutputWindowsService;
            })();

            var _outputWindowService = null;

            function getOutputWindowsService() {
                if (_outputWindowService === null) {
                    _outputWindowService = new OutputWindowsService();
                }

                return _outputWindowService;
            }
            DiagnosticsHub.getOutputWindowsService = getOutputWindowsService;

            Microsoft.Plugin.addEventListener("pluginready", function () {
                getOutputWindowsService();
            });
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

            var PerformanceDebuggerToolsService = (function () {
                function PerformanceDebuggerToolsService() {
                    this._proxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.PerformanceDebuggerToolsServiceMarshaler", {}, true);

                    this._toolStateChangedEvent = new DiagnosticsHub.ObservableEvent(this._proxy, "DiagnosticsHub.ToolStateChangedEvent");
                }
                Object.defineProperty(PerformanceDebuggerToolsService.prototype, "toolStateChangedEvent", {
                    get: function () {
                        return this._toolStateChangedEvent;
                    },
                    enumerable: true,
                    configurable: true
                });

                PerformanceDebuggerToolsService.prototype.getAvailableToolsInformationAndState = function () {
                    return this._proxy._call("getAvailableToolsInformation");
                };

                PerformanceDebuggerToolsService.prototype.setToolEnabled = function (toolId, active) {
                    this._proxy._call("setToolEnabled", toolId, active);
                };
                return PerformanceDebuggerToolsService;
            })();
            DiagnosticsHub.PerformanceDebuggerToolsService = PerformanceDebuggerToolsService;

            var _performanceDebuggerToolsService;

            function getPerformanceDebuggerToolsService() {
                if (!_performanceDebuggerToolsService) {
                    _performanceDebuggerToolsService = new PerformanceDebuggerToolsService();
                }

                return _performanceDebuggerToolsService;
            }
            DiagnosticsHub.getPerformanceDebuggerToolsService = getPerformanceDebuggerToolsService;
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

            var ObservableEvent = (function () {
                function ObservableEvent(eventSource, eventName) {
                    this._eventName = eventName;
                    this._eventSource = eventSource;
                }
                ObservableEvent.prototype.addEventListener = function (func) {
                    this._eventSource.addEventListener(this._eventName, func);
                };

                ObservableEvent.prototype.removeEventListener = function (func) {
                    this._eventSource.removeEventListener(this._eventName, func);
                };
                return ObservableEvent;
            })();
            DiagnosticsHub.ObservableEvent = ObservableEvent;

            var PerformanceDebuggerEventManager = (function () {
                function PerformanceDebuggerEventManager() {
                    this._proxy = getPerformanceDebuggerStateMarshaler();

                    this._debugModeBreak = new ObservableEvent(this._proxy, "DebugModeBreakEvent");
                    this._debugModeRun = new ObservableEvent(this._proxy, "DebugModeRunEvent");
                }
                Object.defineProperty(PerformanceDebuggerEventManager.prototype, "debugModeRunEvent", {
                    get: function () {
                        return this._debugModeRun;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(PerformanceDebuggerEventManager.prototype, "debugModeBreakEvent", {
                    get: function () {
                        return this._debugModeBreak;
                    },
                    enumerable: true,
                    configurable: true
                });

                PerformanceDebuggerEventManager.prototype.isDebuggerInBreakMode = function () {
                    return this._proxy._call("isDebuggerInBreakMode");
                };
                return PerformanceDebuggerEventManager;
            })();

            var PerformanceDebuggerStateService = (function () {
                function PerformanceDebuggerStateService() {
                    this._proxy = getPerformanceDebuggerStateMarshaler();
                    this._statusMessageChanged = new ObservableEvent(this._proxy, "StatusMessageChangedEvent");
                }
                Object.defineProperty(PerformanceDebuggerStateService.prototype, "statusMessageChangedEvent", {
                    get: function () {
                        return this._statusMessageChanged;
                    },
                    enumerable: true,
                    configurable: true
                });

                PerformanceDebuggerStateService.prototype.getLastNonActiveStatusMessage = function () {
                    return this._proxy._call("getLastNonActiveStatusMessage");
                };

                PerformanceDebuggerStateService.prototype.isDocumentActiveSession = function () {
                    return this._proxy._call("isDocumentActiveSession");
                };
                return PerformanceDebuggerStateService;
            })();

            var _performanceDebuggerEventManager = null;

            function getPerformanceDebuggerEventManager() {
                if (_performanceDebuggerEventManager === null) {
                    _performanceDebuggerEventManager = new PerformanceDebuggerEventManager();
                }

                return _performanceDebuggerEventManager;
            }
            DiagnosticsHub.getPerformanceDebuggerEventManager = getPerformanceDebuggerEventManager;

            var _performanceDebuggerStateService = null;

            function getPerformanceDebuggerStateService() {
                if (_performanceDebuggerStateService === null) {
                    _performanceDebuggerStateService = new PerformanceDebuggerStateService();
                }

                return _performanceDebuggerStateService;
            }
            DiagnosticsHub.getPerformanceDebuggerStateService = getPerformanceDebuggerStateService;

            var _performanceDebuggerStateMarshaler = null;
            function getPerformanceDebuggerStateMarshaler() {
                if (_performanceDebuggerStateMarshaler === null) {
                    _performanceDebuggerStateMarshaler = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.PerformanceDebuggerStateMarshaler", {}, true);
                }

                return _performanceDebuggerStateMarshaler;
            }
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (Collectors) {
                "use strict";

                var StandardTransportService = (function () {
                    function StandardTransportService(logger) {
                        var _this = this;
                        this._messageListeners = {};
                        this._logger = logger;
                        this._proxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.StandardTransportServiceMarshaler", {}, true);

                        this._proxy.addEventListener("stringMessageReceived", function (eventArgs) {
                            _this._logger.debug("StandardTransportService.stringMessageReceived");
                            _this.onStringMessageReceived(eventArgs);
                        });
                    }
                    StandardTransportService.prototype.getIsRemoteConnection = function () {
                        return this._proxy._call("getIsRemoteConnection");
                    };

                    StandardTransportService.prototype.sendStringToCollectionAgent = function (agentClassId, request) {
                        return this._proxy._call("sendStringToCollectionAgent", agentClassId, request);
                    };

                    StandardTransportService.prototype.downloadFile = function (targetFilePath, localFilePath) {
                        return this._proxy._call("downloadFile", targetFilePath, localFilePath);
                    };

                    StandardTransportService.prototype.addMessageListener = function (listenerGuid, listener) {
                        var _this = this;
                        var guidAsString = listenerGuid.toString();

                        this._logger.debug("Adding message listener (" + guidAsString + ") for standard collector");

                        if (this._messageListeners[guidAsString]) {
                            this._logger.error("Listener already exists with guid = " + guidAsString);
                            throw new Error("Listener already exists with guid = " + guidAsString);
                        }

                        this._messageListeners[guidAsString] = listener;

                        return this._proxy._call("enableEventsForListenerId", guidAsString).then(null, function (value) {
                            _this._messageListeners[guidAsString] = null;
                        });
                    };

                    StandardTransportService.prototype.onStringMessageReceived = function (eventArgs) {
                        var listenerGuid = eventArgs.ListenerId;
                        var message = eventArgs.Message;

                        if (this._messageListeners[listenerGuid]) {
                            var listener = this._messageListeners[listenerGuid];
                            listener(message);
                        } else {
                            this._logger.warning("Unexpected message received without a message listener. listenerGuid=" + listenerGuid);
                        }
                    };
                    return StandardTransportService;
                })();

                var _standardTransportService = null;

                function getStandardTransportService() {
                    if (_standardTransportService === null) {
                        _standardTransportService = new StandardTransportService(DiagnosticsHub.getLogger());
                    }

                    return _standardTransportService;
                }
                Collectors.getStandardTransportService = getStandardTransportService;
            })(DiagnosticsHub.Collectors || (DiagnosticsHub.Collectors = {}));
            var Collectors = DiagnosticsHub.Collectors;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (Collectors) {
                "use strict";

                var CollectorTransportServiceController = (function () {
                    function CollectorTransportServiceController(logger) {
                        var _this = this;
                        this._messageListeners = {};
                        this._logger = logger;
                        this._proxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.CollectorTransportServiceControllerMarshaler", {}, true);

                        this._proxy.addEventListener("stringMessageReceived", function (eventArgs) {
                            _this._logger.debug("CollectorTransportServiceController.stringMessageReceived");
                            _this.onStringMessageReceived(eventArgs);
                        });
                    }
                    CollectorTransportServiceController.prototype.getIsRemoteConnection = function (collectorId) {
                        return this._proxy._call("getIsRemoteConnection", collectorId || "");
                    };

                    CollectorTransportServiceController.prototype.sendStringToCollectionAgent = function (agentClassId, request, collectorId) {
                        return this._proxy._call("sendStringToCollectionAgent", agentClassId, request, collectorId || "");
                    };

                    CollectorTransportServiceController.prototype.downloadFile = function (targetFilePath, localFilePath, collectorId) {
                        return this._proxy._call("downloadFile", targetFilePath, localFilePath, collectorId || "");
                    };

                    CollectorTransportServiceController.prototype.addMessageListener = function (listenerGuid, listener, collectorId) {
                        var _this = this;
                        var guidAsString = listenerGuid.toString();

                        this._logger.debug("Adding message listener (" + guidAsString + ") for collector " + collectorId);

                        if (this._messageListeners[guidAsString]) {
                            this._logger.error("Listener already exists with guid = " + guidAsString);
                            throw new Error("Listener already exists with guid = " + guidAsString);
                        }

                        this._messageListeners[guidAsString] = listener;

                        return this._proxy._call("enableEventsForListenerId", guidAsString, collectorId || "").then(null, function (value) {
                            _this._messageListeners[guidAsString] = null;
                            _this._logger.error(JSON.stringify(value));
                        });
                    };

                    CollectorTransportServiceController.prototype.onStringMessageReceived = function (eventArgs) {
                        var listenerGuid = eventArgs.ListenerId;
                        var message = eventArgs.Message;

                        if (this._messageListeners[listenerGuid]) {
                            var listener = this._messageListeners[listenerGuid];
                            listener(eventArgs);
                        } else {
                            this._logger.warning("Unexpected message received without a message listener. listenerGuid=" + listenerGuid);
                        }
                    };
                    return CollectorTransportServiceController;
                })();

                var _collectorTransportServiceController = null;

                function getICollectorTransportServiceController() {
                    if (_collectorTransportServiceController === null) {
                        _collectorTransportServiceController = new CollectorTransportServiceController(DiagnosticsHub.getLogger());
                    }

                    return _collectorTransportServiceController;
                }
                Collectors.getICollectorTransportServiceController = getICollectorTransportServiceController;
            })(DiagnosticsHub.Collectors || (DiagnosticsHub.Collectors = {}));
            var Collectors = DiagnosticsHub.Collectors;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (DataWarehouse) {
                "use strict";

                var ResourceIdentity = (function () {
                    function ResourceIdentity() {
                    }
                    ResourceIdentity.DiagnosticsPackage = "DiagnosticsHub.Resource.DiagnosticsPackage";

                    ResourceIdentity.EtlFile = "DiagnosticsHub.Resource.EtlFile";

                    ResourceIdentity.JavaScriptSource = "DiagnosticsHub.Resource.JavaScript.SourceDirectory";

                    ResourceIdentity.SymbolCache = "DiagnosticsHub.Resource.SymbolCache";

                    ResourceIdentity.UserNativeImageDirectory = "DiagnosticsHub.Resource.UserNativeImageDirectory";

                    ResourceIdentity.PlatformNativeImage = "DiagnosticsHub.Resource.PlatformNativeImage";

                    ResourceIdentity.PlatformWinmd = "DiagnosticsHub.Resource.PlatformWinmd";

                    ResourceIdentity.CountersFile = "DiagnosticsHub.Resource.CountersFile";

                    ResourceIdentity.DWJsonFile = "DiagnosticsHub.Resource.DWJsonFile";

                    ResourceIdentity.UnknownFile = "DiagnosticsHub.Resource.File";

                    ResourceIdentity.UnknownDirectory = "DiagnosticsHub.Resource.Directory";
                    return ResourceIdentity;
                })();
                DataWarehouse.ResourceIdentity = ResourceIdentity;
            })(DiagnosticsHub.DataWarehouse || (DiagnosticsHub.DataWarehouse = {}));
            var DataWarehouse = DiagnosticsHub.DataWarehouse;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (DataWarehouse) {
                "use strict";

                var Constants = (function () {
                    function Constants() {
                    }
                    Constants.CONTROLLER_ID_DATAWAREHOUSE = 1;
                    Constants.CONTROLLER_ID_DATAWAREHOUSECONTEXTSERVICE = 2;
                    Constants.CONTROLLER_ID_DATAWAREHOUSECONTEXT = 3;
                    Constants.CONTROLLER_ID_DATAWAREHOUSEJMCSERVICE = 4;

                    Constants.ACTION_DATAWAREHOUSE_BEGININITIALIZATION = 1;
                    Constants.ACTION_DATAWAREHOUSE_ENDINITIALIZATION = 2;
                    Constants.ACTION_DATAWAREHOUSE_GETDATA = 3;
                    Constants.ACTION_DATAWAREHOUSE_GETRESULT = 4;
                    Constants.ACTION_DATAWAREHOUSE_DISPOSERESULT = 5;
                    Constants.ACTION_DATAWAREHOUSE_PUSHDATASOURCES = 6;
                    Constants.ACTION_DATAWAREHOUSE_PUSHACTIVECOLLECTIONDATASOURCE = 7;
                    Constants.ACTION_DATAWAREHOUSE_COMPLETEACTIVECOLLECTIONDATASOURCE = 8;
                    Constants.ACTION_DATAWAREHOUSE_RETRIEVEDATABLOB = 9;
                    Constants.ACTION_DATAWAREHOUSE_STOREDATABLOB = 10;
                    Constants.ACTION_DATAWAREHOUSE_DELETEDATABLOB = 11;
                    Constants.ACTION_DATAWAREHOUSE_INITIALIZATION_DEPRECATED = 100;
                    Constants.ACTION_DATAWAREHOUSE_CLOSE = 400;
                    Constants.ACTION_DATAWAREHOUSE_GETPRIVATEDATA = 401;
                    Constants.ACTION_DATAWAREHOUSE_SETPRIVATEDATA = 402;
                    Constants.ACTION_DATAWAREHOUSE_GETSTATUS = 403;
                    Constants.ACTION_DATAWAREHOUSE_CANCELTASK = 404;
                    Constants.ACTION_DATAWAREHOUSE_ABORTANALYSIS = 405;

                    Constants.ACTION_DATAWAREHOUSECONTEXTSERVICE_CREATECONTEXT = 1;
                    Constants.ACTION_DATAWAREHOUSECONTEXTSERVICE_DELETECONTEXT = 2;
                    Constants.ACTION_DATAWAREHOUSECONTEXTSERVICE_COPYCONTEXT = 3;
                    Constants.ACTION_DATAWAREHOUSECONTEXTSERVICE_GETCONTEXT = 4;
                    Constants.ACTION_DATAWAREHOUSECONTEXTSERVICE_GETGLOBALCONTEXT = 5;

                    Constants.ACTION_DATAWAREHOUSECONTEXT_GETTIMEDOMAIN = 1;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_SETTIMEDOMAIN = 2;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_GETMACHINEDOMAIN = 3;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_ADDTOMACHINEDOMAIN = 4;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_CLEARMACHINEDOMAIN = 5;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_GETPROCESSDOMAIN = 6;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_ADDTOPROCESSDOMAIN = 7;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_CLEARPROCESSDOMAIN = 8;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_GETTHREADDOMAIN = 9;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_ADDTOTHREADDOMAIN = 10;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_CLEARTHREADDOMAIN = 11;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_GETCUSTOMDOMAIN = 12;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_SETCUSTOMDOMAIN = 13;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_GETDATA = 14;
                    Constants.ACTION_DATAWAREHOUSECONTEXT_SETDATA = 15;

                    Constants.ACTION_DATAWAREHOUSEJMCSERVICE_GETJMCENABLED = 1;
                    Constants.ACTION_DATAWAREHOUSEJMCSERVICE_SETJMCENABLED = 2;
                    return Constants;
                })();
                DataWarehouse.Constants = Constants;

                var DhJsonResult = (function () {
                    function DhJsonResult(resultId, sessionId, controller) {
                        this._resultId = resultId;
                        this._sessionId = sessionId;
                        this._controller = controller;
                    }
                    DhJsonResult.prototype.getResult = function (customData) {
                        var requestObject = null;

                        if (customData !== null) {
                            requestObject = { resultId: this._resultId, customData: JSON.stringify(customData) };
                        } else {
                            requestObject = { resultId: this._resultId };
                        }

                        return this._controller.request(Constants.ACTION_DATAWAREHOUSE_GETRESULT, requestObject);
                    };

                    DhJsonResult.prototype.dispose = function () {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSE_DISPOSERESULT, { resultId: this._resultId });
                    };
                    return DhJsonResult;
                })();

                var DataWarehouseFactory = (function () {
                    function DataWarehouseFactory() {
                        this._getConfigurationPromise = null;
                        this._serviceProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.DataWarehouseServiceMarshaler", {}, true);
                        this._logger = DiagnosticsHub.getLogger();
                    }
                    DataWarehouseFactory.prototype.getDataWarehouse = function (configuration) {
                        var _this = this;
                        if (typeof configuration === "undefined") { configuration = null; }
                        if (this._getConfigurationPromise === null || configuration) {
                            if (configuration === null) {
                                this._getConfigurationPromise = this._serviceProxy._call("getDataWarehouseConfiguration");
                            } else {
                                this._getConfigurationPromise = Microsoft.Plugin.Promise.wrap(configuration);
                            }
                        }

                        return this._getConfigurationPromise.then(function (configuration) {
                            _this._logger.debug("Got the sessionId '" + configuration.sessionId + "'. Creating datawarehouse...");
                            return new DataWarehouseInstance(configuration);
                        });
                    };
                    return DataWarehouseFactory;
                })();
                DataWarehouse.DataWarehouseFactory = DataWarehouseFactory;

                var DataWarehouseInstance = (function () {
                    function DataWarehouseInstance(dwConfiguration) {
                        this._logger = null;
                        this._dwConfiguration = null;
                        this._controller = null;
                        this._contextService = null;
                        this._jmcService = null;
                        this._logger = DiagnosticsHub.getLogger();
                        this._dwConfiguration = dwConfiguration;
                        this._controller = new DiagnosticsHub.HostController(this._dwConfiguration.sessionId, Constants.CONTROLLER_ID_DATAWAREHOUSE);
                    }
                    DataWarehouseInstance.prototype.getConfiguration = function () {
                        return this._dwConfiguration;
                    };

                    DataWarehouseInstance.prototype.getData = function (contextId, analyzerId) {
                        var jsonRequest = null;

                        if (!contextId) {
                            jsonRequest = { analyzerId: analyzerId };
                        } else {
                            jsonRequest = { contextId: contextId, analyzerId: analyzerId };
                        }

                        return this.getDataFromAnalyzer(jsonRequest);
                    };

                    DataWarehouseInstance.prototype.getFilteredData = function (filter, analyzerId) {
                        return this.getDataFromAnalyzer({ filter: serializeDhContextData(null, filter), analyzerId: analyzerId });
                    };

                    DataWarehouseInstance.prototype.getContextService = function () {
                        if (!this._contextService) {
                            this._contextService = new DhContextService(this._dwConfiguration.sessionId);
                        }

                        return this._contextService;
                    };

                    DataWarehouseInstance.prototype.getJmcService = function () {
                        if (!this._jmcService) {
                            this._jmcService = new JmcService(this._dwConfiguration.sessionId);
                        }

                        return this._jmcService;
                    };

                    DataWarehouseInstance.prototype.close = function () {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSE_CLOSE);
                    };

                    DataWarehouseInstance.prototype.closeSynchronous = function () {
                        if (Microsoft.Plugin.F12) {
                            this._controller.requestSync(Constants.ACTION_DATAWAREHOUSE_CLOSE);
                        } else {
                            throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1009"));
                        }
                    };

                    DataWarehouseInstance.prototype.initialize = function () {
                        this._logger.debug("Initializing DataWarehouse...");
                        var jsonConfiguration = {
                            analyzers: this._dwConfiguration.analyzers,
                            dataSources: this._dwConfiguration.dataSources,
                            symbolStorePath: this._dwConfiguration.symbolStorePath || "",
                            symbolCachePath: this._dwConfiguration.symbolCachePath || "",
                            isJmcEnabled: (typeof this._dwConfiguration.isJmcEnabled === "undefined") ? true : this._dwConfiguration.isJmcEnabled
                        };

                        this._logger.debug("DataWarehouse configuration: " + JSON.stringify(jsonConfiguration));
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSE_INITIALIZATION_DEPRECATED, jsonConfiguration);
                    };

                    DataWarehouseInstance.prototype.beginInitialization = function () {
                        this._logger.debug("Begin initializing DataWarehouse");
                        var jsonConfiguration = {
                            analyzers: this._dwConfiguration.analyzers,
                            dataSources: this._dwConfiguration.dataSources,
                            symbolStorePath: this._dwConfiguration.symbolStorePath || "",
                            symbolCachePath: this._dwConfiguration.symbolCachePath || "",
                            isJmcEnabled: (typeof this._dwConfiguration.isJmcEnabled === "undefined") ? true : this._dwConfiguration.isJmcEnabled,
                            symbolLocatorServiceFullPath: this._dwConfiguration.symbolLocatorServiceFullPath || "",
                            portablePdbLibraryFullPath: this._dwConfiguration.portablePdbLibraryFullPath || ""
                        };

                        this._logger.debug("DataWarehouse configuration: " + JSON.stringify(jsonConfiguration));
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSE_BEGININITIALIZATION, jsonConfiguration);
                    };

                    DataWarehouseInstance.prototype.pushDataSources = function (dataSources) {
                        this._logger.debug("Begin pushing data source(s) to DataWarehouse");
                        var payload = {
                            dataSources: dataSources
                        };

                        this._logger.debug("PushDataSources payload: " + JSON.stringify(payload));
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSE_PUSHDATASOURCES, payload);
                    };

                    DataWarehouseInstance.prototype.endInitialization = function () {
                        this._logger.debug("End initializing DataWarehouse");
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSE_ENDINITIALIZATION);
                    };

                    DataWarehouseInstance.prototype.getPrivateData = function (dataId, privateDataArg) {
                        this._logger.debug("Getting private data from DataWarehouse...");
                        var privateDataRequest = { id: dataId, dataArg: privateDataArg };
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSE_GETPRIVATEDATA, privateDataRequest);
                    };

                    DataWarehouseInstance.prototype.setPrivateData = function (dataId, privateData) {
                        this._logger.debug("Setting private data in DataWarehouse...");
                        var privateDataRequest = { id: dataId, data: privateData };
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSE_SETPRIVATEDATA, privateDataRequest);
                    };

                    DataWarehouseInstance.prototype.getDataFromAnalyzer = function (jsonRequest) {
                        var _this = this;
                        var completePromise;
                        var errorPromise;
                        var progressPromise;

                        var promiseInitialization = function (completed, error, progress) {
                            completePromise = completed;
                            errorPromise = error;
                            progressPromise = progress;
                        };

                        var requestPromise = this._controller.request(Constants.ACTION_DATAWAREHOUSE_GETDATA, jsonRequest).then(function (result) {
                            if (completePromise) {
                                var val = null;

                                if (result !== null && typeof result !== "undefined" && typeof result.dh_r_id === "number") {
                                    _this._logger.debug("Result ID (" + result.dh_r_id + ") received for Session ID: " + _this._dwConfiguration.sessionId);

                                    val = new DhJsonResult(result.dh_r_id, _this._dwConfiguration.sessionId, _this._controller);
                                } else {
                                    val = result;
                                }

                                completePromise(val);
                            }
                        }, function (error) {
                            if (errorPromise) {
                                errorPromise(error);
                            }
                        }, function (progress) {
                            if (progress) {
                                progressPromise(progress);
                            }
                        });

                        var oncancel = function () {
                            requestPromise.cancel();
                        };

                        return new Microsoft.Plugin.Promise(promiseInitialization, oncancel);
                    };
                    return DataWarehouseInstance;
                })();

                function serializeDhContextData(contextId, data) {
                    var result = {};

                    if (contextId) {
                        result["contextId"] = contextId;
                    }

                    if (data.timeDomain) {
                        result["timeDomain"] = {
                            begin: data.timeDomain.begin.jsonValue,
                            end: data.timeDomain.end.jsonValue
                        };
                    }

                    if (data.machineDomain) {
                        result["machineDomain"] = data.machineDomain;
                    }

                    if (data.processDomain) {
                        result["processDomain"] = data.processDomain;
                    }

                    if (data.threadDomain) {
                        result["threadDomain"] = data.threadDomain;
                    }

                    if (data.customDomain) {
                        result["customDomain"] = data.customDomain;
                    }

                    return result;
                }

                var DhContextService = (function () {
                    function DhContextService(sessionId) {
                        this._controller = new DiagnosticsHub.HostController(sessionId, Constants.CONTROLLER_ID_DATAWAREHOUSECONTEXTSERVICE);
                        this._sessionId = sessionId;
                    }
                    DhContextService.prototype.createContext = function (data) {
                        var _this = this;
                        var request = {};

                        if (data !== null && typeof data !== "undefined") {
                            request["data"] = serializeDhContextData(null, data);
                        }

                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXTSERVICE_CREATECONTEXT, request).then(function (contextInfo) {
                            return new DhContext(contextInfo, _this._sessionId);
                        });
                    };

                    DhContextService.prototype.deleteContext = function (contextId) {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXTSERVICE_DELETECONTEXT, { contextId: contextId });
                    };

                    DhContextService.prototype.copyContext = function (contextId) {
                        var _this = this;
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXTSERVICE_COPYCONTEXT, { contextId: contextId }).then(function (contextInfo) {
                            return new DhContext(contextInfo, _this._sessionId);
                        });
                    };

                    DhContextService.prototype.getContext = function (contextId) {
                        var _this = this;
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXTSERVICE_GETCONTEXT, { contextId: contextId }).then(function (contextInfo) {
                            return new DhContext(contextInfo, _this._sessionId);
                        });
                    };

                    DhContextService.prototype.getGlobalContext = function () {
                        var _this = this;
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXTSERVICE_GETGLOBALCONTEXT).then(function (contextInfo) {
                            return new DhContext(contextInfo, _this._sessionId);
                        });
                    };
                    return DhContextService;
                })();

                var DhContext = (function () {
                    function DhContext(contextInfo, sessionId) {
                        this._info = contextInfo;
                        this._sessionId = sessionId;
                        this._controller = new DiagnosticsHub.HostController(this._sessionId, Constants.CONTROLLER_ID_DATAWAREHOUSECONTEXT);
                    }
                    DhContext.prototype.getContextId = function () {
                        return this._info.contextId;
                    };

                    DhContext.prototype.getParentContextId = function () {
                        return this._info.parentContextId;
                    };

                    DhContext.prototype.setData = function (data) {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_SETDATA, serializeDhContextData(this._info.contextId, data));
                    };

                    DhContext.prototype.getData = function () {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_GETDATA, { contextId: this._info.contextId }).then(function (result) {
                            return {
                                timeDomain: new DiagnosticsHub.JsonTimespan(new DiagnosticsHub.BigNumber(result.timeDomain.begin.h, result.timeDomain.begin.l), new DiagnosticsHub.BigNumber(result.timeDomain.end.h, result.timeDomain.end.l)),
                                machineDomain: result.machineDomain,
                                processDomain: result.processDomain,
                                threadDomain: result.threadDomain,
                                customDomain: result.customDomain
                            };
                        });
                    };

                    DhContext.prototype.getTimeDomain = function () {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_GETTIMEDOMAIN, { contextId: this._info.contextId }).then(function (result) {
                            return new DiagnosticsHub.JsonTimespan(new DiagnosticsHub.BigNumber(result.begin.h, result.begin.l), new DiagnosticsHub.BigNumber(result.end.h, result.end.l));
                        });
                    };

                    DhContext.prototype.setTimeDomain = function (timeDomain) {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_SETTIMEDOMAIN, {
                            contextId: this._info.contextId,
                            timeDomain: {
                                begin: timeDomain.begin.jsonValue,
                                end: timeDomain.end.jsonValue
                            }
                        });
                    };

                    DhContext.prototype.getMachineDomain = function () {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_GETMACHINEDOMAIN, { contextId: this._info.contextId });
                    };

                    DhContext.prototype.addToMachineDomain = function (machineName) {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_ADDTOMACHINEDOMAIN, { contextId: this._info.contextId, machineName: machineName });
                    };

                    DhContext.prototype.clearMachineDomain = function () {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_CLEARMACHINEDOMAIN, { contextId: this._info.contextId });
                    };

                    DhContext.prototype.getProcessDomain = function () {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_GETPROCESSDOMAIN, { contextId: this._info.contextId });
                    };

                    DhContext.prototype.addToProcessDomain = function (processId) {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_ADDTOPROCESSDOMAIN, { contextId: this._info.contextId, processId: processId });
                    };

                    DhContext.prototype.clearProcessDomain = function () {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_CLEARPROCESSDOMAIN, { contextId: this._info.contextId });
                    };

                    DhContext.prototype.getThreadDomain = function () {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_GETTHREADDOMAIN, { contextId: this._info.contextId });
                    };

                    DhContext.prototype.addToThreadDomain = function (threadId) {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_ADDTOTHREADDOMAIN, { contextId: this._info.contextId, threadId: threadId });
                    };

                    DhContext.prototype.clearThreadDomain = function () {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_CLEARTHREADDOMAIN, { contextId: this._info.contextId });
                    };

                    DhContext.prototype.getCustomDomain = function (name) {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_GETCUSTOMDOMAIN, { contextId: this._info.contextId, name: name }).then(function (result) {
                            return result.value;
                        });
                    };

                    DhContext.prototype.setCustomDomain = function (name, value) {
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSECONTEXT_SETCUSTOMDOMAIN, { contextId: this._info.contextId, name: name, value: value });
                    };
                    return DhContext;
                })();

                var JmcService = (function () {
                    function JmcService(sessionId) {
                        this._controller = new DiagnosticsHub.HostController(sessionId, Constants.CONTROLLER_ID_DATAWAREHOUSEJMCSERVICE);
                        this._logger = DiagnosticsHub.getLogger();
                        this._viewEventManager = Microsoft.VisualStudio.DiagnosticsHub.getViewEventManager();
                    }
                    JmcService.prototype.getJmcEnabledState = function () {
                        var _this = this;
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSEJMCSERVICE_GETJMCENABLED).then(function (result) {
                            if (typeof result.jmcOn === "undefined") {
                                _this._logger.error("getJmcEnabledState() result is ill-formed");
                                throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.9999"));
                            }

                            return result.jmcOn;
                        });
                    };

                    JmcService.prototype.setJmcEnabledState = function (enabledState) {
                        var _this = this;
                        return this._controller.request(Constants.ACTION_DATAWAREHOUSEJMCSERVICE_SETJMCENABLED, { jmcOn: enabledState }).then(function (result) {
                            if (typeof result.prevEnabledState === "undefined" || typeof result.currEnabledState === "undefined") {
                                _this._logger.error("setJmcEnabledState() result is ill-formed");
                                throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.9999"));
                            }

                            if (result.prevEnabledState !== result.currEnabledState) {
                                _this._viewEventManager.jmcEnabledStateChanged.raiseEvent(result);
                            }
                        });
                    };
                    return JmcService;
                })();

                var _dwFactory = null;

                function loadDataWarehouse(configuration) {
                    if (typeof configuration === "undefined") { configuration = null; }
                    if (_dwFactory === null) {
                        _dwFactory = new DataWarehouseFactory();
                    }

                    return _dwFactory.getDataWarehouse(configuration);
                }
                DataWarehouse.loadDataWarehouse = loadDataWarehouse;
            })(DiagnosticsHub.DataWarehouse || (DiagnosticsHub.DataWarehouse = {}));
            var DataWarehouse = DiagnosticsHub.DataWarehouse;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (Controllers) {
                "use strict";

                var F12_JMCType;
                (function (F12_JMCType) {
                    F12_JMCType[F12_JMCType["UserCode"] = 0] = "UserCode";
                    F12_JMCType[F12_JMCType["Library"] = 1] = "Library";
                    F12_JMCType[F12_JMCType["Unrelated"] = 2] = "Unrelated";
                    F12_JMCType[F12_JMCType["Unsure"] = 3] = "Unsure";
                })(F12_JMCType || (F12_JMCType = {}));

                var JavaScriptJmc = (function () {
                    function JavaScriptJmc() {
                        this._serviceProxy = getVisualStudioService();
                    }
                    JavaScriptJmc.prototype.getJmcTypeForUrls = function (urls) {
                        if (Microsoft.Plugin.F12) {
                            return Microsoft.Plugin.F12.JMC.getJMCTypeForUrls(urls).then(function (jmcTypes) {
                                if (!jmcTypes) {
                                    return [];
                                }

                                for (var i = 0; i < jmcTypes.length; ++i) {
                                    switch (jmcTypes[i]) {
                                        case 0 /* UserCode */:
                                            jmcTypes[i] = 0;
                                            break;
                                        case 1 /* Library */:
                                            jmcTypes[i] = 1;
                                            break;
                                        case 2 /* Unrelated */:
                                            jmcTypes[i] = 2;
                                            break;
                                        case 3 /* Unsure */:
                                        default:
                                            jmcTypes[i] = -1;
                                    }
                                }

                                return jmcTypes;
                            });
                        } else {
                            return this._serviceProxy._call("getJMCTypeForUrls", urls);
                        }
                    };
                    return JavaScriptJmc;
                })();
                Controllers.JavaScriptJmc = JavaScriptJmc;

                var SolutionService = (function () {
                    function SolutionService() {
                        this._serviceProxy = getVisualStudioService();
                    }
                    SolutionService.prototype.getAllExecutableCodeOutputs = function (includeFilenameExtensions) {
                        return this._serviceProxy._call("getSolutionExecutableCodeOutputs", includeFilenameExtensions);
                    };
                    return SolutionService;
                })();
                Controllers.SolutionService = SolutionService;

                var SourceService = (function () {
                    function SourceService() {
                        this._serviceProxy = getVisualStudioService();
                    }
                    SourceService.prototype.showDocument = function (filename, linenumber) {
                        return this._serviceProxy._call("showDocument", filename, linenumber);
                    };

                    SourceService.prototype.getAccessiblePathToFile = function (filename) {
                        return this._serviceProxy._call("getAccessiblePathToFile", filename);
                    };
                    return SourceService;
                })();
                Controllers.SourceService = SourceService;

                var DataWarehouseRegistryService = (function () {
                    function DataWarehouseRegistryService() {
                        this._serviceProxy = getVisualStudioService();
                    }
                    DataWarehouseRegistryService.prototype.isDataWarehouseInVsHub = function () {
                        return this._serviceProxy._call("isDataWarehouseInVsHub");
                    };
                    return DataWarehouseRegistryService;
                })();
                Controllers.DataWarehouseRegistryService = DataWarehouseRegistryService;

                var _visualStudioServiceProxy = null;

                function getVisualStudioService() {
                    if (_visualStudioServiceProxy === null) {
                        _visualStudioServiceProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.VisualStudioServiceMarshaler", {}, true);
                    }

                    return _visualStudioServiceProxy;
                }
                Controllers.getVisualStudioService = getVisualStudioService;
            })(DiagnosticsHub.Controllers || (DiagnosticsHub.Controllers = {}));
            var Controllers = DiagnosticsHub.Controllers;
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

            var DocumentClosingEventDeferral = (function () {
                function DocumentClosingEventDeferral(onHandlerCompleted) {
                    this._onHandlerCompleted = onHandlerCompleted;
                }
                DocumentClosingEventDeferral.prototype.complete = function (result) {
                    this._onHandlerCompleted(result);
                };
                return DocumentClosingEventDeferral;
            })();
            DiagnosticsHub.DocumentClosingEventDeferral = DocumentClosingEventDeferral;

            var DocumentClosingEventArgs = (function () {
                function DocumentClosingEventArgs(onHandlerCompleted) {
                    this._onHandlerCompleted = onHandlerCompleted;
                    this._eventDeferral = null;
                }
                Object.defineProperty(DocumentClosingEventArgs.prototype, "waitHandler", {
                    get: function () {
                        return this._eventDeferral !== null;
                    },
                    enumerable: true,
                    configurable: true
                });

                DocumentClosingEventArgs.prototype.getDeferral = function () {
                    if (this._eventDeferral === null) {
                        this._eventDeferral = new DocumentClosingEventDeferral(this._onHandlerCompleted);
                    }

                    return this._eventDeferral;
                };
                return DocumentClosingEventArgs;
            })();
            DiagnosticsHub.DocumentClosingEventArgs = DocumentClosingEventArgs;

            var Document = (function () {
                function Document() {
                    this._documentProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.DocumentPortMarshaler", {}, true);
                    this._logger = DiagnosticsHub.getLogger();
                }
                Document.prototype.getTools = function () {
                    return this._documentProxy._call("getTools");
                };

                Document.prototype.openInAlternateFormat = function (format) {
                    if (format === 1 /* Vspx */) {
                        this._logger.debug("Opening current document as a Vspx");
                        return this._documentProxy._call("openAsVspx");
                    }

                    throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1000"));
                };

                Document.prototype.isPerformanceDebuggerDocument = function () {
                    return this._documentProxy._call("isPerformanceDebuggerDocument");
                };
                return Document;
            })();

            var _currentDocument = null;

            function getCurrentDocument() {
                if (_currentDocument === null) {
                    _currentDocument = new Document();
                }

                return _currentDocument;
            }
            DiagnosticsHub.getCurrentDocument = getCurrentDocument;
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    (function (VisualStudio) {
        (function (DiagnosticsHub) {
            (function (Telemetry) {
                "use strict";

                (function (SelectionChangeSource) {
                    SelectionChangeSource[SelectionChangeSource["SwimLane"] = 0] = "SwimLane";
                    SelectionChangeSource[SelectionChangeSource["DoubleSlider"] = 1] = "DoubleSlider";
                    SelectionChangeSource[SelectionChangeSource["DoubleSliderHandles"] = 2] = "DoubleSliderHandles";
                })(Telemetry.SelectionChangeSource || (Telemetry.SelectionChangeSource = {}));
                var SelectionChangeSource = Telemetry.SelectionChangeSource;

                var CpuUsage = (function () {
                    function CpuUsage() {
                        this._serviceProxy = getTelemetryAnalysisService();
                    }
                    CpuUsage.prototype.jmcToggle = function (state) {
                        this._serviceProxy._post("reportJmcToggle", state);
                    };

                    CpuUsage.prototype.enabledAtStart = function (state) {
                        this._serviceProxy._post("cpuUsageEnabledInitially", state);
                    };
                    return CpuUsage;
                })();
                Telemetry.CpuUsage = CpuUsage;

                var PerformanceDebugger = (function () {
                    function PerformanceDebugger() {
                        this._serviceProxy = getTelemetryGlobalService();
                    }
                    PerformanceDebugger.prototype.selectToolsDropdown = function () {
                        this._serviceProxy._post("reportSelectToolsDropdown");
                    };
                    return PerformanceDebugger;
                })();
                Telemetry.PerformanceDebugger = PerformanceDebugger;

                var ViewportController = (function () {
                    function ViewportController() {
                        this._serviceProxy = getTelemetryAnalysisService();
                    }
                    ViewportController.prototype.zoomIn = function () {
                        this._serviceProxy._post("reportZoomIn");
                    };

                    ViewportController.prototype.zoomOut = function () {
                        this._serviceProxy._post("reportZoomOut");
                    };

                    ViewportController.prototype.resetZoom = function () {
                        this._serviceProxy._post("reportResetZoom");
                    };

                    ViewportController.prototype.clearSelection = function () {
                        this._serviceProxy._post("reportClearSelection");
                    };

                    ViewportController.prototype.selectionChanged = function (source, isMinSize, sourceId) {
                        var sourceGuid = sourceId || DiagnosticsHub.Guid.empty.toString();
                        this._serviceProxy._post("reportSelectionChanged", source, isMinSize, sourceGuid);
                    };

                    ViewportController.prototype.showGraphTooltip = function (swimlaneId) {
                        this._serviceProxy._post("reportGraphTooltip", swimlaneId);
                    };
                    return ViewportController;
                })();
                Telemetry.ViewportController = ViewportController;

                var CollectedData = (function () {
                    function CollectedData() {
                        this._serviceProxy = getTelemetryAnalysisService();
                    }
                    CollectedData.prototype.lostEvents = function (counter) {
                        this._serviceProxy._post("countLostEvents", counter);
                    };
                    return CollectedData;
                })();
                Telemetry.CollectedData = CollectedData;

                var _telemetryAnalysisServiceProxy = null;
                var _telemetryGlobalServiceProxy = null;

                function getTelemetryAnalysisService() {
                    if (_telemetryAnalysisServiceProxy === null) {
                        _telemetryAnalysisServiceProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.TelemetryAnalysisServiceMarshaler", {}, true);
                    }

                    return _telemetryAnalysisServiceProxy;
                }

                function getTelemetryGlobalService() {
                    if (_telemetryGlobalServiceProxy === null) {
                        _telemetryGlobalServiceProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.TelemetryGlobalServiceMarshaler", {}, true);
                    }

                    return _telemetryGlobalServiceProxy;
                }
            })(DiagnosticsHub.Telemetry || (DiagnosticsHub.Telemetry = {}));
            var Telemetry = DiagnosticsHub.Telemetry;
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

            

            var SelectionTimeRangeChangedEvent = (function () {
                function SelectionTimeRangeChangedEvent() {
                    this._publisher = new DiagnosticsHub.Publisher([SelectionTimeRangeChangedEvent.EventName]);
                    this._eventAggregator = Microsoft.VisualStudio.DiagnosticsHub.getEventAggregator();
                    this._eventAggregator.addEventListener(SelectionTimeRangeChangedEvent.EventGlobalName, this.forwardSelectionTimeRangeEvent.bind(this));
                    this._timeRangeMarshaler = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.DiagnosticsHub.VisualStudio.Presentation.JavaScriptModels.SwimlaneDataServiceMarshaler", {}, true);
                    if (!this._timeRangeMarshaler) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSProfiler.1007"));
                    }
                }
                SelectionTimeRangeChangedEvent.prototype.addEventListener = function (listener) {
                    this._publisher.addEventListener(SelectionTimeRangeChangedEvent.EventName, listener);
                };

                SelectionTimeRangeChangedEvent.prototype.removeEventListener = function (listener) {
                    this._publisher.removeEventListener(SelectionTimeRangeChangedEvent.EventName, listener);
                };

                SelectionTimeRangeChangedEvent.prototype.raiseEvent = function (eventArgs) {
                    this.setTimeRange(eventArgs.position);
                    var dto = {
                        i: eventArgs.isIntermittent
                    };

                    if (eventArgs.position) {
                        dto.ts = {
                            begin: eventArgs.position.begin.jsonValue,
                            end: eventArgs.position.end.jsonValue
                        };
                    }

                    this._eventAggregator.raiseEvent(SelectionTimeRangeChangedEvent.EventGlobalName, dto);
                };

                SelectionTimeRangeChangedEvent.prototype.getTimeRange = function () {
                    return this._timeRangeMarshaler._call("getCurrentTimeRange").then(function (time) {
                        if (time && time.begin && time.end) {
                            return new DiagnosticsHub.JsonTimespan(new DiagnosticsHub.BigNumber(time.begin.h, time.begin.l), new DiagnosticsHub.BigNumber(time.end.h, time.end.l));
                        }

                        return null;
                    });
                };

                SelectionTimeRangeChangedEvent.prototype.setTimeRange = function (time) {
                    var dto = null;

                    if (time) {
                        dto = {
                            begin: time.begin.jsonValue,
                            end: time.end.jsonValue
                        };
                    }

                    this._timeRangeMarshaler._call("setCurrentTimeRange", dto);
                };

                SelectionTimeRangeChangedEvent.prototype.forwardSelectionTimeRangeEvent = function (dto) {
                    var selectionTimeRange;

                    if (typeof dto.ts !== "undefined") {
                        selectionTimeRange = new DiagnosticsHub.JsonTimespan(new DiagnosticsHub.BigNumber(dto.ts.begin.h, dto.ts.begin.l), new DiagnosticsHub.BigNumber(dto.ts.end.h, dto.ts.end.l));
                    }

                    var args = {
                        position: selectionTimeRange,
                        isIntermittent: dto.i
                    };

                    this._publisher.invokeListener(SelectionTimeRangeChangedEvent.EventName, args);
                };
                SelectionTimeRangeChangedEvent.EventGlobalName = "DiagnosticsHub.EventAggregator.SelectionTimeRangeChanged";
                SelectionTimeRangeChangedEvent.EventName = "DiagnosticsHub.SelectionTimeRangeChanged";
                return SelectionTimeRangeChangedEvent;
            })();

            

            

            var ChangeViewportEvent = (function () {
                function ChangeViewportEvent() {
                    this._publisher = new DiagnosticsHub.Publisher([ChangeViewportEvent.EventName]);
                    this._eventAggregator = Microsoft.VisualStudio.DiagnosticsHub.getEventAggregator();
                    this._eventAggregator.addEventListener(ChangeViewportEvent.EventGlobalName, this.forwardChangeViewportEvent.bind(this));
                }
                ChangeViewportEvent.prototype.addEventListener = function (listener) {
                    this._publisher.addEventListener(ChangeViewportEvent.EventName, listener);
                };

                ChangeViewportEvent.prototype.removeEventListener = function (listener) {
                    this._publisher.removeEventListener(ChangeViewportEvent.EventName, listener);
                };

                ChangeViewportEvent.prototype.raiseEvent = function (eventArgs) {
                    var dto = null;

                    if (eventArgs) {
                        dto = {
                            beginH: eventArgs.begin.jsonValue.h,
                            beginL: eventArgs.begin.jsonValue.l,
                            endH: eventArgs.end.jsonValue.h,
                            endL: eventArgs.end.jsonValue.l
                        };
                    }

                    this._eventAggregator.raiseEvent(ChangeViewportEvent.EventGlobalName, dto);
                };

                ChangeViewportEvent.prototype.forwardChangeViewportEvent = function (args) {
                    var eventArgs = null;

                    if (typeof args.beginH !== "undefined" && typeof args.beginL !== "undefined" && typeof args.endH !== "undefined" && typeof args.endL !== "undefined") {
                        eventArgs = new DiagnosticsHub.JsonTimespan(new DiagnosticsHub.BigNumber(args.beginH, args.beginL), new DiagnosticsHub.BigNumber(args.endH, args.endL));
                    }

                    this._publisher.invokeListener(ChangeViewportEvent.EventName, eventArgs);
                };
                ChangeViewportEvent.EventGlobalName = "DiagnosticsHub.EventAggregator.ChangeViewport";
                ChangeViewportEvent.EventName = "DiagnosticsHub.ChangeViewport";
                return ChangeViewportEvent;
            })();

            var JmcEnabledStateChangedEvent = (function () {
                function JmcEnabledStateChangedEvent() {
                    this._publisher = new DiagnosticsHub.Publisher([JmcEnabledStateChangedEvent.EventName]);
                    this._eventAggregator = Microsoft.VisualStudio.DiagnosticsHub.getEventAggregator();
                    this._eventAggregator.addEventListener(JmcEnabledStateChangedEvent.EventGlobalName, this.forwardJmcEnabledStateChangedEvent.bind(this));
                }
                JmcEnabledStateChangedEvent.prototype.addEventListener = function (listener) {
                    this._publisher.addEventListener(JmcEnabledStateChangedEvent.EventName, listener);
                };

                JmcEnabledStateChangedEvent.prototype.removeEventListener = function (listener) {
                    this._publisher.removeEventListener(JmcEnabledStateChangedEvent.EventName, listener);
                };

                JmcEnabledStateChangedEvent.prototype.raiseEvent = function (args) {
                    this._eventAggregator.raiseEvent(JmcEnabledStateChangedEvent.EventGlobalName, args);
                };

                JmcEnabledStateChangedEvent.prototype.forwardJmcEnabledStateChangedEvent = function (args) {
                    this._publisher.invokeListener(JmcEnabledStateChangedEvent.EventName, args);
                };
                JmcEnabledStateChangedEvent.EventGlobalName = "DiagnosticsHub.EventAggregator.JmcEnabledStateChanged";
                JmcEnabledStateChangedEvent.EventName = "DiagnosticsHub.JmcEnabledStateChanged";
                return JmcEnabledStateChangedEvent;
            })();

            var DetailsViewSelectionChangedEvent = (function () {
                function DetailsViewSelectionChangedEvent() {
                    this._publisher = new DiagnosticsHub.Publisher([DetailsViewSelectionChangedEvent.EventName]);
                    this._eventAggregator = Microsoft.VisualStudio.DiagnosticsHub.getEventAggregator();
                    this._eventAggregator.addEventListener(DetailsViewSelectionChangedEvent.EventGlobalName, this.forwardDetailsViewSelectionChangedEvent.bind(this));
                }
                DetailsViewSelectionChangedEvent.prototype.addEventListener = function (listener) {
                    this._publisher.addEventListener(DetailsViewSelectionChangedEvent.EventName, listener);
                };

                DetailsViewSelectionChangedEvent.prototype.removeEventListener = function (listener) {
                    this._publisher.removeEventListener(DetailsViewSelectionChangedEvent.EventName, listener);
                };

                DetailsViewSelectionChangedEvent.prototype.raiseEvent = function (args) {
                    this._eventAggregator.raiseEvent(DetailsViewSelectionChangedEvent.EventGlobalName, args);
                };

                DetailsViewSelectionChangedEvent.prototype.forwardDetailsViewSelectionChangedEvent = function (args) {
                    this._publisher.invokeListener(DetailsViewSelectionChangedEvent.EventName, args);
                };
                DetailsViewSelectionChangedEvent.EventGlobalName = "DiagnosticsHub.EventAggregator.DetailsViewSelectionChangedEvent";
                DetailsViewSelectionChangedEvent.EventName = "DiagnosticsHub.DetailsViewSelectionChangedEvent";
                return DetailsViewSelectionChangedEvent;
            })();

            var DetailsViewReadyEvent = (function () {
                function DetailsViewReadyEvent() {
                    this._publisher = new DiagnosticsHub.Publisher([DetailsViewReadyEvent.EventName]);
                    this._eventAggregator = Microsoft.VisualStudio.DiagnosticsHub.getEventAggregator();
                    this._eventAggregator.addEventListener(DetailsViewReadyEvent.EventGlobalName, this.forwardDetailsViewSelectionChangedEvent.bind(this));
                }
                DetailsViewReadyEvent.prototype.addEventListener = function (listener) {
                    this._publisher.addEventListener(DetailsViewReadyEvent.EventName, listener);
                };

                DetailsViewReadyEvent.prototype.removeEventListener = function (listener) {
                    this._publisher.removeEventListener(DetailsViewReadyEvent.EventName, listener);
                };

                DetailsViewReadyEvent.prototype.raiseEvent = function (args) {
                    this._eventAggregator.raiseEvent(DetailsViewReadyEvent.EventGlobalName, args);
                };

                DetailsViewReadyEvent.prototype.forwardDetailsViewSelectionChangedEvent = function (args) {
                    this._publisher.invokeListener(DetailsViewReadyEvent.EventName, args);
                };
                DetailsViewReadyEvent.EventGlobalName = "DiagnosticsHub.EventAggregator.DetailsViewReadyEvent";
                DetailsViewReadyEvent.EventName = "DiagnosticsHub.DetailsViewReadyEvent";
                return DetailsViewReadyEvent;
            })();

            var ViewEventManager = (function () {
                function ViewEventManager() {
                    this._selectionChanged = new SelectionTimeRangeChangedEvent();
                    this._changeViewport = new ChangeViewportEvent();
                    this._jmcEnabledStateChanged = new JmcEnabledStateChangedEvent();
                    this._detailsViewSelectionChangedEvent = new DetailsViewSelectionChangedEvent();
                    this._detailsViewReady = new DetailsViewReadyEvent();
                }
                Object.defineProperty(ViewEventManager.prototype, "selectionChanged", {
                    get: function () {
                        return this._selectionChanged;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewEventManager.prototype, "changeViewport", {
                    get: function () {
                        return this._changeViewport;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewEventManager.prototype, "jmcEnabledStateChanged", {
                    get: function () {
                        return this._jmcEnabledStateChanged;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewEventManager.prototype, "detailsViewSelectionChanged", {
                    get: function () {
                        return this._detailsViewSelectionChangedEvent;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ViewEventManager.prototype, "detailsViewReady", {
                    get: function () {
                        return this._detailsViewReady;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ViewEventManager;
            })();

            var _viewEventManager = null;

            function getViewEventManager() {
                if (_viewEventManager === null) {
                    _viewEventManager = new ViewEventManager();
                }

                return _viewEventManager;
            }
            DiagnosticsHub.getViewEventManager = getViewEventManager;
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

            var ErrorCodes = (function () {
                function ErrorCodes() {
                }
                ErrorCodes.VSHUB_E_INVALID_REGEX = 0xE111E001;
                return ErrorCodes;
            })();
            DiagnosticsHub.ErrorCodes = ErrorCodes;
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

            var HostController = (function () {
                function HostController(sessionId, controllerId) {
                    this._sessionId = sessionId;
                    this._controllerId = controllerId;
                    this._dataWarehouseRegistryService = new Microsoft.VisualStudio.DiagnosticsHub.Controllers.DataWarehouseRegistryService();
                }
                HostController.prototype.request = function (actionId, requestData) {
                    var _this = this;
                    if (this._host) {
                        return this._host.request(this._controllerId, actionId, this._sessionId, requestData);
                    } else {
                        var isPerfDebugger = this.ensureIsPerformanceDebuggerDocument();
                        var isDataWarehouseInVsHub = this.ensureDataWarehouseInVsHub();
                        return Microsoft.Plugin.Promise.join([isPerfDebugger, isDataWarehouseInVsHub]).then(function (results) {
                            if (results) {
                                var isWebHost = false;
                                results.forEach(function (result) {
                                    isWebHost = isWebHost || result;
                                });

                                _this._host = getHost(isWebHost);
                                return _this._host.request(_this._controllerId, actionId, _this._sessionId, requestData);
                            }
                        });
                    }
                };

                HostController.prototype.requestSync = function (actionId, requestData) {
                    if (!this._host) {
                        this._host = getHost(false);
                    }

                    return this._host.requestSync(this._controllerId, actionId, this._sessionId, requestData);
                };

                HostController.prototype.ensureIsPerformanceDebuggerDocument = function () {
                    if (Microsoft.Plugin.F12) {
                        return Microsoft.Plugin.Promise.wrap(false);
                    } else {
                        return DiagnosticsHub.getCurrentDocument().isPerformanceDebuggerDocument();
                    }
                };

                HostController.prototype.ensureDataWarehouseInVsHub = function () {
                    if (Microsoft.Plugin.F12) {
                        return Microsoft.Plugin.Promise.wrap(false);
                    } else {
                        return this._dataWarehouseRegistryService.isDataWarehouseInVsHub();
                    }
                };
                return HostController;
            })();
            DiagnosticsHub.HostController = HostController;

            var _host = null;

            function getHost(isWebHost) {
                if (!_host) {
                    if (isWebHost) {
                        _host = new DiagnosticsHub.DiagnosticsHubRestWebHost();
                    } else {
                        _host = new DiagnosticsHub.DiagnosticsHubNativeHost(DiagnosticsHub.getLogger());
                    }
                }

                return _host;
            }
        })(VisualStudio.DiagnosticsHub || (VisualStudio.DiagnosticsHub = {}));
        var DiagnosticsHub = VisualStudio.DiagnosticsHub;
    })(Microsoft.VisualStudio || (Microsoft.VisualStudio = {}));
    var VisualStudio = Microsoft.VisualStudio;
})(Microsoft || (Microsoft = {}));

// SIG // Begin signature block
// SIG // MIIa+QYJKoZIhvcNAQcCoIIa6jCCGuYCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFP9w8jWKRmbn
// SIG // LYanqc7eh2qa/lrkoIIVgzCCBMMwggOroAMCAQICEzMA
// SIG // AACampsWwoPa1cIAAAAAAJowDQYJKoZIhvcNAQEFBQAw
// SIG // dzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBMB4XDTE2MDMzMDE5
// SIG // MjEyOVoXDTE3MDYzMDE5MjEyOVowgbMxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xDTALBgNVBAsTBE1PUFIxJzAlBgNVBAsT
// SIG // Hm5DaXBoZXIgRFNFIEVTTjpCMUI3LUY2N0YtRkVDMjEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBAKZGcyHKAK1+KMPlE5szicc4CJIlJq0R/J8UFYJz
// SIG // YmMl8u5Me1+ZqDys5iCAV+aHEnUP3noHraQ8R7DXhYSg
// SIG // Tpdd35govgBRMWpxghNHe/vJe/YXSUkkzhe2TXlHhE1j
// SIG // j+O0JQyknC4q9qi2dcccePDGAKm0jt9MuccG/XAq+I7Q
// SIG // IR6DgWUMnECilK4qJilajEqeW2FMnFSesDzqkidwXk7j
// SIG // J2Li4DZKnPXh/Vs33s9dAcsKdcz83tvYtINUy3uDKYZR
// SIG // ECNHwStxzK+Wzlx8yprFXADBj2rK1JKn2K/rvhWbtKgd
// SIG // xGuEfFh0sDZkj9KCLPgMuSwKVnof6AmHqQbfHNUCAwEA
// SIG // AaOCAQkwggEFMB0GA1UdDgQWBBQmmgbvkXTwOgin21sU
// SIG // 7d0HCiAvCTAfBgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7
// SIG // syuwwzWzDzBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9NaWNyb3NvZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsG
// SIG // AQUFBwEBBEwwSjBIBggrBgEFBQcwAoY8aHR0cDovL3d3
// SIG // dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBBQUAA4IBAQCJehwGFIbD
// SIG // v+5TfA//GKMWAGxUw9KZZvNqxbNTH3/VgV9R8/z6Lqiv
// SIG // 0Y0RH9q3RKNwAhBNsIT2njVXk4PeJqyb4884skOIK8vl
// SIG // V0vWUmtcbTARAu+pUZbB4oK/Z6uaECCEFKny/OromIJS
// SIG // dXwD3txRJK1umXshuqEqLPVjxAE01+WgDEnUCt1uAQux
// SIG // L2lxU/GPEcPl2w0LfSyUhk1nF3nYKHrloO5UvDdy8ZqL
// SIG // 1Hc4YFOvg2ScMl6+Vy6dpeZ78el6NHeRHnRMqsdL59xq
// SIG // 4XlayVog0TOb5ffjo7l67nWYUo/ViOKrtyqsfoqBKRvR
// SIG // cKkPD7NmpVq1jr1cvPdVvPkQMIIE7TCCA9WgAwIBAgIT
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
// SIG // +i+ePy5VFmvJE6P9MYIE4jCCBN4CAQEwgZAweTELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0
// SIG // IENvZGUgU2lnbmluZyBQQ0ECEzMAAAFAlqnucFb+zAcA
// SIG // AQAAAUAwCQYFKw4DAhoFAKCB+zAZBgkqhkiG9w0BCQMx
// SIG // DAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYK
// SIG // KwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQUhQI+/KdR
// SIG // 5hGgu5aLZpU9whPQvpgwgZoGCisGAQQBgjcCAQwxgYsw
// SIG // gYigboBsAEQAaQBhAGcAbgBvAHMAdABpAGMAcwBIAHUA
// SIG // YgBfAGYANwA3ADcAZQAzADgANgAtAGIANwA1ADQALQA0
// SIG // AGMANgAwAC0AOABhADQAMwAtADMANgAzADMANgA1ADUA
// SIG // NQA0ADgAMQAwAC4AagBzoRaAFGh0dHA6Ly9taWNyb3Nv
// SIG // ZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAK/cWQ9mTnvX
// SIG // Eo03U4s43cZhIFnUeRCxE7MQAx62ZR0zwQoU6DpnOOl0
// SIG // mEpdZ/SV1miPE+Ya9E1tE67v2fcMvadk8dovjncNw6AD
// SIG // +mf0gkYD38h+LmvSUzJGF+eQiuqQ+LHmddeBAMDSyow+
// SIG // K0OzI3X61aj5YSjs0MW2AdSHin2G6lhFRF50k6e1PWbb
// SIG // a+l2kYDalhsAzEglwOLWKQLKdyZe47p5HUtR2T7LrZ5N
// SIG // 6SBcJcFOSQfLmt7CpaL9U9u+zWb1tyVlc8qK8j/iKc5O
// SIG // 4eNmGpjIZOdt9MfxDHZ1VHwa2LEYQlh2VgI4o4ZxHHZ0
// SIG // oxSU0aeFX3ibofYVoYP2eFehggIoMIICJAYJKoZIhvcN
// SIG // AQkGMYICFTCCAhECAQEwgY4wdzELMAkGA1UEBhMCVVMx
// SIG // EzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1Jl
// SIG // ZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
// SIG // dGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRpbWUtU3Rh
// SIG // bXAgUENBAhMzAAAAmpqbFsKD2tXCAAAAAACaMAkGBSsO
// SIG // AwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcB
// SIG // MBwGCSqGSIb3DQEJBTEPFw0xNjA5MDcwNDQ3MTJaMCMG
// SIG // CSqGSIb3DQEJBDEWBBTnFPsqG3q8A7eh7zn8jLva2DL2
// SIG // tDANBgkqhkiG9w0BAQUFAASCAQAkqjx+hKwcW7o5azlE
// SIG // RTQJyKvpr/tR3FBEOCQOYsVdWSS7ed83GXCI7/W9itcV
// SIG // cpzuFlvsM6CrOfTAkQyCjIiyIj9yz+6YwX3N7mk7QoLb
// SIG // QyztcMgOl3kJX6erq3v9CUHx8xmbb9cQ/VAsaob/GMgD
// SIG // QmWUsUVaP4z3SwvxDUrWFd65Z0Heu/d7sOQBbTzw6hBq
// SIG // sAn7AAQHNzDc5W/sfw45qk8FMem0HK+rRjCBU7s90px9
// SIG // wCVM6WT8enKl40tDPlJyz36CeqjytnuNEJ0KiWR/S57C
// SIG // WV0Ir4YZvnHz6SjtAuWn7LcaUvd/K1DCTwRF83UFUjQD
// SIG // oEUmbOxn0O5z73l9
// SIG // End signature block
