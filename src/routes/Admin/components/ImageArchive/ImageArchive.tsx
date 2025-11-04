import React, { useState, useEffect } from 'react';
import { Service } from '../../../../common/services';
import { FileEntity } from '../../../../common/services/upload/types';
import { Panel } from '../Panel';
import { Row } from '../../../../components/common';
import { Column } from '../../../../components/common/Column';
import { apiPrivate } from '../../../../common/api';
import { Images } from '../../../../assets';
import { transliterate, hasCyrillic, getSafeFileName, transliterateFileName } from '../../../../utils/transliteration';
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
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[] | null>(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [notification, setNotification] = useState('');
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showTransliterated, setShowTransliterated] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileEntity | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewFile(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    loadFiles();
  }, [currentPage, searchTerm]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      console.log('Loading files from archive...');
      const response = await Service.UploadService.getArchive({
        page: currentPage,
        limit: 50,
        searchTerm: searchTerm || undefined,
      });
      console.log('Files loaded:', response);
      setFiles(response.files);
      setTotalPages(response.totalPages || response.pages);
      setTotalFiles(response.total || 0);
    } catch (error) {
      console.error('Error loading files:', error);
      setNotification('Ошибка при загрузке списка файлов');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== handleUpload ВЫЗВАН ===');
    console.log('Event target:', e.target);
    console.log('Event type:', e.type);
    
    const filesToUpload = uploadFiles && uploadFiles.length > 0 ? uploadFiles : (uploadFile ? [uploadFile] : []);
    if (filesToUpload.length === 0) {
      setNotification('Пожалуйста, выберите файл для загрузки');
      return;
    }

    setLoading(true);
    console.log('=== НАЧАЛО ЗАГРУЗКИ (мультифайл) ===');

    try {
      const uploaded: string[] = [];
      for (let i = 0; i < filesToUpload.length; i++) {
        const f = filesToUpload[i];
        setNotification(`Загрузка ${i + 1}/${filesToUpload.length}: ${f.name}`);
        try {
          const resp = await Service.UploadService.uploadImage({ file: f, description: uploadDescription.trim() || undefined, tags: uploadTags ? uploadTags.split(',').map(t => t.trim()).filter(Boolean) : undefined });
          uploaded.push(resp.file?.original_name || resp.file?.filename || f.name);
        } catch (err: any) {
          console.error('Ошибка при загрузке файла', f.name, err);
          uploaded.push(`Ошибка:${f.name}`);
        }
      }

      setNotification(`Загрузка завершена: ${uploaded.join(', ')}`);

      // Сброс полей
      setUploadFiles(null);
      setUploadFile(null);
      setUploadDescription('');
      setUploadTags('');

      // Очищаем input file
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      await loadFiles();
    } catch (error: any) {
      console.error('Ошибка при загрузке файлов:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка';
      setNotification(`❌ Ошибка при загрузке: ${errorMessage}`);
    } finally {
      setLoading(false);
      console.log('=== ЗАВЕРШЕНИЕ ЗАГРУЗКИ (мультифайл) ===');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadFiles();
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    const displayName = getSafeFileName(fileName, showTransliterated);
    if (!window.confirm(`Вы уверены, что хотите удалить файл "${displayName}"? Это действие нельзя отменить.`)) {
      return;
    }

    setDeletingFileId(fileId);
    
    try {
      console.log('Удаляем файл с ID:', fileId);
      const response = await Service.UploadService.deleteFile(fileId);
      console.log('Файл успешно удален:', response);
      
      setNotification(`✅ Файл "${displayName}" успешно удален`);
      
      // Обновляем список файлов
      await loadFiles();
    } catch (error: any) {
      console.error('Ошибка при удалении файла:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка';
      setNotification(`❌ Ошибка при удалении файла: ${errorMessage}`);
    } finally {
      setDeletingFileId(null);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const selectAllFiles = () => {
    setSelectedFiles(new Set(files.map(file => file.id)));
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;

    const fileNames = files
      .filter(f => selectedFiles.has(f.id))
      .map(f => getSafeFileName(f.original_name, showTransliterated));
    
    if (!window.confirm(`Вы уверены, что хотите удалить ${selectedFiles.size} файл(ов)?\n\n${fileNames.slice(0, 5).join('\n')}${fileNames.length > 5 ? '\n...' : ''}\n\nЭто действие нельзя отменить.`)) {
      return;
    }

    const totalFiles = selectedFiles.size;
    let deletedCount = 0;
    let errors = 0;

    for (const fileId of Array.from(selectedFiles)) {
      try {
        await Service.UploadService.deleteFile(fileId);
        deletedCount++;
      } catch (error) {
        console.error(`Ошибка при удалении файла ${fileId}:`, error);
        errors++;
      }
    }

    if (errors === 0) {
      setNotification(`✅ Успешно удалено ${deletedCount} файл(ов)`);
    } else {
      setNotification(`⚠️ Удалено ${deletedCount} из ${totalFiles} файлов. Ошибок: ${errors}`);
    }

    setSelectedFiles(new Set());
    await loadFiles();
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
          {/* Информация о транслитерации */}
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#d1ecf1', 
            border: '1px solid #bee5eb', 
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '13px'
          }}>
            <strong>🔄 Автоматическая транслитерация включена:</strong> Все файлы с кириллическими именами будут автоматически переименованы в латиницу при загрузке.
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>Выберите файл(ы):</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const list = e.target.files ? Array.from(e.target.files) : [];
                  setUploadFiles(list.length > 0 ? list : null);
                  setUploadFile(list[0] || null);
                }}
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
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
            
            {uploadFile && hasCyrillic(uploadFile.name) && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#d4edda', 
                border: '1px solid #c3e6cb', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <strong>Текущее имя:</strong> {uploadFile.name}<br/>
                <strong>Будет сохранено как:</strong> {transliterateFileName(uploadFile.name)}
                <span style={{ color: '#155724', fontWeight: 'bold' }}> ✓ Автоматическая транслитерация</span>
              </div>
            )}
            
            {!uploadFile ? (
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', color: '#666', textAlign: 'center', borderRadius: '4px' }}>
                Выберите файл для загрузки
              </div>
            ) : loading ? (
              <div style={{ padding: '10px', backgroundColor: '#e3f2fd', color: '#1976d2', textAlign: 'center', borderRadius: '4px' }}>
                Загрузка файла...
              </div>
            ) : (
              <button 
                type="button"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onClick={async (e) => {
                  console.log('=== КНОПКА НАЖАТА ===');
                  console.log('Button click event:', e);
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('=== ВЫЗЫВАЕМ handleUpload НАПРЯМУЮ ===');
                  await handleUpload(e as any);
                }}
              >
                Загрузить в архив
              </button>
            )}
          </div>
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
        <Panel.Header title={`Архив изображений (показано ${files.length} из ${totalFiles} файлов)`} />
        <Panel.Body>
          {/* Панель управления выбором */}
          <div className="selection-controls">
            <div className="selection-buttons">
              <button
                className={`selection-mode-button ${isSelectionMode ? 'active' : ''}`}
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                  if (isSelectionMode) {
                    clearSelection();
                  }
                }}
              >
                {isSelectionMode ? 'Отменить выбор' : 'Выбрать файлы'}
              </button>
              
              {isSelectionMode && (
                <>
                  <button
                    className="select-all-button"
                    onClick={selectAllFiles}
                    disabled={files.length === 0}
                  >
                    Выбрать все
                  </button>
                  <button
                    className="clear-selection-button"
                    onClick={clearSelection}
                    disabled={selectedFiles.size === 0}
                  >
                    Очистить выбор
                  </button>
                  {selectedFiles.size > 0 && (
                    <button
                      className="delete-selected-button"
                      onClick={handleDeleteSelected}
                    >
                      Удалить выбранные ({selectedFiles.size})
                    </button>
                  )}
                </>
              )}
              
              {/* Переключатель отображения имен файлов */}
              <button
                className={`transliteration-toggle ${showTransliterated ? 'active' : ''}`}
                onClick={() => setShowTransliterated(!showTransliterated)}
                title={showTransliterated ? 'Показать оригинальные названия' : 'Показать транслитерированные названия'}
              >
                {showTransliterated ? 'Abc' : 'Абв'}
              </button>
            </div>
            
            {isSelectionMode && selectedFiles.size > 0 && (
              <div className="selection-info">
                Выбрано файлов: {selectedFiles.size}
              </div>
            )}
          </div>

          {loading ? (
            <div>Загрузка...</div>
          ) : (
            <>
              <div className="archive-gallery">
                {files.map((file) => (
                  <div 
                    key={file.id} 
                    className={`gallery-item ${selectedImageId === file.id ? 'selected' : ''} ${isSelectionMode && selectedFiles.has(file.id) ? 'selected-for-delete' : ''}`}
                    onClick={() => {
                      if (isSelectionMode) {
                        toggleFileSelection(file.id);
                      } else if (showSelectButton && onImageSelect) {
                        onImageSelect(file);
                      } else {
                        // Открыть превью файла в полный размер
                        setPreviewFile(file);
                      }
                    }}
                    title={hasCyrillic(file.original_name) ? 
                      `${file.original_name} → ${transliterate(file.original_name)}${file.description ? '\n' + file.description : ''}` :
                      `${file.original_name}${file.description ? ' - ' + file.description : ''}`
                    }
                  >
                    <div className="gallery-image-container">
                      <img 
                        src={file.url} 
                        alt={getSafeFileName(file.original_name, showTransliterated)} 
                        className="gallery-image"
                      />
                      
                      {/* Чекбокс для режима выбора */}
                      {isSelectionMode && (
                        <div className="gallery-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFiles.has(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                      
                      {/* Кнопка удаления */}
                      {!isSelectionMode && (
                        <button
                          className="gallery-delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id, file.original_name);
                          }}
                          disabled={deletingFileId === file.id}
                          title="Удалить файл"
                        >
                          {deletingFileId === file.id ? (
                            <span className="delete-loading">⏳</span>
                          ) : (
                            <img src={Images.TrashIcon} alt="Удалить" width={14} height={14} />
                          )}
                        </button>
                      )}
                      
                      {/* Overlay с информацией - показывается при наведении */}
                      <div className="gallery-overlay">
                        <div className="gallery-overlay-content">
                          <div className="gallery-title">
                            {getSafeFileName(file.original_name, showTransliterated)}
                            {hasCyrillic(file.original_name) && (
                              <span className="cyrillic-indicator" title="Содержит кириллицу">
                                🔤
                              </span>
                            )}
                          </div>
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
                        
                        {showSelectButton && !isSelectionMode && (
                          <div className="gallery-select-button">
                            ✓ Выбрать
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Модальное окно предпросмотра */}
              {previewFile && (
                <div
                  className="image-preview-backdrop"
                  onClick={() => setPreviewFile(null)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1200,
                    padding: 20,
                  }}
                >
                  <div
                    className="image-preview-container"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      maxWidth: '95%',
                      maxHeight: '95%',
                      background: '#fff',
                      borderRadius: 8,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      overflow: 'auto',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottom: '1px solid #eee' }}>
                      <div style={{ fontWeight: 600 }}>{getSafeFileName(previewFile.original_name, showTransliterated)}</div>
                      <div>
                        <a
                          href={previewFile.url}
                          download={previewFile.original_name}
                          style={{ marginRight: 12 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Скачать
                        </a>
                        <button onClick={() => setPreviewFile(null)}>Закрыть</button>
                      </div>
                    </div>

                    <div style={{ padding: 12, display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={previewFile.url}
                        alt={previewFile.original_name}
                        style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                      />
                    </div>

                    {previewFile.description && (
                      <div style={{ padding: 12, borderTop: '1px solid #eee' }}>{previewFile.description}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="archive-pagination">
                  <div className="pagination-controls">
                    <button 
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="pagination-button"
                      title="Первая страница"
                    >
                      ««
                    </button>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Предыдущая
                    </button>
                    
                    <div className="pagination-pages">
                      {/* Показываем до 7 номеров страниц */}
                      {(() => {
                        const pages = [];
                        let startPage = Math.max(1, currentPage - 3);
                        let endPage = Math.min(totalPages, startPage + 6);
                        
                        // Корректируем начальную страницу если мы близко к концу
                        if (endPage - startPage < 6) {
                          startPage = Math.max(1, endPage - 6);
                        }
                        
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              disabled={i === currentPage}
                              className={`pagination-number ${i === currentPage ? 'active' : ''}`}
                            >
                              {i}
                            </button>
                          );
                        }
                        return pages;
                      })()}
                    </div>
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Следующая
                    </button>
                    <button 
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                      title="Последняя страница"
                    >
                      »»
                    </button>
                  </div>
                  
                  <div className="pagination-info">
                    Страница {currentPage} из {totalPages} • Показано {files.length} из {totalFiles} файлов
                  </div>
                </div>
              )}
            </>
          )}
        </Panel.Body>
      </Panel.Container>
    </div>
  );
};
