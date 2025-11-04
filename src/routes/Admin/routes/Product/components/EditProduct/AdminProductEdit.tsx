import { useEffect, useState } from 'react';
import { convertFromRaw, convertToRaw, RawDraftContentState } from 'draft-js';
import { useUserData } from '../../../../../../store/tools';
import { Tag } from '../../../../../../components/TagsInput/types';
import { Row } from '../../../../../../components/common';
import { Column } from '../../../../../../components/common/Column';
import { Panel } from '../../../../components/Panel';
import { DescriptionEditor } from '../../../../components/CreateProduct/components/DescriptionEditor';
import { TagsInput } from '../../../../../../components/TagsInput';
import { TProduct } from '../../../../../../common/services/category/types/common';
import { TProductFull } from '../../../../../../common/services/category/types/common';
import { redirect, useParams } from 'react-router-dom';
import { Service } from '../../../../../../common/services';
import { ImageSelector } from '../../../../components/ImageSelector';
import { FileEntity } from '../../../../../../common/services/upload/types';
import { TProductUpdate } from '../../../../../../common/services/product/types/patchUpdateProduct';
import './styles.css';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import { apiPrivate } from '../../../../../../common/api';

// Компонент модального окна с категориями
const CategoriesModal = ({ categories, isOpen, onClose, onCategorySelect }: any) => {
    if (!isOpen) return null;

    const handleCategoryClick = (subcategory: any, categoryName: string) => {
        const subcategoryName = subcategory?.translate?.[0]?.name;
        if (subcategoryName) {
            const displayName = `${categoryName} → ${subcategoryName}`;
            const tag = {
                label: displayName,
                value: subcategory.id.toString()
            };
            onCategorySelect(tag);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '80%',
                maxHeight: '80%',
                overflow: 'auto',
                minWidth: '600px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Выберите категорию</h3>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#999'
                        }}
                    >
                        ×
                    </button>
                </div>
                
                {categories.map((category: any) => (
                    <div key={category.id} style={{ marginBottom: '20px' }}>
                        <h4 style={{ 
                            color: '#333', 
                            borderBottom: '1px solid #eee', 
                            paddingBottom: '8px',
                            marginBottom: '12px'
                        }}>
                            {category.name_ukr || `Категорія #${category.id}`}
                        </h4>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                            gap: '8px',
                            marginLeft: '15px'
                        }}>
                            {category.childrens?.map((subcategory: any) => {
                                const subcategoryName = subcategory?.translate?.[0]?.name;
                                if (!subcategoryName) return null;
                                
                                return (
                                    <button
                                        key={subcategory.id}
                                        onClick={() => handleCategoryClick(subcategory, category.name_ukr)}
                                        style={{
                                            padding: '8px 12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            backgroundColor: '#f9f9f9',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontSize: '14px',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9e9e9'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                    >
                                        {subcategoryName}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AdminProductEdit = () => {
    const { uuid } = useParams();
    const { categories } = useUserData();
    const [isHidden, setIsHidden] = useState(false);
    const [inStock, setInStock] = useState(true);
    const [description, setDescription] = useState<RawDraftContentState>();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [product, setProduct] = useState<TProductFull>();
    const [isEdited, setIsEdited] = useState<boolean>(false);
    const [selectedImageFromArchive, setSelectedImageFromArchive] = useState<FileEntity | null>(null);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
    const [notification, setNotification] = useState<string>();
    const [isDescriptionEditorTouched, setIsDescriptionEditorTouched] = useState(false);

    // Функция для формирования полного URL изображения
    const getImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) {
            return imageUrl; // Уже полный URL
        }
        return `${process.env.REACT_APP_HOST_URL}${imageUrl}`; // Добавляем базовый URL
    };

    useEffect(() => {
        if (!uuid) redirect('/admin-page/products/table');

        Service.ProductService.getOneByUid({ uuid: uuid! })
            .then(res => {
                if (!res.data) return;

                setProduct(res.data);
                setInStock(res.data.inStock || false);
                console.log(res.data);
                try {
                    setDescription(convertToRaw(stateFromHTML(res.data.desc)));
                } catch (e: any) {
                }
                // TODO: make multiple categories
                // setSelectedTags([{ 
                //     label: (res.data.category as any).translate[0].name, 
                //     value: res.data.category.uuid 
                // }]);
                setSelectedTags(res.data.categories.map(cat => {
                    return {
                        label: (cat.translate?.[0]?.name as any) || '', 
                        value: (cat.id as any) as string
                    }
                }));
            })
    }, []);

    const handleDescriptionApply = (state: RawDraftContentState) => {
        setDescription(state);
        setIsDescriptionEditorTouched(false); // Сбрасываем флаг после применения
    }

    const categoriesToTags = () => {
        console.log('=== categoriesToTags DEBUG ===');
        console.log('Categories from useUserData:', categories);
        
        const arr: Tag[] = [];
        categories.forEach(category => {
            console.log('Processing category:', category);
            console.log('Category childrens:', category.childrens);
            
            if (category.childrens && Array.isArray(category.childrens)) {
                category.childrens.forEach((subcategory: any) => {
                    console.log('Processing subcategory:', subcategory);
                    // Пробуем получить имя из разных источников
                    const subcategoryName = subcategory?.translate?.[0]?.name || subcategory?.name;
                    console.log('Subcategory name:', subcategoryName);
                    console.log('Subcategory ID:', subcategory?.id);
                    
                    if (subcategoryName && subcategory?.id) {
                        const categoryName = category.name_ukr || category.name || `Категорія без назви #${category.id}`;
                        const displayName = `${categoryName} → ${subcategoryName}`;
                        arr.push({ 
                            label: displayName, 
                            value: subcategory.id.toString() // Используем числовой ID, конвертированный в строку
                        });
                        console.log('Added tag:', { label: displayName, value: subcategory.id.toString() });
                    } else {
                        console.log('Skipping subcategory - missing name or id');
                    }
                });
            } else {
                console.log('Category has no childrens or childrens is not array');
            }
        });

        console.log('Final tags array:', arr);
        return arr;
    }
    const getUpdatedFieldsOnly = (formData: FormData) => {
        const updatedFields: Partial<TProduct> = {};

        // return all formData fields al object
        if (!product) {
            formData.forEach((value, key) => {
                updatedFields[key as keyof TProduct] = value as any;
            });
            return updatedFields;
        };
        
        // return only updated fields
        formData.forEach((value, key) => {
            if (key === 'descriptionPoints') {
                const newVal = (value as string).split('\n').map(v => v.trim()).filter(Boolean);
                if (JSON.stringify(newVal) !== JSON.stringify(product?.descriptionPoints)) {
                  updatedFields[key as keyof TProduct] = newVal as any;
                }
            } else {
                if (value !== product?.[key as keyof TProduct]) {
                    updatedFields[key as keyof TProduct] = value as any;
                }
            }
        });
        return updatedFields;
    }

    const generatePayload = (fields: object) => {
        console.log("Fields", fields)
        let payload = {} as Partial<TProductUpdate>;


        const translate: any = {language: 'ukr'}

        for (const [key, value] of Object.entries(fields)) {
            if (key === 'title' || key === 'shortDesc' || key === 'seoTitle' || key === 'seoDescription') {
                if (!payload.translate) payload.translate = {};
                (payload.translate as any)[key] = value;
                // add field to translate obejct in payload
                // if (!payload.translate) payload.translate = [];
                // payload.translate.push({
                //     [key]: value
                // })
            } else if (key === 'descriptionPoints') {
                payload.descriptionPoints = value as string[];
            } else {
                if (key === 'price_currency') 
                    payload[key] = Number(value);
                else
                    payload[key as keyof TProductUpdate] = value;
            }
        }

        // Проверяем описание только если оно было применено (description не пустое)
        if (description) {
            console.log(stateToHTML(convertFromRaw(description as RawDraftContentState )))
            console.log(product?.desc);
            console.log(stateToHTML(convertFromRaw(description as RawDraftContentState )) !== product?.desc)
            if (stateToHTML(convertFromRaw(description as RawDraftContentState )) !== product?.desc) {
                if (!payload.translate) payload.translate = {};
                payload.translate.desc = stateToHTML(convertFromRaw(description as RawDraftContentState ))
            }
        }

        // Добавляем inStock если он изменился
        if (inStock !== product?.inStock) {
            payload.inStock = inStock;
        }

        // payload.translate.push(translate)

        return payload;
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (!product) return;

        // Если выбрано изображение из архива, обновляем изображение продукта
        if (selectedImageFromArchive) {
            apiPrivate.patch(`/products/update-with-existing-image/${product.uuid}`, { existing_file_id: selectedImageFromArchive.id })
                .then(() => {
                    setIsEdited(true);
                    // Update local product preview
                    setProduct(prev => prev ? ({ ...prev, photo_url: selectedImageFromArchive.url } as any) : prev);
                    setSelectedImageFromArchive(null);
                })
                .catch((err) => {
                    console.error('Error updating product with existing image:', err);
                });
            return;
        }

        // Используем старый метод для обновления без изображения
        // check if all fields are filled
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        // get only updated fields
        const updatedFields = getUpdatedFieldsOnly(formData);
        console.log('updatedFields => ', updatedFields);

        // create payload for request
        const payload = generatePayload(updatedFields);
        console.log(payload)
        payload.categoryIds = selectedTags.map(item => {
            console.log(item);
            const id = Number(item.value);
            return isNaN(id) ? null : id;
        }).filter(id => id !== null) as number[]
        
        Service.ProductService.update({ productUid: product.uuid, toUpdate: payload })
            .then(res => {
                setIsEdited(true);
            })
            .catch(err => {
                console.log('err => ', err);
            });
    }

    const handleAddTag = (tag: Tag) => {
        setSelectedTags([...selectedTags, tag]);
    }

    const handleRemoveTag = (tag: Tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    }

    const handleCategorySelect = (tag: Tag) => {
        // Проверяем, не выбрана ли уже эта категория
        const isAlreadySelected = selectedTags.some(selectedTag => selectedTag.value === tag.value);
        if (!isAlreadySelected) {
            setSelectedTags([...selectedTags, tag]);
        }
        setIsCategoriesModalOpen(false);
    };

    return (
        <div>
            <Panel.Title text='Edit Product!' />
            <Panel.Title text='TODO: make update categories!' />

            <Row style={{ gap: '20px', alignItems: 'normal' }}>
                <Column style={{ width: '65%', gap: '20px', marginBottom: '20px' }}>
                    <Panel.Form style={{ gap: '20px' }} onSubmit={handleSubmit}>
                        <Panel.Container>
                            <Panel.Header title={'Edit Product'} />
                            <Panel.Body style={{ gap: '15px' }}>
                                <Panel.FormInput 
                                    defaultValue={product?.title} 
                                    name='title'
                                    title='Title' />
                                <Row style={{ gap: '15px', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', width: '230%' }}>
                                        <ImageSelector
                                            selectedImage={selectedImageFromArchive ? selectedImageFromArchive : product ? ({ id: product.uuid as any, url: product.photo_url, original_name: '' } as any) : undefined}
                                            onImageSelect={(file: FileEntity) => {
                                                setSelectedImageFromArchive(file);
                                            }}
                                            showUploadOption={false}
                                            label="Product Image"
                                        />
                                    </div>
                                    <Panel.FormInput 
                                        defaultValue={product?.price_currency} 
                                        title='Price' 
                                        name='price_currency'
                                        type='number' />
                                </Row>
                                <Panel.Checkbox 
                                    label='In Stock' 
                                    state={inStock} 
                                    onChange={() => setInStock(prev => !prev)} />
                                {/* <Panel.FormInput 
                                    defaultValue={product?.shortDesc} 
                                    title='Card description' 
                                    // name='shortDesc'
                                    isTextArea /> */}
                                <Panel.FormInput 
                                    defaultValue={product?.shortDesc} 
                                    title='Short description' 
                                    name='shortDesc'
                                    isTextArea />
                                
                                {/* SEO поля */}
                                <Panel.FormInput 
                                    defaultValue={(product as any)?.seoTitle} 
                                    title='SEO Title (рекомендуется до 60 символов)' 
                                    name='seoTitle' />
                                <Panel.FormInput 
                                    defaultValue={(product as any)?.seoDescription} 
                                    title='SEO Description (рекомендуется до 160 символов)' 
                                    name='seoDescription'
                                    isTextArea />

                                <Panel.FormInput
                                    defaultValue={product?.descriptionPoints?.join('\n')}
                                    title='Detailed points (one per line)'
                                    name='descriptionPoints'
                                    isTextArea
                                />
                                <Panel.Checkbox label='Is Hidden' state={isHidden} onChange={() => setIsHidden(prev => !prev)} />
                            </Panel.Body>
                            <Panel.Body>
                                <Panel.Tip>
                                    <b>Important!</b> To edit product you have to click 
                                    <code> <b>Apply text</b> </code> 
                                    button first to save your description.
                                </Panel.Tip>
                                <DescriptionEditor defaultRawState={description} onEditorChange={handleDescriptionApply}/>    
                            </Panel.Body>
                        </Panel.Container>
                        <Panel.Button text={'Edit Product'} type='submit' />
                        { isEdited && 
                            <Panel.Notification onRemove={() => setIsEdited(false)} >
                                Product updated!
                            </Panel.Notification> 
                        }
                        { notification && 
                            <Panel.Notification 
                                onRemove={() => setNotification(undefined)}>
                                    { notification }
                            </Panel.Notification> 
                        }
                    </Panel.Form>
                </Column>
                <Column style={{ maxWidth: '35%', width: '35%', gap: '20px' }}>
                    <Panel.Container>
                        <Panel.Header 
                            title='Change Category'
                            style={{ textAlign: 'center', justifyContent: 'space-between' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsCategoriesModalOpen(true)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#007bff',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Подивитися всі категорії
                                </button>
                        </Panel.Header>
                        <Panel.Body>
                            <TagsInput 
                                tags={categoriesToTags()} 
                                selectedTags={selectedTags}
                                onTagAdd={handleAddTag}
                                onTagRemove={handleRemoveTag} />
                        </Panel.Body>
                    </Panel.Container>
                </Column>
            </Row>
            
            <CategoriesModal
                categories={categories}
                isOpen={isCategoriesModalOpen}
                onClose={() => setIsCategoriesModalOpen(false)}
                onCategorySelect={handleCategorySelect}
            />
        </div>
    );
};