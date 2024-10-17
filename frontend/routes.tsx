import MainLayout from 'Frontend/components/Layouts/MainLayout/MainLayout';
import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Login from "./views/Login/Login";
import DashboardLayout from "Frontend/components/Layouts/DashboardLayout/DashboardLayout";
import Register from "./views/Login/Register";
import NotFound from "./views/NotFound";
import ConfirmEmail from "./views/Login/ConfirmEmail";
import CarrierLanding from "./views/Login/CarrierLanding";
import UsersList from "Frontend/views/User/UsersList";
import LeadsList from "Frontend/views/Lead/LeadsList";
import UserGroupsList from "Frontend/views/UserGroup/UserGroupsList";
import PickupLocationsList from "Frontend/views/PickupLocation/PickupLocationsList";
import TodoList from "Frontend/views/TodoList/TodoList";
import {getLastPartFromRoute, navigatingRoutes} from "Frontend/navigation";
import PromosList from "Frontend/views/Promo/PromosList";
import PurchaseOrdersList from "Frontend/views/PurchaseOrder/PurchaseOrdersList";
import SalesOrderList from "Frontend/views/SalesOrder/SalesOrderList";
import MessagesList from "Frontend/views/Message/MessagesList";
import ProductsList from "Frontend/views/Product/ProductsList";
import AddOrEditUser from "Frontend/views/User/AddOrEditUser";
import AddOrEditLead from "Frontend/views/Lead/AddOrEditLead";
import AddOrEditPromo from "Frontend/views/Promo/AddOrEditPromo";
import AddOrEditMessage from "Frontend/views/Message/AddOrEditMessage";
import ViewMessage from "Frontend/views/Message/ViewMessage";
import AddOrEditPickupLocation from "Frontend/views/PickupLocation/AddOrEditPickupLocation";
import AddOrEditUserGroup from "Frontend/views/UserGroup/AddOrEditUserGroup";
import AddOrEditPurchaseOrder from "Frontend/views/PurchaseOrder/AddOrEditPurchaseOrder";
import AddOrEditSalesOrder from "Frontend/views/SalesOrder/AddOrEditSalesOrder";
import PackageList from "Frontend/views/Package/PackageList";
import AddOrEditPackage from "Frontend/views/Package/AddOrEditPackage";
import AddOrEditProduct from "Frontend/views/Product/AddOrEditProduct";
import AddOrEditApiKeys from "Frontend/views/ApiKeys/AddOrEditApiKeys";
import SupportList from "Frontend/views/Support/SupportList";
import AddOrEditSupport from "Frontend/views/Support/AddOrEditSupport";
import WebTemplateList from "Frontend/views/WebTemplate/WebTemplateList";
import AddOrEditWebTemplate from "Frontend/views/WebTemplate/AddOrEditWebTemplate";

export const routes = [
    {
        path: '',
        element: <MainLayout/>,
        children: [
            // {path: '404', element: <NotFound/>},
            // {path: '*', element: <NotFound/>},
            {path: 'carriers', element: <CarrierLanding/>},
            {path: 'confirmEmail', element: <ConfirmEmail/>},
            {path: '/', element: <Login/> },
            {path: 'register', element: <Register/>},
            {path: '404', element: <NotFound/>},
            {path: '*', element: <NotFound/>}
        ]
    },
    {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
            // users
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.users), element: <UsersList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addUser), element: <AddOrEditUser/>},

            // leads
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.leads), element: <LeadsList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addLead), element: <AddOrEditLead/>},

            // user groups
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.userGroups), element: <UserGroupsList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addUserGroup), element: <AddOrEditUserGroup/>},

            // pickup locations
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.pickupLocations), element: <PickupLocationsList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addPickupLocation), element: <AddOrEditPickupLocation/>},

            // todo list
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.toDoList), element: <TodoList/>},

            // promos
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.promos), element: <PromosList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addPromo), element: <AddOrEditPromo/>},

            // messages
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.messages), element: <MessagesList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addMessage), element: <AddOrEditMessage/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.viewMessage), element: <ViewMessage/>},

            // Products
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.products), element: <ProductsList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addProduct), element: <AddOrEditProduct/>},

            // Purchase Orders
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.purchaseorders), element: <PurchaseOrdersList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addPurchaseOrder), element: <AddOrEditPurchaseOrder/>},

            // Sales Orders
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.salesorders), element: <SalesOrderList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addSalesOrder), element: <AddOrEditSalesOrder/>},

            // Packages
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.packages), element: <PackageList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addPackage), element: <AddOrEditPackage/>},

            // Api keys
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.apikeys), element: <AddOrEditApiKeys/>},

            // Support
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.support), element: <SupportList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addSupport), element: <AddOrEditSupport/>},

            // Web templates
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.webTemplates), element: <WebTemplateList/>},
            {path: getLastPartFromRoute(navigatingRoutes.dashboard.addWebTemplate), element: <AddOrEditWebTemplate/>}
        ]
    }
] as RouteObject[];

export default createBrowserRouter(routes);