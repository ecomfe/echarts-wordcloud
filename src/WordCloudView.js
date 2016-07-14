var echarts = require('echarts');

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

            var getFont = function (model, otherModel) {
                var ecModel = model.ecModel;
                var gTextStyleModel = ecModel && ecModel.getModel('textStyle');
                return ['fontStyle', 'fontWeight', 'fontSize', 'fontFamily'].map(function (name, idx) {
                    if (idx !== 2) {
                        return model.getShallow(name)
                                || otherModel.getShallow(name)
                                || getShallow(gTextStyleModel, name);
                    }
                    else {
                        return (
                            model.getShallow(name, true)
                            || Math.round(
                                    model === textStyleModel
                                    ? size : (otherModel.getShallow(name, true) || size)
                                )
                        ) + 'px';
                    }
                }).join(' ');
            };
            var text = new echarts.graphic.Text({
                style: {
                    x: drawn.info.fillTextOffsetX,
                    y: drawn.info.fillTextOffsetY + size * 0.5,
                    text: text,
                    textBaseline: 'middle',
                    font: getFont(textStyleModel, emphasisTextStyleModel)
                },
                scale: [1 / drawn.info.mu, 1 / drawn.info.mu],
                position: [
                    (drawn.gx + drawn.info.gw / 2) * gridSize,
                    (drawn.gy + drawn.info.gh / 2) * gridSize
                ],
                rotation: drawn.rot
            });

            text.setStyle(textStyleModel.getItemStyle());
            text.setStyle({
                fill: data.getItemVisual(dataIdx, 'color')
            });

            group.add(text);

            data.setItemGraphicEl(dataIdx, text);
            echarts.graphic.setHoverStyle(
                text, echarts.util.extend(
                    emphasisTextStyleModel.getItemStyle(),
                    {
                        font: getFont(emphasisTextStyleModel, textStyleModel)
                    }
                )
            );
        };
    }
});