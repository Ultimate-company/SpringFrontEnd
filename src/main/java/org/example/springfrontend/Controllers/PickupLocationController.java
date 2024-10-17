package org.example.springfrontend.Controllers;

import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.PickupLocation;
import org.example.Models.CommunicationModels.CarrierModels.Promo;
import org.example.Models.RequestModels.ApiRequestModels.PickupLocationRequestModel;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.PickupLocationResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.PICKUP_LOCATION)
public class PickupLocationController extends BaseController {
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("PickupLocation_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("PickupLocation_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("PickupLocation_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.PickupLocationsSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.PickupLocationsSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @PostMapping(ApiRoutes.PickupLocationsSubRoute.GET_PICKUP_LOCATIONS_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<PickupLocationResponseModel>>> getPickupLocationsInBatches(@RequestBody PaginationBaseRequestModel paginationBaseRequestModel) {
        paginationBaseRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<PickupLocationResponseModel>> getPickupLocationsInBatchesResponse = apiTranslator().getPickupLocationSubTranslator().getPickupLocationsInBatches(paginationBaseRequestModel);
        if (!getPickupLocationsInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPickupLocationsInBatchesResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getPickupLocationsInBatchesResponse.getItem()));
    }

    @DeleteMapping(ApiRoutes.PickupLocationsSubRoute.TOGGLE_PICKUP_LOCATION)
    public ResponseEntity<JsonResponse<Boolean>> togglePickupLocation(@RequestParam long pickupLocationId) {
        Response<Boolean> togglePickupLocation = apiTranslator().getPickupLocationSubTranslator().togglePickupLocation(pickupLocationId);
        if (!togglePickupLocation.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, togglePickupLocation.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, togglePickupLocation.getItem()));
    }

    @PutMapping(ApiRoutes.PickupLocationsSubRoute.CREATE_PICKUP_LOCATION)
    public ResponseEntity<JsonResponse<Long>> createPickupLocation(@RequestBody PickupLocationRequestModel pickupLocationRequestModel) throws Exception {
        Response<Long> createPickupLocationResponse = apiTranslator().getPickupLocationSubTranslator().createPickupLocation(pickupLocationRequestModel);
        if (!createPickupLocationResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createPickupLocationResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.PickupLocation.PICKUP_LOCATIONS_INDEX, createPickupLocationResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.PickupLocationsSubRoute.GET_PICKUP_LOCATION_BY_ID)
    public ResponseEntity<JsonResponse<PickupLocationResponseModel>> getPickupLocationById(@RequestParam long pickupLocationId) {
        Response<PickupLocationResponseModel> getPickupLocationByIdResponse = apiTranslator().getPickupLocationSubTranslator().getPickupLocationById(pickupLocationId);
        if (!getPickupLocationByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPickupLocationByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getPickupLocationByIdResponse.getItem()));
    }

    @PostMapping(ApiRoutes.PickupLocationsSubRoute.UPDATE_PICKUP_LOCATION)
    public ResponseEntity<JsonResponse<Long>> updatePickupLocation(@RequestBody PickupLocationRequestModel pickupLocationRequestModel) throws Exception {
        Response<Long> updatePickupLocationResponse = apiTranslator().getPickupLocationSubTranslator().updatePickupLocation(pickupLocationRequestModel);
        if (!updatePickupLocationResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updatePickupLocationResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.PickupLocation.PICKUP_LOCATIONS_INDEX, updatePickupLocationResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.PickupLocationsSubRoute.GET_ALL_PICKUP_LOCATIONS)
    public ResponseEntity<JsonResponse<List<PickupLocation>>> getAllPickupLocations() {
        Response<List<PickupLocation>> getAllPickupLocationsResponse = apiTranslator().getPickupLocationSubTranslator().getAllPickupLocations(false);
        if(!getAllPickupLocationsResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getAllPickupLocationsResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getAllPickupLocationsResponse.getItem()));
    }
}