import React, { useState } from 'react';
import { apiPrivate } from '../../common/api';

export const QueryTestUpload: React.FC = () => {
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
      console.log('Starting query upload...');
      
      // Отправляем файл через FormData, а description и tags через query параметры
      const formData = new FormData();
      formData.append('file', file);
      
      // Добавляем параметры в URL
      const params = new URLSearchParams();
      params.append('description', 'Test upload via query');
      // Не добавляем теги пока
      
      console.log('Sending file with query params');
      
      const response = await apiPrivate.post(`/upload/image?${params.toString()}`, formData);
      
      console.log('Query upload successful:', response.data);
      setMessage(`Успешно загружено!`);
    } catch (error: any) {
      console.error('Query upload failed:', error);
      setMessage(`Ошибка: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #00f', margin: '10px' }}>
      <h3>Тест загрузки через query параметры</h3>
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
