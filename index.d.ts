import echarts from 'echarts';

interface WordCloudTextStyle {
  color?: string;
  fontStyle?: string;
  fontWeight?: string | number;
  fontFamily?: string;
  fontSize?: number | string;
  align?: string;
  verticalAlign?: string;
  // @deprecated
  baseline?: string;

  opacity?: number;

  lineHeight?: number;
  backgroundColor?:
    | string
    | {
        image: HTMLImageElement | HTMLCanvasElement | string;
      };
  borderColor?: string;
  borderWidth?: number;
  borderType?: string;
  borderDashOffset?: number;
  borderRadius?: number | number[];
  padding?: number | number[];

  width?: number | string; // Percent
  height?: number;
  textBorderColor?: string;
  textBorderWidth?: number;
  textBorderType?: string;
  textBorderDashOffset?: number;

  textShadowBlur?: number;
  textShadowColor?: string;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
}

interface WorldCloudDataItem {
  name?: string;
  value?: number | number[];
  textStyle?: WordCloudTextStyle;
  emphasis?: {
    textStyle?: WordCloudTextStyle;
  };
}

declare module 'echarts/types/dist/echarts' {
  export interface WordCloudSeriesOption {
    mainType?: 'series';
    type?: 'wordCloud';
    silent?: boolean;
    blendMode?: string;
    /**
     * Cursor when mouse on the elements
     */
    cursor?: string;

    width?: number | string;
    height?: number | string;
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;

    textStyle?:
      | WordCloudTextStyle
      | {
          color?: (params?: any) => string;
        };
    emphasis?: {
      focus?: 'self' | 'series' | 'none';
      blurScope?: 'coordinateSystem' | 'global' | 'series';
      textStyle?: WordCloudTextStyle;
    };

    shape?: string;
    maskImage?: HTMLImageElement | HTMLCanvasElement;

    sizeRange?: number[];
    rotationRange?: number[];
    rotationStep?: number;

    gridSize?: number;

    drawOutOfBound?: boolean;
    layoutAnimation?: boolean;

    data?: WorldCloudDataItem[];
  }

  interface RegisteredSeriesOption {
    wordCloud: WordCloudSeriesOption;
  }
}
