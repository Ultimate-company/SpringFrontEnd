export const images = {
    altImage : ''
}

export const navigatingRoutes = {
    dashboard: {
        dashboard: '/dashboard',
        users: '/dashboard/users',
        products: '/dashboard/products',
        messages: '/dashboard/messages',
        userGroups: '/dashboard/userGroups',
        orders: '/dashboard/orders',
        promos: '/dashboard/promos',
        pickupLocations: '/dashboard/pickupLocations',
        payments: '/dashboard/payments',
        webTemplates: '/dashboard/webTemplates',
        addWebTemplate:  '/dashboard/addWebTemplate',
        support: '/dashboard/support',
        addSupport: '/dashboard/addSupport',
        schedule: '/dashboard/schedule',
        toDoList: '/dashboard/toDoList',
        apikeys: '/dashboard/apikeys',
        leads: '/dashboard/leads',
        packages: '/dashboard/packages',
        addPackage: '/dashboard/addPackage',
        purchaseorders: '/dashboard/purchaseorders',
        salesorders: '/dashboard/salesorders',
        addUser: '/dashboard/addUser',
        addProduct: '/dashboard/addProduct',
        addMessage: '/dashboard/addMessage',
        viewMessage: '/dashboard/viewMessage',
        addUserGroup: '/dashboard/addUserGroup',
        addOrder: '/dashboard/addOrder',
        editOrder: '/dashboard/editOrder',
        addEvent: '/dashboard/addEvent',
        addPickupLocation: '/dashboard/addPickupLocation',
        addPromo: '/dashboard/addPromo',
        addTicket: '/dashboard/addTicket',
        viewComments: '/dashboard/viewComments',
        addLead: '/dashboard/addLead',
        addPurchaseOrder: '/dashboard/addPurchaseOrder',
        addSalesOrder: '/dashboard/addSalesOrder',
        confirmPayment: '/dashboard/ConfirmPayment',
        guestCheckout: '/dashboard/GuestCheckout',
        carriers: '/carriers',
        confirmEmail: '/confirmEmail',
        login: '/',
        register: '/register',
    },
};

export function getLastPartFromRoute(routeString: string) {
    const parts = routeString.split('/');
    return parts[parts.length - 1];
}