package org.example.springfrontend.Controllers;

import com.itextpdf.text.DocumentException;
import freemarker.template.TemplateException;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.RequestModels.ApiRequestModels.PurchaseOrderRequestModel;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.PurchaseOrderResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.PURCHASE_ORDER)
public class PurchaseOrderController extends BaseController{
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("PurchaseOrder_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("PurchaseOrder_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("PurchaseOrder_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.PurchaseOrderSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.PurchaseOrderSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @PostMapping(ApiRoutes.PurchaseOrderSubRoute.GET_PURCHASE_ORDERS_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<PurchaseOrderResponseModel>>> getPurchaseOrdersInBatches(@RequestBody PaginationBaseRequestModel paginationBaseRequestModel) {
        paginationBaseRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<PurchaseOrderResponseModel>> getPurchaseOrderInBatchesResponse = apiTranslator().getPurchaseOrderSubTranslator().getPurchaseOrdersInBatches(paginationBaseRequestModel);
        if (!getPurchaseOrderInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPurchaseOrderInBatchesResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getPurchaseOrderInBatchesResponse.getItem()));
    }

    @DeleteMapping(ApiRoutes.PurchaseOrderSubRoute.TOGGLE_PURCHASE_ORDER)
    public ResponseEntity<JsonResponse<Boolean>> togglePurchaseOrder(@RequestParam long purchaseOrderId) {
        Response<Boolean> togglePurchaseOrderResponse = apiTranslator().getPurchaseOrderSubTranslator().togglePurchaseOrder(purchaseOrderId);
        if (!togglePurchaseOrderResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, togglePurchaseOrderResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, togglePurchaseOrderResponse.getItem()));
    }

    @GetMapping(ApiRoutes.PurchaseOrderSubRoute.GET_PURCHASE_ORDER_PDF)
    public ResponseEntity<byte[]> getPurchaseOrderPdf(@RequestParam long purchaseOrderId) throws TemplateException, DocumentException, IOException {
        Response<String> getPurchaseOrderPdfResponse = apiTranslator().getPurchaseOrderSubTranslator().getPurchaseOrderPDF(purchaseOrderId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "purchaseOrder.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return new ResponseEntity<>(Base64.getDecoder().decode(getPurchaseOrderPdfResponse.getItem()), headers, HttpStatus.OK);
    }

    @PutMapping(ApiRoutes.PurchaseOrderSubRoute.CREATE_PURCHASE_ORDER)
    public ResponseEntity<JsonResponse<Long>> createPurchaseOrder(@RequestBody PurchaseOrderRequestModel purchaseOrderRequestModel) {
        Response<Long> createPurchaseOrderResponse = apiTranslator().getPurchaseOrderSubTranslator().createPurchaseOrder(purchaseOrderRequestModel);
        if (!createPurchaseOrderResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createPurchaseOrderResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.PurchaseOrder.PURCHASE_ORDER_INDEX, createPurchaseOrderResponse.getMessage()));
    }

    @PostMapping(ApiRoutes.PurchaseOrderSubRoute.UPDATE_PURCHASE_ORDER)
    public ResponseEntity<JsonResponse<Long>> updatePurchaseOrder(@RequestBody PurchaseOrderRequestModel purchaseOrderRequestModel) {
        Response<Long> updatePurchaseOrderResponse = apiTranslator().getPurchaseOrderSubTranslator().updatePurchaseOrder(purchaseOrderRequestModel);
        if (!updatePurchaseOrderResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updatePurchaseOrderResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.PurchaseOrder.PURCHASE_ORDER_INDEX, updatePurchaseOrderResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.PurchaseOrderSubRoute.GET_PURCHASE_ORDER_BY_ID)
    public ResponseEntity<JsonResponse<PurchaseOrderResponseModel>> getPurchaseOrderById(@RequestParam long purchaseOrderId) {
        Response<PurchaseOrderResponseModel> getPurchaseOrderByIdResponse = apiTranslator().getPurchaseOrderSubTranslator().getPurchaseOrderDetailsById(purchaseOrderId);
        if(!getPurchaseOrderByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPurchaseOrderByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, getPurchaseOrderByIdResponse.getMessage(), getPurchaseOrderByIdResponse.getItem()));
    }

    @PostMapping(ApiRoutes.PurchaseOrderSubRoute.APPROVED_BY_PURCHASE_ORDER)
    public ResponseEntity<JsonResponse<Boolean>> approvedByPurchaseOrder(@RequestParam long purchaseOrderId) {
        Response<Boolean> approvedByPurchaseOrderResponse = apiTranslator().getPurchaseOrderSubTranslator().approvedByPurchaseOrder(purchaseOrderId);
        if(!approvedByPurchaseOrderResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, approvedByPurchaseOrderResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, approvedByPurchaseOrderResponse.getMessage(), approvedByPurchaseOrderResponse.getItem()));
    }
}