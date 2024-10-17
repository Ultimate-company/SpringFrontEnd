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
import {leadApi, userApi} from "Frontend/api/ApiCalls";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import {User} from "Frontend/api/Models/CentralModels/User";
import {initUserColumnsForSelection, initUserGridColumns} from "Frontend/api/Models/DataGridModels/UserGridColumns";
import {initLeadGridColumns, initLeadGridColumnsForSelection} from "Frontend/api/Models/DataGridModels/LeadGridColumns";
import {LeadResponseModel} from "Frontend/api/Models/CarrierModels/Lead";

interface GroupSelectionGridProps {
    setLoading: (loading: boolean) => void;
    selectedLeadIds: GridRowSelectionModel;
    setSelectedLeadIds: (girdRowSelectionModel: GridRowSelectionModel) => void;
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

const LeadSelectionGrid = (props: GroupSelectionGridProps) => {
    // state variables
    const [leadGridColumns, setLeadGridColumns] = React.useState<GridColDef[]>([]);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [leadGridColumnVisibilityModel, setLeadGridColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });

    // function which will take start and end and will get the messages in batches from the database
    const setLeadsAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        leadApi(props.setLoading).getLeadsInBatches({
            columnName: paginationRequestModel.filterExpr.columnName,
            condition: paginationRequestModel.filterExpr.condition,
            filterExpr: paginationRequestModel.filterExpr.filterText,
            start: paginationRequestModel.start,
            end: paginationRequestModel.end,
            pageSize: paginationRequestModel.pageSize,
            includeDeleted: paginationRequestModel.includeDeleted,
            selectedIds: props.selectedLeadIds.map(leadId => parseInt(leadId.toString()))
        }).then((response: PaginationBaseResponseModel<LeadResponseModel>) => {
            leadApi(props.setLoading).getIncludeDeleted().then((getIncludeDeletedResponse: boolean) => {
                initLeadGridColumnsForSelection().then((columns) => {
                    setLeadGridColumns(columns);
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
        setLeadsAndPagination(paginatedGridModel);
    }, []);

    return (
        <StyledDataGrid
            keepNonExistentRowsSelected
            checkboxSelection
            disableMultipleRowSelection={props.singleSelection}
            getRowId={(row) => row.lead.leadId}
            disableRowSelectionOnClick={true}
            rows={state.data}
            columns={leadGridColumns}
            filterMode="server"
            rowCount={state.actualDataCount}
            paginationMode="server"
            columnVisibilityModel={leadGridColumnVisibilityModel}
            onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                setLeadGridColumnVisibilityModel(newModel);
            }, [leadGridColumnVisibilityModel, props.selectedLeadIds])}
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
                    setGridFunction: setLeadsAndPagination,
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
                }), [state, props.selectedLeadIds])}
            onPaginationModelChange={React.useCallback((newModel: GridPaginationModel) => {
                setLeadsAndPagination({
                    includeDeleted: state.includeDeleted,
                    filterExpr: state.filterExpr,
                    pageSize: state.pageSize,
                    start: newModel.pageSize * newModel.page,
                    end: (newModel.pageSize * newModel.page) + newModel.pageSize,
                    actualDataCount: state.actualDataCount,
                    totalPaginationBlockCount: state.totalPaginationBlockCount,
                    data: state.data
                })
            }, [state, props.selectedLeadIds])}
            onRowSelectionModelChange={React.useCallback((newRowSelectionModel: GridRowSelectionModel) => {
                props.setSelectedLeadIds(newRowSelectionModel);
            }, [state, props.selectedLeadIds])}
            {...(props.isView ? { isRowSelectable: (params: GridRowParams) => false } : {})}
            rowSelectionModel={props.selectedLeadIds}
            getRowClassName={React.useCallback((params: GridRowClassNameParams) => {
                if (params.row.lead.deleted) {
                    return "deleted";
                }
                else {
                    return "";
                }
            }, [state, props.selectedLeadIds])}
        />
    );
}
export default React.memo(LeadSelectionGrid);