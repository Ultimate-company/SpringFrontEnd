package org.example.springfrontend.Controllers;

import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.Lead;
import org.example.Models.CommunicationModels.CentralModels.User;
import org.example.Models.RequestModels.ApiRequestModels.LeadRequestModel;
import org.example.Models.RequestModels.GridRequestModels.GetUsersRequestModel;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.LeadResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.LEAD)
public class LeadController extends BaseController {
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("Lead_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("Lead_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("Lead_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.LeadsSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.LeadsSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @PostMapping(ApiRoutes.LeadsSubRoute.GET_LEADS_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<LeadResponseModel>>> getLeadsInBatches(@RequestBody PaginationBaseRequestModel paginationBaseRequestModel) {
        paginationBaseRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<LeadResponseModel>> getLeadsInBatchesResponse = apiTranslator().getLeadSubTranslator().getLeadsInBatches(paginationBaseRequestModel);
        if (!getLeadsInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getLeadsInBatchesResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getLeadsInBatchesResponse.getItem()));
    }

    @DeleteMapping(ApiRoutes.LeadsSubRoute.TOGGLE_LEAD)
    public ResponseEntity<JsonResponse<Boolean>> toggleLead(@RequestParam long leadId) {
        Response<Boolean> toggleLeadResponse = apiTranslator().getLeadSubTranslator().toggleLead(leadId);
        if (!toggleLeadResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, toggleLeadResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, toggleLeadResponse.getItem()));
    }

    @PutMapping(ApiRoutes.LeadsSubRoute.CREATE_LEAD)
    public ResponseEntity<JsonResponse<Long>> createLead(@RequestBody LeadRequestModel leadRequestModel){
        Response<Long> createLeadResponse = apiTranslator().getLeadSubTranslator().createLead(leadRequestModel);
        if (!createLeadResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createLeadResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Lead.LEADS_INDEX, createLeadResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.LeadsSubRoute.GET_LEAD_DETAILS_BY_ID)
    public ResponseEntity<JsonResponse<LeadResponseModel>> getLeadDetailsById(@RequestParam long leadId) {
        Response<LeadResponseModel> getLeadDetailsByIdResponse = apiTranslator().getLeadSubTranslator().getLeadDetailsById(leadId);
        if (!getLeadDetailsByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getLeadDetailsByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getLeadDetailsByIdResponse.getItem()));
    }

    @PostMapping(ApiRoutes.LeadsSubRoute.UPDATE_LEAD)
    public ResponseEntity<JsonResponse<Long>> updateLead(@RequestBody LeadRequestModel leadRequestModel) {
        Response<Long> updateLeadResponse = apiTranslator().getLeadSubTranslator().updateLead(leadRequestModel);
        if (!updateLeadResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateLeadResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Lead.LEADS_INDEX, updateLeadResponse.getMessage()));
    }
}