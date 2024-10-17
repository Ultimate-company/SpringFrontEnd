import {StyledDataGrid} from "Frontend/components/Datagrid/CustomDataGrid";
import React from "react";
import {GridColDef, GridColumnVisibilityModel, GridRowSelectionModel, GridToolbar} from "@mui/x-data-grid";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {salesOrderApi} from "Frontend/api/ApiCalls";
import {GetPaymentMode} from "Frontend/api/Models/CarrierModels/Payment";
import {SelectedCourier, ShippingOptionsResponseModel} from "Frontend/api/Models/CarrierModels/SalesOrder";
import {initShippingEstimateGridColumns} from "Frontend/api/Models/DataGridModels/ShippingEstimateGridColumns";
import {useOutletContext} from "react-router-dom";
import {CustomModalProps} from "Frontend/components/OtherComponents/CustomModal";
import {CustomPaginationForGrid} from "Frontend/components/Datagrid/CustomPaginationForGrid";

interface AvailableCourierSelectionGridProps {
    pickupZipCodeProductIdMapping: Map<string, number[]>;
    zipCode: string;
    paymentMode: string;
    isEdit: boolean;

    selectedCouriers: SelectedCourier[];
    setSelectedCouriers: (selectedCourier: SelectedCourier[]) => void;

    customModalProps: CustomModalProps;
    setCustomModalProps: (customModalProps: CustomModalProps) => void;
}

export interface ShippingEstimateResponseModel {
    id: number;
    pickupLocationAddress: string;
    availableCourier: ShippingOptionsResponseModel;
}

const AvailableCourierSelectionGrid = (props: AvailableCourierSelectionGridProps) => {
    const [setLoading] = useOutletContext<any>();

    // state variables
    const [shippingOptionsResponseModels, setShippingOptionsResponseModels] = React.useState<ShippingOptionsResponseModel[]>([]);
    const [shippingEstimateGridColumns, setShippingEstimateGridColumns] = React.useState<GridColDef[]>([]);
    const [shippingEstimateColumnVisibilityModel, setShippingEstimateColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
        });

    // dropdown mapping for each row id
    const [rowIdDropdownValueMapping, setRowIdDropdownValueMapping] = React.useState<Map<number, string>>(new Map<number, string>());
    const [rowIdPickupDateMapping, setRowIdPickupDateMapping] = React.useState<Map<number, string>>(new Map<number, string>());

    React.useEffect(() => {
        salesOrderApi(setLoading).getShippingEstimate(props.pickupZipCodeProductIdMapping, props.zipCode, !(GetPaymentMode(props.paymentMode) == 3))
            .then((shippingOptionsResponseModels : ShippingOptionsResponseModel[]) => {
                setShippingOptionsResponseModels(shippingOptionsResponseModels);

                let localRowIdDropdownValueMapping: Map<number, string> = new Map<number, string>();
                let localRowIdPickupDateMapping: Map<number, string> = new Map<number, string>();
                for (var x = 0; x < shippingOptionsResponseModels.length; x++) {
                    localRowIdDropdownValueMapping.set(shippingOptionsResponseModels[x].pickupLocationResponseModel.pickupLocation.pickupLocationId as number,
                        shippingOptionsResponseModels[x].data.available_courier_companies.length > 0 ? shippingOptionsResponseModels[x].data.available_courier_companies[0].courier_company_id : "");
                    localRowIdPickupDateMapping.set(shippingOptionsResponseModels[x].pickupLocationResponseModel.pickupLocation.pickupLocationId as number,
                        new Date().toString());
                }
                setRowIdDropdownValueMapping(localRowIdDropdownValueMapping);
                setRowIdPickupDateMapping(localRowIdPickupDateMapping);

                initShippingEstimateGridColumns(props.customModalProps, props.setCustomModalProps,
                    localRowIdDropdownValueMapping,
                    setRowIdDropdownValueMapping,
                    localRowIdPickupDateMapping,
                    setRowIdPickupDateMapping,
                    props.selectedCouriers,
                    props.setSelectedCouriers
                    ).then((columns: GridColDef[]) => {
                    setShippingEstimateGridColumns(columns);
                });
            });
    }, []);

    React.useEffect(() => {
        initShippingEstimateGridColumns(
            props.customModalProps,
            props.setCustomModalProps,
            rowIdDropdownValueMapping,
            setRowIdDropdownValueMapping,
            rowIdPickupDateMapping,
            setRowIdPickupDateMapping,
            props.selectedCouriers,
            props.setSelectedCouriers
        ).then((columns: GridColDef[]) => {
            setShippingEstimateGridColumns(columns);
        });
    }, [rowIdPickupDateMapping]);

    return (
        <StyledDataGrid
            rowHeight={80}
            disableMultipleRowSelection={true}
            disableRowSelectionOnClick={true}
            pageSizeOptions={[10, 25, 100]}
            initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
            }}
            onColumnVisibilityModelChange={React.useCallback((newModel: GridColumnVisibilityModel) => {
                setShippingEstimateColumnVisibilityModel(newModel);
            }, [shippingEstimateColumnVisibilityModel])}
            rows={shippingOptionsResponseModels}
            getRowId={(row) => row.pickupLocationResponseModel.pickupLocation.pickupLocationId}
            columns={shippingEstimateGridColumns}
            columnVisibilityModel={shippingEstimateColumnVisibilityModel}
            slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: GridToolbar
            }}
        />
    );
}

export default AvailableCourierSelectionGrid;