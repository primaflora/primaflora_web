import React, { useState, useEffect } from 'react';
import { Service } from '../../../../common/services';
import { FileEntity } from '../../../../common/services/upload/types';
import { Panel } from '../Panel';
import { Row } from '../../../../components/common';
import { Column } from '../../../../components/common/Column';
import { apiPrivate } from '../../../../common/api';
import './styles.css';

interface ImageArchiveProps {
  onImageSelect?: (file: FileEntity) => void;
  showSelectButton?: boolean;
  selectedImageId?: string;
}

export const ImageArchive: React.FC<ImageArchiveProps> = ({ 
  onImageSelect, 
  showSelectButton = false,
  selectedImageId 
}) => {
  const [files, setFiles] = useState<FileEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadFiles();
  }, [currentPage, searchTerm]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      console.log('Loading files from archive...');
      const response = await Service.UploadService.getArchive({
        page: currentPage,
        limit: 20,
        searchTerm: searchTerm || undefined,
      });
      console.log('Files loaded:', response);
      setFiles(response.files);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Error loading files:', error);
      setNotification('Ошибка при загрузке списка файлов');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setNotification('Пожалуйста, выберите файл для загрузки');
      return;
    }

    setLoading(true);
    console.log('=== НАЧАЛО ЗАГРУЗКИ ===');
    console.log('Файл:', {
      name: uploadFile.name,
      type: uploadFile.type,
      size: uploadFile.size,
      lastModified: uploadFile.lastModified
    });
    
    try {
      console.log('Создаем FormData...');
      const formData = new FormData();
      formData.append('file', uploadFile);
      
      if (uploadDescription.trim()) {
        formData.append('description', uploadDescription.trim());
        console.log('Добавлено описание:', uploadDescription.trim());
      }
      
      if (uploadTags.trim()) {
        const tagsArray = uploadTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        formData.append('tags', JSON.stringify(tagsArray));
        console.log('Добавлены теги:', tagsArray);
      }

      console.log('FormData готова, проверяем содержимое:');
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      });

      console.log('Отправляем POST запрос на /upload/image...');
      const response = await apiPrivate.post('/upload/image', formData, {
        headers: {
          'Content-Type': undefined, // Важно! Убираем заголовок чтобы axios сам установил multipart/form-data
        },
      });
      
      console.log('=== УСПЕШНЫЙ ОТВЕТ ===');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      setNotification(`✅ Файл успешно загружен в архив! UUID: ${response.data.file?.uuid || 'N/A'}`);
      
      // Очищаем форму
      setUploadFile(null);
      setUploadDescription('');
      setUploadTags('');
      
      // Очищаем input file
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Перезагружаем список файлов
      console.log('Перезагружаем список файлов...');
      loadFiles();
    } catch (error: any) {
      console.log('=== ОШИБКА ЗАГРУЗКИ ===');
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка';
      setNotification(`❌ Ошибка при загрузке файла: ${errorMessage}`);
    } finally {
      setLoading(false);
      console.log('=== ЗАВЕРШЕНИЕ ЗАГРУЗКИ ===');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadFiles();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="image-archive">
      {notification && (
        <Panel.Notification onRemove={() => setNotification('')}>
          {notification}
        </Panel.Notification>
      )}

      {/* Загрузка нового файла */}
      <Panel.Container>
        <Panel.Header title="Загрузить новое изображение" />
        <Panel.Body>
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>Выберите файл:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                required
              />
            </div>
            
            <div>
              <label>Описание (опционально):</label>
              <input
                type="text"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Описание изображения"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            
            <div>
              <label>Теги (через запятую, опционально):</label>
              <input
                type="text"
                value={uploadTags}
                onChange={(e) => setUploadTags(e.target.value)}
                placeholder="тег1, тег2, тег3"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            
            {!uploadFile ? (
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', color: '#666', textAlign: 'center', borderRadius: '4px' }}>
                Выберите файл для загрузки
              </div>
            ) : loading ? (
              <div style={{ padding: '10px', backgroundColor: '#e3f2fd', color: '#1976d2', textAlign: 'center', borderRadius: '4px' }}>
                Загрузка файла...
              </div>
            ) : (
              <Panel.Button 
                text="Загрузить в архив" 
                type="submit"
              />
            )}
          </form>
        </Panel.Body>
      </Panel.Container>

      {/* Простая тестовая форма */}
      {/* <Panel.Container>
        <Panel.Header title="🔧 Простой тест загрузки (для отладки)" />
        <Panel.Body>
          <div style={{ padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', marginBottom: '15px' }}>
            <strong>Отладка:</strong> Эта форма для проверки базовой загрузки файлов
          </div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              console.log('=== ПРОСТОЙ ТЕСТ ===');
              console.log('Файл выбран:', file.name, file.size, file.type);
              
              try {
                const testFormData = new FormData();
                testFormData.append('file', file);
                
                console.log('Отправляем без описания и тегов...');
                const response = await apiPrivate.post('/upload/image', testFormData, {
                  headers: {
                    'Content-Type': undefined, // Убираем принудительный application/json
                  },
                });
                console.log('Простой тест успешен:', response.data);
                setNotification(`🔧 Простой тест: файл загружен! UUID: ${response.data.file?.uuid}`);
                loadFiles();
              } catch (error: any) {
                console.error('Простой тест не удался:', error);
                setNotification(`🔧 Простой тест не удался: ${error.response?.data?.message || error.message}`);
              }
            }}
            style={{ width: '100%', padding: '10px', border: '2px solid #007bff', borderRadius: '4px' }}
          />
        </Panel.Body>
      </Panel.Container> */}

      {/* Поиск */}
      <Panel.Container>
        <Panel.Header title="Поиск в архиве" />
        <Panel.Body>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label>Поиск по названию или описанию:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Введите поисковый запрос"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <Panel.Button text="Найти" type="submit" />
          </form>
        </Panel.Body>
      </Panel.Container>

      {/* Список файлов */}
      <Panel.Container>
        <Panel.Header title={`Архив изображений (${files.length} из общего количества)`} />
        <Panel.Body>
          {loading ? (
            <div>Загрузка...</div>
          ) : (
            <>
              <div className="archive-gallery">
                {files.map((file) => (
                  <div 
                    key={file.uuid} 
                    className={`gallery-item ${selectedImageId === file.uuid ? 'selected' : ''}`}
                    onClick={() => showSelectButton && onImageSelect && onImageSelect(file)}
                    title={`${file.original_name}${file.description ? ' - ' + file.description : ''}`}
                  >
                    <div className="gallery-image-container">
                      <img 
                        src={file.url} 
                        alt={file.original_name} 
                        className="gallery-image"
                      />
                      
                      {/* Overlay с информацией - показывается при наведении */}
                      <div className="gallery-overlay">
                        <div className="gallery-overlay-content">
                          <div className="gallery-title">{file.original_name}</div>
                          <div className="gallery-meta">
                            {formatFileSize(file.size)} • {formatDate(file.uploaded_at.toString())}
                          </div>
                          {file.tags.length > 0 && (
                            <div className="gallery-tags">
                              {file.tags.slice(0, 3).map((tag: string, index: number) => (
                                <span key={index} className="gallery-tag">{tag}</span>
                              ))}
                              {file.tags.length > 3 && <span className="gallery-tag">+{file.tags.length - 3}</span>}
                            </div>
                          )}
                        </div>
                        
                        {showSelectButton && (
                          <div className="gallery-select-button">
                            ✓ Выбрать
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="archive-pagination">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    Предыдущая
                  </button>
                  <span className="pagination-info">
                    Страница {currentPage} из {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Следующая
                  </button>
                </div>
              )}
            </>
          )}
        </Panel.Body>
      </Panel.Container>
    </div>
  );
};
