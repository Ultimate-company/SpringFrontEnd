import {Card, CardContent} from "@mui/material";
import {getURLParamValue} from "Frontend/components/commonHelperFunctions";
import BlueButton from "Frontend/components/FormInputs/BlueButton";
import RedButton from "Frontend/components/FormInputs/RedButton";

interface ActionFooterFooterProps {
    paramValue?: string;
    handleSubmit: () => void;
    buttonText?: string;
    customButtonText?: string;
    cancelUrl: string;
}

const ActionFooter = (props: ActionFooterFooterProps) => (
    <Card>
        <CardContent>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <div>
                    {
                        props.paramValue !== undefined &&
                        getURLParamValue(props.paramValue) !== undefined &&
                        getURLParamValue(props.paramValue) !== null &&
                        getURLParamValue(props.paramValue) !== '' ? (
                        <BlueButton
                            label = {props.customButtonText ? props.customButtonText : "Edit " + props.buttonText}
                            handleSubmit={props.handleSubmit}
                        />
                        ) : (
                            <BlueButton
                                label = {props.customButtonText ? props.customButtonText : "Add " + props.buttonText}
                                handleSubmit={props.handleSubmit}
                            />
                        )
                    }
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <RedButton
                        label = "Cancel"
                        handleSubmit={() => {
                            window.location.href = props.cancelUrl;
                        }}
                    />
                </div>
            </div>
        </CardContent>
    </Card>
);

export default ActionFooter;
