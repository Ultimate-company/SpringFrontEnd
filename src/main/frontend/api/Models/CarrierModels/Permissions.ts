type UsersPermission = {
    viewUser: boolean;
    updateUser: boolean;
    deleteUser: boolean;
    insertUser: boolean;
}

type UserLogPermissions = {
    viewLogs: boolean;
}

type GroupsPermissions = {
    viewGroups: boolean;
    insertGroups: boolean;
    deleteGroups: boolean;
    updateGroups: boolean;
}

type MessagesPermissions = {
    viewMessages: boolean;
    insertMessages: boolean;
    deleteMessages: boolean;
    updateMessages: boolean;
}

type PromosPermissions = {
    viewPromos: boolean;
    insertPromos: boolean;
    deletePromos: boolean;
    updatePromos: boolean;
}

type PickupLocationPermissions = {
    viewPickupLocations: boolean;
    insertPickupLocations: boolean;
    deletePickupLocations: boolean;
    updatePickupLocations: boolean;
}

type OrdersPermissions = {
    viewOrders: boolean;
    viewOrderStatistics: boolean;
    insertOrders: boolean;
    updateOrders: boolean;
    cancelOrders: boolean;
}

type AddressPermissions = {
    viewAddress: boolean;
    insertAddress: boolean;
    updateAddress: boolean;
    deleteAddress: boolean;
}

type PaymentsPermissions = {
    viewPayments: boolean;
    viewPaymentStatistics: boolean;
    processRefunds: boolean;
}

type EventsPermissions = {
    viewEvents: boolean;
    insertEvents: boolean;
    updateEvents: boolean;
    deleteEvents: boolean;
}

type ProductsPermissions = {
    insertProducts: boolean;
    viewProducts: boolean;
    updateProducts: boolean;
    deleteProducts: boolean;
}

type SupportPermissions = {
    raiseTickets: boolean;
    viewComments: boolean;
    postComments: boolean;
    downloadAttachments: boolean;
    viewTickets: boolean;
    deleteTickets: boolean;
    editTickets: boolean;
}

type ApiKeysPermissions = {
    viewApiKeys: boolean;
    insertApiKeys: boolean;
    updateApiKeys: boolean;
}

type LeadsPermissions = {
    viewLeads: boolean;
    insertLeads: boolean;
    updateLeads: boolean;
    toggleLeads: boolean;
}

type PurchaseOrderPermissions = {
    viewPurchaseOrders: boolean;
    insertPurchaseOrders: boolean;
    updatePurchaseOrders: boolean;
    togglePurchaseOrders: boolean;
}

type SalesOrderPermissions = {
    viewSalesOrders: boolean;
    insertSalesOrders: boolean;
    updateSalesOrders: boolean;
    toggleSalesOrders: boolean;
}

type WebTemplatePermissions = {
    viewWebTemplate: boolean;
    insertWebTemplate: boolean;
    updateWebTemplate: boolean;
    deployWebTemplate: boolean;
    deactivateWebTemplate: boolean;
}

type PackagePermissions = {
    viewPackages: boolean;
    insertPackages: boolean;
    togglePackages: boolean;
    updatePackages: boolean;
}

export type UserPermissions = {
    userPermissions: UsersPermission;
    userLogPermissions: UserLogPermissions;
    groupsPermissions: GroupsPermissions;
    messagesPermissions: MessagesPermissions;
    promosPermissions: PromosPermissions;
    pickupLocationPermissions: PickupLocationPermissions;
    ordersPermissions: OrdersPermissions;
    addressPermissions: AddressPermissions;
    paymentsPermissions: PaymentsPermissions;
    eventsPermissions: EventsPermissions;
    productsPermissions: ProductsPermissions;
    supportPermissions: SupportPermissions;
    apiKeyPermissions: ApiKeysPermissions;
    leadsPermissions: LeadsPermissions;
    salesOrderPermissions: SalesOrderPermissions;
    purchaseOrderPermissions: PurchaseOrderPermissions;
    webTemplatePermissions: WebTemplatePermissions;
    packagePermissions: PackagePermissions;
}

export const permissionChecks = {
    userPermissions: {
        viewUser: "ViewUser",
        updateUser: "UpdateUser",
        deleteUser: "DeleteUser",
        insertUser: "InsertUser",
    },
    userLogPermissions: {
        viewLogs: "ViewLogs",
    },
    groupsPermissions: {
        viewGroups: "ViewGroups",
        insertGroups: "InsertGroups",
        deleteGroups: "DeleteGroups",
        updateGroups: "UpdateGroups",
    },
    messagesPermissions: {
        viewMessages: "ViewMessages",
        insertMessages: "InsertMessages",
        deleteMessages: "DeleteMessages",
        updateMessages: "UpdateMessages",
    },
    promosPermissions: {
        viewPromos: "ViewPromos",
        insertPromos: "InsertPromos",
        deletePromos: "DeletePromos",
        updatePromos: "UpdatePromos",
    },
    pickupLocationPermissions: {
        viewPickupLocations: "ViewPickupLocations",
        insertPickupLocations: "InsertPickupLocations",
        deletePickupLocations: "DeletePickupLocations",
        updatePickupLocations: "UpdatePickupLocations",
    },
    ordersPermissions: {
        viewOrders: "ViewOrders",
        viewOrderStatistics: "ViewOrderStatistics",
        insertOrders: "InsertOrders",
        updateOrders: "UpdateOrders",
        cancelOrders: "CancelOrders",
    },
    addressPermissions: {
        viewAddress: "ViewAddress",
        insertAddress: "InsertAddress",
        updateAddress: "UpdateAddress",
        deleteAddress: "DeleteAddress",
    },
    paymentsPermissions: {
        viewPayments: "ViewPayments",
        viewPaymentStatistics: "ViewPaymentStatistics",
        processRefunds: "ProcessRefunds",
    },
    eventsPermissions: {
        viewEvents: "ViewEvents",
        insertEvents: "InsertEvents",
        updateEvents: "UpdateEvents",
        deleteEvents: "DeleteEvents",
    },
    productsPermissions: {
        insertProducts: "InsertProducts",
        viewProducts: "ViewProducts",
        updateProducts: "UpdateProducts",
        deleteProducts: "DeleteProducts",
    },
    supportPermissions: {
        raiseTickets: "RaiseTickets",
        viewComments: "ViewComments",
        postComments: "PostComments",
        downloadAttachments: "DownloadAttachments",
        viewTickets: "ViewTickets",
        deleteTickets: "DeleteTickets",
        editTickets: "EditTickets"
    },
    apiKeyPermissions: {
        viewApiKeys: "ViewApiKeys",
        insertApiKeys: "InsertApiKeys",
        updateApiKeys: "UpdateApiKeys",
    },
    leadsPermissions: {
        viewLeads: "ViewLeads",
        insertLeads: "InsertLeads",
        updateLeads: "UpdateLeads",
        toggleLeads: "ToggleLeads",
    },
    salesOrderPermissions: {
        viewSalesOrders: "ViewSalesOrders",
        insertSalesOrders: "InsertSalesOrders",
        updateSalesOrders: "UpdateSalesOrders",
        toggleSalesOrders: "ToggleSalesOrders",
    },
    purchaseOrderPermissions: {
        viewPurchaseOrders: "ViewPurchaseOrders",
        insertPurchaseOrders: "InsertPurchaseOrders",
        updatePurchaseOrders: "UpdatePurchaseOrders",
        togglePurchaseOrders: "TogglePurchaseOrders",
    },
    webTemplatePermissions: {
        viewWebTemplate: "ViewWebTemplate",
        insertWebTemplate: "InsertWebTemplate",
        updateWebTemplate: "UpdateWebTemplate",
        deployWebTemplate: "DeployWebTemplate",
        deactivateWebTemplate: "DeactivateWebTemplate",
    },
    packagePermissions: {
        viewPackages: "ViewPackages",
        insertPackages: "InsertPackages",
        togglePackages: "TogglePackages",
        updatePackages: "UpdatePackages",
    },
};