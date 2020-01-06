

//
// extrude.js
//

//
// distance and repeat tool properties
//
var extrudeDistance = 0;
var extrudeRepeat = 1;

//
// we store the tool properties on our command data element
//
var commandData = services.commands.getCommandData("Extrude");
var toolProps;

var hadDistance = commandData.hasTrait("ExtrudeDistance");
var distanceTrait = commandData.getOrCreateTrait("ExtrudeDistance", "float", 0);
if (!hadDistance) {
    // we need to set a default for distance
    distanceTrait.value = 1;
}

//
// special handling for first time access.. we init with default values
//
var hadRepeat = commandData.hasTrait("ExtrudeRepeat");
var repeatTrait = commandData.getOrCreateTrait("ExtrudeRepeat", "float", 0);
if (!hadRepeat) {
    // we didn't have the repeat trait, so set to default value of 1
    repeatTrait.value = 1;
}

//
// store the values from traits into locals
//
extrudeDistance = distanceTrait.value;
extrudeRepeat = repeatTrait.value;

// set the tool props
document.toolProps = commandData;
document.refreshToolPropertyWindow();

function extrude(distance, repeat, geom, polyIndex) {

    var polygonPointCount = geom.getPolygonPointCount(polyIndex);
    if (polygonPointCount < 3) {
        return;
    }

    if (repeat == 0) {
        return;
    }

    var extrudeDir = geom.computePolygonNormal(polyIndex);

    var materialIndex = geom.getPolygonMaterialIndex(polyIndex);

    // this is our starting index for new points
    var newPointStart = geom.pointCount;
    var currentPoint = newPointStart;

    // we gather all the point indices for use when creating polygons
    var pointIndices = new Array();
    for (var i = 0; i < polygonPointCount; i++) {
        var idx = geom.getPolygonPoint(polyIndex, i);
        pointIndices.push(idx);
    }

    // first duplicate the points in the geometry (without adding polygon)
    for (var j = 0; j < repeat; j++) {
        for (var i = 0; i < polygonPointCount; i++) {

            var point = geom.getPointOnPolygon(polyIndex, i);
            point[0] += distance * (j+1) * extrudeDir[0];
            point[1] += distance * (j+1) * extrudeDir[1];
            point[2] += distance * (j+1) * extrudeDir[2];

            geom.addPoints(point, 1);

            pointIndices.push(currentPoint);
            currentPoint++;
        }
    }

    // now create a new polygon
    var newPolyIndex = geom.polygonCount;
    geom.addPolygon(materialIndex);

    var IndexingModePerPointOnPolygon = 3;
    var addTextureCoords = false;

    if (geom.textureCoordinateIndexingMode == IndexingModePerPointOnPolygon)
    {
        addTextureCoords = true;
    }

    // add points to new polygon.
    var newPolyPointStart = newPointStart + (repeat - 1) * polygonPointCount;
    for (var i = 0; i < polygonPointCount; i++) {
        geom.addPolygonPoint(newPolyIndex, newPolyPointStart + i);

        if (addTextureCoords) {
            var texCoord = geom.getTextureCoordinateOnPolygon(polyIndex, i);
            geom.addTextureCoordinates(texCoord, 1);
        }
    }

    // for each segement (we repeat)
    for (var j = 0; j < repeat; j++) {

        // for each edge
        for (var i = 0; i < polygonPointCount; i++) {

            var p0 = i;
            var p1 = i + 1;
            if (p1 >= polygonPointCount) {
                p1 = 0;
            }

            // points i and i + 1 form an edge

            // add a poly containing this edge, edges from each point to the
            // newly duplicted points, and the new edge between the 2 associated duped points
            var thisPolyIndex = geom.polygonCount;
            geom.addPolygon(materialIndex);

            var poly0PointStart = j * polygonPointCount;
            var poly1PointStart = (j + 1) * polygonPointCount;

            var i0 = pointIndices[poly0PointStart + p0];
            var i1 = pointIndices[poly0PointStart + p1];
            var i2 = pointIndices[poly1PointStart + p1];
            var i3 = pointIndices[poly1PointStart + p0];

            geom.addPolygonPoint(thisPolyIndex, i0);
            geom.addPolygonPoint(thisPolyIndex, i1);
            geom.addPolygonPoint(thisPolyIndex, i2);
            geom.addPolygonPoint(thisPolyIndex, i3);

            if (addTextureCoords) {
                var texCoord0 = [0, 0, 1, 0, 1, 1, 0, 1];
                geom.addTextureCoordinates(texCoord0, 4);
            }
        }
    }

    return newPolyIndex;
}

///////////////////////////////////////////////////////////////////////////////
//
// helper to get a designer property as a bool
//
///////////////////////////////////////////////////////////////////////////////
function getDesignerPropAsBool(tname) {
    if (document.designerProps.hasTrait(tname))
        return document.designerProps.getTrait(tname).value;

    return false;
}

function getSelectionMode() {
    if (getDesignerPropAsBool("usePivot"))
        return 0; // default to object mode when using pivot
    if (document.designerProps.hasTrait("SelectionMode"))
        return document.designerProps.getTrait("SelectionMode").value;
    return 0;
}


// find the mesh child
function findFirstChildMeshElement(parent)
{
    // find the mesh child
    for (var i = 0; i < parent.childCount; i++) {

        // get child and its materials
        var child = parent.getChild(i);
        if (child.typeId == "Microsoft.VisualStudio.3D.Mesh") {
            return child;
        }
    }
    return null;
}

function UndoableItem(dist, repeat, collElem, meshElem) {
    this._extrudeDistance = dist;
    this._extrudeRepeat = repeat;

    var clonedColl = collElem.clone();
    this._collectionElem = clonedColl;
    this._polyCollection = clonedColl.behavior;
    this._meshElem = meshElem;
    this._mesh = meshElem.behavior;

    var geom = this._meshElem.getTrait("Geometry").value;
    this._restoreGeom = geom.clone();

    this.getName = function () {
        var IDS_MreUndoExtrude = 146;
        return services.strings.getStringFromId(IDS_MreUndoExtrude);
    }

    this.onDo = function () {

        var geom = this._meshElem.getTrait("Geometry").value;

        var polysToDelete = new Array();
        var polysToSelect = new Array();

        // extrude
        var polyCount = this._polyCollection.getPolygonCount();
        for (var i = 0; i < polyCount; i++) {
            var polyIndex = this._polyCollection.getPolygon(i);
            var newPoly = extrude(this._extrudeDistance, this._extrudeRepeat, geom, polyIndex);

            // services.debug.trace("[Extrude] extruding poly index " + polyIndex);
            // services.debug.trace("[Extrude] adding poly index " + newPoly);

            polysToSelect.push(newPoly);
            polysToDelete.push(polyIndex);
        }

        function sortNumberDescending(a, b) {
            return b - a;
        }

        // delete the old selection
        polysToDelete.sort(sortNumberDescending);

        var numDeletedPolys = polysToDelete.length;

        for (var p = 0; p < polysToDelete.length; p++) {

            // services.debug.trace("[Extrude] removing poly index " + polyIndex);

            geom.removePolygon(polysToDelete[p]);
        }

        var newCollection = this._collectionElem.clone();
        var newPolyCollBeh = newCollection.behavior;

        newPolyCollBeh.clear();

        // shift polygon indices
        for (var p = 0; p < polysToSelect.length; p++) {
            var indexToSelect = polysToSelect[p] - numDeletedPolys;

            // services.debug.trace("[Extrude] selecting poly index " + indexToSelect);

            newPolyCollBeh.addPolygon(indexToSelect);
        }

        this._mesh.selectedObjects = newCollection;
        this._mesh.recomputeCachedGeometry();
    }

    this.onUndo = function () {
        var geom = this._meshElem.getTrait("Geometry").value;
        geom.copyFrom(this._restoreGeom);

        this._mesh.selectedObjects = this._collectionElem;

        this._mesh.recomputeCachedGeometry();
    }
}


if (extrudeRepeat != 0) {

    var selectedElement = document.selectedElement;
    var selectionMode = getSelectionMode();

    // get the poly collection
    var polyCollection = null;
    var mesh = null;
    var meshElem = null;
    var collElem = null;
    if (selectedElement != null) {
        if (selectionMode == 1) {
            meshElem = findFirstChildMeshElement(selectedElement);
            if (meshElem != null) {
                mesh = meshElem.behavior;

                // polygon selection mode
                collElem = mesh.selectedObjects;
                if (collElem != null) {
                    polyCollection = collElem.behavior;
                }
            }
        }
    }

    if (polyCollection != null && collElem.typeId == "PolygonCollection") {
        var undoableItem = new UndoableItem(extrudeDistance, extrudeRepeat, collElem, meshElem);
        undoableItem.onDo();
        services.undoService.addUndoableItem(undoableItem);
    }
}

// SIG // Begin signature block
// SIG // MIIangYJKoZIhvcNAQcCoIIajzCCGosCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFCNRqJ+T4O7E
// SIG // YPczgxEgEJfi686yoIIVgzCCBMMwggOroAMCAQICEzMA
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
// SIG // +i+ePy5VFmvJE6P9MYIEhzCCBIMCAQEwgZAweTELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0
// SIG // IENvZGUgU2lnbmluZyBQQ0ECEzMAAAFAlqnucFb+zAcA
// SIG // AQAAAUAwCQYFKw4DAhoFAKCBoDAZBgkqhkiG9w0BCQMx
// SIG // DAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYK
// SIG // KwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQUTpi46zc0
// SIG // 09MoL+Yjs0W/O4oOSkgwQAYKKwYBBAGCNwIBDDEyMDCg
// SIG // FoAUAEUAeAB0AHIAdQBkAGUALgBqAHOhFoAUaHR0cDov
// SIG // L21pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // FDYHFpCL8+tS/017bjGV5Gh24HPnTEpzlCGl635d4E2F
// SIG // 1fkBo5OQNfEpnSKg15miZfnCL3B7KP7oa7ro2lp1k5dm
// SIG // /bOhnNIRlP3t29Klo70f3VUwz8eVk74PW1hLkLavvr3f
// SIG // IR0wa2Se4Bxr3ScWZgymZq1XTFduoOIntKoTeRJ28QYZ
// SIG // W6BfKoettfo+J3BfKWqXUT9dDuw4pf3fElWn53PzhPGL
// SIG // SkUvydVeV5zndxGOke7ybMTJ0T0PJT2BBRGxCqBtIQbY
// SIG // FNffuV7J7t0D2qA+5FDReHeTXFzgXM5YmA6hNniCl/1T
// SIG // RMhLH4g59fHpXkglqI72fkfOkkzo8lfhcqGCAigwggIk
// SIG // BgkqhkiG9w0BCQYxggIVMIICEQIBATCBjjB3MQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQg
// SIG // VGltZS1TdGFtcCBQQ0ECEzMAAACb4HQ3yz1NjS4AAAAA
// SIG // AJswCQYFKw4DAhoFAKBdMBgGCSqGSIb3DQEJAzELBgkq
// SIG // hkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE2MDkwNzA0
// SIG // NTIyOVowIwYJKoZIhvcNAQkEMRYEFDRipMY/lRx/Sbuh
// SIG // lF2pCYtSB88oMA0GCSqGSIb3DQEBBQUABIIBAB2Juhcq
// SIG // 5fTdxDuqM8Zq73A0f53vGBWyIhMaOanNxSdLXxl+UFNz
// SIG // /ZWm6TDQlXwr6dQZl+HZ8g4qExiYZD5NjAUw2oeqMMSh
// SIG // H3qrbCbGWWZ4AcJ1gv8l+QgM6ArPyT/Y8LdQS5l3wMea
// SIG // cEIK/yu7lOXXRSdPvGt+Vw01DtJIe5Rf7ktwHq5K8CMq
// SIG // 3jPCPDs32Gfgl3q4FJY5FY9t0YqX3GLNs6XgxgQHRzaP
// SIG // cENm2DcEiO5Ylukqs4ZrR9b9b3+0GFgHUIJ3YLftDo46
// SIG // bYczO9vcJPnjGbCJwO+bweKff0ITgB0U6E1CNSsb+fd+
// SIG // dv/FCJ6bF+ZLoAGImw5i85Rgzyo=
// SIG // End signature block
