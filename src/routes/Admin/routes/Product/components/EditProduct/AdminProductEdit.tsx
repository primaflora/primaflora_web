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
import { redirect, useParams } from 'react-router-dom';
import { Service } from '../../../../../../common/services';
import { ImageSelector } from '../../../../components/ImageSelector';
import { FileEntity } from '../../../../../../common/services/upload/types';
import { TProductUpdate } from '../../../../../../common/services/product/types/patchUpdateProduct';
import './styles.css';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import { apiPrivate } from '../../../../../../common/api';

export const AdminProductEdit = () => {
    const { uuid } = useParams();
    const { categories } = useUserData();
    const [isHidden, setIsHidden] = useState(false);
    const [description, setDescription] = useState<RawDraftContentState>();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [product, setProduct] = useState<TProduct>();
    const [isEdited, setIsEdited] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedImageFromArchive, setSelectedImageFromArchive] = useState<FileEntity | null>(null);
    const [showArchiveModal, setShowArchiveModal] = useState(false);

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
    }

    const categoriesToTags = () => {
        const arr: Tag[] = [];
                categories.forEach(category => {
            category.childrens.forEach((subcategory: any) => {
                arr.push({ label: (subcategory as any).name, value: (subcategory as any).uuid });
            })
        })

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
            if (key === 'title' || key === 'shortDesc') {
                if (!payload.translate) payload.translate = {};
                payload.translate[key] = value;
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

        console.log(stateToHTML(convertFromRaw(description as RawDraftContentState )))
        console.log(product?.desc);
        console.log(stateToHTML(convertFromRaw(description as RawDraftContentState )) !== product?.desc)
        if (stateToHTML(convertFromRaw(description as RawDraftContentState )) !== product?.desc) {
            if (!payload.translate) payload.translate = {};
            payload.translate.desc = stateToHTML(convertFromRaw(description as RawDraftContentState ))
        }

        // payload.translate.push(translate)

        return payload;
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (!product) return;

    // Если выбран новый файл изображения, используем новый эндпоинт
    if (imageFile) {
            // First upload image to archive, then update product using existing_file_id
            try {
                const uploadResp = await Service.UploadService.uploadImage({ file: imageFile });
                const fileId = uploadResp.file.id;

                // Use the existing-file update endpoint
                await apiPrivate.patch(`/products/update-with-existing-image/${product.uuid}`, { existing_file_id: fileId });

                setIsEdited(true);
                setImageFile(null);
                // Update local preview
                setProduct(prev => prev ? ({ ...prev, photo_url: uploadResp.file.url } as any) : prev);
            } catch (err) {
                console.error('Error uploading image and updating product:', err);
            }
        } else {
                // If selected image from archive (and no new file), update via existing-file endpoint
                if (selectedImageFromArchive && !imageFile) {
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
                return Number(item.value)
            })
            
            Service.ProductService.update({ productUid: product.uuid, toUpdate: payload })
                .then(res => {
                    setIsEdited(true);
                })
                .catch(err => {
                    console.log('err => ', err);
                });
        }
    }

    const handleAddTag = (tag: Tag) => {
        setSelectedTags([...selectedTags, tag]);
    }

    const handleRemoveTag = (tag: Tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    }

    return (
        <div>
            <Panel.Title text='Edit Product!' />
            <Panel.Title text='TODO: make update categories!' />
            { isEdited && 
                <Panel.Notification onRemove={() => setIsEdited(false)} >
                    Product updated!
                </Panel.Notification> 
            }
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
                                                if (file) {
                                                    setImageFile(null);
                                                }
                                            }}
                                            onFileUpload={(file: File | null) => {
                                                setImageFile(file);
                                            }}
                                            label="Product Image"
                                        />
                                        {imageFile && (
                                            <span style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                                Selected file: {imageFile.name}
                                            </span>
                                        )}
                                    </div>
                                    <Panel.FormInput 
                                        defaultValue={product?.price_currency} 
                                        title='Price' 
                                        name='price_currency'
                                        type='number' />
                                </Row>
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
                    </Panel.Form>
                </Column>
                <Column style={{ maxWidth: '35%', width: '35%', gap: '20px' }}>
                    <Panel.Container>
                        <Panel.Header 
                            title='Change Category'
                            style={{ textAlign: 'center', justifyContent: 'space-between' }}>
                                <Panel.Link to='/admin-page/categories' text='View all' />
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
        </div>
    );
};