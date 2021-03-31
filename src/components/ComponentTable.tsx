import React from "react";
import MaterialTable from "material-table";
import {
    ArrowDownward,
    FilterList,
    Search,
    Clear,
    ChevronRight
} from "@material-ui/icons"

export const MaterialTableDemo = () => {
    const [state, setState] = React.useState({
        columns: [
            {title: "Name", field: "name", type: "string"},
            {title: "Labeled", field: "labeled", type: "numeric"},
            {title: "Predicted", field: "predicted", type: "numeric"},
        ],
        data: [
            {
                id: 1,
                name: "Beam",
                labeled: 456,
                predicted: 52
            },
            {
                id: 2,
                name: "Brace",
                labeled: 0,
                predicted: 0,
                parentId: 1
            },
            {
                id: 2,
                name: "Brace Horizontal",
                labeled: 0,
                predicted: 0,
                parentId: 1
            },
            {
                id: 3,
                name: "Column",
                labeled: 0,
                predicted: 21
            },
            {
                id: 4,
                name: "Door",
                labeled: 0,
                predicted: 0
            },
            {
                id: 5,
                name: "Other",
                labeled: 1664,
                predicted: 1738
            },
        ]
    });

    return (
        <MaterialTable
            title="V3"
            columns={
                state.columns as any
            }
            data={
                state.data
            }
            options={{
                filtering: false,
                paging: false,
                selection: true
            }}
            parentChildData={
                (row, rows) => rows.find(a => a.id === row.parentId)
            }
            icons={{
                Filter: FilterList as any,
                Search: Search as any,
                SortArrow: ArrowDownward as any,
                ResetSearch: Clear as any,
                DetailPanel: ChevronRight as any
            }}
        />
    );
};
