package org.example.springfrontend.Controllers;

import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.FirebaseHelper;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.Address;
import org.example.Models.CommunicationModels.CarrierModels.Permissions;
import org.example.Models.CommunicationModels.CentralModels.User;
import org.example.Models.RequestModels.ApiRequestModels.UsersRequestModel;
import org.example.Models.RequestModels.GridRequestModels.GetUsersRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.GetCarrierResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.UserResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.USER)
public class UserController extends BaseController {
    @Autowired
    private Environment environment;

    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if (httpSession.getAttribute("User_IncludeDeleted") != null) {
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
    public ResponseEntity<JsonResponse<UserResponseModel>> getUserById(@RequestParam long userId) throws IOException {
        // fetch user details
        Response<List<UserResponseModel>> getUsersByIdsResponse = apiTranslator().getUserSubTranslator().getUsersByIds(Collections.singletonList(userId));
        if (!getUsersByIdsResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getUsersByIdsResponse.getMessage(), null));
        }

        // fetch user address
        Response<Address> getAddressByIdResponse = apiTranslator().getAddressSubTranslator().getAddressByUserId(getUsersByIdsResponse.getItem().getFirst().getUser().getUserId());
        if (getAddressByIdResponse.isSuccess() && getAddressByIdResponse.getItem() != null) {
            getUsersByIdsResponse.getItem().getFirst().setAddress(getAddressByIdResponse.getItem());
        }

        // fetch user permissions
        Response<Permissions> getPermissionByIdResponse = apiTranslator().getUserSubTranslator().getUserPermissionsById(getUsersByIdsResponse.getItem().getFirst().getUser().getUserId());
        if (!getPermissionByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPermissionByIdResponse.getMessage(), null));
        }
        getUsersByIdsResponse.getItem().getFirst().setPermissions(getPermissionByIdResponse.getItem());

        // fetch user group ids the user is a part of
        Response<List<Long>> getUserGroupIdsByUserIdResponse = apiTranslator().getUserGroupSubTranslator().getUserGroupIdsByUserId(userId);
        if (!getUserGroupIdsByUserIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getUserGroupIdsByUserIdResponse.getMessage(), null));
        }
        getUsersByIdsResponse.getItem().getFirst().setGroupIds(getUserGroupIdsByUserIdResponse.getItem());

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getUsersByIdsResponse.getItem().getFirst()));
    }

    @PutMapping(ApiRoutes.UsersSubRoute.CREATE_USER)
    public ResponseEntity<JsonResponse<Long>> createUser(@RequestBody UsersRequestModel usersRequestModel) throws Exception {
        Response<Long> createUserResponse = apiTranslator().getUserSubTranslator().createUser(usersRequestModel);
        if (!createUserResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createUserResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.User.USERS_INDEX, createUserResponse.getMessage()));
    }

    @PostMapping(ApiRoutes.UsersSubRoute.UPDATE_USER)
    public ResponseEntity<JsonResponse<Long>> updateUser(@RequestBody UsersRequestModel usersRequestModel) throws Exception {
        Response<Long> updateUserResponse = apiTranslator().getUserSubTranslator().updateUser(usersRequestModel);
        if (!updateUserResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateUserResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.User.USERS_INDEX, updateUserResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.UsersSubRoute.GET_PROFILE_IMAGE)
    public ResponseEntity<byte[]> getUserProfileImage(@RequestParam long userId) {
        try {
            Response<List<UserResponseModel>> getUserDetailsResponse = apiTranslator().getUserSubTranslator().getUsersByIds(Collections.singletonList(userId));
            if (!getUserDetailsResponse.isSuccess()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Response<GetCarrierResponseModel> getCarrierResponse = apiTranslator().getCarrierSubTranslator().getCarrierDetailsById(getCurrentCarrier().getCarrierId());
            if (!getCarrierResponse.isSuccess()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            String filePath = (environment.getActiveProfiles().length > 0 ? environment.getActiveProfiles()[0] : "default")
                    + "/"
                    + getCurrentCarrier().getDatabaseName()
                    + "/UserProfiles"
                    + "/" + getUserDetailsResponse.getItem().getFirst().getUser().getUserId() + "-" + getUserDetailsResponse.getItem().getFirst().getUser().getLastName() + ".png";

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
}