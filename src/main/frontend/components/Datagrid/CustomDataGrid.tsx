import {styled, alpha} from "@mui/material/styles";
import {DataGrid, DataGridProps, gridClasses} from "@mui/x-data-grid";
import React from "react";
import {grey} from "@mui/material/colors";

const ODD_OPACITY = 0.2;
const MyDataGrid = styled(DataGrid)(({theme}) => ({
    [`& .${gridClasses.row}.odd`]: {
        '&:hover': {
            backgroundColor: alpha(theme.palette.secondary.main, ODD_OPACITY), // Changed to secondary.main
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover': {
                backgroundColor: alpha(
                    theme.palette.secondary.main, // Changed to secondary.main
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[200],
        '&:hover': {
            backgroundColor: alpha(theme.palette.secondary.main, ODD_OPACITY), // Changed to secondary.main
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover': {
                backgroundColor: alpha(
                    theme.palette.secondary.main, // Changed to secondary.main
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },

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

    // Style for the header container
    "& .MuiDataGrid-columnHeader": {
        backgroundColor: alpha("#2e6e4f", 0.8),
        color: "white",
        fontWeight: 'bold',
    },
    "& .MuiDataGrid-sortIcon": {
        color: theme.palette.common.white,  // Set the sort arrow color to white
    },
    "& .MuiDataGrid-menuIcon": {
        color: theme.palette.common.white,  // Set the menu icon color to white
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

export const StyledDataGrid = React.memo(MyDataGrid, (prevProps: DataGridProps, nextProps: DataGridProps) => {
    // Only re-render if gridData or columns change
    return prevProps.rows === nextProps.rows
        && prevProps.columns === nextProps.columns
        && prevProps.columnVisibilityModel === nextProps.columnVisibilityModel
        && prevProps.rowSelectionModel === nextProps.rowSelectionModel
        && prevProps.density === nextProps.density;
});