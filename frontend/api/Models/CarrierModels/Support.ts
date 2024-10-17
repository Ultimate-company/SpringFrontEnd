import { JSONDocNode } from "@atlaskit/editor-json-transformer/dist/types/types";
import {User} from "Frontend/api/Models/CentralModels/User";

export type SupportRequestModel = {
    jsonContent: string;
    imagesBase64: Object;
    jsonDocNode: JSONDocNode;
}

export type GetTicketsResponseModel = {
    expand?: string;
    startAt?: number;
    maxResults?: number;
    total?: number;
    issues?: Issue[];
};

export type GetTicketDetailsResponseModel = {
    expand?: string;
    id?: string;
    self?: string;
    key?: string;
    fields?: Fields
    renderedFields?: RenderedFields;
    supportComments?: SupportComments[];
    userIdFullNameMapping?: Map<number, string>;
}

export type GetCommentsResponseModel = {
    startAt?: number;
    maxResults?: number;
    total?: number;
    comments?: Comment[]
}

export type CreateTicketResponseModel = {
    id?: string;
    key?: string;
    self?: string;
}

export type CreateAttachmentResponseModel = {
    self?: string;
    id?: string;
    filename?: string;
    author?: Author;
    created?: Date;
    size?: number;
    mimeType?: string;
    content?: string;
    thumbnail?: string;
};

export type AddCommentResponseModel = {
    self?: string;
    id?: string;
    author?: Author[];
    body?: Body[];
    updateAuthor?: UpdateAuthor[];
    created?: Date;
    updated?: Date;
    visibility?: Visibility[];
};

export type SupportComments = {
    commentId?: string;
    ticketId?: string;
    userId?: number;
    rawCommentADF?: string;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
}

// jira fields do not modify these
export type Votes = {
    self?: string;
    votes?: number;
    hasVoted?: boolean;
};

export type Watches = {
    self?: string;
    watchCount?: number;
    isWatching?: boolean;
};

export type Worklog = {
    startAt?: number;
    maxResults?: number;
    total?: number;
    worklogs?: any[];
    self?: string;
    author?: Author;
    updateAuthor?: UpdateAuthor;
    comment?: Comment;
    updated?: Date;
    visibility?: Visibility;
    started?: Date;
    timeSpent?: string;
    timeSpentSeconds?: number;
    id?: string;
    issueId?: string;
};

export type Status = {
    self?: string;
    description?: string;
    iconUrl?: string;
    name?: string;
    id?: string;
    statusCategory?: StatusCategory;
};

export type StatusCategory = {
    self?: string;
    id?: number;
    key?: string;
    colorName?: string;
    name?: string;
};

export type NonEditableReason = {
    reason?: string;
    message?: string;
};

export type Priority = {
    self?: string;
    iconUrl?: string;
    name?: string;
    id?: string;
};

export type Issuetype = {
    self?: string;
    id?: string;
    description?: string;
    iconUrl?: string;
    name?: string;
    subtask?: boolean;
    avatarId?: number;
    hierarchyLevel?: number;
};

export type Mark = {
    type?: string;
};

export type Issuerestriction = {
    issuerestrictions?: Issuerestrictions;
    shouldDisplay?: boolean;
};

export type Issuerestrictions = {};

export type Reporter = {
    self?: string;
    accountId?: string;
    emailAddress?: string;
    avatarUrls?: AvatarUrls;
    displayName?: string;
    active?: boolean;
    timeZone?: string;
    accountType?: string;
};

export type Customfield10018 = {
    hasEpicLinkFieldDependency?: boolean;
    showField?: boolean;
    nonEditableReason?: NonEditableReason;
};

export type Creator = {
    self?: string;
    accountId?: string;
    emailAddress?: string;
    avatarUrls?: AvatarUrls;
    displayName?: string;
    active?: boolean;
    timeZone?: string;
    accountType?: string;
};

export type Aggregateprogress = {
    progress?: number;
    total?: number;
};

export type Attrs = {
    id?: string;
    type?: string;
    collection?: string;
    width?: number;
    height?: number;
    url?: string;
    layout?: string;
};

export type AvatarUrls = {
    _48x48?: string;
    _24x24?: string;
    _16x16?: string;
    _32x32?: string;
};

export type Attachment = {
    self?: string;
    id?: string;
    filename?: string;
    author?: Author;
    created?: Date;
    size?: number;
    mimeType?: string;
    content?: string;
    thumbnail?: string;
};

export type Author = {
    self?: string;
    key?: string;
    accountId?: string;
    accountType?: string;
    name?: string;
    avatarUrls?: AvatarUrls;
    displayName?: string;
    active?: boolean;
    emailAddress?: string;
    timeZone?: string;
};

export type Body = {
    type?: string;
    version?: number;
    content?: Content[];
};

export type Comment = {
    self?: string;
    id?: string;
    author?: Author;
    body?: Body;
    updateAuthor?: UpdateAuthor;
    created?: Date;
    updated?: Date;
    visibility?: Visibility;
    type?: string;
    version?: number;
    content?: Content[];
    renderedBody?: string;
    jsdPublic?: boolean;
    comments?: Comment[];
    maxResults?: number;
    total?: number;
    startAt?: number;
};

export type Content = {
    type?: string;
    content?: Content[];
    text?: string;
    attrs?: Attrs;
    marks?: Mark[];
};

export type Description = {
    type?: string;
    version?: number;
    content?: Content[];
};

export type Fields = {
    statuscategorychangedate?: Date;
    fixVersions?: Array<any>;
    resolution?: any;
    lastViewed?: any;
    customfield_10062?: any;
    customfield_10063?: any;
    priority?: Priority;
    labels?: Array<any>;
    timeestimate?: any;
    aggregatetimeoriginalestimate?: any;
    versions?: Array<any>;
    issuelinks?: Array<any>;
    assignee?: any;
    status?: Status;
    components?: Array<any>;
    customfield_10050?: any;
    customfield_10051?: any;
    customfield_10052?: any;
    customfield_10053?: any;
    customfield_10054?: any;
    customfield_10055?: any;
    customfield_10056?: any;
    customfield_10057?: any;
    customfield_10058?: any;
    customfield_10049?: any;
    aggregatetimeestimate?: any;
    creator?: Creator;
    subtasks?: Array<any>;
    customfield_10040?: any;
    customfield_10041?: any;
    customfield_10042?: any;
    customfield_10043?: Array<any>;
    reporter?: Reporter;
    customfield_10044?: any;
    aggregateprogress?: Aggregateprogress;
    customfield_10045?: any;
    customfield_10046?: any;
    customfield_10047?: any;
    customfield_10048?: any;
    customfield_10038?: any;
    customfield_10039?: any;
    progress?: Progress;
    votes?: Votes;
    worklog?: Worklog;
    issuetype?: Issuetype;
    timespent?: any;
    customfield_10030?: any;
    customfield_10031?: any;
    project?: Project;
    customfield_10032?: any;
    customfield_10033?: any;
    aggregatetimespent?: any;
    customfield_10034?: Array<any>;
    customfield_10035?: any;
    customfield_10036?: any;
    customfield_10037?: any;
    customfield_10027?: any;
    customfield_10028?: any;
    customfield_10029?: any;
    resolutiondate?: any;
    workratio?: number;
    issuerestriction?: Issuerestriction;
    watches?: Watches;
    created?: Date;
    customfield_10020?: any;
    customfield_10021?: any;
    customfield_10022?: any;
    customfield_10023?: any;
    customfield_10024?: any;
    customfield_10025?: any;
    customfield_10026?: any;
    customfield_10016?: any;
    customfield_10017?: any;
    customfield_10018?: Customfield10018;
    customfield_10019?: string;
    updated?: Date;
    timeoriginalestimate?: any;
    description?: Description;
    customfield_10010?: any;
    customfield_10014?: any;
    timetracking?: Timetracking;
    customfield_10015?: any;
    customfield_10005?: any;
    customfield_10006?: any;
    security?: any;
    customfield_10007?: any;
    customfield_10008?: any;
    attachment?: Array<Attachment>;
    customfield_10009?: any;
    summary?: string;
    customfield_10001?: any;
    customfield_10002?: Array<any>;
    customfield_10003?: any;
    customfield_10004?: any;
    environment?: any;
    duedate?: any;
    comment?: Comment;
};

export type Issue = {
    expand?: string;
    id?: string;
    self?: string;
    key?: string;
    renderedFields?: RenderedFields;
    fields?: Fields;
};

export type Project = {
    self?: string;
    id?: string;
    key?: string;
    name?: string;
    avatarUrls?: AvatarUrls;
    projectCategory?: ProjectCategory;
    projectTypeKey?: string;
    simplified?: boolean;
};

export type ProjectCategory = {
    self?: string;
    id?: string;
    name?: string;
    description?: string;
};

export type Progress = {
    progress?: number;
    total?: number;
};

export type RenderedFields = {
    statuscategorychangedate?: string;
    issuetype?: any;
    timespent?: any;
    customfield10030?: any;
    project?: any;
    customfield10031?: any;
    customfield10032?: any;
    fixVersions?: any;
    aggregatetimespent?: any;
    customfield10034?: any;
    customfield10035?: any;
    resolution?: any;
    customfield10036?: any;
    customfield10037?: any;
    customfield10029?: any;
    resolutiondate?: any;
    workratio?: any;
    lastViewed?: string;
    watches?: any;
    created?: string;
    customfield10020?: any;
    customfield10021?: any;
    customfield10022?: any;
    priority?: any;
    customfield10023?: any;
    customfield10024?: any;
    customfield10025?: any;
    labels?: any;
    customfield10016?: any;
    customfield10017?: string;
    customfield10018?: any;
    customfield10019?: any;
    aggregatetimeoriginalestimate?: any;
    timeestimate?: any;
    versions?: any;
    issuelinks?: any;
    assignee?: any;
    updated?: string;
    status?: any;
    components?: any;
    timeoriginalestimate?: any;
    description?: any;
    customfield10010?: any;
    customfield10014?: any;
    customfield10015?: any;
    customfield10005?: any;
    customfield10006?: any;
    customfield10007?: any;
    security?: any;
    customfield10008?: any;
    aggregatetimeestimate?: any;
    customfield10009?: any;
    summary?: string;
    creator?: any;
    subtasks?: any;
    reporter?: any;
    customfield10000?: any;
    aggregateprogress?: any;
    customfield10001?: any;
    customfield10002?: any;
    customfield10003?: any;
    customfield10004?: any;
    customfield10038?: any;
    environment?: any;
    duedate?: any;
    progress?: any;
    votes?: any;
};

export type SubTask = {
    id?: string;
    key?: string;
    fields?: Fields;
};

export type Timetracking = {
    originalEstimate?: string;
    remainingEstimate?: string;
    timeSpent?: string;
    originalEstimateSeconds?: number;
    remainingEstimateSeconds?: number;
    timeSpentSeconds?: number;
};

export type UpdateAuthor = {
    self?: string;
    key?: string;
    accountId?: string;
    accountType?: string;
    name?: string;
    avatarUrls?: AvatarUrls;
    displayName?: string;
    active?: boolean;
    emailAddress?: string;
    timeZone?: string;
};

export type Visibility = {
    type?: string;
    value?: string;
};

export type Watcher = {
    self?: string;
    isWatching?: boolean;
    watchCount?: number;
    watchers?: Watcher[];
};