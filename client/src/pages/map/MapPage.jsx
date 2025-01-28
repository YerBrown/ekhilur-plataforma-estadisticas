import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapPage = () => {
    const position = [51.505, -0.09]; // Coordenadas de inicio

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                        Aquí estoy. <br /> ¡Haz clic en mí!
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapPage;
