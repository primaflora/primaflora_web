import React, { useState } from 'react';
import { apiPrivate } from '../../common/api';

export const SimpleTestUpload: React.FC = () => {
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
      console.log('=== ДИАГНОСТИКА ФАЙЛА ===');
      console.log('File object:', file);
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
      console.log('File lastModified:', file.lastModified);
      console.log('File instanceof File:', file instanceof File);
      console.log('File instanceof Blob:', file instanceof Blob);
      
      // Проверим, можем ли мы прочитать содержимое файла
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        console.log('FileReader result length:', e.target?.result ? (e.target.result as ArrayBuffer).byteLength : 'null');
      };
      fileReader.readAsArrayBuffer(file);
      
      console.log('Creating FormData...');
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('FormData created, checking contents...');
      formData.forEach((value, key) => {
        console.log(`FormData[${key}]:`, value);
        if (value instanceof File) {
          console.log(`  - File name: ${value.name}`);
          console.log(`  - File size: ${value.size}`);
          console.log(`  - File type: ${value.type}`);
        }
      });
      
      const response = await apiPrivate.post('/upload/image', formData);
      
      console.log('Simple upload successful:', response.data);
      setMessage(`Успешно загружено!`);
    } catch (error: any) {
      console.error('Simple upload failed:', error);
      setMessage(`Ошибка: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #f00', margin: '10px' }}>
      <h3>Простой тест загрузки (только файл)</h3>
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
