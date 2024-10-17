import React from "react";
import {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import { userApi, leadApi } from "Frontend/api/ApiCalls";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import {ConfirmOptions} from "material-ui-confirm";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";

const leadGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.lead.leadId;
        }
    },
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.lead.deleted;
        }
    },
    {
        field: "leadStatus",
        headerName: "Lead Status",
        width: 200,
        valueGetter: (value, row) => {
            return row.lead.leadStatus;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "firstName",
        headerName: "First Name",
        width: 300,
        valueGetter: (value, row) => {
            return row.lead.firstName;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "lastName",
        headerName: "Last Name",
        width: 300,
        valueGetter: (value, row) => {
            return row.lead.lastName;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "email",
        headerName: "Email",
        width: 300,
        valueGetter: (value, row) => {
            return row.lead.email;
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
        field: "website",
        headerName: "Website",
        width: 300,
        valueGetter: (value, row) => {
            return row.lead.website;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "phone",
        headerName: "Phone",
        width: 150,
        valueGetter: (value, row) => {
            return `(${row.lead.phone.substr(0, 3)}) - ${row.lead.phone.substr(3, 3)} - ${row.lead.phone.substr(6)}`;
        }
    },
    {
        field: "company",
        headerName: "Company",
        width: 300,
        valueGetter: (value, row) => {
            return row.lead.company;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "companySize",
        headerName: "Company Size",
        width: 200,
        valueGetter: (value, row) => {
            return row.lead.companySize;
        }
    },
    {
        field: "annualRevenue",
        headerName: "Annual Revenue",
        width: 200,
        valueGetter: (value, row) => {
            return "₹ " + row.lead.annualRevenue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    {
        field: "title",
        headerName: "Title",
        width: 300,
        valueGetter: (value, row) => {
            return row.lead.title;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "leadAssignedTo",
        headerName: "Lead Assigned To",
        width: 300,
        filterable: false,
        valueGetter: (value, row) => {
            return row.assignedAgent.firstName + " " + row.assignedAgent.lastName + " (" + row.assignedAgent.loginName + ")";
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "leadCreatedBy",
        headerName: "Lead Created By",
        width: 300,
        filterable: false,
        valueGetter: (value, row) => {
            return row.createdBy.firstName + " " + row.createdBy.lastName+ " (" + row.createdBy.loginName + ")";
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    }
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete lead " + params.row.lead.firstName + " " + params.row.lead.lastName,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                leadApi(setLoading).toggleLead(params.row.lead.leadId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate lead " + params.row.lead.firstName + " " + params.row.lead.lastName,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                leadApi(setLoading).toggleLead(params.row.lead.leadId).then((response: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...leadGridColumns];
    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.lead.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.leadsPermissions.toggleLeads) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.leadsPermissions.viewLeads) ? (
                            <a href={navigatingRoutes.dashboard.addLead + "?leadId=" + params.row.lead.leadId + "&isView"}>View</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.leadsPermissions.updateLeads) ? (
                            <a href={navigatingRoutes.dashboard.addLead + "?leadId=" + params.row.lead.leadId}>Edit</a>
                        ) : null}
                        {<>&nbsp;&nbsp;&nbsp;</>} {/* spacing */}
                        {permissionSplit.includes(permissionChecks.leadsPermissions.toggleLeads) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),
    });

    return columns;
}

export const initLeadGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}

export const initLeadGridColumnsForSelection = async () => {
    return [...leadGridColumns];
}