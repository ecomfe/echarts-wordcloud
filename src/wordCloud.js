var echarts = require('echarts');
var layoutUtil = require('echarts/lib/util/layout');

require('./WordCloudSeries');
require('./WordCloudView');

var WordCloud = require('./layout');

if (!WordCloud.isSupported) {
    throw new Error('Sorry your browser not support wordCloud');
}

echarts.registerLayout(function (ecModel, api) {
    ecModel.eachSeries(function (seriesModel) {
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

        var sizeRange = seriesModel.get('sizeRange');
        var rotationRange = seriesModel.get('rotationRange');
        var valueExtent = data.getDataExtent('value');

        var DEGREE_TO_RAD = Math.PI / 180;
        WordCloud(canvas, {
            list: data.mapArray('value', function (value, idx) {
                var itemModel = data.getItemModel(idx);
                return [
                    data.getName(idx),
                    itemModel.get('textStyle.normal.textSize', true)
                        || echarts.number.linearMap(value, valueExtent, sizeRange),
                    idx
                ];
            }),
            fontFamily: seriesModel.get('textStyle.normal.fontFamily')
                || seriesModel.get('textStyle.emphasis.fontFamily')
                || ecModel.get('textStyle.fontFamily'),
            fontWeight: seriesModel.get('textStyle.normal.fontWeight')
                || seriesModel.get('textStyle.emphasis.fontWeight')
                || ecModel.get('textStyle.fontWeight'),
            gridSize: seriesModel.get('gridSize'),
            minRotation: rotationRange[0] * DEGREE_TO_RAD,
            maxRotation: rotationRange[1] * DEGREE_TO_RAD
        });

        canvas.addEventListener('wordclouddrawn', function (e) {
            var item = e.detail.item;
            if (e.detail.drawn && seriesModel.layoutInstance.ondraw) {
                seriesModel.layoutInstance.ondraw(item[0], item[1], item[2], e.detail.drawn);
            }
        });

        seriesModel.layoutInstance = {
            ondraw: null
        };
    });
});
