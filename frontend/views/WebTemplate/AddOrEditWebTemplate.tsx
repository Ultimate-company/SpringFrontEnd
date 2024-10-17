import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import React from "react";
import {Grid} from "@mui/material";
import {useOutletContext} from "react-router-dom";
import {getURLParamValue, isEditMode, isViewMode} from "Frontend/components/commonHelperFunctions";
import {dataApi, webTemplateApi} from "Frontend/api/ApiCalls";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import FontStyles from "Frontend/views/WebTemplate/Components/FontStyles";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import {
    WebTemplate,
    WebTemplateRequestModel, WebTemplateResponseModel,
    WebTemplatesFontStyle
} from "Frontend/api/Models/CarrierModels/WebTemplate";
import {GridRowSelectionModel} from "@mui/x-data-grid";
import ProductSelectionGrid from "Frontend/components/DataGridsForSelection/ProductSelectionGrid";

const AddOrEditWebTemplate = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // webtemplate state variables
    const [url, setUrl] = React.useState<string>("");
    const [payment, setPayment] = React.useState<{ id: string; label: string; }[]>([]);
    const [paymentOptions, setPaymentOptions] = React.useState<{ [key: string]: { label: string; value: string }[] }>({});

    const [filter, setFilter] = React.useState<{ id: string; label: string; }[]>([]);
    const [filterOptions, setFilterOptions] = React.useState<DataItem[]>([]);

    const [sort, setSort] = React.useState<{ id: string; label: string; }[]>([]);
    const [sortOptions, setSortOptions] = React.useState<DataItem[]>([]);

    const [stateCityMapping, setStateCityMapping] = React.useState<{ id: string; label: string; }[]>([]);
    const [stateCityMappingOptions, setStateCityMappingOptions] = React.useState<{ [key: string]: string[] }>({});

    const [headerFontSize, setHeaderFontSize] = React.useState<string>("");
    const [headerFontStyle, setHeaderFontStyle] = React.useState<string>("");
    const [headerFontColor, setHeaderFontColor] = React.useState<string>("#000000");

    const [cardHeaderFontSize, setCardHeaderFontSize] = React.useState<string>("");
    const [cardHeaderFontStyle, setCardHeaderFontStyle] = React.useState<string>("");
    const [cardHeaderFontColor, setCardHeaderFontColor] = React.useState<string>("#000000");

    const [cardSubTextFontSize, setCardSubTextFontSize] = React.useState<string>("");
    const [cardSubTextFontStyle, setCardSubTextFontStyle] = React.useState<string>("");
    const [cardSubTextFontColor, setCardSubTextFontColor] = React.useState<string>("#000000");

    const [selectedProductIds, setSelectedProductIds] = React.useState<GridRowSelectionModel>([]);

    // misc state variables
    const [notes, setNotes] = React.useState<string>("");

    // local variables
    const isEdit = isEditMode("webTemplateId");
    const isView = isViewMode("webTemplateId");
    const webUrl = "ultimatecompany.dev.com";
    let webTemplateId = (isEdit || isView) ? parseInt(getURLParamValue("webTemplateId") as string) : null;

    const formatOptionsForAutoComplete = (options: { [key: string]: { label: string; value: string; }[] }) => {
        // Convert object to the desired format
        const formattedOptions: { group?: string; items: { id: string; label: string }[] }[] = [];

        for (const groupKey in options) {
            if (options.hasOwnProperty(groupKey)) {
                // Flatten the array to extract { id: string; label: string } format
                const flattenedOptions: { id: string; label: string }[] = [];

                const mapsArray = options[groupKey];
                mapsArray.forEach(map => {
                    flattenedOptions.push({ id: groupKey + ":" + map.value, label: map.label });
                });

                // Add to formatted options
                formattedOptions.push({
                    group: groupKey, // Optionally include the group name
                    items: flattenedOptions
                });
            }
        }

        return formattedOptions;
    };

    const formatOptionsForStateCityMapping = (options: { [key: string]: string[] }) => {
        // Convert Map<string, string[]> to the desired format
        const formattedOptions: { group?: string; items: { id: string; label: string }[] }[] = [];

        Object.keys(options).forEach(groupKey => {
            const values = options[groupKey];
            const items = values.map(value => ({
                id: groupKey + ":" + value,
                label: value,
            }));

            formattedOptions.push({
                group: groupKey,
                items,
            });
        });

        return formattedOptions;
    };

    const handleSubmit = () => {
        const stateCitiesMapping: Map<string, string[]> = stateCityMapping.reduce((map, item) => {
            const [key, value] = item.id.split(":");
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)?.push(value);
            return map;
        }, new Map<string, string[]>());

        let requestData = {
            sortOptions: sort.map(s => s.id),
            filterOptions: filter.map(s => s.id),
            selectedProductIds: selectedProductIds.map(productId => parseInt(productId.toString())),
            stateCityMapping: Object.fromEntries(stateCitiesMapping),
            acceptedPaymentOptions: payment.map(p => p.id),
            webTemplate: {
                webTemplateId: isEdit ? webTemplateId as number : undefined,
                url: `https://${url}.${webUrl}`,
                notes: notes
            } as WebTemplate,
            headerFontStyle: {
                fontSize: parseInt(headerFontSize),
                fontStyle: headerFontStyle,
                fontColor: headerFontColor
            } as WebTemplatesFontStyle,
            cardHeaderFontStyle: {
                fontSize: parseInt(cardHeaderFontSize),
                fontStyle: cardHeaderFontStyle,
                fontColor: cardHeaderFontColor
            } as WebTemplatesFontStyle,
            cardSubTextFontStyle: {
                fontSize: parseInt(cardSubTextFontSize),
                fontStyle: cardSubTextFontStyle,
                fontColor: cardSubTextFontColor
            } as WebTemplatesFontStyle,
        } as WebTemplateRequestModel;

        if(isEdit) {
            webTemplateApi(setLoading).updateWebTemplate(requestData).then(() => {});
        }
        else{
            webTemplateApi(setLoading).insertWebTemplate(requestData).then(() => {});
        }
    };

    React.useEffect(() => {
        dataApi(setLoading).getPaymentOptions()
            .then((response: { [key: string]: { label: string; value: string }[] }) => {
                setPaymentOptions(response);
            });

        dataApi(setLoading).getFilterOptions()
            .then((response: DataItem[]) => {
                setFilterOptions(response);
            });

        dataApi(setLoading).getSortOptions()
            .then((response: DataItem[]) => {
                setSortOptions(response);
            });

        dataApi(setLoading).getStateCityMappingOptions()
            .then((response: { [key: string]: string[] }) => {
                setStateCityMappingOptions(response);
            });

        if(isEdit) {
            webTemplateApi(setLoading).getWebTemplateById(webTemplateId as number)
                .then((response: WebTemplateResponseModel) => {
                    console.log(response);
                });
        }
    }, []);

    return (
        <OutletLayout card={false}>
            <SectionLayout
                sectionSubTitle="Deployable URL"
                sectionTitle="Enter a deployable url"
            >
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="URL"
                        value={url}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setUrl(event.target.value), [url])}
                        isView={isView}
                    />
                    <span>https://{url}.{webUrl}</span>
                </Grid>
            </SectionLayout><br/>
            <SectionLayout
                sectionSubTitle="User Input Options"
                sectionTitle="Customize user input options"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.MultipleAutoCompleteDropdown}
                        isView={isView}
                        required={true}
                        fullWidth={true}
                        label="Payment Options"
                        value={payment}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>,  newValue: { id: string; label: string; }[]) => setPayment(newValue), [payment])}
                        autoCompleteOptions={formatOptionsForAutoComplete(paymentOptions)}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.MultipleAutoCompleteDropdown}
                        isView={isView}
                        required={true}
                        fullWidth={true}
                        label="Service State and cities"
                        value={stateCityMapping}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>,  newValue: { id: string; label: string; }[]) => setStateCityMapping(newValue), [stateCityMapping])}
                        autoCompleteOptions={formatOptionsForStateCityMapping(stateCityMappingOptions)}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.MultipleAutoCompleteDropdown}
                        isView={isView}
                        required={true}
                        fullWidth={true}
                        label="Filter Options"
                        value={filter}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>,  newValue: { id: string; label: string; }[]) => setFilter(newValue), [filter])}
                        autoCompleteOptions={filterOptions ? [{ items: filterOptions.map(item => ({ id: item.key, label: item.title })) }] : []}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.MultipleAutoCompleteDropdown}
                        isView={isView}
                        required={true}
                        fullWidth={true}
                        label="Sort Options"
                        value={sort}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>,  newValue: { id: string; label: string; }[]) => setSort(newValue), [sort])}
                        autoCompleteOptions={sortOptions ? [{ items: sortOptions.map(item => ({ id: item.key, label: item.title })) }] : []}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionSubTitle="Fonts"
                sectionTitle="Customize user interface options"
            >
                <Grid item md={6} xs={12}>
                    <FontStyles
                        fontSize = {headerFontSize}
                        setFontSize = {setHeaderFontSize}
                        fontStyle = {headerFontStyle}
                        setFontStyle = {setHeaderFontStyle}
                        fontColor = {headerFontColor}
                        setFontColor = {setHeaderFontColor}
                        isView = {isView}
                        setLoading = {setLoading}
                        title = "Header Fonts"
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <FontStyles
                        fontSize = {cardHeaderFontSize}
                        setFontSize = {setCardHeaderFontSize}
                        fontStyle = {cardHeaderFontStyle}
                        setFontStyle = {setCardHeaderFontStyle}
                        fontColor = {cardHeaderFontColor}
                        setFontColor = {setCardHeaderFontColor}
                        isView = {isView}
                        setLoading = {setLoading}
                        title = "Card Header Fonts"
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <FontStyles
                        fontSize = {cardSubTextFontSize}
                        setFontSize = {setCardSubTextFontSize}
                        fontStyle = {cardSubTextFontStyle}
                        setFontStyle = {setCardSubTextFontStyle}
                        fontColor = {cardSubTextFontColor}
                        setFontColor = {setCardSubTextFontColor}
                        isView = {isView}
                        setLoading = {setLoading}
                        title = "Card Sub Text Fonts"
                    />
                </Grid>
            </SectionLayout> <br/>

            <SectionLayout
                sectionTitle="Products"
                sectionSubTitle="Select products."
            >
                <Grid item md={12} xs={12}>
                    <ProductSelectionGrid
                        showCheckboxSelection={true}
                        isView={isView}
                        setLoading={setLoading}
                        selectedProductIds={selectedProductIds}
                        setSelectedProductIds={React.useCallback((selectedProductIds: GridRowSelectionModel) => setSelectedProductIds(selectedProductIds), [selectedProductIds])}
                        singleSelection={false}
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

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="webTemplateId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.webTemplates}
                    buttonText="Web Tempalte"
                />
            }
        </OutletLayout>
    );
}

export default AddOrEditWebTemplate;