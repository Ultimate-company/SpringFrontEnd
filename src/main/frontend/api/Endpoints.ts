import Axios from "axios";

const carrierBaseUrl = '/Carrier';
const eventBaseUrl = '/Events';
const userGroupBaseUrl = '/UserGroup';
const leadBaseUrl = '/Lead';
const loginBaseUrl = '/Login';
const messageBaseUrl = '/Message';
const orderBaseUrl = '/Order';
const paymentBaseUrl = '/Payment';
const pickupLocationBaseUrl = '/PickupLocation';
const productBaseUrl = '/Product';
const promoBaseUrl = '/Promo';
const purchaseOrderBaseUrl = '/PurchaseOrder';
const salesOrderBaseUrl = '/SalesOrder';
const supportBaseUrl = '/Support';
const todoBaseUrl = '/ToDo';
const userLogBaseUrl = '/UserLog';
const userBaseUrl = '/User';
const packageBaseUrl = '/Package';
const webTemplateBaseUrl = '/WebTemplate';

const dataBaseUrl = '/Data';

Axios.defaults.baseURL = window.location.origin;

const urlMapper = (baseUrl: string, endpoints: any) => Object.keys(endpoints).reduce((result, key) => {
    result[key] = `${baseUrl}\/${endpoints[key]}`;
    return result;
}, endpoints);

const carrierEndpoints = {
    getCarrierInBatches: 'getCarrierInBatches',
    setCarrier: 'setCarrier',
    getLoggedInCarrier: 'getLoggedInCarrier',
    updateApiKeys: 'updateApiKeys',
    getCarrierImage: 'getCarrierImage'
};

const eventEndpoints = {
};

const packageEndpoints = {
    setIncludeDeleted: 'setIncludeDeleted',
    getIncludeDeleted: 'getIncludeDeleted',
    getPackagesInBatches: 'getPackagesInBatches',
    togglePackage: 'togglePackage',
    createPackage: 'createPackage',
    getPackageById: 'getPackageById',
    updatePackage: 'updatePackage'
};

const userGroupEndpoints = {
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    getUserGroupsInBatches: 'getUserGroupsInBatches',
    toggleUserGroup: 'toggleUserGroup',
    createUserGroup: 'createUserGroup',
    updateUserGroup: 'updateUserGroup',
    getUserGroupDetailsById: 'getUserGroupDetailsById'
}

const leadsEndpoints = {
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    getLeadsInBatches: 'getLeadsInBatches',
    toggleLead: 'toggleLead',
    createLead: 'createLead',
    getLeadDetailsById: 'getLeadDetailsById',
    updateLead: 'updateLead'
}

const messageEndpoints = {
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    getMessagesInBatches: 'getMessagesInBatches',
    toggleMessage: 'toggleMessage',
    createMessage: 'createMessage',
    updateMessage: 'updateMessage',
    getMessageDetailsById: 'getMessageDetailsById',
    getMessagesByUserId: 'getMessagesByUserId',
    setMessageReadByUserIdAndMessageId: 'setMessageReadByUserIdAndMessageId'
}

const orderEndpoints = {
}

const paymentEndpoints = {
}

const pickupLocationEndpoints = {
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    getPickupLocationsInBatches: 'getPickupLocationsInBatches',
    togglePickupLocation: 'togglePickupLocation',
    createPickupLocation: 'createPickupLocation',
    getPickupLocationById: 'getPickupLocationById',
    updatePickupLocation: 'updatePickupLocation',
    getAllPickupLocations: 'getAllPickupLocations'
}

const productEndpoints = {
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    getProductsInBatches: 'getProductsInBatches',
    toggleReturnProduct: 'toggleReturnProduct',
    toggleDeleteProduct: 'toggleDeleteProduct',
    getProductDetailsByIds: 'getProductDetailsByIds',
    setProductCategory: 'setProductCategory',
    getProductCategories: 'getProductCategories',
    getColors: 'getColors',
    getStaticImage: 'getStaticImage',
    getProductImage: 'getProductImage',
    addProduct: 'addProduct',
    insertProductReview: 'insertProductReview',
    getProductReviewsGivenProductId: 'getProductReviewsGivenProductId',
    toggleProductReviewScore: 'toggleProductReviewScore',
    toggleProductReview: 'toggleProductReview',
    getProductReviewById: 'getProductReviewById',
    editProduct: 'editProduct'
}

const promoEndpoints = {
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    getPromosInBatches: 'getPromosInBatches',
    togglePromo: 'togglePromo',
    createPromo: 'createPromo',
    getPromoDetailsById: 'getPromoDetailsById',
    getPromoDetailsByName: 'getPromoDetailsByName'
}

const purchaseOrdersEndpoints = {
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    getPurchaseOrdersInBatches: 'getPurchaseOrdersInBatches',
    togglePurchaseOrder: 'togglePurchaseOrder',
    createPurchaseOrder: 'createPurchaseOrder',
    updatePurchaseOrder: 'updatePurchaseOrder',
    getPurchaseOrderById: 'getPurchaseOrderById',
    approvedByPurchaseOrder: 'approvedByPurchaseOrder',
    getPurchaseOrderPdf: 'getPurchaseOrderPdf'
}

const salesOrdersEndpoints = {
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    getSalesOrdersInBatches: 'getSalesOrdersInBatches',
    toggleSalesOrder: 'toggleSalesOrder',
    createSalesOrder: 'createSalesOrder',
    updateSalesOrder: 'updateSalesOrder',
    getSalesOrderById: 'getSalesOrderById',
    getShippingEstimate: 'getShippingEstimate',
    getPackagingEstimate: 'getPackagingEstimate',
    cancelSalesOrder: 'cancelSalesOrder',
    updateCustomerDeliveryAddress: 'updateCustomerDeliveryAddress',
    updateSalesOrderPickupAddress: 'updateSalesOrderPickupAddress'
}

const supportEndpoints = {
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    getSupportTicketsInBatches: 'getSupportTicketsInBatches',
    getTicketDetailsById: 'getTicketDetailsById',
    getAttachmentFromTicket: 'getAttachmentFromTicket',
    createTicket: 'createTicket',
    addComment: 'addComment',
    editTicket: 'editTicket',
    deleteTicket: 'deleteTicket',
    getAttachmentById: 'getAttachmentById',
    deleteComment: 'deleteComment',
    editComment: 'editComment'
}

const todoEndpoints = {
    getItems: 'getItems',
    addItem: 'addItem',
    deleteItem: 'deleteItem',
    toggleDone: 'toggleDone'
}

const userEndpoints = {
    getLoggedInUser: 'getLoggedInUser',
    getLoggedInUserPermissions: 'getLoggedInUserPermissions',
    getUsersInCarrierInBatches: 'getUsersInCarrierInBatches',
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    toggleUser: 'toggleUser',
    getUserById: 'getUserById',
    createUser: 'createUser',
    updateUser: 'updateUser'
}

const loginEndpoints = {
    signIn: 'signIn',
    signUp: 'signUp',
    logOut: 'logOut',
    checkIfUserIsLoggedIn: 'checkIfUserIsLoggedIn',
    resetPassword: 'resetPassword'
}

const dataEndpoints = {
    getStates: 'getStates',
    getRoles: 'getRoles',
    getLeadStatuses: 'getLeadStatuses',
    getPaymentOptions: 'getPaymentOptions',
    getFilterOptions: 'getFilterOptions',
    getSortOptions: 'getSortOptions',
    getStateCityMappingOptions: 'getStateCityMappingOptions',
    getFontStyles: 'getFontStyles'
}

const userLogEndpoints = {
    getUserLogsInBatchesByUserId: 'getUserLogsInBatchesByUserId',
};

const webTemplateEndpoints = {
    getIncludeDeleted: 'getIncludeDeleted',
    setIncludeDeleted: 'setIncludeDeleted',
    getWebTemplatesInBatches: 'getWebTemplatesInBatches',
    insertWebTemplate: 'insertWebTemplate',
    updateWebTemplate: 'updateWebTemplate',
    toggleWebTemplate: 'toggleWebTemplate',
    deployWebTemplate: 'deployWebTemplate',
    getWebTemplateById: 'getWebTemplateById'
}

export const carrierUrls = urlMapper(carrierBaseUrl, carrierEndpoints);
export const eventUrls = urlMapper(eventBaseUrl, eventEndpoints);
export const userGroupUrl = urlMapper(userGroupBaseUrl, userGroupEndpoints);
export const leadUrls = urlMapper(leadBaseUrl, leadsEndpoints);
export const messageUrls = urlMapper(messageBaseUrl, messageEndpoints);
export const orderUrls = urlMapper(orderBaseUrl, orderEndpoints);
export const paymentUrls = urlMapper(paymentBaseUrl, paymentEndpoints);
export const pickupLocationUrls = urlMapper(pickupLocationBaseUrl, pickupLocationEndpoints);
export const productUrls = urlMapper(productBaseUrl, productEndpoints);
export const promoUrls = urlMapper(promoBaseUrl, promoEndpoints);
export const purchaseOrderUrls = urlMapper(purchaseOrderBaseUrl, purchaseOrdersEndpoints);
export const salesOrderUrls = urlMapper(salesOrderBaseUrl, salesOrdersEndpoints);
export const supportUrls = urlMapper(supportBaseUrl, supportEndpoints);
export const todoUrls = urlMapper(todoBaseUrl, todoEndpoints);
export const userUrls = urlMapper(userBaseUrl, userEndpoints);
export const loginUrls = urlMapper(loginBaseUrl, loginEndpoints);
export const dataUrls = urlMapper(dataBaseUrl, dataEndpoints);
export const userLogUrls = urlMapper(userLogBaseUrl, userLogEndpoints);
export const packageUrls = urlMapper(packageBaseUrl, packageEndpoints);
export const webTemplateUrls = urlMapper(webTemplateBaseUrl, webTemplateEndpoints);