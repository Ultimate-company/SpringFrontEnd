import {
    carrierUrls,
    leadUrls,
    loginUrls,
    pickupLocationUrls,
    userGroupUrl,
    userUrls,
    todoUrls,
    promoUrls,
    messageUrls,
    productUrls,
    purchaseOrderUrls,
    salesOrderUrls,
    dataUrls,
    userLogUrls,
    packageUrls,
    supportUrls, webTemplateUrls
} from "./Endpoints";
import Axios from "axios";
import {LoginRequestModel} from "./Models/CentralModels/Login";
import toast from 'react-hot-toast';
import {Carrier} from "Frontend/api/Models/CentralModels/Carrier";
import {PaginationBaseRequestModel, PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import {
    User,
    Permissions,
    GetUsersForGridRequestModel,
    GetUserLogsRequestModel, UserLog, UserResponseModel, UserRequestModel
} from "Frontend/api/Models/CentralModels/User";
import {notificationSettings, warningNotificationSettings} from "Frontend/components/Snackbar/NotificationSnackbar";
import {LeadRequestModel, LeadResponseModel} from "Frontend/api/Models/CarrierModels/Lead";
import {UserGroupRequestModel, UserGroupResponseModel} from "Frontend/api/Models/CarrierModels/UserGroup";
import {
    PickupLocation,
    PickupLocationRequestModel,
    PickupLocationResponseModel
} from "Frontend/api/Models/CarrierModels/PickupLocation";
import {Todo} from "Frontend/api/Models/CarrierModels/Todo";
import {Promo} from "Frontend/api/Models/CarrierModels/Promo";
import {MessageRequestModel, MessageResponseModel} from "Frontend/api/Models/CarrierModels/Message";
import {
    GetProductCategoryResponseModel,
    Product, ProductReview, ProductReviewResponseModel,
    ProductsResponseModel
} from "Frontend/api/Models/CarrierModels/Product";
import {PurchaseOrderRequestModel, PurchaseOrderResponseModel} from "Frontend/api/Models/CarrierModels/PurchaseOrder";
import {
    GetSalesOrdersRequestModel,
    PackagingEstimateResponseModel,
    SalesOrderRequestModel,
    SalesOrderResponseModel, ShippingOptionsResponseModel
} from "Frontend/api/Models/CarrierModels/SalesOrder";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import {Package} from "Frontend/api/Models/CarrierModels/Package";
import {Address} from "Frontend/api/Models/CarrierModels/Address";
import {
    AddCommentResponseModel,
    CreateAttachmentResponseModel,
    CreateTicketResponseModel,
    GetCommentsResponseModel,
    GetTicketDetailsResponseModel,
    GetTicketsResponseModel, SupportRequestModel,
} from "Frontend/api/Models/CarrierModels/Support";
import {WebTemplateRequestModel, WebTemplateResponseModel} from "Frontend/api/Models/CarrierModels/WebTemplate";

const standardJsonHeader = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const enum requestMethod {
    POST,
    GET,
    PUT,
    DELETE,
    PATCH
}
const wrappedApiFunctions = async<T> (setLoading: (loading: boolean) => void, endpoint: string, method: requestMethod, data: any, customHeader?: any): Promise<T> => {
    let requestHeader = customHeader ?? standardJsonHeader;
    switch (method) {
        case requestMethod.GET:
            setLoading(true);
            const getResponse= await Axios.get(endpoint, { ...requestHeader });
            setLoading(false);
            return handleResponse<T>(getResponse.data);

        case requestMethod.POST:
            setLoading(true);
            const postResponse= await Axios.post(endpoint, data, { ...requestHeader });
            setLoading(false);
            return handleResponse<T>(postResponse.data);

        case requestMethod.PUT:
            setLoading(true);
            const putResponse= await Axios.put(endpoint, data, { ...requestHeader });
            setLoading(false);
            return handleResponse<T>(putResponse.data);

        case requestMethod.DELETE:
            setLoading(true);
            const deleteResponse= await Axios.delete(endpoint, { ...requestHeader });
            setLoading(false);
            return handleResponse<T>(deleteResponse.data);

        case requestMethod.PATCH:
            setLoading(true);
            const patchResponse= await Axios.patch(endpoint, { ...requestHeader });
            setLoading(false);
            return handleResponse<T>(patchResponse.data);

        default:
            throw new Error('Invalid method');
    }
}

export const carrierApi = {
    getCarriers: async (start: number, end: number, filteredText: string) => {
        const response = await Axios.get(carrierUrls.getCarrierInBatches +
            "?start=" + start + "&end=" + end + "&filteredText=" + filteredText,
            standardJsonHeader);
        return handleResponse<PaginationBaseResponseModel<Carrier>>(response.data);
    },
    setCarrier: async (carrierId: number) => {
        const response = await Axios.post(carrierUrls.setCarrier +
            "?carrierId=" + carrierId,
            standardJsonHeader);
        return handleResponse<boolean>(response.data);
    },
    getLoggedInCarrier: async () => {
        const response = await Axios.get(carrierUrls.getLoggedInCarrier,
            standardJsonHeader);
        return handleResponse<Carrier>(response.data);
    },
    updateApiKeys: async (carrier: Carrier) => {
        const response = await Axios.post(carrierUrls.updateApiKeys, carrier, { ...standardJsonHeader })
        return handleResponse<boolean>(response.data);
    },
}

export const loginApi = {
    signIn: async (loginRequestModel: LoginRequestModel) => {
        const response = await Axios.post(loginUrls.signIn, loginRequestModel, standardJsonHeader);
        return handleResponse<string>(response.data);
    },
    signUp: async (loginRequestModel: LoginRequestModel) => {
        const response = await Axios.post(loginUrls.signUp, loginRequestModel, standardJsonHeader);
        return handleResponse<string>(response.data);
    },
    logOut: async () => {
        const response = await Axios.post(loginUrls.logOut, null, standardJsonHeader);
        return handleResponse<string>(response.data);
    },
    checkIfUserIsLoggedIn: async () => {
        const response = await Axios.get(loginUrls.checkIfUserIsLoggedIn, standardJsonHeader);
        return handleResponse<string>(response.data);
    },
}

export const userApi = (setLoading: (loading: boolean) => void) => {
    return {
        getLoggedInUser: async () => {
            return await wrappedApiFunctions<User>(setLoading, userUrls.getLoggedInUser, requestMethod.GET, null);
        },
        getLoggedInUserPermissions: async () => {
            return await wrappedApiFunctions<Permissions>(setLoading, userUrls.getLoggedInUserPermissions, requestMethod.GET, null);
        },
        getUsersInCarrierInBatches: async (getUsersForGridRequestModel: GetUsersForGridRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<User>>(setLoading, userUrls.getUsersInCarrierInBatches, requestMethod.POST, getUsersForGridRequestModel);
        },
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, userUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        toggleUser: async (userId: number) => {
            return await wrappedApiFunctions<number>(setLoading, userUrls.toggleUser + `?userId=${userId}`, requestMethod.POST, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, userUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        getUserById: async (userId: number) => {
            return await wrappedApiFunctions<UserResponseModel>(setLoading, userUrls.getUserById + `?userId=${userId}`, requestMethod.GET, null);
        },
        createUser: async (userRequestModel: UserRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, userUrls.createUser, requestMethod.PUT, userRequestModel);
        },
        updateUser: async (userRequestModel: UserRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, userUrls.updateUser, requestMethod.POST, userRequestModel);
        }
    }
}

export const leadApi = (setLoading: (loading: boolean) => void) => {
    return {
        getLeadsInBatches: async (paginationBaseRequestModel: PaginationBaseRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<LeadResponseModel>>(setLoading, leadUrls.getLeadsInBatches, requestMethod.POST, paginationBaseRequestModel);
        },
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, leadUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, leadUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        toggleLead: async (leadId: number) => {
            return await wrappedApiFunctions<number>(setLoading, leadUrls.toggleLead + `?leadId=${leadId}`, requestMethod.DELETE, null);
        },
        createLead: async (leadRequestModel: LeadRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, leadUrls.createLead, requestMethod.PUT, leadRequestModel);
        },
        getLeadDetailsById: async (leadId: number) => {
            return await wrappedApiFunctions<LeadResponseModel>(setLoading, leadUrls.getLeadDetailsById + `?leadId=${leadId}`, requestMethod.GET, null);
        },
        updateLead: async (leadRequestModel: LeadRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, leadUrls.updateLead, requestMethod.POST, leadRequestModel);
        },
    };
};

export const userGroupApi = (setLoading: (loading: boolean) => void) => {
    return {
        getUserGroupsInBatches: async (paginationBaseRequestModel: PaginationBaseRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<UserGroupResponseModel>>(setLoading, userGroupUrl.getUserGroupsInBatches, requestMethod.POST, paginationBaseRequestModel);
        },
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, userGroupUrl.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, userGroupUrl.setIncludeDeleted, requestMethod.POST, null);
        },
        toggleUserGroup: async (userGroupId: number) => {
            return await wrappedApiFunctions<number>(setLoading, userGroupUrl.toggleUserGroup + `?userGroupId=${userGroupId}`, requestMethod.DELETE, null);
        },
        createUserGroup: async (userGroupRequestModel: UserGroupRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, userGroupUrl.createUserGroup, requestMethod.PUT, userGroupRequestModel);
        },
        updateUserGroup: async (userGroupRequestModel: UserGroupRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, userGroupUrl.updateUserGroup, requestMethod.POST, userGroupRequestModel);
        },
        getUserGroupDetailsById: async (userGroupId: number) => {
            return await wrappedApiFunctions<UserGroupResponseModel>(setLoading, userGroupUrl.getUserGroupDetailsById + `?userGroupId=${userGroupId}`, requestMethod.GET, null);
        }
    };
};

export const pickupLocationApi = (setLoading: (loading: boolean) => void) => {
    return {
        getPickupLocationsInBatches: async (paginationBaseRequestModel: PaginationBaseRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<PickupLocationResponseModel>>(setLoading, pickupLocationUrls.getPickupLocationsInBatches, requestMethod.POST, paginationBaseRequestModel);
        },
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, pickupLocationUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, pickupLocationUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        togglePickupLocation: async (pickupLocationId: number) => {
            return await wrappedApiFunctions<number>(setLoading, pickupLocationUrls.togglePickupLocation + `?pickupLocationId=${pickupLocationId}`, requestMethod.DELETE, null);
        },
        createPickupLocation: async (pickupLocationRequestModel: PickupLocationRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, pickupLocationUrls.createPickupLocation, requestMethod.PUT, pickupLocationRequestModel);
        },
        getPickupLocationById: async (pickupLocationId: number) => {
            return await wrappedApiFunctions<PickupLocationResponseModel>(setLoading, pickupLocationUrls.getPickupLocationById + `?pickupLocationId=${pickupLocationId}`, requestMethod.GET, null);
        },
        updatePickupLocation: async (pickupLocationRequestModel: PickupLocationRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, pickupLocationUrls.updatePickupLocation , requestMethod.POST, pickupLocationRequestModel);
        },
        getAllPickupLocations: async () => {
            return await wrappedApiFunctions<PickupLocation[]>(setLoading, pickupLocationUrls.getAllPickupLocations , requestMethod.GET, null);
        },
    };
};

export const toDoApi = (setLoading: (loading: boolean) => void) => {
    return {
        getItems: async () => {
            return await wrappedApiFunctions<Todo[]>(setLoading, todoUrls.getItems, requestMethod.GET, null);
        },
        addItem: async (todo: Todo) => {
            return await wrappedApiFunctions<number>(setLoading, todoUrls.addItem, requestMethod.PUT, todo);
        },
        deleteItem: async (todoId: number) => {
            return await wrappedApiFunctions<boolean>(setLoading, todoUrls.deleteItem + `?todoId=${todoId}`, requestMethod.DELETE, null);
        },
        toggleDone: async (todoId: number) => {
            return await wrappedApiFunctions<boolean>(setLoading, todoUrls.toggleDone + `?todoId=${todoId}`, requestMethod.POST, null);
        },
    };
};

export const promoApi = (setLoading: (loading: boolean) => void) => {
    return {
        getPromosInBatches: async (paginationBaseRequestModel: PaginationBaseRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<Promo>>(setLoading, promoUrls.getPromosInBatches, requestMethod.POST, paginationBaseRequestModel);
        },
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, promoUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, promoUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        togglePromo: async (promoId: number) => {
            return await wrappedApiFunctions<number>(setLoading, promoUrls.togglePromo + `?promoId=${promoId}`, requestMethod.POST, null);
        },
        createPromo: async (promo: Promo) => {
            return await wrappedApiFunctions<number>(setLoading, promoUrls.createPromo, requestMethod.PUT, promo);
        },
        getPromoDetailsById: async (promoId: number) => {
            return await wrappedApiFunctions<Promo>(setLoading, promoUrls.getPromoDetailsById + `?promoId=${promoId}`, requestMethod.GET, null);
        },
        getPromoDetailsByName: async (promoCode: string) => {
            return await wrappedApiFunctions<Promo>(setLoading, promoUrls.getPromoDetailsByName + `?promoCode=${promoCode}`, requestMethod.GET, null);
        }
    };
};

export const supportApi = (setLoading: (loading: boolean) => void) => {
    return {
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, supportUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, supportUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        getSupportTicketsInBatches: async (start: number, end: number) => {
            return await wrappedApiFunctions<GetTicketsResponseModel>(setLoading, supportUrls.getSupportTicketsInBatches + `?start=${start}&end=${end}`, requestMethod.GET, null);
        },
        getTicketDetailsById: async (ticketId: string) => {
            return await wrappedApiFunctions<GetTicketDetailsResponseModel>(setLoading, supportUrls.getTicketDetailsById + `?ticketId=${ticketId}`, requestMethod.GET, null);
        },
        getAttachmentFromTicket: async (ticketId: number) => {
            return await wrappedApiFunctions<Map<string, string>>(setLoading, supportUrls.getAttachmentFromTicket + `?ticketId=${ticketId}`, requestMethod.GET, null);
        },
        createTicket: async (supportRequestModel: SupportRequestModel) => {
            return await wrappedApiFunctions<CreateTicketResponseModel>(setLoading, supportUrls.createTicket, requestMethod.PUT, supportRequestModel);
        },
        addComment: async (ticketId: string, supportRequestModel: SupportRequestModel) => {
            return await wrappedApiFunctions<AddCommentResponseModel>(setLoading, supportUrls.addComment + `?ticketId=${ticketId}`, requestMethod.PUT, supportRequestModel);
        },
        deleteComment: async (ticketId: string, commentId: string) => {
            return await wrappedApiFunctions<boolean>(setLoading, supportUrls.deleteComment + `?ticketId=${ticketId}` + `&commentId=${commentId}`,
                requestMethod.DELETE, null);
        },
        editComment: async (ticketId: string, commentId: string, supportRequestModel: SupportRequestModel) => {
            return await wrappedApiFunctions<boolean>(setLoading, supportUrls.editComment + `?ticketId=${ticketId}` + `&commentId=${commentId}`,
                requestMethod.POST, supportRequestModel);
        },
        editTicket: async (ticketId: string, supportRequestModel: SupportRequestModel) => {
            return await wrappedApiFunctions<boolean>(setLoading, supportUrls.editTicket+ `?ticketId=${ticketId}`, requestMethod.POST, supportRequestModel);
        },
        deleteTicket: async (ticketId: number) => {
            return await wrappedApiFunctions<boolean>(setLoading, supportUrls.deleteTicket + `?ticketId=${ticketId}`, requestMethod.DELETE, null);
        }
    };
};

export const messageApi = (setLoading: (loading: boolean) => void) => {
    return {
        getMessagesInBatches: async (paginationBaseRequestModel: PaginationBaseRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<MessageResponseModel>>(setLoading, messageUrls.getMessagesInBatches, requestMethod.POST, paginationBaseRequestModel);
        },
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, messageUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, messageUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        toggleMessage: async (messageId: number) => {
            return await wrappedApiFunctions<number>(setLoading, messageUrls.toggleMessage + `?messageId=${messageId}`, requestMethod.POST, null);
        },
        createMessage: async (messageRequestModel: MessageRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, messageUrls.createMessage, requestMethod.PUT, messageRequestModel);
        },
        updateMessage: async (messageRequestModel: MessageRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, messageUrls.updateMessage, requestMethod.POST, messageRequestModel);
        },
        getMessageDetailsById: async (messageId: number) => {
            return await wrappedApiFunctions<MessageResponseModel>(setLoading, messageUrls.getMessageDetailsById+ `?messageId=${messageId}`, requestMethod.GET, null);
        },
        getMessagesByUserId: async () => {
            return await wrappedApiFunctions<MessageResponseModel[]>(setLoading, messageUrls.getMessagesByUserId, requestMethod.GET, null);
        },
        setMessageReadByUserIdAndMessageId: async (messageId: number) => {
            return await wrappedApiFunctions<boolean>(setLoading, messageUrls.setMessageReadByUserIdAndMessageId + "?messageId=" + messageId, requestMethod.POST, null);
        },
    };
};

export const productApi = (setLoading: (loading: boolean) => void) => {
    return {
        getProductsInBatches: async (paginationBaseRequestModel: PaginationBaseRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<ProductsResponseModel>>(setLoading, productUrls.getProductsInBatches, requestMethod.POST, paginationBaseRequestModel);
        },
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, productUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, productUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        toggleReturnProduct: async (productId: number) => {
            return await wrappedApiFunctions<number>(setLoading, productUrls.toggleReturnProduct + `?productId=${productId}`, requestMethod.POST, null);
        },
        toggleDeleteProduct: async (productId: number) => {
            return await wrappedApiFunctions<number>(setLoading, productUrls.toggleDeleteProduct + `?productId=${productId}`, requestMethod.POST, null);
        },
        getProductDetailsByIds: async (productIds: number[]) => {
            return await wrappedApiFunctions<ProductsResponseModel[]>(setLoading, productUrls.getProductDetailsByIds + `?productIds=${productIds.join(',')}`, requestMethod.GET, null);
        },
        setProductCategory: async (productCategory: string) => {
            return await wrappedApiFunctions<boolean>(setLoading, productUrls.setProductCategory, requestMethod.PUT, productCategory);
        },
        getProductCategories: async () => {
            return await wrappedApiFunctions<GetProductCategoryResponseModel>(setLoading, productUrls.getProductCategories, requestMethod.GET, null);
        },
        getColors: async () => {
            return await wrappedApiFunctions<Map<string, string>[]>(setLoading, productUrls.getColors, requestMethod.GET, null);
        },
        addProduct: async (product: Product, images: Map<string, string>) => {
            return await wrappedApiFunctions<number>(setLoading, productUrls.addProduct, requestMethod.PUT, {
                product: product,
                images: Object.fromEntries(images)
            });
        },
        editProduct: async (product: Product, images: Map<string, string>) => {
            return await wrappedApiFunctions<number>(setLoading, productUrls.editProduct, requestMethod.POST, {
                product: product,
                images: Object.fromEntries(images)
            });
        },
        insertProductReview: async (productReview: ProductReview) => {
            return await wrappedApiFunctions<number>(setLoading, productUrls.insertProductReview, requestMethod.PUT, productReview);
        },
        getProductReviewsGivenProductId: async (paginationBaseRequestModel: PaginationBaseRequestModel, productId: number) => {
            return await wrappedApiFunctions<ProductReviewResponseModel>(setLoading, productUrls.getProductReviewsGivenProductId + `?productId=${productId}`, requestMethod.POST, paginationBaseRequestModel);
        },
        toggleProductReviewScore: async (reviewId:number, increaseScore:boolean) => {
            return await wrappedApiFunctions<boolean>(setLoading, productUrls.toggleProductReviewScore + `?reviewId=${reviewId}&increaseScore=${increaseScore}`, requestMethod.POST, null);
        },
        toggleProductReview: async (reviewId: number) => {
            return await wrappedApiFunctions<boolean>(setLoading, productUrls.toggleProductReview + `?reviewId=${reviewId}`, requestMethod.DELETE, null);
        },
        getProductReviewById: async (reviewId: number) => {
            return await wrappedApiFunctions<ProductReviewResponseModel>(setLoading, productUrls.getProductReviewById + `?reviewId=${reviewId}`, requestMethod.GET, null);
        }
    };
};

export const purchaseOrderApi = (setLoading: (loading: boolean) => void) => {
    return {
        getPurchaseOrdersInBatches: async (paginationBaseRequestModel: PaginationBaseRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<PurchaseOrderResponseModel>>(setLoading, purchaseOrderUrls.getPurchaseOrdersInBatches, requestMethod.POST, paginationBaseRequestModel);
        },
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, purchaseOrderUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, purchaseOrderUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        togglePurchaseOrder: async (purchaseOrderId: number) => {
            return await wrappedApiFunctions<number>(setLoading, purchaseOrderUrls.togglePurchaseOrder + `?purchaseOrderId=${purchaseOrderId}`, requestMethod.DELETE, null);
        },
        createPurchaseOrder: async (purchaseOrderRequestModel: PurchaseOrderRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, purchaseOrderUrls.createPurchaseOrder, requestMethod.PUT, purchaseOrderRequestModel);
        },
        updatePurchaseOrder: async (purchaseOrderRequestModel: PurchaseOrderRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, purchaseOrderUrls.updatePurchaseOrder, requestMethod.POST, purchaseOrderRequestModel);
        },
        getPurchaseOrderById: async (purchaseOrderId: number) => {
            return await wrappedApiFunctions<PurchaseOrderResponseModel>(setLoading, purchaseOrderUrls.getPurchaseOrderById + `?purchaseOrderId=${purchaseOrderId}`, requestMethod.GET, null);
        },
        approvedByPurchaseOrder: async (purchaseOrderId: number) => {
            return await wrappedApiFunctions<boolean>(setLoading, purchaseOrderUrls.approvedByPurchaseOrder + `?purchaseOrderId=${purchaseOrderId}`, requestMethod.POST, null);
        },
        downloadPdf: async (purchaseOrderId: number) => {
            const response = await Axios.get(`${purchaseOrderUrls.getPurchaseOrderPdf}?purchaseOrderId=${purchaseOrderId}`, {
                responseType: 'arraybuffer',
            });

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Create a link element
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'purchaseOrder.pdf'); // Set file name

            // Append the link to the body
            document.body.appendChild(link);

            // Programmatically click the link to trigger the download
            link.click();

            // Clean up by removing the link
            document.body.removeChild(link);
        }
    };
};

export const salesOrderApi = (setLoading: (loading: boolean) => void) => {
    return {
        getSalesOrdersInBatches: async (getSalesOrdersRequestModel: GetSalesOrdersRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<SalesOrderResponseModel>>(setLoading, salesOrderUrls.getSalesOrdersInBatches, requestMethod.POST, getSalesOrdersRequestModel);
        },
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, salesOrderUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, salesOrderUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        toggleSalesOrder: async (salesOrderId: number) => {
            return await wrappedApiFunctions<number>(setLoading, salesOrderUrls.toggleSalesOrder + `?salesOrderId=${salesOrderId}`, requestMethod.POST, null);
        },
        createSalesOrder: async (salesOrderRequestModel: SalesOrderRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, salesOrderUrls.createSalesOrder, requestMethod.PUT, salesOrderRequestModel);
        },
        updateSalesOrder: async (salesOrderRequestModel: SalesOrderRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, salesOrderUrls.updateSalesOrder, requestMethod.POST, salesOrderRequestModel);
        },
        getSalesOrderById: async (salesOrderId: number) => {
            return await wrappedApiFunctions<SalesOrderResponseModel>(setLoading, salesOrderUrls.getSalesOrderById + `?salesOrderId=${salesOrderId}`, requestMethod.GET, null);
        },
        getPackagingEstimate: async (productQuantityMapping: Map<number, number>) => {
            return await wrappedApiFunctions<PackagingEstimateResponseModel[]>(setLoading, salesOrderUrls.getPackagingEstimate, requestMethod.POST, Object.fromEntries(productQuantityMapping));
        },
        getShippingEstimate: async (pickupZipCodeProductIdMapping: Map<string, number[]>, deliveryZipCode: string, isOrderPrePaid: boolean) => {
            return await wrappedApiFunctions<ShippingOptionsResponseModel[]>(setLoading, salesOrderUrls.getShippingEstimate +
                `?deliveryZipCode=${deliveryZipCode}&isOrderPrePaid=${isOrderPrePaid}`
                , requestMethod.POST
                , Object.fromEntries(pickupZipCodeProductIdMapping));
        },
        cancelSalesOrder: async (salesOrderId: number) => {
            return await wrappedApiFunctions<boolean>(setLoading, salesOrderUrls.cancelSalesOrder + `?salesOrderId=${salesOrderId}`, requestMethod.DELETE, null);
        },
        updateCustomerDeliveryAddress: async (salesOrderId: number, address: Address) => {
            return await wrappedApiFunctions<boolean>(setLoading, salesOrderUrls.updateCustomerDeliveryAddress + `?salesOrderId=${salesOrderId}`, requestMethod.POST, address);
        },
        updateSalesOrderPickupAddress: async (salesOrderId: number, shipRocketOrderId: number, pickupLocationId: number) => {
            return await wrappedApiFunctions<boolean>(setLoading,
                salesOrderUrls.updateSalesOrderPickupAddress + `?salesOrderId=${salesOrderId}&shipRocketOrderId=${shipRocketOrderId}&pickupLocationId=${pickupLocationId}`,
                requestMethod.POST,
                null);
        },
    };
};

export const dataApi = (setLoading: (loading: boolean) => void) => {
    return {
        getStates: async () => {
            return await wrappedApiFunctions<DataItem[]>(setLoading, dataUrls.getStates, requestMethod.GET, null);
        },
        getRoles: async () => {
            return await wrappedApiFunctions<DataItem[]>(setLoading, dataUrls.getRoles, requestMethod.GET, null);
        },
        getLeadStatuses: async () => {
            return await wrappedApiFunctions<DataItem[]>(setLoading, dataUrls.getLeadStatuses, requestMethod.GET, null);
        },
        getFilterOptions: async () => {
            return await wrappedApiFunctions<DataItem[]>(setLoading, dataUrls.getFilterOptions, requestMethod.GET, null);
        },
        getSortOptions: async () => {
            return await wrappedApiFunctions<DataItem[]>(setLoading, dataUrls.getSortOptions, requestMethod.GET, null);
        },
        getPaymentOptions: async () => {
            return await wrappedApiFunctions<{ [key: string]: { label: string; value: string }[] }>(setLoading, dataUrls.getPaymentOptions, requestMethod.GET, null);
        },
        getStateCityMappingOptions: async () => {
            return await wrappedApiFunctions<{ [key: string]: string[] }>(setLoading, dataUrls.getStateCityMappingOptions, requestMethod.GET, null);
        },
        getFontStyles: async () => {
            return await wrappedApiFunctions<DataItem[]>(setLoading, dataUrls.getFontStyles, requestMethod.GET, null);
        },
    };
};

export const userLogApi = (setLoading: (loading: boolean) => void) => {
    return {
        getUserLogsInBatchesByUserId: async (getUserLogsRequestModel: GetUserLogsRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<UserLog>>(setLoading, userLogUrls.getUserLogsInBatchesByUserId, requestMethod.POST, getUserLogsRequestModel);
        },
    };
};

export const packageApi = (setLoading: (loading: boolean) => void) => {
    return {
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, packageUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, packageUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        getPackagesInBatches: async (paginationBaseRequestModel: PaginationBaseRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<Package>>(setLoading, packageUrls.getPackagesInBatches, requestMethod.POST, paginationBaseRequestModel);
        },
        togglePackage: async (packageId: number) => {
            return await wrappedApiFunctions<boolean>(setLoading, packageUrls.togglePackage + "?packageId=" + packageId, requestMethod.DELETE, null);
        },
        createPackage: async (_package: Package) => {
            return await wrappedApiFunctions<number>(setLoading, packageUrls.createPackage, requestMethod.PUT, _package);
        },
        getPackageById: async (packageId: number) => {
            return await wrappedApiFunctions<Package>(setLoading, packageUrls.getPackageById + "?packageId=" + packageId, requestMethod.GET, null);
        },
        updatePackage: async (_package: Package) => {
            return await wrappedApiFunctions<number>(setLoading, packageUrls.updatePackage, requestMethod.POST, _package);
        },
    };
};

export const webTemplateApi = (setLoading: (loading: boolean) => void) => {
    return {
        getIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, webTemplateUrls.getIncludeDeleted, requestMethod.GET, null);
        },
        setIncludeDeleted: async () => {
            return await wrappedApiFunctions<boolean>(setLoading, webTemplateUrls.setIncludeDeleted, requestMethod.POST, null);
        },
        getWebTemplatesInBatches: async (paginationBaseRequestModel: PaginationBaseRequestModel) => {
            return await wrappedApiFunctions<PaginationBaseResponseModel<WebTemplateResponseModel>>(setLoading, webTemplateUrls.getWebTemplatesInBatches, requestMethod.POST, paginationBaseRequestModel);
        },
        insertWebTemplate: async (webTemplateRequestModel: WebTemplateRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, webTemplateUrls.insertWebTemplate, requestMethod.PUT, webTemplateRequestModel);
        },
        updateWebTemplate: async (webTemplateRequestModel: WebTemplateRequestModel) => {
            return await wrappedApiFunctions<number>(setLoading, webTemplateUrls.updateWebTemplate, requestMethod.POST, webTemplateRequestModel);
        },
        toggleWebTemplate: async (webTemplateId: number) => {
            return await wrappedApiFunctions<number>(setLoading, webTemplateUrls.toggleWebTemplate + `?webTemplateId=${webTemplateId}`, requestMethod.POST, null);
        },
        deployWebTemplate: async (webTemplateId: number) => {
            return await wrappedApiFunctions<boolean>(setLoading, webTemplateUrls.deployWebTemplate + `?webTemplateId=${webTemplateId}`, requestMethod.POST, null);
        },
        getWebTemplateById: async (webTemplateId: number) => {
            return await wrappedApiFunctions<WebTemplateResponseModel>(setLoading, webTemplateUrls.getWebTemplateById + `?webTemplateId=${webTemplateId}`, requestMethod.GET, null);
        }
    };
};

function handleResponse<T>(response: any,): Promise<T> {
    if (response.responseType == "Success") {
        // display success toast
        if(response.message != null && response.message != ""){
            toast.success(response.message,  notificationSettings);
        }
        return Promise.resolve(response.item as T);
    }
    else if (response.responseType == "Error") {
        // display error toast
        if(response.message != null && response != "") {
            toast.error(response.message,  notificationSettings);
        }
        return Promise.reject(new Error(response.message));
    }
    else if (response.responseType == "Warning") {
        // display error toast
        if(response.message != null && response != "") {
            toast(response.message, warningNotificationSettings);
        }
        return Promise.reject(new Error(response.message));
    }
    else if (response.responseType == "Redirect") {
        // redirect to another page
        if(response.message != null && response != ""){
            sessionStorage.setItem('redirectMessage', response.message);
        }
        window.location.href = response.redirectLink;
        return Promise.resolve(response.item as T);
    }

    return Promise.reject(new Error("Invalid response type"));
}