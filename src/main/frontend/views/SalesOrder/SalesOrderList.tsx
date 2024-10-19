import {GridColDef, GridColumnVisibilityModel, GridFilterModel, GridToolbar} from "@mui/x-data-grid";
import React from "react";
import Toolbar from "Frontend/components/Toolbar";
import {StyledDataGrid} from "Frontend/components/Datagrid/CustomDataGrid";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {CustomPaginationForGrid, PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import {filterChangeFunction} from "Frontend/components/Datagrid/CustomFilteringForDataGrid";
import {useConfirm} from "material-ui-confirm";
import {salesOrderApi} from "Frontend/api/ApiCalls";
import {
    GetSalesOrdersRequestModel,
    SalesOrderResponseModel,
    SalesOrderStatus
} from "Frontend/api/Models/CarrierModels/SalesOrder";
import {initSalesOrderGridColumns} from "Frontend/api/Models/DataGridModels/SalesOrderGridColumns";
import {useOutletContext} from "react-router-dom";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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

interface TabPanelProps {
    salesorderstatus: SalesOrderStatus;
    index: number;
    value: number;
    state: PaginatedGridInterface;
    salesOrderGridColumns: GridColDef[];
    salesOrderColumnVisibilityModel: GridColumnVisibilityModel;
    setSalesOrderAndPagination: (paginationRequestModel: PaginatedGridInterface) => void;
    setSalesOrderColumnVisibilityModel: (salesOrderColumnVisibilityModel: GridColumnVisibilityModel) => void;
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function CustomTabPanel(props: TabPanelProps) {
    // hooks and state variables
    const {value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index &&
                <Box sx={{ p: 3 }}>
                    <StyledDataGrid
                        getRowId={(row) => row.salesOrder.salesOrderId}
                        disableRowSelectionOnClick={true}
                        rows={props.state.data}
                        columns={props.salesOrderGridColumns}
                        filterMode="server"
                        rowCount={props.state.actualDataCount}
                        paginationMode="server"
                        columnVisibilityModel={props.salesOrderColumnVisibilityModel}
                        onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                            props.setSalesOrderColumnVisibilityModel(newModel);
                        }, [props.salesOrderColumnVisibilityModel])}
                        slots={{
                            noRowsOverlay: CustomNoRowsOverlay,
                            toolbar: GridToolbar,
                            pagination: () =>
                                <CustomPaginationForGrid
                                    pageSize={props.state.pageSize}
                                />,
                        }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: props.state.pageSize } },
                        }}
                        pageSizeOptions={[10, 25, 100]}
                        onFilterModelChange={React.useCallback((filterModel: GridFilterModel) =>
                            filterChangeFunction({
                                gridFilterModel: filterModel,
                                setGridFunction: props.setSalesOrderAndPagination,
                                paginatedGridModel: {
                                    includeDeleted: props.state.includeDeleted,
                                    filterExpr: props.state.filterExpr,
                                    pageSize: props.state.pageSize,
                                    start: 0,
                                    end: props.state.pageSize,
                                    actualDataCount: props.state.actualDataCount,
                                    totalPaginationBlockCount: props.state.totalPaginationBlockCount,
                                    data: props.state.data
                                }
                            }), [props.state])}
                        onPaginationModelChange={React.useCallback((newModel: GridPaginationModel) => {
                            props.setSalesOrderAndPagination({
                                includeDeleted: props.state.includeDeleted,
                                filterExpr: props.state.filterExpr,
                                pageSize: props.state.pageSize,
                                start: newModel.pageSize * newModel.page,
                                end: (newModel.pageSize * newModel.page) + newModel.pageSize,
                                actualDataCount: props.state.actualDataCount,
                                totalPaginationBlockCount: props.state.totalPaginationBlockCount,
                                data: props.state.data
                            })
                        }, [props.state])}
                        getRowClassName={React.useCallback((params: GridRowClassNameParams) => {
                            if (params.row.salesOrder.deleted) {
                                return "deleted";
                            }
                            else {
                                return "";
                            }
                        }, [props.state])}
                    />
                </Box>
            }
        </div>
    );
}


const SalesOrdersList = () => {
    // state and function for tabs
    const [value, setValue] = React.useState(SalesOrderStatus.ORDER_RECEIVED);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const confirm = useConfirm();
    const [setLoading] = useOutletContext<any>();
    const [salesOrderGridColumns, setSalesOrderGridColumns] = React.useState<GridColDef[]>([]);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [salesOrderColumnVisibilityModel, setSalesOrderColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            deleted: false
        });

    // function which will take start and end and will get the messages in batches from the database
    const setSalesOrderAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        salesOrderApi(setLoading).getSalesOrdersInBatches({
            columnName: paginationRequestModel.filterExpr.columnName,
            condition: paginationRequestModel.filterExpr.condition,
            filterExpr: paginationRequestModel.filterExpr.filterText,
            start: paginationRequestModel.start,
            end: paginationRequestModel.end,
            pageSize: paginationRequestModel.pageSize,
            includeDeleted: paginationRequestModel.includeDeleted,
            salesOrderStatus: [value]
        } as GetSalesOrdersRequestModel).then((response: PaginationBaseResponseModel<SalesOrderResponseModel>) => {
            salesOrderApi(setLoading).getIncludeDeleted().then((getIncludeDeletedResponse: boolean) => {
                initSalesOrderGridColumns(confirm, setLoading).then((columns) => {
                    setSalesOrderGridColumns(columns);
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
        setSalesOrderAndPagination(paginatedGridModel);
    }, [value]);

    const salesOrderStatuses = [
        SalesOrderStatus.ORDER_RECEIVED,
        SalesOrderStatus.ORDER_PICKED,
        SalesOrderStatus.ORDER_IN_TRANSIT,
        SalesOrderStatus.OUT_FOR_DELIVERY,
        SalesOrderStatus.DELIVERED,
        SalesOrderStatus.CANCELLED,
        SalesOrderStatus.RETURNED,
        SalesOrderStatus.PARTIAL_RETURN
    ];

    return <>
        <Toolbar page = "SalesOrder"/>
        <OutletLayout card={true}>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab value={SalesOrderStatus.ORDER_RECEIVED} label="Order Received" {...a11yProps(1)}/>
                    <Tab value={SalesOrderStatus.ORDER_PICKED} label="Order Picked" {...a11yProps(2)}/>
                    <Tab value={SalesOrderStatus.ORDER_IN_TRANSIT} label="Order In Transit" {...a11yProps(3)}/>
                    <Tab value={SalesOrderStatus.OUT_FOR_DELIVERY} label="Out For Delivery" {...a11yProps(4)}/>
                    <Tab value={SalesOrderStatus.DELIVERED} label="Delivered" {...a11yProps(5)}/>
                    <Tab value={SalesOrderStatus.CANCELLED} label="Cancelled" {...a11yProps(6)}/>
                    <Tab value={SalesOrderStatus.RETURNED} label="Returned" {...a11yProps(7)}/>
                    <Tab value={SalesOrderStatus.PARTIAL_RETURN} label="Partial Returned" {...a11yProps(8)}/>
                </Tabs>
            </Box>
            {
                salesOrderStatuses.map((salesOrderStatus: SalesOrderStatus, i: number) => (
                    <CustomTabPanel
                        value={value}
                        key={salesOrderStatus}
                        salesorderstatus={salesOrderStatus}
                        index={i + 1}
                        state={state}
                        salesOrderGridColumns={salesOrderGridColumns}
                        salesOrderColumnVisibilityModel={salesOrderColumnVisibilityModel}
                        setSalesOrderColumnVisibilityModel={setSalesOrderColumnVisibilityModel}
                        setSalesOrderAndPagination={setSalesOrderAndPagination}
                    />
                ))
            }
        </OutletLayout>
    </>;
};

export default SalesOrdersList;