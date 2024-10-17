package org.example.springfrontend.Controllers;

import org.example.ApiRoutes;
import org.example.CommonHelpers.HelperUtils;
import org.example.CommonHelpers.JsonResponse;
import org.example.springfrontend.Models.DataModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.DATA)
public class DataController extends BaseController {

    @GetMapping(ApiRoutes.DataSubRoute.GET_STATES)
    public ResponseEntity<JsonResponse<List<DataModel>>> getStates() {
        List<DataModel> dataModels = new ArrayList<>();
        for(String state : HelperUtils.getStatesAndUnionTerritories())
        {
            DataModel dataModel = new DataModel();
            dataModel.setKey(state);
            dataModel.setValue(state);
            dataModel.setTitle(state);

            dataModels.add(dataModel);
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, dataModels));
    }

    @GetMapping(ApiRoutes.DataSubRoute.GET_ROLES)
    public ResponseEntity<JsonResponse<List<DataModel>>> getRoles() {
        List<DataModel> dataModels = new ArrayList<>();
        for(String role : HelperUtils.getRoles())
        {
            DataModel dataModel = new DataModel();
            dataModel.setKey(role);
            dataModel.setValue(role);
            dataModel.setTitle(role);

            dataModels.add(dataModel);
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, dataModels));
    }

    @GetMapping(ApiRoutes.DataSubRoute.GET_LEAD_STATUSES)
    public ResponseEntity<JsonResponse<List<DataModel>>> getLeadStatuses() {
        List<DataModel> dataModels = new ArrayList<>();
        for(String leadStatus : HelperUtils.getLeadStatuses())
        {
            DataModel dataModel = new DataModel();
            dataModel.setKey(leadStatus);
            dataModel.setValue(leadStatus);
            dataModel.setTitle(leadStatus);

            dataModels.add(dataModel);
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, dataModels));
    }

    @GetMapping(ApiRoutes.DataSubRoute.GET_PAYMENT_OPTIONS)
    public ResponseEntity<JsonResponse<TreeMap<String, List<TreeMap<String, String>>>>> getPaymentOptions() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, HelperUtils.getPaymentOptions()));
    }

    @GetMapping(ApiRoutes.DataSubRoute.GET_FILTER_OPTIONS)
    public ResponseEntity<JsonResponse<List<DataModel>>> getFilterOptions() {
        List<DataModel> dataModels = new ArrayList<>();
        for(String filterOption : HelperUtils.getFilterOptions())
        {
            DataModel dataModel = new DataModel();
            dataModel.setKey(filterOption);
            dataModel.setValue(filterOption);
            dataModel.setTitle(filterOption);

            dataModels.add(dataModel);
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, dataModels));
    }

    @GetMapping(ApiRoutes.DataSubRoute.GET_SORT_OPTIONS)
    public ResponseEntity<JsonResponse<List<DataModel>>> getSortOptions() {
        List<DataModel> dataModels = new ArrayList<>();
        for(String sortOption : HelperUtils.getSortOptions())
        {
            DataModel dataModel = new DataModel();
            dataModel.setKey(sortOption);
            dataModel.setValue(sortOption);
            dataModel.setTitle(sortOption);

            dataModels.add(dataModel);
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, dataModels));
    }

    @GetMapping(ApiRoutes.DataSubRoute.GET_STATE_CITY_MAPPING)
    public ResponseEntity<JsonResponse<TreeMap<String, TreeSet<String>>>> getStateCityMappingOptions() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, HelperUtils.getStateCityMappingOptions()));
    }

    @GetMapping(ApiRoutes.DataSubRoute.GET_FONT_STYLES)
    public ResponseEntity<JsonResponse<List<DataModel>>> getFontStyles() {
        List<DataModel> dataModels = new ArrayList<>();
        for(String fontStyle : HelperUtils.getFontStyles())
        {
            DataModel dataModel = new DataModel();
            dataModel.setKey(fontStyle);
            dataModel.setValue(fontStyle);
            dataModel.setTitle(fontStyle);

            dataModels.add(dataModel);
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, dataModels));
    }
}