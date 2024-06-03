import React, { useEffect, useState } from 'react';
import './styles.css';
import { SideBar } from '../../components/common/SideBar';
import { useParams } from 'react-router-dom';
import { CategoryUpperView } from '../../components/common/CategoryUpperView';
import { ProductView } from './components/ProductView';
import { TProductFull } from '../../common/services/category/types/common';
import { Service } from '../../common/services';

export const Product = () => {
    const { uuid } = useParams();
    const [product, setProduct] = useState<TProductFull | null>(null);

    // TODO: getch full product data
    useEffect(() => {
        if (!uuid) {
            return;
        }

        Service.ProductService.getOneByUid({ uuid }).then(res => {
            if (!res.data) {
                console.log(
                    'Cant fetch Full User Data in routes/Product/Product.tsx component by provided uuid => ',
                    uuid,
                );
                return;
            }
            setProduct(res.data);
            console.log('Full product => ', res.data);
        });
    }, []);

    return (
        <div className="home-container main-global-padding py-10">
            <div className="flex">
                <SideBar />
                <div className="w-full ml-10">
                    <CategoryUpperView />
                    {product ? (
                        <ProductView product={product} />
                    ) : (
                        <h1>Loading...</h1>
                    )}
                </div>
            </div>
        </div>
    );
};
