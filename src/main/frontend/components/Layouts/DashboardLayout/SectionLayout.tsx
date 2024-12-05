import {Card, CardContent, CardHeader, Divider, Grid} from '@mui/material';
import React, {ReactNode} from 'react';

interface SectionLayoutProps {
    children: ReactNode;
    sectionSubTitle: string;
    sectionTitle: string;
}

const SectionLayout = (props: SectionLayoutProps) => {
    return (
        <Card>
            <CardHeader
                subheader={props.sectionSubTitle}
                title={props.sectionTitle}/>
            <Divider/>

            <CardContent>
                <Grid container spacing={3}>
                    {props.children}
                </Grid>
            </CardContent>
        </Card>
    );
};
export default SectionLayout;
