import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

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

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
  
    // Перемещение подкатегорий
    if (result.type === 'subcategory') {
      const categoryId = result.source.droppableId;
  
      const category = categories.find((c: any) => c.uuid === categoryId);
      if (!category) return;
  
      const newChildren = [...category.childrens];
      const [movedItem] = newChildren.splice(result.source.index, 1);
      newChildren.splice(result.destination.index, 0, movedItem);
  
      // Обновляем порядок локально
      const newCategories = categories.map((c: any) =>
        c.uuid === categoryId ? { ...c, childrens: newChildren } : c
      );
  
      setCategories(newCategories);
  
      // Сохраняем на сервер
      await axios.put(`${process.env.REACT_APP_HOST_URL}/categories/subcategory/reorder`, {
        orderedIds: newChildren.map((subcat, idx) => ({
          id: subcat.uuid,
          order: idx,
        })),
      });
  
      return;
    }
  
    // Перемещение категорий (основной код)
    const newCategories = [...categories];
    const [removed] = newCategories.splice(result.source.index, 1);
    newCategories.splice(result.destination.index, 0, removed);
    setCategories(newCategories);
    await saveNewCategoryOrder(newCategories);
  };

  const saveNewCategoryOrder = async (orderedCategories: any[]) => {
    try {
        console.log(orderedCategories)
      await axios.put(`${process.env.REACT_APP_HOST_URL}/categories/reorder`, {
        orderedIds: orderedCategories.map((cat, index) => ({
          id: cat.uuid,
          order: index,
        })),
      });
    } catch (err) {
      alert('Ошибка при сохранении порядка!');
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
    setEditCategoryData({ name_ukr: category.name_ukr || "" });
  };

  const handleSaveCategory = async () => {
    // Разрешаем сохранение категорий без названия
    try {
      const categoryData = editCategoryData.name_ukr.trim() === "" ? { name_ukr: null } : editCategoryData;
      await axios.put(`${process.env.REACT_APP_HOST_URL}/categories/${editingCategory.uuid}`, categoryData);
      const updatedCategories = categories.map((category) =>
        category.uuid === editingCategory.uuid ? { ...category, ...categoryData } : category
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories-droppable" type="category">
            {(provided) => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {categories.map((category, index) =>
                  editingCategory && editingCategory.uuid === category.uuid ? (
                    <tr key={category.uuid}>
                      <td colSpan={3} style={{ border: "1px solid #ddd", padding: "10px" }}>
                        <input
                          type="text"
                          value={editCategoryData.name_ukr}
                          onChange={(e) =>
                            setEditCategoryData({ ...editCategoryData, name_ukr: e.target.value })
                          }
                          placeholder="Назва (оставьте пустым для категории-контейнера)"
                          style={{ width: "100%", padding: "5px" }}
                        />
                        <div style={{ marginTop: "10px" }}>
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
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <Draggable key={category.uuid} draggableId={category.uuid} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <td style={{ border: "1px solid #ddd", padding: "10px", verticalAlign: "top" }}>
                            <p
                              style={{
                                color: "black",
                                fontSize: 16,
                                fontWeight: 600,
                                textWrap: "nowrap",
                              }}
                            >
                              {category.name_ukr || `Категорія без назви #${category.id || 'N/A'}`}
                            </p>
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                          <Droppable droppableId={category.uuid} type="subcategory">
                            {(provided) => (
                            <ul
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                              {category.childrens.map((child: any, subIndex: number) => (
                                <Draggable key={child.uuid} draggableId={child.uuid} index={subIndex}>
                                    {(provided) => (
                                    <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            marginBottom: "10px",
                                            justifyContent: "space-between",
                                            display: "flex",
                                            alignItems: "center",
                                            ...provided.draggableProps.style,
                                        }}
                                    >
                                        {child.translate.find((t: any) => t.language === "ukr")?.name || "Без названия"}
                                        <div style={{display: "flex", flexDirection: "row"}}>
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin-page/categories/subcategory/edit/${child.uuid}`)
                                                }
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
                                        </div>
                                    </li>
                                    )}
                                </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                             )}
                            </Droppable>
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
                      )}
                    </Draggable>
                  )
                )}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
      </table>
    </div>
  );
};

export default AdminCategoriesTable;
