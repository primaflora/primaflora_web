import React, { useState } from 'react';
import { Service } from '../../common/services';

export const TestUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Выберите файл');
      return;
    }

    setLoading(true);
    setMessage('Загружаем...');

    try {
      console.log('Starting test upload...');
      const response = await Service.UploadService.uploadImage({
        file,
        description: 'Test upload'
        // Убираем теги для упрощения тестирования
        // tags: ['test']
      });
      
      console.log('Test upload successful:', response);
      setMessage(`Успешно загружено! UUID: ${response.file.uuid}`);
    } catch (error) {
      console.error('Test upload failed:', error);
      setMessage(`Ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Тест загрузки</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Загружаем...' : 'Загрузить'}
      </button>
      <br />
      <div style={{ marginTop: '10px', color: message.includes('Ошибка') ? 'red' : 'green' }}>
        {message}
      </div>
    </div>
  );
};
