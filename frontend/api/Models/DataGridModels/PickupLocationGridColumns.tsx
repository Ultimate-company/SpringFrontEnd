import React from "react";
import {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {userApi, pickupLocationApi} from "Frontend/api/ApiCalls";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import {ConfirmOptions} from "material-ui-confirm";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";

const pickupLocationGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.pickupLocation.pickupLocationId;
        }
    },
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.pickupLocation.deleted;
        }
    },
    {
        field: "locationName",
        headerName: "Location Name",
        width: 300,
        valueGetter: (value, row) => {
            return row.pickupLocation.addressNickName;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
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
        field: "nameOnAddress",
        headerName: "Name On Address",
        width: 300,
        filterable: false,
        valueGetter: (value, row) => {
            return row.address.nameOnAddress;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "phoneOnAddress",
        headerName: "Phone On Address",
        width: 200,
        valueGetter: (value, row) => {
            return `(${row.address.phoneOnAddress.substr(0, 3)}) - ${row.address.phoneOnAddress.substr(3, 3)} - ${row.address.phoneOnAddress.substr(6)}`;
        }
    },
    {
        field: "emailAtAddress",
        headerName: "Email On Address",
        width: 300,
        valueGetter: (value, row) => {
            return row.address.emailAtAddress;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    }
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete pickup location " + params.row.pickupLocation.addressNickName,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                pickupLocationApi(setLoading).togglePickupLocation(params.row.pickupLocation.pickupLocationId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate pickup location " + params.row.pickupLocation.addressNickName,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                pickupLocationApi(setLoading).togglePickupLocation(params.row.pickupLocation.pickupLocationId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...pickupLocationGridColumns];
    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.pickupLocation.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.pickupLocationPermissions.deletePickupLocations) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.pickupLocationPermissions.viewPickupLocations) ? (
                            <a href={navigatingRoutes.dashboard.addPickupLocation + "?pickupLocationId=" + params.row.pickupLocation.pickupLocationId + "&isView"}>View</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.pickupLocationPermissions.updatePickupLocations) ? (
                            <a href={navigatingRoutes.dashboard.addPickupLocation + "?pickupLocationId=" + params.row.pickupLocation.pickupLocationId}>Edit</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.pickupLocationPermissions.deletePickupLocations) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),
    });

    return columns;
}

export const initPickupLocationGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}