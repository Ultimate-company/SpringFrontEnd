import {StyledDataGrid} from "Frontend/components/Datagrid/CustomDataGrid";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {
    GridCellEditStopParams,
    GridCellEditStopReasons,
    GridColDef,
    GridColumnVisibilityModel,
    GridFilterModel, GridRowModel, GridRowParams,
    GridRowSelectionModel,
    GridToolbar, MuiEvent
} from "@mui/x-data-grid";
import {CustomPaginationForGrid, PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import React from "react";
import {filterChangeFunction} from "Frontend/components/Datagrid/CustomFilteringForDataGrid";
import {productApi} from "Frontend/api/ApiCalls";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import {ProductsResponseModel} from "Frontend/api/Models/CarrierModels/Product";
import {
    initProductGridColumnsForSelection
} from "Frontend/api/Models/DataGridModels/ProductGridColumns";
import {SalesOrdersProductQuantityMap} from "Frontend/api/Models/CarrierModels/SalesOrder";
import {isDateGreaterThanOrEqualToToday} from "Frontend/components/commonHelperFunctions";

interface ProductSelectionGridProps {
    setLoading: (loading: boolean) => void;
    selectedProductIds: GridRowSelectionModel;
    setSelectedProductIds: (girdRowSelectionModel: GridRowSelectionModel) => void;
    isView: boolean;
    isRowSelectable?: boolean;
    showCheckboxSelection?: boolean;
    viewOnlySelected?: boolean;
    singleSelection: boolean;
    productIdQuantityMapping?: Map<number, number>;
    setProductIdQuantityMapping?: (mapping: Map<number, number>) => void;
    productIdQuantityCustomPriceMapping?: SalesOrdersProductQuantityMap[];
    setProductIdQuantityCustomPriceMapping?: (mapping: SalesOrdersProductQuantityMap[]) => void;
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

const ProductSelectionGrid = (props: ProductSelectionGridProps) => {
    // state variables
    const [productGridColumns, setProductGridColumns] = React.useState<GridColDef[]>([]);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [productGridColumnVisibilityModel, setProductGridColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });

    // function which will take start and end and will get the messages in batches from the database
    const setProductsAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        if(props.viewOnlySelected != undefined && props.viewOnlySelected) {
            // do nothing
            initProductGridColumnsForSelection(props.productIdQuantityMapping,
                props.setProductIdQuantityMapping,
                props.productIdQuantityCustomPriceMapping,
                props.setProductIdQuantityCustomPriceMapping).then((columns) => {
                setProductGridColumns(columns);
            });
            productApi(props.setLoading)
                .getProductDetailsByIds(props.selectedProductIds.map(productId => parseInt(productId.toString())))
                .then((response: ProductsResponseModel[]) => {
                    setState({
                        ...state,
                        data: response
                    });
                });
        }
        else {
            productApi(props.setLoading).getProductsInBatches({
                columnName: paginationRequestModel.filterExpr.columnName,
                condition: paginationRequestModel.filterExpr.condition,
                filterExpr: paginationRequestModel.filterExpr.filterText,
                start: paginationRequestModel.start,
                end: paginationRequestModel.end,
                pageSize: paginationRequestModel.pageSize,
                includeDeleted: paginationRequestModel.includeDeleted,
                selectedIds: props.selectedProductIds.map(productId => parseInt(productId.toString()))
            }).then((response: PaginationBaseResponseModel<ProductsResponseModel>) => {
                productApi(props.setLoading).getIncludeDeleted().then((getIncludeDeletedResponse: boolean) => {
                    initProductGridColumnsForSelection(props.productIdQuantityMapping,
                        props.setProductIdQuantityMapping,
                        props.productIdQuantityCustomPriceMapping,
                        props.setProductIdQuantityCustomPriceMapping).then((columns) => {
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
                            }
                        });
                    });
                });
            });
        }
    };

    React.useEffect(() => {
        setProductsAndPagination(paginatedGridModel);
    }, [props.productIdQuantityMapping]);

    if(props.viewOnlySelected != undefined && props.viewOnlySelected) {
        return (
            <StyledDataGrid
                rowHeight = {100}
                getRowId={(row) => row.product.productId}
                rows={state.data}
                columns={productGridColumns}
                isCellEditable={(params) => true}
                // isCellEditable={(params) => !props.isView &&
                //     params.row.product.itemAvailableFrom &&
                //     isDateGreaterThanOrEqualToToday(params.row.product.itemAvailableFrom)
                // }
                processRowUpdate={(newRow, oldRow) =>
                    new Promise<GridRowModel>((resolve) => {
                        //newRow.quantity = calculateNewQuantity(newRow); // Replace calculateNewQuantity with your logic
                        if(props.productIdQuantityCustomPriceMapping && props.setProductIdQuantityCustomPriceMapping) {
                            const updatedMapping = [...props.productIdQuantityCustomPriceMapping];
                            for(let i=0; i<updatedMapping.length; i++) {
                                if(updatedMapping[i].productId == newRow.product.productId) {
                                    updatedMapping[i].pricePerQuantityPerProduct = newRow.pricePerQuantity;
                                    break;
                                }
                            }
                            props.setProductIdQuantityCustomPriceMapping(updatedMapping);
                        }
                        else if (props.productIdQuantityMapping && props.setProductIdQuantityMapping) {
                            props.productIdQuantityMapping.set(newRow.product.productId, newRow.quantity);
                            props.setProductIdQuantityMapping(props.productIdQuantityMapping);
                        }
                        resolve(newRow);
                    })
                }
                columnVisibilityModel={productGridColumnVisibilityModel}
                onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                    setProductGridColumnVisibilityModel(newModel);
                }, [productGridColumnVisibilityModel, props.selectedProductIds, props.productIdQuantityCustomPriceMapping, props.productIdQuantityMapping])}
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
            />
        )
    }

    return (
        <StyledDataGrid
            keepNonExistentRowsSelected
            checkboxSelection={props.showCheckboxSelection}
            rowHeight = {100}
            disableMultipleRowSelection={props.singleSelection}
            getRowId={(row) => row.product.productId}
            disableRowSelectionOnClick={true}
            rows={state.data}
            columns={productGridColumns}
            filterMode="server"
            rowCount={state.actualDataCount}
            paginationMode="server"
            isCellEditable={(params) => !props.isView &&
                params.row.product.itemAvailableFrom &&
                isDateGreaterThanOrEqualToToday(params.row.product.itemAvailableFrom)
            }
            processRowUpdate={(newRow, oldRow) =>
                new Promise<GridRowModel>((resolve) => {
                    //newRow.quantity = calculateNewQuantity(newRow); // Replace calculateNewQuantity with your logic
                    if(props.productIdQuantityCustomPriceMapping && props.setProductIdQuantityCustomPriceMapping) {
                        const updatedMapping = [...props.productIdQuantityCustomPriceMapping];
                        for(let i=0; i<updatedMapping.length; i++) {
                            if(updatedMapping[i].productId == newRow.product.productId) {
                                updatedMapping[i].pricePerQuantityPerProduct = newRow.pricePerQuantity;
                                break;
                            }
                        }
                        props.setProductIdQuantityCustomPriceMapping(updatedMapping);
                    }
                    else if (props.productIdQuantityMapping && props.setProductIdQuantityMapping) {
                        props.productIdQuantityMapping.set(newRow.product.productId, newRow.quantity);
                        props.setProductIdQuantityMapping(props.productIdQuantityMapping);
                    }
                    resolve(newRow);
                })
            }
            columnVisibilityModel={productGridColumnVisibilityModel}
            onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                setProductGridColumnVisibilityModel(newModel);
            }, [productGridColumnVisibilityModel, props.selectedProductIds, props.productIdQuantityCustomPriceMapping, props.productIdQuantityMapping])}
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
                    setGridFunction: setProductsAndPagination,
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
                }), [state, props.selectedProductIds, props.productIdQuantityCustomPriceMapping, props.productIdQuantityMapping])}
            onPaginationModelChange={React.useCallback((newModel: GridPaginationModel) => {
                setProductsAndPagination({
                    includeDeleted: state.includeDeleted,
                    filterExpr: state.filterExpr,
                    pageSize: state.pageSize,
                    start: newModel.pageSize * newModel.page,
                    end: (newModel.pageSize * newModel.page) + newModel.pageSize,
                    actualDataCount: state.actualDataCount,
                    totalPaginationBlockCount: state.totalPaginationBlockCount,
                    data: state.data
                })
            }, [state, props.selectedProductIds, props.productIdQuantityCustomPriceMapping, props.productIdQuantityMapping])}
            onRowSelectionModelChange={React.useCallback((newRowSelectionModel: GridRowSelectionModel) => {
                props.setSelectedProductIds(newRowSelectionModel);
            }, [state, props.selectedProductIds, props.productIdQuantityCustomPriceMapping, props.productIdQuantityMapping])}

            {...((props.isRowSelectable && !props.isRowSelectable) || props.isView ? { isRowSelectable: (params: GridRowParams) => false } : {})}
            rowSelectionModel={props.selectedProductIds}
            getRowClassName={React.useCallback((params: GridRowClassNameParams) => {
                if (params.row.deleted) {
                    return "deleted";
                }
                else {
                    return "";
                }
            }, [state, props.selectedProductIds, props.productIdQuantityCustomPriceMapping, props.productIdQuantityMapping])}
        />
    );
}

export default React.memo(ProductSelectionGrid);