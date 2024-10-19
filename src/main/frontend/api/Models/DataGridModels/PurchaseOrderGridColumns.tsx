import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";
import React from "react";
import {format} from "date-fns";
import {ConfirmOptions} from "material-ui-confirm";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {purchaseOrderApi, userApi} from "Frontend/api/ApiCalls";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import {isDateGreaterThanOrEqualToToday} from "Frontend/components/commonHelperFunctions";
import BlueButton from "Frontend/components/FormInputs/BlueButton";

const purchaseOrderGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        filterable: false,
        valueGetter: (value, row) => {
            return row.purchaseOrder.purchaseOrderId;
        }
    },
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.purchaseOrder.deleted;
        }
    },
    {
        field: "address",
        headerName: "Address",
        width: 300,
        valueGetter: (value, row) => {
            return row.address.line1 + " " + row.address.line2 + ", " + row.address.city + ", " + row.address.state + ", " + row.address.zipCode;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "expectedShipmentDate",
        headerName: "Expected Shipment Date",
        width: 150,
        valueGetter: (value, row) => {
            return `${format(new Date(row.purchaseOrder.expectedShipmentDate), 'do MMM yyyy')}`;
        }
    },
    {
        field: "vendorNumber",
        headerName: "Vendor Number",
        width: 300,
        valueGetter: (value, row) => {
            return row.purchaseOrder.vendorNumber;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "orderReceipt",
        headerName: "Order Receipt",
        width: 300,
        valueGetter: (value, row) => {
            return row.purchaseOrder.orderReceipt;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "createdBy",
        headerName: "Created By",
        width: 300,
        valueGetter: (value, row) => {
            return row.createdByUser.firstName + " " + row.createdByUser.lastName + " (" + row.createdByUser.loginName + ")";
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "approvedBy",
        headerName: "Approved By",
        width: 300,
        valueGetter: (value, row) => {
            if(row.approvedByUser == null){
                return "";
            }
            return row.approvedByUser.firstName + " " + row.approvedByUser.lastName + " (" + row.approvedByUser.loginName + ")";
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "assignedLead",
        headerName: "Assigned Lead",
        width: 300,
        valueGetter: (value, row) => {
            if(row.lead == null){
                return "";
            }
            return row.lead.firstName + " " + row.lead.lastName + " (" + row.lead.email + ")";
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    }
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete Purchase Order " + params.row.purchaseOrder.purchaseOrderId,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                purchaseOrderApi(setLoading).togglePurchaseOrder(params.row.purchaseOrder.purchaseOrderId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate Purchase Order " + params.row.purchaseOrder.purchaseOrderId,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                purchaseOrderApi(setLoading).togglePurchaseOrder(params.row.purchaseOrder.purchaseOrderId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleApproveClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Approve Purchase Order " + params.row.purchaseOrder.purchaseOrderId,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                purchaseOrderApi(setLoading).approvedByPurchaseOrder(params.row.purchaseOrder.purchaseOrderId).then((response: boolean) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...purchaseOrderGridColumns];

    columns.push({
        filterable: false,
        field: "Approve",
        headerName: "Approve",
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    {!params.row.purchaseOrder.deleted && (params.row.approvedByUser === undefined || params.row.approvedByUser === null) &&
                    permissionSplit.includes(permissionChecks.purchaseOrderPermissions.updatePurchaseOrders) ? (
                        <BlueButton
                            label="Approve P.O"
                            handleSubmit={() => handleApproveClick(params)}
                        />
                    ) : (
                        <></>
                    )}
                </div>
            );
        }
    });


    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.purchaseOrder.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.purchaseOrderPermissions.togglePurchaseOrders) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.purchaseOrderPermissions.viewPurchaseOrders) ? (
                            <><a
                                href={navigatingRoutes.dashboard.addPurchaseOrder + "?purchaseOrderId=" + params.row.purchaseOrder.purchaseOrderId + "&isView"}>View</a><>&nbsp;&nbsp;&nbsp;</>
                            </>
                        ) : null}
                        {permissionSplit.includes(permissionChecks.purchaseOrderPermissions.updatePurchaseOrders) ? (
                            <><a
                                href={navigatingRoutes.dashboard.addPurchaseOrder + "?purchaseOrderId=" + params.row.purchaseOrder.purchaseOrderId}>Edit</a><>&nbsp;&nbsp;&nbsp;</>
                            </>
                        ) : null}
                        {permissionSplit.includes(permissionChecks.purchaseOrderPermissions.togglePurchaseOrders) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),
    });

    columns.push({
        filterable: false,
        field: "downloadPDF",
        headerName: "Download PDF",
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    {
                        !params.row.purchaseOrder.deleted && (params.row.approvedByUser != undefined || params.row.approvedByUser != null) &&
                        permissionSplit.includes(permissionChecks.purchaseOrderPermissions.viewPurchaseOrders) ? (
                        <BlueButton
                            label="Download PDF"
                            handleSubmit={() => purchaseOrderApi(setLoading).downloadPdf(params.row.purchaseOrder.purchaseOrderId)}
                        />
                    ) : (
                        <></>
                    )}
                </div>
            );
        }
    });

    return columns;
}

export const initPurchaseOrderGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}

export const initPurchaseOrderColumnsForSelection = async () => {
    return [...purchaseOrderGridColumns];
}