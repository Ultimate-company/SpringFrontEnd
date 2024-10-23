import React from 'react';
import {
    Container, Grid,
    Pagination,
} from "@mui/material";
import {carrierApi} from "Frontend/api/ApiCalls";
import {Carrier} from "Frontend/api/Models/CentralModels/Carrier";
import Header from "Frontend/components/Fonts/Header";
import SubHeader from "Frontend/components/Fonts/SubHeader";
import TextFieldInput from "Frontend/components/FormInputs/TextFieldInput";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import ImageGridLayout from "Frontend/components/Layouts/ImageGridLayout";
import {PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import {carrierUrls} from "Frontend/api/Endpoints";
import MuiPagination from "@mui/material/Pagination";

// state definition for the page
const paginatedGridModel: PaginatedGridInterface = {
    start: 0,
    end: 9,
    pageSize: 9,
    includeDeleted: false,
    data: [],
    totalPaginationBlockCount: 0,
    actualDataCount: 0,
    filterExpr: {
        columnName: "",
        condition: "",
        filterText: ""
    }
}

const carrierLanding = () => {
    // state variables
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [debouncedValue, setDebouncedValue] = React.useState<string>(state.filterExpr.filterText);

    // function which will take start and end and will get the carrier in batches from the database
    const setCarriersAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        carrierApi.getCarriers(paginationRequestModel.start, paginationRequestModel.end, paginationRequestModel.filterExpr.filterText)
            .then((response: PaginationBaseResponseModel<Carrier>) => {
                setState({
                    ...state,
                    start: paginationRequestModel.start,
                    end: paginationRequestModel.end,
                    data: response.data,
                    actualDataCount: response.totalDataCount ?? 0,
                    totalPaginationBlockCount: Math.ceil(
                        response.totalDataCount / state.pageSize
                    ),
                });
            });
    };

    // Create a debounced version of handleChange
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        // Update the state with the new filter text
        setState({
            ...state,
            filterExpr: {
                ...state.filterExpr,
                filterText: value
            }
        });
    }

    React.useEffect(() => {
        setCarriersAndPagination(paginatedGridModel);
    }, []);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(state.filterExpr.filterText); // Update value after 2 seconds
        }, 2000);

        return () => {
            clearTimeout(handler);
        };
    }, [state.filterExpr.filterText]);

    React.useEffect(() => {
        setCarriersAndPagination({ ...state, filterExpr: { ...state.filterExpr, filterText: debouncedValue } });
    }, [debouncedValue]);

    return(
        <Container maxWidth="xl" style={{border: "1px solid black", padding: "100px"}}>
            <Header label="Carriers"/>
            <SubHeader text="Select your carrier"/><br/>
            <TextFieldInput
                fullWidth={true}
                required={true}
                placeholder="Search"
                label="Carrier"
                name="filterText"
                value={state.filterExpr.filterText}
                onChange={handleChange}
            /><br/><br/>
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ImageGridLayout
                    itemsPerRow={3}
                    totalRows={3}
                    data={state.data.map((carrier) => ({
                        src: carrierUrls.getCarrierImage + `?carrierId=${carrier.carrierId}`,
                        name: carrier.name,
                        id: carrier.carrierId,
                    }))}
                    onItemClick={(carrierId) => carrierApi.setCarrier(carrierId)}
                /> <br/>
                <Grid container justifyContent="space-between" alignItems="center" item md={12} xs={12}>
                    <Grid item>
                        Showing {state.start + 1} - {Math.min(state.end, state.actualDataCount)} of {state.actualDataCount} records
                    </Grid>
                    <Grid item>
                        <MuiPagination
                            color="primary"
                            size="large"
                            variant="outlined"
                            shape="rounded"
                            count={state.totalPaginationBlockCount}
                            onChange={(event, newPage) => {
                                setCarriersAndPagination({
                                    start: (newPage - 1) * state.pageSize,
                                    end: newPage * state.pageSize,
                                    filterExpr: {
                                        filterText: state.filterExpr.filterText
                                    }
                                } as PaginatedGridInterface);
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Container>
    );
}
export default carrierLanding;
