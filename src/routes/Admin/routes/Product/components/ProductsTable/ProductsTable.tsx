import { useEffect, useState } from 'react';
import { Panel } from '../../../../components/Panel';
import { THeaderElem, TSortType } from '../../../../components/Panel/types';
import { TProductTable } from '../../../../../../common/services/product/types/getProducts';
import { Service } from '../../../../../../common/services';
import { CategoryTag } from './components/CategoryTag';
import { TagsInput } from '../../../../../../components/TagsInput';
import { Tag } from '../../../../../../components/TagsInput/types';
import { Row } from '../../../../../../components/common';
import { useUserData } from '../../../../../../store/tools';
import { ActionRow } from './components/ActionRow';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const ListHeaders: Array<THeaderElem> = [
    { label: 'Title', value: 'title' },
    { label: 'Price', value: 'price_currency' },
    { label: 'Is Published', value: 'isPublished' },
    { label: 'Categories', value: 'categories' },
];
const ListHeadersWidth = [
    { columnIndex: 0, widthPercent: 50 },
    { columnIndex: 1, widthPercent: 15 },
    { columnIndex: 2, widthPercent: 15 },
    { columnIndex: 3, widthPercent: 20 }
];
type Product = {
    isChecked: boolean;
} & TProductTable;
const ActionListOptions = [
    { label: 'Hide', value: 'hide' },
    { label: 'Delete', value: 'delete' },
    { label: 'Show', value: 'show' }
]

export const ProductsTable = () => {
    const navigate = useNavigate();
    const { categories } = useUserData();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Array<Product>>([]);
    const [updatedProducts, setUpdatedProducts] = useState<Array<Product>>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
        Service.ProductService.findAll()
            .then(res => {
                const newProducts = res.data.map((product, index) => 
                    ({ ...product, isChecked: false })
                );
                setProducts(newProducts);
                setUpdatedProducts(newProducts);
                setIsLoading(false);
            })
    }, []);

    const categoriesToTags = () => {
        const arr: Tag[] = [];
        categories.forEach(category => {
            category.childrens.forEach(subcategory => {
                arr.push({ label: subcategory.name, value: subcategory.uuid });
            })
        });

        return arr;
    }

    const handleCheckboxChange = (state: boolean, index: number) => {
        const newProducts = [...updatedProducts];
        newProducts[index].isChecked = state;
        setUpdatedProducts(newProducts);
    }

    const handleGlobalCheckboxChange = (state: boolean) => {
        const newProducts = updatedProducts.map(product => ({ ...product, isChecked: state }));
        setUpdatedProducts(newProducts);
    }

    const handleSortChange = (sortBy: string, sortType: TSortType) => {
        console.log('Sort By: ', sortBy, ". Sort Type: ", sortType);
        console.log(updatedProducts)
        const sortedProducts = [...updatedProducts].sort((a: Product, b: Product) => {
            console.log(a)
            const aValue = a[sortBy as keyof Product];
            const bValue = b[sortBy as keyof Product];

            console.log(aValue, bValue)
            // Если значение - массив (например, categories), берем первый элемент для сортировки
            if (Array.isArray(aValue) && Array.isArray(bValue)) {
                const aName = aValue[0]?.name || ''; // Берем name первой категории
                const bName = bValue[0]?.name || '';

                if (aName < bName) return sortType === 'ASC' ? -1 : 1;
                if (aName > bName) return sortType === 'ASC' ? 1 : -1;
                return 0;
            }

            // Обычная сортировка по числовым или строковым значениям
            if (aValue < bValue) return sortType === 'ASC' ? -1 : 1;
            if (aValue > bValue) return sortType === 'ASC' ? 1 : -1;
            return 0;
        });

        setUpdatedProducts(sortedProducts);
    }

    const handleFilterByTags = () => {
        if (selectedTags.length === 0) {
            setUpdatedProducts(products); // Если теги не выбраны, показываем все продукты
            return;
        }
    
        const filteredProducts = products.filter(product => {
            // Проверяем, хотя бы одна категория продукта совпадает с выбранным тегом
            return product.categories.some(category =>
                selectedTags.some(tag => tag.value === category.uuid)
            );
        });
    
        setUpdatedProducts(filteredProducts);
    }

    const handleResetTags = () => {
        setSelectedTags([]);
        setUpdatedProducts(products);
    }

    const handleFilterByTitle = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchValue = new FormData(e.currentTarget).get('title_search') as string;

        const filteredProducts = [...products].filter(product => {
            return product.title.trim().toLowerCase().includes(searchValue.trim().toLocaleLowerCase());
        })

        setUpdatedProducts(filteredProducts);
    }

    const handleResetSearching = () => {
        setUpdatedProducts(products);
    }

    const handleApplyGroupAction = async (action: { label: string, value: string }) => {
        const selectedProducts = updatedProducts.filter(product => product.isChecked);
        
        switch (action.value) {
            case 'delete':
                const queries = selectedProducts.map(product => {
                        Service.ProductService.delete({ uuid: product.uuid })
                });

                try {
                    await Promise.all(queries);   
                    setUpdatedProducts(prevState => prevState.filter(product => !selectedProducts.find
                        (selectedProduct => selectedProduct.uuid === product.uuid)
                    ));
                    setNotifications(prevState => [...prevState, `${selectedProducts.length} products deleted successfully`]);                    
                } catch (e) {
                    setNotifications(prevState => [...prevState, `Error while deleting products`]);
                }

                break;
            default:
                break;
        }
    }  
    
    const handleAddTag = (tag: Tag) => {
        setSelectedTags(prevState => [...prevState, tag]);
    }

    const handleREmoveTag = (tag: Tag) => {
        setSelectedTags(prevState => prevState.filter(t => t.value !== tag.value));
    }
    
    const handleApplyAction = (action: string, productUid: string) => {
        console.log(action, productUid)
        switch (action) {
            case 'edit':
                navigate(`/admin-page/products/edit/${productUid}`);
                break;
            case 'hide':
                // selectedProduct?.isHidden ? selectedProduct.isHidden = false : selectedProduct.isHidden = true;
                Service.ProductService.update({ productUid: productUid, toUpdate: {isPublished: false} }).then(() => {
                    setUpdatedProducts(prevState =>
                        prevState.map(product =>
                            product.uuid === productUid
                                ? { ...product, isPublished: false }
                                : product
                        )
                    );
                    setNotifications(prevState => [
                        ...prevState,
                        `Product ${productUid} is hidden successfully`,
                    ]);
                })
                break;
            case 'delete':
                Service.ProductService.delete({ uuid: productUid }).then(() => {
                    setUpdatedProducts(prevState => prevState.filter(product => product.uuid !== productUid));
                    setNotifications(prevState => [...prevState, `Product ${productUid} deleted successfully`]);
                })
                break;
            case 'show':
                Service.ProductService.update({ productUid: productUid, toUpdate: {isPublished: true} }).then(() => {
                    setUpdatedProducts(prevState =>
                        prevState.map(product =>
                            product.uuid === productUid
                                ? { ...product, isPublished: true }
                                : product
                        )
                    );
                    setNotifications(prevState => [
                        ...prevState,
                        `Product ${productUid} is published successfully`,
                    ]);
                })
                break;
            default:
                break;
        }
    }
    
    return (
        <div>
            <Panel.Title text="Products" />

            {
                notifications &&
                notifications.map((notification, index) => (
                    <Panel.Notification 
                        key={index} 
                        onRemove={() => setNotifications(prevState => prevState.filter((_, i) => i !== index))}
                        style={{ marginBottom: '10px' }}>
                            {notification}
                    </Panel.Notification>
                ))
            }

            <Row style={{ justifyContent: 'space-between', margin: '10px 0' }}>
                <div>
                    <button className='blue-button' onClick={handleResetSearching}>Reset searching</button>
                    <Panel.Form 
                        onSubmit={handleFilterByTitle} 
                        style={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            gap: '10px', 
                            alignItems: 'stretch',
                            padding: 0,    
                            border: 'none',
                        }}>
                        <Panel.Input 
                            inputName='title_search' 
                            placeholder='Title' 
                            style={{ margin: 0, backgroundColor: '#fff' }}
                            type='text' />
                        <Panel.Button
                            text='Search'
                            small
                            isFilled={false}
                            type='submit' />
                    </Panel.Form>
                </div>

                <Panel.TableActionList 
                    style={{ gap: '10px', display: 'flex', flexDirection: 'row' }}
                    options={ActionListOptions} 
                    onApply={handleApplyGroupAction} />
            </Row>

            <Panel.List
                isLoading={isLoading}
                header={ListHeaders}
                headersWidth={ListHeadersWidth}
                data={updatedProducts}
                onCheckmarkUpdate={handleGlobalCheckboxChange}
                onSortChange={handleSortChange}
            >
                {(entry, index) => (
                    <tr className="table-row-container">
                        <td className="table-checkbox-container">
                            <Panel.Checkbox 
                                state={entry.isChecked} 
                                onChange={(checked) => handleCheckboxChange(checked, index)}/>
                        </td>
                        <td className='table-product-title'>
                            <a 
                                href={`/product/${entry.uuid}`} 
                                style={{ textDecoration: 'none', color: '#2271b1' }}>
                                {entry.title}
                            </a>
                            <ActionRow 
                                onAction={(action) => handleApplyAction(action, entry.uuid)} 
                                isHidden={!entry.isPublished} />
                        </td>
                        <td>{entry.price_currency}</td>
                        <td>{entry.isPublished ? "Yes" : 'No'}</td>
                        <td>
                            {
                                entry.categories.map(item => (
                                    <CategoryTag 
                                        title={item.name} 
                                        link={`/category/${item.uuid}`} />
                                ))
                            }
                        </td>
                    </tr>
                )}
            </Panel.List>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Row style={{ justifyContent: 'space-between' }}>
                    <h1>Filter by selecting tags categories</h1>
                    <button className='blue-button' onClick={handleResetTags}>Reset Filter</button>
                </Row>
                <Row style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10 }}>
                    <TagsInput 
                        tags={categoriesToTags()} 
                        selectedTags={selectedTags} 
                        onTagAdd={handleAddTag} 
                        onTagRemove={handleREmoveTag} />
                    <Panel.Button 
                        text="Filter" 
                        onClick={handleFilterByTags} 
                        style={{ height: '41px' }}
                        small 
                        isFilled={false} />
                </Row>
            </div>
        </div>
    )
}