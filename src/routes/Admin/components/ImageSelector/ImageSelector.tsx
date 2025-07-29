import React, { useState } from 'react';
import { FileEntity } from '../../../../common/services/upload/types';
import { ImageArchive } from '../ImageArchive';
import { Panel } from '../Panel';
import './styles.css';

interface ImageSelectorProps {
  selectedImage?: FileEntity | null;
  onImageSelect: (file: FileEntity) => void;
  onFileUpload?: (file: File) => void;
  showUploadOption?: boolean;
  label?: string;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  selectedImage,
  onImageSelect,
  onFileUpload,
  showUploadOption = true,
  label = "Изображение"
}) => {
  const [showArchive, setShowArchive] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      setUploadFile(file);
      onFileUpload(file);
    }
  };

  const handleArchiveSelect = (file: FileEntity) => {
    onImageSelect(file);
    setShowArchive(false);
  };

  return (
    <div className="image-selector">
      <label className="image-selector-label">{label}</label>
      
      <div className="image-selector-options">
        {showUploadOption && (
          <div className="image-selector-option">
            <h4>Загрузить новое изображение</h4>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="image-selector-input"
            />
            {uploadFile && (
              <div className="selected-file-info">
                <span>Выбран файл: {uploadFile.name}</span>
              </div>
            )}
          </div>
        )}

        <div className="image-selector-option">
          <h4>Выбрать из архива</h4>
          <Panel.Button 
            text="Открыть архив" 
            onClick={() => setShowArchive(!showArchive)}
          />
        </div>
      </div>

      {selectedImage && (
        <div className="selected-image-preview">
          <h4>Выбранное изображение:</h4>
          <div className="selected-image-container">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.original_name}
              className="selected-image"
            />
            <div className="selected-image-info">
              <p><strong>Название:</strong> {selectedImage.original_name}</p>
              {selectedImage.description && (
                <p><strong>Описание:</strong> {selectedImage.description}</p>
              )}
              <Panel.Button 
                text="Удалить выбор" 
                onClick={() => onImageSelect(null as any)}
                style={{ marginTop: '10px' }}
              />
            </div>
          </div>
        </div>
      )}

      {showArchive && (
        <div className="archive-modal">
          <div className="archive-modal-content">
            <div className="archive-modal-header">
              <h3>Выберите изображение из архива</h3>
              <button 
                className="archive-modal-close"
                onClick={() => setShowArchive(false)}
              >
                ×
              </button>
            </div>
            <div className="archive-modal-body">
              <ImageArchive 
                onImageSelect={handleArchiveSelect}
                showSelectButton={true}
                selectedImageId={selectedImage?.uuid}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
