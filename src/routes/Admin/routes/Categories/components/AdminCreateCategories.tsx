import axios from 'axios';
import React, { useEffect, useState } from 'react'

const AdminCreateCategories = () => {
    const [categories, setCategories] = useState<any[]>([]); // Локальный список категорий
  const [newCategory, setNewCategory] = useState({ name_ukr: "" }); // Новая категория
  const [selectedCategory, setSelectedCategory] = useState(""); // Выбранная категория для подкатегории
  const [newSubcategory, setNewSubcategory] = useState({
    image: "",
    parent_uid: "",
    translate: [
      { language: "ukr", name: "", desc: "" },
    ],
  });

  // Обработчик добавления новой категории
  const handleAddCategory = async () => {
    if (!newCategory.name_ukr) return alert("Введите названия категории!");

    try {
      const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/categories`, newCategory);
      setCategories([...categories, response.data]);
      setNewCategory({ name_ukr: "" });
      alert("Категория успешно добавлена!");
    } catch (error) {
      console.error("Ошибка при добавлении категории:", error);
      alert("Ошибка при добавлении категории!");
    }
  };

  // Обработчик добавления новой подкатегории
  const handleAddSubcategory = async () => {
    console.log(newSubcategory)
    if (!selectedCategory || !newSubcategory.translate[0].name) {
      return alert("Выберите категорию и заполните данные подкатегории!");
    }

    const subcategoryData = {
      ...newSubcategory,
      parent_uid: selectedCategory,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_URL}/categories/subcategory/create`,
        subcategoryData
      );
      alert("Подкатегория успешно добавлена!");
      setNewSubcategory({
        image: "",
        parent_uid: "",
        translate: [
          { language: "ukr", name: "", desc: "" },
        ],
      });
    } catch (error) {
      console.error("Ошибка при добавлении подкатегории:", error);
      alert("Ошибка при добавлении подкатегории!");
    }
  };

  useEffect(() => {
    console.log(newSubcategory)
  }, [newSubcategory]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST_URL}/categories`)
    .then(res => {
        console.log(res.data)
        setCategories(res.data)
    })
  }, [])

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Управління категоріями</h2>

      {/* Добавление новой категории */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Додати категорію</h3>
        <input
          type="text"
          value={newCategory.name_ukr}
          onChange={(e) => setNewCategory({ ...newCategory, name_ukr: e.target.value })}
          placeholder="Название категории (укр)"
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button
          onClick={handleAddCategory}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Додати категорію
        </button>
      </div>

      {/* Добавление новой подкатегории */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Додати підкатегорію</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="">Оберіть категорію</option>
          {categories.map((category, index) => (
            <option key={index} value={category.uuid}>
              {category.name_ukr}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newSubcategory.image}
          onChange={(e) => setNewSubcategory({ ...newSubcategory, image: e.target.value })}
          placeholder="Посилання на зображення"
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <img src={newSubcategory.image}/>
        <input
          type="text"
          value={newSubcategory.translate[0].name}
          onChange={(e) =>
            setNewSubcategory(prev => {
                return {
                    ...newSubcategory,
                    translate: [{...prev.translate[0], name: e.target.value}]
                } 
            })
          }
          placeholder="Назва підкатегорії"
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <textarea
          value={newSubcategory.translate[0].desc}
          onChange={(e) =>
            setNewSubcategory({
              ...newSubcategory,
              translate: [
                { ...newSubcategory.translate[0], desc: e.target.value },
              ],
            })
          }
          placeholder="Опис підкатегорії"
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        ></textarea>
        <button
          onClick={handleAddSubcategory}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2ecc71",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Додати підкатегорію
        </button>
      </div>
    </div>
  );
}
export default AdminCreateCategories;
