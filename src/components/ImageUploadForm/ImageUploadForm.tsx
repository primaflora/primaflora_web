import React, { useState } from 'react';
import { apiPrivate } from '../../common/api';

export const ImageUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(''); // Очищаем предыдущие сообщения
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Выберите файл для загрузки');
      return;
    }

    setLoading(true);
    setMessage('Загрузка...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      
      if (tags.trim()) {
        // Парсим теги как массив строк
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        formData.append('tags', JSON.stringify(tagsArray));
      }

      console.log('Отправляем файл:', {
        name: file.name,
        size: file.size,
        type: file.type,
        description,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      });

      const response = await apiPrivate.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Файл успешно загружен:', response.data);
      setMessage(`✅ Файл успешно загружен! UUID: ${response.data.file?.uuid || 'N/A'}`);
      
      // Очищаем форму после успешной загрузки
      setFile(null);
      setDescription('');
      setTags('');
      // Сбрасываем input file
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error('Ошибка загрузки:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка';
      setMessage(`❌ Ошибка: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '20px auto', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ marginTop: 0, color: '#333' }}>Загрузка изображения в архив</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Файл изображения:
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
          {file && (
            <small style={{ color: '#666' }}>
              Выбран: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </small>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Описание (необязательно):
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание изображения..."
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Теги (необязательно):
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="тег1, тег2, тег3..."
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
          <small style={{ color: '#666' }}>
            Введите теги через запятую
          </small>
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Загрузка...' : 'Загрузить в архив'}
        </button>
      </form>

      {message && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          borderRadius: '4px',
          backgroundColor: message.includes('❌') ? '#ffe6e6' : '#e6ffe6',
          color: message.includes('❌') ? '#cc0000' : '#006600',
          border: `1px solid ${message.includes('❌') ? '#ff9999' : '#99cc99'}`
        }}>
          {message}
        </div>
      )}
    </div>
  );
};
