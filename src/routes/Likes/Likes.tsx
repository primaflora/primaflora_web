import { useEffect, useState } from 'react';
import { Service } from '../../common/services';
import { TLike } from '../../common/services/likes';
import { ProductsSection } from '../../components/ProductsSection';
import { SideBar } from '../../components/common';
import { Slider } from '../Home/components/Slider';
import './styles.css';
import { CatalogStripeMob } from '../../components/common/CatalogStripeMob';

export const Likes = () => {
    const [likes, setLikes] = useState<TLike[]>([]);

    useEffect(() => {
        Service.LikesService.getLikes().then(res => {
            setLikes(res.data);
            console.log('Likes => ', res.data);
        });
    }, []);

    return (
        <div className="main-like-container main-global-padding">
            <div className="flex">
                <SideBar />
                <div className="like-container">
                    <div className="catalog-stripe-mob-container pb-5">
                        <CatalogStripeMob />
                    </div>
                    <Slider />
                    <div className="pt-10">
                        {likes.length === 0 ? (
                            <h1 className="justify-self-center text-black text-3xl">
                                Nothing to show!
                            </h1>
                        ) : (
                            <ProductsSection
                                title="Бажане"
                                products={likes.map(l => ({
                                    ...l.product,
                                    like: { id: l.id, uuid: l.uuid },
                                }))}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
