import { CreateProduct } from "./components/CreateProduct"
import { SelectProduct } from "./components/SelectProduct"
import './styles.css'

export const Admin = () => {

    return (
        <div className='admin-main-container'>
            <CreateProduct/>
            <SelectProduct/>
        </div>
    )
}