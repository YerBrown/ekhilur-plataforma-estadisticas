import React from "react";
import Layout from "../layout/Layout";
import "./UserPage.css";

const UserPage = () => {
    // Datos falsos para simular la información enviada por la aplicación
    const userData = {
        username: "ilandatxe",
        phone: "+34612345678",
        email: "ilandatxe@example.com",
        address: "Calle Falsa 123, Madrid, España",
        birthdate: "1990-01-01",
        ocupacion: "Desarrollador Web",
        iban: "ES9121000418450200051332",
        socialCapital: "Si",
    };

    return (
        <>
            <Layout title="Perfil de usuario">
                <div className="user-profile-container">
                    <h1>{userData.username}</h1>
                    <div className="user-profile-info">
                        <div className="info-group">
                            <span className="info-label">Nombre de usuario:</span>
                            <span className="info-value">{userData.username}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">Teléfono:</span>
                            <span className="info-value">{userData.phone}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{userData.email}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">Dirección:</span>
                            <span className="info-value">{userData.address}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">Fecha de Nacimiento:</span>
                            <span className="info-value">{userData.birthdate}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">Ocupación:</span>
                            <span className="info-value">{userData.ocupacion}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">IBAN:</span>
                            <span className="info-value">{userData.iban}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">Capital social abonado:</span>
                            <span className="info-value">{userData.socialCapital}</span>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default UserPage;