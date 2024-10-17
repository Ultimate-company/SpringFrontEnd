import BodyText from "Frontend/components/Fonts/BodyText";
import { format } from "date-fns";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import useExtensions from "Frontend/components/RichTextAreaComponents/useExtensions";
import {RichTextReadOnly} from "mui-tiptap";

interface RenderViewProps {
    label: string;
    value: string | Date | undefined ;
    required: boolean;
    richText?: boolean;
}

const RenderView = (props: RenderViewProps) => {
    return (
        <>
            {(() => {
                switch (typeof props.value) {
                    case 'string':
                        if(props.richText) {
                            const extensions = useExtensions({
                                placeholder: "",
                            });
                            return (
                                <><BodyText
                                    text={`<b>${props.label}${props.required ? ':<span style="color: red">*</span>' : ':'} </b>`}/><br/>
                                    <div style={{
                                        borderWidth: 1,
                                        borderStyle: 'solid',
                                        borderColor: 'black',
                                        padding: 20
                                    }}>
                                        <RichTextReadOnly
                                            content={props.value}
                                            extensions={extensions}
                                        />
                                    </div>
                                </>
                            );
                        } else {
                            return (
                                <BodyText text={`<b>${props.label}${props.required ? ':<span style="color: red">*</span>' : ':'} </b>${ReactHtmlParser(props.value)}`} />
                            );
                        }
                    case 'object':
                        return (
                            <BodyText
                                text={`<b>${props.label}${props.required ? ':<span style="color: red">*</span>' : ':'} </b>${format(props.value, 'do MMM yyyy')}`}/>
                        );
                    default:
                        return (
                            <BodyText text={`<b>${props.label}${props.required ? ':<span style="color: red">*</span>' : ':'} </b>`} />
                        );
                }
            })()}
        </>
    );
}

export default React.memo(RenderView);