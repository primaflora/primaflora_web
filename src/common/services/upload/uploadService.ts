import { apiPrivate } from '../../api';
import { transliterateFileName, hasCyrillic } from '../../../utils/transliteration';
import { 
  FileEntity, 
  UploadImageRequest, 
  UploadImageResponse, 
  GetArchiveRequest, 
  GetArchiveResponse,
  UpdateFileRequest 
} from './types';

export class UploadService {
  /**
   * Загрузка изображения в архив
   */
  static async uploadImage(data: UploadImageRequest): Promise<UploadImageResponse> {
    console.log('UploadService.uploadImage called with:', {
      fileName: data.file.name,
      fileSize: data.file.size,
      fileType: data.file.type,
      description: data.description,
      tags: data.tags
    });

    console.log('API Base URL:', process.env.REACT_APP_HOST_URL);

    const formData = new FormData();
    
    // Автоматически транслитерируем имя файла, если содержит кириллицу
    let fileToUpload = data.file;
    if (hasCyrillic(data.file.name)) {
      const transliteratedName = transliterateFileName(data.file.name);
      console.log('🔄 Автоматическая транслитерация файла:', data.file.name, '→', transliteratedName);
      
      fileToUpload = new File([data.file], transliteratedName, {
        type: data.file.type,
        lastModified: data.file.lastModified
      });
    } else {
      console.log('✅ Файл уже имеет латинское имя:', data.file.name);
    }
    
    formData.append('file', fileToUpload);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags));
    }

    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      console.log('Making POST request to /upload/image...');
      const response = await apiPrivate.post<UploadImageResponse>('/upload/image', formData, {
        headers: {
          'Content-Type': undefined, // Убираем application/json для FormData
        },
      });

      console.log('Upload response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }

  /**
   * Получение списка файлов из архива
   */
  static async getArchive(params: GetArchiveRequest = {}): Promise<GetArchiveResponse> {
    console.log('UploadService.getArchive called with params:', params);
    
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.searchTerm) searchParams.append('searchTerm', params.searchTerm);
    if (params.tags && params.tags.length > 0) {
      searchParams.append('tags', JSON.stringify(params.tags));
    }

    const url = `/upload/archive?${searchParams.toString()}`;
    console.log('Making GET request to:', url);

    try {
      const response = await apiPrivate.get<GetArchiveResponse>(url);
      console.log('Archive response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Archive request failed:', error);
      throw error;
    }
  }

  /**
   * Получение конкретного файла
   */
  static async getFile(uuid: string): Promise<FileEntity> {
    const response = await apiPrivate.get<FileEntity>(`/upload/archive/${uuid}`);
    return response.data;
  }

  /**
   * Обновление информации о файле
   */
  static async updateFile(uuid: string, data: UpdateFileRequest): Promise<FileEntity> {
    const response = await apiPrivate.put<FileEntity>(`/upload/archive/${uuid}`, data);
    return response.data;
  }

  /**
   * Удаление файла из архива
   */
  static async deleteFile(id: string): Promise<{ message: string; deletedFileId: string }> {
    console.log('UploadService.deleteFile called with id:', id);
    
    try {
      const response = await apiPrivate.delete(`/upload/archive/${id}`);
      console.log('Delete response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Delete request failed:', error);
      throw error;
    }
  }
}
