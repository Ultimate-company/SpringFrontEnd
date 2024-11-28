import {GridColDef, GridColumnVisibilityModel, GridDensity, GridFilterModel, GridToolbar} from "@mui/x-data-grid";
import React from "react";
import Toolbar from "Frontend/components/Toolbar";
import { StyledDataGrid } from "Frontend/components/Datagrid/CustomDataGrid";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {CustomPaginationForGrid, PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import {filterChangeFunction} from "Frontend/components/Datagrid/CustomFilteringForDataGrid";
import {useConfirm} from "material-ui-confirm";
import CustomToolbar from "Frontend/components/Datagrid/CustomToolbar";
import {gridApi, productApi} from "Frontend/api/ApiCalls";
import {ProductsResponseModel} from "Frontend/api/Models/CarrierModels/Product";
import {initProductGridColumns} from "Frontend/api/Models/DataGridModels/ProductGridColumns";
import {useOutletContext} from "react-router-dom";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
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

const ProductsList = () => {
    // hooks and state variables
    const confirm = useConfirm();
    const [setLoading] = useOutletContext<any>();
    const [productGridColumns, setProductGridColumns] = React.useState<GridColDef[]>([]);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [productColumnVisibilityModel, setProductColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });
    const [userGridPreference, setUserGridPreference] = React.useState<UserGridPreference>(gridPreference);

    // function which will take start and end and will get the messages in batches from the database
    const setProductAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        productApi(setLoading).getProductsInBatches({
            columnName: paginationRequestModel.filterExpr.columnName,
            condition: paginationRequestModel.filterExpr.condition,
            filterExpr: paginationRequestModel.filterExpr.filterText,
            start: paginationRequestModel.start,
            end: paginationRequestModel.end,
            pageSize: paginationRequestModel.pageSize,
            includeDeleted: paginationRequestModel.includeDeleted,
        }).then((response: PaginationBaseResponseModel<ProductsResponseModel>) => {
            productApi(setLoading).getIncludeDeleted().then((getIncludeDeletedResponse: boolean) => {
                initProductGridColumns(confirm, setLoading).then((columns) => {
                    setProductGridColumns(columns);
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
        gridApi(setLoading)
            .getGridVisibilityPreference(GridId.PRODUCT)
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
                    setProductColumnVisibilityModel(JSON.parse(response.visibilityModel as string) as GridColumnVisibilityModel);
                }
                setProductAndPagination(paginatedGridModel);
            });
    }, []);

    return <>
        <Toolbar page = "Product" setLoading={setLoading}/>
        <OutletLayout card={true}>
            <CustomToolbar
                checkboxes = {[
                    {
                        checked: state.includeDeleted,
                        label: "Include Deactivated",
                        onCheckboxChange: () => {
                            productApi(setLoading).setIncludeDeleted().then(() => {
                                window.location.reload();
                            });
                        }
                    }
                ]}
            />
            <StyledDataGrid
                rowHeight = {180}
                getRowId={(row) => row.product.productId}
                disableRowSelectionOnClick={true}
                rows={state.data}
                columns={productGridColumns}
                filterMode="server"
                rowCount={state.actualDataCount}
                paginationMode="server"
                columnVisibilityModel={productColumnVisibilityModel}
                onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                    gridApi(setLoading).updateGridVisibilityPreference({
                        visibilityJsonBody: JSON.stringify(newModel),
                        gridId: GridId.PRODUCT
                    } as GridPreferenceRequestModel);
                    setProductColumnVisibilityModel(newModel);
                }, [productColumnVisibilityModel])}
                onDensityChange = {(newModel: string) => {
                    setUserGridPreference({
                        ...userGridPreference,
                        density: newModel
                    });
                    gridApi(setLoading).updateGridDensityVisibilityPreference({
                        density: newModel,
                        gridId: GridId.PRODUCT
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
                        setGridFunction: setProductAndPagination,
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
                            gridId: GridId.PRODUCT
                        } as GridPreferenceRequestModel);
                    }
                    setProductAndPagination({
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
                    if (params.row.product.deleted) {
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

export default ProductsList;
