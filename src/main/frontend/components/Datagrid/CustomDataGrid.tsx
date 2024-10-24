import {styled} from "@mui/material/styles";
import {DataGrid} from "@mui/x-data-grid";
import React from "react";
import {grey} from "@mui/material/colors";

const MyDataGrid = styled(DataGrid)(({theme}) => ({
    border: 0,
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    borderRadius: '4px',
    padding: 20,
    height: "700px",
    width: "100%",
    fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(","),
    WebkitFontSmoothing: "auto",
    letterSpacing: "normal",
    "& .MuiDataGrid-columnsContainer": {
        backgroundColor: theme.palette.mode === "light" ? "#fafafa" : "#1d1d1d",
    },
    "& .MuiDataGrid-iconSeparator": {
        display: "none",
    },
    "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
        borderRight: `1px solid ${theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
        }`,
    },
    "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
        borderBottom: `1px solid ${theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
        }`,
    },
    "& .MuiDataGrid-cell": {
        color:
            theme.palette.mode === "light"
                ? "rgba(0,0,0,.85)"
                : "rgba(255,255,255,0.65)",
    },
    "& .MuiPaginationItem-root": {
        borderRadius: 0,
    },
    "& .deleted": {
        backgroundColor: grey[500],
        "&:hover": {
            backgroundColor: grey[300],
        },
    },
}));

export const StyledDataGrid = React.memo(MyDataGrid, (prevProps, nextProps) => {
    // Only re-render if gridData or columns change
    return prevProps.rows === nextProps.rows
        && prevProps.columns === nextProps.columns
        && prevProps.rowSelectionModel === nextProps.rowSelectionModel;
});