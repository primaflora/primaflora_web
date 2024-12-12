import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const AdminSubcategoryEdit = () => {
    const { subcategoryId } = useParams();
    const navigate = useNavigate();
    const [subcategory, setSubcategory] = useState<any>(null); // Данные подкатегории
    const [isLoading, setIsLoading] = useState(false);
  
    // Загрузка данных подкатегории
    useEffect(() => {
      fetchSubcategory();
    }, []);
  
    const fetchSubcategory = async () => {
      setIsLoading(true);
      try {
        console.log(subcategoryId);
        const response = await axios.get(
          `https://primaflora-12d77550da26.herokuapp.com/categories/subcategory/${subcategoryId}`
        );
        console.log("!!!!!!!!!!!!!!!!!!!!")
        console.log(response.data);
        setSubcategory(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке подкатегории:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Обновление данных подкатегории
    const handleSave = async () => {
      if (!subcategory.image || subcategory.translate.some((t: any) => !t.name || !t.desc)) {
        alert("Заполните все обязательные поля!");
        return;
      }
  
      try {
        await axios.put(
          `https://primaflora-12d77550da26.herokuapp.com/categories/subcategory/${subcategoryId}`,
          subcategory
        );
        alert("Подкатегория успешно обновлена!");
        navigate("/admin-page/categories/table"); // Возврат на страницу категорий
      } catch (error) {
        console.error("Ошибка при обновлении подкатегории:", error);
        alert("Ошибка при обновлении подкатегории!");
      }
    };
  
    // Обновление изображения
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubcategory({ ...subcategory, image: e.target.value });
    };
  
    // Обновление перевода
    const handleTranslationChange = (index: number, field: string, value: string) => {
      const updatedTranslations = subcategory.translate.map((translation: any, idx: any) =>
        idx === index ? { ...translation, [field]: value } : translation
      );
      setSubcategory({ ...subcategory, translate: updatedTranslations });
    };
  
    if (isLoading || !subcategory) return <div>Загрузка...</div>;
  
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Редактировать подкатегорию</h2>
        <div style={{ marginBottom: "20px" }}>
          <label>Ссылка на изображение:</label>
          <input
            type="text"
            value={subcategory.image}
            onChange={handleImageChange}
            placeholder="URL изображения"
            style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
  
        {subcategory.translate.map((translation: any, index: any) => (
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
        ))}
  
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