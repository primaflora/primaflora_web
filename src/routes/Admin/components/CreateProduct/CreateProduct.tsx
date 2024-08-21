import { useState } from "react";
import { Button } from "../../../../components/buttons";
import { ProductConstructor } from "./components/ProductConstructor";
import { useTranslation } from "react-i18next";
import "./styles.css";
import 'draft-js/dist/Draft.css';

export const CreateProduct = () => {
    const { t } = useTranslation();
    const [showConstructor, setShowConstructor] = useState<boolean>(false);

    const handleOpenConstructor = () => {
        setShowConstructor(true);
    }

    const handleCloseConsructor = () => {
        setShowConstructor(false);
    }

    return (
        <div className="category-admin-panel-main-container">
            <h1>{t('admin.create-product-title')}</h1>
            {showConstructor ? (
                <ProductConstructor/>
            ) : (
                <Button text="Create Product" onClick={handleOpenConstructor}/>
            )}
            {showConstructor && <Button text="Close Constructor" onClick={handleCloseConsructor} />}
        </div>
    )
}