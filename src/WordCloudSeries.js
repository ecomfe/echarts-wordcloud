var completeDimensions = require('echarts/lib/data/helper/completeDimensions');
var echarts = require('echarts');

echarts.extendSeriesModel({

    type: 'series.wordCloud',

    visualColorAccessPath: 'textStyle.normal.color',

    optionUpdated: function () {
        var option = this.option;
        option.gridSize = Math.max(Math.floor(option.gridSize), 4);
    },

    getInitialData: function (option, ecModel) {
        var dimensions = completeDimensions(['value'], option.data);
        var list = new echarts.List(dimensions, this);
        list.initData(option.data);
        return list;
    },

    defaultOption: {

        maskImage: null,

        shape: '',

        sizeRange: [12, 60],

        rotationRange: [-90, 90],

        gridSize: 8,

        textStyle: {
            normal: {
                fontWeight: 'normal'
            }
        }
    }
});