import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, DialogActions, TextField, Typography } from "@mui/material";
import { getMarkRange, getMarkType } from "@tiptap/core";
import encodeurl from "encodeurl";
import { useCallback, useEffect, useRef, useState, } from "react";
import useKeyDown from "../hooks/useKeyDown";
/** Shown when a user is adding/editing a Link for Tiptap. */
export default function EditLinkMenuContent({ editor, onCancel, onSave, labels, }) {
    var _a, _b, _c, _d, _e, _f;
    const existingHref = editor.isActive("link")
        ? editor.getAttributes("link").href
        : "";
    const linkRange = getMarkRange(editor.state.selection.$from, getMarkType("link", editor.schema));
    const linkText = linkRange
        ? editor.state.doc.textBetween(linkRange.from, linkRange.to)
        : "";
    const selectedText = editor.state.doc.textBetween(editor.state.selection.$from.pos, editor.state.selection.$to.pos);
    // If we're on a link, we'll use the full link text, otherwise we'll fall back
    // to the selected text
    const initialText = linkText || selectedText;
    const [textValue, setTextValue] = useState(initialText);
    const [hrefValue, setHrefValue] = useState(existingHref);
    const textRef = useRef(null);
    const hrefRef = useRef(null);
    // If there's already a link where the user has clicked, they're "editing",
    // otherwise the menu has been brought up to add a new link
    const isNewLink = !existingHref;
    const addLinkTitle = (_a = labels === null || labels === void 0 ? void 0 : labels.editLinkAddTitle) !== null && _a !== void 0 ? _a : "Add link";
    const editLinkTitle = (_b = labels === null || labels === void 0 ? void 0 : labels.editLinkEditTitle) !== null && _b !== void 0 ? _b : "Edit link";
    const editMenuTitle = isNewLink ? addLinkTitle : editLinkTitle;
    // When bringing up the Popper of the `ControlledBubbleMenu` and using
    // autoFocus on the TextField elements, it is causing a scroll jump as
    // described here https://github.com/mui-org/material-ui/issues/16740. (It
    // seems the fix that was merged for that has since been undone, as the popper
    // styles now using `absolute` positioning again.) So we'll focus on the
    // appropriate input with `useEffect` below instead.
    useEffect(() => {
        var _a, _b;
        // We'll auto-focus on the text input if (a) it's not a new link, or (b)
        // it's a new link and they do not have some initial text already (e.g.,
        // they brought up the link menu with some text selected already). Otherwise
        // well focus on the href input.
        const autoFocusOnTextInput = !isNewLink || !initialText;
        if (autoFocusOnTextInput) {
            (_a = textRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
        else {
            (_b = hrefRef.current) === null || _b === void 0 ? void 0 : _b.focus();
        }
    }, [isNewLink, initialText]);
    // If the user presses escape, we should cancel
    useKeyDown("Escape", onCancel);
    const formatHref = useCallback(() => {
        if (!hrefRef.current) {
            return;
        }
        // Parse what the user typed in, and add a protocol if they typed in a value
        // but didn't include a protocol. (This also includes mailto and tel, since
        // they are also valid for `href`
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href and
        // Tiptap has builtin autolink support for email address conversion to
        // mailto.) This is what Slack does, and seems like a reasonable behavior to
        // ensure it's a valid URL (e.g. if someone types "example.com", we should
        // accept it and treat it as "http://example.com", not a relative path on the
        // current site). It also allows the value to pass browser-builtin
        // `type="url"` validation.
        let currentHrefValue = hrefRef.current.value.trim();
        if (currentHrefValue &&
            !currentHrefValue.startsWith("http://") &&
            !currentHrefValue.startsWith("https://") &&
            !currentHrefValue.startsWith("mailto:") &&
            !currentHrefValue.startsWith("tel:")) {
            currentHrefValue = `http://${currentHrefValue}`;
        }
        // URL-encode any characters that wouldn't be valid. We use `encodeurl`
        // instead of the builtin `encodeURI` so that if there are any
        // already-encoded sequences, they're not double-encoded and thus broken.
        // (Useful for instance when a user pastes a URL into the form with complex
        // and already-encoded parameters.)
        setHrefValue(encodeurl(currentHrefValue));
    }, []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    return (_jsxs("form", { onSubmit: (event) => {
            var _a, _b, _c, _d;
            // Don't submit the form with a standard full-page request
            event.preventDefault();
            // Don't let this event propagate upwards in the React tree, to prevent
            // submitting any form the rich text editor is wrapped in
            // (https://github.com/sjdemartini/mui-tiptap/issues/105)
            event.stopPropagation();
            setIsSubmitting(true);
            const text = (_b = (_a = textRef.current) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
            const href = (_d = (_c = hrefRef.current) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : "";
            onSave({ text: text, link: href });
            setIsSubmitting(false);
        }, autoComplete: "off", children: [_jsx(Typography, { variant: "h6", children: editMenuTitle }), _jsx(TextField, { inputRef: textRef, value: textValue, disabled: isSubmitting, onChange: (event) => setTextValue(event.target.value), label: (_c = labels === null || labels === void 0 ? void 0 : labels.editLinkTextInputLabel) !== null && _c !== void 0 ? _c : "Text", margin: "normal", size: "small", fullWidth: true, required: true }), _jsx(TextField, { inputRef: hrefRef, value: hrefValue, onChange: (event) => setHrefValue(event.target.value), disabled: isSubmitting, label: (_d = labels === null || labels === void 0 ? void 0 : labels.editLinkHrefInputLabel) !== null && _d !== void 0 ? _d : "Link", margin: "dense", size: "small", type: "url", onBlur: formatHref, onKeyDown: (event) => {
                    // If the user is trying to submit the form directly from the href field, make
                    // sure we first format what they entered (which will update it to allow it to
                    // pass URL field validation)
                    if (event.key === "Enter") {
                        formatHref();
                    }
                }, fullWidth: true, required: true }), _jsxs(DialogActions, { sx: { px: 0 }, children: [_jsx(Button, { onClick: onCancel, variant: "outlined", size: "small", children: (_e = labels === null || labels === void 0 ? void 0 : labels.editLinkCancelButtonLabel) !== null && _e !== void 0 ? _e : "Cancel" }), _jsx(Button, { type: "submit", color: "primary", variant: "outlined", size: "small", disabled: isSubmitting, children: (_f = labels === null || labels === void 0 ? void 0 : labels.editLinkSaveButtonLabel) !== null && _f !== void 0 ? _f : "Save" })] })] }));
}
