package org.example.springfrontend.Controllers;

import jakarta.servlet.http.HttpSession;
import org.apache.commons.lang3.tuple.Pair;
import org.example.ApiRoutes;
import org.example.CommonHelpers.FirebaseHelper;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.ProductReview;
import org.example.Models.CommunicationModels.CentralModels.ProductCategory;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.*;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.example.Models.RequestModels.ApiRequestModels.ProductRequestModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Consumer;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.PRODUCT)
public class ProductController extends BaseController {
    @Autowired
    private Environment environment;

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

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getProductDetailsByIdsResponse.getItem()));
    }


    @GetMapping(ApiRoutes.ProductsSubRoute.GET_PRODUCT_CATEGORIES)
    public ResponseEntity<JsonResponse<List<ProductCategory>>> getProductCategories(@RequestParam String currentCategory) {
        if(Objects.equals(currentCategory, "root")) {
            Response<List<ProductCategory>> getRootCategoriesResponse = apiTranslator().getProductCategorySubTranslator().getRootCategories();
            if(!getRootCategoriesResponse.isSuccess()) {
                return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getRootCategoriesResponse.getMessage(), null));
            }

            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success,
                    null,
                    getRootCategoriesResponse.getItem()));
        }
        else {
            Response<ProductCategory> getCategoryByNameResponse = apiTranslator().getProductCategorySubTranslator().getCategoryByName(currentCategory);
            if (!getCategoryByNameResponse.isSuccess()) {
                return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getCategoryByNameResponse.getMessage(), null));
            }

            Response<List<ProductCategory>> getChildCategoriesGivenParentIdResponse = apiTranslator().getProductCategorySubTranslator().getChildCategoriesGivenParentId(getCategoryByNameResponse.getItem().getCategoryId());
            if (!getChildCategoriesGivenParentIdResponse.isSuccess()) {
                return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getChildCategoriesGivenParentIdResponse.getMessage(), null));
            }

            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success,
                    null,
                    getChildCategoriesGivenParentIdResponse.getItem()));
        }
    }

    @PostMapping(ApiRoutes.ProductsSubRoute.EDIT_PRODUCT)
    ResponseEntity<JsonResponse<Long>> editProduct(@RequestBody ProductRequestModel productRequestModel) {
        // set the product images
        Map<String, Consumer<String>> imageSetters = new HashMap<>();
        imageSetters.put("Main", productRequestModel.getProduct()::setMainImage);
        imageSetters.put("Top", productRequestModel.getProduct()::setTopImage);
        imageSetters.put("Bottom", productRequestModel.getProduct()::setBottomImage);
        imageSetters.put("Front", productRequestModel.getProduct()::setFrontImage);
        imageSetters.put("Back", productRequestModel.getProduct()::setBackImage);
        imageSetters.put("Right", productRequestModel.getProduct()::setRightImage);
        imageSetters.put("Left", productRequestModel.getProduct()::setLeftImage);
        imageSetters.put("Detail", productRequestModel.getProduct()::setDetailsImage);
        imageSetters.put("Defect", productRequestModel.getProduct()::setDefectImage);
        imageSetters.put("Additional_1", productRequestModel.getProduct()::setAdditionalImage1);
        imageSetters.put("Additional_2", productRequestModel.getProduct()::setAdditionalImage2);
        imageSetters.put("Additional_3", productRequestModel.getProduct()::setAdditionalImage3);

        for (String key : imageSetters.keySet()) {
            String image = productRequestModel.getImages().get(key);
            imageSetters.get(key).accept(image);
        }

        // save the product in db
        Response<Long> editProductResponse = apiTranslator().getProductSubTranslator().editProduct(productRequestModel.getProduct());
        if (!editProductResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, editProductResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Product.PRODUCTS_INDEX, editProductResponse.getMessage()));
    }

    @PutMapping(ApiRoutes.ProductsSubRoute.ADD_PRODUCT)
    public ResponseEntity<JsonResponse<Long>> addProduct(@RequestBody ProductRequestModel productRequestModel) {
        // set the product images
        Map<String, Consumer<String>> imageSetters = new HashMap<>();
        imageSetters.put("Main", productRequestModel.getProduct()::setMainImage);
        imageSetters.put("Top", productRequestModel.getProduct()::setTopImage);
        imageSetters.put("Bottom", productRequestModel.getProduct()::setBottomImage);
        imageSetters.put("Front", productRequestModel.getProduct()::setFrontImage);
        imageSetters.put("Back", productRequestModel.getProduct()::setBackImage);
        imageSetters.put("Right", productRequestModel.getProduct()::setRightImage);
        imageSetters.put("Left", productRequestModel.getProduct()::setLeftImage);
        imageSetters.put("Detail", productRequestModel.getProduct()::setDetailsImage);
        imageSetters.put("Defect", productRequestModel.getProduct()::setDefectImage);
        imageSetters.put("Additional_1", productRequestModel.getProduct()::setAdditionalImage1);
        imageSetters.put("Additional_2", productRequestModel.getProduct()::setAdditionalImage2);
        imageSetters.put("Additional_3", productRequestModel.getProduct()::setAdditionalImage3);

        for (String key : imageSetters.keySet()) {
            String image = productRequestModel.getImages().get(key);
            imageSetters.get(key).accept(image);
        }

        // save the product in db
        Response<Long> addProductResponse = apiTranslator().getProductSubTranslator().addProduct(productRequestModel.getProduct());
        if (!addProductResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, addProductResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Product.PRODUCTS_INDEX, addProductResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.ProductsSubRoute.GET_PRODUCT_IMAGE)
    public ResponseEntity<byte[]> getProductImage(@RequestParam String imageName, @RequestParam long productId) throws IOException {
        try {
            Response<GetCarrierResponseModel> getCarrierResponse = apiTranslator().getCarrierSubTranslator().getCarrierDetailsById(getCurrentCarrier().getCarrierId());
            if (!getCarrierResponse.isSuccess()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            String filePath = (environment.getActiveProfiles().length > 0 ? environment.getActiveProfiles()[0] : "default")
                    + "/"
                    + getCurrentCarrier().getDatabaseName()
                    + "/Products"
                    + "/" + productId + "-" + imageName + ".png";

            FirebaseHelper firebaseHelper = new FirebaseHelper(getCarrierResponse.getItem().getGoogleCred());
            byte[] imageBytes = firebaseHelper.downloadFileAsBytesFromFirebase(filePath);
            if (imageBytes == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);

            // Return the image bytes with headers and 200 OK status
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            // Handle the exception (log it, return a 404, etc.)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(ApiRoutes.ProductsSubRoute.GET_STATIC_IMAGE)
    public ResponseEntity<byte[]> getStaticImage(@RequestParam String imageName) throws IOException {
        String staticParentDirectory = "src/main/resources/static";
        Pair<String, byte[]> getImageResponse = getImage(staticParentDirectory, imageName);
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