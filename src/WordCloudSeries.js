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

        //Options below are from from https://github.com/timdream/wordcloud2.js/blob/gh-pages/API.md

        shape: 'circle', // Shape can be 'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'

        maskImage: null, //<img> with image loaded

        origin:['50%','50%'], //Origin of the “cloud” in [x, y] . x y can be percentage or value in px

        sizeRange: [12, 60],  //Text size range

        rotationRange: [-90, 90], 

        rotationStep: 45, 

        shuffle:false,

        rotateRatio:1,

        gridSize: 8,

        ellipticity :1,

        //Options below are added for convenient

        sizeMapPower: 1 ,    //Mapping text value to size by using formular y = a^p + b. p refer to sizeMapPower
        
        //Options below are from http://echarts.baidu.com/option.html 

        left: 'center',

        top: 'center',

        width: '100%',

        height: '100%',

        textStyle: {     
            normal: {
                fontWeight: 'normal'
            }
        }
    }
});