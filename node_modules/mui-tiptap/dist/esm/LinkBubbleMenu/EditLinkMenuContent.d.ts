import { type Editor } from "@tiptap/core";
import { type ReactNode } from "react";
export type EditLinkMenuContentProps = {
    editor: Editor;
    onCancel: () => void;
    onSave: ({ text, link }: {
        text: string;
        link: string;
    }) => void;
    /** Override default text content/labels used within the component. */
    labels?: {
        /** Menu title shown when adding a new link. */
        editLinkAddTitle?: ReactNode;
        /** Menu title shown when editing an existing link. */
        editLinkEditTitle?: ReactNode;
        /** Label for the input text field to edit the text content of a link. */
        editLinkTextInputLabel?: ReactNode;
        /** Label for the input text field to edit the href (URL) of a link. */
        editLinkHrefInputLabel?: ReactNode;
        /** Content shown in the button used to cancel editing/adding a link. */
        editLinkCancelButtonLabel?: ReactNode;
        /** Content shown in the button used to save when editing/adding a link. */
        editLinkSaveButtonLabel?: ReactNode;
    };
};
/** Shown when a user is adding/editing a Link for Tiptap. */
export default function EditLinkMenuContent({ editor, onCancel, onSave, labels, }: EditLinkMenuContentProps): import("react/jsx-runtime").JSX.Element;
