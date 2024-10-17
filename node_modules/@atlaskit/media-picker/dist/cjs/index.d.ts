import { MediaClientConfig } from '@atlaskit/media-core';
import { PopupConfig, Popup } from './types';
export { isImagePreview } from './domain/preview';
export declare function MediaPicker(mediaClientConfig: MediaClientConfig, pickerConfig: PopupConfig): Promise<Popup>;
export { DropzoneLoader as Dropzone } from './components/dropzone';
export { ClipboardLoader as Clipboard } from './components/clipboard';
export { BrowserLoader as Browser } from './components/browser';
