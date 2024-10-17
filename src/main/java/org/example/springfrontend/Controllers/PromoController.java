package org.example.springfrontend.Controllers;

import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.Promo;
import org.example.Models.RequestModels.ApiRequestModels.LeadRequestModel;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.LeadResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.PROMO)
public class PromoController extends BaseController {
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("Promo_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("Promo_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("Promo_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.PromosSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.PromosSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @PostMapping(ApiRoutes.PromosSubRoute.GET_PROMOS_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<Promo>>> getPromosInBatches(@RequestBody PaginationBaseRequestModel paginationBaseRequestModel) {
        paginationBaseRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<Promo>> getPromosInBatchesResponse = apiTranslator().getPromoSubTranslator().getPromosInBatches(paginationBaseRequestModel);
        if (!getPromosInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPromosInBatchesResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getPromosInBatchesResponse.getItem()));
    }

    @PostMapping(ApiRoutes.PromosSubRoute.TOGGLE_PROMO)
    public ResponseEntity<JsonResponse<Boolean>> togglePromo(@RequestParam long promoId) {
        Response<Boolean> togglePromoResponse = apiTranslator().getPromoSubTranslator().togglePromo(promoId);
        if (!togglePromoResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, togglePromoResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, togglePromoResponse.getItem()));
    }

    @PutMapping(ApiRoutes.PromosSubRoute.CREATE_PROMO)
    public ResponseEntity<JsonResponse<Long>> createPromo(@RequestBody Promo promo){
        Response<Long> createPromoResponse = apiTranslator().getPromoSubTranslator().createPromo(promo);
        if (!createPromoResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createPromoResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Promo.PROMOS_INDEX, createPromoResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.PromosSubRoute.GET_PROMO_DETAILS_BY_ID)
    public ResponseEntity<JsonResponse<Promo>> getPromoDetailsById(@RequestParam long promoId) {
        Response<Promo> getPromoDetailsByIdResponse = apiTranslator().getPromoSubTranslator().getPromoDetailsById(promoId);
        if (!getPromoDetailsByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPromoDetailsByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getPromoDetailsByIdResponse.getItem()));
    }

    @GetMapping(ApiRoutes.PromosSubRoute.GET_PROMO_DETAILS_BY_NAME)
    public ResponseEntity<JsonResponse<Promo>> getPromoDetailsByName(@RequestParam String promoCode) {
        Response<Promo> getPromoDetailsByNameResponse = apiTranslator().getPromoSubTranslator().getPromoDetailsByName(promoCode);
        if (!getPromoDetailsByNameResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPromoDetailsByNameResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getPromoDetailsByNameResponse.getItem()));
    }
}
