
import { Images } from '../../../assets';
import './styles.css';

export const CategoryUpperView = () => {
    return (
        <div className="main-container">
            <div className="text-container">
                <p className="text">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Aspernatur, ratione dolorem accusamus tenetur labore odio
                    quibusdam nemo temporibus, sunt officia cupiditate aliquid
                    culpa nisi dolores suscipit vero sequi maxime inventore.
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Aspernatur, ratione dolorem accusamus tenetur labore odio
                    quibusdam nemo temporibus, sunt officia cupiditate aliquid
                    culpa nisi dolores suscipit vero sequi maxime inventore.
                </p>
            </div>

            <img src={Images.CategoryImage} width={'25%'} alt="category" />
        </div>
    );
};
