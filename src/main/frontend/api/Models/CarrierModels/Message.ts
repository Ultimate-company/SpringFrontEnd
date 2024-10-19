import {User} from "Frontend/api/Models/CentralModels/User";

export type Message = {
    messageId?: number;
    title: string;
    publishDate: Date;
    description?: string;
    descriptionMarkDown?: string;
    descriptionHtml: string;
    sendAsEmail: boolean;
    deleted?: boolean;
    updated?: boolean;
    sendgridEmailBatchId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
}

export type MessageResponseModel = {
    message: Message;
    user: User;
    read: boolean;
    totalUsers: number;
    totalUserGroups: number;
    userGroupIds: number[];
    userIds: number[];
}

export type MessageRequestModel = {
    message: Message;
    userGroupIds: number[];
    userIds: number[];
}