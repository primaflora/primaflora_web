import { Bounce, ToastContainer } from "react-toastify"

export const Toast = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={6500}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
            transition={Bounce}
            />
    )
}