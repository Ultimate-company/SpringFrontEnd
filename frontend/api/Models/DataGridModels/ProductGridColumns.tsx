import {ConfirmOptions} from "material-ui-confirm";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {productApi, userApi} from "Frontend/api/ApiCalls";
import {
    GridColDef, GridEditInputCell,
    GridPreProcessEditCellProps,
    GridRenderCellParams,
    GridRenderEditCellParams
} from "@mui/x-data-grid";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {navigatingRoutes} from "Frontend/navigation";
import React from "react";
import {Avatar} from "@mui/material";
import parse from "html-react-parser";
import CheckboxInput from "Frontend/components/FormInputs/CheckboxInput";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";
import {SalesOrdersProductQuantityMap} from "Frontend/api/Models/CarrierModels/SalesOrder";
import StyledTooltip from "Frontend/components/OtherComponents/StyledTooltip";
import {productUrls} from "Frontend/api/Endpoints";

const productGridColumns : GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        hideable: false,
        filterable: false,
        valueGetter: (_, row) => {
            return row.product.productId;
        }
    },
    {
        field: "deleted",
        headerName: "IsDeleted",
        hideable: false,
        filterable: false,
        valueGetter: (_, row) => {
            return row.product.deleted;
        }
    },
    {
        field: "mainImage",
        headerName: "Image",
        width: 180,
        filterable: false,
        valueGetter: (_, row) => {
            return productUrls.getProductImage+ `?imageName=${row.product.mainImage}`;
        },
        renderCell: (params: GridRenderCellParams) => (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
                <Avatar variant="square" src={params.value} sx={{width: 150, height: 150}}>{params.value}</Avatar>
            </div>
        )
    },
    {
        field: "title",
        headerName: "Title",
        width: 300,
        valueGetter: (_, row) => {
            return row.product.title;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "type",
        headerName: "Type",
        width: 300,
        valueGetter: (_, row) => {
            return row.productCategory.name;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem value={params.value}/>
    },
    {
        field: "upc",
        headerName: "Upc",
        width: 150,
        valueGetter: (_, row) => {
            return row.product.upc;
        }
    },
    {
        field: "dimensions",
        headerName: "Dimensions",
        width: 150,
        valueGetter: (_, row) => {
            return row.product.length + " x " + row.product.breadth + " x " + row.product.height;
        }
    },
    {
        field: "price",
        headerName: "Price",
        width: 150,
        valueGetter: (_, row) => {
            return parse(row.product.price.toString()) + " ₹";
        }
    },
    {
        field: "discount",
        headerName: "Discount",
        width: 150,
        valueGetter: (_, row) => {
            if(row.product.discountPercent) {
                return parse(row.product.discount.toString()) + " %";
            }
            else {
                return parse(row.product.discount.toString()) + " ₹";
            }
        }
    },
    {
        field: "availableStock",
        headerName: "Available Stock",
        width: 150,
        valueGetter: (_, row) => {
            return row.product.availableStock;
        }
    }
];

const actionColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    const permissions: Permissions = await userApi(setLoading).getLoggedInUserPermissions();

    const handleDeleteClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Delete Product " + params.row.product.title,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                productApi(setLoading).toggleDeleteProduct(params.row.product.productId).then((_: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const handleActivateClick = (params: GridRenderCellParams) => {
        confirm({
            description: "Activate Product " + params.row.product.title,
            confirmationText: "Yes I'm Sure",
            allowClose: true,
            confirmationButtonProps: { autoFocus: true }
        })
            .then(() => {
                productApi(setLoading).toggleDeleteProduct(params.row.product.productId).then((_: number) => {
                    window.location.reload();
                });
            })
            .catch(() => {});
    };

    const permissionSplit = Object.values(permissions)
        .flatMap(str => typeof str === 'string'? str.split(',') : []);

    let columns = [...productGridColumns];
    if(permissionSplit.includes(permissionChecks.productsPermissions.updateProducts)){
        columns.push({
            field: "returnsAllowed",
            headerName: "Returns",
            width: 150,
            filterable: false,
            valueGetter: (_, row) => {
                return row.product.returnsAllowed;
            },
            renderCell: (params: GridRenderCellParams) => (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    <CheckboxInput
                        name={params.row.product.productId}
                        checked={params.value}
                        onChange={() => productApi(setLoading).toggleReturnProduct(parseInt(params.row.product.productId)).then(_ => {
                            window.location.reload();
                        })}
                    />
                </div>
            )
        });
    }
    columns.push({
        filterable: false,
        field: "Actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div>
                {params.row.product.deleted ? (
                    <>
                        {permissionSplit.includes(permissionChecks.productsPermissions.deleteProducts) ? (
                            <a onClick={() => handleActivateClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Activate</a>
                        ) : null}
                    </>
                ) : (
                    <>
                        {permissionSplit.includes(permissionChecks.productsPermissions.viewProducts) ? (
                            <><a
                                href={navigatingRoutes.dashboard.addProduct + "?productId=" + params.row.product.productId + "&isView"}>View</a><>&nbsp;&nbsp;&nbsp;</>
                            </>
                        ) : null}
                        {permissionSplit.includes(permissionChecks.productsPermissions.updateProducts) ? (
                            <><a
                                href={navigatingRoutes.dashboard.addProduct + "?productId=" + params.row.product.productId}>Edit</a><>&nbsp;&nbsp;&nbsp;</>
                            </>
                        ) : null}
                        {permissionSplit.includes(permissionChecks.productsPermissions.deleteProducts) ? (
                            <a onClick={() => handleDeleteClick(params)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Delete</a>
                        ) : null}
                    </>
                )}
            </div>
        ),
    });

    return columns;
}


const actionColumnsWithQuantitySelection = async (productIdQuantityMapping: Map<number, number> | undefined,
                                                  setProductIdQuantityMapping: ((mapping: Map<number, number>) => void) | undefined,
                                                  productIdQuantityCustomPriceMapping: SalesOrdersProductQuantityMap[] | undefined,
                                                  setProductIdQuantityCustomPriceMapping: ((mapping: SalesOrdersProductQuantityMap[]) => void) | undefined) => {
    let columns = [...productGridColumns];

    if(productIdQuantityMapping && typeof setProductIdQuantityMapping === 'function') {
        columns.push({
            filterable: false,
            field: "quantity",
            headerName: "Quantity",
            width: 150,
            editable: productIdQuantityCustomPriceMapping && typeof setProductIdQuantityCustomPriceMapping === 'function' ? false: true,
            type: 'number',
            valueGetter: (_, row) => {
                if(productIdQuantityMapping && productIdQuantityMapping.has(row.product.productId)) {
                    return productIdQuantityMapping.get(row.product.productId);
                }
                return "";
            },
            preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                let quantity: number = parseInt(params.props.value);
                if(quantity < 1){
                    return { ...params.props, error: "Min quantity required is 1"  };
                }
                else if(quantity > params.row.product.availableStock){
                    return { ...params.props, error: "Quantity cannot be greater than available stock" };
                }
                return { ...params.props, error: false };
            },
            renderEditCell: (params: GridRenderEditCellParams) => {
                const { error } = params;

                const QuantityEditInputCell = (props: GridRenderEditCellParams) => (
                    <StyledTooltip open={!!error} title={error}>
                        <GridEditInputCell {...props} />
                    </StyledTooltip>
                );

                return <QuantityEditInputCell {...params} />;
            }
        });
    }

    if (productIdQuantityCustomPriceMapping && typeof setProductIdQuantityCustomPriceMapping === 'function') {
        columns.push({
            filterable: false,
            field: "pricePerQuantity",
            headerName: "Price Per Quantity",
            width: 150,
            editable: true,
            type: 'number',
            valueGetter: (_, row) => {
                if(productIdQuantityCustomPriceMapping != undefined){
                    const salesOrdersProductQuantityMap = productIdQuantityCustomPriceMapping.find(
                        (map: SalesOrdersProductQuantityMap) => map.productId === row.product.productId
                    );

                    if (salesOrdersProductQuantityMap) {
                        return salesOrdersProductQuantityMap.pricePerQuantityPerProduct + " ₹";
                    }
                }

                return row.product.price - row.product.discount + " ₹";
            },
            renderEditCell: (params: GridRenderEditCellParams) => {
                const { error } = params;

                const PriceEditInputCell = (props: GridRenderEditCellParams) => (
                    <StyledTooltip open={!!error} title={error}>
                        <GridEditInputCell {...props} />
                    </StyledTooltip>
                );

                return <PriceEditInputCell {...params} />;
            }
        });
    }

    return columns;
}

export const initProductGridColumns = async (confirm: (options?: ConfirmOptions | undefined) => Promise<void>, setLoading: (loading: boolean) => void) => {
    return await actionColumns(confirm, setLoading);
}

export const initProductGridColumnsForSelectionWithoutQuantitySelection = async () => {
    return [...productGridColumns];
}

export const initProductGridColumnsForSelection = async (productIdQuantityMapping: Map<number, number> | undefined,
                                                         setProductIdQuantityMapping: ((mapping: Map<number, number>) => void) | undefined,
                                                         productIdQuantityCustomPriceMapping: SalesOrdersProductQuantityMap[] | undefined,
                                                         setProductIdQuantityCustomPriceMapping: ((mapping: SalesOrdersProductQuantityMap[]) => void) | undefined) => {
    return await actionColumnsWithQuantitySelection(productIdQuantityMapping, setProductIdQuantityMapping, productIdQuantityCustomPriceMapping, setProductIdQuantityCustomPriceMapping);
}

export const initProductGridColumnsForOrderSummary = async (salesOrdersProductQuantityMap: SalesOrdersProductQuantityMap[]) => {
    const filteredColumns = productGridColumns.filter(column =>
        column.field !== "price" &&
        column.field !== "quantity" &&
        column.field !== "availableStock"
    );

    const newColumns: GridColDef[] = [
        ...filteredColumns,
        {
            field: "quantity",
            headerName: "Quantity",
            width: 150,
            valueGetter: (_, row) => {
                const map = salesOrdersProductQuantityMap.find(map => map.productId === row.product.productId);
                return map ? map.quantity : "";
            }
        },
        {
            field: "pricePerProduct",
            headerName: "Price Per Product",
            width: 150,
            valueGetter: (_, row) => {
                const map = salesOrdersProductQuantityMap.find(map => map.productId === row.product.productId);
                return map ? parse(map.pricePerQuantityPerProduct.toString()) + " ₹": "";
            }
        }
    ];

    return [...newColumns];
}

