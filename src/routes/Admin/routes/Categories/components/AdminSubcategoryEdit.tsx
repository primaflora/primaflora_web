import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const AdminSubcategoryEdit = () => {
    const { subcategoryId } = useParams();
    const navigate = useNavigate();
    const [subcategory, setSubcategory] = useState<any>(null); // Данные подкатегории
    const [isLoading, setIsLoading] = useState(false);
    const language = 'ukr';
  
    // Загрузка данных подкатегории
    useEffect(() => {
      fetchSubcategory();
    }, []);
  
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
  
    // Обновление данных подкатегории
    const handleSave = async () => {
        console.log(subcategory)
      if (!subcategory.image || !subcategory.translate.name || !subcategory.translate.desc ) {
        alert("Заполните все обязательные поля!");
        return;
      }
  
      try {
        await axios.put(
          `${process.env.REACT_APP_HOST_URL}/categories/subcategory/${subcategoryId}`,
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
        <img src={subcategory.image}/>
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