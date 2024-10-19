import {ConfirmOptions} from "material-ui-confirm";
import React from "react";
import Chip from "@mui/material/Chip";
import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";
import {formatDate, removeHtmlTags} from "Frontend/components/commonHelperFunctions";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {promoApi, supportApi, userApi} from "Frontend/api/ApiCalls";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";

// Custom color mapping for Jira status
const statusColorMap: Record<string, string>  = {
    "medium-gray": "#9e9e9e",  // Example hex code for gray
    "green": "#4caf50",        // Example hex code for green
    "yellow": "#ffeb3b",       // Example hex code for yellow
    "brown": "#795548",        // Example hex code for brown
    "warm-red": "#f44336",     // Example hex code for warm red
    "blue-gray": "#607d8b"     // Example hex code for blue-gray
};


const supportGridColumns: GridColDef[]  = [
    {
        field: "id",
        headerName: "Ticket Id",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.id;
        }
    },
    {
        field: "key",
        headerName: "Ticket Id",
        width: 200,
        valueGetter: (value, row) => {
            return row.key;
        }
    },
    {
        field: "issueType",
        headerName: "Issue Type",
        width: 200,
        valueGetter: (value, row) => {
            return row.fields.issuetype.name;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "status",
        headerName: "Status",
        width: 200,
        valueGetter: (value, row) => {
            return row.fields.status.name;
        },
        renderCell: (params: GridRenderCellParams) => {
            const colorName = params.row.fields.status.statusCategory?.colorName;
            const color = statusColorMap.hasOwnProperty(colorName) ?  statusColorMap[colorName] as string : "#9e9e9e";

            return (
                <Chip
                    label={params.value}
                    style={{
                        marginLeft: '8px',
                        backgroundColor: color,
                        color: 'white',
                        border: 'none'
                    }}
                />
            );
        }
    },
    {
        field: "priority",
        headerName: "Priority",
        width: 200,
        valueGetter: (value, row) => {
            return row.fields.priority.name;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "createdAt",
        headerName: "Created At",
        width: 200,
        valueGetter: (value, row) => {
            return row.renderedFields.created;
        }
    },
    {
        field: "updatedAt",
        headerName: "Updated At",
        width: 200,
        valueGetter: (value, row) => {
            return row.renderedFields.updated;
        }
    },
    {
        field: "summary",
        headerName: "Summary",
        width: 300,
        valueGetter: (value, row) => {
            return row.fields.summary;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "description",
        headerName: "Description",
        width: 300,
        valueGetter: (value, row) => {
            return removeHtmlTags(row.renderedFields.description);
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value} html={params.row.renderedFields.description}/>
    },
    {
        field: "resolvedAt",
        headerName: "Resolved At",
        width: 300,
        valueGetter: (value, row) => {
            if(row.fields.resolutiondate) {
                return formatDate(row.fields.resolutiondate, "mm dd yy, HH:mm");
            }
            return "";
        },
    },
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Are you sure you want to delete ticket " +params.row.key+ ", this action cannot be undone?",
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                supportApi(setLoading).deleteTicket(params.row.id).then((_: boolean) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...supportGridColumns];
    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                <>
                    {permissionSplit.includes(permissionChecks.supportPermissions.viewTickets) ? (
                        <a href={navigatingRoutes.dashboard.addSupport + "?ticketId=" + params.row.id + "&isView"}>View</a>
                    ) : null}
                    {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                    {permissionSplit.includes(permissionChecks.supportPermissions.editTickets) ? (
                        <a href={navigatingRoutes.dashboard.addSupport + "?ticketId=" + params.row.id}>Edit</a>
                    ) : null}
                    {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                    {permissionSplit.includes(permissionChecks.supportPermissions.deleteTickets) ? (
                        <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                    ) : null}
                </>
            </div>
        ),
    });
    return columns;
}

export const initSupportGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}
