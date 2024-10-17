package org.example.springfrontend.Controllers;

import com.itextpdf.text.DocumentException;
import freemarker.template.TemplateException;
import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.CommonHelpers.ShippingHelper;
import org.example.Models.CommunicationModels.CarrierModels.*;
import org.example.Models.CommunicationModels.CarrierModels.Package;
import org.example.Models.Enums.SalesOrderStatus;
import org.example.Models.RequestModels.ApiRequestModels.PurchaseOrderRequestModel;
import org.example.Models.RequestModels.ApiRequestModels.SalesOrderRequestModel;
import org.example.Models.RequestModels.GridRequestModels.GetSalesOrdersRequestModel;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.PickupLocationResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.ProductsResponseModel;
import org.example.Models.ResponseModels.ApiResponseModels.SalesOrderResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.Models.ResponseModels.ShippingResponseModels.PackagingEstimateResponseModel;
import org.example.Models.ResponseModels.ShippingResponseModels.ShippingOptionsResponseModel;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.SALES_ORDER)
public class SalesOrderController extends BaseController{
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("SalesOrder_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("SalesOrder_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("SalesOrder_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.SalesOrderSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.SalesOrderSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @PostMapping(ApiRoutes.SalesOrderSubRoute.GET_SHIPPING_ESTIMATE)
    public ResponseEntity<JsonResponse<List<ShippingOptionsResponseModel>>> getShippingEstimate(
            @RequestBody Map<String, List<Long>> pickupZipCodeProductIdMapping,
            @RequestParam String deliveryZipCode,
            @RequestParam boolean isOrderPrePaid) {

        List<ShippingOptionsResponseModel> result = new ArrayList<>();
        for(Map.Entry<String, List<Long>> pickupZipCodeProductId : pickupZipCodeProductIdMapping.entrySet()) {
            ShippingHelper shippingHelper = new ShippingHelper(getCurrentCarrier().getShipRocketEmail(), getCurrentCarrier().getShipRocketPassword());
            Response<String> shipRocketTokenResponse = shippingHelper.getToken();
            if(!shipRocketTokenResponse.isSuccess()) {
                return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, shipRocketTokenResponse.getMessage(), null));
            }

            Response<List<ProductsResponseModel>> getProductDetailsByIdsResponse = apiTranslator().getProductSubTranslator().getProductDetailsByIds(pickupZipCodeProductId.getValue());
            if(!getProductDetailsByIdsResponse.isSuccess()) {
                return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getProductDetailsByIdsResponse.getMessage(), null));
            }

            double weightOfOrderInKgs = 0;
            for(ProductsResponseModel productsResponseModel : getProductDetailsByIdsResponse.getItem()) {
                Product product = productsResponseModel.getProduct();
                weightOfOrderInKgs += product.getWeightKgs();
            }

            Response<ShippingOptionsResponseModel> getAvailableShippingOptionsResponse = shippingHelper.getAvailableShippingOptions(shipRocketTokenResponse.getItem(),
                    pickupZipCodeProductId.getKey().split("-")[0],
                    deliveryZipCode,
                    isOrderPrePaid,
                    Double.toString(weightOfOrderInKgs));

            if(!getAvailableShippingOptionsResponse.isSuccess()) {
                return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getAvailableShippingOptionsResponse.getMessage(), null));
            }

            Response<PickupLocationResponseModel> pickupLocationResponse = apiTranslator().getPickupLocationSubTranslator().getPickupLocationById(Long.parseLong(pickupZipCodeProductId.getKey().split("-")[1]));
            if(!pickupLocationResponse.isSuccess()) {
                return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, pickupLocationResponse.getMessage(), null));
            }

            getAvailableShippingOptionsResponse.getItem().setPickupLocationResponseModel(pickupLocationResponse.getItem());
            result.add(getAvailableShippingOptionsResponse.getItem());
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, "Success", result));
    }

    @PostMapping(ApiRoutes.SalesOrderSubRoute.GET_PACKAGING_ESTIMATE)
    public ResponseEntity<JsonResponse<List<PackagingEstimateResponseModel>>> getPackagingEstimate(@RequestBody Map<Long, Integer> productIdQuantityMapping) {
        Response<List<Package>> getAllPackagesInSystemResponse = apiTranslator().getPackageSubTranslator().getAllPackagesInSystem();
        if(!getAllPackagesInSystemResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getAllPackagesInSystemResponse.getMessage(), null));
        }

        Response<List<ProductsResponseModel>> getProductDetailsByIdsResponse = apiTranslator().getProductSubTranslator().getProductDetailsByIds(productIdQuantityMapping.keySet().stream().toList());
        if(!getProductDetailsByIdsResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getProductDetailsByIdsResponse.getMessage(), null));
        }

        Map<Product, Integer> productQuantityMappings = getProductDetailsByIdsResponse.getItem().stream()
                .collect(Collectors.toMap(
                        ProductsResponseModel::getProduct,
                        p -> productIdQuantityMapping.get(p.getProduct().getProductId())
                ));

        // Group by pickup location Id
        List<Map<Product, Integer>> groupedMaps = productQuantityMappings.entrySet().stream()
                .collect(Collectors.groupingBy(entry -> entry.getKey().getPickupLocationId()))
                .values().stream()
                .map(entries -> {
                    Map<Product, Integer> map = new HashMap<>();
                    for (Map.Entry<Product, Integer> entry : entries) {
                        map.put(entry.getKey(), entry.getValue());
                    }
                    return map;
                })
                .toList();
        List<PackagingEstimateResponseModel> packagingEstimateResponseModels = new ArrayList<>();
        ShippingHelper shippingHelper = new ShippingHelper(getCurrentCarrier().getShipRocketEmail(), getCurrentCarrier().getShipRocketPassword());

        try{
            for(Map<Product, Integer> productQuantityMapping : groupedMaps) {
                List<PackagingEstimateResponseModel> packagingEstimateResponseModels1 = shippingHelper.getPackagingEstimate(productQuantityMapping, getAllPackagesInSystemResponse.getItem());
                Response<PickupLocationResponseModel> pickupLocationResponse = apiTranslator().getPickupLocationSubTranslator().getPickupLocationById(productQuantityMapping
                        .entrySet()
                        .stream()
                        .findFirst()
                        .get()
                        .getKey()
                        .getPickupLocationId());

                if(!pickupLocationResponse.isSuccess()) {
                    return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, pickupLocationResponse.getMessage(), null));
                }

                packagingEstimateResponseModels1.forEach(packagingEstimateResponseModel -> packagingEstimateResponseModel.setPickupLocationResponseModel(pickupLocationResponse
                        .getItem()));
                packagingEstimateResponseModels.addAll(packagingEstimateResponseModels1);
            }
            int i = 1;
            for(PackagingEstimateResponseModel packagingEstimateResponseModel : packagingEstimateResponseModels) {

                // get and set the package details
                Response<Package> getPackageByIdResponse = apiTranslator().getPackageSubTranslator().getPackageById(packagingEstimateResponseModel.getPackageId());
                if(!getPackageByIdResponse.isSuccess()) {
                    return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPackageByIdResponse.getMessage(), null));
                }
                packagingEstimateResponseModel.set_package(getPackageByIdResponse.getItem());

                // get and set the productId Details
                packagingEstimateResponseModel.setProducts(getProductDetailsByIdsResponse.getItem().stream()
                                .map(ProductsResponseModel::getProduct)
                        .filter(product -> packagingEstimateResponseModel.getProductIds().contains(product.getProductId()))
                        .toList());
                packagingEstimateResponseModel.setSerialNo(i++);
            }

            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success,  "Successfully got the packing estimates.", packagingEstimateResponseModels));
        }
        catch (Exception ex){
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, ex.getMessage(), null));
        }
    }

    @DeleteMapping(ApiRoutes.SalesOrderSubRoute.CANCEL_SALES_ORDER)
    public ResponseEntity<JsonResponse<Boolean>> cancelSalesOrder(@RequestParam long salesOrderId) {
        Response<Boolean> cancelSalesOrderResponse = apiTranslator().getSalesOrderSubTranslator().cancelSalesOrder(salesOrderId);
        if(!cancelSalesOrderResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, cancelSalesOrderResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.SalesOrder.SALES_ORDER_INDEX, cancelSalesOrderResponse.getMessage()));
    }

    @PostMapping(ApiRoutes.SalesOrderSubRoute.GET_SALES_ORDERS_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<SalesOrderResponseModel>>> getSalesOrdersInBatches(@RequestBody GetSalesOrdersRequestModel getSalesOrdersRequestModel) {
        getSalesOrdersRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<SalesOrderResponseModel>> getSalesOrderInBatchesResponse = apiTranslator().getSalesOrderSubTranslator().getSalesOrdersInBatches(getSalesOrdersRequestModel);
        if (!getSalesOrderInBatchesResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getSalesOrderInBatchesResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getSalesOrderInBatchesResponse.getItem()));
    }

    @DeleteMapping(ApiRoutes.SalesOrderSubRoute.TOGGLE_SALES_ORDER)
    public ResponseEntity<JsonResponse<Boolean>> toggleSalesOrder(@RequestParam long salesOrderId) {
        Response<Boolean> toggleSalesOrderResponse = apiTranslator().getSalesOrderSubTranslator().toggleSalesOrder(salesOrderId);
        if (!toggleSalesOrderResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, toggleSalesOrderResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, toggleSalesOrderResponse.getItem()));
    }

    @PostMapping(ApiRoutes.SalesOrderSubRoute.GET_SALES_ORDER_PDF)
    public void getSalesOrderPdf(@RequestParam long salesOrderId) throws TemplateException, DocumentException, IOException {
        Response<byte[]> getSalesOrderPdfResponse = apiTranslator().getSalesOrderSubTranslator().getSalesOrderPDF(salesOrderId);
    }

    @PutMapping(ApiRoutes.SalesOrderSubRoute.CREATE_SALES_ORDER)
    public ResponseEntity<JsonResponse<Long>> createSalesOrder(@RequestBody SalesOrderRequestModel salesOrderRequestModel) throws Exception {
        Response<Long> createSalesOrderResponse = apiTranslator().getSalesOrderSubTranslator().createSalesOrder(salesOrderRequestModel);
        if (!createSalesOrderResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createSalesOrderResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.SalesOrder.SALES_ORDER_INDEX, createSalesOrderResponse.getMessage()));
    }

    @PostMapping(ApiRoutes.SalesOrderSubRoute.UPDATE_SALES_ORDER)
    public ResponseEntity<JsonResponse<Long>> updateSalesOrder(@RequestBody SalesOrderRequestModel salesOrderRequestModel) {
        Response<Long> updateSalesOrderResponse = apiTranslator().getSalesOrderSubTranslator().updateSalesOrder(salesOrderRequestModel);
        if (!updateSalesOrderResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateSalesOrderResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.SalesOrder.SALES_ORDER_INDEX, updateSalesOrderResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.SalesOrderSubRoute.GET_SALES_ORDER_BY_ID)
    public ResponseEntity<JsonResponse<SalesOrderResponseModel>> getSalesOrderById(@RequestParam long salesOrderId) {
        Response<SalesOrderResponseModel> getSalesOrderByIdResponse = apiTranslator().getSalesOrderSubTranslator().getSalesOrderDetailsById(salesOrderId);
        if(!getSalesOrderByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getSalesOrderByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, getSalesOrderByIdResponse.getMessage(), getSalesOrderByIdResponse.getItem()));
    }

    @PostMapping(ApiRoutes.SalesOrderSubRoute.UPDATE_CUSTOMER_DELIVERY_ADDRESS)
    public ResponseEntity<JsonResponse<SalesOrderResponseModel>> updateCustomerDeliveryAddress(@RequestParam long salesOrderId, @RequestBody Address address) {
        Response<Boolean> updateCustomerDeliveryAddressResponse = apiTranslator().getSalesOrderSubTranslator().updateCustomerDeliveryAddress(salesOrderId, address);
        if(!updateCustomerDeliveryAddressResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateCustomerDeliveryAddressResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.SalesOrder.SALES_ORDER_INDEX, updateCustomerDeliveryAddressResponse.getMessage()));
    }

    @PostMapping(ApiRoutes.SalesOrderSubRoute.UPDATE_SALES_ORDER_PICKUP_ADDRESS)
    public ResponseEntity<JsonResponse<SalesOrderResponseModel>> updateCustomerDeliveryAddress(@RequestParam long salesOrderId, @RequestParam long shipRocketOrderId, @RequestParam long pickupLocationId) {
        Response<Boolean> updateSalesOrderPickupAddressResponse = apiTranslator().getSalesOrderSubTranslator().updateSalesOrderPickupAddress(salesOrderId, shipRocketOrderId, pickupLocationId);
        if(!updateSalesOrderPickupAddressResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updateSalesOrderPickupAddressResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.SalesOrder.SALES_ORDER_INDEX, updateSalesOrderPickupAddressResponse.getMessage()));
    }
}