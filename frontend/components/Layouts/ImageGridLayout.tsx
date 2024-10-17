import React from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

interface ImageGridLayoutProps {
    data: {
        src: string;
        name: string;
        id: number;
    }[];
    itemsPerRow: number;
    totalRows: number;
    onItemClick?: (id: number) => void;
};

const ImageGridLayout = (props: ImageGridLayoutProps) => {
    const handleItemClick = (id:number) => {
        if (props.onItemClick) {
            props.onItemClick(id);
        }
    };

    return (
        <Grid container spacing={5}>
            {props.data.slice(0, props.itemsPerRow * props.totalRows).map((item) => (
                <Grid item key={item.id} xs={12 / props.itemsPerRow} sx={{ maxWidth: '100%' }}>
                    <Card>
                        <CardActionArea onClick={() => handleItemClick(item.id)}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.src}
                                alt={item.name}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} // Ensure the image fits the container
                            />
                            <CardContent>
                                <Typography variant="body2" component="p">
                                    {item.name}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ImageGridLayout;
