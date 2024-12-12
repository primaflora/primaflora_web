import { useEffect, useState } from 'react';
import { RawDraftContentState } from 'draft-js';
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
import { TProductUpdate } from '../../../../../../common/services/product/types/patchUpdateProduct';
import './styles.css';

export const AdminProductEdit = () => {
    const { uuid } = useParams();
    const { categories } = useUserData();
    const [isHidden, setIsHidden] = useState(false);
    const [description, setDescription] = useState<RawDraftContentState | string>();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [product, setProduct] = useState<TProduct>();
    const [isEdited, setIsEdited] = useState<boolean>(false);

    useEffect(() => {
        if (!uuid) redirect('/admin-page/products/table');

        Service.ProductService.getOneByUid({ uuid: uuid! })
            .then(res => {
                if (!res.data) return;

                setProduct(res.data);
                console.log(res.data);
                try {
                    setDescription(JSON.parse(res.data.desc));
                } catch (e: any) {
                }
                // TODO: make multiple categories
                setSelectedTags([{ 
                    label: (res.data.category as any).translate[0].name, 
                    value: res.data.category.uuid 
                }]);
            })
    }, []);

    const handleDescriptionApply = (state: RawDraftContentState) => {
        setDescription(state);
    }

    const categoriesToTags = () => {
        const arr: Tag[] = [];
        categories.forEach(category => {
            category.childrens.forEach(subcategory => {
                arr.push({ label: subcategory.name, value: subcategory.uuid });
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
            if (value !== product?.[key as keyof TProduct]) {
                updatedFields[key as keyof TProduct] = value as any;
            }
        });
        return updatedFields;
    }

    const generatePayload = (fields: object) => {
        let payload = {} as Partial<TProductUpdate>;

        for (const [key, value] of Object.entries(fields)) {
            if (key === 'title' || key === 'shortDesc') {
                // add field to translate obejct in payload
                if (!payload.translate) payload.translate = {};
                payload.translate[key] = value as string;
            } else {
                if (key === 'price_currency') 
                    payload[key] = Number(value);
                else
                    payload[key as keyof TProductUpdate] = value;
            }
        }

        if (JSON.stringify(description) !== product?.desc) {
            if (!payload.translate) payload.translate = {};
            payload.translate['desc'] = JSON.stringify(description);
        }

        return payload;
    }
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (!product) return;

        // check if all fields are filled
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        // get only updated fields
        const updatedFields = getUpdatedFieldsOnly(formData);
        console.log('updatedFields => ', updatedFields);

        // create payload for request
        const payload = generatePayload(updatedFields);

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
                                    <Panel.FormInput 
                                        defaultValue={product?.photo_url} 
                                        title='Image (URL)' 
                                        type='url' 
                                        name='photo_url'
                                        style={{ width: '150%' }} />
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