import {Divider, Grid} from "@mui/material";
import React from "react";
import BodyText from "Frontend/components/Fonts/BodyText";
import CheckboxInput from "Frontend/components/FormInputs/CheckboxInput";
import {UserPermissions} from "Frontend/api/Models/CarrierModels/Permissions";

interface UserPermissionProps {
    userPermissions: UserPermissions;
    setUserPermissions: (permissions: UserPermissions) => void;
    readOnly: boolean;
}

const UserPermission = (props: UserPermissionProps) => {
    const autoCheckPermissions = () => {
        /* package permissions */
        if (props.userPermissions.packagePermissions.togglePackages) {
            props.userPermissions.packagePermissions.insertPackages = true;
            props.userPermissions.packagePermissions.updatePackages = true;
            props.userPermissions.packagePermissions.viewPackages = true;
        } else if (props.userPermissions.packagePermissions.updatePackages) {
            props.userPermissions.packagePermissions.insertPackages = true;
            props.userPermissions.packagePermissions.viewPackages = true;
        } else if (props.userPermissions.packagePermissions.insertPackages) {
            props.userPermissions.packagePermissions.viewPackages = true;
        }

        /* user permissions */
        if (props.userPermissions.userPermissions.deleteUser) {
            props.userPermissions.userPermissions.insertUser = true;
            props.userPermissions.userPermissions.updateUser = true;
            props.userPermissions.userPermissions.viewUser = true;
        } else if (props.userPermissions.userPermissions.updateUser) {
            props.userPermissions.userPermissions.insertUser = true;
            props.userPermissions.userPermissions.viewUser = true;
        } else if (props.userPermissions.userPermissions.insertUser) {
            props.userPermissions.userPermissions.viewUser = true;
        }

        /* groups permissions */
        if (props.userPermissions.groupsPermissions.deleteGroups) {
            props.userPermissions.groupsPermissions.insertGroups = true;
            props.userPermissions.groupsPermissions.updateGroups = true;
            props.userPermissions.groupsPermissions.viewGroups = true;
            props.userPermissions.userPermissions.viewUser = true;
        } else if (props.userPermissions.groupsPermissions.updateGroups) {
            props.userPermissions.groupsPermissions.insertGroups = true;
            props.userPermissions.groupsPermissions.viewGroups = true;
            props.userPermissions.userPermissions.viewUser = true;
        } else if (props.userPermissions.groupsPermissions.insertGroups) {
            props.userPermissions.groupsPermissions.viewGroups = true;
            props.userPermissions.userPermissions.viewUser = true;
        } else if (props.userPermissions.groupsPermissions.viewGroups) {
            props.userPermissions.userPermissions.viewUser = true;
        }

        /* messages permissions */
        if (props.userPermissions.messagesPermissions.deleteMessages) {
            props.userPermissions.messagesPermissions.insertMessages = true;
            props.userPermissions.messagesPermissions.updateMessages = true;
            props.userPermissions.messagesPermissions.viewMessages = true;
            props.userPermissions.userPermissions.viewUser = true;
            props.userPermissions.groupsPermissions.viewGroups = true;
        } else if (props.userPermissions.messagesPermissions.updateMessages) {
            props.userPermissions.messagesPermissions.insertMessages = true;
            props.userPermissions.messagesPermissions.viewMessages = true;
            props.userPermissions.userPermissions.viewUser = true;
            props.userPermissions.groupsPermissions.viewGroups = true;
        } else if (props.userPermissions.messagesPermissions.insertMessages) {
            props.userPermissions.messagesPermissions.viewMessages = true;
            props.userPermissions.userPermissions.viewUser = true;
            props.userPermissions.groupsPermissions.viewGroups = true;
        } else if (props.userPermissions.messagesPermissions.viewMessages) {
            props.userPermissions.userPermissions.viewUser = true;
            props.userPermissions.groupsPermissions.viewGroups = true;
        }

        /* promos permissions */
        if (props.userPermissions.promosPermissions.deletePromos) {
            props.userPermissions.promosPermissions.insertPromos = true;
            props.userPermissions.promosPermissions.updatePromos = true;
            props.userPermissions.promosPermissions.viewPromos = true;
        } else if (props.userPermissions.promosPermissions.updatePromos) {
            props.userPermissions.promosPermissions.insertPromos = true;
            props.userPermissions.promosPermissions.viewPromos = true;
        } else if (props.userPermissions.promosPermissions.insertPromos) {
            props.userPermissions.promosPermissions.viewPromos = true;
        }

        /* pickupLocation Permissions */
        if (props.userPermissions.pickupLocationPermissions.deletePickupLocations) {
            props.userPermissions.pickupLocationPermissions.insertPickupLocations = true;
            props.userPermissions.pickupLocationPermissions.updatePickupLocations = true;
            props.userPermissions.pickupLocationPermissions.viewPickupLocations = true;
        } else if (props.userPermissions.pickupLocationPermissions.updatePickupLocations) {
            props.userPermissions.pickupLocationPermissions.insertPickupLocations = true;
            props.userPermissions.pickupLocationPermissions.viewPickupLocations = true;
        } else if (props.userPermissions.pickupLocationPermissions.insertPickupLocations) {
            props.userPermissions.pickupLocationPermissions.viewPickupLocations = true;
        }

        /* orders permissions */
        if (props.userPermissions.ordersPermissions.cancelOrders) {
            props.userPermissions.ordersPermissions.viewOrders = true;
            props.userPermissions.ordersPermissions.insertOrders = true;
            props.userPermissions.ordersPermissions.updateOrders = true;
            props.userPermissions.userPermissions.viewUser = true;
            props.userPermissions.paymentsPermissions.processRefunds = true;
            props.userPermissions.paymentsPermissions.viewPayments = true;
            props.userPermissions.promosPermissions.insertPromos = true;
            props.userPermissions.promosPermissions.viewPromos = true;
            props.userPermissions.promosPermissions.deletePromos = true;
            props.userPermissions.promosPermissions.updatePromos = true;
            props.userPermissions.productsPermissions.viewProducts = true;
        } else if (props.userPermissions.ordersPermissions.updateOrders) {
            props.userPermissions.ordersPermissions.viewOrders = true;
            props.userPermissions.ordersPermissions.insertOrders = true;
            props.userPermissions.userPermissions.viewUser = true;
            props.userPermissions.paymentsPermissions.processRefunds = true;
            props.userPermissions.paymentsPermissions.viewPayments = true;
            props.userPermissions.promosPermissions.insertPromos = true;
            props.userPermissions.promosPermissions.viewPromos = true;
            props.userPermissions.promosPermissions.deletePromos = true;
            props.userPermissions.promosPermissions.updatePromos = true;
            props.userPermissions.productsPermissions.viewProducts = true;
        } else if (props.userPermissions.ordersPermissions.insertOrders) {
            props.userPermissions.ordersPermissions.viewOrders = true;
            props.userPermissions.promosPermissions.insertPromos = true;
            props.userPermissions.promosPermissions.viewPromos = true;
            props.userPermissions.promosPermissions.deletePromos = true;
            props.userPermissions.promosPermissions.updatePromos = true;
            props.userPermissions.productsPermissions.viewProducts = true;
        } else if (props.userPermissions.ordersPermissions.viewOrders) {
            props.userPermissions.promosPermissions.viewPromos = true;
            props.userPermissions.productsPermissions.viewProducts = true;
        }

        /* address permissions */
        if (props.userPermissions.addressPermissions.deleteAddress) {
            props.userPermissions.addressPermissions.insertAddress = true;
            props.userPermissions.addressPermissions.updateAddress = true;
            props.userPermissions.addressPermissions.viewAddress = true;
        } else if (props.userPermissions.addressPermissions.updateAddress) {
            props.userPermissions.addressPermissions.insertAddress = true;
            props.userPermissions.addressPermissions.viewAddress = true;
        } else if (props.userPermissions.addressPermissions.insertAddress) {
            props.userPermissions.addressPermissions.viewAddress = true;
        }

        /* payments permissions */
        if (props.userPermissions.paymentsPermissions.processRefunds) {
            props.userPermissions.paymentsPermissions.viewPayments = true;
            props.userPermissions.promosPermissions.insertPromos = true;
            props.userPermissions.promosPermissions.updatePromos = true;
            props.userPermissions.promosPermissions.deletePromos = true;
            props.userPermissions.promosPermissions.viewPromos = true;
        } else if (props.userPermissions.paymentsPermissions.viewPayments) {
            props.userPermissions.ordersPermissions.viewOrders = true;
            props.userPermissions.userPermissions.viewUser = true;
        }

        /* events permissions */
        if (props.userPermissions.eventsPermissions.deleteEvents) {
            props.userPermissions.eventsPermissions.insertEvents = true;
            props.userPermissions.eventsPermissions.updateEvents = true;
            props.userPermissions.eventsPermissions.viewEvents = true;
        } else if (props.userPermissions.eventsPermissions.updateEvents) {
            props.userPermissions.eventsPermissions.insertEvents = true;
            props.userPermissions.eventsPermissions.viewEvents = true;
        } else if (props.userPermissions.eventsPermissions.insertEvents) {
            props.userPermissions.eventsPermissions.viewEvents = true;
        }

        /* products permissions */
        if (props.userPermissions.productsPermissions.deleteProducts) {
            props.userPermissions.pickupLocationPermissions.viewPickupLocations = true;
            props.userPermissions.productsPermissions.insertProducts = true;
            props.userPermissions.productsPermissions.updateProducts = true;
            props.userPermissions.productsPermissions.viewProducts = true;
        } else if (props.userPermissions.productsPermissions.updateProducts) {
            props.userPermissions.pickupLocationPermissions.viewPickupLocations = true;
            props.userPermissions.productsPermissions.insertProducts = true;
            props.userPermissions.productsPermissions.viewProducts = true;
        } else if (props.userPermissions.productsPermissions.insertProducts) {
            props.userPermissions.pickupLocationPermissions.viewPickupLocations = true;
            props.userPermissions.productsPermissions.viewProducts = true;
            props.userPermissions.pickupLocationPermissions.viewPickupLocations = true;
        }

        /* support permissions */
        if (props.userPermissions.supportPermissions.raiseTickets) {
            props.userPermissions.supportPermissions.viewTickets = true;
            props.userPermissions.supportPermissions.viewComments = true;
            props.userPermissions.supportPermissions.postComments = true;
            props.userPermissions.supportPermissions.downloadAttachments = true;
            props.userPermissions.supportPermissions.editTickets = true;
        } else if (props.userPermissions.supportPermissions.viewTickets) {
            props.userPermissions.supportPermissions.viewComments = true;
            props.userPermissions.supportPermissions.downloadAttachments = true;
        } else if (props.userPermissions.supportPermissions.viewComments) {
            props.userPermissions.supportPermissions.viewTickets = true;
            props.userPermissions.supportPermissions.downloadAttachments = true;
        } else if (props.userPermissions.supportPermissions.downloadAttachments) {
            props.userPermissions.supportPermissions.viewComments = true;
            props.userPermissions.supportPermissions.viewTickets = true;
        }

        /* api key permissions */
        if (props.userPermissions.apiKeyPermissions.updateApiKeys) {
            props.userPermissions.apiKeyPermissions.insertApiKeys = true;
            props.userPermissions.apiKeyPermissions.viewApiKeys = true;
        }
        if (props.userPermissions.apiKeyPermissions.insertApiKeys) {
            props.userPermissions.apiKeyPermissions.viewApiKeys = true;
        }

        /* leads permissions */
        if (props.userPermissions.leadsPermissions.toggleLeads) {
            props.userPermissions.leadsPermissions.viewLeads = true;
            props.userPermissions.leadsPermissions.updateLeads = true;
            props.userPermissions.leadsPermissions.insertLeads = true;
        } else if (props.userPermissions.leadsPermissions.updateLeads) {
            props.userPermissions.leadsPermissions.viewLeads = true;
            props.userPermissions.leadsPermissions.insertLeads = true;
        } else if (props.userPermissions.leadsPermissions.insertLeads) {
            props.userPermissions.leadsPermissions.viewLeads = true;
        }

        /* purchase order permissions */
        if (props.userPermissions.purchaseOrderPermissions.togglePurchaseOrders) {
            props.userPermissions.purchaseOrderPermissions.viewPurchaseOrders = true;
            props.userPermissions.purchaseOrderPermissions.updatePurchaseOrders = true;
            props.userPermissions.purchaseOrderPermissions.insertPurchaseOrders = true;
        } else if (props.userPermissions.purchaseOrderPermissions.updatePurchaseOrders) {
            props.userPermissions.purchaseOrderPermissions.viewPurchaseOrders = true;
            props.userPermissions.purchaseOrderPermissions.insertPurchaseOrders = true;
        } else if (props.userPermissions.purchaseOrderPermissions.insertPurchaseOrders) {
            props.userPermissions.purchaseOrderPermissions.viewPurchaseOrders = true;
        }

        /* sales order permissions */
        if (props.userPermissions.salesOrderPermissions.toggleSalesOrders) {
            props.userPermissions.salesOrderPermissions.viewSalesOrders = true;
            props.userPermissions.salesOrderPermissions.updateSalesOrders = true;
            props.userPermissions.salesOrderPermissions.insertSalesOrders = true;
        } else if (props.userPermissions.salesOrderPermissions.updateSalesOrders) {
            props.userPermissions.salesOrderPermissions.viewSalesOrders = true;
            props.userPermissions.salesOrderPermissions.insertSalesOrders = true;
        } else if (props.userPermissions.salesOrderPermissions.insertSalesOrders) {
            props.userPermissions.salesOrderPermissions.viewSalesOrders = true;
        }

        props.setUserPermissions(props.userPermissions);
    };

    return (
        <>
            <Grid container spacing={20}>
                <Grid item xs={4}>
                    <BodyText text="User Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        label="View User Details"
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.userPermissions.viewUser = !props.userPermissions.userPermissions.viewUser;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.userPermissions.viewUser}
                    />
                    <CheckboxInput
                        label="Create Users"
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.userPermissions.insertUser = !props.userPermissions.userPermissions.insertUser;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.userPermissions.insertUser}
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.userPermissions.updateUser = !props.userPermissions.userPermissions.updateUser;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.userPermissions.updateUser}
                        label="Update User Details"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.userPermissions.deleteUser = !props.userPermissions.userPermissions.deleteUser;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.userPermissions.deleteUser}
                        label="Delete User"
                    />
                </Grid>
                <Grid item xs={4}>
                    <BodyText text="UserLogs Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.userLogPermissions.viewLogs = !props.userPermissions.userLogPermissions.viewLogs;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.userLogPermissions.viewLogs}
                        label="View User Logs"
                    />
                </Grid>
                <Grid item xs={4}>
                    <BodyText text="Groups Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.groupsPermissions.viewGroups = !props.userPermissions.groupsPermissions.viewGroups;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.groupsPermissions.viewGroups}
                        label="View User Groups"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.groupsPermissions.insertGroups = !props.userPermissions.groupsPermissions.insertGroups;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.groupsPermissions.insertGroups}
                        label="Add User Groups"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.groupsPermissions.updateGroups = !props.userPermissions.groupsPermissions.updateGroups;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.groupsPermissions.updateGroups}
                        label="Update User Groups"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.groupsPermissions.deleteGroups = !props.userPermissions.groupsPermissions.deleteGroups;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.groupsPermissions.deleteGroups}
                        label="Delete User Groups"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={20}>
                <Grid item xs={4}>
                    <BodyText text="Messages Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.messagesPermissions.viewMessages = !props.userPermissions.messagesPermissions.viewMessages;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.messagesPermissions.viewMessages}
                        label="View Messages"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.messagesPermissions.insertMessages = !props.userPermissions.messagesPermissions.insertMessages;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.messagesPermissions.insertMessages}
                        label="Add Messages"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.messagesPermissions.updateMessages = !props.userPermissions.messagesPermissions.updateMessages;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.messagesPermissions.updateMessages}
                        label="Update Messages"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.messagesPermissions.deleteMessages = !props.userPermissions.messagesPermissions.deleteMessages;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.messagesPermissions.deleteMessages}
                        label="Delete Messages"
                    />
                </Grid>
                <Grid item xs={4}>
                    <BodyText text="Promos Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.promosPermissions.viewPromos = !props.userPermissions.promosPermissions.viewPromos;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.promosPermissions.viewPromos}
                        label="View Promos"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.promosPermissions.insertPromos = !props.userPermissions.promosPermissions.insertPromos;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.promosPermissions.insertPromos}
                        label="Add Promos"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.promosPermissions.updatePromos = !props.userPermissions.promosPermissions.updatePromos;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.promosPermissions.updatePromos}
                        label="Update Promos"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.promosPermissions.deletePromos = !props.userPermissions.promosPermissions.deletePromos;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.promosPermissions.deletePromos}
                        label="Delete Promos"
                    />
                </Grid>
                <Grid item xs={4}>
                    <BodyText text="Address Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.addressPermissions.viewAddress = !props.userPermissions.addressPermissions.viewAddress;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.addressPermissions.viewAddress}
                        label="View Address"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.addressPermissions.insertAddress = !props.userPermissions.addressPermissions.insertAddress;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.addressPermissions.insertAddress}
                        label="Add Address"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.addressPermissions.updateAddress = !props.userPermissions.addressPermissions.updateAddress;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.addressPermissions.updateAddress}
                        label="Update Address"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.addressPermissions.deleteAddress = !props.userPermissions.addressPermissions.deleteAddress;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.addressPermissions.deleteAddress}
                        label="Delete Address"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={20}>
                <Grid item xs={4}>
                    <BodyText text="PickupLocations Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.pickupLocationPermissions.viewPickupLocations = !props.userPermissions.pickupLocationPermissions.viewPickupLocations;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.pickupLocationPermissions.viewPickupLocations}
                        label="View Pickup Locations"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.pickupLocationPermissions.insertPickupLocations = !props.userPermissions.pickupLocationPermissions.insertPickupLocations;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.pickupLocationPermissions.insertPickupLocations}
                        label="Add Pickup Locations"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.pickupLocationPermissions.updatePickupLocations = !props.userPermissions.pickupLocationPermissions.updatePickupLocations;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.pickupLocationPermissions.updatePickupLocations}
                        label="Update Pickup Locations"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.pickupLocationPermissions.deletePickupLocations = !props.userPermissions.pickupLocationPermissions.deletePickupLocations;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.pickupLocationPermissions.deletePickupLocations}
                        label="Delete Pickup Locations"
                    />
                </Grid>

                <Grid item xs={4}>
                    <BodyText text="Orders Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.ordersPermissions.viewOrders = !props.userPermissions.ordersPermissions.viewOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.ordersPermissions.viewOrders}
                        label="View Orders"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.ordersPermissions.viewOrderStatistics = !props.userPermissions.ordersPermissions.viewOrderStatistics;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.ordersPermissions.viewOrderStatistics}
                        label="View Order Statistics"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.ordersPermissions.insertOrders = !props.userPermissions.ordersPermissions.insertOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.ordersPermissions.insertOrders}
                        label="Add Orders"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.ordersPermissions.updateOrders = !props.userPermissions.ordersPermissions.updateOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.ordersPermissions.updateOrders}
                        label="Update Orders"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.ordersPermissions.cancelOrders = !props.userPermissions.ordersPermissions.cancelOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.ordersPermissions.cancelOrders}
                        label="Cancel Orders"
                    />
                </Grid>

                <Grid item xs={4}>
                    <BodyText text="Payments Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.paymentsPermissions.viewPayments = !props.userPermissions.paymentsPermissions.viewPayments;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.paymentsPermissions.viewPayments}
                        label="View Payments"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.paymentsPermissions.viewPaymentStatistics = !props.userPermissions.paymentsPermissions.viewPaymentStatistics;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.paymentsPermissions.viewPaymentStatistics}
                        label="View Payment Statistics"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.paymentsPermissions.processRefunds = !props.userPermissions.paymentsPermissions.processRefunds;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.paymentsPermissions.processRefunds}
                        label="Process Payment Refunds"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={20}>
                <Grid item xs={4}>
                    <BodyText text="Events Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.eventsPermissions.viewEvents = !props.userPermissions.eventsPermissions.viewEvents;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.eventsPermissions.viewEvents}
                        label="View Events"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.eventsPermissions.insertEvents = !props.userPermissions.eventsPermissions.insertEvents;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.eventsPermissions.insertEvents}
                        label="Add Events"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.eventsPermissions.updateEvents = !props.userPermissions.eventsPermissions.updateEvents;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.eventsPermissions.updateEvents}
                        label="Update Events"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.eventsPermissions.deleteEvents = !props.userPermissions.eventsPermissions.deleteEvents;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.eventsPermissions.deleteEvents}
                        label="Delete Events"
                    />
                </Grid>

                <Grid item xs={4}>
                    <BodyText text="Products Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.productsPermissions.viewProducts = !props.userPermissions.productsPermissions.viewProducts;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.productsPermissions.viewProducts}
                        label="View Products"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.productsPermissions.insertProducts = !props.userPermissions.productsPermissions.insertProducts;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.productsPermissions.insertProducts}
                        label="Add Products"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.productsPermissions.updateProducts = !props.userPermissions.productsPermissions.updateProducts;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.productsPermissions.updateProducts}
                        label="Update Products"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.productsPermissions.deleteProducts = !props.userPermissions.productsPermissions.deleteProducts;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.productsPermissions.deleteProducts}
                        label="Delete Products"
                    />
                </Grid>

                <Grid item xs={4}>
                    <BodyText text="Support Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.supportPermissions.viewTickets = !props.userPermissions.supportPermissions.viewTickets;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.supportPermissions.viewTickets}
                        label="View Tickets"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.supportPermissions.viewComments = !props.userPermissions.supportPermissions.viewComments;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.supportPermissions.viewComments}
                        label="View Comments"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.supportPermissions.postComments = !props.userPermissions.supportPermissions.postComments;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.supportPermissions.postComments}
                        label="Post Comments"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.supportPermissions.downloadAttachments = !props.userPermissions.supportPermissions.downloadAttachments;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.supportPermissions.downloadAttachments}
                        label="Download Attachments"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.supportPermissions.deleteTickets = !props.userPermissions.supportPermissions.deleteTickets;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.supportPermissions.deleteTickets}
                        label="Delete Tickets"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.supportPermissions.editTickets = !props.userPermissions.supportPermissions.editTickets;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.supportPermissions.editTickets}
                        label="Edit Tickets"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={20}>
                <Grid item xs={4}>
                    <BodyText text="Api Key Permissions" />
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.apiKeyPermissions.viewApiKeys = !props.userPermissions.apiKeyPermissions.viewApiKeys;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.apiKeyPermissions.viewApiKeys}
                        label="View Api Keys"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.apiKeyPermissions.insertApiKeys = !props.userPermissions.apiKeyPermissions.insertApiKeys;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.apiKeyPermissions.insertApiKeys}
                        label="Insert Api Keys"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.apiKeyPermissions.updateApiKeys = !props.userPermissions.apiKeyPermissions.updateApiKeys;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.apiKeyPermissions.updateApiKeys}
                        label="Update Api Keys"
                    />
                </Grid>

                <Grid item xs={4}>
                    <BodyText text="Leads Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.leadsPermissions.viewLeads = !props.userPermissions.leadsPermissions.viewLeads;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.leadsPermissions.viewLeads}
                        label="View Leads"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.leadsPermissions.insertLeads = !props.userPermissions.leadsPermissions.insertLeads;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.leadsPermissions.insertLeads}
                        label="Insert Leads"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.leadsPermissions.updateLeads = !props.userPermissions.leadsPermissions.updateLeads;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.leadsPermissions.updateLeads}
                        label="Update Leads"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.leadsPermissions.toggleLeads = !props.userPermissions.leadsPermissions.toggleLeads;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.leadsPermissions.toggleLeads}
                        label="Toggle Leads"
                    />
                </Grid>

                <Grid item xs={4}>
                    <BodyText text="Purchase Order Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.purchaseOrderPermissions.viewPurchaseOrders = !props.userPermissions.purchaseOrderPermissions.viewPurchaseOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.purchaseOrderPermissions.viewPurchaseOrders}
                        label="View Purchase Orders"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.purchaseOrderPermissions.insertPurchaseOrders = !props.userPermissions.purchaseOrderPermissions.insertPurchaseOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.purchaseOrderPermissions.insertPurchaseOrders}
                        label="Insert Purchase Orders"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.purchaseOrderPermissions.updatePurchaseOrders = !props.userPermissions.purchaseOrderPermissions.updatePurchaseOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.purchaseOrderPermissions.updatePurchaseOrders}
                        label="Update Purchase Orders"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.purchaseOrderPermissions.togglePurchaseOrders = !props.userPermissions.purchaseOrderPermissions.togglePurchaseOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.purchaseOrderPermissions.togglePurchaseOrders}
                        label="Toggle Purchase Orders"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={20}>
                <Grid item xs={4}>
                    <BodyText text="Sales Order Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.salesOrderPermissions.viewSalesOrders = !props.userPermissions.salesOrderPermissions.viewSalesOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.salesOrderPermissions.viewSalesOrders}
                        label="View Sales Orders"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.salesOrderPermissions.insertSalesOrders = !props.userPermissions.salesOrderPermissions.insertSalesOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.salesOrderPermissions.insertSalesOrders}
                        label="Insert Sales Orders"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.salesOrderPermissions.updateSalesOrders = !props.userPermissions.salesOrderPermissions.updateSalesOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.salesOrderPermissions.updateSalesOrders}
                        label="Update Sales Orders"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.salesOrderPermissions.toggleSalesOrders = !props.userPermissions.salesOrderPermissions.toggleSalesOrders;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.salesOrderPermissions.toggleSalesOrders}
                        label="Toggle Sales Orders"
                    />
                </Grid>
                <Grid item xs={4}>
                    <BodyText text="Web Template Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.webTemplatePermissions.viewWebTemplate = !props.userPermissions.webTemplatePermissions.viewWebTemplate;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.webTemplatePermissions.viewWebTemplate}
                        label="View Web Templates"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.webTemplatePermissions.insertWebTemplate = !props.userPermissions.webTemplatePermissions.insertWebTemplate;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.webTemplatePermissions.insertWebTemplate}
                        label="Insert Web Template"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.webTemplatePermissions.updateWebTemplate = !props.userPermissions.webTemplatePermissions.updateWebTemplate;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.webTemplatePermissions.updateWebTemplate}
                        label="Update Web Template"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.webTemplatePermissions.deployWebTemplate = !props.userPermissions.webTemplatePermissions.deployWebTemplate;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.webTemplatePermissions.deployWebTemplate}
                        label="Deploy Web Template"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.webTemplatePermissions.deactivateWebTemplate = !props.userPermissions.webTemplatePermissions.deactivateWebTemplate;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.webTemplatePermissions.deactivateWebTemplate}
                        label="Deactivate Web Template"
                    />
                </Grid>
                <Grid item xs={4}>
                    <BodyText text="Package Permissions"/>
                    <Divider/>
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.packagePermissions.viewPackages = !props.userPermissions.packagePermissions.viewPackages;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.packagePermissions.viewPackages}
                        label="View Packages"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.packagePermissions.insertPackages = !props.userPermissions.packagePermissions.insertPackages;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.packagePermissions.insertPackages}
                        label="Insert Packages"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.packagePermissions.updatePackages = !props.userPermissions.packagePermissions.updatePackages;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.packagePermissions.updatePackages}
                        label="Update Packages"
                    />
                    <CheckboxInput
                        disabled={props.readOnly}
                        onChange={() => {
                            props.userPermissions.packagePermissions.togglePackages = !props.userPermissions.packagePermissions.togglePackages;
                            props.setUserPermissions(props.userPermissions);
                            autoCheckPermissions();
                        }}
                        checked={props.userPermissions.packagePermissions.togglePackages}
                        label="Toggle Packages"
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default React.memo(UserPermission);