import { useCategories } from '../../common/hooks/useCategories';
import { Service } from '../../common/services';

export const useLoadCategories = () => {
    const { setCategories } = useCategories();

    const load = () => {
        Service.CategoryService.getAll()
            .then(res => setCategories(res.data))
            .catch(err => console.log(err));
    };

    return { load };
};
