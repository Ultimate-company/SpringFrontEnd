import {useOutletContext} from "react-router-dom";
import {getURLParamValue, isEditMode, isViewMode} from "Frontend/components/commonHelperFunctions";
import {packageApi} from "Frontend/api/ApiCalls";
import {Package} from "Frontend/api/Models/CarrierModels/Package";
import React from "react";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import {Grid} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";

const AddOrEditPackage = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    const [length, setLength] = React.useState<number>(0);
    const [breadth, setBreadth] = React.useState<number>(0);
    const [height, setHeight] = React.useState<number>(0);
    const [pricePerQuantity, setPricePerQuantity] = React.useState<number>(0.0);
    const [quantity, setQuantity] = React.useState<number>(0);

    // misc state variables
    const [notes, setNotes] = React.useState<string>("");

    // local variables
    const isEdit = isEditMode("packageId");
    const isView = isViewMode("packageId");
    let packageId = (isEdit || isView) ? parseInt(getURLParamValue("packageId") as string) : null;

    // function to fetch package details by id
    const handleFetchPackageDetailsById = (pickupLocationId: number) => {
        packageApi(setLoading).getPackageById(pickupLocationId).then((_package: Package) => {
            // set package details
            setLength(_package.length);
            setBreadth(_package.breadth);
            setHeight(_package.height);
            setQuantity(_package.quantity);
            setPricePerQuantity(_package.pricePerQuantity);
            setNotes(_package.notes ?? "");
        });
    }

    // function to create/edit package
    const handleSubmit = () => {
        let requestData: Package = {
            length: length,
            breadth: breadth,
            height: height,
            quantity: quantity,
            pricePerQuantity: pricePerQuantity,
            notes: notes,
            packageId: isEdit ? packageId as number : undefined,
        }

        if(isEdit) {
            packageApi(setLoading).updatePackage(requestData).then(() => {});
        }
        else {
            packageApi(setLoading).createPackage(requestData).then(() => {});
        }
    }

    React.useEffect(() => {
        if(isView || isEdit) {
            handleFetchPackageDetailsById(packageId as number);
        }
    }, []);

    return (
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle="Package Details"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.NumberField}
                        label="Length in Inches"
                        value={length.toString()}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLength(parseInt(event.target.value)), [length])}
                        isView={isView}
                        disabled={isView || isEdit}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.NumberField}
                        label="Breadth in Inches"
                        value={breadth.toString()}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setBreadth(parseInt(event.target.value)), [breadth])}
                        isView={isView}
                        disabled={isView || isEdit}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.NumberField}
                        label="Height in Inches"
                        value={height.toString()}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setHeight(parseInt(event.target.value)), [height])}
                        isView={isView}
                        disabled={isView || isEdit}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.NumberField}
                        label="Quantity"
                        value={quantity.toString()}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(event.target.value)), [quantity])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.AmountField}
                        label="Price Per Quantity"
                        value={pricePerQuantity.toString()}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPricePerQuantity(parseFloat(event.target.value)), [pricePerQuantity])}
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

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="packageId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.packages}
                    buttonText="Package"
                />
            }
        </OutletLayout>
    );
}

export default AddOrEditPackage;