import {PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import {GridFilterModel} from "@mui/x-data-grid";

interface CustomFilteringForDataGridProps {
    gridFilterModel: GridFilterModel;
    setGridFunction: (
        paginationRequestModel: PaginatedGridInterface
    ) => any;
    paginatedGridModel: PaginatedGridInterface;
    selectionModel?: any;
    prevSelectionModel?: any;
}

export const filterChangeFunction = ( props: CustomFilteringForDataGridProps ) => {
    let filterItem = props.gridFilterModel.items[0];
    if(filterItem) {
        props.setGridFunction({
            start: props.paginatedGridModel.start,
            end: props.paginatedGridModel.end,
            pageSize: props.paginatedGridModel.pageSize,
            includeDeleted: props.paginatedGridModel.includeDeleted,
            includeExpired: props.paginatedGridModel.includeExpired,
            data: props.paginatedGridModel.data,
            actualDataCount: props.paginatedGridModel.actualDataCount,
            totalPaginationBlockCount: props.paginatedGridModel.totalPaginationBlockCount,
            filterExpr: {
                columnName: filterItem.field,
                condition: filterItem.operator,
                filterText: filterItem.value,
            },
        });
    }

    // retain the previously selected rows for selection grids
    if (
        props.selectionModel != undefined &&
        props.prevSelectionModel != undefined
    ) {
        props. prevSelectionModel.current = props.selectionModel;
    }
}