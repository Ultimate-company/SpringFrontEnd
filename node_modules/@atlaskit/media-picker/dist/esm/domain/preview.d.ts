import { ImageMetadata } from '@atlaskit/media-client';
import { Preview, ImagePreview } from '../types';
export declare const isImagePreview: (preview: Preview) => preview is ImagePreview;
export declare const getPreviewFromMetadata: (metadata: ImageMetadata) => Preview;
