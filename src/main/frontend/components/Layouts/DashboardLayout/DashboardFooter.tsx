import React from 'react';
import { Container, Link, Typography, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';

const DashboardFooter = () => {
    return (
        <Box
            sx={{
                bgcolor: 'green',
                position: 'relative',
                bottom: 0,
                width: '100%',
            }}
        >
            <Container maxWidth="md" sx={{ mt: 1, mb: 2 }}>
                <Typography variant="body1" color="text.secondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="https://www.nereus.com/">
                        Nereus
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
                <Typography variant="body1" align="center">
                    <Link color="inherit" href="https://www.facebook.com/Nereus-103365521513335/">
                        <FontAwesomeIcon icon={faFacebookF} size="xs" />
                    </Link>{' '}
                    <Link color="inherit" href="https://twitter.com/nereus">
                        <FontAwesomeIcon icon={faTwitter} size="xs" />
                    </Link>{' '}
                    <Link color="inherit" href="https://www.linkedin.com/company/nereus-technologies/">
                        <FontAwesomeIcon icon={faLinkedinIn} size="xs" />
                    </Link>
                    <Link color="inherit" href="https://www.linkedin.com/company/nereus-technologies/">
                        <FontAwesomeIcon icon={faInstagram} size="xs" />
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
};

export default DashboardFooter;