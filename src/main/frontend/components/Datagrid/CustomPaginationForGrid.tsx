import {
    gridPageCountSelector,
    GridPagination,
    useGridApiContext,
    useGridSelector
} from "@mui/x-data-grid";
import {TablePaginationProps} from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import React from "react";

interface FilterModel{
    columnName: string;
    condition: string;
    filterText: string;
}
export interface PaginatedGridInterface {
    start: number;
    end: number;
    pageSize:number;
    includeDeleted: boolean;
    includeExpired?: boolean;
    includeGuest?: boolean;
    data: any[];
    actualDataCount: number;
    totalPaginationBlockCount: number,
    filterExpr: FilterModel
}

const pagination = (props: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) => {
    const apiRef = useGridApiContext();
    let pageCount = useGridSelector(apiRef, gridPageCountSelector) as number;

    return (
        <MuiPagination
            color="primary"
            className={props.className}
            count={pageCount}
            page={props.page + 1}
            onChange={(event, newPage) => {
                props.onPageChange(event as any, newPage);
            }}
        />
    );
}

export const CustomPaginationForGrid = () => {
    const apiRef = useGridApiContext();
    const handlePaginationChange = (
        event: any,
        value: number,
    ) => {
        apiRef.current.setPage(value - 1);
    };

    return <GridPagination
        ActionsComponent={pagination}
        onPageChange={handlePaginationChange}
    />;
}
