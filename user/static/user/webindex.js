
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

cornerstoneWADOImageLoader.configure({
    beforeSend: function (xhr) {
        // Add custom headers here (e.g. auth tokens)
        //xhr.setRequestHeader('APIKEY', 'my auth token');
    }
});

var loaded = false;

function loadAndViewImage(imageId) {
    var element = document.getElementById('dicomImage');

    try {
        var start = new Date().getTime();
        cornerstone.loadAndCacheImage(imageId).then(function (image) {
            console.log(image);
            var viewport = cornerstone.getDefaultViewportForImage(element, image);
            document.getElementById('toggleModalityLUT').checked = (viewport.modalityLUT !== undefined);
            document.getElementById('toggleVOILUT').checked = (viewport.voiLUT !== undefined);
            cornerstone.displayImage(element, image, viewport);
            console.log(element);
            console.log(viewport);
            if (loaded === false) {
                cornerstoneTools.mouseInput.enable(element);
                cornerstoneTools.mouseWheelInput.enable(element);
                cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
                cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
                cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
                cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
                loaded = true;
            }

            function getTransferSyntax() {
                const value = image.data.string('x00020010');
                return value + ' [' + uids[value] + ']';
            }

            function getSopClass() {
                const value = image.data.string('x00080016');
                return value + ' [' + uids[value] + ']';
            }

            function getPixelRepresentation() {
                const value = image.data.uint16('x00280103');
                if (value === undefined) {
                    return;
                }
                return value + (value === 0 ? ' (unsigned)' : ' (signed)');
            }

            function getPlanarConfiguration() {
                const value = image.data.uint16('x00280006');
                if (value === undefined) {
                    return;
                }
                return value + (value === 0 ? ' (pixel)' : ' (plane)');
            }


        }, function (err) {
            alert(err);
        });
    }
    catch (err) {
        alert(err);
    }
}

function downloadAndView() {
    let url = document.getElementById('wadoURL').value;

    // prefix the url with wadouri: so cornerstone can find the image loader
    url = "wadouri:" + url;

    // image enable the dicomImage element and activate a few tools
    loadAndViewImage(url);
}

cornerstone.events.addEventListener('cornerstoneimageloadprogress', function (event) {
    const eventData = event.detail;
});

function getUrlWithoutFrame() {
    var url = document.getElementById('wadoURL').value;
    var frameIndex = url.indexOf('frame=');
    if (frameIndex !== -1) {
        url = url.substr(0, frameIndex - 1);
    }
    return url;
}

var element = document.getElementById('dicomImage');
cornerstone.enable(element);

document.getElementById('downloadAndView').addEventListener('click', function (e) {
    downloadAndView();
});
document.getElementById('load').addEventListener('click', function (e) {
    var url = getUrlWithoutFrame();
    cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.load(url);
});
document.getElementById('unload').addEventListener('click', function (e) {
    var url = getUrlWithoutFrame();
    cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.unload(url);
});

document.getElementById('purge').addEventListener('click', function (e) {
    cornerstone.imageCache.purgeCache();
});

const form = document.getElementById('form');
form.addEventListener('submit', function () {
    downloadAndView();
    return false;
});

document.getElementById('toggleModalityLUT').addEventListener('click', function () {
    var applyModalityLUT = document.getElementById('toggleModalityLUT').checked;
    console.log('applyModalityLUT=', applyModalityLUT);
    var image = cornerstone.getImage(element);
    var viewport = cornerstone.getViewport(element);
    if (applyModalityLUT) {
        viewport.modalityLUT = image.modalityLUT;
    } else {
        viewport.modalityLUT = undefined;
    }
    cornerstone.setViewport(element, viewport);
});

document.getElementById('toggleVOILUT').addEventListener('click', function () {
    var applyVOILUT = document.getElementById('toggleVOILUT').checked;
    console.log('applyVOILUT=', applyVOILUT);
    var image = cornerstone.getImage(element);
    var viewport = cornerstone.getViewport(element);
    if (applyVOILUT) {
        viewport.voiLUT = image.voiLUT;
    } else {
        viewport.voiLUT = undefined;
    }
    cornerstone.setViewport(element, viewport);
});

