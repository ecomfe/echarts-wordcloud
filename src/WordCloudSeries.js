var createListSimply = require("echarts/lib/chart/helper/createListSimply");
var echarts = require('echarts/lib/echarts');

echarts.extendSeriesModel({

    type: 'series.wordCloud',

    visualColorAccessPath: 'textStyle.normal.color',

    optionUpdated: function () {
        var option = this.option;
        option.gridSize = Math.max(Math.floor(option.gridSize), 4);
    },

    getInitialData: function (option, ecModel) {
        return createListSimply(this, ['value']);
    },

    // Most of options are from https://github.com/timdream/wordcloud2.js/blob/gh-pages/API.md
    defaultOption: {

        maskImage: null,

        // Shape can be 'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'
        shape: 'circle',

        left: 'center',

        top: 'center',

        width: '70%',

        height: '80%',

        sizeRange: [12, 60],

        rotationRange: [-90, 90],

        rotationStep: 45,

        gridSize: 8,

        drawOutOfBound: false,

        textStyle: {
            normal: {
                fontWeight: 'normal'
            }
        }
    }
});
