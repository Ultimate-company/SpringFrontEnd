import {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {userApi, userGroupApi} from "Frontend/api/ApiCalls";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import React from "react";
import {ConfirmOptions} from "material-ui-confirm";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";

const userGroupGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.userGroup.userGroupId;
        }
    },
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.userGroup.deleted;
        }
    },
    {
        field: "name",
        headerName: "Name",
        flex: 2,
        minWidth: 250,
        valueGetter: (value, row) => {
            return row.userGroup.name;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />
    },
    {
        field: "description",
        headerName: "Description",
        flex: 4,
        minWidth: 250,
        valueGetter: (value, row) => {
            return row.userGroup.description;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />
    },
    {
        field: "usersList",
        headerName: "Total Users in Group",
        flex: 1,
        minWidth: 150,
        filterable: false,
        valueGetter: (value, row) => {
            return row.userCount;
        }
    },
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete user group " + params.row.userGroup.name,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                userGroupApi(setLoading).toggleUserGroup(params.row.userGroup.userGroupId).then(() => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate user group " + params.row.userGroup.name,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                userGroupApi(setLoading).toggleUserGroup(params.row.userGroup.userGroupId).then(() => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...userGroupGridColumns];
    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.userGroup.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.groupsPermissions.deleteGroups) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.groupsPermissions.viewGroups) ? (
                            <a href={navigatingRoutes.dashboard.addUserGroup + "?userGroupId=" + params.row.userGroup.userGroupId + "&isView"}>View</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.groupsPermissions.updateGroups) ? (
                            <a href={navigatingRoutes.dashboard.addUserGroup + "?userGroupId=" + params.row.userGroup.userGroupId}>Edit</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.groupsPermissions.deleteGroups) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),

    });

    return columns;
}

export const initUserGroupGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}

export const initUserGroupColumnsForSelection = async () => {
    return [...userGroupGridColumns];
}