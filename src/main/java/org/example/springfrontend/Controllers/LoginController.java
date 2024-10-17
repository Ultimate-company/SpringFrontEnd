package org.example.springfrontend.Controllers;

import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Constants.Roles;
import org.example.Models.CommunicationModels.CentralModels.Carrier;
import org.example.Models.RequestModels.ApiRequestModels.LoginRequestModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.example.Models.CommunicationModels.CentralModels.User;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.LOGIN)
public class LoginController extends BaseController {

    @PostMapping(ApiRoutes.LoginSubRoute.SIGN_IN)
    public ResponseEntity<JsonResponse<String>> signIn(@RequestBody LoginRequestModel loginRequestModel) {
        Response<User> signInResponse = apiTranslator().getLoginSubTranslator().signIn(loginRequestModel);
        if (signInResponse.isSuccess()) {
            loginRequestModel.setApiKey(signInResponse.getItem().getApiKey());
            Response<String> getTokenResponse = apiTranslator().getLoginSubTranslator().getToken(loginRequestModel);
            if (getTokenResponse.isSuccess()) {
                setCurrentUser(signInResponse.getItem());
                setApiToken(getTokenResponse.getItem());
            }

            return ResponseEntity.ok(new JsonResponse<>(Endpoints.Carrier.CARRIERS_INDEX, null));
        } else {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, signInResponse.getMessage(), null));
        }
    }

    @PostMapping(ApiRoutes.LoginSubRoute.SIGN_UP)
    public ResponseEntity<JsonResponse<String>> signUp(@RequestBody User user) throws Exception {
        // validations
        user.setRole(Roles.Customer);
        Response<String> signUpResponse = apiTranslator().getLoginSubTranslator().signUp(user);
        if (!signUpResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, signUpResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Login.LOGIN_INDEX, signUpResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.LoginSubRoute.CHECK_IF_USER_IS_LOGGED_IN)
    public ResponseEntity<JsonResponse<String>> checkIfUserIsLoggedIn() {
        User user = getCurrentUser();
        Carrier carrier = getCurrentCarrier();

        // if user is not set
        if(user == null) {
            return ResponseEntity.ok(new JsonResponse<>(Endpoints.Login.LOGIN_INDEX, null));
        }

        // if user is set and carrier is not set
        else if(carrier == null) {
            return ResponseEntity.ok(new JsonResponse<>(Endpoints.Carrier.CARRIERS_INDEX, null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @PostMapping(ApiRoutes.LoginSubRoute.LOG_OUT)
    public ResponseEntity<JsonResponse<String>> logOut() {
        resetSession();
        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Login.LOGIN_INDEX, null));
    }
}