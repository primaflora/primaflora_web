import { useState } from 'react';
import { Dropdown } from '../../../../../../components/DropdownList';
import { TDropdownListElem } from '../../../../../../components/DropdownList/types';
import { useUserData } from '../../../../../../store/tools';
import './styles.css';
import { TProductSelectorProps } from './types';
import { TProduct } from '../../../../../../common/services/category/types/common';
import { Service } from '../../../../../../common/services';
import { useToast } from '../../../../../../common/toast';
import { Row } from '../../../../../../components/common';

export const ProductSelector = ({ onProductSelect }: TProductSelectorProps) => {
    const { categories } = useUserData();
    const { notifyError } = useToast();
    const [products, setProducts] = useState<TProduct[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>();

    const categoriesToDropdown = () => {
        const list: TDropdownListElem[] = [];

        categories.map(category => (
            category.childrens.map(subcategory => { 
                list.push({ title: subcategory.name, value: String(subcategory.id) })
            })
        ));

        return list;
    }

    const productsToDropdown = () => {
        const list: TDropdownListElem[] = [];

        products.map(product => {
            list.push({ title: product.title, value: product.uuid });
        })

        return list;
    }

    const handleCategorySelect = (value: TDropdownListElem) => {
        setSelectedCategoryId(Number(value.value));
        
        // load products to other dropdown, when user select category
        Service
            .CategoryService
            .getCategoryWithProducts({ subcategoryId: Number(value.value) })
            .then(res => setProducts(res.data.products))
            .catch(err => notifyError('Failed to load products!'));
    } 

    const handleProductSelect = (value: TDropdownListElem) => {
        const product = products.find(product => product.uuid === value.value);
        product && onProductSelect(product);
    }

    return (
        <Row style={{ gap: "30px" }}>  
            <Dropdown 
                title='Pick category' 
                list={categoriesToDropdown()} 
                onSelect={handleCategorySelect} />

            <Dropdown 
                title={selectedCategoryId ? 'Pick Product' : 'First Pick Category'}
                list={productsToDropdown()} 
                onSelect={handleProductSelect} />
        </Row>
    )
}