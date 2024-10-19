import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";
import React from "react";
import {ConfirmOptions} from "material-ui-confirm";
import Chip from '@mui/material/Chip';
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {salesOrderApi, userApi} from "Frontend/api/ApiCalls";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import {SalesOrderStatus} from "Frontend/api/Models/CarrierModels/SalesOrder";

const chipStyles = (backgroundColor: string, color: string) => ({
    backgroundColor,
    color,
    borderColor: backgroundColor,
});

const salesOrderGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        filterable: false,
        valueGetter: (value, row) => {
            return row.salesOrder.salesOrderId;
        }
    },
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.salesOrder.deleted;
        }
    },
    {
        field: "salesOrderStatus",
        headerName: "Sales Order Status",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.salesOrder.salesOrderStatus;
        },
        renderCell: (params: GridRenderCellParams) => {
            switch (params.value){
                case SalesOrderStatus.ORDER_RECEIVED: return (<Chip label="primary"
                                                                    style={chipStyles('#f0f0f0', '#000')} // Light gray background, black text
                                                                    variant="outlined" />);
                case SalesOrderStatus.ORDER_PICKED: return (<Chip label="primary"
                                                                  style={chipStyles('#007bff', '#fff')} // Blue background, white text
                                                                  variant="outlined" />);
                case SalesOrderStatus.ORDER_IN_TRANSIT: return (<Chip label="primary"
                                                                      style={chipStyles('#17a2b8', '#fff')} // Cyan background, white text
                                                                      variant="outlined" />);
                case SalesOrderStatus.OUT_FOR_DELIVERY: return (<Chip label="primary"
                                                                      style={chipStyles('#ffc107', '#000')} // Yellow background, black text
                                                                      variant="outlined" />);
                case SalesOrderStatus.DELIVERED: return (<Chip label="primary"
                                                               style={chipStyles('#28a745', '#fff')} // Green background, white text
                                                               variant="outlined" />);
                case SalesOrderStatus.CANCELLED: return (<Chip label="primary"
                                                               style={chipStyles('#dc3545', '#fff')} // Red background, white text
                                                               variant="outlined" />);
                default:
                    return null;
            }
        }
    },
    {
        field: "billingAddress",
        headerName: "Billing Address",
        width: 300,
        valueGetter: (value, row) => {
            return row.billingAddress.line1 + " " + row.billingAddress.line2 + ", " + row.billingAddress.city + ", " + row.billingAddress.state + ", " + row.billingAddress.zipCode;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "shippingAddress",
        headerName: "Shipping Address",
        width: 300,
        valueGetter: (value, row) => {
            return row.shippingAddress.line1 + " " + row.shippingAddress.line2 + ", " + row.shippingAddress.city + ", " + row.shippingAddress.state + ", " + row.shippingAddress.zipCode;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "purchaseOrderCreatedBy",
        headerName: "Created By",
        width: 300,
        valueGetter: (value, row) => {
            return row.purchaseOrderCreatedBy.firstName + " " + row.purchaseOrderCreatedBy.lastName + " (" + row.purchaseOrderCreatedBy.loginName + ")";
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "approvedBy",
        headerName: "Approved By",
        width: 300,
        valueGetter: (value, row) => {
            if(row.purchaseOrderApprovedBy != undefined) {
                return row.purchaseOrderApprovedBy.firstName + " " + row.purchaseOrderApprovedBy.lastName + " (" + row.purchaseOrderApprovedBy.loginName + ")";
            }
            return "";
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "assignedLead",
        headerName: "Assigned Lead",
        width: 300,
        valueGetter: (value, row) => {
            return row.lead.firstName + " " + row.lead.lastName + " (" + row.lead.email + ")";
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    }
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete Sales Order " + params.row.salesOrder.salesOrderId,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                salesOrderApi(setLoading).toggleSalesOrder(params.row.salesOrder.salesOrderId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate Sales Order " + params.row.salesOrder.salesOrderId,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                salesOrderApi(setLoading).toggleSalesOrder(params.row.salesOrder.salesOrderId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...salesOrderGridColumns];
    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.salesOrder.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.salesOrderPermissions.toggleSalesOrders) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.salesOrderPermissions.updateSalesOrders) ? (
                            <a href={navigatingRoutes.dashboard.addSalesOrder + "?salesOrderId=" + params.row.salesOrder.salesOrderId}>Edit</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.salesOrderPermissions.toggleSalesOrders) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),
    });

    return columns;
}

export const initSalesOrderGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}