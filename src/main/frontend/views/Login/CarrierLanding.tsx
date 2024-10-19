import React from 'react';
import {
    Container,
    Pagination,
} from "@mui/material";
import {carrierApi, loginApi} from "Frontend/api/ApiCalls";
import {Carrier} from "Frontend/api/Models/CentralModels/Carrier";
import Header from "Frontend/components/Fonts/Header";
import SubHeader from "Frontend/components/Fonts/SubHeader";
import TextFieldInput from "Frontend/components/FormInputs/TextFieldInput";
import {PaginationBaseResponseModel} from "Frontend/api/Models/BaseModel";
import ImageGridLayout from "Frontend/components/Layouts/ImageGridLayout";
import {PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import {carrierUrls} from "Frontend/api/Endpoints";

// state definition for the page
const paginatedGridModel: PaginatedGridInterface = {
    start: 0,
    end: 6,
    pageSize: 6,
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

    // function which will take start and end and will get the carrier in batches from the database
    const setCarriersAndPagination = (paginationRequestModel: PaginatedGridInterface) => {
        carrierApi.getCarriers(paginationRequestModel.start, paginationRequestModel.end, paginationRequestModel.filterExpr.filterText)
            .then((response: PaginationBaseResponseModel<Carrier>) => {
                setState({
                    ...state,
                    data: response.data,
                    actualDataCount: response.totalDataCount ?? 0,
                });
            });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setState({
            ...state,
            filterExpr:{
                columnName: "",
                condition: "",
                filterText: value
            }
        });
        if (value.length == 0) {
            setCarriersAndPagination(paginatedGridModel);
        }
        else {
            setCarriersAndPagination(state);
        }
    }

    React.useEffect(() => {
        setCarriersAndPagination(paginatedGridModel);
    }, []);

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
                onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                        setCarriersAndPagination(state);
                    }
                }}/><br/><br/>
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
                        src: carrierUrls.getCarrierImage + `?imageName=${carrier.image}`,
                        name: carrier.name,
                        id: carrier.carrierId,
                    }))}
                    onItemClick={(carrierId) => carrierApi.setCarrier(carrierId)}
                /> <br/>
                <Pagination
                    color="primary"
                    count={state.actualDataCount}
                    size="large"
                    variant="outlined"
                    shape="rounded"
                    siblingCount={5}
                    boundaryCount={3}
                    onChange={(event, value) => {
                        let start = (value - 1) * state.pageSize;
                        let end = (value - 1) * state.pageSize + state.pageSize;

                        setState({
                            ...state,
                            start: start,
                            end: end,
                        });

                        setCarriersAndPagination(state);
                    }}
                    showFirstButton
                    showLastButton
                />
            </Container>
        </Container>
    );
}
export default carrierLanding;
