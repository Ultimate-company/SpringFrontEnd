export type Carrier = {
    carrierId: number;
    name?: string;
    description?: string;
    databaseName?: string;
    sendgridApikey?: string;
    sendgridEmailAddress?: string;
    isDeleted?: boolean;
    image?: string;
    website?: string;
    sendgridSenderName?: string;
    razorpayApikey?: string;
    razorpayApiSecret?: string;
    shipRocketEmail?: string;
    shipRocketPassword?: string;
    jiraUserName?: string;
    jiraPassword?: string;
    jiraProjectUrl?: string;
    jiraProjectKey?: string;
    issueTypes?: string;
    notes?: string;
    createdAt?: Date;
    imageBase64?: string;
};