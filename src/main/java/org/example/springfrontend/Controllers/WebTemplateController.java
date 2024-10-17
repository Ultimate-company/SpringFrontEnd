package org.example.springfrontend.Controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.RequestModels.ApiRequestModels.WebTemplateRequestModel;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.WebTemplateResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.WEB_TEMPLATE)
public class WebTemplateController extends BaseController {
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("WebTemplate_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("WebTemplate_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("WebTemplate_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.WebTemplateSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.WebTemplateSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @PostMapping(ApiRoutes.WebTemplateSubRoute.GET_WEB_TEMPLATES_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<WebTemplateResponseModel>>> getWebTemplatesInBatches(@RequestBody PaginationBaseRequestModel paginationBaseRequestModel) {
        paginationBaseRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<WebTemplateResponseModel>> getWebTamplatesInBatchesResponse = apiTranslator().getWebTemplateSubTranslator().getWebTemplatesInBatches(paginationBaseRequestModel);
        if (!getWebTamplatesInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getWebTamplatesInBatchesResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getWebTamplatesInBatchesResponse.getItem()));
    }

    @PostMapping(ApiRoutes.WebTemplateSubRoute.TOGGLE_WEB_TEMPLATE)
    public ResponseEntity<JsonResponse<Boolean>> toggleWebTemplate(@RequestParam long webTemplateId) {
        Response<Boolean> toggleWebTemplateResponse = apiTranslator().getWebTemplateSubTranslator().toggleWebTemplate(webTemplateId);
        if (!toggleWebTemplateResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, toggleWebTemplateResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, toggleWebTemplateResponse.getItem()));
    }

    @PutMapping(ApiRoutes.WebTemplateSubRoute.INSERT_WEB_TEMPLATE)
    public ResponseEntity<JsonResponse<Long>> insertWebTemplate(@RequestBody WebTemplateRequestModel webTemplateRequestModel) throws JsonProcessingException {
        Response<Long> insertWebTemplateResponse = apiTranslator().getWebTemplateSubTranslator().insertWebTemplate(webTemplateRequestModel);
        if (!insertWebTemplateResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, insertWebTemplateResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.WebTemplate.WEB_TEMPLATE_INDEX, insertWebTemplateResponse.getMessage()));
    }

    @PostMapping(ApiRoutes.WebTemplateSubRoute.UPDATE_WEB_TEMPLATE)
    public ResponseEntity<JsonResponse<Long>> updateWebTemplate(@RequestBody WebTemplateRequestModel webTemplateRequestModel) throws JsonProcessingException {
        Response<Long> updateWebTemplateResponse = apiTranslator().getWebTemplateSubTranslator().updateWebTemplate(webTemplateRequestModel);
        if (!updateWebTemplateResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateWebTemplateResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.WebTemplate.WEB_TEMPLATE_INDEX, updateWebTemplateResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.WebTemplateSubRoute.GET_WEB_TEMPLATE_BY_ID)
    public ResponseEntity<JsonResponse<WebTemplateResponseModel>> getWebTemplateById(@RequestParam long webTemplateId) {
        Response<WebTemplateResponseModel> getWebTemplateByIdResponse = apiTranslator().getWebTemplateSubTranslator().getWebTemplateById(webTemplateId);
        if (!getWebTemplateByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getWebTemplateByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getWebTemplateByIdResponse.getItem()));
    }
}