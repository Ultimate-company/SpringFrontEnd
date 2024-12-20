import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMapMarkerAlt, faPhoneAlt, faEnvelope, faX,} from '@fortawesome/free-solid-svg-icons';
import {faFacebookF, faInstagram, faLinkedinIn, faThreads} from '@fortawesome/free-brands-svg-icons';


const DashboardFooter = () => {
    return (
        <Box sx={{ bgcolor: '#020e33', padding: '20px 0', color: '#fff' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Popular Categories */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #ff0000', paddingBottom: '5px' }}>
                            Popular Categories
                        </Typography>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li>Fashion</li>
                            <li>Electronic</li>
                            <li>Cosmetic</li>
                            <li>Health</li>
                            <li>Watches</li>
                        </ul>
                    </Grid>

                    {/* Products */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #ff0000', paddingBottom: '5px' }}>
                            Products
                        </Typography>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li>Prices Drop</li>
                            <li>New Products</li>
                            <li>Best Sales</li>
                            <li>Contact Us</li>
                            <li>Sitemap</li>
                        </ul>
                    </Grid>

                    {/* Our Company */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #ff0000', paddingBottom: '5px' }}>
                            Our Company
                        </Typography>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li>Delivery</li>
                            <li>Legal Notice</li>
                            <li>Terms and Conditions</li>
                            <li>About Us</li>
                            <li>Secure Payment</li>
                        </ul>
                    </Grid>

                    {/* Services */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #ff0000', paddingBottom: '5px' }}>
                            Services
                        </Typography>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li>Prices Drop</li>
                            <li>New Products</li>
                            <li>Best Sales</li>
                            <li>Contact Us</li>
                            <li>Sitemap</li>
                        </ul>
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #ff0000', paddingBottom: '5px' }}>
                            Contact
                        </Typography>
                        <div>
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> 419 State 414 Rte Beaver Dams, New York(NY), 14812, USA
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faPhoneAlt} /> (607) 936-8058
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faEnvelope} /> Example@Gmail.Com
                        </div>
                    </Grid>
                </Grid>

                {/* Payment Methods */}

                <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <FontAwesomeIcon icon={faInstagram} size="xl" style={{ margin: '0 10px', color: '#e4405f' }} />
                    <FontAwesomeIcon icon={faLinkedinIn} size="xl" style={{ margin: '0 10px', color: '#74d6f9' }} />
                    <FontAwesomeIcon icon={faFacebookF} size="xl" style={{ margin: '0 10px', color: '#74d6f9' }} />
                    <FontAwesomeIcon icon={faX} size="xl" style={{ margin: '0 10px', color: '#ffffff' }} />
                    <FontAwesomeIcon icon={faThreads} size="xl" style={{ margin: '0 10px', color: '#ffffff' }} />
                </Box>

                {/* Copyright */}
                <Box sx={{ textAlign: 'center', margin: '10px 0', fontSize: '0.9rem' }}>
                    <Typography variant="body2">
                        Copyright © Ultimate Company All Rights Reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default DashboardFooter;