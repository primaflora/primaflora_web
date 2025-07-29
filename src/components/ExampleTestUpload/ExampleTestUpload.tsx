import React, { useState } from 'react';
import { apiPrivate } from '../../common/api';

export const ExampleTestUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('Test upload from example');
  const [tags, setTags] = useState<string[]>(['test', 'example']);
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
      console.log('Example upload starting...');
      
      // Точно как в примере документации
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(tags));

      console.log('FormData contents:');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      
      const response = await apiPrivate.post('/upload/image', formData);
      
      console.log('Example upload successful:', response.data);
      setMessage(`Успешно загружено! UUID: ${response.data.file?.uuid || 'N/A'}`);
    } catch (error: any) {
      console.error('Example upload failed:', error);
      setMessage(`Ошибка: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #4CAF50', margin: '10px' }}>
      <h3>Тест по примеру из документации</h3>
      <div>
        <label>Файл:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div>
        <label>Описание:</label>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
      </div>
      <div>
        <label>Теги:</label>
        <input 
          type="text" 
          value={tags.join(', ')} 
          onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))} 
        />
      </div>
      <br />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Загружаем...' : 'Загрузить (как в примере)'}
      </button>
      <br />
      <div style={{ marginTop: '10px', color: message.includes('Ошибка') ? 'red' : 'green' }}>
        {message}
      </div>
    </div>
  );
};
