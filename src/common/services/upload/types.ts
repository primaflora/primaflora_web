export interface FileEntity {
  id: string;
  original_name: string;
  filename: string;
  path: string;
  url: string;
  mimetype: string;
  size: number;
  uploaded_at: Date;
  description?: string;
  tags: string[];
}

export interface UploadImageRequest {
  file: File;
  description?: string;
  tags?: string[];
}

export interface UploadImageResponse {
  message: string;
  file: FileEntity;
}

export interface GetArchiveRequest {
  page?: number;
  limit?: number;
  searchTerm?: string;
  tags?: string[];
}

export interface GetArchiveResponse {
  files: FileEntity[];
  total: number;
  pages: number;
}

export interface UpdateFileRequest {
  description?: string;
  tags?: string[];
}

export interface CreateWithExistingImageRequest {
  existing_file_id: string;
  [key: string]: any;
}
