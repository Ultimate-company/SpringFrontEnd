import React from 'react';
import styled from 'styled-components';
import { N0, N900, N70 } from '@atlaskit/theme/colors';
import Button from '@atlaskit/button';
export const ErrorPopup = styled.div `
  width: 290px;
  padding: 16px;
  background-color: ${N0};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
export const ErrorIconWrapper = styled.div `
  width: 92px;
`;
export const ErrorMessage = styled.div `
  color: ${N900};
  margin-top: 16px;
  margin-bottom: 4px;
  width: 256px;
  text-align: center;
  font-weight: bold;
`;
export const ErrorHint = styled.div `
  color: ${N70};
  margin-top: 4px;
  margin-bottom: 20px;
  width: 256px;
  text-align: center;
`;
export const ErrorButton = (props) => (React.createElement(Button, Object.assign({}, props, { theme: (currentTheme, themeProps) => {
        const { buttonStyles, ...rest } = currentTheme(themeProps);
        return {
            buttonStyles: {
                ...buttonStyles,
                display: 'inline-flex',
                width: '84px',
                margin: '2px',
                justifyContent: 'center',
            },
            ...rest,
        };
    } })));
//# sourceMappingURL=styles.js.map