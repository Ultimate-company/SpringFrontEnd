import Toolbar from "Frontend/components/Toolbar";
import CustomToolbar from "Frontend/components/Datagrid/CustomToolbar";
import {gridApi, supportApi} from "Frontend/api/ApiCalls";
import React from "react";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import {CustomPaginationForGrid, PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import {useConfirm} from "material-ui-confirm";
import {useOutletContext} from "react-router-dom";
import {GridColDef, GridColumnVisibilityModel, GridDensity, GridFilterModel, GridToolbar} from "@mui/x-data-grid";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {filterChangeFunction} from "Frontend/components/Datagrid/CustomFilteringForDataGrid";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";
import {StyledDataGrid} from "Frontend/components/Datagrid/CustomDataGrid";
import {initSupportGridColumns} from "Frontend/api/Models/DataGridModels/SupportGridColumns";
import {GetTicketsResponseModel, Issue} from "Frontend/api/Models/CarrierModels/Support";
import {
    GridId,
    GridPreferenceRequestModel,
    UserGridPreference
} from "Frontend/api/Models/CarrierModels/UserGridPreference";

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
const gridPreference: UserGridPreference = {
    density: "standard"
}

const SupportList = () => {
    // hooks and state variables
    const confirm = useConfirm();
    const [setLoading] = useOutletContext<any>();
    const [supportGridColumns, setSupportGridColumns] = React.useState<GridColDef[]>([]);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [supportColumnVisibilityModel, setSupportColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });
    const [userGridPreference, setUserGridPreference] = React.useState<UserGridPreference>(gridPreference);

    // function which will take start and end and will get the messages in batches from the database
    const setSupportAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        supportApi(setLoading).getSupportTicketsInBatches(paginationRequestModel.start, paginationRequestModel.end)
            .then((response: GetTicketsResponseModel) => {
            supportApi(setLoading).getIncludeDeleted().then((getIncludeDeletedResponse: boolean) => {
                initSupportGridColumns(confirm, setLoading).then((columns) => {
                    setSupportGridColumns(columns);
                    setState({
                        ...state,
                        data: response.issues as Issue[],
                        totalPaginationBlockCount: Math.ceil(
                            response.total as number / paginationRequestModel.pageSize
                        ),
                        includeDeleted: getIncludeDeletedResponse,
                        actualDataCount: response.total ?? 0,
                        start: paginationRequestModel.start,
                        end: paginationRequestModel.end,
                        filterExpr: {
                            columnName: paginationRequestModel.filterExpr.columnName,
                            condition: paginationRequestModel.filterExpr.condition,
                            filterText: paginationRequestModel.filterExpr.filterText,
                        },
                        pageSize: paginationRequestModel.pageSize
                    });
                });
            });
        });
    };

    React.useEffect(() => {
        gridApi(setLoading)
            .getGridVisibilityPreference(GridId.SUPPORT)
            .then((response: UserGridPreference) => {
                if(response) {
                    let prevState:PaginatedGridInterface = state;
                    setUserGridPreference(response);
                    if(response.rowsPerPage) {
                        prevState.pageSize = response.rowsPerPage;
                    }
                    if(response.visibilityModel) {
                        setSupportColumnVisibilityModel(JSON.parse(response.visibilityModel as string) as GridColumnVisibilityModel);
                    }
                    setSupportAndPagination(prevState);
                }
            });
    }, []);


    return (
        <>
            <Toolbar page = "Support"/>
            <OutletLayout card={true}>
                <CustomToolbar
                    checkboxes = {[
                        {
                            checked: state.includeDeleted,
                            label: "Include Deleted",
                            onCheckboxChange: () => {
                                supportApi(setLoading).setIncludeDeleted().then(() => {
                                    window.location.reload();
                                });
                            }
                        }
                    ]}
                />
                <StyledDataGrid
                    getRowId={(row) => row.id}
                    disableRowSelectionOnClick={true}
                    rows={state.data}
                    columns={supportGridColumns}
                    filterMode="server"
                    rowCount={state.actualDataCount}
                    paginationMode="server"
                    columnVisibilityModel={supportColumnVisibilityModel}
                    onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                        gridApi(setLoading).updateGridVisibilityPreference({
                            visibilityJsonBody: JSON.stringify(newModel),
                            gridId: GridId.SUPPORT
                        } as GridPreferenceRequestModel);
                        setSupportColumnVisibilityModel(newModel);
                    }, [supportColumnVisibilityModel])}
                    onDensityChange = {(newModel: string) => {
                        setUserGridPreference({
                            ...userGridPreference,
                            density: newModel
                        });
                        gridApi(setLoading).updateGridDensityVisibilityPreference({
                            density: newModel,
                            gridId: GridId.SUPPORT
                        } as GridPreferenceRequestModel);
                    }}
                    density={userGridPreference.density as GridDensity}
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
                            setGridFunction: setSupportAndPagination,
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
                        }), [state])}
                    paginationModel={{page: Math.floor(state.start/state.pageSize), pageSize: state.pageSize}}
                    onPaginationModelChange={React.useCallback((newModel: GridPaginationModel) => {
                        if(newModel.pageSize != state.pageSize) {
                            gridApi(setLoading).updateRowsPerPagePreference({
                                rowsPerPage: newModel.pageSize,
                                gridId: GridId.SUPPORT
                            } as GridPreferenceRequestModel);
                        }
                        setSupportAndPagination({
                            includeDeleted: state.includeDeleted,
                            filterExpr: state.filterExpr,
                            pageSize: newModel.pageSize,
                            start: newModel.pageSize * newModel.page,
                            end: (newModel.pageSize * newModel.page) + newModel.pageSize,
                            actualDataCount: state.actualDataCount,
                            totalPaginationBlockCount: state.totalPaginationBlockCount,
                            data: state.data
                        })
                    }, [state])}
                    getRowClassName={React.useCallback((params: GridRowClassNameParams) => {
                        if (params.row.deleted) {
                            return "deleted";
                        }
                        else {
                            return "";
                        }
                    }, [state])}
                />
            </OutletLayout>
        </>
    );
}

export default SupportList;