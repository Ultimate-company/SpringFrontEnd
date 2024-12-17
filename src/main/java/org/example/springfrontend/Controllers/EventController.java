package org.example.springfrontend.Controllers;

import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.RequestModels.ApiRequestModels.EventRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.EventResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.EVENT)
public class EventController extends BaseController {
    @Autowired
    private Environment environment;

    @GetMapping(ApiRoutes.EventSubRoute.GET_ALL_EVENTS_FOR_USERID_BASED_ON_MONTH)
    public ResponseEntity<JsonResponse<List<EventResponseModel>>> getAllEventsForUserIdBasedOnMonth(@RequestParam int month) {
        Response<List<EventResponseModel>> getAllEventsForUserIdBasedOnMonthResponse = apiTranslator().getEventSubTranslator().getAllEventsForUserIdBasedOnMonth(getCurrentUser().getUserId(), month);
        if (!getAllEventsForUserIdBasedOnMonthResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getAllEventsForUserIdBasedOnMonthResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getAllEventsForUserIdBasedOnMonthResponse.getItem()));
    }

    @PostMapping(ApiRoutes.EventSubRoute.UPDATE_EVENT)
    public ResponseEntity<JsonResponse<Long>> updateEvent(@RequestBody EventRequestModel eventRequestModel) {
        Response<Boolean> updateEventResponse = apiTranslator().getEventSubTranslator().updateEvent(eventRequestModel);
        if (!updateEventResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateEventResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Event.EVENT_INDEX, updateEventResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.EventSubRoute.GET_EVENT_DETAILS_BY_ID)
    public ResponseEntity<JsonResponse<EventResponseModel>> getEventDetailsById(@RequestParam long eventId) {
        Response<EventResponseModel> getEventDetailsByIdResponse = apiTranslator().getEventSubTranslator().getEventDetailsById(eventId);
        if (!getEventDetailsByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getEventDetailsByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getEventDetailsByIdResponse.getItem()));
    }

    @PutMapping(ApiRoutes.EventSubRoute.CREATE_EVENT)
    public ResponseEntity<JsonResponse<Long>> createEvent(@RequestBody EventRequestModel eventRequestModel){
        Response<Long> createEventResponse = apiTranslator().getEventSubTranslator().createEvent(eventRequestModel);
        if (!createEventResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createEventResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Promo.PROMOS_INDEX, createEventResponse.getMessage()));
    }

    @DeleteMapping(ApiRoutes.EventSubRoute.TOGGLE_EVENT)
    public ResponseEntity<JsonResponse<Boolean>> toggleEvent(@RequestParam long eventId) {
        Response<Boolean> toggleEventResponse = apiTranslator().getEventSubTranslator().toggleEvent(eventId);
        if (!toggleEventResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, toggleEventResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, toggleEventResponse.getItem()));
    }

}
