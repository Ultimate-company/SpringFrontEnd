import {Rating, Box, Grid} from "@mui/material";
import React from "react";
import StarIcon from '@mui/icons-material/Star';

export interface RatingInputProps {
   value: number;
   precision: number;
   setValue: any;
   label: string;
}

const getLabelText = (value: number) => {
    if (value >= 0 && value < 0.5) return 'Useless';
    if (value >= 0.5 && value < 1) return 'Useless+';
    if (value >= 1 && value < 1.5) return 'Poor';
    if (value >= 1.5 && value < 2) return 'Poor+';
    if (value >= 2 && value < 2.5) return 'Ok';
    if (value >= 2.5 && value < 3) return 'Ok+';
    if (value >= 3 && value < 3.5) return 'Good';
    if (value >= 3.5 && value < 4) return 'Good+';
    if (value >= 4 && value < 4.5) return 'Excellent';
    if (value >= 4.5 && value <= 5) return 'Excellent+';

    return "";
}

const RatingInput = (props: RatingInputProps) => {
    const [hover, setHover] = React.useState<number>(-1);
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {props.label} &nbsp;&nbsp;
                    <Rating
                        name="half-rating"
                        size="large"
                        defaultValue={props.value}
                        precision={props.precision}
                        onChange={(event, newValue) => {
                            props.setValue(newValue);
                        }}
                        onChangeActive={(event, newHover) => {
                            setHover(newHover);
                        }}
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                </Grid>
                <Grid item xs={6} style={{paddingTop:20}}>
                    <div>
                         <span style={{}}>{getLabelText(hover !== -1 ? hover : props.value)}</span>
                    </div>
                    <div>
                        {hover !== -1 ? hover : props.value}
                    </div>
                </Grid>
            </Grid>
        </>

    );

}

export default RatingInput;