import {useOutletContext} from "react-router-dom";
import React from "react";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import {Grid} from "@mui/material";
import {getURLParamValue, isEditMode, isViewMode} from "Frontend/components/commonHelperFunctions";
import {promoApi} from "Frontend/api/ApiCalls";
import { Promo } from "Frontend/api/Models/CarrierModels/Promo";

const AddOrEditPromo = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // state variables for lead personal details
    const [promoCode, setPromoCode] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [isPercent, setIsPercent] = React.useState<boolean>(false);
    const [discountValue, setDiscountValue] = React.useState<number>(0);

    // local variables
    const isEdit = isEditMode("promoId");
    const isView = isViewMode("promoId");
    let promoId = (isEdit || isView) ? parseInt(getURLParamValue("promoId") as string) : null;

    // function to fetch lead details by id
    const handleFetchPromoDetailsById = (promoId: number) => {
        promoApi(setLoading).getPromoDetailsById(promoId).then((promo: Promo) => {
            // set the promo details
            setPromoCode(promo.promoCode);
            setDescription(promo.description);
            setIsPercent(promo.percent);
            setDiscountValue(promo.discountValue);
        });
    }

    const handleSubmit = () => {
        let requestData : Promo = {
            promoCode: promoCode,
            description: description,
            percent: isPercent,
            discountValue: discountValue
        }
        promoApi(setLoading).createPromo(requestData).then(() => {});
    }

    React.useEffect(() => {
        if(isEdit || isView) {
            handleFetchPromoDetailsById(promoId as number);
        }
    }, [])

    return (
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle = "Promo Details"
                 sectionSubTitle = "This information can not be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Promo Code"
                        value={promoCode}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPromoCode(event.target.value), [promoCode])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.NumberField}
                        label="Discount Value"
                        value={discountValue.toString()}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setDiscountValue(parseFloat(event.target.value)), [discountValue])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Checkbox}
                        label="Is Percent"
                        checked={isPercent}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setIsPercent(event.target.checked), [isPercent])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.TextArea}
                        label="Description"
                        value={description}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value), [description])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="promoId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.promos}
                    buttonText="Promo"
                />
            }
        </OutletLayout>
    );
}
export default AddOrEditPromo;