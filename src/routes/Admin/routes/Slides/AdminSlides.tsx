import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField,
  IconButton
} from '@mui/material';
import { apiPrivate } from '../../../../common/api';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { blue, green, red } from '@mui/material/colors';
import { ImageSelector } from '../../components/ImageSelector';
import { FileEntity } from '../../../../common/services/upload/types';

const AdminSlides = () => {
  const [slides, setSlides] = useState<any>([]);
  const [form, setForm] = useState({ title: '', subtitle: '', imageFile: null as File | null, textColor: '', link: '' });
  const [selectedImageFromArchive, setSelectedImageFromArchive] = useState<FileEntity | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');


  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);


  const [editingColorId, setEditingColorId] = useState<number | null>(null);
	const [editColor, setEditColor] = useState<string>('');


	const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
	const [editLink, setEditLink] = useState<string>('');

  // Функция для формирования полного URL изображения
  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl; // Уже полный URL
    }
    return `${process.env.REACT_APP_HOST_URL}${imageUrl}`; // Добавляем базовый URL
  };

	const startEditingLink = (id: number, currentLink: string) => {
		setEditingLinkId(id);
		setEditLink(currentLink || '');
	};

	const cancelEditingLink = () => {
		setEditingLinkId(null);
		setEditLink('');
	};

  // Обработчик выбора изображения из архива
  const handleImageFromArchiveSelect = (file: FileEntity | null) => {
    setSelectedImageFromArchive(file);
    if (file) {
      setForm({ ...form, imageFile: null }); // Очищаем файл, если выбираем из архива
    }
  };

	const saveLink = async (id: number) => {
		await apiPrivate.patch(`/slides/${id}`, { link: editLink });
		setSlides((prev: any) =>
			prev.map((slide: any) =>
				slide.id === id ? { ...slide, link: editLink } : slide
			)
		);
		cancelEditingLink();
	};
	

	const saveTextColor = async (id: number) => {
		await apiPrivate.patch(`/slides/${id}`, { textColor: editColor });
		setSlides((prev: any) =>
			prev.map((s: any) =>
				s.id === id ? { ...s, textColor: editColor } : s
			)
		);
		setEditingColorId(null);
	};

	const cancelEditingColor = () => {
		setEditingColorId(null);
		setEditColor('');
	};
  
  
  const startEditing = (id: number, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveTitle = async (id: number) => {
    await apiPrivate.patch(`/slides/${id}`, { title: editTitle });
    setSlides((prev: any) =>
      prev.map((slide: any) =>
        slide.id === id ? { ...slide, title: editTitle } : slide
      )
    );
    cancelEditing();
  };

  // useEffect(() => {
  //   apiPrivate.get('/slides').then(res => setSlides(res.data));
  // }, []);

  useEffect(() => {
    apiPrivate.get('/slides').then(res =>
      // console.log(res.data)
        setSlides(res.data.sort((a: any, b: any) => a.order - b.order))
    );
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    console.log('=== СОЗДАНИЕ СЛАЙДА ===');
    console.log('form:', form);
    console.log('selectedImageFromArchive:', selectedImageFromArchive);
    
    // Проверяем, что выбрано изображение (либо файл, либо из архива)
    if (!form.imageFile && !selectedImageFromArchive) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    try {
      let response;

      if (selectedImageFromArchive) {
        // Создание слайда с существующим изображением из архива
        const payload = {
          existing_file_id: selectedImageFromArchive.id,
          title: form.title,
          textColor: form.textColor,
          link: form.link,
        };

        console.log('=== ОТПРАВКА С АРХИВНЫМ ИЗОБРАЖЕНИЕМ ===');
        console.log('Создание слайда с изображением из архива:', payload);
        console.log('URL:', '/slides/create-with-existing-image');
        response = await apiPrivate.post('/slides/create-with-existing-image', payload);
        console.log('Response:', response.data);
      } else if (form.imageFile) {
        // Создание слайда с новым изображением
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('textColor', form.textColor);
        formData.append('link', form.link);
        formData.append('image', form.imageFile);

        console.log('=== ОТПРАВКА С НОВЫМ ФАЙЛОМ ===');
        console.log('Создание слайда с новым файлом');
        console.log('URL:', '/slides/create-with-image');
        response = await apiPrivate.post('/slides/create-with-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Response:', response.data);
      }

      if (response) {
        console.log('=== СЛАЙД СОЗДАН УСПЕШНО ===');
        setSlides((prev: any) => [...prev, response.data]);
        setForm({ title: '', subtitle: '', imageFile: null, textColor: '', link: '' });
        setSelectedImageFromArchive(null);
      }
    } catch (error: any) {
      console.error('=== ОШИБКА СОЗДАНИЯ СЛАЙДА ===');
      console.error('Error creating slide:', error);
      console.error('Error response:', error.response?.data);
      alert('Ошибка при создании слайда: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(slides);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setSlides(reordered);

    await apiPrivate.post('/slides/reorder', {
      orderedIds: reordered.map((s: any) => s.id),
    });
  };
  
  const handleDelete = async (id: any) => {
		const answ = window.confirm("Удалить слайд?");
		if (answ) {
			await apiPrivate.delete(`/slides/${id}`);
			setSlides((prev: any) => prev.filter((slide: any) => slide.id !== id));
		}
  };


  const startEditingImage = (id: number) => {
    setEditingImageId(id);
    setEditImageFile(null);
  };

  const cancelEditingImage = () => {
    setEditingImageId(null);
    setEditImageFile(null);
  };

  const saveImageFile = async (id: number) => {
    if (!editImageFile) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    const formData = new FormData();
    formData.append('image', editImageFile);

    try {
      await apiPrivate.patch(`/slides/update-with-image/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Обновляем список слайдов
      const response = await apiPrivate.get('/slides');
      setSlides(response.data.sort((a: any, b: any) => a.order - b.order));
      
      cancelEditingImage();
    } catch (error) {
      console.error('Error updating slide image:', error);
      alert('Ошибка при обновлении изображения');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Заголовок */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        borderRadius: '12px',
        color: 'white'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
          Управление слайдами
        </h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
          Создавайте и управляйте слайдами для главной страницы
        </p>
      </div>

      {/* Форма создания слайда */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ 
          margin: '0 0 25px 0', 
          fontSize: '20px', 
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          ➕ Добавить новый слайд
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Основные поля */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 150px 1fr', 
            gap: '20px', 
            marginBottom: '25px' 
          }}>
            <TextField
              label="Заголовок слайда"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              multiline
              minRows={2}
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea' }
                }
              }}
            />
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#555' 
              }}>
                Цвет текста
              </label>
              <TextField
                type="color"
                value={form.textColor || '#000000'}
                onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                fullWidth
                variant="outlined"
                sx={{
                  '& input': { height: '40px' },
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />
            </div>

            <TextField
              label="Ссылка (необязательно)"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              fullWidth
              variant="outlined"
              placeholder="https://example.com"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea' }
                }
              }}
            />
          </div>

          {/* Секция выбора изображения */}
          <div style={{
            background: '#f8f9fa',
            padding: '25px',
            borderRadius: '12px',
            border: '2px dashed #dee2e6',
            marginBottom: '25px'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              fontSize: '16px', 
              color: '#495057',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🖼️ Выберите изображение для слайда
            </h3>
            
            <ImageSelector onImageSelect={handleImageFromArchiveSelect} />
            
            {/* Превью выбранного изображения из архива */}
            {selectedImageFromArchive && (
              <div style={{ 
                marginTop: '20px',
                padding: '20px', 
                border: '2px solid #28a745', 
                borderRadius: '12px', 
                backgroundColor: '#f8fff9',
                position: 'relative'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px' 
                }}>
                  <img 
                    src={selectedImageFromArchive.url} 
                    alt={selectedImageFromArchive.original_name}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '2px solid #28a745'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#28a745',
                      marginBottom: '5px'
                    }}>
                      ✅ Изображение из архива
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '3px' }}>
                      <strong>Название:</strong> {selectedImageFromArchive.original_name}
                    </div>
                    {selectedImageFromArchive.description && (
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        <strong>Описание:</strong> {selectedImageFromArchive.description}
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={() => setSelectedImageFromArchive(null)}
                    variant="outlined" 
                    color="error"
                    size="small"
                    sx={{ minWidth: '100px' }}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            )}
            
            {/* Превью нового файла */}
            {form.imageFile && (
              <div style={{ 
                marginTop: '20px',
                padding: '20px', 
                border: '2px solid #007bff', 
                borderRadius: '12px', 
                backgroundColor: '#f0f8ff',
                position: 'relative'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px' 
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#007bff',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px'
                  }}>
                    📁
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#007bff',
                      marginBottom: '5px'
                    }}>
                      📤 Новый файл
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      <strong>Файл:</strong> {form.imageFile.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <strong>Размер:</strong> {(form.imageFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <Button 
                    onClick={() => setForm({ ...form, imageFile: null })}
                    variant="outlined" 
                    color="error"
                    size="small"
                    sx={{ minWidth: '100px' }}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Кнопка отправки */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={!form.title || (!form.imageFile && !selectedImageFromArchive)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '12px 40px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
                '&:disabled': {
                  background: '#ccc',
                  color: '#666'
                }
              }}
            >
              {(!form.title || (!form.imageFile && !selectedImageFromArchive)) 
                ? 'Заполните все поля' 
                : '🚀 Создать слайд'
              }
            </Button>
          </div>
        </form>
      </div>

      {/* Список слайдов */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ 
          margin: '0 0 25px 0', 
          fontSize: '20px', 
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          📋 Список слайдов
          <span style={{ 
            background: '#667eea', 
            color: 'white', 
            padding: '4px 12px', 
            borderRadius: '12px', 
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {slides.length}
          </span>
        </h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slides">
          {(provided) => (
          <TableContainer 
            component={Paper} 
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ 
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <TableCell sx={{ color: 'white', fontWeight: '600' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: '600' }}>Изображение</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: '600' }}>Заголовок</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: '600' }}>Цвет текста</TableCell>
									<TableCell sx={{ color: 'white', fontWeight: '600' }}>Ссылка</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: '600' }}>Активен</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: '600' }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slides.map((slide: any, index: number) => (
                  <Draggable key={slide.id} draggableId={slide.id.toString()} index={index}>
                    {(provided) => (
                    <TableRow
                      key={slide.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        ...provided.draggableProps.style,
                        '&:hover': { backgroundColor: '#f0f8ff' },
                        backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                        cursor: 'grab',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <TableCell>{slide.id}</TableCell>
                      <TableCell>
                        {editingImageId === slide.id ? (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                                style={{ padding: '5px' }}
                              />
                              {editImageFile && (
                                <span style={{ fontSize: '12px', color: '#666' }}>
                                  {editImageFile.name}
                                </span>
                              )}
                              <div>
                                <IconButton onClick={() => saveImageFile(slide.id)}><SaveIcon sx={{color: green[500]}} /></IconButton>
                                <IconButton onClick={cancelEditingImage}><CloseIcon sx={{color: red[500]}} /></IconButton>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={getImageUrl(slide.imageUrl)}
                              alt={slide.title}
                              style={{ width: 80, cursor: 'pointer' }}
                              onClick={() => startEditingImage(slide.id)}
                            />
                          </>
                        )}
                      </TableCell>

                      <TableCell>
                        {editingId === slide.id ? (
                          <>
                            <TextField
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              multiline
                              fullWidth
                              size="small"
                            />
                            <IconButton onClick={() => saveTitle(slide.id)}><SaveIcon sx={{ color: green[500] }} /></IconButton>
                            <IconButton onClick={cancelEditing}><CloseIcon sx={{ color: red[500] }} /></IconButton>
                          </>
                        ) : (
                          <>
                          <span style={{whiteSpace: "pre-line"}}>
                            {slide.title}
                          </span>
                            <IconButton onClick={() => startEditing(slide.id, slide.title)} size="small">
                              <EditIcon fontSize="small" sx={{ color: blue[500] }} />
                            </IconButton>
                          </>
                        )}
                      </TableCell>

                      <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 4,
                                    backgroundColor: slide.textColor,
                                    border: '1px solid #ccc',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    setEditingColorId(slide.id);
                                    setEditColor(slide.textColor);
                                }}
                                />
                                {editingColorId === slide.id && (
                                <>
                                    <input
                                    type="color"
                                    value={editColor}
                                    onChange={(e) => setEditColor(e.target.value)}
                                    />
                                    <IconButton onClick={() => saveTextColor(slide.id)}><SaveIcon /></IconButton>
                                    <IconButton onClick={cancelEditingColor}><CloseIcon /></IconButton>
                                </>
                                )}
                            </div>
                        </TableCell>
                      
											<TableCell>
												{editingLinkId === slide.id ? (
													<>
														<TextField
															value={editLink}
															onChange={(e) => setEditLink(e.target.value)}
															fullWidth
															size="small"
															placeholder="https://..."
														/>
														<IconButton onClick={() => saveLink(slide.id)}><SaveIcon /></IconButton>
														<IconButton onClick={cancelEditingLink}><CloseIcon /></IconButton>
													</>
												) : (
													<>
														<a
															href={slide.link}
															target="_blank"
															rel="noopener noreferrer"
															style={{ textDecoration: 'underline', color: '#0077cc' }}
														>
															{slide.link || '—'}
														</a>
														<IconButton onClick={() => startEditingLink(slide.id, slide.link)} size="small">
															<EditIcon fontSize="small" />
														</IconButton>
													</>
												)}
											</TableCell>
											
                      {/* <TableCell style={{whiteSpace: "pre-line"}}>{slide.title}</TableCell> */}
                      <TableCell>{slide.isActive ? 'Да' : 'Нет'}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(slide.id)}
                        >
                          Удалить
                        </Button>
                      </TableCell>
                    </TableRow>
                    )}
                  </Draggable>
                ))}
                {slides.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={7} 
                      align="center"
                      sx={{ 
                        padding: '40px', 
                        color: '#666',
                        fontStyle: 'italic',
                        fontSize: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '48px', opacity: 0.3 }}>📋</div>
                        <div>Пока нет слайдов</div>
                        <div style={{ fontSize: '14px', color: '#999' }}>
                          Создайте первый слайд с помощью формы выше
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          )}
        </Droppable>
      </DragDropContext>
      </div>
    </div>
  );
};

export default AdminSlides;
