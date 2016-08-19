var echarts = require('echarts');
var layoutUtil = require('echarts/lib/util/layout');

require('./WordCloudSeries');
require('./WordCloudView');

var wordCloudLayoutHelper = require('./layout');

if (!wordCloudLayoutHelper.isSupported) {
    throw new Error('Sorry your browser not support wordCloud');
}

// https://github.com/timdream/wordcloud2.js/blob/c236bee60436e048949f9becc4f0f67bd832dc5c/index.js#L233
function updateCanvasMask(maskCanvas) {
    var ctx = maskCanvas.getContext('2d');
    var imageData = ctx.getImageData(
        0, 0, maskCanvas.width, maskCanvas.height);
    var newImageData = ctx.createImageData(imageData);

    for (var i = 0; i < imageData.data.length; i += 4) {
        var tone = imageData.data[i] +
            imageData.data[i + 1] +
            imageData.data[i + 2];
        var alpha = imageData.data[i + 3];

        if (alpha < 128 || tone > 128 * 3) {
            // Area not to draw
            newImageData.data[i] = 0;
            newImageData.data[i + 1] = 0;
            newImageData.data[i + 2] = 0;
            newImageData.data[i + 3] = 0;
        }
        else {
            // Area to draw
            // The color must be same with backgroundColor
            newImageData.data[i] = 255;
            newImageData.data[i + 1] = 255;
            newImageData.data[i + 2] = 255;
            newImageData.data[i + 3] = 255;
        }
    }

    ctx.putImageData(newImageData, 0, 0);
}

/**
 * Mapping a value from domain to range using the function y=ax^p+b (p means power)
 * @param  {number} val
 * @param  {Array.<number>} domain Domain extent domain[1] is bigger than domain[0]
 * @param  {Array.<number>} range  Range extent range[1] is bigger than range[0]
 * @param  {number} power
 * @return {(number|Array.<number>}
 */
function valueMap(val, domain, range, power) {
    if(range[1] > range[0]){
        var a = (range[1] - range[0]) / (Math.pow(domain[1],power)-Math.pow(domain[0],power));
        var b = range[1] - a * Math.pow(domain[1],power);
        return Math.ceil(a*Math.pow(val,power)+b);
    }else{
        return range[0];
    }
};

echarts.registerLayout(function (ecModel, api) {
    ecModel.eachSeriesByType('wordCloud', function (seriesModel) {
        var gridRect = layoutUtil.getLayoutRect(
            seriesModel.getBoxLayoutParams(), {
                width: api.getWidth(),
                height: api.getHeight()
            }
        );
        var data = seriesModel.getData();

        var canvas = document.createElement('canvas');
        canvas.width = gridRect.width;
        canvas.height = gridRect.height;

        var ctx = canvas.getContext('2d');
        var maskImage = seriesModel.get('maskImage');
        if (maskImage) {
            try {
                ctx.drawImage(maskImage, 0, 0, canvas.width, canvas.height);
                updateCanvasMask(canvas);
            }
            catch (e) {
                console.error('Invalid mask image');
                console.error(e.toString());
            }
        }

        var sizeRange = seriesModel.get('sizeRange');
        var rotationRange = seriesModel.get('rotationRange');
        var valueExtent = data.getDataExtent('value');
        var sizeMapPower = seriesModel.get('sizeMapPower');

        var DEGREE_TO_RAD = Math.PI / 180;
        var gridSize = seriesModel.get('gridSize');

        //Fix origin(if precentage)
        var origin = seriesModel.get('origin');
        var x = /^\d+%$/.test(origin[0]) ? gridRect.width * parseInt(origin[0],10) / 100 : origin[0];
        var y = /^\d+%$/.test(origin[1]) ? gridRect.height * parseInt(origin[1],10) / 100 : origin[1];

        wordCloudLayoutHelper(canvas, {
            list: data.mapArray('value', function (value, idx) {
                var itemModel = data.getItemModel(idx);
                return [
                    data.getName(idx),
                    itemModel.get('textStyle.normal.textSize', true)
                        || valueMap(value, valueExtent, sizeRange,sizeMapPower),
                    idx
                ];
            }).sort(function (a, b) {
                // Sort from large to small in case there is no more room for more words
                return b[1] - a[1];
            }),
            fontFamily: seriesModel.get('textStyle.normal.fontFamily')
                || seriesModel.get('textStyle.emphasis.fontFamily')
                || ecModel.get('textStyle.fontFamily'),
            fontWeight: seriesModel.get('textStyle.normal.fontWeight')
                || seriesModel.get('textStyle.emphasis.fontWeight')
                || ecModel.get('textStyle.fontWeight'),
            gridSize: gridSize,

            ellipticity: seriesModel.get('ellipticity'),

            minRotation: rotationRange[0] * DEGREE_TO_RAD,
            maxRotation: rotationRange[1] * DEGREE_TO_RAD,

            clearCanvas: !maskImage,

            rotateRatio: seriesModel.get('rotateRatio'),

            rotationStep: seriesModel.get('rotationStep') * DEGREE_TO_RAD,

            drawOutOfBound: false,

            shuffle: seriesModel.get('shuffle'),

            shape: seriesModel.get('shape'),

            origin : [x,y]
        });

        canvas.addEventListener('wordclouddrawn', function (e) {
            var item = e.detail.item;
            if (e.detail.drawn && seriesModel.layoutInstance.ondraw) {
                e.detail.drawn.gx += gridRect.x / gridSize;
                e.detail.drawn.gy += gridRect.y / gridSize;
                seriesModel.layoutInstance.ondraw(
                    item[0], item[1], item[2], e.detail.drawn
                );
            }
        });

        seriesModel.layoutInstance = {
            ondraw: null
        };
    });
});
