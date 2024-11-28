package org.example.springfrontend.Controllers;

import org.apache.commons.lang3.tuple.Pair;
import org.example.ApiRoutes;
import org.example.CommonHelpers.ExcelHelper;
import org.example.CommonHelpers.JsonResponse;
import org.example.Constants.BulkInsertTypes;
import org.example.Models.CommunicationModels.CarrierModels.Package;
import org.example.Models.CommunicationModels.CarrierModels.Product;
import org.example.Models.CommunicationModels.CarrierModels.Promo;
import org.example.Models.RequestModels.ApiRequestModels.*;
import org.example.Models.ResponseModels.Response;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.example.CommonHelpers.ExcelHelper.*;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.BULK)
public class BulkController extends BaseController {
    @GetMapping(ApiRoutes.BulkSubRoute.GENERATE_BULK_IMPORT_EXCEL)
    public ResponseEntity<byte[]> generateBulkImportExcel(@RequestParam String bulkAddType) throws IOException {
        // Create the main map
        Map<String, Map<String, Boolean>> fieldMap = new LinkedHashMap<>();

        switch (bulkAddType) {
            case "User" -> populateFieldMap(UsersRequestModel.class, fieldMap);
            case "Lead" -> populateFieldMap(LeadRequestModel.class, fieldMap);
            case "Message" -> populateFieldMap(MessageRequestModel.class, fieldMap);
            case "Package" -> populateFieldMap(Package.class, fieldMap);
            case "PickupLocation" -> {
                populateFieldMap(PickupLocationRequestModel.class, fieldMap);
                fieldMap.get("address").put("emailAtAddress", true);
            }
            case "Product" -> populateFieldMap(ProductRequestModel.class, fieldMap);
            case "Promo" -> populateFieldMap(Promo.class, fieldMap);
            case "PurchaseOrder" -> populateFieldMap(PurchaseOrderRequestModel.class, fieldMap);
            //case "SalesOrder" -> {}
            //case "Support" -> populateFieldMap(SupportRequestModel.class, fieldMap);
            case "UserGroup" -> populateFieldMap(UserGroupRequestModel.class, fieldMap);
            case "WebTemplate" -> populateFieldMap(WebTemplateRequestModel.class, fieldMap);
        }

        byte[] generateBulkImportUserExcel = createBulkImportModelTemplate(fieldMap, "Bulk Import Users");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Bulk_Import_"+bulkAddType+".xlsx\"");

        // Return the image bytes with headers and 200 OK status
        return new ResponseEntity<>(generateBulkImportUserExcel, headers, HttpStatus.OK);
    }

    @PutMapping(ApiRoutes.BulkSubRoute.BULK_INSERT)
    public ResponseEntity<JsonResponse<Boolean>> bulkInsert(
            @RequestParam String bulkAddType,
            @RequestParam("file") MultipartFile file) throws Exception
    {
        // 1. Check if the file is of valid type
        Pair<Boolean, String> validateFileType = ExcelHelper.checkIfFileIsExcelType(file);
        if(!validateFileType.getKey()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, validateFileType.getValue(), false));
        }

        // 2. Parse the file and get columns
        List<Map<String, String>> fileData = ExcelHelper.parseExcel(file);
        if (fileData.isEmpty() || fileData.size() < 2) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error,
                    "File is empty or has invalid format.", false));
        }

        // 3. Use the first two rows as headers
        Class<?> modelClass;
        String bulkInsertType;

        // Determine the model class and bulkInsertType dynamically based on bulkAddType
        switch (bulkAddType) {
            case "User" -> {
                modelClass = UsersRequestModel.class;
                bulkInsertType = BulkInsertTypes.USER;
            }
            case "Lead" -> {
                modelClass = LeadRequestModel.class;
                bulkInsertType = BulkInsertTypes.LEAD;
            }
            case "Message" -> {
                modelClass = MessageRequestModel.class;
                bulkInsertType = BulkInsertTypes.MESSAGE;
            }
            case "Package" -> {
                modelClass = Package.class;
                bulkInsertType = BulkInsertTypes.PACKAGE;
            }
            case "PickupLocation" -> {
                modelClass = PickupLocationRequestModel.class;
                bulkInsertType = BulkInsertTypes.PICKUP_LOCATION;
            }
            case "Promo" -> {
                modelClass = Promo.class;
                bulkInsertType = BulkInsertTypes.PROMO;
            }
            case "PurchaseOrder" -> {
                modelClass = PurchaseOrderRequestModel.class;
                bulkInsertType = BulkInsertTypes.PURCHASE_ORDER;
            }
            case "UserGroup" -> {
                modelClass = UserGroupRequestModel.class;
                bulkInsertType = BulkInsertTypes.USER_GROUP;
            }
            case "WebTemplate" -> {
                modelClass = WebTemplateRequestModel.class;
                bulkInsertType = BulkInsertTypes.WEB_TEMPLATE;
            }
            case "Product" -> {
                modelClass = ProductRequestModel.class;
                bulkInsertType = BulkInsertTypes.PRODUCT;
            }

            default -> throw new IllegalArgumentException("Unsupported bulkAddType: " + bulkAddType);
        }

        // 4. Read the data directly into the model
        List<Object> requestModels = new ArrayList<>();
        Constructor<?> constructor = modelClass.getDeclaredConstructor();

        for (Map<String, String> data : fileData) {
            Object modelInstance = constructor.newInstance();
            populateObjectFields(modelInstance, data);
            requestModels.add(modelInstance);
        }

        // Explicit casting for Product as the api accepts product and not product request model
        if (bulkAddType.equals("Product")) {
            // Map each entry from Object -> ProductRequestModel -> Product -> Object
            requestModels = requestModels.stream()
                    .map(requestModel -> ((ProductRequestModel) requestModel).getProduct())  // ProductRequestModel -> Product
                    .map(product -> (Object) product)  // Product -> Object
                    .collect(Collectors.toList());  // Collect the results back into a List<Object>
        }

        // 5. Call the API to insert the data
        Response<Boolean> bulkAddResponse = apiTranslator().getBulkSubTranslator().bulkAdd(bulkInsertType, requestModels);
        if (!bulkAddResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, bulkAddResponse.getMessage(), false));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, "Bulk import in progress! \n" +
                "We will send you an email with the report once it is completed. Thank you for your patience!", false));
    }
}