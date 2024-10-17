export type PaginationBaseResponseModel<T> = {
    totalDataCount: number;
    data: T[];
}

export type PaginationBaseRequestModel = {
    pageSize: number;
    start: number;
    end: number;
    condition: string;
    filterExpr: string;
    columnName: string;
    includeDeleted: boolean;
    includeExpired?: boolean;
    selectedIds?: number[];
}