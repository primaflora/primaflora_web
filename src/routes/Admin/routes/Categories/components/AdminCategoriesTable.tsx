import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AdminCategoriesTable = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [editCategoryData, setEditCategoryData] = useState({ name_ukr: "", name_rus: "" });
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://primaflora-12d77550da26.herokuapp.com/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };
  
    const handleDeleteCategory = async (id: string) => {
      if (!window.confirm("Вы уверены, что хотите удалить эту категорию?")) return;
  
      try {
        await axios.delete(`https://primaflora-12d77550da26.herokuapp.com/categories/${id}`);
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
        await axios.delete(`https://primaflora-12d77550da26.herokuapp.com/categories/subcategory/${subcategoryId}`);
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
      setEditCategoryData({ name_ukr: category.name_ukr, name_rus: category.name_rus });
    };
  
    const handleSaveCategory = async () => {
      if (!editCategoryData.name_ukr || !editCategoryData.name_rus) {
        alert("Заполните все поля!");
        return;
      }
  
      try {
        await axios.put(`https://primaflora-12d77550da26.herokuapp.com/categories/${editingCategory.uuid}`, editCategoryData);
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
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Список категорий и подкатегорий</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Категория</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Подкатегории</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>Действия</th>
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
                      placeholder="Название (укр)"
                      style={{ width: "100%", padding: "5px" }}
                    />
                    <input
                      type="text"
                      value={editCategoryData.name_rus}
                      onChange={(e) => setEditCategoryData({ ...editCategoryData, name_rus: e.target.value })}
                      placeholder="Название (рус)"
                      style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                    />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                    <em>Редактирование подкатегорий отключено при редактировании категории.</em>
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
                      Сохранить
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
                      Отмена
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={category.uuid}>
                  <td style={{ border: "1px solid #ddd", padding: "10px", verticalAlign: "top" }}>
                    <p style={{color: 'black', fontSize: 16, fontWeight: 600, textWrap: 'nowrap'}}>{category.name_ukr}</p>
                    <hr/>
                    <p style={{color: 'black', fontSize: 16, fontWeight: 600, textWrap: 'nowrap'}}>{category.name_rus}</p>
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
                            Редактировать
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
                            Удалить
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
                      Редактировать
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
                      Удалить
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