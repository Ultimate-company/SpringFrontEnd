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
import {userGroupApi} from "Frontend/api/ApiCalls";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import {UserGroupResponseModel} from "Frontend/api/Models/CarrierModels/UserGroup";
import {
    initUserGroupColumnsForSelection
} from "Frontend/api/Models/DataGridModels/UserGroupGridColumns";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";

interface UserGroupSelectionGridProps {
    setLoading: (loading: boolean) => void;
    selectedUserGroupIds: GridRowSelectionModel;
    setSelectedUserGroupIds: (girdRowSelectionModel: GridRowSelectionModel) => void;
    isView: boolean;
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
const UserGroupSelectionGrid = (props: UserGroupSelectionGridProps) => {
    // state variables
    const [userGroupGridColumns, setUserGroupGridColumns] = React.useState<GridColDef[]>([]);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [userGroupGridColumnVisibilityModel, setUserGroupGridColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });

    // function which will take start and end and will get the messages in batches from the database
    const setUserGroupAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        userGroupApi(props.setLoading).getUserGroupsInBatches({
            columnName: paginationRequestModel.filterExpr.columnName,
            condition: paginationRequestModel.filterExpr.condition,
            filterExpr: paginationRequestModel.filterExpr.filterText,
            start: paginationRequestModel.start,
            end: paginationRequestModel.end,
            pageSize: paginationRequestModel.pageSize,
            includeDeleted: paginationRequestModel.includeDeleted,
            selectedIds: props.selectedUserGroupIds.map(userGroupId => parseInt(userGroupId.toString()))
        }).then((response: PaginationBaseResponseModel<UserGroupResponseModel>) => {
            userGroupApi(props.setLoading).getIncludeDeleted().then((getIncludeDeletedResponse: boolean) => {
                initUserGroupColumnsForSelection().then((columns) => {
                    setUserGroupGridColumns(columns);
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
        setUserGroupAndPagination(paginatedGridModel);
    }, []);

    return (
        <StyledDataGrid
            keepNonExistentRowsSelected
            checkboxSelection
            getRowId={(row) => row.userGroup.userGroupId}
            disableRowSelectionOnClick={true}
            rows={state.data}
            columns={userGroupGridColumns}
            filterMode="server"
            rowCount={state.actualDataCount}
            paginationMode="server"
            columnVisibilityModel={userGroupGridColumnVisibilityModel}
            onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                setUserGroupGridColumnVisibilityModel(newModel);
            }, [userGroupGridColumnVisibilityModel, props.selectedUserGroupIds])}
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
                    setGridFunction: setUserGroupAndPagination,
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
                }), [state, props.selectedUserGroupIds])}
            onPaginationModelChange={React.useCallback((newModel: GridPaginationModel) => {
                setUserGroupAndPagination({
                    includeDeleted: state.includeDeleted,
                    filterExpr: state.filterExpr,
                    pageSize: state.pageSize,
                    start: newModel.pageSize * newModel.page,
                    end: (newModel.pageSize * newModel.page) + newModel.pageSize,
                    actualDataCount: state.actualDataCount,
                    totalPaginationBlockCount: state.totalPaginationBlockCount,
                    data: state.data
                })
            }, [state, props.selectedUserGroupIds])}
            onRowSelectionModelChange={React.useCallback((newRowSelectionModel: GridRowSelectionModel) => {
                props.setSelectedUserGroupIds(newRowSelectionModel);
            }, [state, props.selectedUserGroupIds])}
            {...(props.isView ? { isRowSelectable: (params: GridRowParams) => false } : {})}
            rowSelectionModel={props.selectedUserGroupIds}
            getRowClassName={React.useCallback((params: GridRowClassNameParams) => {
                if (params.row.userGroup.deleted) {
                    return "deleted";
                }
                else {
                    return "";
                }
            }, [state, props.selectedUserGroupIds])}
        />
    );
}
export default React.memo(UserGroupSelectionGrid);