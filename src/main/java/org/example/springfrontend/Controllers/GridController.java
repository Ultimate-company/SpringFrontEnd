package org.example.springfrontend.Controllers;

import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.UserGridPreference;
import org.example.Models.RequestModels.ApiRequestModels.GridPreferenceRequestModel;
import org.example.Models.ResponseModels.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.GRID)
public class GridController extends BaseController {

    @PostMapping(ApiRoutes.GridSubRoute.UPDATE_GRID_DENSITY_PREFERENCE)
    public ResponseEntity<JsonResponse<Boolean>> updateGridDensityVisibilityPreference(@RequestBody GridPreferenceRequestModel gridPreferenceRequestModel) {
        Response<Boolean> updateGridDensityVisibilityPreferenceResponse = apiTranslator().getGridSubTranslator().updateGridDensityVisibilityPreference(gridPreferenceRequestModel);
        if(!updateGridDensityVisibilityPreferenceResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateGridDensityVisibilityPreferenceResponse.getMessage(), false));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, updateGridDensityVisibilityPreferenceResponse.getMessage(), true));
    }

    @PostMapping(ApiRoutes.GridSubRoute.UPDATE_GRID_VISIBILITY_PREFERENCE)
    public ResponseEntity<JsonResponse<Boolean>> updateGridVisibilityPreference(@RequestBody GridPreferenceRequestModel gridPreferenceRequestModel) {
        Response<Boolean> updateGridVisibilityPreferenceResponse = apiTranslator().getGridSubTranslator().updateGridVisibilityPreference(gridPreferenceRequestModel);
        if(!updateGridVisibilityPreferenceResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateGridVisibilityPreferenceResponse.getMessage(), false));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, updateGridVisibilityPreferenceResponse.getMessage(), true));
    }

    @PostMapping(ApiRoutes.GridSubRoute.UPDATE_ROWS_PER_PAGE_PREFERENCE)
    public ResponseEntity<JsonResponse<Boolean>> updateRowsPerPagePreference(@RequestBody GridPreferenceRequestModel gridPreferenceRequestModel) {
        Response<Boolean> updateRowsPerPagePreferenceResponse = apiTranslator().getGridSubTranslator().updateRowsPerPagePreference(gridPreferenceRequestModel);
        if(!updateRowsPerPagePreferenceResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateRowsPerPagePreferenceResponse.getMessage(), false));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, updateRowsPerPagePreferenceResponse.getMessage(), true));
    }

    @GetMapping(ApiRoutes.GridSubRoute.GET_GRID_VISIBILITY_PREFERENCE)
    public ResponseEntity<JsonResponse<UserGridPreference>> getGridVisibilityPreference(@RequestParam int gridId) {
        Response<UserGridPreference> getGridVisibilityPreferenceResponse = apiTranslator().getGridSubTranslator().getGridVisibilityPreference(gridId);
        if(!getGridVisibilityPreferenceResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.NoMessage, getGridVisibilityPreferenceResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, getGridVisibilityPreferenceResponse.getMessage(), getGridVisibilityPreferenceResponse.getItem()));
    }
}
