import {GridColDef, GridColumnVisibilityModel, GridDensity, GridFilterModel, GridToolbar} from "@mui/x-data-grid";
import React from "react";
import {gridApi, packageApi, userApi} from "../../api/ApiCalls";
import Toolbar from "Frontend/components/Toolbar";
import { StyledDataGrid } from "Frontend/components/Datagrid/CustomDataGrid";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {CustomPaginationForGrid, PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import {filterChangeFunction} from "Frontend/components/Datagrid/CustomFilteringForDataGrid";
import {useConfirm} from "material-ui-confirm";
import CustomToolbar from "Frontend/components/Datagrid/CustomToolbar";
import {initPackageGridColumns} from "Frontend/api/Models/DataGridModels/PackageGridColumns";
import {useOutletContext} from "react-router-dom";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import {Package} from "Frontend/api/Models/CarrierModels/Package";
import {
    GridId,
    GridPreferenceRequestModel,
    UserGridPreference
} from "Frontend/api/Models/CarrierModels/UserGridPreference";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";

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

const PackageList = () => {
    // hooks and state variables
    const confirm = useConfirm();
    const [setLoading] = useOutletContext<any>();
    const [showToolbar, setShowToolbar] = React.useState(false);
    const [packageGridColumns, setPackageGridColumns] = React.useState<GridColDef[]>([]);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [packageColumnVisibilityModel, setPackageColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });
    const [userGridPreference, setUserGridPreference] = React.useState<UserGridPreference>(gridPreference);

    // function which will take start and end and will get the messages in batches from the database
    const setPackageAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        packageApi(setLoading).getPackagesInBatches({
            columnName: paginationRequestModel.filterExpr.columnName,
            condition: paginationRequestModel.filterExpr.condition,
            filterExpr: paginationRequestModel.filterExpr.filterText,
            start: paginationRequestModel.start,
            end: paginationRequestModel.end,
            pageSize: paginationRequestModel.pageSize,
            includeDeleted: paginationRequestModel.includeDeleted,
        }).then((response: PaginationBaseResponseModel<Package>) => {
            packageApi(setLoading).getIncludeDeleted().then((getIncludeDeletedResponse: boolean) => {
                initPackageGridColumns(confirm, setLoading).then((columns) => {
                    setPackageGridColumns(columns);
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
                        },
                        pageSize: paginationRequestModel.pageSize
                    });
                });
            });
        });
    };

    React.useEffect(() => {
        // check user permissions to insert package
        userApi((loading: boolean) => {}).getLoggedInUserPermissions().then(function (permissions: Permissions) {
            const permissionSplit = Object.values(permissions)
                .flatMap(str => typeof str === 'string'? str.split(',') : []);
            if(permissionSplit.includes(permissionChecks.packagePermissions.insertPackages)){
                setShowToolbar(true);
            }
        });

        // get user grid preferences
        gridApi(setLoading)
            .getGridVisibilityPreference(GridId.PACKAGES)
            .then((response: UserGridPreference) => {
                if(!response) {
                    response = gridPreference;
                }

                let prevState:PaginatedGridInterface = state;
                setUserGridPreference(response);
                if(response.rowsPerPage) {
                    prevState.pageSize = response.rowsPerPage;
                }
                if(response.visibilityModel) {
                    setPackageColumnVisibilityModel(JSON.parse(response.visibilityModel as string) as GridColumnVisibilityModel);
                }
                setPackageAndPagination(paginatedGridModel);
            });
    }, []);

    return <>
        {showToolbar ? (
            <Toolbar page = "Package" setLoading={setLoading}/>
        ) : <></>}
        <OutletLayout card={true}>
            <CustomToolbar
                checkboxes = {[
                    {
                        checked: state.includeDeleted,
                        label: "Include Deactivated",
                        onCheckboxChange: () => {
                            packageApi(setLoading).setIncludeDeleted().then((_ : boolean) => {
                                window.location.reload();
                            });
                        }
                    }
                ]}
            />
            <StyledDataGrid
                getRowId={(row) => row.packageId}
                disableRowSelectionOnClick={true}
                rows={state.data}
                columns={packageGridColumns}
                filterMode="server"
                rowCount={state.actualDataCount}
                paginationMode="server"
                columnVisibilityModel={packageColumnVisibilityModel}
                onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                    gridApi(setLoading).updateGridVisibilityPreference({
                        visibilityJsonBody: JSON.stringify(newModel),
                        gridId: GridId.PACKAGES
                    } as GridPreferenceRequestModel);
                    setPackageColumnVisibilityModel(newModel);
                }, [packageColumnVisibilityModel])}
                onDensityChange = {(newModel: string) => {
                    setUserGridPreference({
                        ...userGridPreference,
                        density: newModel
                    });
                    gridApi(setLoading).updateGridDensityVisibilityPreference({
                        density: newModel,
                        gridId: GridId.PACKAGES
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
                        setGridFunction: setPackageAndPagination,
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
                            gridId: GridId.PACKAGES
                        } as GridPreferenceRequestModel);
                    }
                    setPackageAndPagination({
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
                        return params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
                    }
                }, [state])}
            />
        </OutletLayout>
    </>;
};

export default PackageList;
