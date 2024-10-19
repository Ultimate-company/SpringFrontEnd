import type { AgnosticRoute } from "@vaadin/hilla-file-router/types.js";
import { createRoute } from "@vaadin/hilla-file-router/runtime.js";
import * as Page0 from "../views/ApiKeys/AddOrEditApiKeys.js";
import * as Page2 from "../views/Lead/AddOrEditLead.js";
import * as Page3 from "../views/Lead/LeadsList.js";
import * as Page5 from "../views/Login/CarrierLanding.js";
import * as Page6 from "../views/Login/ConfirmEmail.js";
import * as Page7 from "../views/Login/Login.js";
import * as Page8 from "../views/Login/Register.js";
import * as Page10 from "../views/Message/AddOrEditMessage.js";
import * as Page11 from "../views/Message/Components/MessageList.js";
import * as Page13 from "../views/Message/MessagesList.js";
import * as Page14 from "../views/Message/ViewMessage.js";
import * as Page16 from "../views/NotFound.js";
import * as Page17 from "../views/Package/AddOrEditPackage.js";
import * as Page18 from "../views/Package/PackageList.js";
import * as Page20 from "../views/PickupLocation/AddOrEditPickupLocation.js";
import * as Page21 from "../views/PickupLocation/PickupLocationsList.js";
import * as Page23 from "../views/Product/AddOrEditProduct.js";
import * as Page24 from "../views/Product/Components/ReviewSection.js";
import * as Page26 from "../views/Product/ProductsList.js";
import * as Page28 from "../views/Promo/AddOrEditPromo.js";
import * as Page29 from "../views/Promo/PromosList.js";
import * as Page31 from "../views/PurchaseOrder/AddOrEditPurchaseOrder.js";
import * as Page32 from "../views/PurchaseOrder/PurchaseOrdersList.js";
import * as Page34 from "../views/SalesOrder/AddOrEditSalesOrder.js";
import * as Page35 from "../views/SalesOrder/SalesOrderList.js";
import * as Page37 from "../views/Support/AddOrEditSupport.js";
import * as Page38 from "../views/Support/Components/CommentSection.js";
import * as Page40 from "../views/Support/SupportList.js";
import * as Page42 from "../views/TodoList/TodoList.js";
import * as Page44 from "../views/User/AddOrEditUser.js";
import * as Page45 from "../views/User/Components/UserPermission.js";
import * as Page47 from "../views/User/UsersList.js";
import * as Page49 from "../views/UserGroup/AddOrEditUserGroup.js";
import * as Page50 from "../views/UserGroup/UserGroupsList.js";
import * as Page52 from "../views/WebTemplate/AddOrEditWebTemplate.js";
import * as Page53 from "../views/WebTemplate/Components/FontStyles.js";
import * as Page55 from "../views/WebTemplate/WebTemplateList.js";
const routes: readonly AgnosticRoute[] = [
    createRoute("ApiKeys", false, [
        createRoute("AddOrEditApiKeys", false, Page0)
    ]),
    createRoute("Lead", false, [
        createRoute("AddOrEditLead", false, Page2),
        createRoute("LeadsList", false, Page3)
    ]),
    createRoute("Login", false, [
        createRoute("CarrierLanding", false, Page5),
        createRoute("ConfirmEmail", false, Page6),
        createRoute("Login", false, Page7),
        createRoute("Register", false, Page8)
    ]),
    createRoute("Message", false, [
        createRoute("AddOrEditMessage", false, Page10),
        createRoute("Components", false, [
            createRoute("MessageList", false, Page11)
        ]),
        createRoute("MessagesList", false, Page13),
        createRoute("ViewMessage", false, Page14)
    ]),
    createRoute("NotFound", false, Page16),
    createRoute("Package", false, [
        createRoute("AddOrEditPackage", false, Page17),
        createRoute("PackageList", false, Page18)
    ]),
    createRoute("PickupLocation", false, [
        createRoute("AddOrEditPickupLocation", false, Page20),
        createRoute("PickupLocationsList", false, Page21)
    ]),
    createRoute("Product", false, [
        createRoute("AddOrEditProduct", false, Page23),
        createRoute("Components", false, [
            createRoute("ReviewSection", false, Page24)
        ]),
        createRoute("ProductsList", false, Page26)
    ]),
    createRoute("Promo", false, [
        createRoute("AddOrEditPromo", false, Page28),
        createRoute("PromosList", false, Page29)
    ]),
    createRoute("PurchaseOrder", false, [
        createRoute("AddOrEditPurchaseOrder", false, Page31),
        createRoute("PurchaseOrdersList", false, Page32)
    ]),
    createRoute("SalesOrder", false, [
        createRoute("AddOrEditSalesOrder", false, Page34),
        createRoute("SalesOrderList", false, Page35)
    ]),
    createRoute("Support", false, [
        createRoute("AddOrEditSupport", false, Page37),
        createRoute("Components", false, [
            createRoute("CommentSection", false, Page38)
        ]),
        createRoute("SupportList", false, Page40)
    ]),
    createRoute("TodoList", false, [
        createRoute("TodoList", false, Page42)
    ]),
    createRoute("User", false, [
        createRoute("AddOrEditUser", false, Page44),
        createRoute("Components", false, [
            createRoute("UserPermission", false, Page45)
        ]),
        createRoute("UsersList", false, Page47)
    ]),
    createRoute("UserGroup", false, [
        createRoute("AddOrEditUserGroup", false, Page49),
        createRoute("UserGroupsList", false, Page50)
    ]),
    createRoute("WebTemplate", false, [
        createRoute("AddOrEditWebTemplate", false, Page52),
        createRoute("Components", false, [
            createRoute("FontStyles", false, Page53)
        ]),
        createRoute("WebTemplateList", false, Page55)
    ])
];
export default routes;
