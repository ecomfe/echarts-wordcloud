# ECharts wordcloud extension based on [wordcloud2.js](https://github.com/timdream/wordcloud2.js)

### Install

```html
<script src="echarts.min.js"></script>
<script src="echarts-wordcloud.min.js"></script>
```

Or

```
npm install echarts-wordcloud
```

```js
var echarts = require('echarts');
require('echarts-wordcloud');
```

### Usage

```js
var chart = echarts.init(document.getElementById('main'));

chart.setOption({
    ...
    series: [{
        type: 'wordCloud',

        // The shape of the "cloud" to draw. Can be any polar equation represented as a
        // callback function, or a keyword present. Available presents are circle (default),
        // cardioid (apple or heart shape curve, the most known polar equation), diamond (
        // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.

        shape: 'circle',

        // A silhouette image which the white area will be excluded from drawing texts.
        // The shape option will continue to apply as the shape of the cloud to grow.

        maskImage: img,

        // Folllowing left/top/width/height/right/bottom is used for positioning the area of word cloud
        // Default to be put in the center and has 75% x 80% size.

        left: 'center',
        top: 'center',
        width: '70%',
        height: '80%',
        right: null,
        bottom: null,

        // Text size range which the value in data will be mapped to.
        // Default to have minimum 12px and maximum 60px size.

        sizeRange: [12, 60],

        // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

        rotationRange: [-90, 90],
        rotationStep: 45,

        // size of the grid in pixels for marking the availability of the canvas
        // the larger the grid size, the bigger the gap between words.

        gridSize: 8,

        // Data is an array. Each array item must has name and value property.
        data: [{
            name: 'Farrah Abraham',
            value: 366
        }]
    }]
});
```
