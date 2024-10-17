import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import React from "react";
import {useOutletContext} from "react-router-dom";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import {dataApi, productApi, promoApi, purchaseOrderApi, salesOrderApi} from "Frontend/api/ApiCalls";
import {getURLParamValue, isEditMode, isViewMode} from "Frontend/components/commonHelperFunctions";
import {
    PackagingEstimateResponseModel,
    SalesOrderRequestModel,
    SalesOrderResponseModel,
    SalesOrdersProductQuantityMap, SalesOrderStatus, SelectedCourier
} from "Frontend/api/Models/CarrierModels/SalesOrder";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import {Grid} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import ProductSelectionGrid from "Frontend/components/DataGridsForSelection/ProductSelectionGrid";
import {GridRowSelectionModel} from "@mui/x-data-grid";
import {
    type RichTextEditorRef,
} from "mui-tiptap";
import AddPaymentDetails from "Frontend/components/Payments/AddPaymentDetails";
import OrderSummary from "Frontend/components/Payments/OrderSummary";
import {Promo} from "Frontend/api/Models/CarrierModels/Promo";
import {GetPaymentMode} from "Frontend/api/Models/CarrierModels/Payment";
import PurchaseOrderSelectionGrid from "Frontend/components/DataGridsForSelection/PurchaseOrderSelectionGrid";
import {PurchaseOrderResponseModel} from "Frontend/api/Models/CarrierModels/PurchaseOrder";
import toast from "react-hot-toast";
import {notificationSettings} from "Frontend/components/Snackbar/NotificationSnackbar";
import {ProductsResponseModel} from "Frontend/api/Models/CarrierModels/Product";

const AddOrEditSalesOrder = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // state variables for data
    const [states, setStates] = React.useState<DataItem[]>([]);

    // sales order details
    const [termsAndConditionsHtml, setTermsAndConditionsHtml] = React.useState<string>("");

    // state variables for shipping address
    const [line1, setLine1] = React.useState<string>("");
    const [line2, setLine2] = React.useState<string>("");
    const [landmark, setLandmark] = React.useState<string>("");
    const [city, setCity] = React.useState<string>("");
    const [state, setState] = React.useState<string>("");
    const [zipCode, setZipCode] = React.useState<string>("");
    const [nameOnAddress, setNameOnAddress] = React.useState<string>("");
    const [phoneOnAddress, setPhoneOnAddress] = React.useState<string>("");

    // state variables for billing address
    const [b_line1, b_setLine1] = React.useState<string>("");
    const [b_line2, b_setLine2] = React.useState<string>("");
    const [b_city, b_setCity] = React.useState<string>("");
    const [b_state, b_setState] = React.useState<string>("");
    const [b_zipCode, b_setZipCode] = React.useState<string>("");
    const [b_nameOnAddress, b_setNameOnAddress] = React.useState<string>("");
    const [b_phoneOnAddress, b_setPhoneOnAddress] = React.useState<string>("");


    // state variables for payment
    const [promoCode, setPromoCode] = React.useState<string>("");
    const [paymentMode, setPaymentMode] = React.useState<string>("COD");
    const [pendingAmount, setPendingAmount] = React.useState<number>(0);
    const [total, setTotal] = React.useState<number>(0);
    const [tax, setTax] = React.useState<number>(0);
    const [serviceFee, setServiceFee] = React.useState<number>(0);
    const [deliveryFee, setDeliveryFee] = React.useState<number>(0);
    const [packagingFee, setPackagingFee] = React.useState<number>(0)
    const [discount, setDiscount] = React.useState<number>(0);
    const [grandTotal, setGrandTotal] = React.useState<number>(0);

    // state variables for razorpay
    const [razorpayTransactionId, setRazorpayTransactionId] = React.useState<string>();
    const [razorpayReceipt, setRazorpayReceipt] = React.useState<string>();
    const [razorpayOrderId, setRazorpayOrderId] = React.useState<string>();
    const [razorpayPaymentNotes, setRazorpayPaymentNotes] = React.useState<string>();
    const [razorpaySignature, setRazorpaySignature] = React.useState<string>();

    // misc state variables
    const [notes, setNotes] = React.useState<string>("");

    // selected ids
    const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = React.useState<GridRowSelectionModel>([]);
    const [selectedProductIds, setSelectedProductIds] = React.useState<GridRowSelectionModel>([]);
    const [productIdQuantityMapping, setProductIdQuantityMapping] = React.useState<Map<number, number>>(new Map());
    const [productIdQuantityCustomPriceMapping, setProductIdQuantityCustomPriceMapping] = React.useState<SalesOrdersProductQuantityMap[]>([]);
    const [pickupZipCodeProductIdMapping, setPickupZipCodeProductIdMapping] = React.useState<Map<string, number[]>>(new Map());
    const [packagingEstimateResponseModels, setPackagingEstimateResponseModels] = React.useState<PackagingEstimateResponseModel[]>([]);
    const [selectedCouriers, setSelectedCouriers] = React.useState<SelectedCourier[]>([]);

    // textarea states
    const rteRef = React.useRef<RichTextEditorRef>(null);

    // local variables
    const isEdit = isEditMode("salesOrderId");
    const isView = isViewMode("salesOrderId");
    let salesOrderId = (isEdit || isView) ? parseInt(getURLParamValue("salesOrderId") as string) : null;

    const handleFetchPurchaseOrderDetailsById = (purchaseOrderId: number) => {
        purchaseOrderApi(setLoading).getPurchaseOrderById(purchaseOrderId).then((purchaseOrderResponseModel: PurchaseOrderResponseModel) => {
            setTermsAndConditionsHtml(purchaseOrderResponseModel.purchaseOrder.termsConditionsHtml ?? "");
            const proseMirrorDiv = document.querySelector('.ProseMirror');
            if(proseMirrorDiv != null) {
                proseMirrorDiv.innerHTML = purchaseOrderResponseModel.purchaseOrder.termsConditionsHtml ?? "";
            }

            // set the shipping address details
            setLine1(purchaseOrderResponseModel.address.line1);
            setLine2(purchaseOrderResponseModel.address.line2 ?? "");
            setLandmark(purchaseOrderResponseModel.address.landmark ?? "");
            setCity(purchaseOrderResponseModel.address.city);
            setState(purchaseOrderResponseModel.address.state);
            setZipCode(purchaseOrderResponseModel.address.zipCode);
            setNameOnAddress(purchaseOrderResponseModel.address.nameOnAddress ?? "" );
            setPhoneOnAddress(purchaseOrderResponseModel.address.phoneOnAddress ?? "");

            // set the billing address details
            b_setLine1(purchaseOrderResponseModel.address.line1);
            b_setLine2(purchaseOrderResponseModel.address.line2 ?? "");
            b_setCity(purchaseOrderResponseModel.address.city);
            b_setState(purchaseOrderResponseModel.address.state);
            b_setZipCode(purchaseOrderResponseModel.address.zipCode);
            b_setNameOnAddress(purchaseOrderResponseModel.address.nameOnAddress ?? "" );
            b_setPhoneOnAddress(purchaseOrderResponseModel.address.phoneOnAddress ?? "");

            // set the misc state variables
            setNotes(purchaseOrderResponseModel.purchaseOrder.notes ?? "");

            // set the selected ids
            let productIds: number[] = [];
            if (purchaseOrderResponseModel.productIdQuantityMapping instanceof Map) {
                productIds = Array.from(purchaseOrderResponseModel.productIdQuantityMapping.keys())
                setSelectedProductIds(productIds);
            } else {
                productIds = Object.keys(purchaseOrderResponseModel.productIdQuantityMapping).map(key => Number(key))
                setSelectedProductIds(productIds);
            }

            // set the quantity for the selected ids
            const productIdQuantityMappingMap = new Map(Object.entries(purchaseOrderResponseModel.productIdQuantityMapping).map(([key, value]) => [Number(key), value]));
            const productIdPriceMapping = new Map(Object.entries(purchaseOrderResponseModel.productIdPriceMapping).map(([key, value]) => [Number(key), value]));
            const productIdDiscountMapping = new Map(Object.entries(purchaseOrderResponseModel.productIdDiscountMapping).map(([key, value]) => [Number(key), value]));
            setProductIdQuantityMapping(productIdQuantityMappingMap);

            // set the price for the selected ids
            let p_total: number = 0;
            let p_tax: number = 0;
            let p_serviceFee: number = 0;
            let p_deliveryFee: number = 0;
            let p_discount: number = 0;

            // set the productId quantity mapping
            for (const productId of productIds) {
                const price = productIdPriceMapping.get(productId);
                const discount = productIdDiscountMapping.get(productId);
                const quantity = productIdQuantityMappingMap.get(productId);
                if (price !== undefined && discount !== undefined && quantity !== undefined) {
                    productIdQuantityCustomPriceMapping.push({
                        productId: productId,
                        pricePerQuantityPerProduct: price - discount,
                        quantity: quantity,
                        originalPrice: price
                    });
                    p_total += (price-discount)*quantity;
                    p_discount += discount * quantity;
                }
            }
            setProductIdQuantityCustomPriceMapping(productIdQuantityCustomPriceMapping);

            // calculate the payment totals
            p_tax = p_total * 0.18;
            setTotal(p_total);
            setTax(p_tax);
            setDiscount(p_discount);
            const packagingFee = packagingEstimateResponseModels.reduce((sum, item) => {
                return sum + item._package.pricePerQuantity;
            }, 0);
            setGrandTotal(p_total + p_tax + p_serviceFee + p_deliveryFee + packagingFee);

            // get selected product details
            productApi(setLoading).getProductDetailsByIds(productIds).then((productResponseModel: ProductsResponseModel[]) => {
                let pickupZipCodeProductIdMapping: Map<string, number[]> = new Map<string, number[]>();
                for(let i = 0; i<productResponseModel.length; i++) {
                    let key = productResponseModel[i].pickupLocationResponseModel.address.zipCode +"-" + productResponseModel[i].pickupLocationResponseModel.pickupLocation.pickupLocationId;
                    if(pickupZipCodeProductIdMapping.has(key)) {
                        pickupZipCodeProductIdMapping.get(key)?.push(productResponseModel[i].product.productId as number);
                    }
                    else {
                        pickupZipCodeProductIdMapping.set(key, []);
                        pickupZipCodeProductIdMapping.get(key)?.push(productResponseModel[i].product.productId as number);
                    }
                }
                setPickupZipCodeProductIdMapping(pickupZipCodeProductIdMapping);
            })

            // get the packaging estimate models
            salesOrderApi(setLoading).getPackagingEstimate(productIdQuantityMappingMap)
                .then((packagingEstimateResponseModels: PackagingEstimateResponseModel[]) => {
                    setPackagingEstimateResponseModels(packagingEstimateResponseModels);
                });
        });
    }

    const handleCalculateTotal = () => {
        let p_total: number = 0;
        let p_tax: number = 0;
        let p_serviceFee: number = 0;
        let p_deliveryFee: number = 0;
        let p_discount: number = 0;

        for(let i= 0; i<productIdQuantityCustomPriceMapping.length; i++) {
            p_total += productIdQuantityCustomPriceMapping[i].pricePerQuantityPerProduct * productIdQuantityCustomPriceMapping[i].quantity;
            if(productIdQuantityCustomPriceMapping[i].originalPrice > productIdQuantityCustomPriceMapping[i].pricePerQuantityPerProduct){
                p_discount += (productIdQuantityCustomPriceMapping[i].originalPrice - productIdQuantityCustomPriceMapping[i].pricePerQuantityPerProduct) * productIdQuantityCustomPriceMapping[i].quantity;
            }
        }

        // calculate the payment totals
        p_tax = p_total * 0.18;
        setTotal(p_total);
        setTax(p_tax);
        setDiscount(p_discount);
        const packagingFee = packagingEstimateResponseModels.reduce((sum, item) => {
            return sum + item._package.pricePerQuantity;
        }, 0);
        setGrandTotal(p_total + p_tax + p_serviceFee + p_deliveryFee + packagingFee);
    }

    const handleFetchSalesOrderDetailsById = (salesOrderId: number) => {
        salesOrderApi(setLoading).getSalesOrderById(salesOrderId).then((salesOrderResponseModel: SalesOrderResponseModel) => {

        });
    }
    const handleSubmit = () => {
        let requestData: SalesOrderRequestModel = {
            salesOrder: {
                salesOrderStatus: SalesOrderStatus.ORDER_RECEIVED,
                termsAndConditionsHtml: termsAndConditionsHtml,
                purchaseOrderId: selectedPurchaseOrderId && selectedPurchaseOrderId.length > 0 ? parseInt(selectedPurchaseOrderId[0].toString()) : undefined,
                notes: notes,
            },
            shippingAddress: {
                line1: line1,
                line2: line2,
                landmark: landmark,
                city: city,
                state: state,
                zipCode: zipCode,
                nameOnAddress: nameOnAddress,
                phoneOnAddress: phoneOnAddress
            },
            billingAddress: {
                line1: b_line1,
                line2: b_line2,
                city: b_city,
                state: b_state,
                zipCode: b_zipCode,
                nameOnAddress: b_nameOnAddress,
                phoneOnAddress: b_phoneOnAddress
            },
            salesOrdersProductQuantityMaps: productIdQuantityCustomPriceMapping,
            paymentInfo: {
                total: grandTotal,
                subTotal: total,
                tax: tax,
                serviceFee: serviceFee,
                deliveryFee: deliveryFee,
                discount: discount,
                pendingAmount: pendingAmount,
                packagingFee: packagingFee,
                mode: GetPaymentMode(paymentMode) as number,

                razorpayTransactionId: razorpayTransactionId,
                razorpayReceipt: razorpayReceipt,
                razorpayOrderId: razorpayOrderId,
                razorpayPaymentNotes: razorpayPaymentNotes,
                razorpaySignature: razorpaySignature,
            },
            packagingEstimateResponseModels: packagingEstimateResponseModels,
            selectedCouriers: selectedCouriers
        };

        if(promoCode && promoCode.length > 0) {
            promoApi(setLoading).getPromoDetailsByName(promoCode).then((promo: Promo) => {
                requestData.paymentInfo.promoId = promo.promoId;
                if(isEdit) {
                    salesOrderApi(setLoading).updateSalesOrder(requestData).then(() => {});
                }
                else{
                    salesOrderApi(setLoading).createSalesOrder(requestData).then(() => {});
                }
            });
        }
        else{
            if(isEdit) {
                salesOrderApi(setLoading).updateSalesOrder(requestData).then(() => {});
            }
            else{
                salesOrderApi(setLoading).createSalesOrder(requestData).then(() => {});
            }
        }
    }

    React.useEffect(() => {
        dataApi(setLoading).getStates().then((_states: DataItem[]) => {
            setStates(_states);
        });

        if(isView || isEdit) {
            handleFetchSalesOrderDetailsById(salesOrderId as number);
        }
    }, []);

    return (
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle="Purchase Order"
                sectionSubTitle="Select the purchase order associated to the sales order."
            >
                <Grid item md={12} xs={12}>
                    <PurchaseOrderSelectionGrid
                        isView={isView}
                        setLoading={setLoading}
                        selectedPurchaseOrderIds={selectedPurchaseOrderId}
                        setSelectedPurchaseOrderIds={React.useCallback((selectedPurchaseOrderId: GridRowSelectionModel) => {
                            let purchaseOrderId = selectedPurchaseOrderId && selectedPurchaseOrderId.length > 0 ? parseInt(selectedPurchaseOrderId[0].toString()) : undefined;
                            if(purchaseOrderId != undefined) {
                                handleFetchPurchaseOrderDetailsById(purchaseOrderId)
                            }
                            setSelectedPurchaseOrderId(selectedPurchaseOrderId);
                        }, [selectedPurchaseOrderId])}
                        singleSelection={true}
                        approvedOnly={true}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Shipping Address"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Line 1"
                        value={line1}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLine1(event.target.value), [line1])}
                        isView={isView}
                        disabled={true}
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
                        disabled={true}
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
                        disabled={true}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="City"
                        value={city}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setCity(event.target.value), [city])}
                        isView={isView}
                        disabled={true}
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
                        disabled={true}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Zip Code"
                        value={zipCode}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setZipCode(event.target.value), [zipCode])}
                        isView={isView}
                        disabled={true}
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
                sectionTitle="Billing Address"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Line 1"
                        value={b_line1}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => b_setLine1(event.target.value), [b_line1])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Line 2"
                        required={false}
                        value={b_line2}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => b_setLine2(event.target.value), [b_line2])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="City"
                        value={b_city}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => b_setCity(event.target.value), [b_city])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Dropdown}
                        label="State"
                        value={b_state}
                        data={states}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => b_setState(event.target.value), [b_state, states])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Zip Code"
                        value={b_zipCode}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => b_setZipCode(event.target.value), [b_zipCode])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Name on Address"
                        value={b_nameOnAddress}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => b_setNameOnAddress(event.target.value), [b_nameOnAddress])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Phone}
                        label="Phone on Address"
                        value={b_phoneOnAddress}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => b_setPhoneOnAddress(event.target.value), [b_phoneOnAddress])}
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
                sectionTitle="Products"
                sectionSubTitle="Select products, its quantity and the agreed price per quantity."
            >
                <Grid item md={12} xs={12}>
                    <ProductSelectionGrid
                        isView={isView}
                        isRowSelectable={false}
                        showCheckboxSelection={false}
                        viewOnlySelected={true}
                        setLoading={setLoading}
                        selectedProductIds={selectedProductIds}
                        setSelectedProductIds={React.useCallback((selectedProductIds: GridRowSelectionModel) => {
                            if(!selectedPurchaseOrderId || selectedPurchaseOrderId.length <= 0) {
                                toast.error("Please select the purchase order first.",  notificationSettings);
                                return;
                            }
                            setSelectedProductIds(selectedProductIds)
                        }, [selectedProductIds])}
                        singleSelection={false}
                        productIdQuantityMapping={productIdQuantityMapping}
                        setProductIdQuantityMapping={React.useCallback((productIdQuantityMapping: Map<number, number>) => setProductIdQuantityMapping(productIdQuantityMapping), [productIdQuantityMapping])}
                        productIdQuantityCustomPriceMapping={productIdQuantityCustomPriceMapping}
                        setProductIdQuantityCustomPriceMapping={React.useCallback((salesOrdersProductQuantityMaps: SalesOrdersProductQuantityMap[]) => {
                            setProductIdQuantityCustomPriceMapping(salesOrdersProductQuantityMaps);
                            handleCalculateTotal();
                        }, [productIdQuantityCustomPriceMapping])}
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
            {
                pickupZipCodeProductIdMapping &&
                productIdQuantityCustomPriceMapping &&
                productIdQuantityMapping &&
                packagingEstimateResponseModels &&
                productIdQuantityMapping.size > 0 &&
                productIdQuantityCustomPriceMapping.length > 0 &&
                pickupZipCodeProductIdMapping.size > 0 &&
                packagingEstimateResponseModels.length > 0 ? (
                    <>
                        <AddPaymentDetails
                            paymentMode={paymentMode}
                            setPaymentMode={setPaymentMode}
                            line1={b_line1}
                            setLine1={b_setLine1}
                            line2={b_line2}
                            setLine2={b_setLine2}
                            city={b_city}
                            setCity={b_setCity}
                            state={b_state}
                            setState={b_setState}
                            states={states}
                            zipCode={b_zipCode}
                            setZipCode={b_setZipCode}
                            isView={isView}
                        /><br/>

                        <OrderSummary
                            total={total}
                            tax={tax}
                            serviceFee={serviceFee}
                            deliveryFee={deliveryFee}
                            packagingFee={packagingFee}
                            discount={discount}
                            grandTotal={grandTotal}
                            line1={line1}
                            line2={line2}
                            landmark={landmark}
                            city={city}
                            state={state}
                            zipCode={zipCode}
                            phoneOnAddress={phoneOnAddress}
                            nameOnAddress={nameOnAddress}
                            pickupZipCodeProductIdMapping={pickupZipCodeProductIdMapping}
                            paymentMode={paymentMode}
                            salesOrdersProductQuantityMap={productIdQuantityCustomPriceMapping}
                            productIdQuantityMapping={productIdQuantityMapping}
                            setPackagingFee={setPackagingFee}
                            setGrandTotal={setGrandTotal}
                            isEdit={isEdit}
                            packagingEstimateModels={packagingEstimateResponseModels}
                            selectedCouriers={selectedCouriers}
                            setSelectedCouriers={setSelectedCouriers}
                        /><br/>
                    </>
                ) : (
                    <></>
                )
            }

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="salesOrderId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.salesorders}
                    buttonText="Sales Order"
                />
            }
        </OutletLayout>
    );
}
export default AddOrEditSalesOrder;