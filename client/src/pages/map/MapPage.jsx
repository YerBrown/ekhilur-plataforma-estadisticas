import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import L from "leaflet";
import "./MapPage.css"; // Archivo CSS para diseño y estilos

// Iconos personalizados
const userLocationIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const businessIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const MapPage = () => {
    const [userLocation, setUserLocation] = useState(null); // Coordenadas del usuario
    const [selectedLocation, setSelectedLocation] = useState(null); // Coordenadas del destino seleccionado
    const [mapInstance, setMapInstance] = useState(null); // Instancia del mapa para centrarlo

    const businesses = [
        { id: 1, name: "Cafetería Aroma", address: "Calle Mayor 12, Basauri", image: "https://via.placeholder.com/150", location: [43.237, -2.889] },
        { id: 2, name: "Tienda Verde", address: "Av. Libertad 34, Basauri", image: "https://via.placeholder.com/150", location: [43.24, -2.885] },
        { id: 3, name: "Librería Central", address: "Plaza Ariz 8, Basauri", image: "https://via.placeholder.com/150", location: [43.234, -2.892] },
        { id: 4, name: "Restaurante Delicias", address: "Calle San Pedro 56, Basauri", image: "https://via.placeholder.com/150", location: [43.238, -2.895] },
        { id: 5, name: "Panadería Dulce Hogar", address: "Calle Florida 22, Basauri", image: "https://via.placeholder.com/150", location: [43.235, -2.891] },
        { id: 6, name: "Boutique Elegance", address: "Calle Estación 10, Basauri", image: "https://via.placeholder.com/150", location: [43.236, -2.888] },
        { id: 7, name: "Peluquería Glamour", address: "Calle Ariz 3, Basauri", image: "https://via.placeholder.com/150", location: [43.237, -2.887] },
        { id: 8, name: "Bar La Esquina", address: "Calle Principal 45, Basauri", image: "https://via.placeholder.com/150", location: [43.238, -2.884] },
        { id: 9, name: "Zapatería Paso Fino", address: "Calle Nueva 4, Basauri", image: "https://via.placeholder.com/150", location: [43.239, -2.889] },
        { id: 10, name: "Floristería Rosas", address: "Calle Flor 20, Basauri", image: "https://via.placeholder.com/150", location: [43.235, -2.893] },
    ];

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                },
                (error) => console.error("Error al obtener la ubicación:", error)
            );
        }
    }, []);

    const GeocoderControl = () => {
        const map = useMap();

        useEffect(() => {
            const geocoder = L.Control.geocoder({
                defaultMarkGeocode: false,
            })
                .on("markgeocode", (e) => {
                    const latlng = e.geocode.center;
                    setSelectedLocation([latlng.lat, latlng.lng]);
                    map.setView(latlng, 15); // Centrar el mapa en la ubicación buscada
                })
                .addTo(map);

            const input = document.querySelector(".leaflet-control-geocoder input");
            if (input) input.style.color = "black"; // Asegurar texto negro en el cuadro de búsqueda

            return () => map.removeControl(geocoder);
        }, [map]);

        return null;
    };

    const RoutingMachine = () => {
        const map = useMap();

        useEffect(() => {
            if (!userLocation || !selectedLocation) return;

            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLocation), // Inicio (ubicación del usuario)
                    L.latLng(selectedLocation), // Destino (ubicación seleccionada)
                ],
                routeWhileDragging: false, // No permitir arrastrar la línea
                showAlternatives: false, // No mostrar rutas alternativas
                language: "es",
                lineOptions: {
                    styles: [{ color: "#007bff", weight: 4 }],
                },
                createMarker: () => null, // Evitar marcadores automáticos
            }).addTo(map);

            // Oculta las instrucciones del cuadro
            const instructions = document.querySelector(".leaflet-routing-container");
            if (instructions) {
                instructions.style.display = "none";
            }

            return () => map.removeControl(routingControl);
        }, [map, userLocation, selectedLocation]);

        return null;
    };

    const handleBusinessClick = (location) => {
        setSelectedLocation(location); // Establece la ubicación seleccionada
        if (mapInstance) {
            mapInstance.setView(location, 16); // Centra el mapa en el comercio seleccionado
        }
    };

    return (
        <div className="map-page">
            {/* Mapa */}
            <div className="map-container">
                <MapContainer
                    center={[43.237, -2.889]}
                    zoom={15}
                    style={{ height: "300px", width: "100%" }}
                    whenCreated={(map) => setMapInstance(map)} // Guarda la instancia del mapa
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <GeocoderControl />
                    {userLocation && (
                        <Marker position={userLocation} icon={userLocationIcon}>
                            <Popup>¡Aquí estás!</Popup>
                        </Marker>
                    )}
                    {businesses.map((business) => (
                        <Marker
                            key={business.id}
                            position={business.location}
                            icon={businessIcon}
                            eventHandlers={{
                                click: () => setSelectedLocation(business.location), // Muestra la ruta al hacer clic
                            }}
                        >
                            <Popup>
                                <strong>{business.name}</strong>
                                <br />
                                {business.address}
                            </Popup>
                        </Marker>
                    ))}
                    <RoutingMachine />
                </MapContainer>
            </div>

            {/* Galería de comercios */}
            <div className="gallery">
                <h2>Comercios en Basauri</h2>
                <div className="gallery-grid">
                    {businesses.map((business) => (
                        <div className="gallery-item" key={business.id}>
                            <img src={business.image} alt={business.name} />
                            <h3>{business.name}</h3>
                            <p>{business.address}</p>
                            <button
                                onClick={() => handleBusinessClick(business.location)}
                                className="navigate-button"
                            >
                                Ver en el mapa
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapPage;
