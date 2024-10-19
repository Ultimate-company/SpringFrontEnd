import {Avatar} from "@mui/material";
import {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import { userApi } from "Frontend/api/ApiCalls";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import {getRandomColor} from "Frontend/components/commonHelperFunctions";
import { format } from 'date-fns';
import React from "react";
import {ConfirmOptions} from "material-ui-confirm";

const userGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.userId;
        }
    },
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false
    },
    {
        filterable: false,
        field: "avatar",
        headerName: "Icon",
        width: 60,
        renderCell: (params: GridRenderCellParams) => (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
                {
                    params.value && params.value.length > 0 ?
                        <Avatar src={params.value}/> :
                        <Avatar style={{backgroundColor: getRandomColor(params.row.userId)}}>{params.row.firstName[0]}{params.row.lastName[0]}</Avatar>
                }
            </div>
        )
    },
    {
        field: "firstName",
        headerName: "First Name",
        width: 200
    },
    {
        field: "lastName",
        headerName: "Last Name",
        width: 200
    },
    {
        field: "loginName",
        headerName: "Email",
        width: 300
    },
    {
        field: "role",
        headerName: "Role",
        width: 120
    },
    {
        field: "dob",
        headerName: "DOB",
        width: 150,
        valueGetter: (value, row) => {
            return `${format(new Date(row.dob), 'do MMM yyyy')}`;
        }
    },
    {
        field: "phone",
        headerName: "Phone",
        width: 150,
        valueGetter: (value, row) => {
            let phone = row.phone;
            return `(${phone.substr(0, 3)}) - ${phone.substr(3, 3)} - ${phone.substr(6)}`;
        },
    }
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete user account " + params.row.loginName,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                userApi(setLoading).toggleUser(params.row.userId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate user account " + params.row.loginName,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                userApi(setLoading).toggleUser(params.row.userId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...userGridColumns];
    if (permissionSplit.includes(permissionChecks.ordersPermissions.viewOrders)) {
        columns.push({
            filterable: false,
            field: "OrderHistory",
            headerName: "Orders",
            width: 150,
            renderCell: () => (
                <div>
                    <a href={navigatingRoutes.dashboard.orders}>View Order History</a>
                </div>
            ),
        });
    }

    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.userPermissions.deleteUser) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.userPermissions.viewUser) ? (
                            <a href={navigatingRoutes.dashboard.addUser + "?userId=" + params.row.userId + "&isView"}>View</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.userPermissions.updateUser) ? (
                            <a href={navigatingRoutes.dashboard.addUser + "?userId=" + params.row.userId}>Edit</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.userPermissions.deleteUser) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),

    });

    return columns;
}

export const initUserGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}

export const initUserColumnsForSelection = async () => {
    return [...userGridColumns];
}