package org.example.springfrontend.Controllers;

import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.Todo;
import org.example.Models.ResponseModels.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.TODO)
public class TodoController extends BaseController {
    @GetMapping(ApiRoutes.TodoSubRoute.GET_ITEMS)
    public ResponseEntity<JsonResponse<List<Todo>>> getItems() {
        Response<List<Todo>> getTodoItemsResponse = apiTranslator().getTodoListSubTranslator().getItems();
        if (!getTodoItemsResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getTodoItemsResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getTodoItemsResponse.getItem()));
    }

    @PutMapping(ApiRoutes.TodoSubRoute.ADD_ITEM)
    public ResponseEntity<JsonResponse<Long>> addItem(@RequestBody Todo todo) {
        Response<Long> getAddItemResponse = apiTranslator().getTodoListSubTranslator().addTodo(todo);
        if (!getAddItemResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getAddItemResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getAddItemResponse.getItem()));
    }

    @DeleteMapping(ApiRoutes.TodoSubRoute.DELETE_ITEM)
    public ResponseEntity<JsonResponse<Boolean>> deleteItem(@RequestParam long todoId ) {
        Response<Boolean> getDeleteItemResponse = apiTranslator().getTodoListSubTranslator().deleteTodo(todoId);
        if (!getDeleteItemResponse.isSuccess() || !getDeleteItemResponse.getItem()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getDeleteItemResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, true));
    }

    @PostMapping(ApiRoutes.TodoSubRoute.TOGGLE_DONE)
    public ResponseEntity<JsonResponse<Boolean>> toggleDone(@RequestParam long todoId ) {
        Response<Boolean> getToggleDoneResponse = apiTranslator().getTodoListSubTranslator().toggleTodo(todoId);
        if (!getToggleDoneResponse.isSuccess() || !getToggleDoneResponse.getItem()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getToggleDoneResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, true));
    }
}