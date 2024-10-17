package org.example.springfrontend.Classes;

public class Endpoints {
    public static class Login {
        public static final String LOGIN_INDEX = "/";
    }

    public static class User {
        public static final String USERS_INDEX = "/dashboard/users";
    }

    public static class Lead {
        public static final String LEADS_INDEX = "/dashboard/leads";
    }

    public static class Promo {
        public static final String PROMOS_INDEX = "/dashboard/promos";
    }

    public static class Support {
        public static final String SUPPORT_INDEX = "/dashboard/support";
        public static final String EDIT_SUPPORT = "/dashboard/addSupport";
    }

    public static class Message {
        public static final String MESSAGES_INDEX = "/dashboard/messages";
    }

    public static class PickupLocation {
        public static final String PICKUP_LOCATIONS_INDEX = "/dashboard/pickupLocations";
    }

    public static class Package {
        public static final String PACKAGE_INDEX = "/dashboard/packages";
    }

    public static class Product {
        public static final String PRODUCTS_INDEX = "/dashboard/products";
    }

    public static class Carrier {
        public static final String CARRIERS_INDEX = "/carriers";
    }

    public static class UserGroup {
        public static final String USER_GROUPS_INDEX = "/dashboard/userGroups";
    }

    public static class PurchaseOrder {
        public static final String PURCHASE_ORDER_INDEX = "/dashboard/purchaseOrders";
    }

    public static class SalesOrder {
        public static final String SALES_ORDER_INDEX = "/dashboard/salesOrders";
    }

    public static class WebTemplate {
        public static final String WEB_TEMPLATE_INDEX = "/dashboard/webTemplates";
    }
}