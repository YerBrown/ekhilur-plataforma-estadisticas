import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import "./Layout.css";

const Layout = ({ title, children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };

  return (
    <div className="page-container" onClick={handleScrollToTop}>
      <header className="page-header">
        <div className="page-header-content">
          <button className="back-button" onClick={handleBack}>
            <IoIosArrowBack className="back-icon" size={24} />
          </button>
          <h1 className="page-title">{title}</h1>
        </div>
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
};

export default Layout;
