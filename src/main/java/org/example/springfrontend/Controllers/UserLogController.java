package org.example.springfrontend.Controllers;

import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CentralModels.UserLog;
import org.example.Models.RequestModels.GridRequestModels.GetUserLogsRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.USERLOG)
public class UserLogController extends BaseController {
    @PostMapping(ApiRoutes.UserLogSubRoute.GET_USER_LOGS_IN_BATCHES_BY_USERID)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<UserLog>>> getUserLogsInBatchesByUserId(@RequestBody GetUserLogsRequestModel getUserLogsRequestModel) {

        getUserLogsRequestModel.setCarrierId(getCurrentCarrier().getCarrierId());
        Response<PaginationBaseResponseModel<UserLog>> fetchUserLogsInCarrierInBatchesResponse = apiTranslator().getUserLogSubTranslator().fetchUserLogsInBatches(getUserLogsRequestModel);
        if (!fetchUserLogsInCarrierInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, fetchUserLogsInCarrierInBatchesResponse.getMessage(), null));
        }


        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, fetchUserLogsInCarrierInBatchesResponse.getItem()));
    }
}
