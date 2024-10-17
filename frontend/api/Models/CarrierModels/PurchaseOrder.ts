import {Address} from "Frontend/api/Models/CarrierModels/Address";
import {Lead} from "Frontend/api/Models/CarrierModels/Lead";
import {User} from "Frontend/api/Models/CentralModels/User";

export type PurchaseOrder = {
    purchaseOrderId?: number;
    expectedShipmentDate: Date;
    vendorNumber?: string;
    deleted?: boolean;
    termsConditionsHtml?: string;
    termsConditionsMarkdown?: string;
    orderReceipt?: string;
    approved?: boolean;
    salesOrderId?: number;
    approvedByUserId?: number;
    assignedLeadId?: number;
    createdByUserId?: number;
    purchaseOrderAddressId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
}

export type PurchaseOrderResponseModel = {
    purchaseOrder: PurchaseOrder;
    address: Address;
    lead: Lead;
    createdByUser: User;
    approvedByUser: User;
    productIdQuantityMapping: Map<number, number>;
    productIdPriceMapping: Map<number, number>;
    productIdDiscountMapping: Map<number, number>;
}

export type PurchaseOrderRequestModel = {
    purchaseOrder: PurchaseOrder;
    address: Address;
    productIdQuantityMapping: Map<number, number> | Object;
}