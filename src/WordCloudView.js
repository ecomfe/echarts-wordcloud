import * as echarts from 'echarts/lib/echarts';

echarts.extendChartView({
  type: 'wordCloud',

  render: function (seriesModel, ecModel, api) {
    var group = this.group;
    group.removeAll();

    var data = seriesModel.getData();

    var gridSize = seriesModel.get('gridSize');

    seriesModel.layoutInstance.ondraw = function (text, size, dataIdx, drawn) {
      var itemModel = data.getItemModel(dataIdx);
      var textStyleModel = itemModel.getModel('textStyle');

      var textEl = new echarts.graphic.Text({
        style: echarts.helper.createTextStyle(textStyleModel),
        scaleX: 1 / drawn.info.mu,
        scaleY: 1 / drawn.info.mu,
        x: (drawn.gx + drawn.info.gw / 2) * gridSize,
        y: (drawn.gy + drawn.info.gh / 2) * gridSize,
        rotation: drawn.rot
      });
      textEl.setStyle({
        x: drawn.info.fillTextOffsetX,
        y: drawn.info.fillTextOffsetY + size * 0.5,
        text: text,
        verticalAlign: 'middle',
        fill: data.getItemVisual(dataIdx, 'style').fill,
        fontSize: size
      });

      group.add(textEl);

      data.setItemGraphicEl(dataIdx, textEl);

      textEl.ensureState('emphasis').style = echarts.helper.createTextStyle(
        itemModel.getModel(['emphasis', 'textStyle']),
        {
          state: 'emphasis'
        }
      );
      textEl.ensureState('blur').style = echarts.helper.createTextStyle(
        itemModel.getModel(['blur', 'textStyle']),
        {
          state: 'blur'
        }
      );

      echarts.helper.enableHoverEmphasis(
        textEl,
        itemModel.get(['emphasis', 'focus']),
        itemModel.get(['emphasis', 'blurScope'])
      );

      textEl.stateTransition = {
        duration: seriesModel.get('animation')
          ? seriesModel.get(['stateAnimation', 'duration'])
          : 0,
        easing: seriesModel.get(['stateAnimation', 'easing'])
      };
      // TODO
      textEl.__highDownDispatcher = true;
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
