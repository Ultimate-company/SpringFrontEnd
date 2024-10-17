import React from "react";
import {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {userApi, packageApi} from "Frontend/api/ApiCalls";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import {ConfirmOptions} from "material-ui-confirm";

const packageGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.packageId;
        }
    },
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.deleted;
        }
    },
    {
        field: "dimensions",
        headerName: "Dimensions",
        width: 200,
        valueGetter: (value, row) => {
            return row.length + " x " + row.breadth + " x " + row.height;
        },
    },
    {
        field: "pricePerQuantity",
        headerName: "Price Per Quantity",
        width: 200,
        valueGetter: (value, row) => {
            return row.pricePerQuantity + " ₹";
        },
    },
    {
        field: "quantity",
        headerName: "Quantity",
        width: 100,
        valueGetter: (value, row) => {
            return row.quantity;
        },
    },
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete Package with dimensions " + params.row.length + " x " + params.row.breadth + " x " + params.row.height,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                packageApi(setLoading).togglePackage(params.row.packageId).then((_: boolean) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate Package with dimensions " + params.row.length + " x " + params.row.breadth + " x " + params.row.height,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                packageApi(setLoading).togglePackage(params.row.packageId).then((_: boolean) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...packageGridColumns];
    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.packagePermissions.togglePackages) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.packagePermissions.viewPackages) ? (
                            <a href={navigatingRoutes.dashboard.addPackage + "?packageId=" + params.row.packageId + "&isView"}>View</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.packagePermissions.updatePackages) ? (
                            <a href={navigatingRoutes.dashboard.addPackage + "?packageId=" + params.row.packageId}>Edit</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.packagePermissions.togglePackages) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),
    });

    return columns;
}

export const initPackageGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}