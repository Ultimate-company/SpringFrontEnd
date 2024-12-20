import {ConfirmOptions} from "material-ui-confirm";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {messageApi, userApi} from "Frontend/api/ApiCalls";
import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import React from "react";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";
import {format} from "date-fns";
import {isDateGreaterThanOrEqualToToday} from "Frontend/components/commonHelperFunctions";

export const messagesGridColumns: GridColDef[] = [
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.message.deleted;
        }
    },
    {
        field: "messageId",
        headerName: "Message Id",
        flex: 1,
        minWidth: 100,
        valueGetter: (value, row) => {
            return row.message.messageId;
        }
    },
    {
        field: "title",
        headerName: "Title",
        flex: 2,
        minWidth: 250,
        valueGetter: (value, row) => {
            return row.message.title;
        },
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
        valueGetter: (value, row) => {
            return row.message.descriptionHtml;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />,
    },
    {
        field: "publishDate",
        headerName: "Publish Date",
        flex: 1,
        minWidth: 150,
        valueGetter: (value, row) => {
            let publishDate = row.message.publishDate;
            return `${format(new Date(publishDate), 'do MMM yyyy')}`;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />,
    },
    {
        field: "sendAsEmail",
        headerName: "Send As Email",
        flex: 1,
        minWidth: 150,
        filterable:false,
        valueGetter: (value, row) => {
            if(row.message.sendAsEmail) {
                return "Yes";
            }
            else{
                return "No";
            }
        }
    },
    {
        field: "IntendedUsers",
        headerName: "Intended Users Count",
        flex: 1,
        minWidth: 150,
        filterable: false,
        valueGetter: (value, row) => {
            return row.totalUsers;
        }
    },
    {
        field: "IntendedGroups",
        headerName: "Intended User Groups Count",
        flex: 1,
        minWidth: 150,
        filterable: false,
        valueGetter: (value, row) => {
            return row.totalUserGroups;
        }
    }
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete Message titled " + params.row.message.title,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                messageApi(setLoading).toggleMessage(params.row.message.messageId).then(() => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate Message titled " + params.row.message.title,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                messageApi(setLoading).toggleMessage(params.row.message.messageId).then(() => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...messagesGridColumns];
    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.message.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.messagesPermissions.deleteMessages) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.messagesPermissions.viewMessages) ? (
                            <><a
                                href={navigatingRoutes.dashboard.addMessage + "?messageId=" + params.row.message.messageId + "&isView"}>View</a><>&nbsp;&nbsp;&nbsp;</>
                            </>
                        ) : null}
                        {permissionSplit.includes(permissionChecks.messagesPermissions.updateMessages) && !isDateGreaterThanOrEqualToToday(params.row.message.publishDate) ? (
                            <><a
                                href={navigatingRoutes.dashboard.addMessage + "?messageId=" + params.row.message.messageId}>Edit</a><>&nbsp;&nbsp;&nbsp;</>
                            </>
                        ) : null}
                        {permissionSplit.includes(permissionChecks.messagesPermissions.deleteMessages) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),
    });

    return columns;
}

export const initMessageGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}