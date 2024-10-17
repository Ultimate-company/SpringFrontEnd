import React from "react";
import {
    RichTextEditor,
} from "mui-tiptap";
import useExtensions from "Frontend/components/RichTextAreaComponents/useExtensions";
import EditorMenuControls from "Frontend/components/RichTextAreaComponents/EditorMenuControls";

export interface RichTextAreaInputProps {
    label: string;
    rteRef: any;
    onCreated?: any;
    name: string;
}

const RichTextAreaInput = (props: RichTextAreaInputProps) => {
    const extensions = useExtensions({
        placeholder: props.label,
    });
    return (
        <div id={props.name}>
            <RichTextEditor
                onCreate = {props.onCreated}
                ref={props.rteRef}
                extensions={extensions}
                renderControls={() => <EditorMenuControls />}
            />
        </div>

    );
}

export default RichTextAreaInput;