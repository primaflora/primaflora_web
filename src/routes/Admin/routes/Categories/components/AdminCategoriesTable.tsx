import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AdminCategoriesTable = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [editCategoryData, setEditCategoryData] = useState({ name_ukr: "" });
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };
  
    const handleDeleteCategory = async (id: string) => {
      if (!window.confirm("Вы уверены, что хотите удалить эту категорию?")) return;
  
      try {
        await axios.delete(`${process.env.REACT_APP_HOST_URL}/categories/${id}`);
        setCategories(categories.filter((category) => category.uuid !== id));
        alert("Категория успешно удалена!");
      } catch (error) {
        console.error("Ошибка при удалении категории:", error);
        alert("Ошибка при удалении категории!");
      }
    };
  
    const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
      if (!window.confirm("Вы уверены, что хотите удалить эту подкатегорию?")) return;
  
      try {
        await axios.delete(`${process.env.REACT_APP_HOST_URL}/categories/subcategory/${subcategoryId}`);
        const updatedCategories = categories.map((category) =>
          category.uuid === categoryId
            ? { ...category, childrens: category.childrens.filter((child: any) => child.uuid !== subcategoryId) }
            : category
        );
        setCategories(updatedCategories);
        alert("Подкатегория успешно удалена!");
      } catch (error) {
        console.error("Ошибка при удалении подкатегории:", error);
        alert("Ошибка при удалении подкатегории!");
      }
    };
  
    const handleEditCategory = (category: any) => {
      setEditingCategory(category);
      setEditCategoryData({ name_ukr: category.name_ukr });
    };
  
    const handleSaveCategory = async () => {
      if (!editCategoryData.name_ukr) {
        alert("Заполните все поля!");
        return;
      }
  
      try {
        console.warn(editCategoryData)
        console.warn(editingCategory.uuid)

        await axios.put(`${process.env.REACT_APP_HOST_URL}/categories/${editingCategory.uuid}`, editCategoryData);
        const updatedCategories = categories.map((category) =>
          category.uuid === editingCategory.uuid ? { ...category, ...editCategoryData } : category
        );
        setCategories(updatedCategories);
        setEditingCategory(null);
        alert("Категория успешно обновлена!");
      } catch (error) {
        console.error("Ошибка при обновлении категории:", error);
        alert("Ошибка при обновлении категории!");
      }
    };
  
    return (
      <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Список категорії та підкатегорій</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Категорія</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Підкатегорія</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) =>
              editingCategory && editingCategory.uuid === category.uuid ? (
                <tr key={category.uuid}>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                    <input
                      type="text"
                      value={editCategoryData.name_ukr}
                      onChange={(e) => setEditCategoryData({ ...editCategoryData, name_ukr: e.target.value })}
                      placeholder="Назва"
                      style={{ width: "100%", padding: "5px" }}
                    />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                    <em>Редагування підкатегорій вимкнено під час редагування категорії.</em>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                    <button
                      onClick={handleSaveCategory}
                      style={{
                        padding: "5px 10px",
                        marginRight: "5px",
                        backgroundColor: "#2ecc71",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Зберегти
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Відміна
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={category.uuid}>
                  <td style={{ border: "1px solid #ddd", padding: "10px", verticalAlign: "top" }}>
                    <p style={{color: 'black', fontSize: 16, fontWeight: 600, textWrap: 'nowrap'}}>{category.name_ukr}</p>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                    <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                      {category.childrens.map((child: any) => (
                        <li key={child.uuid} style={{ marginBottom: "10px" }}>
                          {child.translate.find((t: any) => t.language === "ukr")?.name || "Без названия"}
                          <button
                            onClick={() => navigate(`/admin-page/categories/subcategory/edit/${child.uuid}`)}
                            style={{
                              marginLeft: "10px",
                              padding: "5px 10px",
                              backgroundColor: "#3498db",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Редагувати
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(category.uuid, child.uuid)}
                            style={{
                              marginLeft: "10px",
                              padding: "5px 10px",
                              backgroundColor: "#e74c3c",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Видалити
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEditCategory(category)}
                      style={{
                        padding: "5px 10px",
                        marginRight: "5px",
                        backgroundColor: "#3498db",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.uuid)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
}

export default AdminCategoriesTable