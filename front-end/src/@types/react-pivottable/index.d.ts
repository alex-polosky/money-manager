class Renderer extends React.PureComponent<{} & any, {} & any> { }

interface PivotData {
    data: any[] | Function | any;
    aggregatorName?: string;
    cols?: string[];
    rows?: string[];
    vals?: string[];
    valueFilter?: any; // TODO: work out: PropTypes.objectOf(PropTypes.objectOf(PropTypes.bool))
    sorters?: Function | { [key: any]: Function }; // TODO: work out: PropTypes.objectOf(PropTypes.func)
    derivedAttributes?: { [key: any]: Function };
    rowOrder?: 'key_a_to_z' | 'value_a_to_z' |'value_z_to_a';
    colOrder?: 'key_a_to_z' | 'value_a_to_z' | 'value_z_to_a';
}

interface PivotTableProps extends PivotData {
    rendererName?: string,
    renderers?: Renderer[]
}

declare module 'react-pivottable' {
    class PivotTable extends React.PureComponent<PivotTableProps, PivotTableProps> { }
    export default PivotTable;
    export { PivotTableProps };
}

declare module 'react-pivottable/PivotTableUI' {
    interface PivotTableUIProps extends PivotTableProps {
        onChange?: (state: PivotTableUIProps) => void;
        hiddenAttributes?: string[];
        hiddenFromAggregators?: string[];
        hiddenFromDragDrop?: string[];
        unusedOrientationCutoff?: number;
        menuLimit?: number;
    }
    class PivotTableUI extends React.PureComponent<PivotTableUIProps, PivotTableUIProps> { }
    export default PivotTableUI;
    export { PivotTableUIProps };
}

declare module 'react-pivottable/TableRenderers' {
    class TableRenderer extends Renderer { }
    class TSVExportRenderer extends Renderer { }
    export default {
        Table: TableRenderer,
        'Table Heatmap': TableRenderer,
        'Table Col Heatmap': TableRenderer,
        'Table Row Heatmap': TableRenderer,
        'Exportable TSV': TSVExportRenderer,
    };
}

declare module 'react-pivottable/PlotlyRenderers' {
    import React from 'react';
    import { PlotParams } from 'react-plotly.js';
    export default function createPlotlyRenderers(PlotlyComponent: React.PureComponent<PlotParams>): Renderer[];
}

declare module 'react-pivottable/Utilities' {
    export {
        PivotData
    }
}