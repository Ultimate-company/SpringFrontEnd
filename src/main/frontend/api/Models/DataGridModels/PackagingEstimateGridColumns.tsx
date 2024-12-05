import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import RenderLongCellItem from "Frontend/components/Datagrid/RenderLongCellItem";
import React from "react";

const packagingEstimateGridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        hideable: false,
        filterable: false,
        valueGetter: (value, row) => {
            return row.serialNo;
        }
    },
    {
        field: "serialNo",
        headerName: "#",
        filterable: false,
        valueGetter: (value, row) => {
            return row.serialNo;
        }
    },
    {
        field: "dimensions",
        headerName: "Package Dimensions",
        flex: 2,
        minWidth: 150,
        valueGetter: (_, row) => {
            return row._package.length + " x " + row._package.breadth + " x " + row._package.height;
        }
    },
    {
        field: "products",
        headerName: "Products In Package",
        flex: 4,
        minWidth: 500,
        valueGetter: (_, row) => {
            let result = "";
            for(let i = 0; i<row.products.length; i++) {
                const occurrenceCount = (row.productIds as number[]).filter(id => id === row.products[i].productId).length;
                result += occurrenceCount + " x " + row.products[i].title + "<br/>";
            }
            return result;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />
    },
    {
        field: "costPerPackage",
        headerName: "Packaging Cost",
        flex: 2,
        minWidth: 250,
        valueGetter: (_, row) => {
           return row._package.pricePerQuantity + " ₹";
        }
    },
    {
        field: "pickupLocationAddress",
        headerName: "Pickup Location Address",
        flex: 2,
        minWidth: 300,
        valueGetter: (_, row) => {
            return row.pickupLocationResponseModel.address.line1 + " " +
                row.pickupLocationResponseModel.address.line2 + ", " +
                row.pickupLocationResponseModel.address.city + ", " +
                row.pickupLocationResponseModel.address.state + ", " +
                row.pickupLocationResponseModel.address.zipCode;
        },
        renderCell: (params: GridRenderCellParams) => <RenderLongCellItem
            columnWidth={params.colDef.computedWidth}
            value={params.value}
        />
    }
];

export const initPackagingEstimateGridColumns = async () => {
    return [...packagingEstimateGridColumns];
}