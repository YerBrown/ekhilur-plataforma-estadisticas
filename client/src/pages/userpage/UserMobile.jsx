import Layout from "../layout/Layout";
import UserPage from "./UserPage";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import "./UserMobile.css";
const UserMobile = () => {
    const { t } = useLanguage();
    return (
        <Layout title={t.profileTitle}>
            <img src="logo_uno.png" alt="Logo Ekhidata" className="logo-user" />
            <UserPage />
        </Layout>
    );
};

export default UserMobile;
