# ECharts wordcloud extension based on wordcloud2.js

### Install

```html
<script src="echarts.min.js"></script>
<script src="echarts-wordcloud.js"></script>
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

...

chart.setOption({
    ...
    series: [{
        type: 'wordCloud',
        data: [{
            name: 'Farrah Abraham',
            value: 366
        }]
    }]
});
```
