import { MediaClient } from '@atlaskit/media-client';
import { UploadService } from '../service/types';
import { UploadEventPayloadMap, UploadParams } from '../types';
import { UploadComponent } from './component';
import { LocalUploadConfig } from './types';
export declare class LocalUploadComponent<M extends UploadEventPayloadMap = UploadEventPayloadMap> extends UploadComponent<M> implements LocalUploadComponent {
    protected readonly uploadService: UploadService;
    protected readonly mediaClient: MediaClient;
    protected config: LocalUploadConfig;
    constructor(mediaClient: MediaClient, config: LocalUploadConfig);
    addFiles: (files: File[]) => void;
    cancel(uniqueIdentifier?: string): void;
    setUploadParams(uploadParams: UploadParams): void;
    private onFilesAdded;
    private onFilePreviewUpdate;
    private onFileConverting;
    private onUploadError;
}
