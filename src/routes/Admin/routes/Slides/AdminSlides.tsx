import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField
} from '@mui/material';
import { apiPrivate } from '../../../../common/api';

const AdminSlides = () => {
  const [slides, setSlides] = useState<any>([]);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '' });

  useEffect(() => {
    apiPrivate.get('/slides').then(res => setSlides(res.data));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await apiPrivate.post('/slides', form);
    setSlides((prev: any) => [...prev, res.data]);
    setForm({ title: '', subtitle: '', imageUrl: '' });
  };

  const handleDelete = async (id: any) => {
    await apiPrivate.delete(`/slides/${id}`);
    setSlides((prev: any) => prev.filter((slide: any) => slide.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Добавить слайд</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <TextField
          label="Заголовок"
          value={form.title}
          onChange={(e: any) => setForm({ ...form, title: e.target.value })}
          required
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Изображение</TableCell>
              <TableCell>Заголовок</TableCell>
              <TableCell>Активен</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slides.map((slide: any) => (
              <TableRow key={slide.id}>
                <TableCell>{slide.id}</TableCell>
                <TableCell>
                  <img src={slide.imageUrl} alt={slide.title} style={{ width: 80 }} />
                </TableCell>
                <TableCell>{slide.title}</TableCell>
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
            ))}
            {slides.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Нет слайдов</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminSlides;
