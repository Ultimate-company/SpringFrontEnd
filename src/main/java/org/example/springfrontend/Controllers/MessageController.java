package org.example.springfrontend.Controllers;

import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.Message;
import org.example.Models.CommunicationModels.CarrierModels.Promo;
import org.example.Models.RequestModels.ApiRequestModels.MessageRequestModel;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.MessageResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.MESSAGE)
public class MessageController extends BaseController {
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("Message_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("Message_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("Message_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.MessagesSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.MessagesSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @PostMapping(ApiRoutes.MessagesSubRoute.GET_MESSAGES_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<MessageResponseModel>>> getMessagesInBatches(@RequestBody PaginationBaseRequestModel paginationBaseRequestModel) {
        paginationBaseRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<MessageResponseModel>> getMessagesInBatchesResponse = apiTranslator().getMessageSubTranslator().getMessagesInBatches(paginationBaseRequestModel);
        if (!getMessagesInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getMessagesInBatchesResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getMessagesInBatchesResponse.getItem()));
    }

    @PostMapping(ApiRoutes.MessagesSubRoute.TOGGLE_MESSAGE)
    public ResponseEntity<JsonResponse<Boolean>> toggleMessage(@RequestParam long messageId) {
        Response<Boolean> toggleMessageResponse = apiTranslator().getMessageSubTranslator().toggleMessage(messageId);
        if (!toggleMessageResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, toggleMessageResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, toggleMessageResponse.getItem()));
    }

    @PutMapping(ApiRoutes.MessagesSubRoute.CREATE_MESSAGE)
    public ResponseEntity<JsonResponse<Long>> createMessage(@RequestBody MessageRequestModel messageRequestModel){
        Response<Long> createMessageResponse = apiTranslator().getMessageSubTranslator().createMessage(messageRequestModel);
        if (!createMessageResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createMessageResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Message.MESSAGES_INDEX, createMessageResponse.getMessage()));
    }

    @PostMapping(ApiRoutes.MessagesSubRoute.UPDATE_MESSAGE)
    public ResponseEntity<JsonResponse<Long>> updateMessage(@RequestBody MessageRequestModel messageRequestModel){
        Response<Long> updateMessageResponse = apiTranslator().getMessageSubTranslator().updateMessage(messageRequestModel);
        if (!updateMessageResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateMessageResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Message.MESSAGES_INDEX, updateMessageResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.MessagesSubRoute.GET_MESSAGE_DETAILS_BY_ID)
    public ResponseEntity<JsonResponse<MessageResponseModel>> getMessageDetailsById(@RequestParam long messageId){
        Response<MessageResponseModel> getMessageDetailsByIdResponse = apiTranslator().getMessageSubTranslator().getMessageDetailsById(messageId);
        if (!getMessageDetailsByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getMessageDetailsByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, "", getMessageDetailsByIdResponse.getItem()));
    }

    @GetMapping(ApiRoutes.MessagesSubRoute.GET_MESSAGES_BY_USER_ID)
    public ResponseEntity<JsonResponse<List<MessageResponseModel>>> getMessagesByUserId(){
        Response<List<MessageResponseModel>> getMessagesByUserIdResponse = apiTranslator().getMessageSubTranslator().getMessagesByUserId(getCurrentUser().getUserId());
        if (!getMessagesByUserIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getMessagesByUserIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success,"", getMessagesByUserIdResponse.getItem()));
    }

    @PostMapping(ApiRoutes.MessagesSubRoute.SET_MESSAGE_READ_BY_USER_ID_AND_MESSAGE_ID)
    public ResponseEntity<JsonResponse<Boolean>> setMessageReadByUserIdAndMessageId(@RequestParam long messageId) {
        Response<Boolean> setMessageReadByUserIdAndMessageIdResponse = apiTranslator().getMessageSubTranslator().setMessageReadByUserIdAndMessageId(getCurrentUser().getUserId(), messageId);
        if (!setMessageReadByUserIdAndMessageIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, setMessageReadByUserIdAndMessageIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, "", setMessageReadByUserIdAndMessageIdResponse.getItem()));
    }
}
