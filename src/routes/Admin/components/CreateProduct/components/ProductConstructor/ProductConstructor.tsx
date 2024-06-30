import { FormEvent, useState } from 'react'
import { CardPreview } from '../../../../../../components/CardPreview/CardPreview'
import { TCardPreviewProps } from '../../../../../../components/CardPreview/types'
import { InputModal } from '../../../../../../components/common/Modals/Input/InputModal'
import { Dropdown } from '../../../../../../components/DropdownList'
import { useUserData } from '../../../../../../store/tools'
import { TDropdownListElem } from '../../../../../../components/DropdownList/types'
import { Button } from '../../../../../../components/buttons'
import { DescriptionConstructor } from '../DescriptionConstructor'
import { DescriptionElementType } from '../DescriptionConstructor/types'
import { Service } from '../../../../../../common/services'
import { TPostCreateProductRequest } from '../../../../../../common/services/product/types/postCreateProduct'
import { useToast } from '../../../../../../common/toast'
import './styles.css'

export const ProductConstructor = () => {  
    const { categories } = useUserData();
    const { notifyError, notifySuccess } = useToast();
    const [error, setError] = useState<string>('');
    const [description, setDescription] = useState<DescriptionElementType[]>([]);
    const [subcategoryId, setSubcategoryId] = useState<string>('');
    const [formData, setFormData] = useState<TCardPreviewProps['card']>({
        photo_url: '',
        title: '',
        shortDesc: '',
        price_currency: undefined,
        percent_discount: undefined,
        rating: undefined,
    });

    const categoriesToDropdown = () => {
        const list: TDropdownListElem[] = [];

        categories.map(category => (
            category.childrens.map(subcategory => { 
                list.push({ title: subcategory.name, value: String(subcategory.id) })
            })
        ));

        return list;
    }

    const handleSubcategorySelect = (item: TDropdownListElem) => {
        setSubcategoryId(item.value);
    }

    const handleError = (text: string) => {
        setError(text);
        setTimeout(() => {
            setError('');
        }, 4000);
    }

    const printFormData = (data: FormData) => {
        data.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
    } 

    const descriptionToJsonString = () => {
        const formattedDescription = description.map(value => ({ [value.key]: value.value }));
        return JSON.stringify(formattedDescription, null, 2);
    }

    const handleCreateProduct = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newProduct = new FormData(e.currentTarget);

        if (!subcategoryId) {
            handleError("You did't pick category!");
            return;
        }
        newProduct.forEach((value, key) => {
            if (!value) {
                handleError(`Field (${key}) is empty!`);
            }
        });

        const descriptionJson = descriptionToJsonString();

        const payload: TPostCreateProductRequest['payload'] = {
            photo_url: newProduct.get('photo_url') as string,
            price_currency: parseFloat(newProduct.get('price_currency') as string),
            price_points: 0,
            percent_discount: parseFloat(newProduct.get('percent_discount') as string),
            rating: parseFloat(newProduct.get('rating') as string), 
            categoryId: Number(subcategoryId),
            translate: []
        };

        payload.translate = [
            {
                language: 'rus',
                title: newProduct.get('title_rus') as string,
                shortDesc: newProduct.get('shortDesc_rus') as string,
                desc: descriptionJson,
            },
            {
                language: 'ukr',
                title: newProduct.get('title_ukr') as string,
                shortDesc: newProduct.get('shortDesc_ukr') as string,
                desc: descriptionJson,
            }
        ];

        Service.ProductService.create(payload)
            .then(res => {
                console.log(res.data);
                notifySuccess(`New Product created!`);
            })
            .catch(err => {
                console.log(`Error while tring to create product! ${err}`);
                notifyError('Error while tring to create product!');
            });
    }

    const handleDescriptionApply = (data: DescriptionElementType[]) => {
        setDescription(data);
    }

    const renderDescription = () => {
        const formatValue = (value: string): string => {
            if (!value) return '';
    
            if (typeof value === 'object') {
                return 'object type';
            }
    
            if (typeof value === 'boolean') {
                return value ? 'Так' : 'Ні';
            }
    
            return value;
        };

        return (
            <div>
                {
                    description.map((value, index) => {
                        return (
                            <h4 className="pb-2" key={index}>
                                <strong>{value.key}</strong>: {formatValue(value.value)}
                            </h4>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <div className='product-constructor-main-container'>
            <div className='product-constructor-inner-container'>
                <h1>Constructor</h1>
                <form className='product-constructor-form' onSubmit={handleCreateProduct}>
                <InputModal
                        title='Photo URL'
                        placeholder='https://primaflora.com.ua/.../image.jpg'
                        formDataFieldName='photo_url'
                        onChange={(value, fieldName) => setFormData(prevState => ({...prevState, [fieldName]: value}))}
                    />
                    <InputModal
                        title='Title RUS'
                        placeholder='БАЛЬЗАМ АНТИЦЕЛЮЛИТНЫЙ'
                        formDataFieldName='title_rus'
                        onChange={(value, fieldName) => setFormData(prevState => ({...prevState, title: value}))}
                    />
                    <InputModal
                        title='Title URK'
                        placeholder='БАЛЬЗАМ АНТИЦЕЛЮЛІТНИЙ'
                        formDataFieldName='title_ukr'
                        onChange={(value, fieldName) => setFormData(prevState => ({...prevState, title: value}))}
                    />
                    <InputModal
                        title='Price'
                        placeholder='250'
                        formDataFieldName='price_currency'
                        onChange={(value) => setFormData(prevState => ({...prevState, price_currency: Number(value)}))}
                    />
                    <InputModal
                        title='Discount (just enter 15 if 15% discount)'
                        placeholder='15'
                        formDataFieldName='percent_discount'
                        onChange={(value, fieldName) => setFormData(prevState => ({...prevState, [fieldName]: (Number(value) === 0 ? undefined : Number(value))}))}
                    />
                    <InputModal
                        title='Short Desc RUS'
                        placeholder='Восстанавливает естественную упругость...'
                        formDataFieldName='shortDesc_rus'
                        onChange={(value, fieldName) => setFormData(prevState => ({...prevState, shortDesc: value}))}
                    />
                    <InputModal
                        title='Short Desc UKR'
                        placeholder='Відновлює природну пружність...'
                        formDataFieldName='shortDesc_ukr'
                        onChange={(value, fieldName) => setFormData(prevState => ({...prevState, shortDesc: value}))}
                    />
                    <InputModal
                        title='Rating (from 5 points)'
                        placeholder='5 or 4 or 3 or 2 or 1'
                        formDataFieldName='rating'
                        onChange={(value, fieldName) => setFormData(prevState => ({...prevState, [fieldName]: Number(value)}))}
                    />
                    <Dropdown 
                        title='Pick&nbsp;category'
                        list={categoriesToDropdown()} 
                        onSelect={handleSubcategorySelect}
                        />

                    <DescriptionConstructor onApply={handleDescriptionApply}/>

                    <Button text='Create Product' type='submit' onClick={() => {}}/>
                    {error && <h1 className='text-xl text-red'>{error}</h1>}
                </form>
            </div>
            <div className='product-preview-container'>
                <ProductPreview card={formData}/>
                {
                    description.length !== 0 ? (
                        <>
                            <h1>Description</h1>
                            {renderDescription()}
                        </>
                    ) : (
                        null
                    )
                }
            </div>
        </div>
    )
}

const ProductPreview = ({ card }: TCardPreviewProps) => {
    return (
        <div className='product-preview-main-container'>
            <h1>Product Preview</h1>
            <CardPreview card={card}/>
        </div>
    )
}