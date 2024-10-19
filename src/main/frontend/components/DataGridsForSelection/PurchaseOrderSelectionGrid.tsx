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
import {purchaseOrderApi} from "Frontend/api/ApiCalls";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import {PurchaseOrderResponseModel} from "Frontend/api/Models/CarrierModels/PurchaseOrder";
import {initPurchaseOrderColumnsForSelection} from "Frontend/api/Models/DataGridModels/PurchaseOrderGridColumns";

interface PurchaseOrderSelectionGridProps {
    setLoading: (loading: boolean) => void;
    selectedPurchaseOrderIds: GridRowSelectionModel;
    setSelectedPurchaseOrderIds: (girdRowSelectionModel: GridRowSelectionModel) => void;
    isView: boolean;
    singleSelection: boolean;
    approvedOnly: boolean;
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
const PurchaseOrderSelectionGrid = (props: PurchaseOrderSelectionGridProps) => {
    // state variables
    const [purchaseOrderGridColumns,setPurchaseOrderGridColumns] = React.useState<GridColDef[]>([]);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [purchaseOrderGridColumnVisibilityModel, setPurchaseOrderGridColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });

    // function which will take start and end and will get the messages in batches from the database
    const setPurchaseOrderAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        purchaseOrderApi(props.setLoading).getPurchaseOrdersInBatches({
            columnName: paginationRequestModel.filterExpr.columnName,
            condition: paginationRequestModel.filterExpr.condition,
            filterExpr: paginationRequestModel.filterExpr.filterText,
            start: paginationRequestModel.start,
            end: paginationRequestModel.end,
            pageSize: paginationRequestModel.pageSize,
            includeDeleted: paginationRequestModel.includeDeleted,
            selectedIds: props.selectedPurchaseOrderIds.map(purchaseOrderId => parseInt(purchaseOrderId.toString()))
        }).then((response: PaginationBaseResponseModel<PurchaseOrderResponseModel>) => {
            purchaseOrderApi(props.setLoading).getIncludeDeleted().then((getIncludeDeletedResponse: boolean) => {
                initPurchaseOrderColumnsForSelection().then((columns) => {
                    setPurchaseOrderGridColumns(columns);
                    setState({
                        ...state,
                        data: props.approvedOnly ? response.data.filter(po => po.approvedByUser != undefined && po.purchaseOrder.salesOrderId == undefined)
                            : response.data,
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
        setPurchaseOrderAndPagination(paginatedGridModel);
    }, []);

    return (
        <StyledDataGrid
            keepNonExistentRowsSelected
            checkboxSelection
            disableMultipleRowSelection={props.singleSelection}
            getRowId={(row) => row.purchaseOrder.purchaseOrderId}
            disableRowSelectionOnClick={true}
            rows={state.data}
            columns={purchaseOrderGridColumns}
            filterMode="server"
            rowCount={state.actualDataCount}
            paginationMode="server"
            columnVisibilityModel={purchaseOrderGridColumnVisibilityModel}
            onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                setPurchaseOrderGridColumnVisibilityModel(newModel);
            }, [purchaseOrderGridColumnVisibilityModel, props.selectedPurchaseOrderIds])}
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
                    setGridFunction: setPurchaseOrderAndPagination,
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
                }), [state, props.selectedPurchaseOrderIds])}
            onPaginationModelChange={React.useCallback((newModel: GridPaginationModel) => {
                setPurchaseOrderAndPagination({
                    includeDeleted: state.includeDeleted,
                    filterExpr: state.filterExpr,
                    pageSize: state.pageSize,
                    start: newModel.pageSize * newModel.page,
                    end: (newModel.pageSize * newModel.page) + newModel.pageSize,
                    actualDataCount: state.actualDataCount,
                    totalPaginationBlockCount: state.totalPaginationBlockCount,
                    data: state.data
                })
            }, [state, props.selectedPurchaseOrderIds])}
            onRowSelectionModelChange={React.useCallback((newRowSelectionModel: GridRowSelectionModel) => {
                props.setSelectedPurchaseOrderIds(newRowSelectionModel);
            }, [state, props.selectedPurchaseOrderIds])}
            {...(props.isView ? { isRowSelectable: (_: GridRowParams) => false } : {})}
            rowSelectionModel={props.selectedPurchaseOrderIds}
            getRowClassName={React.useCallback((params: GridRowClassNameParams) => {
                if (params.row.purchaseOrder.deleted) {
                    return "deleted";
                }
                else {
                    return "";
                }
            }, [state, props.selectedPurchaseOrderIds])}
        />
    );
}
export default React.memo(PurchaseOrderSelectionGrid);