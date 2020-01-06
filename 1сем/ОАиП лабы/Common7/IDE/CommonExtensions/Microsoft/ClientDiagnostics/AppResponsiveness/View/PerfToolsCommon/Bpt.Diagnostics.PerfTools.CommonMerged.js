//
// Copyright (C) Microsoft. All rights reserved.
//
// <!-- saved from url=(0016)http://localhost -->
// SourceInfoTooltip.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../../Common/templateControl.ts" />
/// <reference path="../SourceInfo.d.ts" />
/// <reference path="../formattingHelpers.ts" />
var Common;
(function (Common) {
    var Controls;
    (function (Controls) {
        var Legacy;
        (function (Legacy) {
            "use strict";
            var SourceInfoTooltip = (function () {
                function SourceInfoTooltip(sourceInfo, name, nameLabelResourceId) {
                    this._rootContainer = document.createElement("div");
                    this._rootContainer.className = "sourceInfoTooltip";
                    if (name && nameLabelResourceId) {
                        this.addDiv("sourceInfoNameLabel", Microsoft.Plugin.Resources.getString(nameLabelResourceId));
                        this.addDiv("sourceInfoName", name);
                    }
                    this.addDiv("sourceInfoFileLabel", Microsoft.Plugin.Resources.getString("SourceInfoFileLabel"));
                    this.addDiv("sourceInfoFile", sourceInfo.source);
                    this.addDiv("sourceInfoLineLabel", Microsoft.Plugin.Resources.getString("SourceInfoLineLabel"));
                    this.addDiv("sourceInfoLine", Common.FormattingHelpers.getDecimalLocaleString(sourceInfo.line, true));
                    this.addDiv("sourceInfoColumnLabel", Microsoft.Plugin.Resources.getString("SourceInfoColumnLabel"));
                    this.addDiv("sourceInfoColumn", Common.FormattingHelpers.getDecimalLocaleString(sourceInfo.column, true));
                }
                Object.defineProperty(SourceInfoTooltip.prototype, "html", {
                    get: function () {
                        return this._rootContainer.outerHTML;
                    },
                    enumerable: true,
                    configurable: true
                });
                SourceInfoTooltip.prototype.addDiv = function (className, textContent) {
                    var div = document.createElement("div");
                    div.className = className;
                    div.textContent = textContent;
                    this._rootContainer.appendChild(div);
                };
                return SourceInfoTooltip;
            })();
            Legacy.SourceInfoTooltip = SourceInfoTooltip;
        })(Legacy = Controls.Legacy || (Controls.Legacy = {}));
    })(Controls = Common.Controls || (Common.Controls = {}));
})(Common || (Common = {}));
//# sourceMappingURL=file:///f:/binaries.x86ret/bin/i386/ClientDiagnostics/AppResponsiveness/ViewCommon/Bpt.Diagnostics.PerfTools.Common/controls/SourceInfoTooltip.js.map

// enumHelper.ts
// 
// Copyright (C) Microsoft. All rights reserved.
//
var Common;
(function (Common) {
    "use strict";
    var Enum = (function () {
        function Enum() {
        }
        Enum.GetName = function (enumType, value) {
            var result;
            if (enumType) {
                for (var enumKey in enumType) {
                    if (enumType.hasOwnProperty(enumKey)) {
                        var enumValue = enumType[enumKey];
                        if (enumValue === value) {
                            result = enumKey;
                            break;
                        }
                    }
                }
            }
            if (!result) {
                result = value.toString();
            }
            return result;
        };
        Enum.Parse = function (enumType, name, ignoreCase) {
            if (ignoreCase === void 0) { ignoreCase = true; }
            var result;
            if (enumType) {
                if (ignoreCase) {
                    name = name.toLowerCase();
                }
                for (var enumKey in enumType) {
                    if (enumType.hasOwnProperty(enumKey)) {
                        var compareAginst = enumKey.toString();
                        if (ignoreCase) {
                            compareAginst = compareAginst.toLowerCase();
                        }
                        if (name === compareAginst) {
                            result = enumType[enumKey];
                            break;
                        }
                    }
                }
            }
            return result;
        };
        Enum.GetValues = function (enumType) {
            var result = [];
            if (enumType) {
                for (var enumKey in enumType) {
                    if (enumType.hasOwnProperty(enumKey)) {
                        var enumValue = enumType[enumKey];
                        if (typeof enumValue === "number") {
                            result.push(enumValue);
                        }
                    }
                }
            }
            return result;
        };
        return Enum;
    })();
    Common.Enum = Enum;
})(Common || (Common = {}));
//# sourceMappingURL=file:///f:/binaries.x86ret/bin/i386/ClientDiagnostics/AppResponsiveness/ViewCommon/Bpt.Diagnostics.PerfTools.Common/enumHelper.js.map

// eventHelper.ts
// 
// Copyright (C) Microsoft. All rights reserved.
//
var Common;
(function (Common) {
    "use strict";
    /**
     * List of supported events.
     */
    var Publisher = (function () {
        /**
         * constructor
         * @param events List of supported events.
         */
        function Publisher(events) {
            /**
             * List of all registered events.
             */
            this._events = {};
            this._listeners = {};
            if (events && events.length > 0) {
                for (var i = 0; i < events.length; i++) {
                    var type = events[i];
                    if (type) {
                        this._events[type] = type;
                    }
                }
            }
            else {
                throw Error("Events are null or empty.");
            }
        }
        /**
         * Add event Listener
         * @param eventType Event type.
         * @param func Callback function.
         */
        Publisher.prototype.addEventListener = function (eventType, func) {
            if (eventType && func) {
                var type = this._events[eventType];
                if (type) {
                    var callbacks = this._listeners[type] ? this._listeners[type] : this._listeners[type] = [];
                    callbacks.push(func);
                }
            }
        };
        /**
         * Remove event Listener
         * @param eventType Event type.
         * @param func Callback function.
         */
        Publisher.prototype.removeEventListener = function (eventType, func) {
            if (eventType && func) {
                var callbacks = this._listeners[eventType];
                if (callbacks) {
                    for (var i = 0; i < callbacks.length; i++) {
                        if (func === callbacks[i]) {
                            callbacks.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        };
        /**
         * Invoke event Listener
         * @param args Event argument.
         */
        Publisher.prototype.invokeListener = function (args) {
            if (args.type) {
                var callbacks = this._listeners[args.type];
                if (callbacks) {
                    for (var i = 0; i < callbacks.length; i++) {
                        var func = callbacks[i];
                        if (func) {
                            func(args);
                        }
                    }
                }
            }
        };
        return Publisher;
    })();
    Common.Publisher = Publisher;
})(Common || (Common = {}));
//# sourceMappingURL=file:///f:/binaries.x86ret/bin/i386/ClientDiagnostics/AppResponsiveness/ViewCommon/Bpt.Diagnostics.PerfTools.Common/eventHelper.js.map

// formattingHelpers.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="..\..\..\Common\Script\Hub\Plugin.redirect.d.ts" />
var Common;
(function (Common) {
    "use strict";
    var FormattingHelpers = (function () {
        function FormattingHelpers() {
        }
        FormattingHelpers.getDecimalLocaleString = function (numberToConvert, includeGroupSeparators) {
            var numberString = Math.abs(numberToConvert).toString();
            // Get any exponent
            var split = numberString.split(/e/i);
            numberString = split[0];
            var exponent = (split.length > 1 ? parseInt(split[1], 10) : 0);
            // Get any decimal place
            split = numberString.split(".");
            numberString = (numberToConvert < 0 ? "-" : "") + split[0];
            // Get whole value
            var right = split.length > 1 ? split[1] : "";
            if (exponent > 0) {
                right = FormattingHelpers.zeroPad(right, exponent, false);
                numberString += right.slice(0, exponent);
                right = right.substr(exponent);
            }
            else if (exponent < 0) {
                exponent = -exponent;
                numberString = FormattingHelpers.zeroPad(numberString, exponent + 1, true);
                right = numberString.slice(-exponent, numberString.length) + right;
                numberString = numberString.slice(0, -exponent);
            }
            // Number format
            var nf = Microsoft.Plugin.Culture.NumberFormat;
            if (!nf) {
                nf = { numberDecimalSeparator: ".", numberGroupSizes: [3], numberGroupSeparator: "," };
            }
            if (right.length > 0) {
                right = nf.numberDecimalSeparator + right;
            }
            // Grouping (e.g. 10,000)
            if (includeGroupSeparators === true) {
                var groupSizes = nf.numberGroupSizes, sep = nf.numberGroupSeparator, curSize = groupSizes[0], curGroupIndex = 1, stringIndex = numberString.length - 1, ret = "";
                while (stringIndex >= 0) {
                    if (curSize === 0 || curSize > stringIndex) {
                        if (ret.length > 0) {
                            return numberString.slice(0, stringIndex + 1) + sep + ret + right;
                        }
                        else {
                            return numberString.slice(0, stringIndex + 1) + right;
                        }
                    }
                    if (ret.length > 0) {
                        ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + sep + ret;
                    }
                    else {
                        ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1);
                    }
                    stringIndex -= curSize;
                    if (curGroupIndex < groupSizes.length) {
                        curSize = groupSizes[curGroupIndex];
                        curGroupIndex++;
                    }
                }
                return numberString.slice(0, stringIndex + 1) + sep + ret + right;
            }
            else {
                return numberString + right;
            }
        };
        FormattingHelpers.stripNewLine = function (text) {
            return text.replace(/[\r?\n]/g, "");
        };
        FormattingHelpers.zeroPad = function (stringToPad, newLength, padLeft) {
            var zeros = [];
            for (var i = stringToPad.length; i < newLength; i++) {
                zeros.push("0");
            }
            return (padLeft ? (zeros.join("") + stringToPad) : (stringToPad + zeros.join("")));
        };
        return FormattingHelpers;
    })();
    Common.FormattingHelpers = FormattingHelpers;
})(Common || (Common = {}));
//# sourceMappingURL=file:///f:/binaries.x86ret/bin/i386/ClientDiagnostics/AppResponsiveness/ViewCommon/Bpt.Diagnostics.PerfTools.Common/formattingHelpers.js.map

// TokenExtractor.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
var Common;
(function (Common) {
    "use strict";
    (function (TokenType) {
        TokenType[TokenType["General"] = 0] = "General";
        TokenType[TokenType["String"] = 1] = "String";
        TokenType[TokenType["Number"] = 2] = "Number";
        TokenType[TokenType["Html"] = 3] = "Html";
        TokenType[TokenType["HtmlTagName"] = 4] = "HtmlTagName";
        TokenType[TokenType["HtmlTagDelimiter"] = 5] = "HtmlTagDelimiter";
        TokenType[TokenType["HtmlAttributeName"] = 6] = "HtmlAttributeName";
        TokenType[TokenType["HtmlAttributeValue"] = 7] = "HtmlAttributeValue";
        TokenType[TokenType["EqualOperator"] = 8] = "EqualOperator";
    })(Common.TokenType || (Common.TokenType = {}));
    var TokenType = Common.TokenType;
    (function (HtmlRegexGroup) {
        HtmlRegexGroup[HtmlRegexGroup["PreHtmlString"] = 1] = "PreHtmlString";
        HtmlRegexGroup[HtmlRegexGroup["StartDelimiter"] = 2] = "StartDelimiter";
        HtmlRegexGroup[HtmlRegexGroup["TagName"] = 3] = "TagName";
        HtmlRegexGroup[HtmlRegexGroup["IdAttribute"] = 4] = "IdAttribute";
        HtmlRegexGroup[HtmlRegexGroup["IdEqualToToken"] = 5] = "IdEqualToToken";
        HtmlRegexGroup[HtmlRegexGroup["IdAttributeValue"] = 6] = "IdAttributeValue";
        HtmlRegexGroup[HtmlRegexGroup["ClassAttribute"] = 7] = "ClassAttribute";
        HtmlRegexGroup[HtmlRegexGroup["ClassEqualToToken"] = 8] = "ClassEqualToToken";
        HtmlRegexGroup[HtmlRegexGroup["ClassAttributeValue"] = 9] = "ClassAttributeValue";
        HtmlRegexGroup[HtmlRegexGroup["SrcAttribute"] = 10] = "SrcAttribute";
        HtmlRegexGroup[HtmlRegexGroup["SrcEqualToToken"] = 11] = "SrcEqualToToken";
        HtmlRegexGroup[HtmlRegexGroup["SrcAttributeValue"] = 12] = "SrcAttributeValue";
        HtmlRegexGroup[HtmlRegexGroup["EndDelimiter"] = 13] = "EndDelimiter";
        HtmlRegexGroup[HtmlRegexGroup["PostHtmlString"] = 14] = "PostHtmlString";
    })(Common.HtmlRegexGroup || (Common.HtmlRegexGroup = {}));
    var HtmlRegexGroup = Common.HtmlRegexGroup;
    (function (AssignmentRegexGroup) {
        AssignmentRegexGroup[AssignmentRegexGroup["LeftHandSide"] = 1] = "LeftHandSide";
        AssignmentRegexGroup[AssignmentRegexGroup["EqualToOperator"] = 2] = "EqualToOperator";
        AssignmentRegexGroup[AssignmentRegexGroup["RightHandSide"] = 3] = "RightHandSide";
        AssignmentRegexGroup[AssignmentRegexGroup["PostString"] = 4] = "PostString";
    })(Common.AssignmentRegexGroup || (Common.AssignmentRegexGroup = {}));
    var AssignmentRegexGroup = Common.AssignmentRegexGroup;
    var TokenExtractor = (function () {
        function TokenExtractor() {
        }
        TokenExtractor.getHtmlTokens = function (text) {
            var tokenTypeMap = [];
            if (!text) {
                return tokenTypeMap;
            }
            var tokens = TokenExtractor.HTML_REGEX.exec(text);
            if (tokens) {
                // First token - tokens[0] is the entire matched string, skip it.
                if (tokens[1 /* PreHtmlString */]) {
                    tokenTypeMap.push({ type: 0 /* General */, value: tokens[1 /* PreHtmlString */].toString() });
                }
                if (tokens[2 /* StartDelimiter */]) {
                    tokenTypeMap.push({ type: 5 /* HtmlTagDelimiter */, value: tokens[2 /* StartDelimiter */].toString() });
                }
                if (tokens[3 /* TagName */]) {
                    tokenTypeMap.push({ type: 4 /* HtmlTagName */, value: tokens[3 /* TagName */].toString() });
                }
                if (tokens[4 /* IdAttribute */]) {
                    tokenTypeMap.push({ type: 6 /* HtmlAttributeName */, value: tokens[4 /* IdAttribute */].toString() });
                }
                if (tokens[5 /* IdEqualToToken */]) {
                    tokenTypeMap.push({ type: 8 /* EqualOperator */, value: tokens[5 /* IdEqualToToken */].toString() });
                }
                if (tokens[6 /* IdAttributeValue */] !== undefined) {
                    tokenTypeMap.push({ type: 7 /* HtmlAttributeValue */, value: tokens[6 /* IdAttributeValue */].toString() });
                }
                if (tokens[7 /* ClassAttribute */]) {
                    tokenTypeMap.push({ type: 6 /* HtmlAttributeName */, value: tokens[7 /* ClassAttribute */].toString() });
                }
                if (tokens[8 /* ClassEqualToToken */]) {
                    tokenTypeMap.push({ type: 8 /* EqualOperator */, value: tokens[8 /* ClassEqualToToken */].toString() });
                }
                if (tokens[9 /* ClassAttributeValue */] !== undefined) {
                    tokenTypeMap.push({ type: 7 /* HtmlAttributeValue */, value: tokens[9 /* ClassAttributeValue */].toString() });
                }
                if (tokens[10 /* SrcAttribute */]) {
                    tokenTypeMap.push({ type: 6 /* HtmlAttributeName */, value: tokens[10 /* SrcAttribute */].toString() });
                }
                if (tokens[11 /* SrcEqualToToken */]) {
                    tokenTypeMap.push({ type: 8 /* EqualOperator */, value: tokens[11 /* SrcEqualToToken */].toString() });
                }
                if (tokens[12 /* SrcAttributeValue */] !== undefined) {
                    tokenTypeMap.push({ type: 7 /* HtmlAttributeValue */, value: tokens[12 /* SrcAttributeValue */].toString() });
                }
                if (tokens[13 /* EndDelimiter */]) {
                    tokenTypeMap.push({ type: 5 /* HtmlTagDelimiter */, value: tokens[13 /* EndDelimiter */].toString() });
                }
                if (tokens[14 /* PostHtmlString */]) {
                    tokenTypeMap.push({ type: 0 /* General */, value: tokens[14 /* PostHtmlString */].toString() });
                }
            }
            else {
                // If for some reason regex fails just mark it as general token so that the object doesn't go missing
                tokenTypeMap.push({ type: 0 /* General */, value: text });
            }
            return tokenTypeMap;
        };
        TokenExtractor.getStringTokens = function (text) {
            var tokenTypeMap = [];
            if (!text) {
                return tokenTypeMap;
            }
            var tokens = TokenExtractor.STRING_REGEX.exec(text);
            if (tokens) {
                if (tokens[1 /* LeftHandSide */]) {
                    tokenTypeMap.push({ type: 0 /* General */, value: tokens[1 /* LeftHandSide */].toString() });
                }
                if (tokens[2 /* EqualToOperator */]) {
                    tokenTypeMap.push({ type: 0 /* General */, value: tokens[2 /* EqualToOperator */].toString() });
                }
                if (tokens[3 /* RightHandSide */]) {
                    tokenTypeMap.push({ type: 1 /* String */, value: tokens[3 /* RightHandSide */].toString() });
                }
                if (tokens[4 /* PostString */]) {
                    tokenTypeMap.push({ type: 0 /* General */, value: tokens[4 /* PostString */].toString() });
                }
            }
            else {
                tokenTypeMap.push({ type: 0 /* General */, value: text });
            }
            return tokenTypeMap;
        };
        TokenExtractor.getNumberTokens = function (text) {
            var tokenTypeMap = [];
            if (!text) {
                return tokenTypeMap;
            }
            var tokens = TokenExtractor.NUMBER_REGEX.exec(text);
            if (tokens) {
                if (tokens[1 /* LeftHandSide */]) {
                    tokenTypeMap.push({ type: 0 /* General */, value: tokens[1 /* LeftHandSide */].toString() });
                }
                if (tokens[2 /* EqualToOperator */]) {
                    tokenTypeMap.push({ type: 0 /* General */, value: tokens[2 /* EqualToOperator */].toString() });
                }
                if (tokens[3 /* RightHandSide */]) {
                    tokenTypeMap.push({ type: 2 /* Number */, value: tokens[3 /* RightHandSide */].toString() });
                }
                if (tokens[4 /* PostString */]) {
                    tokenTypeMap.push({ type: 0 /* General */, value: tokens[4 /* PostString */].toString() });
                }
            }
            else {
                tokenTypeMap.push({ type: 0 /* General */, value: text });
            }
            return tokenTypeMap;
        };
        TokenExtractor.getCssClass = function (tokenType) {
            switch (tokenType) {
                case 1 /* String */:
                    return "valueStringToken-String";
                case 2 /* Number */:
                    return "valueStringToken-Number";
                case 4 /* HtmlTagName */:
                    return "perftools-Html-Element-Tag";
                case 6 /* HtmlAttributeName */:
                    return "perftools-Html-Attribute";
                case 7 /* HtmlAttributeValue */:
                    return "perftools-Html-Value";
                case 5 /* HtmlTagDelimiter */:
                    return "perftools-Html-Tag";
                case 8 /* EqualOperator */:
                    return "perftools-Html-Operator";
                default:
                    return "";
            }
        };
        TokenExtractor.isHtmlExpression = function (text) {
            return TokenExtractor.GENERAL_HTML_REGEX.test(text);
        };
        TokenExtractor.isStringExpression = function (text) {
            return TokenExtractor.STRING_REGEX.test(text);
        };
        TokenExtractor.GENERAL_HTML_REGEX = /^<.*>/;
        TokenExtractor.HTML_REGEX = /(^.*)?(<)([^\s]+)(?:( id)(=)(\".*?\"))?(?:( class)(=)(\".*?\"))?(?:( src)(=)(\".*?\"))?(>)(.*$)?/;
        TokenExtractor.NUMBER_REGEX = /(.*)?(=)( ?-?\d+(?:.\d+)?)(.*$)?/;
        TokenExtractor.STRING_REGEX = /(^.*?)(=)( ?\".*\")(.*$)?/;
        return TokenExtractor;
    })();
    Common.TokenExtractor = TokenExtractor;
})(Common || (Common = {}));
//# sourceMappingURL=file:///f:/binaries.x86ret/bin/i386/ClientDiagnostics/AppResponsiveness/ViewCommon/Bpt.Diagnostics.PerfTools.Common/TokenExtractor.js.map

// hostShell.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="..\..\..\Common\Script\Hub\Plugin.redirect.d.ts" />
var Common;
(function (Common) {
    var Extensions;
    (function (Extensions) {
        "use strict";
        //
        // HostDisplayProxy provides access to the Display which is implemented in the host
        //
        var HostShellProxy = (function () {
            function HostShellProxy() {
                this._hostShellProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("Microsoft.VisualStudio.WebClient.Diagnostics.PerformanceToolHost.Package.Extensions.Core.HostShell", {}, true);
            }
            HostShellProxy.prototype.setStatusBarText = function (text, highlight) {
                return this._hostShellProxy._call("setStatusBarText", text, highlight || false);
            };
            return HostShellProxy;
        })();
        Extensions.HostShellProxy = HostShellProxy;
        //
        // LocalDisplay implements a local display object without the need to use the host
        //
        var LocalHostShell = (function () {
            function LocalHostShell() {
            }
            LocalHostShell.prototype.setStatusBarText = function (statusText, highlight) {
                return Microsoft.Plugin.Promise.as(null);
            };
            return LocalHostShell;
        })();
        Extensions.LocalHostShell = LocalHostShell;
    })(Extensions = Common.Extensions || (Common.Extensions = {}));
})(Common || (Common = {}));
//# sourceMappingURL=file:///f:/binaries.x86ret/bin/i386/ClientDiagnostics/AppResponsiveness/ViewCommon/Bpt.Diagnostics.PerfTools.Common/hostShell.js.map

// Notifications.ts
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="..\..\..\Common\Script\Hub\Plugin.redirect.d.ts" />
"use strict";
var Notifications = (function () {
    function Notifications() {
    }
    Object.defineProperty(Notifications, "isTestMode", {
        get: function () {
            return window["TestMode"];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Notifications, "notifications", {
        get: function () {
            if (!Notifications._notifications) {
                Notifications._notifications = new Microsoft.Plugin.Utilities.EventManager();
            }
            return Notifications._notifications;
        },
        enumerable: true,
        configurable: true
    });
    Notifications.subscribe = function (type, listener) {
        if (Notifications.isTestMode) {
            Notifications.notifications.addEventListener(type, listener);
        }
    };
    Notifications.unsubscribe = function (type, listener) {
        if (Notifications.isTestMode) {
            Notifications.notifications.removeEventListener(type, listener);
        }
    };
    Notifications.subscribeOnce = function (type, listener) {
        if (Notifications.isTestMode) {
            function onNotify() {
                Notifications.unsubscribe(type, onNotify);
                listener.apply(this, arguments);
            }
            Notifications.subscribe(type, onNotify);
        }
    };
    Notifications.notify = function (type, details) {
        if (Notifications.isTestMode) {
            Notifications.notifications.dispatchEvent(type, details);
        }
    };
    return Notifications;
})();
//# sourceMappingURL=file:///f:/binaries.x86ret/bin/i386/ClientDiagnostics/AppResponsiveness/ViewCommon/Bpt.Diagnostics.PerfTools.Common/Notifications.js.map

// Constants.ts
//
// Copyright (C) Microsoft. All rights reserved.
//
var Common;
(function (Common) {
    "use strict";
    var Constants = (function () {
        function Constants() {
        }
        Constants.E_ABORT = -2147467260; // 0x80004004
        Constants.MINIMUM_REQUIRED_DOCUMENT_MODE = 10;
        Constants.MEMORY_ANALYZER_SNAPSHOT_RESOURCE_TYPE = "MemoryAnalyzer.Resource.Snapshot";
        Constants.MEMORY_ANALYZER_SNAPSHOT_ROOT_PATH = "%temp%\\Microsoft\\F12\\perftools\\memory\\";
        Constants.MEMORY_ANALYZER_TOOL_GUID = "BE2D5223-40F7-4428-A9A0-AF888725C1FB";
        Constants.UI_RESPONSIVENESS_TOOL_GUID = "{0615D892-30B0-4ADA-AFAB-93BFE13D9538}";
        return Constants;
    })();
    Common.Constants = Constants;
})(Common || (Common = {}));
//# sourceMappingURL=file:///f:/binaries.x86ret/bin/i386/ClientDiagnostics/AppResponsiveness/ViewCommon/Bpt.Diagnostics.PerfTools.Common/Constants.js.map


// SIG // Begin signature block
// SIG // MIIa3AYJKoZIhvcNAQcCoIIazTCCGskCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFPTA7W2wiuor
// SIG // TpSEKshRd8dv4oCDoIIVgzCCBMMwggOroAMCAQICEzMA
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
// SIG // +i+ePy5VFmvJE6P9MYIExTCCBMECAQEwgZAweTELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0
// SIG // IENvZGUgU2lnbmluZyBQQ0ECEzMAAAFAlqnucFb+zAcA
// SIG // AQAAAUAwCQYFKw4DAhoFAKCB3jAZBgkqhkiG9w0BCQMx
// SIG // DAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYK
// SIG // KwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQUZi45W1Kf
// SIG // xIYxHms/bY3a4WfDCAEwfgYKKwYBBAGCNwIBDDFwMG6g
// SIG // VIBSAEIAcAB0AC4ARABpAGEAZwBuAG8AcwB0AGkAYwBz
// SIG // AC4AUABlAHIAZgBUAG8AbwBsAHMALgBDAG8AbQBtAG8A
// SIG // bgBNAGUAcgBnAGUAZAAuAGoAc6EWgBRodHRwOi8vbWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAXzpyi
// SIG // 7/x63Iu22Y8AdEAoqHoVmONznQ6hQHcqP/jxOfXwU9gn
// SIG // 9IJmJ6DTgqu6n5V7kjv4DoEqxy2hK6MMO7P91zkbyzaI
// SIG // Akxumztpyzaz+KT4iiH0SRd4RRnbFGZUIVuCgtjjefiN
// SIG // i3kZKwjGeXQkcU34Bg77HdS/3R8x568Ffz31m5pW/rSL
// SIG // xQ8E0P3xy2nQOLCYKsEsPLar/FL3x08F8rwGQhfynERx
// SIG // OC38itnusZJbVAOPOKx63th1VzPlQvhEMK7R1UcWn5MR
// SIG // Y8AuGdlyYJnoAEI13rkbZqamBtM8c5aRTXouxLlaESWS
// SIG // Wh+dxwtj3ppi2uwzeJ5+J1qnIUoJoYICKDCCAiQGCSqG
// SIG // SIb3DQEJBjGCAhUwggIRAgEBMIGOMHcxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFBDQQITMwAAAJvgdDfLPU2NLgAAAAAAmzAJ
// SIG // BgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3
// SIG // DQEHATAcBgkqhkiG9w0BCQUxDxcNMTYwOTA3MDQ0NzQ0
// SIG // WjAjBgkqhkiG9w0BCQQxFgQUEvAGXcpls5Wqf0xatpG9
// SIG // oIVWQf4wDQYJKoZIhvcNAQEFBQAEggEAX63yKg6Bw5F4
// SIG // 4HiO/MJrxMzfVHupJfzXTJpEYD4NkXTuNlIg47K52Cei
// SIG // DEvUggSH87/OlUemb4r/1wF4eWJZuNnRU7qUKxACYs3H
// SIG // udHoorBTINBUuA9z/FpWFNEKGsGNuzWfQtONKGuL5fPx
// SIG // w4Qc1tsxPinQ0zpZP0Xrz/512nkJeuW9i+xAyFQt0sV3
// SIG // 4+vnrVUu59JepdZsZUenw3LQSSOn/1gtonW2MnUTgrlB
// SIG // qSX+1S6PCA5CHUDE0F6AfYqooWRZGHdphNjYQjIfHvTM
// SIG // 705jkF/DG63Dq+XwOz3ECUmuxmJXAyQFUOhg7T2xPSH3
// SIG // iC5aDW58CZxUL6JuSKx9cg==
// SIG // End signature block
