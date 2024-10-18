import { MediaType } from '@atlaskit/media-client';
import { Preview } from '../types';
export declare const getPreviewFromBlob: (file: Blob, mediaType: MediaType) => Promise<Preview>;
