package org.example.springfrontend.Controllers;

import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.Address;
import org.example.Models.CommunicationModels.CarrierModels.Permissions;
import org.example.Models.CommunicationModels.CentralModels.User;
import org.example.Models.RequestModels.ApiRequestModels.UsersRequestModel;
import org.example.Models.RequestModels.GridRequestModels.GetUsersRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.UserResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.USER)
public class UserController extends BaseController {

    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("User_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("User_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("User_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.UsersSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.UsersSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @GetMapping(ApiRoutes.UsersSubRoute.GET_LOGGED_IN_USER)
    public ResponseEntity<JsonResponse<User>> getLoggedInUser() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getCurrentUser()));
    }

    @GetMapping(ApiRoutes.UsersSubRoute.GET_LOGGED_IN_USER_PERMISSIONS)
    public ResponseEntity<JsonResponse<Permissions>> getLoggedInUserPermissions() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getPermission()));
    }

    @PostMapping(ApiRoutes.UsersSubRoute.GET_USERS_IN_CARRIER_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<User>>> getUsersInCarrierInBatches(@RequestBody GetUsersRequestModel getUsersRequestModel) {
        getUsersRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<User>> fetchUsersInCarrierInBatchesResponse = apiTranslator().getUserSubTranslator().fetchUsersInCarrierInBatches(getUsersRequestModel);
        if (!fetchUsersInCarrierInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, fetchUsersInCarrierInBatchesResponse.getMessage(), null));
        }


        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, fetchUsersInCarrierInBatchesResponse.getItem()));
    }

    @PostMapping(ApiRoutes.UsersSubRoute.TOGGLE_USER)
    public ResponseEntity<JsonResponse<Long>> toggleUser(@RequestParam long userId) {
        Response<Long> toggleUserResponse = apiTranslator().getUserSubTranslator().toggleUser(userId);
        if (!toggleUserResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, toggleUserResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, toggleUserResponse.getItem()));
    }

    @GetMapping(ApiRoutes.UsersSubRoute.GET_USER_BY_ID)
    public ResponseEntity<JsonResponse<UserResponseModel>> getUserById(@RequestParam long userId) {
        UserResponseModel userResponseModel = new UserResponseModel();

        // fetch user details
        Response<User> getUserByIdResponse = apiTranslator().getUserSubTranslator().getUserById(userId);
        if (!getUserByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getUserByIdResponse.getMessage(), null));
        }
        userResponseModel.setUser(getUserByIdResponse.getItem());

        // fetch user address
        Response<Address> getAddressByIdResponse = apiTranslator().getAddressSubTranslator().getAddressByUserId(getUserByIdResponse.getItem().getUserId());
        if(getAddressByIdResponse.isSuccess() && getAddressByIdResponse.getItem() != null) {
            userResponseModel.setAddress(getAddressByIdResponse.getItem());
        }

        // fetch user permissions
        Response<Permissions> getPermissionByIdResponse = apiTranslator().getUserSubTranslator().getUserPermissionsById(getUserByIdResponse.getItem().getUserId());
        if(!getPermissionByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPermissionByIdResponse.getMessage(), null));
        }
        userResponseModel.setPermissions(getPermissionByIdResponse.getItem());

        // fetch user group ids the user is a part of
        Response<List<Long>> getUserGroupIdsByUserIdResponse = apiTranslator().getUserGroupSubTranslator().getUserGroupIdsByUserId(userId);
        if(!getUserGroupIdsByUserIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getUserGroupIdsByUserIdResponse.getMessage(), null));
        }
        userResponseModel.setGroupIds(getUserGroupIdsByUserIdResponse.getItem());

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, userResponseModel));
    }

    @PutMapping(ApiRoutes.UsersSubRoute.CREATE_USER)
    public ResponseEntity<JsonResponse<Long>> createUser(@RequestBody UsersRequestModel usersRequestModel) {
        Response<Long> createUserResponse = apiTranslator().getUserSubTranslator().createUser(usersRequestModel);
        if(!createUserResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createUserResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.User.USERS_INDEX, createUserResponse.getMessage()));
    }

    @PostMapping(ApiRoutes.UsersSubRoute.UPDATE_USER)
    public ResponseEntity<JsonResponse<Long>> updateUser(@RequestBody UsersRequestModel usersRequestModel) {
        Response<Long> updateUserResponse = apiTranslator().getUserSubTranslator().updateUser(usersRequestModel);
        if(!updateUserResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateUserResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.User.USERS_INDEX, updateUserResponse.getMessage()));
    }
}