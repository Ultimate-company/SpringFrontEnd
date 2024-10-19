import {useOutletContext} from "react-router-dom";
import React from "react";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import {Grid} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import {getURLParamValue, isEditMode, isViewMode} from "Frontend/components/commonHelperFunctions";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import {dataApi, purchaseOrderApi} from "Frontend/api/ApiCalls";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import ProductSelectionGrid from "Frontend/components/DataGridsForSelection/ProductSelectionGrid";
import LeadSelectionGrid from "Frontend/components/DataGridsForSelection/LeadSelectionGrid";
import {
    type RichTextEditorRef,
} from "mui-tiptap";
import {PurchaseOrderRequestModel, PurchaseOrderResponseModel} from "Frontend/api/Models/CarrierModels/PurchaseOrder";

const AddOrEditPurchaseOrder = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // state variables for data
    const [states, setStates] = React.useState<DataItem[]>([]);

    // purchase order details
    const [expectedShipmentDate, setExpectedShipmentDate] = React.useState<Date>(new Date());
    const [vendorNumber, setVendorNumber] = React.useState<string>("");
    const [termsAndConditionsHtml, setTermsAndConditionsHtml] = React.useState<string>("");
    const [orderReceipt, setOrderReceipt] =  React.useState<string>("");

    // state variables for address
    const [line1, setLine1] = React.useState<string>("");
    const [line2, setLine2] = React.useState<string>("");
    const [landmark, setLandmark] = React.useState<string>("");
    const [city, setCity] = React.useState<string>("");
    const [state, setState] = React.useState<string>("");
    const [zipCode, setZipCode] = React.useState<string>("");
    const [nameOnAddress, setNameOnAddress] = React.useState<string>("");
    const [phoneOnAddress, setPhoneOnAddress] = React.useState<string>("");

    // misc state variables
    const [notes, setNotes] = React.useState<string>("");

    // selected ids
    const [selectedProductIds, setSelectedProductIds] = React.useState<GridRowSelectionModel>([]);
    const [productIdQuantityMapping, setProductIdQuantityMapping] = React.useState<Map<number, number>>(new Map());
    const [selectedLeadIds, setSelectedLeadIds] = React.useState<GridRowSelectionModel>([]);

    // textarea states
    const rteRef = React.useRef<RichTextEditorRef>(null);

    // local variables
    const isEdit = isEditMode("purchaseOrderId");
    const isView = isViewMode("purchaseOrderId");
    let purchaseOrderId = (isEdit || isView) ? parseInt(getURLParamValue("purchaseOrderId") as string) : null;

    const handleFetchPurchaseOderDetailsById = (purchaseOrderId: number) => {
        purchaseOrderApi(setLoading).getPurchaseOrderById(purchaseOrderId).then((purchaseOrderResponseModel: PurchaseOrderResponseModel) => {
           setExpectedShipmentDate(purchaseOrderResponseModel.purchaseOrder.expectedShipmentDate);
           setOrderReceipt(purchaseOrderResponseModel.purchaseOrder.orderReceipt ?? "");
           setVendorNumber(purchaseOrderResponseModel.purchaseOrder.vendorNumber ?? "");
           setTermsAndConditionsHtml(purchaseOrderResponseModel.purchaseOrder.termsConditionsHtml ?? "");
            const proseMirrorDiv = document.querySelector('.ProseMirror');
            if(proseMirrorDiv != null) {
                proseMirrorDiv.innerHTML = purchaseOrderResponseModel.purchaseOrder.termsConditionsHtml ?? "";
            }

           // set the lead address details
           setLine1(purchaseOrderResponseModel.address.line1);
           setLine2(purchaseOrderResponseModel.address.line2 ?? "");
           setLandmark(purchaseOrderResponseModel.address.landmark ?? "");
           setCity(purchaseOrderResponseModel.address.city);
           setState(purchaseOrderResponseModel.address.state);
           setZipCode(purchaseOrderResponseModel.address.zipCode);
           setNameOnAddress(purchaseOrderResponseModel.address.nameOnAddress ?? "" );
           setPhoneOnAddress(purchaseOrderResponseModel.address.phoneOnAddress ?? "");

           // set the misc state variables
           setNotes(purchaseOrderResponseModel.purchaseOrder.notes ?? "");

           // set the selected ids
           if (purchaseOrderResponseModel.productIdQuantityMapping instanceof Map) {
               setSelectedProductIds(Array.from(purchaseOrderResponseModel.productIdQuantityMapping.keys()));
           } else {
               setSelectedProductIds(Object.keys(purchaseOrderResponseModel.productIdQuantityMapping).map(key => Number(key)));
           }

            const productIdQuantityMappingMap = new Map(Object.entries(purchaseOrderResponseModel.productIdQuantityMapping).map(([key, value]) => [Number(key), value]));
            setProductIdQuantityMapping(productIdQuantityMappingMap);
           setSelectedLeadIds(purchaseOrderResponseModel.purchaseOrder.assignedLeadId ? [purchaseOrderResponseModel.purchaseOrder.assignedLeadId] : []);
        });
    }

    const handleSubmit = () => {
        let requestData: PurchaseOrderRequestModel = {
            purchaseOrder: {
                termsConditionsHtml: rteRef.current?.editor?.getHTML() ?? "",
                purchaseOrderId: isEdit ? purchaseOrderId as number : undefined,
                expectedShipmentDate: expectedShipmentDate,
                vendorNumber: vendorNumber,
                notes: notes,
                assignedLeadId: selectedLeadIds && selectedLeadIds.length > 0 ? parseInt(selectedLeadIds[0].toString()) : undefined,
                orderReceipt: orderReceipt
            },
            address: {
                line1: line1,
                line2: line2,
                landmark: landmark,
                city: city,
                state: state,
                zipCode: zipCode,
                nameOnAddress: nameOnAddress,
                phoneOnAddress: phoneOnAddress
            },
            productIdQuantityMapping: Object.fromEntries(new Map([...productIdQuantityMapping.entries()].filter(([productId]) => selectedProductIds.includes(productId))))
        };

        if(isEdit) {
            purchaseOrderApi(setLoading).updatePurchaseOrder(requestData).then(() => {});
        }
        else{
            purchaseOrderApi(setLoading).createPurchaseOrder(requestData).then(() => {});
        }
    }

    React.useEffect(() => {
        dataApi(setLoading).getStates().then((_states: DataItem[]) => {
            setStates(_states);
        });

        if(isView || isEdit) {
            handleFetchPurchaseOderDetailsById(purchaseOrderId as number);
        }
    }, []);

    return (
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle="Purchase Order Details"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Date}
                        label="Expected Shipment Date"
                        value={expectedShipmentDate}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setExpectedShipmentDate(new Date(event.target.value)), [expectedShipmentDate])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Vendor Number"
                        value={vendorNumber}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setVendorNumber(event.target.value), [vendorNumber])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Order Receipt"
                        required={false}
                        value={orderReceipt}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setOrderReceipt(event.target.value), [orderReceipt])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Customer Address"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Line 1"
                        value={line1}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLine1(event.target.value), [line1])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Line 2"
                        required={false}
                        value={line2}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLine2(event.target.value), [line2])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Landmark"
                        required={false}
                        value={landmark}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLandmark(event.target.value), [landmark])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="City"
                        value={city}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setCity(event.target.value), [city])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Dropdown}
                        label="State"
                        value={state}
                        data={states}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setState(event.target.value), [state, states])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Zip Code"
                        value={zipCode}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setZipCode(event.target.value), [zipCode])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Name on Address"
                        value={nameOnAddress}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setNameOnAddress(event.target.value), [nameOnAddress])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Phone}
                        label="Phone on Address"
                        value={phoneOnAddress}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPhoneOnAddress(event.target.value), [phoneOnAddress])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Misc Information"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.TextArea}
                        label="Notes"
                        value={notes}
                        required={false}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setNotes(event.target.value), [notes])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Assigned Lead"
                sectionSubTitle="Select the lead this purchase order is related to."
            >
                <Grid item md={12} xs={12}>
                    <LeadSelectionGrid
                        isView={isView}
                        setLoading={setLoading}
                        selectedLeadIds={selectedLeadIds}
                        setSelectedLeadIds={React.useCallback((selectedLeadIds: GridRowSelectionModel) => setSelectedLeadIds(selectedLeadIds), [selectedLeadIds])}
                        singleSelection={true}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Products"
                sectionSubTitle="Select products and its quantity."
            >
                <Grid item md={12} xs={12}>
                    <ProductSelectionGrid
                        isView={isView}
                        setLoading={setLoading}
                        selectedProductIds={selectedProductIds}
                        setSelectedProductIds={React.useCallback((selectedProductIds: GridRowSelectionModel) => setSelectedProductIds(selectedProductIds), [selectedProductIds])}
                        singleSelection={false}
                        productIdQuantityMapping={productIdQuantityMapping}
                        setProductIdQuantityMapping={React.useCallback((productIdQuantityMapping: Map<number, number>) => setProductIdQuantityMapping(productIdQuantityMapping), [productIdQuantityMapping])}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionSubTitle="Enter the terms & conditions for the purchase order."
                sectionTitle="Terms & Conditions">
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.RichTextArea}
                        rteRef={rteRef}
                        label="Description"
                        isView={isView}
                        value={termsAndConditionsHtml}
                    />
                </Grid>
            </SectionLayout> <br/>

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="purchaseOrderId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.purchaseorders}
                    buttonText="Purchase Order"
                />
            }
        </OutletLayout>
    );
}

export default AddOrEditPurchaseOrder;