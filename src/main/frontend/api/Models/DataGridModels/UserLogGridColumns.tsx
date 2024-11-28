import {ConfirmOptions} from "material-ui-confirm";
import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import React from "react";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";
import {format} from "date-fns";

export const userLogGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        hideable: false,
        filterable: false,
    },
    {
        field: "TimeStamp",
        headerName: "Date & Time Of Change",
        flex: 1,
        minWidth: 150,
        filterable: false,
        valueGetter: (value, row) => {
            return `${format(new Date(row.updatedAt), 'do MMM yyyy')}`;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />,
    },
    {
        field: "change",
        headerName: "Change Made",
        flex: 2,
        minWidth: 250,
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />,
    },
    {
        field: "oldValue",
        headerName: "Old Value",
        flex: 2,
        minWidth: 250,
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />,
    },
    {
        field: "newValue",
        headerName: "New Value",
        flex: 2,
        minWidth: 250,
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />,
    },
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>) => {
    return [...userLogGridColumns];
}
export const initUserLogGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>) => {
    return await actionColumns(confirm);
}