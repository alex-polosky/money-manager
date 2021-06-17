declare module 'react-charty' {
    type DisplayData = 'number' | 'time' | 'date' | 'shortDate' | 'longDate' | 'longDateWeekDay' | 'float1' | 'float2' | Function;
    interface ChartyProps {
        /**
         * The chart title.
         * */
        title?: string;
        /**
         * The chart type, can be one of the following values: `line`, `bar`, `percentage_area`, `stacked_bar`, `multi_yaxis`, `pie`. The default value is `line`. Feel free to check [Demo App](https://99ff00.github.io/react-charty/) to see them all in action.
         * */
        type?: 'line' | 'bar' | 'percentage_area' | 'stacked_bar' | 'multi_yaxis' | 'pie';
        /**
         * Contains the data points for chart series. Every key of this object is an array of data points. The `x` array is mandatory and contains the data for x-axis while other keys represent the data points for y-axis. There could be multiple series in one chart and thus several data arrays for y-axis, for example `y`, `y0`, `y1`, `yAxis` etc. The key name can be any and is used as reference for name, color etc. The key name also defines the rendering order (alphabetically).
         * */
        data: { x: number[], [key: string]: number[] };
        /**
         * Contains the names for data series, referenced by key. For example, `names: { y0: 'Views', y1: 'Clicks' }`.
         * */
        names: { [key: string]: string };
        /**
         * Contains the colors for data series, referenced by key. For example, `colors: { y0: '#4BD964', y1: '#FE3C30' }`.
         * */
        colors: { [key: string]: string };
        /**
         * Contains the fill colors for data series (only `line` type is supported for now), referenced by key. A gradient fill is also supported. For example, `fillColors: { "y1": "#FE3C3011", "y0": { "type": "linear_gradient_v", "colors": ["#4BD964", "#4BD964", "#FFFFFF00"] }}`.
         * */
        fillColors?: any;
        /**
         * Contains the color theme for chart components. If omitted, the default theme will be used.
         * */
        theme?: any;
        /**
         * Enables/disables animations and transitions, default value is `true`.
         * */
        animated?: boolean;
        /**
         * The starting position of preview region. If not specified, the starting position of the preview region will be at 2/3 of `x` axis.
         * */
        startX?: number;
        /**
         * The ending position of preview region. If not specified, the ending position of the preview region will be at the end of `x` axis.
         * */
        endX?: number;
        /**
         * The value to increase/decrease current `x` axis position when dragging or moving the chart preview region. For example, if you have X axis of type `timestamp` and you want to navigate by one day, you can set the `stepX` value to `86400000`. The default value is `1`.
         * */
        stepX?: number;
        /**
         * If set to `false` the legend will not appear when moving the cursor over the chart (or tapping chart area on mobile). The default value is `true`.
         * */
        showLegend?: boolean;
        /**
         * If set to `false` the legend title will not appear. The default value is `true`.
         * */
        showLegendTitle?: boolean;
        /**
         * Defines the position of legend popup and can be one of the following values: `top`, `bottom`, `cursor`. The default value is `cursor`, which means the legend popup will follow the cursor position.
         * */
        legendPosition?: 'top' | 'bottom' | 'cursor';
        /**
         * If set to `false` the main chart area won't be visible. The default value is `true`.
         * */
        showMainArea?: boolean;
        /**
         * If set to `false` the chart preview won't be visible. The default value is `true`.
         * */
        showPreview?: boolean;
        /**
         * If set to `false` the brush controls in preview area won't be visible. The default value is `true`.
         * */
        showBrush?: boolean;
        /**
         * If set to `false` the series buttons won't be visible. Also, the buttons are hidden if there's only one series of data. The default value is `true`.
         * */
        showButtons?: boolean;
        /**
         * Show/hide current range text in top right corner. The default value is `true`.
         * */
        showRangeText?: boolean;
        /**
         * Defines the display type of current range. It could be one of the following [DDT](https://github.com/99ff00/react-charty#display-data-types) or can be function that accepts the `x` value of range starting and ending positions.
         * */
        rangeTextType?: DisplayData;
        /**
         * Defines the type of `x` axis. It could be one of the following [DDT](https://github.com/99ff00/react-charty#display-data-types) or can be function that accepts the `x` value and returns the formatted value.
         * */
        xAxisType?: DisplayData;
        /**
         * Defines the type of `y` axis. It could be one of the following [DDT](https://github.com/99ff00/react-charty#display-data-types) or can be function that accepts the `y` value and returns the formatted value.
         * */
        yAxisType?: DisplayData;
        /**
         * Defines the step for `x` axis. If not specified, the step value will be calculated automatically.
         * */
        xAxisStep?: number;
        /**
         * This callback is called when some point is clicked on chart. It should accept the clicked `x` position and must return `Promise` loading the next chart data. Originally, this callback was used to zoom in, i.e. display more details chart for selected `x`. But you can also use it to load any supported chart.
         * */
        onZoomIn?: Function;
        /**
         * By default, when zomming, the chart will try to figure out the start and the end of `x` axis. But you can also set the interval to zoom in (for example, if `x` axis is a timestamp and you want to zoom in one week, the interval would be `604800000`) and chart will put the current position in the middle of this interval.
         * */
        zoomInterval?: number;
        /**
         * Same as `stepX`, but for zooming chart.
         * */
        zoomStepX?: number;
        /**
         * Automatically finds the min/max `y` values and scales the chart accordingly. If this prop is set to `false`, the min/max values can be set with `minY` and `maxY` props. The default value is `true`.
         * */
        autoScale?: boolean;
        /**
         * Set the minimum value for `y` axis. This property is ignored if `autoScale` is set to `true`.
         * */
        minY?: number;
        /**
         * Set the maximum value for `y` axis. This property is ignored if `autoScale` is set to `true`.
         * */
        maxY?: number;
    }
    class Charty extends React.Component<ChartyProps, any> { }
    export default Charty
    export { ChartyProps };
}