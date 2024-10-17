package org.example.springfrontend.Controllers;

import org.apache.commons.lang3.tuple.Pair;
import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.ImageHelper;
import org.example.CommonHelpers.JsonResponse;
import org.example.CommonHelpers.ProductHelper;
import org.example.Models.CommunicationModels.CarrierModels.ProductReview;
import org.example.Models.CommunicationModels.CentralModels.ProductCategory;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.ProductReviewResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.ProductsResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.example.Models.ResponseModels.ApiResponseModels.GetProductCategoryResponseModel;
import org.example.Models.RequestModels.ApiRequestModels.ProductRequestModel;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.PRODUCT)
public class ProductController extends BaseController {
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("Product_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("Product_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("Product_IncludeDeleted", value);
    }

    private String getProductCategory() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("Product_Category") != null) {
            return (String) httpSession.getAttribute("Product_Category");
        }
        return "root";
    }
    private void setProductCategorySession(String value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("Product_Category", value.trim());
    }

    private static final String productImageParentDirectory = "src/main/resources/";
    private static final String staticParentDirectory = "src/main/resources/static";
    private static final String keysParentDirectory = "src/main/resources/Keys";

    // Endpoints
    @PostMapping(ApiRoutes.ProductsSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.ProductsSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @PostMapping(ApiRoutes.ProductsSubRoute.GET_PRODUCTS_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<ProductsResponseModel>>> getProductsInBatches(@RequestBody PaginationBaseRequestModel paginationBaseRequestModel) {
        paginationBaseRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<ProductsResponseModel>> getProductsInBatchesResponse = apiTranslator().getProductSubTranslator().getProductInBatches(paginationBaseRequestModel);
        if (!getProductsInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getProductsInBatchesResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getProductsInBatchesResponse.getItem()));
    }

    @PostMapping(ApiRoutes.ProductsSubRoute.TOGGLE_RETURN_PRODUCT)
    public ResponseEntity<JsonResponse<Boolean>> toggleReturnProduct(@RequestParam long productId) {
        Response<Boolean> toggleReturnProductResponse = apiTranslator().getProductSubTranslator().toggleReturnProduct(productId);
        if (!toggleReturnProductResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, toggleReturnProductResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, toggleReturnProductResponse.getItem()));
    }

    @PostMapping(ApiRoutes.ProductsSubRoute.TOGGLE_DELETE_PRODUCT)
    public ResponseEntity<JsonResponse<Boolean>> toggleDeleteProduct(@RequestParam long productId) {
        Response<Boolean> toggleDeleteProductResponse = apiTranslator().getProductSubTranslator().toggleDeleteProduct(productId);
        if (!toggleDeleteProductResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, toggleDeleteProductResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, toggleDeleteProductResponse.getItem()));
    }

    @GetMapping(ApiRoutes.ProductsSubRoute.GET_PRODUCT_DETAILS_BY_IDS)
    public ResponseEntity<JsonResponse<List<ProductsResponseModel>>> getProductDetailsByIds(@RequestParam List<Long> productIds) throws IOException {
        Response<List<ProductsResponseModel>> getProductDetailsByIdsResponse = apiTranslator().getProductSubTranslator().getProductDetailsByIds(productIds);
        if (!getProductDetailsByIdsResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getProductDetailsByIdsResponse.getMessage(), null));
        }

        for(ProductsResponseModel productsResponseModel : getProductDetailsByIdsResponse.getItem()) {
            Map<String, String> imageBase64Mapping = new HashMap<>();

            imageBase64Mapping.put("Main", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getMainImage()));
            imageBase64Mapping.put("Top", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getTopImage()));
            imageBase64Mapping.put("Bottom", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getBottomImage()));
            imageBase64Mapping.put("Front", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getFrontImage()));
            imageBase64Mapping.put("Back", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getBackImage()));
            imageBase64Mapping.put("Right", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getRightImage()));
            imageBase64Mapping.put("Left", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getLeftImage()));
            imageBase64Mapping.put("Detail", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getDetailsImage()));
            imageBase64Mapping.put("Defect", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getDefectImage()));
            imageBase64Mapping.put("Additional_1", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getAdditionalImage1()));
            imageBase64Mapping.put("Additional_2", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getAdditionalImage2()));
            imageBase64Mapping.put("Additional_3", ImageHelper.getBase64FromImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", productsResponseModel.getProduct().getAdditionalImage3()));

            productsResponseModel.setImageBase64Mapping(imageBase64Mapping);
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getProductDetailsByIdsResponse.getItem()));
    }

    @PutMapping(ApiRoutes.ProductsSubRoute.SET_PRODUCT_CATEGORY)
    public ResponseEntity<JsonResponse<Boolean>> setProductCategory(@RequestBody String productCategory) {
        if(!StringUtils.hasText(productCategory)) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, "Product Category cannot be null or empty", false));
        }
        setProductCategorySession(productCategory.replace("\"", ""));
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, true));
    }

    @GetMapping(ApiRoutes.ProductsSubRoute.GET_PRODUCT_CATEGORIES)
    public ResponseEntity<JsonResponse<GetProductCategoryResponseModel>> getProductCategories() {
        List<ProductHelper.ProductCategory> productCategories = ProductHelper.getProducts(getProductCategory());
        List<String> allParents = ProductHelper.getAllParents(getProductCategory());

        if(productCategories.isEmpty()) {
            // get the parent of the product
            productCategories = ProductHelper.getProducts(ProductHelper.getParentForCategory(getProductCategory()));
        }

        GetProductCategoryResponseModel getProductCategoryResponseModel = new GetProductCategoryResponseModel();
        getProductCategoryResponseModel.setAllParents(allParents);
        getProductCategoryResponseModel.setProductCategories(productCategories);
        getProductCategoryResponseModel.setSelectedText(getProductCategory());
        getProductCategoryResponseModel.setEnd(ProductHelper.isProductEnd(getProductCategory()));

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success,
                null,
                getProductCategoryResponseModel));
    }

    @GetMapping(ApiRoutes.ProductsSubRoute.GET_COLORS)
    public ResponseEntity<JsonResponse<List<Map<String, String>>>> getColors(){
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, ProductHelper.getColors()));
    }

    @PostMapping(ApiRoutes.ProductsSubRoute.EDIT_PRODUCT)
    ResponseEntity<JsonResponse<Long>> editProduct(@RequestBody ProductRequestModel productRequestModel) throws IOException {
        Response<ProductCategory> getCategoryByNameResponse = apiTranslator().getProductCategorySubTranslator().getCategoryByName(productRequestModel.getProduct().getCategory());
        if(!getCategoryByNameResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getCategoryByNameResponse.getMessage(), null));
        }

        // get the old product values
        Response<ProductsResponseModel> getProductDetailsByIdResponse = apiTranslator().getProductSubTranslator().getProductDetailsById(productRequestModel.getProduct().getProductId());
        if(!getProductDetailsByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Warning, "The product was successfully edit but there was an error deleting the old images from the server.", null));
        }

        // set the product category
        productRequestModel.getProduct().setCategoryId(getCategoryByNameResponse.getItem().getCategoryId());

        // Save the images in the server
        productRequestModel.getProduct().setMainImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Main"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setTopImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Top"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setBottomImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Bottom"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setFrontImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Front"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setBackImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Back"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setRightImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Right"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setLeftImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Left"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setDetailsImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Detail"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setDefectImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Defect"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setAdditionalImage1(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Additional_1"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setAdditionalImage2(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Additional_2"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setAdditionalImage3(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Additional_3"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));

        // Save the images in Firebase
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Main"), productRequestModel.getProduct().getMainImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Top"), productRequestModel.getProduct().getTopImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Bottom"), productRequestModel.getProduct().getBottomImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Front"), productRequestModel.getProduct().getFrontImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Back"), productRequestModel.getProduct().getBackImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Right"), productRequestModel.getProduct().getRightImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Left"), productRequestModel.getProduct().getLeftImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Detail"), productRequestModel.getProduct().getDetailsImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Defect"), productRequestModel.getProduct().getDefectImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Additional_1"), productRequestModel.getProduct().getAdditionalImage1(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Additional_2"), productRequestModel.getProduct().getAdditionalImage2(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Additional_3"), productRequestModel.getProduct().getAdditionalImage3(), getCurrentCarrier().getCarrierId());

        Response<Long> editProductResponse = apiTranslator().getProductSubTranslator().editProduct(productRequestModel.getProduct());
        if(!editProductResponse.isSuccess()) {
            // delete all the images
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getMainImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getTopImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getBottomImage());
            ImageHelper.deleteImage(productImageParentDirectory+ getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getFrontImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getBackImage());
            ImageHelper.deleteImage(productImageParentDirectory+ getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getRightImage());
            ImageHelper.deleteImage(productImageParentDirectory+ getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getLeftImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getDetailsImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getDefectImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getAdditionalImage1());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getAdditionalImage2());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getAdditionalImage3());

            // delete images from firebase
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getMainImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getTopImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getBottomImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getFrontImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getBackImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getRightImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getLeftImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getDetailsImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getDefectImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getAdditionalImage1(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getAdditionalImage2(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getAdditionalImage3(), getCurrentCarrier().getCarrierId());

            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, editProductResponse.getMessage(), null));
        }
        else {
            // delete all the old images
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getMainImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getTopImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getBottomImage());
            ImageHelper.deleteImage(productImageParentDirectory+ getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getFrontImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getBackImage());
            ImageHelper.deleteImage(productImageParentDirectory+ getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getRightImage());
            ImageHelper.deleteImage(productImageParentDirectory+ getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getLeftImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getDetailsImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getDefectImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getAdditionalImage1());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getAdditionalImage2());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    getProductDetailsByIdResponse.getItem().getProduct().getAdditionalImage3());

            // delete images from firebase
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getMainImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getTopImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getBottomImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getFrontImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getBackImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getRightImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getLeftImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getDetailsImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getDefectImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getAdditionalImage1(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getAdditionalImage2(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, getProductDetailsByIdResponse.getItem().getProduct().getAdditionalImage3(), getCurrentCarrier().getCarrierId());
        }

        // reset the product category
        setProductCategory("root");
        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Product.PRODUCTS_INDEX, editProductResponse.getMessage()));
    }

    @PutMapping(ApiRoutes.ProductsSubRoute.ADD_PRODUCT)
    public ResponseEntity<JsonResponse<Long>> addProduct(@RequestBody ProductRequestModel productRequestModel) throws IOException {
        Response<ProductCategory> getCategoryByNameResponse = apiTranslator().getProductCategorySubTranslator().getCategoryByName(productRequestModel.getProduct().getCategory());
        if(!getCategoryByNameResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getCategoryByNameResponse.getMessage(), null));
        }

        // set the product category
        productRequestModel.getProduct().setCategoryId(getCategoryByNameResponse.getItem().getCategoryId());

        // Save the images in the server
        productRequestModel.getProduct().setMainImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Main"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setTopImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Top"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setBottomImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Bottom"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setFrontImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Front"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setBackImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Back"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setRightImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Right"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setLeftImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Left"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setDetailsImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Detail"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setDefectImage(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Defect"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setAdditionalImage1(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Additional_1"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setAdditionalImage2(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Additional_2"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));
        productRequestModel.getProduct().setAdditionalImage3(ImageHelper.saveBase64ToFile(productRequestModel.getImages().get("Additional_3"), productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products"));

        // Save the images in Firebase
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Main"), productRequestModel.getProduct().getMainImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Top"), productRequestModel.getProduct().getTopImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Bottom"), productRequestModel.getProduct().getBottomImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Front"), productRequestModel.getProduct().getFrontImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Back"), productRequestModel.getProduct().getBackImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Right"), productRequestModel.getProduct().getRightImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Left"), productRequestModel.getProduct().getLeftImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Detail"), productRequestModel.getProduct().getDetailsImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Defect"), productRequestModel.getProduct().getDefectImage(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Additional_1"), productRequestModel.getProduct().getAdditionalImage1(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Additional_2"), productRequestModel.getProduct().getAdditionalImage2(), getCurrentCarrier().getCarrierId());
        ImageHelper.saveBase64ToFirebase(keysParentDirectory, productRequestModel.getImages().get("Additional_3"), productRequestModel.getProduct().getAdditionalImage3(), getCurrentCarrier().getCarrierId());

        Response<Long> addProductResponse = apiTranslator().getProductSubTranslator().addProduct(productRequestModel.getProduct());
        if (!addProductResponse.isSuccess()) {
            // delete all the images
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getMainImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getTopImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getBottomImage());
            ImageHelper.deleteImage(productImageParentDirectory+ getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getFrontImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getBackImage());
            ImageHelper.deleteImage(productImageParentDirectory+ getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getRightImage());
            ImageHelper.deleteImage(productImageParentDirectory+ getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getLeftImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getDetailsImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getDefectImage());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getAdditionalImage1());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getAdditionalImage2());
            ImageHelper.deleteImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products",
                    productRequestModel.getProduct().getAdditionalImage3());

            // delete images from firebase
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getMainImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getTopImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getBottomImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getFrontImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getBackImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getRightImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getLeftImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getDetailsImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getDefectImage(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getAdditionalImage1(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getAdditionalImage2(), getCurrentCarrier().getCarrierId());
            ImageHelper.deleteFileFromFirebase(keysParentDirectory, productRequestModel.getProduct().getAdditionalImage3(), getCurrentCarrier().getCarrierId());

            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, addProductResponse.getMessage(), null));
        }

        // reset the product category
        setProductCategory("root");
        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Product.PRODUCTS_INDEX, addProductResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.ProductsSubRoute.GET_PRODUCT_IMAGE)
    public ResponseEntity<byte[]> getProductImage(@RequestParam String imageName) throws IOException {
        Pair<String, byte[]> getImageResponse = ImageHelper.getImage(productImageParentDirectory + getCurrentCarrier().getDatabaseName() + "/Products", imageName);
        if(getImageResponse != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(getImageResponse.getKey()));
            return new ResponseEntity<>(getImageResponse.getValue(), headers, HttpStatus.OK);
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

    @GetMapping(ApiRoutes.ProductsSubRoute.GET_STATIC_IMAGE)
    public ResponseEntity<byte[]> getStaticImage(@RequestParam String imageName) throws IOException {
        Pair<String, byte[]> getImageResponse = ImageHelper.getImage(staticParentDirectory, imageName);
        if(getImageResponse != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(getImageResponse.getKey()));
            return new ResponseEntity<>(getImageResponse.getValue(), headers, HttpStatus.OK);
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

    @PostMapping(ApiRoutes.ProductReviewSubRoute.GET_PRODUCT_REVIEWS_GIVEN_PRODUCT_ID)
    public ResponseEntity<JsonResponse<ProductReviewResponseModel>> getProductReviewsGivenProductId(@RequestBody PaginationBaseRequestModel paginationBaseRequestModel,
                                                                                             @RequestParam long productId) {
        Response<ProductReviewResponseModel> getProductReviewsGivenProductIdResponse = apiTranslator().getProductReviewSubTranslator().getProductReviewsGivenProductId(paginationBaseRequestModel, productId);
        if(!getProductReviewsGivenProductIdResponse.isSuccess()){
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getProductReviewsGivenProductIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, "", getProductReviewsGivenProductIdResponse.getItem()));
    }

    @PutMapping(ApiRoutes.ProductReviewSubRoute.INSERT_PRODUCT_REVIEW)
    public ResponseEntity<JsonResponse<Long>> insertProductReview(@RequestBody ProductReview productReview) {
        Response<Long> insertProductReviewResponse = apiTranslator().getProductReviewSubTranslator().insertProductReview(productReview);
        if(!insertProductReviewResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, insertProductReviewResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, insertProductReviewResponse.getMessage(), insertProductReviewResponse.getItem()));
    }

    @PostMapping(ApiRoutes.ProductReviewSubRoute.TOGGLE_PRODUCT_REVIEW_SCORE)
    public ResponseEntity<JsonResponse<Boolean>> toggleProductReviewScore(@RequestParam long reviewId, @RequestParam boolean increaseScore) {
        Response<Boolean> toggleProductReviewScoreResponse = apiTranslator().getProductReviewSubTranslator().toggleProductReviewScore(reviewId, increaseScore);
        if(!toggleProductReviewScoreResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, toggleProductReviewScoreResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, toggleProductReviewScoreResponse.getMessage(), toggleProductReviewScoreResponse.getItem()));
    }

    @DeleteMapping(ApiRoutes.ProductReviewSubRoute.TOGGLE_PRODUCT_REVIEW)
    public ResponseEntity<JsonResponse<Boolean>> toggleProductReview(@RequestParam long reviewId) {
        Response<Boolean> deleteReviewResponse = apiTranslator().getProductReviewSubTranslator().deleteReview(reviewId);
        if(!deleteReviewResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, deleteReviewResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, deleteReviewResponse.getMessage(), deleteReviewResponse.getItem()));
    }

    @GetMapping(ApiRoutes.ProductReviewSubRoute.GET_PRODUCT_REVIEW_BY_ID)
    public ResponseEntity<JsonResponse<ProductReviewResponseModel>> getProductReviewById(@RequestParam long reviewId) {
        Response<ProductReviewResponseModel> getProductReviewByIdResponse = apiTranslator().getProductReviewSubTranslator().getProductReviewById(reviewId);
        if(!getProductReviewByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getProductReviewByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success,"", getProductReviewByIdResponse.getItem()));
    }
}