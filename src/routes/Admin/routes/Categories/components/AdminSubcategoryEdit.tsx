import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FileEntity } from '../../../../../common/services/upload/types';
import { ImageSelector } from '../../../components/ImageSelector';
import { apiPrivate } from '../../../../../common/api';

const AdminSubcategoryEdit = () => {
    const { subcategoryId } = useParams();
    const navigate = useNavigate();
    const [subcategory, setSubcategory] = useState<any>(null); // Данные подкатегории
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedArchiveImage, setSelectedArchiveImage] = useState<FileEntity | null>(null);
    const language = 'ukr';
  
    // Загрузка данных подкатегории
    useEffect(() => {
      fetchSubcategory();
      fetchCategories();
    }, []);
  
    const fetchCategories = async () => {
        try {
          const res = await apiPrivate.get('/categories');
          setCategories(res.data);
        } catch (e) {
          console.error("Ошибка при загрузке категорий:", e);
        }
      };
    
    const fetchSubcategory = async () => {
      setIsLoading(true);
      try {
        console.log(subcategoryId);
        const response = await apiPrivate.get(`/categories/subcategory/${subcategoryId}`);
        console.log("Subcategory API response:", response.data);
        console.log("Parent data:", response.data.parent);
        
        const translation = response.data.translate.find((t: any) => t.language === language);

        if (!translation) {
            throw new Error(`Перевод для языка "${language}" не найден!`);
        }

        const subcategoryData = {
            ...response.data,
            translate: translation,
        };
        
        // Добавляем поля лейбла, если их нет
        const enrichedSubcategory = {
            ...subcategoryData,
            label: subcategoryData.label || '',
            labelColor: subcategoryData.labelColor || '#72BF44'
        };
        
        console.log("Setting subcategory data:", enrichedSubcategory);
        setSubcategory(enrichedSubcategory);
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
        console.log('Selected category:', selectedCategory);
        if (selectedCategory) {
          setSubcategory((prev: any) => ({ 
            ...prev, 
            parent: selectedCategory 
          }));
        }
      };
    
    // Обновление данных подкатегории
    const handleSave = async () => {
        console.log(subcategory)
      if (!subcategory.translate.name || !subcategory.translate.desc ) {
        alert("Заполните все обязательные поля!");
        return;
      }
      
      if (!subcategory.parent || !subcategory.parent.uuid) {
        alert("Выберите родительскую категорию!");
        return;
      }
      
      console.log(subcategory)
      try {
        let response;
        
        if (selectedArchiveImage) {
          // Обновляем с изображением из архива (id файла)
          console.log('Updating with existing image:', {
            existing_file_id: selectedArchiveImage.id,
            translate: subcategory.translate,
            parentId: subcategory.parent?.uuid
          });
          response = await apiPrivate.put(
            `/categories/subcategory-with-existing-image/${subcategoryId}`,
            {
              existing_file_id: selectedArchiveImage.id,
              translate: subcategory.translate,
              parentId: subcategory.parent?.uuid,
              label: subcategory.label || null,
              labelColor: subcategory.labelColor || null
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        } else {
          // Обновляем без изменения изображения
          response = await apiPrivate.put(
            `/categories/subcategory/${subcategoryId}`,
            {
              ...subcategory,
              parentId: subcategory.parent?.uuid,
              label: subcategory.label || null,
              labelColor: subcategory.labelColor || null
            }
          );
        }
        
        alert("Подкатегория успешно обновлена!");
        navigate("/admin-page/categories/table"); // Возврат на страницу категорий
      } catch (error: any) {
        console.error("Ошибка при обновлении подкатегории:", error);
        const errorMessage = error.response?.data?.message || error.message || "Неизвестная ошибка";
        alert(`Ошибка при обновлении подкатегории: ${errorMessage}`);
      }
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
  
    // Отладочная информация
    console.log('Current subcategory state:', subcategory);
    console.log('Parent data:', subcategory.parent);
  
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Редактировать подкатегорию</h2>
        <img 
          src={getImageUrl(subcategory.image)}
          alt="Подкатегория"
          style={{ width: "200px", height: "auto", marginBottom: "10px" }}
        />

        <div style={{ marginBottom: "20px" }}>
          <ImageSelector
            selectedImage={selectedArchiveImage}
            onImageSelect={img => {
              setSelectedArchiveImage(img);
            }}
            showUploadOption={false}
            label="Выбрать изображение из архива"
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

            {/* Поля для лейбла */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Лейбл (опціонально):
              </label>
              <input
                type="text"
                value={subcategory.label || ''}
                onChange={(e) => setSubcategory((prev: any) => ({ ...prev, label: e.target.value }))}
                placeholder="Наприклад: НОВИНКА, АКЦІЯ, ТОП"
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Колір лейбла:
              </label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="color"
                  value={subcategory.labelColor || '#72BF44'}
                  onChange={(e) => setSubcategory((prev: any) => ({ ...prev, labelColor: e.target.value }))}
                  style={{ width: "50px", height: "40px", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" }}
                />
                <input
                  type="text"
                  value={subcategory.labelColor || '#72BF44'}
                  onChange={(e) => setSubcategory((prev: any) => ({ ...prev, labelColor: e.target.value }))}
                  placeholder="#72BF44"
                  style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
              </div>
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