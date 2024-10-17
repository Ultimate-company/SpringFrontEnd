import React from "react";
import {
    Grid
} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import {dataApi} from "Frontend/api/ApiCalls";
import BodyText from "Frontend/components/Fonts/BodyText";

interface FontStylesProps {
    fontSize: string;
    setFontSize: (fontSize: string) => void;
    fontStyle: string;
    setFontStyle: (fontStyle: string) => void;
    fontColor: string;
    setFontColor: (fontColor: string) => void;
    isView: boolean;
    setLoading: (loading: boolean) => void;
    title: string;
}

const FontStyles: React.FC<FontStylesProps> = (props: FontStylesProps) => {
    const [fontStyleOptions, setFontStyleOptions] = React.useState<DataItem[]>([]);

    React.useEffect(() => {
        dataApi(props.setLoading).getFontStyles()
            .then((response: DataItem[]) => {
                setFontStyleOptions(response);
            });
    }, []);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12}>
                <BodyText text={props.title} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <RenderInput
                    required={true}
                    fullWidth={true}
                    inputType={InputType.Dropdown}
                    label="Font size"
                    value={props.fontSize || ''}
                    handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => props.setFontSize(event.target.value), [props.fontSize])}
                    data={Array.from({ length: 99 }, (_, i) => {
                        const number = (i + 1).toString();
                        return {
                            key: number,
                            value: number,
                            title: number,
                        } as DataItem;
                    })}
                    isView={props.isView}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <RenderInput
                    required={true}
                    fullWidth={true}
                    inputType={InputType.Dropdown}
                    label="Font Style"
                    value={props.fontStyle || ''}
                    handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => props.setFontStyle(event.target.value), [props.fontStyle])}
                    data={fontStyleOptions}
                    isView={props.isView}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <RenderInput
                    required={true}
                    fullWidth={true}
                    inputType={InputType.ColorPicker}
                    label="Font Color"
                    value={props.fontColor || ''}
                    handleChange={React.useCallback((newValue:string) => props.setFontColor(newValue), [props.fontColor])}
                    isView={props.isView}
                />
            </Grid>
        </Grid>
    );
};

export default FontStyles;