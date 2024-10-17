import React from 'react';
import parse from "html-react-parser";
import { FormTooltip } from "Frontend/components/FormInputs/FormTooltip";

interface RenderLongCellItemProps {
    value: string;
    html?: string
    length?: number;
}

const RenderLongCellItem: React.FC<RenderLongCellItemProps> = ({ value, html, length = 25 }) => {
    if (!value) return null;

    const shouldTruncate = value.length > length;
    const tooltipContent = html && html.length > 0 ? html : value;

    return (
        <div className="MuiDataGrid-cellContent">
            {shouldTruncate ? (
                <FormTooltip
                    title={
                        <React.Fragment>
                            <div className="MuiDataGrid-cellContent">
                                {parse(tooltipContent)}
                            </div>
                        </React.Fragment>
                    }
                >
                    <p style={{margin: 5}}>
                        {parse(value.substring(0, length))}...
                        <span style={{ color: "blue" }}>&nbsp;&nbsp;&nbsp;See More</span>
                    </p>
                </FormTooltip>
            ) : (
                parse(value)
            )}
        </div>
    );
}

export default RenderLongCellItem;
