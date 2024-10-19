import {PurchaseOrder} from "Frontend/api/Models/CarrierModels/PurchaseOrder";
import {Address} from "Frontend/api/Models/CarrierModels/Address";
import {Lead} from "Frontend/api/Models/CarrierModels/Lead";
import {User} from "Frontend/api/Models/CentralModels/User";
import {PaymentInfo} from "Frontend/api/Models/CarrierModels/Payment";
import {Package} from "Frontend/api/Models/CarrierModels/Package";
import {Product} from "Frontend/api/Models/CarrierModels/Product";
import {PickupLocationResponseModel} from "Frontend/api/Models/CarrierModels/PickupLocation";
import {PaginationBaseRequestModel} from "Frontend/api/Models/BaseModel";

export enum SalesOrderStatus {
    ORDER_RECEIVED = 1,
    ORDER_PICKED = 2,
    ORDER_IN_TRANSIT= 3,
    OUT_FOR_DELIVERY= 4,
    DELIVERED = 5,
    CANCELLED = 6,
    RETURNED = 7,
    PARTIAL_RETURN = 8
}

export type GetSalesOrdersRequestModel = PaginationBaseRequestModel & {
    salesOrderStatus: SalesOrderStatus[]
}

export type SalesOrder = {
    salesOrderId?: number;
    termsAndConditionsMarkdown?: string;
    termsAndConditionsHtml?: string;
    deleted?: boolean;
    paymentId?: number;
    billingAddressId?: number;
    shippingAddressId?: number;
    purchaseOrderId?: number;
    createdByUserId?: number;
    salesOrderStatus: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
}

export type SalesOrderResponseModel = {
    salesOrder: SalesOrder;
    purchaseOrder: PurchaseOrder;
    paymentInfo: PaymentInfo;
    billingAddress: Address;
    shippingAddress: Address;
    lead: Lead;
    purchaseOrderAddress: Address;
    purchaseOrderCreatedBy: User;
    purchaseOrderApprovedBy: User;
}

export type SalesOrdersProductQuantityMap = {
    salesOrdersProductQuantityMapId?: number;
    quantity: number;
    originalPrice: number;
    pricePerQuantityPerProduct: number;
    productId: number;
    salesOrderId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
};

export type SelectedCourier = {
    pickupLocationId: number;
    availableCourierId?: string;
    shipmentPickupDate?: Date;
}

export type SalesOrderRequestModel = {
    salesOrder: SalesOrder;
    billingAddress: Address;
    shippingAddress: Address;
    paymentInfo: PaymentInfo;
    salesOrdersProductQuantityMaps: SalesOrdersProductQuantityMap[];
    packagingEstimateResponseModels: PackagingEstimateResponseModel[];
    selectedCouriers: SelectedCourier[];
}

export type PackagingEstimateResponseModel = {
    pickupLocationResponseModel: PickupLocationResponseModel;
    _package: Package;
    products: Product[];
    productIds: number[];
    serialNo: number;
}

// the variables below these are intentionally kept with underscore naming conventions because it is difficult to serialize/deserialize them ith different variable names
// MODELS FOR SHIPPING OPTIONS
export type ShippingOptionsResponseModel = {
    pickupLocationResponseModel: PickupLocationResponseModel;
    company_auto_shipment_insurance_setting: boolean
    covid_zones: CovidZones
    currency: string
    data: Data
    dg_courier: number
    eligible_for_insurance: number
    insurace_opted_at_order_creation: boolean
    is_allow_templatized_pricing: boolean
    is_latlong: number
    is_old_zone_opted: boolean
    is_zone_from_mongo: boolean
    label_generate_type: number
    on_new_zone: number
    seller_address: any[]
    status: number
    user_insurance_manadatory: boolean
}

export type CovidZones = {
    delivery_zone: any
    pickup_zone: any
}

export type Data = {
    available_courier_companies: AvailableCourierCompany[]
    child_courier_id: any
    is_recommendation_enabled: number
    recommendation_advance_rule: number
    recommended_by: RecommendedBy
    recommended_courier_company_id: number
    shiprocket_recommended_courier_id: number
}

export type AvailableCourierCompany = {
    air_max_weight: string
    assured_amount: number
    base_courier_id: any
    base_weight: string
    blocked: number
    call_before_delivery: string
    charge_weight: number
    city: string
    cod: number
    cod_charges: number
    cod_multiplier: number
    cost: string
    courier_company_id: string
    courier_name: string
    courier_type: string
    coverage_charges: number
    cutoff_time: string
    delivery_boy_contact: string
    delivery_performance: number
    description: string
    edd: string
    entry_tax: number
    estimated_delivery_days: string
    etd: string
    etd_hours: number
    freight_charge: number
    id: number
    is_custom_rate: number
    is_hyperlocal: boolean
    is_international: number
    is_rto_address_available: boolean
    is_surface: boolean
    local_region: number
    metro: number
    min_weight: number
    mode: number
    odablock: boolean
    other_charges: number
    others: string
    pickup_availability: string
    pickup_performance: number
    pickup_priority: string
    pickup_supress_hours: number
    pod_available: string
    postcode: string
    qc_courier: number
    rank: string
    rate: number
    rating: number
    realtime_tracking: string
    region: number
    rto_charges: number
    rto_performance: number
    seconds_left_for_pickup: number
    secure_shipment_disabled: boolean
    ship_type: number
    state: string
    suppress_date: string
    suppress_text: string
    suppression_dates?: SuppressionDates
    surface_max_weight: string
    tracking_performance: number
    volumetric_max_weight?: number
    weight_cases: number
    zone: string
}

export type SuppressionDates = {
    action_on: string
    delay_remark: string
    delivery_delay_by: number
    delivery_delay_days: string
    delivery_delay_from: string
    delivery_delay_to: string
    pickup_delay_by: number
    pickup_delay_days: string
    pickup_delay_from: string
    pickup_delay_to: string
}

export type RecommendedBy = {
    id: number;
    title: string;
}

// MODELS FOR SALESORDER-PACKAGE-SHIPROCKET MAPPING