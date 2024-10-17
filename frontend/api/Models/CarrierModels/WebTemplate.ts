export type WebTemplate = {
    webTemplateId?: number;
    url?: string;
    deleted?: boolean;
    cardHeaderFontStyleId?: number;
    cardSubTextFontStyleId?: number;
    headerFontStyleId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
};

export type WebTemplatesFontStyle = {
    webTemplateFontStyleId?: number;
    fontStyle?: string;
    fontColor?: string;
    fontSize?: number;
    createdAt?: string;
    updatedAt?: string;
    notes?: string;
    auditUserId?: number;
};

export type WebTemplateResponseModel = {
    webTemplate: WebTemplate;
    cardHeaderFontStyle: WebTemplatesFontStyle;
    cardSubTextFontStyle: WebTemplatesFontStyle;
    headerFontStyle: WebTemplatesFontStyle;
}

export type WebTemplateRequestModel = {
    webTemplate?: WebTemplate;
    cardHeaderFontStyle?: WebTemplatesFontStyle;
    cardSubTextFontStyle?: WebTemplatesFontStyle;
    headerFontStyle?: WebTemplatesFontStyle;
    sortOptions?: string[];
    filterOptions?: string[];
    stateCityMapping?: any;
    acceptedPaymentOptions?: string[];
};
