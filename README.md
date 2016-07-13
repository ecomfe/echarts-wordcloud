# ECharts graph layout extension integrated with dagre.js


### Install

```html
<script src="echarts.min.js"></script>
<script src="echarts-dagre.min.js"></script>
```

Or

```
npm install echarts-dagre
```

```js
var echarts = require('echarts');
require('echarts-dagre');
```

### Usage

```js

...

chart.setOption({
    ...
    series: [{
        type: 'graph',
        // Change the layout to dagre, that's all you need to do.
        layout: 'dagre',
        nodes: [...],
        links: [...]
    }]
});
```
