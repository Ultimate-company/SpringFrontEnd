package org.example.springfrontend.Controllers;

import jakarta.servlet.http.HttpSession;
import org.example.ApiRoutes;
import org.example.CommonHelpers.JsonResponse;
import org.example.Models.CommunicationModels.CarrierModels.Package;
import org.example.Models.RequestModels.GridRequestModels.PaginationBaseRequestModel;
import org.example.Models.ResponseModels.ApiResponseModels.PaginationBaseResponseModel;
import org.example.Models.ResponseModels.Response;
import org.example.springfrontend.Classes.Endpoints;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.PACKAGE)
public class PackageController extends BaseController {
    // Session Variables
    private boolean isIncludeDeletedSession() {
        HttpSession httpSession = getCurrentSession();
        if(httpSession.getAttribute("Package_IncludeDeleted") != null) {
            return (boolean) httpSession.getAttribute("Package_IncludeDeleted");
        }
        return false;
    }
    private void setIncludeDeletedSession(boolean value) {
        HttpSession httpSession = getCurrentSession();
        httpSession.setAttribute("Package_IncludeDeleted", value);
    }

    // Endpoints
    @PostMapping(ApiRoutes.PackageSubRoute.SET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> setIncludeDeleted() {
        setIncludeDeletedSession(!isIncludeDeletedSession());
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, null));
    }

    @GetMapping(ApiRoutes.PackageSubRoute.GET_INCLUDE_DELETED)
    public ResponseEntity<JsonResponse<Boolean>> getIncludeDeleted() {
        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, isIncludeDeletedSession()));
    }

    @PostMapping(ApiRoutes.PackageSubRoute.GET_PACKAGES_IN_BATCHES)
    public ResponseEntity<JsonResponse<PaginationBaseResponseModel<Package>>> getPackagesInBatches(@RequestBody PaginationBaseRequestModel paginationBaseRequestModel) {
        paginationBaseRequestModel.setIncludeDeleted(isIncludeDeletedSession());

        Response<PaginationBaseResponseModel<Package>> getPackagesInBatches = apiTranslator().getPackageSubTranslator().getPackagesInBatches(paginationBaseRequestModel);
        if (!getPackagesInBatches.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPackagesInBatches.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getPackagesInBatches.getItem()));
    }

    @DeleteMapping(ApiRoutes.PackageSubRoute.TOGGLE_PACKAGE)
    public ResponseEntity<JsonResponse<Boolean>> togglePackage(@RequestParam long packageId) {
        Response<Boolean> togglePackageResponse = apiTranslator().getPackageSubTranslator().togglePackage(packageId);
        if (!togglePackageResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, togglePackageResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, togglePackageResponse.getItem()));
    }

    @PutMapping(ApiRoutes.PackageSubRoute.CREATE_PACKAGE)
    public ResponseEntity<JsonResponse<Long>> createPackage(@RequestBody Package _package) {
        Response<Long> createPackageResponse = apiTranslator().getPackageSubTranslator().createPackage(_package);
        if (!createPackageResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, createPackageResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Package.PACKAGE_INDEX, createPackageResponse.getMessage()));
    }

    @GetMapping(ApiRoutes.PackageSubRoute.GET_PACKAGE_BY_ID)
    public ResponseEntity<JsonResponse<Package>> getPackageById(@RequestParam long packageId) {
        Response<Package> getPackageByIdResponse = apiTranslator().getPackageSubTranslator().getPackageById(packageId);
        if (!getPackageByIdResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, getPackageByIdResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Success, null, getPackageByIdResponse.getItem()));
    }

    @PostMapping(ApiRoutes.PackageSubRoute.UPDATE_PACKAGE)
    public ResponseEntity<JsonResponse<Long>> updatePackage(@RequestBody Package _package) {
        Response<Long> updatePackageResponse = apiTranslator().getPackageSubTranslator().updatePackage(_package);
        if (!updatePackageResponse.isSuccess()) {
            return ResponseEntity.ok(new JsonResponse<>(JsonResponse.JsonType.Error, updatePackageResponse.getMessage(), null));
        }

        return ResponseEntity.ok(new JsonResponse<>(Endpoints.Package.PACKAGE_INDEX, updatePackageResponse.getMessage()));
    }
}