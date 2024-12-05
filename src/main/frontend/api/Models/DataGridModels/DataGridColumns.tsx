import {GridColDef} from "@mui/x-data-grid";

const dataGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "Id",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.key;
        },
    },
    {
        field: "name",
        headerName: "Data Name",
        flex: 2,
        minWidth: 150,
        valueGetter: (value, row) => {
            return row.value;
        },
    },
];

const idColumn = async () => {
    let columns = [...dataGridColumns];

    columns.push({
        filterable: false,
        field: "key",
        headerName: "Key",
        flex: 2,
        minWidth: 150,
        valueGetter: (value, row) => {
            return row.key;
        },
    });

    return columns;
}

export const initDataGridColumns = async (displayIdColumn: boolean) => {
    if(displayIdColumn) {
        return await idColumn();
    }
    else{
        return [...dataGridColumns];
    }
}