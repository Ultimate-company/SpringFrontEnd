import React from 'react';
import { createSvgIcon } from '@mui/material/utils';

const LogoIcon = createSvgIcon(
    // credit: plus icon from https://heroicons.com/
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.98 92.12"><title>&#x8D44;&#x6E90; 116</title>
        <path
            d="M6.46 69.53c3.17 2.5 6.37 4.94 10.19 6.36 13.43 5 26 3.14 37.2-5.58A22.62 22.62 0 0 0 62.52 52c.09-15.33 0-30.65 0-46 0-3.81.25-4.16 4-3.33C79 5.47 87.64 14.76 87.88 27.38c.17 8.26.08 16.53 0 24.79a39.38 39.38 0 0 1-31.35 38.47c-10.38 2.29-20.47 2.18-30.31-2.12a44.12 44.12 0 0 1-20-17.6A3.08 3.08 0 0 1 6 70z"
            fill="#0bf"/>
        <path
            d="M0 23.1V3.46C0 .3.65-.42 3.62.2c12.16 2.55 21.27 11 21.7 24.33.25 7.74.11 15.5 0 23.26-.08 6.65 2.25 12 7.7 16 2 1.44 1.88 2.15-.37 3.16-7.94 3.54-20.48.89-26.83-7.16C1.79 54.67.3 48.77.1 42.48-.1 36 .06 29.56.06 23.1z"
            fill="#5592ff"/>
    </svg>,
    'Logo',
);
const Logo = () => (
    <LogoIcon style={{width:48, height:48}}/>
);
export default Logo;