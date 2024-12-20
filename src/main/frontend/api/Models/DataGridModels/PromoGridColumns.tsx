import {ConfirmOptions} from "material-ui-confirm";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {promoApi, userApi} from "Frontend/api/ApiCalls";
import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import React from "react";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";

const promoGridColumns: GridColDef[] = [
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.lead.deleted;
        },
    },
    {
        field: "promoId",
        headerName: "Promo Id",
        flex: 1,
        minWidth: 100,
        valueGetter: (value, row) => {
            return row.promoId;
        },
    },
    {
        field: "promoCode",
        headerName: "Promo Code",
        flex: 2,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />,
    },
    {
        field: "description",
        headerName: "Description",
        flex: 8,
        minWidth: 250,
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />,
    },
    {
        field: "discountValue",
        headerName: "Discount Value",
        flex: 1,
        minWidth: 150,
        valueGetter: (value, row) => {
            if(row.percent) {
                return row.discountValue + " %";
            } else {
                return row.discountValue + " ₹";
            }
        },
    },
]

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete promo " + params.row.promoCode,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                promoApi(setLoading).togglePromo(params.row.promoId).then(() => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate promo " + params.row.promoCode,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                promoApi(setLoading).togglePromo(params.row.promoId).then(() => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...promoGridColumns];
    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.promosPermissions.deletePromos) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.promosPermissions.viewPromos) ? (
                            <a href={navigatingRoutes.dashboard.addPromo + "?promoId=" + params.row.promoId + "&isView"}>View</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.promosPermissions.deletePromos) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),
    });

    return columns;
}

export const initPromoGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}