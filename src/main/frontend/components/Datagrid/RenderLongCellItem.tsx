import React from "react";
import { Tooltip } from "@mui/material";

interface RenderLongCellItemProps {
    value: string;
    columnWidth: number;
}

const RenderLongCellItem: React.FC<RenderLongCellItemProps> = ({ value, columnWidth }) => {
    const [isOverflowing, setIsOverflowing] = React.useState(false);
    const textRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (textRef.current) {
            // Check if the content overflows the 80% width of the column
            setIsOverflowing(textRef.current?.scrollWidth > textRef.current?.offsetWidth);
        }
    }, [columnWidth, value]);

    columnWidth = columnWidth - 80;
    const textWidth = columnWidth * 0.9; // 80% for text
    const seeMoreWidth = columnWidth * 0.1; // 20% for "See More"

    return (
        <div style={{ display: "flex", alignItems: "center", width: `${columnWidth}px` }}>
            {/* 80% Text Div */}
            <div
                ref={textRef}
                style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: `${textWidth}px`,
                }}
            >
                {value}
            </div>
            {/* 20% See More Div */}
            {isOverflowing && (
                <div
                    style={{
                        width: `${seeMoreWidth}px`,
                        textAlign: "left",
                        paddingLeft: "5px",
                        flexShrink: 0, // Prevent shrinking of the "See More" section
                    }}
                >
                    <Tooltip title={value}>
                        <span style={{ color: "blue", cursor: "pointer" }}>See More</span>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default RenderLongCellItem;