import axios from 'axios';
import React, { useEffect, useState } from 'react'

const AdminCreateCategories = () => {
    const [categories, setCategories] = useState<any[]>([]); // Локальный список категорий
  const [newCategory, setNewCategory] = useState({ name_ukr: "", name_rus: "" }); // Новая категория
  const [selectedCategory, setSelectedCategory] = useState(""); // Выбранная категория для подкатегории
  const [newSubcategory, setNewSubcategory] = useState({
    image: "",
    parent_uid: "",
    translate: [
      { language: "ukr", name: "", desc: "" },
      { language: "rus", name: "", desc: "" },
    ],
  });

  // Обработчик добавления новой категории
  const handleAddCategory = async () => {
    if (!newCategory.name_ukr || !newCategory.name_rus) return alert("Введите названия категории!");

    try {
      const response = await axios.post("https://primaflora-12d77550da26.herokuapp.com/categories", newCategory);
      setCategories([...categories, response.data]);
      setNewCategory({ name_ukr: "", name_rus: "" });
      alert("Категория успешно добавлена!");
    } catch (error) {
      console.error("Ошибка при добавлении категории:", error);
      alert("Ошибка при добавлении категории!");
    }
  };

  // Обработчик добавления новой подкатегории
  const handleAddSubcategory = async () => {
    if (!selectedCategory || !newSubcategory.translate[0].name || !newSubcategory.translate[1].name) {
      return alert("Выберите категорию и заполните данные подкатегории!");
    }

    const subcategoryData = {
      ...newSubcategory,
      parent_uid: selectedCategory,
    };

    try {
      const response = await axios.post(
        "https://primaflora-12d77550da26.herokuapp.com/categories/subcategory/create",
        subcategoryData
      );
      alert("Подкатегория успешно добавлена!");
      setNewSubcategory({
        image: "",
        parent_uid: "",
        translate: [
          { language: "ukr", name: "", desc: "" },
          { language: "rus", name: "", desc: "" },
        ],
      });
    } catch (error) {
      console.error("Ошибка при добавлении подкатегории:", error);
      alert("Ошибка при добавлении подкатегории!");
    }
  };

  useEffect(() => {
    axios.get("https://primaflora-12d77550da26.herokuapp.com/categories")
    .then(res => {
        console.log(res.data)
        setCategories(res.data)
    })
  }, [])

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Управление категориями</h2>

      {/* Добавление новой категории */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Добавить категорию</h3>
        <input
          type="text"
          value={newCategory.name_ukr}
          onChange={(e) => setNewCategory({ ...newCategory, name_ukr: e.target.value })}
          placeholder="Название категории (укр)"
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <input
          type="text"
          value={newCategory.name_rus}
          onChange={(e) => setNewCategory({ ...newCategory, name_rus: e.target.value })}
          placeholder="Название категории (рус)"
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
          Добавить категорию
        </button>
      </div>

      {/* Добавление новой подкатегории */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Добавить подкатегорию</h3>
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
          <option value="">Выберите категорию</option>
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
          placeholder="Ссылка на изображение"
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <input
          type="text"
          value={newSubcategory.translate[0].name}
          onChange={(e) =>
            setNewSubcategory({
              ...newSubcategory,
              translate: [
                { ...newSubcategory.translate[0], name: e.target.value },
                newSubcategory.translate[1],
              ],
            })
          }
          placeholder="Название подкатегории (укр)"
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <textarea
          value={newSubcategory.translate[0].desc}
          onChange={(e) =>
            setNewSubcategory({
              ...newSubcategory,
              translate: [
                { ...newSubcategory.translate[0], desc: e.target.value },
                newSubcategory.translate[1],
              ],
            })
          }
          placeholder="Описание подкатегории (укр)"
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        ></textarea>
        <input
          type="text"
          value={newSubcategory.translate[1].name}
          onChange={(e) =>
            setNewSubcategory({
              ...newSubcategory,
              translate: [
                newSubcategory.translate[0],
                { ...newSubcategory.translate[1], name: e.target.value },
              ],
            })
          }
          placeholder="Название подкатегории (рус)"
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <textarea
          value={newSubcategory.translate[1].desc}
          onChange={(e) =>
            setNewSubcategory({
              ...newSubcategory,
              translate: [
                newSubcategory.translate[0],
                { ...newSubcategory.translate[1], desc: e.target.value },
              ],
            })
          }
          placeholder="Описание подкатегории (рус)"
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
          Добавить подкатегорию
        </button>
      </div>
    </div>
  );
}
export default AdminCreateCategories;
