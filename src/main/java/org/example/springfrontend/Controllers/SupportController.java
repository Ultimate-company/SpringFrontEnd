package org.example.springfrontend.Controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.ImageHelper;
import org.example.CommonHelpers.JiraHelper;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.RequestModels.ApiRequestModels.SupportRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.GetAttachmentMetadataResponseModel;
import org.example.Models.ResponseModels.JiraResponseModels.*;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.json.JSONException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.SUPPORT)
public class SupportController extends BaseController {
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("Support_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("Support_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("Support_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.SupportSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.SupportSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @GetMapping(ApiRoutes.SupportSubRoute.GET_SUPPORT_TICKETS_IN_BATCHES)
    public ResponseEntity<JsonResponse<GetTicketsResponseModel>> getSupportTicketsInBatches(@RequestParam int start, @RequestParam int end) {
        Response<GetTicketsResponseModel> getTicketsResponse = apiTranslator().getSupportSubTranslator().getSupportTicketsInBatches(start, end);
        if(!getTicketsResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getTicketsResponse.getMessage(), null));
        }

        for(ResponseModelObjects.Issue issue : getTicketsResponse.getItem().getIssues()) {
            // remove images from the description
            String description = issue.getRenderedFields().getDescription().toString();
            boolean cleaned;
            do {
                cleaned = false;

                // Check for and remove the error span
                if (description.contains("<span class=\"error\">")) {
                    int errorStart = description.indexOf("<p><span class=\"error\">");
                    int errorEnd = description.indexOf("</p>", errorStart) - errorStart + 4;
                    description = new StringBuilder(description).delete(errorStart, errorStart + errorEnd).toString();
                    cleaned = true;
                }

                // Check for and remove the secure attachment
                else if (description.contains("/secure/attachment")) {
                    int errorStart = description.indexOf("<p><span class=\"image-wrap\" style=\"\">");
                    int errorEnd = description.indexOf("</p>", errorStart) - errorStart + 4;
                    description = new StringBuilder(description).delete(errorStart, errorStart + errorEnd).toString();
                    cleaned = true;
                }

            } while (cleaned);

            issue.getRenderedFields().setDescription(description);
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, "", getTicketsResponse.getItem()));
    }

    @GetMapping(ApiRoutes.SupportSubRoute.GET_TICKET_DETAILS_BY_ID)
    public ResponseEntity<JsonResponse<GetTicketDetailsResponseModel>> getTicketDetailsById(@RequestParam String ticketId) {
        Response<GetTicketDetailsResponseModel> getTicketDetailsResponse = apiTranslator().getSupportSubTranslator().getTicketDetailsById(ticketId);
        if(!getTicketDetailsResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getTicketDetailsResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, "", getTicketDetailsResponse.getItem()));
    }

    @GetMapping(ApiRoutes.SupportSubRoute.GET_ATTACHMENT_FROM_TICKET)
    public ResponseEntity<JsonResponse<Map<String, String>>> getAttachmentFromTicket(@RequestParam String ticketId) {
        Response<Map<String, String>> getAttachmentFromTicketResponse = apiTranslator().getSupportSubTranslator().getAttachmentFromTicket(ticketId);
        if(!getAttachmentFromTicketResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getAttachmentFromTicketResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, getAttachmentFromTicketResponse.getMessage(), getAttachmentFromTicketResponse.getItem()));
    }

    @GetMapping(ApiRoutes.SupportSubRoute.GET_COMMENTS_FROM_TICKET)
    public ResponseEntity<JsonResponse<GetCommentsResponseModel>> getCommentsFromTicket(@RequestParam String ticketId) {
        Response<GetCommentsResponseModel> getCommentsFromTicketResponse = apiTranslator().getSupportSubTranslator().getCommentsFromTicket(ticketId);
        if(!getCommentsFromTicketResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getCommentsFromTicketResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, getCommentsFromTicketResponse.getMessage(), getCommentsFromTicketResponse.getItem()));
    }

    @PutMapping(ApiRoutes.SupportSubRoute.CREATE_TICKET)
    public ResponseEntity<JsonResponse<CreateTicketResponseModel>> createTicket(@RequestBody SupportRequestModel supportRequestModel) {
        Response<CreateTicketResponseModel> createTicketResponse = apiTranslator().getSupportSubTranslator().createTicket(supportRequestModel);
        if(!createTicketResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createTicketResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Support.SUPPORT_INDEX, createTicketResponse.getMessage()));
    }

    @DeleteMapping(ApiRoutes.SupportSubRoute.DELETE_COMMENT)
    public ResponseEntity<JsonResponse<Boolean>> deleteComment(@RequestParam String ticketId, @RequestParam String commentId) {
        Response<Boolean> deleteCommentResponse = apiTranslator().getSupportSubTranslator().deleteComment(ticketId, commentId);
        if(!deleteCommentResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, deleteCommentResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Support.EDIT_SUPPORT + "?ticketId=" + ticketId, ""));
    }

    @PutMapping(ApiRoutes.SupportSubRoute.ADD_COMMENT)
    public ResponseEntity<JsonResponse<AddCommentResponseModel>> addComment(@RequestParam String ticketId, @RequestBody SupportRequestModel supportRequestModel) {
        Response<AddCommentResponseModel> addCommentResponse = apiTranslator().getSupportSubTranslator().addComment(ticketId, supportRequestModel);
        if(!addCommentResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, addCommentResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Support.EDIT_SUPPORT + "?ticketId=" + ticketId, ""));
    }

    @PostMapping(ApiRoutes.SupportSubRoute.EDIT_COMMENT)
    public ResponseEntity<JsonResponse<Boolean>> editComment(@RequestParam String ticketId, @RequestParam String commentId, @RequestBody SupportRequestModel supportRequestModel) {
        Response<Boolean> editCommentResponse = apiTranslator().getSupportSubTranslator().editComment(ticketId, commentId, supportRequestModel);
        if(!editCommentResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, editCommentResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Support.EDIT_SUPPORT + "?ticketId=" + ticketId, ""));
    }

    @PostMapping(ApiRoutes.SupportSubRoute.EDIT_TICKET)
    public ResponseEntity<JsonResponse<Boolean>> editTicket(@RequestParam String ticketId, @RequestBody SupportRequestModel supportRequestModel) {
        Response<Boolean> editTicketResponse = apiTranslator().getSupportSubTranslator().editTicket(ticketId, supportRequestModel);
        if(!editTicketResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, editTicketResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Support.SUPPORT_INDEX, editTicketResponse.getMessage()));
    }

    @DeleteMapping(ApiRoutes.SupportSubRoute.DELETE_TICKET)
    public ResponseEntity<JsonResponse<Boolean>> deleteTicket(@RequestParam String ticketId) {
        Response<Boolean> deleteTicketResponse = apiTranslator().getSupportSubTranslator().deleteTicket(ticketId);
        if(!deleteTicketResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, deleteTicketResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Support.SUPPORT_INDEX, deleteTicketResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.SupportSubRoute.GET_ATTACHMENT_BY_ID + "/{attachmentId}")
    public ResponseEntity<Void> getAttachmentById(@PathVariable String attachmentId) {
        JiraHelper jiraHelper = new JiraHelper(
                getCurrentCarrier().getJiraProjectUrl(),
                getCurrentCarrier().getJiraUserName(),
                getCurrentCarrier().getJiraPassword(),
                getCurrentCarrier().getJiraProjectKey()
        );

        Response<String> getAttachmentResponse = jiraHelper.getAttachment(attachmentId);
        if(!getAttachmentResponse.isSuccess()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

        // Redirect to the actual attachment URL
        String attachmentUrl = getAttachmentResponse.getItem();
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header("Location", attachmentUrl)
                .build();
    }
}