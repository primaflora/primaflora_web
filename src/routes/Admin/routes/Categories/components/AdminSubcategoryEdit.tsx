import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FileEntity } from '../../../../../common/services/upload/types';
import { ImageSelector } from '../../../components/ImageSelector';

const AdminSubcategoryEdit = () => {
    const { subcategoryId } = useParams();
    const navigate = useNavigate();
    const [subcategory, setSubcategory] = useState<any>(null); // Данные подкатегории
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [selectedArchiveImage, setSelectedArchiveImage] = useState<FileEntity | null>(null);
    const language = 'ukr';
  
    // Загрузка данных подкатегории
    useEffect(() => {
      fetchSubcategory();
      fetchCategories();
    }, []);
  
    const fetchCategories = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_HOST_URL}/categories`);
          setCategories(res.data);
        } catch (e) {
          console.error("Ошибка при загрузке категорий:", e);
        }
      };
    
    const fetchSubcategory = async () => {
      setIsLoading(true);
      try {
        console.log(subcategoryId);
        const response = await axios.get(
          `${process.env.REACT_APP_HOST_URL}/categories/subcategory/${subcategoryId}`
        );
        console.log("!!!!!!!!!!!!!!!!!!!!")
        console.log(response.data);
        const translation = response.data.translate.find((t: any) => t.language === language);

        if (!translation) {
            throw new Error(`Перевод для языка "${language}" не найден!`);
        }

        setSubcategory({
            ...response.data,
            translate: translation,
        });
        // setSubcategory(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке подкатегории:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUuid = e.target.value;
        const selectedCategory = categories.find(cat => cat.uuid === selectedUuid);
        if (selectedCategory) {
          setSubcategory((prev: any) => ({ ...prev, parent: selectedCategory }));
        }
      };
    
    // Обновление данных подкатегории
    const handleSave = async () => {
        console.log(subcategory)
      if (!subcategory.translate.name || !subcategory.translate.desc ) {
        alert("Заполните все обязательные поля!");
        return;
      }
      console.log(subcategory)
      try {
        let response;
        
        if (newImageFile) {
          // Обновляем с новым изображением (загрузка файла)
          const formData = new FormData();
          formData.append('image', newImageFile);
          formData.append('translate', JSON.stringify(subcategory.translate));
          formData.append('parentId', subcategory.parent.uuid);
          response = await axios.put(
            `${process.env.REACT_APP_HOST_URL}/categories/subcategory-with-image/${subcategoryId}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
        } else if (selectedArchiveImage) {
          // Обновляем с изображением из архива (uuid файла)
          response = await axios.put(
            `${process.env.REACT_APP_HOST_URL}/categories/subcategory/${subcategoryId}`,
            {
              ...subcategory,
              parentId: subcategory.parent.uuid,
              image: selectedArchiveImage.url // или .uuid, если бек ожидает uuid
            }
          );
        } else {
          // Обновляем без изменения изображения
          response = await axios.put(
            `${process.env.REACT_APP_HOST_URL}/categories/subcategory/${subcategoryId}`,
            {
              ...subcategory,
              parentId: subcategory.parent.uuid
            }
          );
        }
        
        alert("Подкатегория успешно обновлена!");
        navigate("/admin-page/categories/table"); // Возврат на страницу категорий
      } catch (error) {
        console.error("Ошибка при обновлении подкатегории:", error);
        alert("Ошибка при обновлении подкатегории!");
      }
    };
  
    // Обновление изображения
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewImageFile(e.target.files?.[0] || null);
    };
  
    // Функция для формирования полного URL изображения
    const getImageUrl = (imageUrl: string) => {
      if (imageUrl.startsWith('http')) {
        return imageUrl; // Уже полный URL
      }
      return `${process.env.REACT_APP_HOST_URL}${imageUrl}`; // Добавляем базовый URL
    };
  
    // Обновление перевода
    const handleTranslationChange = (field: string, value: string) => {
        setSubcategory({
            ...subcategory,
            translate: {
                ...subcategory.translate,
                [field]: value,
            },
        });
    };
  
    if (isLoading || !subcategory) return <div>Загрузка...</div>;
  
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Редактировать подкатегорию</h2>
        <img 
          src={getImageUrl(subcategory.image)}
          alt="Подкатегория"
          style={{ width: "200px", height: "auto", marginBottom: "10px" }}
        />

        <div style={{ marginBottom: "20px" }}>
          <label>Новое изображение (оставьте пустым, чтобы не менять):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          {newImageFile && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              Выбран новый файл: {newImageFile.name}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <ImageSelector
            selectedImage={selectedArchiveImage}
            onImageSelect={img => {
              setSelectedArchiveImage(img);
              setNewImageFile(null); // сбрасываем файл, если выбрано из архива
            }}
            onFileUpload={file => {
              setNewImageFile(file);
              setSelectedArchiveImage(null); // сбрасываем архив, если выбран файл
            }}
            showUploadOption={false}
            label="Выбрать из архива"
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
            <label>Категория:</label>
            <select
                value={subcategory.parent?.uuid || ''}
                onChange={handleCategoryChange}
                style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                }}
            >
                <option value="">Выберите категорию</option>
                {categories.map((cat: any) => (
                <option key={cat.uuid} value={cat.uuid}>
                    {cat.name_ukr}
                </option>
                ))}
            </select>
            </div>
  
        {/* {subcategory.translate.map((translation: any, index: any) => (
          <div key={translation.uuid || index} style={{ marginBottom: "20px" }}>
            <h3>Перевод ({translation.language.toUpperCase()})</h3>
            <label>Название:</label>
            <input
              type="text"
              value={translation.name}
              onChange={(e) => handleTranslationChange(index, "name", e.target.value)}
              placeholder={`Название (${translation.language})`}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <label>Описание:</label>
            <textarea
              value={translation.desc}
              onChange={(e) => handleTranslationChange(index, "desc", e.target.value)}
              placeholder={`Описание (${translation.language})`}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            ></textarea>
          </div>
        ))} */}

<div style={{ marginBottom: "20px" }}>
                <h3>Перевод ({subcategory.translate.language.toUpperCase()})</h3>
                <label>Название:</label>
                <input
                    type="text"
                    value={subcategory.translate.name}
                    onChange={(e) => handleTranslationChange("name", e.target.value)}
                    placeholder={`Название (${subcategory.translate.language})`}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
                <label>Описание:</label>
                <textarea
                    value={subcategory.translate.desc}
                    onChange={(e) => handleTranslationChange("desc", e.target.value)}
                    placeholder={`Описание (${subcategory.translate.language})`}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                ></textarea>
            </div>
  
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2ecc71",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Сохранить
        </button>
      </div>
    );
}

export default AdminSubcategoryEdit