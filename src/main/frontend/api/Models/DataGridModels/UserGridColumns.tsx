import {Avatar} from "@mui/material";
import {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import { userApi } from "Frontend/api/ApiCalls";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import {chipStyles, getRandomColor} from "Frontend/components/commonHelperFunctions";
import { format } from 'date-fns';
import React from "react";
import {ConfirmOptions} from "material-ui-confirm";
import {userUrls} from "Frontend/api/Endpoints";
import Chip from "@mui/material/Chip";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";

const userGridColumns: GridColDef[] = [
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false
    },
    {
        field: "userId",
        headerName: "User Id",
        flex: 1,
        minWidth: 100,
        valueGetter: (value, row) => {
            return row.userId;
        }
    },
    {
        filterable: false,
        field: "avatar",
        headerName: "Icon",
        flex: 1,
        minWidth: 60,
        renderCell: (params: GridRenderCellParams) => {
            const [imageError, setImageError] = React.useState(false); // Declare imageError state
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    {!imageError ? (
                        <Avatar
                            src={`${userUrls.getProfileImage}?userId=${params.row.userId}`}
                            onError={() => setImageError(true)} // Set error state if image fails to load
                        />
                    ) : (
                        <Avatar style={{ backgroundColor: getRandomColor(params.row.userId) }}>
                            {params.row.firstName[0]}{params.row.lastName[0]}
                        </Avatar>
                    )}
                </div>
            );
        }
    },
    {
        field: "firstName",
        headerName: "First Name",
        flex: 2,
        minWidth: 250,
        valueGetter: (value, row) => {
            return row.firstName;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />
    },
    {
        field: "lastName",
        headerName: "Last Name",
        flex: 2,
        minWidth: 250,
        valueGetter: (value, row) => {
            return row.lastName;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />
    },
    {
        field: "loginName",
        headerName: "Email",
        flex: 2,
        minWidth: 250,
        valueGetter: (value, row) => {
            return row.loginName;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />
    },
    {
        field: "role",
        headerName: "Role",
        flex: 2,
        minWidth: 250,
        valueGetter: (value, row) => {
            return row.role;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />
    },
    {
        filterable: false,
        field: "dob",
        headerName: "DOB",
        flex: 2,
        minWidth: 250,
        valueGetter: (value, row) => {
            return `${format(new Date(row.dob), 'do MMM yyyy')}`;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />
    },
    {
        field: "phone",
        headerName: "Phone",
        flex: 2,
        minWidth: 150,
        valueGetter: (value, row) => {
            let phone = row.phone;
            return `(${phone.slice(0, 3)}) - ${phone.slice(3, 6)} - ${phone.slice(6)}`;
        },
    },
    {
        field: "emailConfirmed",
        headerName: "Account Confirmed",
        flex: 2,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => {
            const confirmed = params.row.emailConfirmed;

            // Define label and styles based on email confirmation status
            const label = confirmed ? "Confirmed" : "Pending";
            const backgroundColor = confirmed ? '#28a745' : '#dc3545'; // Green for confirmed, red for pending
            const textColor = '#fff'; // White text

            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center', // Center horizontally
                    alignItems: 'center',     // Center vertically
                    height: '100%',           // Ensure full height for vertical centering
                }}>
                    <Chip
                        label={label}
                        style={chipStyles(backgroundColor, textColor)} // Use the determined colors
                        variant="outlined"
                    />
                </div>
            );
        }
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
                userApi(setLoading).toggleUser(params.row.userId).then(() => {
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
                userApi(setLoading).toggleUser(params.row.userId).then(() => {
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
            flex: 1,
            minWidth: 150,
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
        flex: 1,
        minWidth: 200,
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
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Deactivate</a>
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