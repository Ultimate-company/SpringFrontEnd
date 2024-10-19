import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import React from "react";
import {CustomModalProps} from "Frontend/components/OtherComponents/CustomModal";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";
import Dropdown from "Frontend/components/FormInputs/Dropdown";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import {
    AvailableCourierCompany,
    SelectedCourier,
} from "Frontend/api/Models/CarrierModels/SalesOrder";
import {formatDate} from "Frontend/components/commonHelperFunctions";
import DateInput from "Frontend/components/FormInputs/DateInput";

const shippingEstimateGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.pickupLocationResponseModel.pickupLocation.pickupLocationId;
        }
    },
    {
        field: "pickupLocationAddress",
        headerName: "Pickup Location Address",
        width: 800,
        valueGetter: (value, row) => {
            return row.pickupLocationResponseModel.address.line1 + " " +
                row.pickupLocationResponseModel.address.line2 + ", " +
                row.pickupLocationResponseModel.address.city + ", " +
                row.pickupLocationResponseModel.address.state + ", " +
                row.pickupLocationResponseModel.address.zipCode;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            length={100}
            value={params.value}
        />
    }
];

const getUpdatedSelectedCouriers = (selectedCouriers: SelectedCourier[], newCourier: SelectedCourier) :  SelectedCourier[] => {
    const existingIndex = selectedCouriers.findIndex(
        courier => courier.pickupLocationId === newCourier.pickupLocationId
    );
    if (existingIndex !== -1) {
        // Update the existing record
        const updatedCouriers = [...selectedCouriers];
        updatedCouriers[existingIndex] = newCourier;
        return updatedCouriers;
    } else {
        // Add a new record
        return [...selectedCouriers, newCourier];
    }
}

export const initShippingEstimateGridColumns = async (modalProps: CustomModalProps,
                                                      setModalOpen: (modalProps: CustomModalProps) => void,
                                                      rowIdDropdownValueMapping:Map<number, string>,
                                                      setRowIdDropdownValueMapping: (rowIdDropdownValueMapping: Map<number, string>) => void,
                                                      rowIdPickupDateMapping:Map<number, string>,
                                                      setRowIdPickupDateMapping: (rowIdDropdownValueMapping: Map<number, string>) => void,
                                                      selectedCouriers: SelectedCourier[],
                                                      setSelectedCouriers: (selectedCourier: SelectedCourier[]) => void) => {
    let columns = [...shippingEstimateGridColumns];

    columns.push({
        field: "availableCourier",
        headerName: "Available Courier",
        width: 300,
        valueGetter: (value, row) => {
            let data: DataItem[] = [];
            for (let i = 0; i < row.data.available_courier_companies.length; i++) {
                data.push({
                    value: row.data.available_courier_companies[i].courier_company_id,
                    key: row.data.available_courier_companies[i].courier_name,
                    title: row.data.available_courier_companies[i].courier_name,
                });
            }
            return data;
        },
        renderCell: (params: GridRenderCellParams) => {
            return (
                <Dropdown
                    disabled={false}
                    required={true}
                    fullWidth={true}
                    label=""
                    value={rowIdDropdownValueMapping.get(params.id as number)}
                    name={"dropdownForRowId_" + params.id}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        let localRowIdDropdownValueMapping = rowIdDropdownValueMapping;
                        localRowIdDropdownValueMapping.set(params.id as number, event.target.value);
                        setRowIdDropdownValueMapping(localRowIdDropdownValueMapping);

                        // set the selected couriers to send it to the api
                        let updatedSelectedCouriers : SelectedCourier[] = getUpdatedSelectedCouriers(selectedCouriers, {
                            pickupLocationId: params.id as number,
                            availableCourierId: event.target.value,
                            shipmentPickupDate:  new Date(rowIdPickupDateMapping.get(params.id as number) as string)
                        } as SelectedCourier);
                        setSelectedCouriers(updatedSelectedCouriers);
                    }}
                    data={params.value}
                />
            );
        }
    });

    columns.push({
        field: "pickupDate",
        headerName: "Schedule Pickup Date",
        width: 300,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <DateInput
                    disabled={false}
                    required={true}
                    fullWidth={true}
                    label=""
                    name={"dateForRowId_" + params.id}
                    value={formatDate(rowIdPickupDateMapping.get(params.id as number) as string, "yyyy/mm/dd")}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        rowIdPickupDateMapping.set(params.id as number, event.target.value);
                        setRowIdPickupDateMapping(new Map(rowIdPickupDateMapping));

                        // set the selected couriers to send it to the api
                        let updatedSelectedCouriers : SelectedCourier[] = getUpdatedSelectedCouriers(selectedCouriers, {
                            pickupLocationId: params.id as number,
                            shipmentPickupDate: new Date(event.target.value),
                            availableCourierId:  rowIdDropdownValueMapping.get(params.id as number)
                        } as SelectedCourier);
                        setSelectedCouriers(updatedSelectedCouriers);
                    }}
                />
            );
        }
    });

    columns.push({
        filterable: false,
        field: "details",
        headerName: "Details",
        width: 150,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <div>
                    <>
                        <a
                            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                            onClick={() => setModalOpen({
                                ...modalProps,
                                open: true,
                                headerText: "Courier Details",
                                bodyText: params.row.data.available_courier_companies
                                    .find((courier: AvailableCourierCompany) => courier.courier_company_id?.toString() == rowIdDropdownValueMapping.get(params.id as number)?.toString()),
                                isJson: true
                            })}
                        >
                            View
                        </a>
                    </>
                </div>
            )
        },
    });
    return columns;
}