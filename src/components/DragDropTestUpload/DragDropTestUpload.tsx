import React, { useState, useRef } from 'react';
import { apiPrivate } from '../../common/api';

export const DragDropTestUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log('File selected via input:', selectedFile);
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      console.log('File dropped:', droppedFile);
      setFile(droppedFile);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Выберите файл');
      return;
    }

    setLoading(true);
    setMessage('Загружаем...');

    try {
      console.log('=== DRAG & DROP ДИАГНОСТИКА ===');
      console.log('File object:', file);
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
      
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('FormData created for drag & drop test');
      formData.forEach((value, key) => {
        console.log(`FormData[${key}]:`, value);
      });
      
      const response = await apiPrivate.post('/upload/image', formData);
      
      console.log('Drag & drop upload successful:', response.data);
      setMessage(`Успешно загружено через drag & drop!`);
    } catch (error: any) {
      console.error('Drag & drop upload failed:', error);
      setMessage(`Ошибка: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #9C27B0', margin: '10px' }}>
      <h3>Тест загрузки Drag & Drop</h3>
      
      <div 
        style={{
          border: `2px dashed ${isDragOver ? '#9C27B0' : '#ccc'}`,
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragOver ? '#f3e5f5' : '#fafafa',
          marginBottom: '10px'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleAreaClick}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ display: 'none' }}
        />
        <p>Перетащите файл сюда или нажмите для выбора</p>
        {file && <p>Выбран: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
      </div>
      
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Загружаем...' : 'Загрузить'}
      </button>
      
      <div style={{ marginTop: '10px', color: message.includes('Ошибка') ? 'red' : 'green' }}>
        {message}
      </div>
    </div>
  );
};
