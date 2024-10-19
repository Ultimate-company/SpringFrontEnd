import {StyledDataGrid} from "Frontend/components/Datagrid/CustomDataGrid";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {
    GridColDef,
    GridColumnVisibilityModel,
    GridFilterModel, GridRowParams,
    GridRowSelectionModel,
    GridToolbar
} from "@mui/x-data-grid";
import {CustomPaginationForGrid, PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import React from "react";
import {filterChangeFunction} from "Frontend/components/Datagrid/CustomFilteringForDataGrid";
import {userApi} from "Frontend/api/ApiCalls";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import {User} from "Frontend/api/Models/CentralModels/User";
import {initUserColumnsForSelection, initUserGridColumns} from "Frontend/api/Models/DataGridModels/UserGridColumns";

interface UserSelectionGridProps {
    setLoading: (loading: boolean) => void;
    selectedUserIds: GridRowSelectionModel;
    setSelectedUserIds: (girdRowSelectionModel: GridRowSelectionModel) => void;
    isView: boolean;
    singleSelection: boolean;
}

const paginatedGridModel: PaginatedGridInterface = {
    start: 0,
    end: 10,
    pageSize: 10,
    includeDeleted: false,
    data: [],
    totalPaginationBlockCount: 0,
    actualDataCount: 0,
    filterExpr: {
        columnName: "",
        condition: "",
        filterText: ""
    }
}

const UserSelectionGrid = (props: UserSelectionGridProps) => {
    // state variables
    const [userGridColumns, setUserGridColumns] = React.useState<GridColDef[]>([]);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [userGridColumnVisibilityModel, setUserGridColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });

    // function which will take start and end and will get the messages in batches from the database
    const setUsersAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        userApi(props.setLoading).getUsersInCarrierInBatches({
            columnName: paginationRequestModel.filterExpr.columnName,
            condition: paginationRequestModel.filterExpr.condition,
            filterExpr: paginationRequestModel.filterExpr.filterText,
            start: paginationRequestModel.start,
            end: paginationRequestModel.end,
            pageSize: paginationRequestModel.pageSize,
            includeDeleted: paginationRequestModel.includeDeleted,
            selectedIds: props.selectedUserIds.map(userId => parseInt(userId.toString()))
        }).then((response: PaginationBaseResponseModel<User>) => {
            userApi(props.setLoading).getIncludeDeleted().then((getIncludeDeletedResponse: boolean) => {
                initUserColumnsForSelection().then((columns) => {
                    setUserGridColumns(columns);
                    setState({
                        ...state,
                        data: response.data,
                        totalPaginationBlockCount: Math.ceil(
                            response.totalDataCount / paginationRequestModel.pageSize
                        ),
                        includeDeleted: getIncludeDeletedResponse,
                        actualDataCount: response.totalDataCount ?? 0,
                        start: paginationRequestModel.start,
                        end: paginationRequestModel.end,
                        filterExpr: {
                            columnName: paginationRequestModel.filterExpr.columnName,
                            condition: paginationRequestModel.filterExpr.condition,
                            filterText: paginationRequestModel.filterExpr.filterText,
                        }
                    });
                });
            });
        });
    };

    React.useEffect(() => {
        setUsersAndPagination(paginatedGridModel);
    }, []);

    return (
        <StyledDataGrid
            keepNonExistentRowsSelected
            checkboxSelection
            disableMultipleRowSelection={props.singleSelection}
            getRowId={(row) => row.userId}
            disableRowSelectionOnClick={true}
            rows={state.data}
            columns={userGridColumns}
            filterMode="server"
            rowCount={state.actualDataCount}
            paginationMode="server"
            columnVisibilityModel={userGridColumnVisibilityModel}
            onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                setUserGridColumnVisibilityModel(newModel);
            }, [userGridColumnVisibilityModel, props.selectedUserIds])}
            slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: GridToolbar,
                pagination: () =>
                    <CustomPaginationForGrid
                        pageSize={state.pageSize}
                    />,
            }}
            initialState={{
                pagination: { paginationModel: { pageSize: state.pageSize } },
            }}
            pageSizeOptions={[10, 25, 100]}
            onFilterModelChange={React.useCallback((filterModel: GridFilterModel) =>
                filterChangeFunction({
                    gridFilterModel: filterModel,
                    setGridFunction: setUsersAndPagination,
                    paginatedGridModel: {
                        includeDeleted: state.includeDeleted,
                        filterExpr: state.filterExpr,
                        pageSize: state.pageSize,
                        start: 0,
                        end: state.pageSize,
                        actualDataCount: state.actualDataCount,
                        totalPaginationBlockCount: state.totalPaginationBlockCount,
                        data: state.data
                    }
                }), [state, props.selectedUserIds])}
            onPaginationModelChange={React.useCallback((newModel: GridPaginationModel) => {
                setUsersAndPagination({
                    includeDeleted: state.includeDeleted,
                    filterExpr: state.filterExpr,
                    pageSize: state.pageSize,
                    start: newModel.pageSize * newModel.page,
                    end: (newModel.pageSize * newModel.page) + newModel.pageSize,
                    actualDataCount: state.actualDataCount,
                    totalPaginationBlockCount: state.totalPaginationBlockCount,
                    data: state.data
                })
            }, [state, props.selectedUserIds])}
            onRowSelectionModelChange={React.useCallback((newRowSelectionModel: GridRowSelectionModel) => {
                props.setSelectedUserIds(newRowSelectionModel);
            }, [state, props.selectedUserIds])}
            {...(props.isView ? { isRowSelectable: (params: GridRowParams) => false } : {})}
            rowSelectionModel={props.selectedUserIds}
            getRowClassName={React.useCallback((params: GridRowClassNameParams) => {
                if (params.row.deleted) {
                    return "deleted";
                }
                else {
                    return "";
                }
            }, [state, props.selectedUserIds])}
        />
    );
}
export default React.memo(UserSelectionGrid);