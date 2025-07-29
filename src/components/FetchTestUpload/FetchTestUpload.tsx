import React, { useState } from 'react';

export const FetchTestUpload: React.FC = () => {
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
      console.log('Fetch upload starting...');
      
      // Используем стандартный fetch как в документации
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', 'Test via fetch API');
      formData.append('tags', JSON.stringify(['test', 'fetch']));

      console.log('FormData contents (fetch):');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Fetch upload successful:', result);
        setMessage(`Успешно загружено через fetch! UUID: ${result.file?.uuid || 'N/A'}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error: any) {
      console.error('Fetch upload failed:', error);
      setMessage(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #FF9800', margin: '10px' }}>
      <h3>Тест загрузки через fetch API</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Загружаем...' : 'Загрузить через fetch'}
      </button>
      <br />
      <div style={{ marginTop: '10px', color: message.includes('Ошибка') ? 'red' : 'green' }}>
        {message}
      </div>
    </div>
  );
};
