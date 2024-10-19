import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";
import React from "react";
import {ConfirmOptions} from "material-ui-confirm";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {userApi, userGroupApi, webTemplateApi} from "Frontend/api/ApiCalls";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";

export const webTemplateGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        hideable: false,
        filterable: false,
    },
    {
        field: "webTemplateUrl",
        headerName: "Web Template Url",
        width: 300,
        valueGetter: (value, row) => {
            return row.webTemplate.url
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "acceptedPaymentOptions",
        headerName: "Accepted Payment Options",
        width: 300,
        valueGetter: (value, row) => {
            return row.webTemplate.acceptedPaymentOptions
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "sortOptions",
        headerName: "Sort Options",
        width: 300,
        valueGetter: (value, row) => {
            return row.webTemplate.sortOptions
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "filerOptions",
        headerName: "Filter Options",
        width: 300,
        valueGetter: (value, row) => {
            return row.webTemplate.filterOptions
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    }
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete Web Template " + params.row.webTemplate.url,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                webTemplateApi(setLoading).toggleWebTemplate(params.row.webTemplate.webTemplateId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate Web Template " + params.row.webTemplate.url,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                webTemplateApi(setLoading).toggleWebTemplate(params.row.webTemplate.webTemplateId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleDeployClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Deploy Web Template " + params.row.webTemplate.url,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                webTemplateApi(setLoading).deployWebTemplate(params.row.webTemplate.webTemplateId).then((response: boolean) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...webTemplateGridColumns];
    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.webTemplate.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.webTemplatePermissions.deactivateWebTemplate) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.webTemplatePermissions.viewWebTemplate) ? (
                            <a href={navigatingRoutes.dashboard.addWebTemplate + "?webTemplateId=" + params.row.webTemplate.webTemplateId + "&isView"}>View</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.webTemplatePermissions.updateWebTemplate) ? (
                            <a href={navigatingRoutes.dashboard.addWebTemplate + "?webTemplateId=" + params.row.webTemplate.webTemplateId}>Edit</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.webTemplatePermissions.deployWebTemplate) ? (
                            <a onClick={() => handleDeployClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Deploy</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.webTemplatePermissions.deactivateWebTemplate) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),

    });

    return columns;
}
export const initWebTemplateGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}