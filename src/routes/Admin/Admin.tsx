import { Dashboard } from "./components/Dashboard"
import { Outlet, redirect } from "react-router-dom"
import { Row } from "../../components/common"
import { useEffect } from "react"
import { useUserData } from "../../store/tools"
import './styles.css'

export const Admin = () => {
    const { isAdmin } = useUserData();

    useEffect(() => {
        if (!isAdmin) {
            redirect('/');
        }
    }, []);

    return (
        <div className=''> {/* admin-main-container */}
            <Row style={{ justifyContent: 'normal', alignItems: 'normal'}}>
                <Dashboard/>
                <main className="admin-content">
                    <Outlet/>
                </main>
            </Row>
        </div>
    )
}