var echarts = require('echarts/lib/echarts');

function getShallow(model, path) {
    return model && model.getShallow(path);
}

echarts.extendChartView({

    type: 'wordCloud',

    render: function (seriesModel, ecModel, api) {
        var group = this.group;
        group.removeAll();

        var data = seriesModel.getData();

        var gridSize = seriesModel.get('gridSize');

        seriesModel.layoutInstance.ondraw = function (text, size, dataIdx, drawn) {
            var itemModel = data.getItemModel(dataIdx);
            var textStyleModel = itemModel.getModel('textStyle.normal');
            var emphasisTextStyleModel = itemModel.getModel('textStyle.emphasis');

            var textEl = new echarts.graphic.Text({
                style: echarts.graphic.setTextStyle({}, textStyleModel, {
                    x: drawn.info.fillTextOffsetX,
                    y: drawn.info.fillTextOffsetY + size * 0.5,
                    text: text,
                    textBaseline: 'middle',
                    textFill: data.getItemVisual(dataIdx, 'color'),
                    fontSize: size
                }),
                scale: [1 / drawn.info.mu, 1 / drawn.info.mu],
                position: [
                    (drawn.gx + drawn.info.gw / 2) * gridSize,
                    (drawn.gy + drawn.info.gh / 2) * gridSize
                ],
                rotation: drawn.rot
            });

            group.add(textEl);

            data.setItemGraphicEl(dataIdx, textEl);

            echarts.graphic.setHoverStyle(
                textEl,
                echarts.graphic.setTextStyle({}, emphasisTextStyleModel, null, {forMerge: true}, true)
            );
        };

        this._model = seriesModel;
    },

    remove: function () {
        this.group.removeAll();

        this._model.layoutInstance.dispose();
    },

    dispose: function () {
        this._model.layoutInstance.dispose();
    }
});
