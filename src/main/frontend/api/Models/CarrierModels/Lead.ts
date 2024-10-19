import {Address} from "Frontend/api/Models/CarrierModels/Address";
import {User} from "Frontend/api/Models/CentralModels/User";

export type Lead = {
    leadId?: number;
    annualRevenue?: string;
    company: string;
    companySize?: number;
    email: string;
    firstName: string;
    fax?: string;
    lastName: string;
    leadStatus: string;
    phone: string;
    title?: string;
    website?: string;
    deleted?: boolean;
    addressId?: number;
    createdById?: number;
    assignedAgentId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
};

export type LeadResponseModel = {
    lead: Lead;
    address: Address;
    createdBy: User;
    assignedAgent: User;
};

export type LeadRequestModel = {
    lead: Lead;
    address: Address;
}