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

const AdminSlides = () => {
  const [slides, setSlides] = useState<any>([]);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', textColor: '', link: '' });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');


  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string>('');


  const [editingColorId, setEditingColorId] = useState<number | null>(null);
	const [editColor, setEditColor] = useState<string>('');


	const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
	const [editLink, setEditLink] = useState<string>('');

	const startEditingLink = (id: number, currentLink: string) => {
		setEditingLinkId(id);
		setEditLink(currentLink || '');
	};

	const cancelEditingLink = () => {
		setEditingLinkId(null);
		setEditLink('');
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
    const res = await apiPrivate.post('/slides', form);
    setSlides((prev: any) => [...prev, res.data]);
    setForm({ title: '', subtitle: '', imageUrl: '', textColor: '', link: '' });
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


  const startEditingImage = (id: number, currentUrl: string) => {
    setEditingImageId(id);
    setEditImageUrl(currentUrl);
  };

  const cancelEditingImage = () => {
    setEditingImageId(null);
    setEditImageUrl('');
  };

  const saveImageUrl = async (id: number) => {
    await apiPrivate.patch(`/slides/${id}`, { imageUrl: editImageUrl });
    setSlides((prev: any) =>
      prev.map((slide: any) =>
        slide.id === id ? { ...slide, imageUrl: editImageUrl } : slide
      )
    );
    cancelEditingImage();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Добавить слайд</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <TextField
          label="Заголовок"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          multiline
          minRows={2}
          fullWidth
          required
        />
        <TextField
            label="Цвет текста"
            type="color"
            value={form.textColor || '#000000'}
            onChange={(e) => setForm({ ...form, textColor: e.target.value })}
            style={{ width: 120 }}
        />
				<TextField
					label="Ссылка"
					value={form.link}
					onChange={(e) => setForm({ ...form, link: e.target.value })}
					fullWidth
				/>
        <TextField
          label="Ссылка на изображение"
          value={form.imageUrl}
          onChange={(e: any) => setForm({ ...form, imageUrl: e.target.value })}
          required
        />
        <Button type="submit" variant="contained" color="primary">Добавить</Button>
      </form>

      <h2>Список слайдов</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slides">
          {(provided) => (
          <TableContainer component={Paper} {...provided.droppableProps}
              ref={provided.innerRef}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Изображение</TableCell>
                  <TableCell>Заголовок</TableCell>
                  <TableCell>Цвет текста</TableCell>
									<TableCell>Ссылка</TableCell>
                  <TableCell>Активен</TableCell>
                  <TableCell>Действия</TableCell>
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
                      style={{
                        ...provided.draggableProps.style,
                        background: '#fafafa',
                        cursor: 'grab',
                      }}
                    >
                      <TableCell>{slide.id}</TableCell>
                      <TableCell>
                        {editingImageId === slide.id ? (
                          <>
                            <TextField
                              value={editImageUrl}
                              onChange={(e) => setEditImageUrl(e.target.value)}
                              fullWidth
                              size="small"
                              placeholder="URL изображения"
                            />
                            <IconButton onClick={() => saveImageUrl(slide.id)}><SaveIcon sx={{color: green[500]}} /></IconButton>
                            <IconButton onClick={cancelEditingImage}><CloseIcon sx={{color: red[500]}} /></IconButton>
                          </>
                        ) : (
                          <>
                            <img
                              src={slide.imageUrl}
                              alt={slide.title}
                              style={{ width: 80, cursor: 'pointer' }}
                              onClick={() => startEditingImage(slide.id, slide.imageUrl)}
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
                    <TableCell colSpan={6} align="center">Нет слайдов</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default AdminSlides;
