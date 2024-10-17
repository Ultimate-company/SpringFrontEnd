export type UserGroup = {
    userGroupId?: number;
    name: string;
    description: string;
    deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
};

export type UserGroupResponseModel = {
    userGroup: UserGroup;
    userCount: number;
    userIds: number[];
};

export type UserGroupRequestModel = {
    userGroup: UserGroup;
    userIds: number[];
};

