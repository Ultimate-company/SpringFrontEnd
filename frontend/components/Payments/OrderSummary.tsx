import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import {Divider, Grid} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import React from "react";
import {GridColDef, GridColumnVisibilityModel, GridRowSelectionModel, GridToolbar} from "@mui/x-data-grid";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {StyledDataGrid} from "Frontend/components/Datagrid/CustomDataGrid";
import {
    initProductGridColumnsForOrderSummary,
} from "Frontend/api/Models/DataGridModels/ProductGridColumns";
import {useOutletContext} from "react-router-dom";
import PrimaryFont from "Frontend/components/Fonts/PrimaryFont";
import {productApi} from "Frontend/api/ApiCalls";
import {ProductsResponseModel} from "Frontend/api/Models/CarrierModels/Product";
import {
    PackagingEstimateResponseModel,
    SalesOrdersProductQuantityMap, SelectedCourier
} from "Frontend/api/Models/CarrierModels/SalesOrder";
import {formatAmount} from "Frontend/components/commonHelperFunctions";
import {initPackagingEstimateGridColumns} from "Frontend/api/Models/DataGridModels/PackagingEstimateGridColumns";
import CustomModal, { CustomModalProps } from "Frontend/components/OtherComponents/CustomModal";
import AvailableCourierSelectionGrid from "Frontend/components/DataGridsForSelection/AvailableCourierSelectionGrid";

interface OrderSummaryProps {
    total: number;
    tax: number;
    serviceFee: number;
    packagingFee: number;
    deliveryFee: number;
    discount: number;
    grandTotal: number;
    paymentMode: string;
    setGrandTotal: (grandTotal: number) => void;

    line1: string;
    line2: string;
    landmark: string;
    city: string;
    state: string;
    zipCode: string;
    phoneOnAddress: string;
    nameOnAddress: string;

    pickupZipCodeProductIdMapping: Map<string, number[]>;
    salesOrdersProductQuantityMap: SalesOrdersProductQuantityMap[];
    productIdQuantityMapping: Map<number, number>;
    setPackagingFee: (packagingFee: number) => void;
    packagingEstimateModels: PackagingEstimateResponseModel[];
    selectedCouriers: SelectedCourier[];
    setSelectedCouriers: (selectedCourier: SelectedCourier[]) => void;

    isEdit: boolean;
}

const OrderSummary = (props: OrderSummaryProps) => {
    const [setLoading] = useOutletContext<any>();
    const [modalProps, setModalProps] = React.useState<CustomModalProps>({
        open: false,
        headerText: "",
        bodyText: "",
        isJson: true
    });

    // state variables for products grid
    const [products, setProducts] = React.useState<any>([]);
    const [productColumnVisibilityModel, setProductColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            deleted: false
        });
    const [productGridColumns, setProductGridColumns] = React.useState<GridColDef[]>([]);

    // state variables for packaging grid:
    const [packagingEstimateResponseModels, setPackagingEstimateResponseModels] = React.useState<any>([]);
    const [packagingEstimateGridColumns, setPackagingEstimateGridColumns] = React.useState<GridColDef[]>([]);
    const [packagingEstimateColumnVisibilityModel, setPackagingEstimateColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
        });

    React.useEffect(() => {
        if(props.productIdQuantityMapping) {
            const packagingFee = props.packagingEstimateModels.reduce((sum, item) => {
                return sum + item._package.pricePerQuantity;
            }, 0);
            props.setPackagingFee(packagingFee);
            props.setGrandTotal(props.grandTotal + packagingFee);
            setPackagingEstimateResponseModels(props.packagingEstimateModels);
            initPackagingEstimateGridColumns().then((columns) => {
                setPackagingEstimateGridColumns(columns);
            });
        }

        if(props.salesOrdersProductQuantityMap && props.salesOrdersProductQuantityMap.length > 0) {
            productApi(setLoading).getProductDetailsByIds(props.salesOrdersProductQuantityMap.map(item => item.productId)).then((response: ProductsResponseModel[]) => {
                setProducts(response);
                initProductGridColumnsForOrderSummary(props.salesOrdersProductQuantityMap).then((columns: GridColDef[]) => {
                    setProductGridColumns(columns);
                });
            });
        }
        else{
            initProductGridColumnsForOrderSummary(props.salesOrdersProductQuantityMap).then((columns) => {
                setProductGridColumns(columns);
            });
        }
    }, []);


    return (
        <SectionLayout
            sectionSubTitle="Order Summary details"
            sectionTitle="Order summary">
            <CustomModal
                customModalProps={modalProps}
                setCustomModalProps={setModalProps}
            />

            <Grid item md={12} xs={12}/>
            <Grid item md={12} xs={12}>
                <PrimaryFont text="Shipping Details"/>
                <Divider/>
            </Grid>
            <Grid item md={6} xs={12}>
                <RenderInput
                    inputType={InputType.TextField}
                    label="Line 1"
                    value={props.line1}
                    isView={true}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <RenderInput
                    inputType={InputType.TextField}
                    label="Line 2"
                    value={props.line2}
                    isView={true}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <RenderInput
                    inputType={InputType.TextField}
                    label="Landmark"
                    value={props.landmark}
                    isView={true}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <RenderInput
                    inputType={InputType.TextField}
                    label="City"
                    value={props.city}
                    isView={true}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <RenderInput
                    inputType={InputType.TextField}
                    label="State"
                    value={props.state}
                    isView={true}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <RenderInput
                    inputType={InputType.TextField}
                    label="Zip Code"
                    value={props.zipCode}
                    isView={true}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <RenderInput
                    inputType={InputType.TextField}
                    label="Name on Address"
                    value={props.nameOnAddress}
                    isView={true}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <RenderInput
                    inputType={InputType.TextField}
                    label="Phone on Address"
                    value={props.phoneOnAddress}
                    isView={true}
                />
            </Grid>

            <Grid item md={12} xs={12}/>
            <Grid item md={12} xs={12}>
                <PrimaryFont text="Products"/>
                <Divider/>
            </Grid>
            <Grid item md={12} xs={12}>
                <StyledDataGrid
                    rowHeight={150}
                    rows={products}
                    getRowId={(row) => row.product.productId}
                    disableRowSelectionOnClick={true}
                    columns={productGridColumns.map(column => ({ ...column, filterable: false }))}
                    columnVisibilityModel={productColumnVisibilityModel}
                    slots={{
                        noRowsOverlay: CustomNoRowsOverlay,
                        toolbar: GridToolbar
                    }}
                />
            </Grid>
            <Grid item md={12} xs={12}/>
            <Grid item md={12} xs={12}>
                <PrimaryFont text="Packaging Estimate"/>
                <Divider/>
            </Grid>
            <Grid item md={12} xs={12}>
                <StyledDataGrid
                    style={{height: 500}}
                    rows={packagingEstimateResponseModels}
                    getRowId={(row) => row.serialNo}
                    disableRowSelectionOnClick={true}
                    columns={packagingEstimateGridColumns.map(column => ({ ...column, filterable: false }))}
                    columnVisibilityModel={packagingEstimateColumnVisibilityModel}
                    slots={{
                        noRowsOverlay: CustomNoRowsOverlay,
                        toolbar: GridToolbar
                    }}
                />
            </Grid>
            <Grid item md={12} xs={12}/>
            <Grid item md={12} xs={12}>
                <PrimaryFont text="Available Couriers"/>
                <Divider/>
            </Grid>
            <Grid item md={12} xs={12}>
                <AvailableCourierSelectionGrid
                    pickupZipCodeProductIdMapping = {props.pickupZipCodeProductIdMapping}
                    zipCode = {props.zipCode}
                    paymentMode ={props.paymentMode}
                    isEdit = {props.isEdit}
                    selectedCouriers={props.selectedCouriers}
                    setSelectedCouriers={props.setSelectedCouriers}
                    customModalProps = {modalProps}
                    setCustomModalProps = {setModalProps}
                />
            </Grid>
            <Grid item md={12} xs={12}/>
            <Grid item md={12} xs={12}>
                <PrimaryFont text="Final Amount"/>
                <Divider/>
            </Grid>
            <Grid item md={8} xs={12}></Grid>
            <Grid item md={4} xs={12}>
                <RenderInput
                    inputType={InputType.AmountField}
                    label="Total"
                    value={formatAmount(props.total.toString())}
                    isView={true}
                />
            </Grid>
            <Grid item md={8} xs={12}></Grid>
            <Grid item md={4} xs={12}>
                <RenderInput
                    inputType={InputType.AmountField}
                    label="Tax"
                    value={formatAmount(props.tax.toString())}
                    isView={true}
                />
            </Grid>
            <Grid item md={8} xs={12}></Grid>
            <Grid item md={4} xs={12}>
                <RenderInput
                    inputType={InputType.AmountField}
                    label="Service Fee"
                    value={formatAmount(props.serviceFee.toString())}
                    isView={true}
                />
            </Grid>
            <Grid item md={8} xs={12}></Grid>
            <Grid item md={4} xs={12}>
                <RenderInput
                    inputType={InputType.AmountField}
                    label="Delivery Fee"
                    value={formatAmount(props.deliveryFee.toString())}
                    isView={true}
                />
            </Grid>
            <Grid item md={8} xs={12}></Grid>
            <Grid item md={4} xs={12}>
                <RenderInput
                    inputType={InputType.AmountField}
                    label="Packaging Fee"
                    value={formatAmount(props.packagingFee.toString())}
                    isView={true}
                />
            </Grid>
            <Grid item md={8} xs={12}></Grid>
            <Grid item md={4} xs={12}>
                <RenderInput
                    inputType={InputType.AmountField}
                    label="Discount"
                    value={"- "+ formatAmount(props.discount.toString())}
                    isView={true}
                />
            </Grid>
            <Grid item md={8} xs={12}></Grid>
            <Grid item md={4} xs={12}>
                <RenderInput
                    inputType={InputType.AmountField}
                    label="Grand Total"
                    value={formatAmount(props.grandTotal.toString())}
                    isView={true}
                />
            </Grid>
        </SectionLayout>
    );
}
export default React.memo(OrderSummary);