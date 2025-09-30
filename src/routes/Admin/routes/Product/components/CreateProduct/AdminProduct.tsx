import { useEffect, useState } from 'react';
import { RawDraftContentState } from 'draft-js';
import { useUserData } from '../../../../../../store/tools';
import { Tag } from '../../../../../../components/TagsInput/types';
import { Row } from '../../../../../../components/common';
import { Column } from '../../../../../../components/common/Column';
import { Panel } from '../../../../components/Panel';
import { DescriptionEditor } from '../../../../components/CreateProduct/components/DescriptionEditor';
import { TagsInput } from '../../../../../../components/TagsInput';
import { ProductPreview } from '../ProductPreview';
import './styles.css';
import { TProduct } from '../../../../../../common/services/product/types';
import { Service } from '../../../../../../common/services';
import { TProductPayload } from '../../../../../../common/services/product/types/postCreateProduct';
import axios from 'axios';
import {stateToHTML} from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';
import { apiPrivate } from '../../../../../../common/api';
import { ImageSelector } from '../../../../components/ImageSelector';
import { FileEntity } from '../../../../../../common/services/upload/types';

export const AdminProduct = () => {
    // const { categories } = useUserData();
    const [categories, setCategories] = useState<any[]>([]);
    const [description, setDescription] = useState<RawDraftContentState>();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [card, setCard] = useState<Partial<TProduct>>();
    const [notification, setNotification] = useState<string>();
    const [isHidden, setIsHidden] = useState(false);
    const [inStock, setInStock] = useState(true);
    const [selectedImageFromArchive, setSelectedImageFromArchive] = useState<FileEntity | null>(null);

    const updateCard = (key: keyof Partial<TProduct>, value: string | number | string[]) => {
        setCard(prevState => ({...prevState, [key]: value}));
    }

    // Обновление карточки при выборе изображения из архива
    const handleImageFromArchiveSelect = (file: FileEntity | null) => {
        setSelectedImageFromArchive(file);
        if (file) {
            updateCard('photo_url', file.url);
        }
    };

    const handleDescriptionApply = (state: RawDraftContentState) => {
        setDescription(state);
    }

    const categoriesToTags = () => {
        const arr: Tag[] = [];
        console.log(categories);
        categories.forEach(category => {
            category.childrens?.forEach((subcategory: any) => {
                const subcategoryName = subcategory?.translate?.[0]?.name;
                if (subcategoryName) {
                    const categoryName = category.name_ukr || `Категорія без назви #${category.id}`;
                    const displayName = `${categoryName} → ${subcategoryName}`;
                    arr.push({
                        label: displayName,
                        value: subcategory.id.toString()
                    });
                } else {
                    console.warn('Подкатегория без имени:', subcategory);
                }
                console.log(subcategory);
                // arr.push({ label: subcategory.translate[0].name, value: subcategory.id.toString() });
            })
        })

        return arr;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedTags.length === 0) {
            setNotification('Select at least one category!');
            return;
        }
        
        // Проверяем, что выбрано изображение из архива
        if (!selectedImageFromArchive) {
            setNotification('Выберите изображение для продукта из архива!');
            return;
        }
        
        console.log(description)
        const formData = new FormData(e.currentTarget);

        const rawPoints = (formData.get('descriptionPoints') as string || '')
        .split('\n')
        .map(point => point.trim())
        .filter(Boolean);

        // check if all fields are filled
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        })
        console.log(selectedTags[0].value)
        const desc = stateToHTML(convertFromRaw(description as RawDraftContentState ))
        console.log(desc);

        // Создание продукта с существующим изображением из архива
        const payload = {
            existing_file_id: selectedImageFromArchive.id,
            price_currency: Number(formData.get('price_currency')) || 0,
            price_points: Number(formData.get('price_points')) || 0, // Добавляем обязательное поле
            percent_discount: Number(formData.get('percent_discount')) || 0, // Добавляем обязательное поле
            rating: Number(formData.get('rating')) || 1, // Добавляем обязательное поле
            inStock: inStock, // Используем состояние чекбокса
            categoryIds: selectedTags.map(item => Number(item.value)),
            isPublished: !isHidden,
            translate: [{
                language: 'ukr',
                title: formData.get('title') as string,
                shortDesc: formData.get('shortDesc') as string,
                desc: desc,
                seoTitle: formData.get('seoTitle') as string,
                seoDescription: formData.get('seoDescription') as string
            }],
            descriptionPoints: rawPoints
        };

        console.log('Создание продукта с изображением из архива:', payload);
        console.log('Selected image from archive:', selectedImageFromArchive);

        apiPrivate.post('/products/create-with-existing-image', payload)
            .then((response) => {
                console.log('Продукт успешно создан:', response.data);
                setNotification(`Product ${formData.get('title') as string} created with existing image!`);
                // Очищаем форму
                setSelectedImageFromArchive(null);
                setSelectedTags([]);
                setCard({});
                setInStock(true);
                setDescription(undefined);
            })
            .catch((err) => {
                console.error('Ошибка создания продукта:', err);
                console.error('Error response:', err.response?.data);
                const errorMessage = err.response?.data?.message || err.message || 'Something went wrong!';
                setNotification(`Ошибка: ${errorMessage}`);
            });
    }

    const handlePreview = () => {

    }

    const handleAddTag = (tag: any) => {
        setSelectedTags([...selectedTags, tag]);
    }

    const handleRemoveTag = (tag: any) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    }

    const fetchSubcategories = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/categories`);
          setCategories(response.data);
        } catch (error) {
          console.error("Ошибка при загрузке категорий:", error);
          alert("Не удалось загрузить категории.");
        }
      };
    useEffect(() => {
        fetchSubcategories();
    }, [])

    return (
        <div>
            { notification && 
                <Panel.Notification 
                    onRemove={() => setNotification(undefined)}>
                        { notification }
                </Panel.Notification> 
            }

            <Row style={{ gap: '20px', alignItems: 'normal' }}>
                <Column style={{ width: '65%', gap: '20px', marginBottom: '20px' }}>
                    <Panel.Form onSubmit={handleSubmit}>
                        <Panel.Container>
                            <Panel.Header title='Create Product' />
                            <Panel.Body style={{ gap: '15px' }}>
                                    <Panel.FormInput 
                                        onTextChange={(newText) => updateCard('title', newText)}
                                        defaultValue={card?.title} 
                                        name='title'
                                        title='Title' />
                                    <Row style={{ gap: '15px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ width: '150%' }}>
                                            <ImageSelector
                                                selectedImage={selectedImageFromArchive}
                                                onImageSelect={handleImageFromArchiveSelect}
                                                showUploadOption={false}
                                                label="Product Image"
                                            />
                                        </div>
                                        <Panel.FormInput 
                                        name='price_currency'
                                        defaultValue={card?.price_currency} 
                                        onTextChange={(newText) => updateCard('price_currency', Number(newText))}
                                        title='Price' 
                                        type='number' />
                                    </Row>
                                    <Panel.Checkbox 
                                        label='In Stock' 
                                        state={inStock} 
                                        onChange={() => setInStock(prev => !prev)} />
                                    <Panel.FormInput 
                                        defaultValue={card?.shortDesc} 
                                        title='Short description' 
                                        name='shortDesc'
                                        onTextChange={(newText) => updateCard('shortDesc', newText)}
                                        isTextArea />
                                    
                                    {/* SEO поля */}
                                    <Panel.FormInput 
                                        defaultValue={(card as any)?.seoTitle} 
                                        title='SEO Title (рекомендуется до 60 символов)' 
                                        name='seoTitle'
                                        onTextChange={(newText) => updateCard('seoTitle' as keyof TProduct, newText)} />
                                    <Panel.FormInput 
                                        defaultValue={(card as any)?.seoDescription} 
                                        title='SEO Description (рекомендуется до 160 символов)' 
                                        name='seoDescription'
                                        onTextChange={(newText) => updateCard('seoDescription' as keyof TProduct, newText)}
                                        isTextArea />

                                    <Panel.FormInput
                                        title='Detailed points (one per line)'
                                        name='descriptionPoints'
                                        isTextArea
                                        onTextChange={(text) => {
                                            const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
                                            updateCard('descriptionPoints' as any, lines);
                                        }}
                                    />
                                    <Panel.Checkbox label='Is Hidden' state={isHidden} onChange={() => setIsHidden(prev => !prev)} />
                                    {/* <Panel.Checkbox label='Is Hidden' onChange={() => {}} /> */}
                            </Panel.Body>
                            <Panel.Body>
                                <Panel.Tip>
                                    <b>Important!</b> To create product you have to click 
                                    <code> <b>Apply text</b> </code> 
                                    button first to save your description.
                                </Panel.Tip>
                                <DescriptionEditor defaultRawState={description} onEditorChange={handleDescriptionApply}/>    
                            </Panel.Body>
                        </Panel.Container>
                        <Panel.Button text={'Create Product'} type='submit' />
                    </Panel.Form>
                </Column>
                <Column style={{ maxWidth: '35%', width: '35%', gap: '20px' }}>
                    <Panel.Container>
                        <Panel.Header title='Preview' />
                        <Panel.Body>
                            <ProductPreview card={card} descriptionRaw={description} />
                        </Panel.Body>
                    </Panel.Container>

                    <Panel.Container>
                        <Panel.Header 
                            title='Select Category'
                            style={{ textAlign: 'center', justifyContent: 'space-between' }}>
                                <Panel.Link to='/admin-page/categories/table' text='View all' />
                        </Panel.Header>
                        <Panel.Body>
                            {
                                categories.length &&
                                <TagsInput 
                                tags={categoriesToTags()} 
                                selectedTags={selectedTags}
                                onTagAdd={handleAddTag}
                                onTagRemove={handleRemoveTag} />
                            }
                        </Panel.Body>
                    </Panel.Container>
                </Column>
            </Row>
        </div>
    );
};