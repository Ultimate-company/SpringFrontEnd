import {PickupLocationResponseModel} from "Frontend/api/Models/CarrierModels/PickupLocation";
import { User } from "../CentralModels/User";

export enum ProductCondition {
    NEW_WITH_TAGS = 1,
    NEW_WITHOUT_TAGS = 2,
    NEW_WITH_DEFECTS = 3,
    PRE_OWNED = 4,
    PRE_OWNED_WITH_DEFECTS = 5
}

export type ProductReviewResponseModel = {
    productReviewMap: Map<number, ProductReview>;
    productReviewTree: Map<number, number[]>;
    totalRootComments: number;
    userIdFullNameMapping: Map<number, string>;
    productReview: ProductReview;
    user: User;
}

export type ProductReview = {
    reviewId: number;
    score: number;
    ratings: number;
    isDeleted: boolean;
    review: string;
    userId: number;
    productId: number;
    parentId?: number;
    createdAt: string;
    updatedAt: string;
    notes?: string;
    auditUserId?: number;
}

export type Product = {
    productId: number | undefined;
    title?: string;
    descriptionHtml?: string;
    length?: number;
    availableStock: number;
    brand?: string;
    model?: string;
    color?: string;
    colorLabel?: string;
    deleted?: boolean;
    condition?: number;
    countryOfManufacture?: string;
    itemModified: boolean;
    upc?: string;
    modificationHtml?: string;
    mainImage?: string;
    topImage?: string;
    bottomImage?: string;
    frontImage?: string;
    backImage?: string;
    rightImage?: string;
    leftImage?: string;
    detailsImage?: string;
    defectImage?: string;
    additionalImage1?: string;
    additionalImage2?: string;
    additionalImage3?: string;
    price: number;
    discount: number;
    discountPercent?: boolean;
    returnsAllowed: boolean;
    itemAvailableFrom?: Date;
    breadth?: number;
    height?: number;
    weightKgs: number;
    categoryId?: number;
    category: string;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
    pickupLocationId: number;
}

export type ProductCategory = {
    categoryId: number;
    id: number;
    end: boolean;
    isSelected: boolean;
    name: string;
    parentId?: number;
    createdAt: Date;
    updatedAt: Date;
    notes?: string;
    auditUserId?: number;
}

export type ProductsResponseModel = {
    product: Product;
    productCategory: ProductCategory;
    pickupLocationResponseModel: PickupLocationResponseModel;
    imageBase64Mapping: Map<string, string>;
}

export type GetProductCategoryResponseModel = {
    allParents: string[];
    productCategories: ProductCategory[];
    selectedText: string;
    end: boolean;
}
