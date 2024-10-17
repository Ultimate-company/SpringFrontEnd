import type { NodeViewProps } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
interface ImageNodeAttributes extends Record<string, unknown> {
    src: string;
    alt?: string | null;
    title?: string | null;
}
interface ResizableImageNodeAttributes extends ImageNodeAttributes {
    width: string | number | null;
    aspectRatio: string | null;
}
interface ResizableImageNode extends ProseMirrorNode {
    attrs: ResizableImageNodeAttributes;
}
interface Props extends NodeViewProps {
    node: ResizableImageNode;
}
declare function ResizableImageComponent({ node, selected, updateAttributes }: Props): import("react/jsx-runtime").JSX.Element;
export default ResizableImageComponent;
