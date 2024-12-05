package org.example.springfrontend.Controllers;

import org.example.ApiRoutes;
import org.example.CommonHelpers.FirebaseHelper;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.Permissions;
import org.example.Models.CommunicationModels.CentralModels.Carrier;
import org.example.Models.RequestModels.GridRequestModels.GetCarriersRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.GetCarrierResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
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

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.CARRIER)
public class CarrierController extends BaseController {
    @Autowired
    private Environment environment;

    @GetMapping(ApiRoutes.CarriersSubRoute.GET_LOGGED_IN_CARRIER)
    public ResponseEntity<JsonResponse<Carrier>> getLoggedInCarrier() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, "",
                getCurrentCarrier()));
    }

    @GetMapping(ApiRoutes.CarriersSubRoute.GET_CARRIER_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<Carrier>>> getCarrierInBatches(@RequestParam Integer start,
                                                                    @RequestParam Integer end,
                                                                    @RequestParam String filteredText ) {
        GetCarriersRequestModel getCarriersRequestModel = new GetCarriersRequestModel();
        getCarriersRequestModel.setStart(start);
        getCarriersRequestModel.setEnd(end);
        getCarriersRequestModel.setFilterExpr(filteredText);
        getCarriersRequestModel.setUserId(getCurrentUser().getUserId());

        Response<PaginationBaseResponseModel<Carrier>> getCarriersResponse = apiTranslator().getCarrierSubTranslator().getCarriersInBatches(getCarriersRequestModel);
        if(!getCarriersResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getCarriersResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, "",  getCarriersResponse.getItem()));
    }

    @PostMapping(ApiRoutes.CarriersSubRoute.SET_CARRIER)
    public ResponseEntity<JsonResponse<Boolean>> setCarrier(@RequestParam long carrierId) {
        Response<GetCarrierResponseModel> getCarrierResponse = apiTranslator().getCarrierSubTranslator().getCarrierDetailsById(carrierId);
        if(!getCarrierResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getCarrierResponse.getMessage(), null));
        }

        // set the carrier in the session
        setCurrentCarrier(getCarrierResponse.getItem().getCarrier());

        // get the permissions the user has for this particular carrier and set it for the current session
        Response<Permissions> permissionsResponse = apiTranslator().getUserSubTranslator().getUserPermissionsById(getCurrentUser().getUserId());
        if(!permissionsResponse.isSuccess()) {
            setCurrentCarrier(null);
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, permissionsResponse.getMessage(), null));
        }

        setPermission(permissionsResponse.getItem());
        return ResponseEntity.ok(new JsonResponse<>(Endpoints.User.USERS_INDEX, null));
    }

    @PostMapping(ApiRoutes.CarriersSubRoute.UPDATE_API_KEYS)
    public ResponseEntity<JsonResponse<Boolean>> updateApiKeys(@RequestBody Carrier carrier) throws IOException {
        Response<Boolean> updateApiKeysResponse = apiTranslator().getCarrierSubTranslator().updateApiKeys(carrier);
        if(!updateApiKeysResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateApiKeysResponse.getMessage(), false));
        }
        else {
            // update the current carrier
            Response<GetCarrierResponseModel> getCarrierResponse = apiTranslator().getCarrierSubTranslator().getCarrierDetailsById(carrier.getCarrierId());
            if(!getCarrierResponse.isSuccess()) {
                return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getCarrierResponse.getMessage(), null));
            }
            setCurrentCarrier(getCarrierResponse.getItem().getCarrier());
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, updateApiKeysResponse.getMessage(), true));
    }

    @GetMapping(ApiRoutes.CarriersSubRoute.GET_CARRIER_IMAGE)
    public ResponseEntity<byte[]> getCarrierImage(@RequestParam long carrierId, @RequestParam(defaultValue = "false") boolean miniLogo) {
        try {
            Response<GetCarrierResponseModel> getCarrierResponse = apiTranslator().getCarrierSubTranslator().getCarrierDetailsById(carrierId);
            if(!getCarrierResponse.isSuccess()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            String filePath = (environment.getActiveProfiles().length > 0 ? environment.getActiveProfiles()[0] : "default") + "/"
                    + getCarrierResponse.getItem().getCarrier().getDatabaseName()
                    + (miniLogo ? "/MiniLogo.png" : "/Logo.png");

            FirebaseHelper firebaseHelper = new FirebaseHelper(getCarrierResponse.getItem().getGoogleCred());
            byte[] imageBytes = firebaseHelper.downloadFileAsBytesFromFirebase(filePath);
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