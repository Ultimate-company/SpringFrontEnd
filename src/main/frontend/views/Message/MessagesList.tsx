import {GridColDef, GridColumnVisibilityModel, GridFilterModel, GridToolbar} from "@mui/x-data-grid";
import React from "react";
import {messageApi} from "../../api/ApiCalls";
import Toolbar from "Frontend/components/Toolbar";
import { StyledDataGrid } from "Frontend/components/Datagrid/CustomDataGrid";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {CustomPaginationForGrid, PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import {filterChangeFunction} from "Frontend/components/Datagrid/CustomFilteringForDataGrid";
import {useConfirm} from "material-ui-confirm";
import CustomToolbar from "Frontend/components/Datagrid/CustomToolbar";
import {MessageResponseModel} from "Frontend/api/Models/CarrierModels/Message";
import {initMessageGridColumns} from "Frontend/api/Models/DataGridModels/MessageGridColumns";
import {useOutletContext} from "react-router-dom";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";

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

const MessagesList = () => {
    // hooks and state variables
    const confirm = useConfirm();
    const [setLoading] = useOutletContext<any>();
    const [messageGridColumns, setMessageGridColumns] = React.useState<GridColDef[]>([]);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [pickupLocationColumnVisibilityModel, setPickupLocationColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });

    // function which will take start and end and will get the messages in batches from the database
    const setMessageAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        messageApi(setLoading).getMessagesInBatches({
            columnName: paginationRequestModel.filterExpr.columnName,
            condition: paginationRequestModel.filterExpr.condition,
            filterExpr: paginationRequestModel.filterExpr.filterText,
            start: paginationRequestModel.start,
            end: paginationRequestModel.end,
            pageSize: paginationRequestModel.pageSize,
            includeDeleted: paginationRequestModel.includeDeleted,
        }).then((response: PaginationBaseResponseModel<MessageResponseModel>) => {
            messageApi(setLoading).getIncludeDeleted().then((getIncludeDeletedResponse: boolean) => {
                initMessageGridColumns(confirm, setLoading).then((columns) => {
                    setMessageGridColumns(columns);
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
        setMessageAndPagination(paginatedGridModel);
    }, []);

    return <>
        <Toolbar page = "Message"/>
        <OutletLayout card={true}>
            <CustomToolbar
                checkboxes = {[
                    {
                        checked: state.includeDeleted,
                        label: "Include Deleted",
                        onCheckboxChange: () => {
                            messageApi(setLoading).setIncludeDeleted().then(() => {
                                window.location.reload();
                            });
                        }
                    }
                ]}
            />
            <StyledDataGrid
                getRowId={(row) => row.message.messageId}
                disableRowSelectionOnClick={true}
                rows={state.data}
                columns={messageGridColumns}
                filterMode="server"
                rowCount={state.actualDataCount}
                paginationMode="server"
                columnVisibilityModel={pickupLocationColumnVisibilityModel}
                onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                    setPickupLocationColumnVisibilityModel(newModel);
                }, [pickupLocationColumnVisibilityModel])}
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
                        setGridFunction: setMessageAndPagination,
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
                onPaginationModelChange={React.useCallback((newModel: GridPaginationModel) => {
                    setMessageAndPagination({
                        includeDeleted: state.includeDeleted,
                        filterExpr: state.filterExpr,
                        pageSize: state.pageSize,
                        start: newModel.pageSize * newModel.page,
                        end: (newModel.pageSize * newModel.page) + newModel.pageSize,
                        actualDataCount: state.actualDataCount,
                        totalPaginationBlockCount: state.totalPaginationBlockCount,
                        data: state.data
                    })
                }, [state])}
                getRowClassName={React.useCallback((params: GridRowClassNameParams) => {
                    if (params.row.message.deleted) {
                        return "deleted";
                    }
                    else {
                        return "";
                    }
                }, [state])}
            />
        </OutletLayout>
    </>;
};

export default MessagesList;
