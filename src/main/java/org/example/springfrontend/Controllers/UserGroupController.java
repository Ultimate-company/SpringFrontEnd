package org.example.springfrontend.Controllers;

import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.UserGroup;
import org.example.Models.RequestModels.ApiRequestModels.UserGroupRequestModel;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.UserGroupResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.USER_GROUP)
public class UserGroupController extends BaseController {
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("UserGroup_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("UserGroup_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("UserGroup_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.UserGroupsSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.UserGroupsSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @PostMapping(ApiRoutes.UserGroupsSubRoute.GET_USER_GROUPS_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<UserGroupResponseModel>>> getLeadsInBatches(@RequestBody PaginationBaseRequestModel paginationBaseRequestModel) {
        paginationBaseRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<UserGroupResponseModel>> getUserGroupsInBatchesResponse = apiTranslator().getUserGroupSubTranslator().getUserGroupsInBatches(paginationBaseRequestModel);
        if (!getUserGroupsInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getUserGroupsInBatchesResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getUserGroupsInBatchesResponse.getItem()));
    }

    @DeleteMapping(ApiRoutes.UserGroupsSubRoute.TOGGLE_USER_GROUP)
    public ResponseEntity<JsonResponse<Boolean>> toggleLead(@RequestParam long userGroupId) {
        Response<Boolean> toggleUserGroupResponse = apiTranslator().getUserGroupSubTranslator().toggleUserGroup(userGroupId);
        if (!toggleUserGroupResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, toggleUserGroupResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, toggleUserGroupResponse.getItem()));
    }

    @PutMapping(ApiRoutes.UserGroupsSubRoute.CREATE_USER_GROUP)
    public ResponseEntity<JsonResponse<Long>> createUserGroup(@RequestBody UserGroupRequestModel userGroupRequestModel) {
        Response<Long> createUserGroupResponse = apiTranslator().getUserGroupSubTranslator().createUserGroup(userGroupRequestModel);
        if (!createUserGroupResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createUserGroupResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.UserGroup.USER_GROUPS_INDEX, createUserGroupResponse.getMessage()));
    }

    @PostMapping(ApiRoutes.UserGroupsSubRoute.UPDATE_USER_GROUP)
    public ResponseEntity<JsonResponse<Long>> updateUserGroup(@RequestBody UserGroupRequestModel userGroupRequestModel) {
        Response<Long> updateUserGroupResponse = apiTranslator().getUserGroupSubTranslator().updateUserGroup(userGroupRequestModel);
        if (!updateUserGroupResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateUserGroupResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.UserGroup.USER_GROUPS_INDEX, updateUserGroupResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.UserGroupsSubRoute.GET_USER_GROUP_DETAILS_BY_ID)
    public ResponseEntity<JsonResponse<UserGroupResponseModel>> getUserGroupDetailsById(@RequestParam long userGroupId) {
        Response<UserGroupResponseModel> getUserGroupDetailsByIdResponse = apiTranslator().getUserGroupSubTranslator().getUserGroupDetailsById(userGroupId);
        if (!getUserGroupDetailsByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getUserGroupDetailsByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getUserGroupDetailsByIdResponse.getItem()));
    }
}