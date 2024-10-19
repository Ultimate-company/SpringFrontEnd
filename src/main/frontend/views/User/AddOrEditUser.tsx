import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import {Permissions, UserRequestModel, UserResponseModel} from "Frontend/api/Models/CentralModels/User";
import React from "react";
import {dataApi, userApi, userLogApi} from "Frontend/api/ApiCalls";
import { DataItem } from "Frontend/api/Models/CentralModels/Data";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import {StyledDataGrid} from "Frontend/components/Datagrid/CustomDataGrid";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {
    GridColDef,
    GridColumnVisibilityModel,
    GridFilterModel,
    GridRowSelectionModel,
    GridToolbar
} from "@mui/x-data-grid";
import {CustomPaginationForGrid, PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import {filterChangeFunction} from "Frontend/components/Datagrid/CustomFilteringForDataGrid";
import {useConfirm} from "material-ui-confirm";
import {initUserLogGridColumns} from "Frontend/api/Models/DataGridModels/UserLogGridColumns";
import {
    getURLParamValue,
    isEditMode,
    isViewMode
} from "Frontend/components/commonHelperFunctions";
import {
    permissionChecks,
    UserPermissions,
} from "Frontend/api/Models/CarrierModels/Permissions";
import UserPermission from "./Components/UserPermission";
import GroupSelectionGrid from "Frontend/components/DataGridsForSelection/UserGroupSelectionGrid";
import {useOutletContext} from "react-router-dom";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import {Grid} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";

const paginatedGridModel: PaginatedGridInterface = {
    start: 0,
    end: 10,
    pageSize: 10,
    includeDeleted: false,
    data: [],
    totalPaginationBlockCount: 0,
    actualDataCount: 0,
    filterExpr: {
        columnName: "",
        condition: "",
        filterText: ""
    }
}

const initialUserPermissionsState: UserPermissions = {
    userPermissions: {
        viewUser: false,
        updateUser: false,
        deleteUser: false,
        insertUser: false,
    },
    userLogPermissions: {
        viewLogs: false,
    },
    groupsPermissions: {
        viewGroups: false,
        insertGroups: false,
        deleteGroups: false,
        updateGroups: false,
    },
    messagesPermissions: {
        viewMessages: false,
        insertMessages: false,
        deleteMessages: false,
        updateMessages: false,
    },
    promosPermissions: {
        viewPromos: false,
        insertPromos: false,
        deletePromos: false,
        updatePromos: false,
    },
    pickupLocationPermissions: {
        viewPickupLocations: false,
        insertPickupLocations: false,
        deletePickupLocations: false,
        updatePickupLocations: false,
    },
    ordersPermissions: {
        viewOrders: false,
        viewOrderStatistics: false,
        insertOrders: false,
        updateOrders: false,
        cancelOrders: false,
    },
    addressPermissions: {
        viewAddress: false,
        insertAddress: false,
        updateAddress: false,
        deleteAddress: false,
    },
    paymentsPermissions: {
        viewPayments: false,
        viewPaymentStatistics: false,
        processRefunds: false,
    },
    eventsPermissions: {
        viewEvents: false,
        insertEvents: false,
        updateEvents: false,
        deleteEvents: false,
    },
    productsPermissions: {
        insertProducts: false,
        viewProducts: false,
        updateProducts: false,
        deleteProducts: false,
    },
    supportPermissions: {
        raiseTickets: false,
        viewComments: false,
        postComments: false,
        downloadAttachments: false,
        viewTickets: false,
        editTickets: false,
        deleteTickets: false
    },
    apiKeyPermissions: {
        viewApiKeys: false,
        insertApiKeys: false,
        updateApiKeys: false,
    },
    leadsPermissions: {
        viewLeads: false,
        insertLeads: false,
        updateLeads: false,
        toggleLeads: false,
    },
    salesOrderPermissions: {
        viewSalesOrders: false,
        insertSalesOrders: false,
        updateSalesOrders: false,
        toggleSalesOrders: false,
    },
    purchaseOrderPermissions: {
        viewPurchaseOrders: false,
        insertPurchaseOrders: false,
        updatePurchaseOrders: false,
        togglePurchaseOrders: false,
    },
    webTemplatePermissions: {
        viewWebTemplate: false,
        insertWebTemplate: false,
        updateWebTemplate: false,
        deployWebTemplate: false,
        deactivateWebTemplate: false
    },
    packagePermissions: {
        viewPackages: false,
        insertPackages: false,
        togglePackages: false,
        updatePackages: false,
    }
}

const initialPermissionsState: Permissions = {
    userPermissions: "",
    userLogPermissions: "",
    groupsPermissions: "",
    messagesPermissions: "",
    promosPermissions: "",
    addressPermissions: "",
    pickupLocationPermissions: "",
    ordersPermissions: "",
    paymentsPermissions: "",
    eventsPermissions: "",
    productsPermissions: "",
    supportPermissions: "",
    apiKeyPermissions: "",
    leadsPermissions: "",
    purchaseOrderPermissions: "",
    salesOrderPermissions: "",
    webTemplatePermissions: "",
    packagePermissions: ""
}

const AddOrEditUser = () => {
    // state variables
    const confirm = useConfirm();
    const [setLoading] = useOutletContext<any>();

    // data variables
    const [roles, setRoles] = React.useState<DataItem[]>([]);
    const [states, setStates] = React.useState<DataItem[]>([]);

    // state variables for user personal details
    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("")
    const [phone, setPhone] = React.useState<string>("");
    const [role, setRole] = React.useState<string>("");
    const [loginName, setLoginName] = React.useState<string>("");
    const [dob, setDob] = React.useState<Date>(new Date());

    // state variables for address
    const [line1, setLine1] = React.useState<string>("");
    const [line2, setLine2] = React.useState<string>("");
    const [landmark, setLandmark] = React.useState<string>("");
    const [city, setCity] = React.useState<string>("");
    const [state, setState] = React.useState<string>("");
    const [zipCode, setZipCode] = React.useState<string>("");

    // state variables for permissions
    const [userPermissions, setUserPermissions] = React.useState<UserPermissions>(initialUserPermissionsState);

    // state variables for group
    const [selectedUserGroupIds, setSelectedUserGroupIds] = React.useState<GridRowSelectionModel>([]);

    // state variables for user log grid
    const [userLogGridColumns, setUserLogGridColumns] = React.useState<GridColDef[]>([]);
    const [gridState, setGridState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [userLogGridColumnVisibilityModel, setUserLogGridColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });

    // local variables
    const isEdit = isEditMode("userId");
    const isView = isViewMode("userId");
    let userId = (isEdit || isView) ? parseInt(getURLParamValue("userId") as string) : null;

    // function which will handle add / edit user
    const handleSubmit = () => {
        let serializedUserPermissions = JSON.parse(JSON.stringify(userPermissions));
        let serializedPermissionChecks = JSON.parse(JSON.stringify(permissionChecks));
        let serializedPermissions = JSON.parse(JSON.stringify(initialPermissionsState));

        for(let key of Object.keys(serializedUserPermissions)) {
            for(let permission of Object.keys(serializedUserPermissions[key])) {
                if(serializedUserPermissions[key][permission]){
                    serializedPermissions[key] += serializedPermissionChecks[key][permission] + ","
                }
            }
        }
        let requestData: UserRequestModel = {
            user: {
                firstName: firstName,
                lastName: lastName,
                role: role,
                phone: phone,
                dob: dob,
                loginName: loginName,
                userId: isEdit ? userId as number : undefined
            },
            address: {
                line1: line1,
                line2: line2,
                landmark: landmark,
                city: city,
                state: state,
                zipCode: zipCode,
                nameOnAddress: firstName + " " + lastName,
                phoneOnAddress: phone
            },
            permissions: serializedPermissions,
            userGroupIds: selectedUserGroupIds.map(userGroupId => parseInt(userGroupId.toString()))
        };
        if(isEdit) {
            userApi(setLoading).updateUser(requestData).then(() => {});
        }
        else{
            userApi(setLoading).createUser(requestData).then(() => {});
        }
    }

    // function which will get user details
    const handleFetchUserDetailsById = (userId: number, roles: DataItem[], states: DataItem[]) => {
        userApi(setLoading).getUserById(userId).then((userResponseModel: UserResponseModel) => {
            let serializedDBPermissions = JSON.parse(JSON.stringify(userResponseModel.permissions));
            let serializedUserPermissions = JSON.parse(JSON.stringify(userPermissions));
            for(let key of Object.keys(serializedDBPermissions)) {
                if(key == "permissionId" ||
                    key =="createdAt" ||
                    key == "updatedAt" ||
                    key == "notes" ||
                    key == "auditUserId" ||
                    serializedDBPermissions[key] == "" ||
                    serializedDBPermissions[key] == undefined ||
                    serializedDBPermissions[key] == null) continue;

                let values = serializedDBPermissions[key].split(",");
                for(let permission of values) {
                    if(permission == "" || permission == null) continue;

                    permission = permission.charAt(0).toLowerCase() + permission.slice(1);
                    serializedUserPermissions[key][permission] = true;
                }
            }

            // set user state variables
            setFirstName(userResponseModel.user.firstName ?? "");
            setLastName(userResponseModel.user.lastName ?? "");
            setPhone(userResponseModel.user.phone ?? "");
            setDob(userResponseModel.user.dob as Date ?? new Date());
            setRole(userResponseModel.user.role ?? "");
            setLoginName(userResponseModel.user.loginName ?? "");

            // set address state variables
            setLine1(userResponseModel.address.line1 ?? "");
            setLine2(userResponseModel.address.line2 ?? "");
            setLandmark(userResponseModel.address.landmark ?? "");
            setCity(userResponseModel.address.city ?? "");
            setState(userResponseModel.address.state ?? "");
            setZipCode(userResponseModel.address.zipCode ?? "");

            // set user permissions
            setUserPermissions(serializedUserPermissions);

            // set group ids
            setSelectedUserGroupIds(userResponseModel.groupIds);

            // set data variables
            setRoles(roles);
            setStates(states);
        });
    }

    // function which will take start and end and will get the user logs in batches from the database
    const setUserLogAndPagination = React.useCallback((paginationRequestModel: PaginatedGridInterface) => {
        userLogApi(setLoading).getUserLogsInBatchesByUserId({
            userId: userId as number,
            columnName: paginationRequestModel.filterExpr.columnName,
            condition: paginationRequestModel.filterExpr.condition,
            filterExpr: paginationRequestModel.filterExpr.filterText,
            start: paginationRequestModel.start,
            end: paginationRequestModel.end,
            pageSize: paginationRequestModel.pageSize,
            includeDeleted: paginationRequestModel.includeDeleted
        }).then((response: PaginationBaseResponseModel<any>) => {
            initUserLogGridColumns(confirm).then((columns) => {
                setUserLogGridColumns(columns);
                setGridState({
                    pageSize: paginationRequestModel.pageSize,
                    includeDeleted: paginationRequestModel.includeDeleted,
                    data: response.data,
                    totalPaginationBlockCount: Math.ceil(
                        response.totalDataCount / paginationRequestModel.pageSize
                    ),
                    actualDataCount: response.totalDataCount ?? 0,
                    start: paginationRequestModel.start,
                    end: paginationRequestModel.end,
                    filterExpr: {
                        columnName: paginationRequestModel.filterExpr.columnName,
                        condition: paginationRequestModel.filterExpr.condition,
                        filterText: paginationRequestModel.filterExpr.filterText,
                    }
                });
            });
        });
    }, [gridState]);

    const updateUserPermissions = (Permissions: any, PermissionsToKeepTrue: string[]) => {
        for (const [key] of Object.entries(Permissions)) {
            Permissions[key] = PermissionsToKeepTrue.some(item => item.toLowerCase() === key.toLowerCase());
        }
    };

    const autoCheckPermissionsByRoles = (role: string) => {
        let permissionsToKeepTrue = [
            permissionChecks.userPermissions.viewUser,
            permissionChecks.userLogPermissions.viewLogs,
            permissionChecks.groupsPermissions.viewGroups,
            permissionChecks.messagesPermissions.viewMessages,
            permissionChecks.promosPermissions.viewPromos,
            permissionChecks.pickupLocationPermissions.viewPickupLocations,
            permissionChecks.ordersPermissions.viewOrders,
            permissionChecks.ordersPermissions.viewOrderStatistics,
            permissionChecks.addressPermissions.viewAddress,
            permissionChecks.paymentsPermissions.viewPayments,
            permissionChecks.paymentsPermissions.viewPaymentStatistics,
            permissionChecks.eventsPermissions.viewEvents,
            permissionChecks.productsPermissions.viewProducts,
            permissionChecks.supportPermissions.raiseTickets,
            permissionChecks.supportPermissions.postComments,
            permissionChecks.supportPermissions.downloadAttachments,
            permissionChecks.supportPermissions.viewTickets,
            permissionChecks.supportPermissions.viewComments,
            permissionChecks.apiKeyPermissions.viewApiKeys,
            permissionChecks.leadsPermissions.viewLeads,
            permissionChecks.purchaseOrderPermissions.viewPurchaseOrders,
            permissionChecks.salesOrderPermissions.viewSalesOrders,
            permissionChecks.webTemplatePermissions.viewWebTemplate,
            permissionChecks.packagePermissions.viewPackages
        ];

        if (role == "Manager" || role == "Admin" || role == "CEO") {
            permissionsToKeepTrue.push(
                // UsersPermissions
                permissionChecks.userPermissions.updateUser,
                permissionChecks.userPermissions.insertUser,

                // GroupsPermissions
                permissionChecks.groupsPermissions.insertGroups,
                permissionChecks.groupsPermissions.updateGroups,

                // MessagesPermissions
                permissionChecks.messagesPermissions.insertMessages,
                permissionChecks.messagesPermissions.updateMessages,

                // PromosPermissions
                permissionChecks.promosPermissions.insertPromos,
                permissionChecks.promosPermissions.updatePromos,

                // PickupLocationPermissions
                permissionChecks.pickupLocationPermissions.insertPickupLocations,
                permissionChecks.pickupLocationPermissions.updatePickupLocations,

                // OrdersPermissions
                permissionChecks.ordersPermissions.insertOrders,
                permissionChecks.ordersPermissions.updateOrders,

                // AddressPermissions
                permissionChecks.addressPermissions.insertAddress,
                permissionChecks.addressPermissions.updateAddress,

                // EventsPermissions
                permissionChecks.eventsPermissions.insertEvents,
                permissionChecks.eventsPermissions.updateEvents,

                // ProductsPermissions
                permissionChecks.productsPermissions.insertProducts,
                permissionChecks.productsPermissions.updateProducts,

                // ApiKeysPermissions
                permissionChecks.apiKeyPermissions.insertApiKeys,
                permissionChecks.apiKeyPermissions.updateApiKeys,

                // LeadsPermissions
                permissionChecks.leadsPermissions.insertLeads,
                permissionChecks.leadsPermissions.updateLeads,

                // PurchaseOrderPermissions
                permissionChecks.purchaseOrderPermissions.insertPurchaseOrders,
                permissionChecks.purchaseOrderPermissions.updatePurchaseOrders,

                // SalesOrderPermissions
                permissionChecks.salesOrderPermissions.insertSalesOrders,
                permissionChecks.salesOrderPermissions.updateSalesOrders,

                //WebTemplatePermissions
                permissionChecks.webTemplatePermissions.insertWebTemplate,
                permissionChecks.webTemplatePermissions.updateWebTemplate,

                //PackagesPermissions
                permissionChecks.packagePermissions.insertPackages,
                permissionChecks.packagePermissions.updatePackages,

                //SupportPermissions
                permissionChecks.supportPermissions.editTickets,
                permissionChecks.supportPermissions.deleteTickets
            );
        }
        if (role == "Admin" || role == "CEO") {
            permissionsToKeepTrue.push(
                // UsersPermissions
                permissionChecks.userPermissions.deleteUser,

                // GroupsPermissions
                permissionChecks.groupsPermissions.deleteGroups,

                // MessagesPermissions
                permissionChecks.messagesPermissions.deleteMessages,

                // PromosPermissions
                permissionChecks.promosPermissions.deletePromos,

                // PickupLocationPermissions
                permissionChecks.pickupLocationPermissions.deletePickupLocations,

                // OrdersPermissions
                permissionChecks.ordersPermissions.cancelOrders,

                // AddressPermissions
                permissionChecks.addressPermissions.deleteAddress,

                // PaymentsPermissions
                permissionChecks.paymentsPermissions.processRefunds,

                // EventsPermissions
                permissionChecks.eventsPermissions.deleteEvents,

                // ProductsPermissions
                permissionChecks.productsPermissions.deleteProducts,

                // LeadsPermissions
                permissionChecks.leadsPermissions.toggleLeads,

                // PurchaseOrderPermissions
                permissionChecks.purchaseOrderPermissions.togglePurchaseOrders,

                // SalesOrderPermissions
                permissionChecks.salesOrderPermissions.toggleSalesOrders,

                //WebTemplatePermissions
                permissionChecks.webTemplatePermissions.deployWebTemplate,
                permissionChecks.webTemplatePermissions.deactivateWebTemplate,

                //PackagesPermissions
                permissionChecks.packagePermissions.togglePackages,

                //SupportPermissions
                permissionChecks.supportPermissions.editTickets,
                permissionChecks.supportPermissions.deleteTickets
            );
        }
        if(role == "Customer") {
            permissionsToKeepTrue = [];
            permissionsToKeepTrue.push(
                // orders
                permissionChecks.ordersPermissions.viewOrders,
                permissionChecks.ordersPermissions.insertOrders,

                // products
                permissionChecks.productsPermissions.viewProducts,

                //promos
                permissionChecks.promosPermissions.viewPromos,
                permissionChecks.promosPermissions.insertPromos,
                permissionChecks.promosPermissions.updatePromos,

                // support
                permissionChecks.supportPermissions.raiseTickets,
                permissionChecks.supportPermissions.postComments,
                permissionChecks.supportPermissions.downloadAttachments,
                permissionChecks.supportPermissions.viewTickets,
                permissionChecks.supportPermissions.viewComments
            )
        }
        if(role == "Custom") {
            permissionsToKeepTrue = [];
            permissionsToKeepTrue.push(
                // support
                permissionChecks.supportPermissions.raiseTickets,
                permissionChecks.supportPermissions.postComments,
                permissionChecks.supportPermissions.downloadAttachments,
                permissionChecks.supportPermissions.viewTickets,
                permissionChecks.supportPermissions.viewComments
            )
        }

        updateUserPermissions(userPermissions.userPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.userLogPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.groupsPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.messagesPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.promosPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.pickupLocationPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.ordersPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.addressPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.paymentsPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.eventsPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.productsPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.apiKeyPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.leadsPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.purchaseOrderPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.salesOrderPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.supportPermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.webTemplatePermissions, permissionsToKeepTrue);
        updateUserPermissions(userPermissions.packagePermissions, permissionsToKeepTrue);

        return userPermissions;
    };

    React.useEffect(() => {
        dataApi(setLoading).getRoles().then((_roles: DataItem[]) => {
            dataApi(setLoading).getStates().then((_states: DataItem[]) => {
                if(isEdit || isView) {
                    handleFetchUserDetailsById(userId as number, _roles, _states);
                    setUserLogAndPagination(gridState);
                }
                else {
                    // set state for data variables.
                    setRoles(_roles);
                    setStates(_states);
                }
            });
        });
    }, []);

    return(
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle="Personal Information"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="First Name"
                        value={firstName}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value), [firstName])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Last Name"
                        value={lastName}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLastName(event.target.value), [lastName])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Email"
                        disabled={isEdit}
                        value={loginName}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLoginName(event.target.value), [loginName])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Date}
                        label="Date of birth"
                        value={dob}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setDob(new Date(event.target.value)), [dob])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Phone}
                        label="Phone"
                        value={phone}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPhone(event.target.value), [phone])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Dropdown}
                        label="Role"
                        value={role}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
                            setRole(event.target.value);
                            setUserPermissions(autoCheckPermissionsByRoles(event.target.value));
                        }, [role])}
                        data={roles}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Address Details"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Line 1"
                        value={line1}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLine1(event.target.value), [line1])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Line 2"
                        required={false}
                        value={line2}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLine2(event.target.value), [line2])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        required={false}
                        label="Landmark"
                        value={landmark}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLandmark(event.target.value), [landmark])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="City"
                        value={city}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setCity(event.target.value), [city])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Dropdown}
                        label="State"
                        value={state}
                        data={states}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setState(event.target.value), [state])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Zip Code"
                        value={zipCode}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setZipCode(event.target.value), [zipCode])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionSubTitle="User Permissions"
                sectionTitle="Select user permissions the user will be assigned to"
            >
                <Grid item md={12} xs={12}>
                    <UserPermission
                        userPermissions={userPermissions}
                        setUserPermissions={React.useCallback((updatedUserPermissions: UserPermissions) => {
                            setUserPermissions({
                                ...userPermissions,
                                ...updatedUserPermissions,
                            });
                        }, [userPermissions, role])}
                        readOnly={role !== "Custom"}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="User Groups"
                sectionSubTitle="Select user groups the user wants to be a part of"
            >
                <Grid item md={12} xs={12}>
                    <GroupSelectionGrid
                        isView={isView}
                        setLoading={setLoading}
                        selectedUserGroupIds={selectedUserGroupIds}
                        setSelectedUserGroupIds={React.useCallback((selectedUSerGroupIds: GridRowSelectionModel) => setSelectedUserGroupIds(selectedUSerGroupIds), [setSelectedUserGroupIds])}
                    />
                </Grid>
            </SectionLayout><br/>

            {isEdit || isView ? (
                <>
                    <SectionLayout
                        sectionTitle="User Logs"
                        sectionSubTitle="History of user activity since the time of user creation"
                    >
                        <StyledDataGrid
                            getRowId={(row) => row.logId}
                            disableRowSelectionOnClick={true}
                            rows={gridState.data}
                            columns={userLogGridColumns}
                            filterMode="server"
                            rowCount={gridState.actualDataCount}
                            paginationMode="server"
                            columnVisibilityModel={userLogGridColumnVisibilityModel}
                            onColumnVisibilityModelChange={React.useCallback(
                                (newModel: GridColumnVisibilityModel) => {
                                    setUserLogGridColumnVisibilityModel(newModel);
                                },
                                [userLogGridColumnVisibilityModel]
                            )}
                            slots={{
                                noRowsOverlay: CustomNoRowsOverlay,
                                toolbar: GridToolbar,
                                pagination: () => (
                                    <CustomPaginationForGrid pageSize={gridState.pageSize} />
                                ),
                            }}
                            initialState={{
                                pagination: { paginationModel: { pageSize: gridState.pageSize } },
                            }}
                            pageSizeOptions={[10, 25, 100]}
                            onFilterModelChange={React.useCallback(
                                (filterModel: GridFilterModel) =>
                                    filterChangeFunction({
                                        gridFilterModel: filterModel,
                                        setGridFunction: setUserLogAndPagination,
                                        paginatedGridModel: {
                                            includeDeleted: gridState.includeDeleted,
                                            filterExpr: gridState.filterExpr,
                                            pageSize: gridState.pageSize,
                                            start: 0,
                                            end: gridState.pageSize,
                                            actualDataCount: gridState.actualDataCount,
                                            totalPaginationBlockCount: gridState.totalPaginationBlockCount,
                                            data: gridState.data,
                                        },
                                    }),
                                [gridState]
                            )}
                            onPaginationModelChange={React.useCallback(
                                (newModel: GridPaginationModel) => {
                                    setUserLogAndPagination({
                                        includeDeleted: gridState.includeDeleted,
                                        filterExpr: gridState.filterExpr,
                                        pageSize: gridState.pageSize,
                                        start: newModel.pageSize * newModel.page,
                                        end: newModel.pageSize * newModel.page + newModel.pageSize,
                                        actualDataCount: gridState.actualDataCount,
                                        totalPaginationBlockCount: gridState.totalPaginationBlockCount,
                                        data: gridState.data,
                                    });
                                },
                                [gridState]
                            )}
                            getRowClassName={React.useCallback(
                                (params: GridRowClassNameParams) => {
                                    return params.row.deleted ? "deleted" : "";
                                },
                                [gridState]
                            )}
                        />
                    </SectionLayout><br/>
                </>
            ) : (
                <></>
            )}

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="userId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.users}
                    buttonText="User"
                />
            }
        </OutletLayout>
    );
}

export default AddOrEditUser;