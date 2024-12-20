import React from "react";
import {Button, Card, CardContent, Dialog, DialogActions, DialogContent, Grid, DialogTitle, Box} from "@mui/material";
import { notificationSettings } from "Frontend/components/Snackbar/NotificationSnackbar";
import toast from "react-hot-toast";
import BlueButton from "Frontend/components/FormInputs/BlueButton";
import LinkButton from "Frontend/components/FormInputs/LinkButton";
import { navigatingRoutes } from "Frontend/navigation";
import {
    bulkApi,
    dataApi,
    pickupLocationApi,
} from "Frontend/api/ApiCalls";
import {
    bulkUrls
} from "Frontend/api/Endpoints";
import {StyledDataGrid} from "Frontend/components/Datagrid/CustomDataGrid";
import {
    GridColDef,
    GridColumnVisibilityModel,
    GridToolbarContainer,
    GridToolbarFilterButton
} from "@mui/x-data-grid";
import CustomNoRowsOverlay from "Frontend/components/Datagrid/CustomNoRowsOverlay";
import {initDataGridColumns} from "Frontend/api/Models/DataGridModels/DataGridColumns";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import {country_arr} from "Frontend/components/commonHelperFunctions";
import {ProductCondition} from "Frontend/api/Models/CarrierModels/Product";
import {CustomPaginationForGrid} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import {PickupLocation} from "Frontend/api/Models/CarrierModels/PickupLocation";
import {GridRowClassNameParams} from "@mui/x-data-grid/models/params";
import CustomTreeView from "Frontend/components/TreeView/CustomTreeView";

interface ToolbarProps {
    page?: string;
    setLoading: (loading: boolean) => void;
}

interface ImportDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    page: string;
    formData: FormData;
    setFormData: (formData: FormData) => void;
    fileUploadChange: React.ChangeEventHandler<HTMLInputElement>;
    uploadFile: () => void;
    fileName: string;
    gridColumnVisibilityModel: GridColumnVisibilityModel;

    // data grid cols
    colorDataGridColumns: GridColDef[];
    countryDataGridColumns: GridColDef[];
    conditionDataGridColumns: GridColDef[];
    productCategoriesDataGridColumns: GridColDef[];
    pickupLocationGridColumns: GridColDef[];
    paymentDataGridColumns: GridColDef[];
    stateCitiesDataGridColumns: GridColDef[];
    filterDataGridColumns: GridColDef[];
    sortDataGridColumns: GridColDef[];

    // data
    pickupLocationData: DataItem[];
    colorData: DataItem[];
    countryData: DataItem[];
    conditionData: DataItem[];
    productCategoryData: DataItem[];
    paymentData: { [key: string]: { label: string; value: string }[] };
    stateCitiesData: { [key: string]: string[] };
    filterData: DataItem[];
    sortData: DataItem[];

    // optional
    columns?: GridColDef[];
    rowClassNameCl?: GridColDef[];
    title?: string;
    rows?: DataItem[] | PickupLocation[] | { [key: string]: { label: string; value: string }[] } | { [key: string]: string[] };
    md?: number;
}

// Define a type for the structure of each entry
interface ImportDetail {
    importText: string;
    addText: string;
    link: string;
}

// Define the type for the importDetails object
type ImportDetails = {
    [key: string]: ImportDetail;
};

const importDetails: ImportDetails = {
    "User": {
        importText: "Import Users",
        addText: "Add User",
        link: navigatingRoutes.dashboard.addUser
    },
    "Lead": {
        importText: "Import Leads",
        addText: "Add Lead",
        link: navigatingRoutes.dashboard.addLead
    },
    "UserGroup": {
        importText: "Import User Groups",
        addText: "Add User Group",
        link: navigatingRoutes.dashboard.addUserGroup
    },
    "PickupLocation": {
        importText: "Import Pickup Locations",
        addText: "Add Pickup Location",
        link: navigatingRoutes.dashboard.addPickupLocation
    },
    "Promo": {
        importText: "Import Promo Codes",
        addText: "Add Promo Code",
        link: navigatingRoutes.dashboard.addPromo
    },
    "Message": {
        importText: "Import Messages",
        addText: "Add Message",
        link: navigatingRoutes.dashboard.addMessage
    },
    "PurchaseOrder": {
        importText: "Import Purchase Order",
        addText: "Add Purchase Order",
        link: navigatingRoutes.dashboard.addPurchaseOrder
    },
    "SalesOrder": {
        importText: "Import Sales Order",
        addText: "Add Sales Order",
        link: navigatingRoutes.dashboard.addSalesOrder
    },
    "Product": {
        importText: "Import Products",
        addText: "Add Product",
        link: navigatingRoutes.dashboard.addProduct
    },
    "Package": {
        importText: "Import Packages",
        addText: "Add Package",
        link: navigatingRoutes.dashboard.addPackage
    },
    "Support": {
        importText: "Import Support Tickets",
        addText: "Create Support Ticket",
        link: navigatingRoutes.dashboard.addSupport
    },
    "WebTemplate": {
        importText: "Import Web Templates",
        addText: "Create Web Template",
        link: navigatingRoutes.dashboard.addWebTemplate
    },
};

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
        </GridToolbarContainer>
    );
}

const DataGridSection = ({
                             title,
                             rows,
                             columns,
                             gridColumnVisibilityModel,
                             md
                         }: Partial<ImportDialogProps>) => {

    // Check if rows is of type { [key: string]: { label: string; value: string }[] } or { [key: string]: string[] }
    const isComplexRowType =
        rows &&
        typeof rows === 'object' &&
        !Array.isArray(rows) &&
        Object.values(rows).length > 0 &&
        (
            Array.isArray(Object.values(rows)[0]) ||
            (Object.values(rows)[0] && typeof Object.values(rows)[0] === 'object' && 'label' in Object.values(rows)[0])
        );

    if (isComplexRowType) {
        return(
            <Grid item md={md as number} xs={12}>
                <Box noValidate component="form" sx={{ display: 'flex', flexDirection: 'column', m: 'auto', width: 'fit-content' }}>
                    <b>{title}</b>
                </Box>
                <CustomTreeView data={rows as { [key: string]: { label: string; value: string }[] }} />
                <br/>
            </Grid>
        )
    }

    return (
        <Grid item md={md as number} xs={12}>
            <Box noValidate component="form" sx={{ display: 'flex', flexDirection: 'column', m: 'auto', width: 'fit-content' }}>
                <b>{title}</b>
            </Box>
            <StyledDataGrid
                disableRowSelectionOnClick
                style={{ height: 500 }}
                rows={rows as DataItem[] | PickupLocation[]}
                getRowId={(row) => row.key}
                columns={columns as GridColDef[]}
                columnVisibilityModel={gridColumnVisibilityModel}
                slots={{
                    noRowsOverlay: CustomNoRowsOverlay,
                    toolbar: CustomToolbar,
                    pagination: () =>  <CustomPaginationForGrid />
                }}
                initialState={{ pagination: { paginationModel: { pageSize: 100 } } }}
                pageSizeOptions={[10, 25, 100]}
                getRowClassName={React.useCallback((params: GridRowClassNameParams) => {
                    return params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
                }, [rows])}
            />
        </Grid>
    );
};

const ImportDialogContent = (
    {
        page,
        fileUploadChange,
        fileName,
        gridColumnVisibilityModel,

        // grid columns
        colorDataGridColumns,
        countryDataGridColumns,
        conditionDataGridColumns,
        pickupLocationGridColumns,
        productCategoriesDataGridColumns,
        paymentDataGridColumns,
        stateCitiesDataGridColumns,
        filterDataGridColumns,
        sortDataGridColumns,

        //data
        colorData,
        countryData,
        pickupLocationData,
        conditionData,
        productCategoryData,
        paymentData,
        stateCitiesData,
        filterData,
        sortData
    }: ImportDialogProps) => {
    const webUrl = "ultimatecompany.dev.com";
    return (
        <DialogContent>
            <Box
                noValidate
                component="form"
                sx={{ display: 'flex', flexDirection: 'column', m: 'auto', width: 'fit-content' }}
            >
                You can import your {page} in the system directly by uploading a CSV/XLSX/XLS file.<br />
                Depending on the size of your file, this might take some time.<br />
                There is a sample CSV file below which contains the headers required for uploading the {page} data.<br /><br />

                {/*// Conditional Rendering*/}
                {page === "Message" && (
                    <>
                        In the sample column, either the 'userids' or 'usergroupids' column must be filled. Both
                        can be filled, but at least one is required.
                        <br /><br />
                    </>
                )}
                {page === "Product" && (
                    <Grid container>
                        <hr style={{ border: '1px solid #000', width: '80%', margin: '20px auto' }} />
                        <DataGridSection md={6} title="Colors" rows={colorData} columns={colorDataGridColumns} gridColumnVisibilityModel={gridColumnVisibilityModel} />
                        <DataGridSection md={6} title="Country" rows={countryData} columns={countryDataGridColumns} gridColumnVisibilityModel={gridColumnVisibilityModel} />
                        <DataGridSection md={6} title="Condition" rows={conditionData} columns={conditionDataGridColumns} gridColumnVisibilityModel={gridColumnVisibilityModel} />
                        <DataGridSection md={6} title="Product Category" rows={productCategoryData} columns={productCategoriesDataGridColumns} gridColumnVisibilityModel={gridColumnVisibilityModel} />
                        <DataGridSection md={12} title="Pickup Locations" rows={pickupLocationData} columns={pickupLocationGridColumns} gridColumnVisibilityModel={gridColumnVisibilityModel} />
                        <hr style={{ border: '1px solid #000', width: '80%', margin: '20px auto' }} />
                    </Grid>
                )}
                {page === "WebTemplate" && (
                    <>
                        <>
                            The url should be in this format: &nbsp;&nbsp;&nbsp;
                            <span>https://your-wildcard-domain-name.{webUrl}</span>
                            <br/><br/>
                        </>
                        <Grid container>
                        <hr style={{ border: '1px solid #000', width: '80%', margin: '20px auto' }} />
                            <DataGridSection md={6} title="Payment Options" rows={paymentData} columns={paymentDataGridColumns} gridColumnVisibilityModel={gridColumnVisibilityModel} />
                            <DataGridSection md={6} title="Service State and Citities" rows={stateCitiesData} columns={stateCitiesDataGridColumns} gridColumnVisibilityModel={gridColumnVisibilityModel} />
                            <DataGridSection md={12} title="Filter Options" rows={filterData} columns={filterDataGridColumns} gridColumnVisibilityModel={gridColumnVisibilityModel} />
                            <DataGridSection md={12} title="Sort Options" rows={sortData} columns={sortDataGridColumns} gridColumnVisibilityModel={gridColumnVisibilityModel} />
                            <hr style={{ border: '1px solid #000', width: '80%', margin: '20px auto' }} />
                        </Grid>
                    </>

                )}

                <a href={bulkUrls.generateBulkImportExcel + "?bulkAddType=" + page}>Import Template for {page}</a><br />
                <input accept=".xlsx, .xls" type="file" onChange={fileUploadChange} />
                {fileName && (
                    <div>
                        <strong>Selected file: </strong>{fileName}
                    </div>
                )}
            </Box>
        </DialogContent>
    );
};

const ImportDialog = (props: ImportDialogProps) => (
    <Dialog
        fullWidth={props.page === "Product" || props.page == "WebTemplate"}
        maxWidth={props.page === "Product" || props.page == "WebTemplate"? "xl" : undefined}
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="draggable-dialog-title"
    >
        <DialogTitle id="draggable-dialog-title">Import {props.page}</DialogTitle>
        <ImportDialogContent {...props}/>
        <DialogActions>
            <Button autoFocus onClick={() => props.setOpen(false)} color="primary">Cancel</Button>
            <Button onClick={props.uploadFile} color="primary">Import</Button>
        </DialogActions>
    </Dialog>
);


const Toolbar = (props: ToolbarProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState<FormData>(new FormData());

    // data grid columns
    const [countryDataGridColumns, setCountryDataGridColumns] = React.useState<GridColDef[]>([]);
    const [conditionDataGridColumns, setConditionDataGridColumns] = React.useState<GridColDef[]>([]);
    const [colorDataGridColumns, setColorDataGridColumns] = React.useState<GridColDef[]>([]);
    const [pickupLocationGridColumns, setPickupLocationGridColumns] = React.useState<GridColDef[]>([]);
    const [productCategoriesDataGridColumns, setProductCategoriesDataGridColumns] = React.useState<GridColDef[]>([]);
    const [paymentDataGridColumns, setPaymentDataGridColumns] = React.useState<GridColDef[]>([]);
    const [stateCitiesDataGridColumns, setStateCitiesDataGridColumns] = React.useState<GridColDef[]>([]);
    const [filterDataGridColumns, setFilterDataGridColumns] = React.useState<GridColDef[]>([]);
    const [sortDataGridColumns, setSortDataGridColumns] = React.useState<GridColDef[]>([]);

    // data rows
    const [countryData, setCountryData] = React.useState<DataItem[]>([]);
    const [conditionData, setConditionData] = React.useState<DataItem[]>([]);
    const [colorData, setColorData] = React.useState<DataItem[]>([]);
    const [productCategoryData, setProductCategoryData] = React.useState<DataItem[]>([]);
    const [pickupLocationData, setPickupLocationData] = React.useState<DataItem[]>([]);
    const [paymentData, setPaymentData] = React.useState<{ [key: string]: { label: string; value: string }[] }>({});
    const [stateCitiesData, setStateCitiesData] = React.useState<{ [key: string]: string[] }>({});
    const [filterData, setFilterData] = React.useState<DataItem[]>([]);
    const [sortData, setSortData] = React.useState<DataItem[]>([]);

    const [fileName, setFileName] = React.useState<string>("");

    // column visibility model
    const [gridColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
        });

    const uploadFile = () => {
        if (!formData) {
            toast.error("Please Select a file First", notificationSettings);
            return;
        }
        else {
            bulkApi(props.setLoading).bulkInsert(props.page ?? "", formData).then();
        }
    };

    const fileUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const file = fileInput.files?.[0];

        if (file) {
            let formData = new FormData();
            formData.append('file', file);
            setFormData(formData);
            setFileName(file.name); // Set the file name when a file is selected
        }
    };

    React.useEffect(() => {
        if(props.page == "WebTemplate"){
            // accepted payments
            initDataGridColumns(false).then((columns) => {
                setPaymentDataGridColumns(columns);
            });
            dataApi(props.setLoading).getPaymentOptions()
                .then((response: { [key: string]: { label: string; value: string }[] }) => {
                    setPaymentData(response);
                });

            // serviced states and cities
            initDataGridColumns(false).then((columns) => {
                setStateCitiesDataGridColumns(columns);
            });
            dataApi(props.setLoading).getStateCityMappingOptions()
                .then((response: { [key: string]: string[] }) => {
                    setStateCitiesData(response);
                });

            // filter
            initDataGridColumns(false).then((columns) => {
                setFilterDataGridColumns(columns);
            });
            dataApi(props.setLoading).getFilterOptions()
                .then((response: DataItem[]) => {
                    setFilterData(response);
                });

            // sort
            initDataGridColumns(false).then((columns) => {
                setSortDataGridColumns(columns);
            });
            dataApi(props.setLoading).getSortOptions()
                .then((response: DataItem[]) => {
                    setSortData(response);
                });
        }

        if(props.page == "Product") {
            // country
            initDataGridColumns(false).then((columns) => {
                setCountryDataGridColumns(columns);
            });
            setCountryData(country_arr.map((country: string) => ({
                key: country,
                value: country,
                title: country
            } as DataItem)));

            // conditions
            initDataGridColumns(true).then((columns) => {
                setConditionDataGridColumns(columns);
            });
            setConditionData([
                {
                    key: "New With Tags",
                    value: ProductCondition.NEW_WITH_TAGS.toString(),
                    title: "New With Tags"
                },
                {
                    key: "New Without Tags",
                    value: ProductCondition.NEW_WITHOUT_TAGS.toString(),
                    title: "New Without Tags"
                },
                {
                    key: "New With Defects",
                    value: ProductCondition.NEW_WITH_DEFECTS.toString(),
                    title: "New With Defects"
                },
                {key: "Pre-Owned", value: ProductCondition.PRE_OWNED.toString(), title: "Pre-Owned"},
                {
                    key: "Pre-Owned with Defects",
                    value: ProductCondition.PRE_OWNED_WITH_DEFECTS.toString(),
                    title: "Pre-Owned with Defects"
                },
            ]);

            // colors
            initDataGridColumns(true).then((columns) => {
                setColorDataGridColumns(columns);
            });
            dataApi(props.setLoading).getColors()
                .then((response: DataItem[]) => {
                    setColorData(response);
                });

            // product categories
            initDataGridColumns(true).then((columns) => {
                setProductCategoriesDataGridColumns(columns);
            });
            dataApi(props.setLoading).findCategoriesWithoutChildren()
                .then((response: DataItem[]) => {
                    setProductCategoryData(response);
                });

            // pickup locations
            initDataGridColumns(true).then((columns) => {
                setPickupLocationGridColumns(columns);
            });
            pickupLocationApi(props.setLoading).getAllPickupLocations()
                .then((response: PickupLocation[]) => {
                    setPickupLocationData(response.map((pickupLocation: PickupLocation) => ({
                        key: pickupLocation.pickupLocationId?.toString(),
                        value: pickupLocation.addressNickName,
                        title: pickupLocation.addressNickName
                    } as DataItem)));
                });
        }
    }, [])

    return (
        <>
            <Card style={{ marginLeft: 20, marginRight: 20, marginTop:20 }}>
                <CardContent>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <div>
                            {props.page !== "Support" && (
                                <>
                                    <LinkButton label={importDetails[props.page as string]?.importText ?? ""} handleSubmit={() => setOpen(true)} /> &nbsp;&nbsp;&nbsp;
                                </>
                            )}
                            <BlueButton label={importDetails[props.page as string]?.addText ?? ""} href={importDetails[props.page as string]?.link ?? ""} />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <ImportDialog
                open={open}
                setOpen={setOpen}
                page={props.page as string}
                formData={formData}
                setFormData={setFormData}
                gridColumnVisibilityModel={gridColumnVisibilityModel}
                uploadFile={uploadFile}
                fileName={fileName}
                fileUploadChange={fileUploadChange}

                // data grid columns
                countryDataGridColumns={countryDataGridColumns}
                conditionDataGridColumns={conditionDataGridColumns}
                colorDataGridColumns={colorDataGridColumns}
                pickupLocationGridColumns={pickupLocationGridColumns}
                productCategoriesDataGridColumns={productCategoriesDataGridColumns}
                paymentDataGridColumns={paymentDataGridColumns}
                stateCitiesDataGridColumns={stateCitiesDataGridColumns}
                filterDataGridColumns={filterDataGridColumns}
                sortDataGridColumns={sortDataGridColumns}

                // data
                countryData={countryData}
                conditionData={conditionData}
                colorData={colorData}
                pickupLocationData={pickupLocationData}
                productCategoryData={productCategoryData}
                paymentData={paymentData}
                stateCitiesData={stateCitiesData}
                filterData={filterData}
                sortData={sortData}
            />
        </>
    );
};

export default Toolbar;