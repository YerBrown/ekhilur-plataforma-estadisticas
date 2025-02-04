import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import L from "leaflet";
import "./MapPage.css";

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
    const [userLocation, setUserLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [businessType, setBusinessType] = useState("Todos");

    useEffect(() => {
        fetch("/json/Comercios.json")
            .then((response) => response.json())
            .then((data) => {
                const formattedData = data
                    .filter((item) => item.Coordenadas && item.Coordenadas.length === 2)
                    .map((item, index) => ({
                        id: index + 1,
                        name: item["Nombre Comercio"] || "Comercio sin nombre",
                        address: item.Direccion || "Dirección desconocida",
                        type: item.Tipo || "Otros",
                        location: item.Coordenadas,
                        image: "https://via.placeholder.com/150",
                    }));
                setBusinesses(formattedData);
                setFilteredBusinesses(formattedData);
            })
            .catch((error) => console.error("Error cargando los comercios:", error));
    }, []);

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

    // 🔹 Filtrar comercios por "Tipo"
    useEffect(() => {
        if (businessType === "Todos") {
            setFilteredBusinesses(businesses);
        } else {
            const filtered = businesses.filter((business) => business.type === businessType);
            setFilteredBusinesses(filtered);
        }
    }, [businessType, businesses]);

    const handleBusinessClick = (location) => {
        setSelectedLocation(location);
        if (mapInstance) {
            mapInstance.setView(location, 16);
        }
    };

    // 🔹 Obtener la lista de tipos de comercio únicos
    const businessTypes = ["Todos", ...new Set(businesses.map((b) => b.type))];

    const RoutingMachine = () => {
        const map = useMap();

        useEffect(() => {
            if (!userLocation || !selectedLocation) return;

            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLocation),
                    L.latLng(selectedLocation),
                ],
                routeWhileDragging: false,
                showAlternatives: false,
                language: "es",
                lineOptions: {
                    styles: [{ color: "#007bff", weight: 4 }],
                },
                createMarker: () => null,
            }).addTo(map);

            const routingContainer = document.querySelector(".leaflet-routing-container");
            if (routingContainer) {
                routingContainer.style.display = "none";
            }

            return () => map.removeControl(routingControl);
        }, [map, userLocation, selectedLocation]);

        return null;
    };

    // 🔹 Agregar control de búsqueda con lupa y texto negro
    const GeocoderControl = () => {
        const map = useMap();

        useEffect(() => {
            const geocoder = L.Control.geocoder({
                defaultMarkGeocode: false,
            })
                .on("markgeocode", (e) => {
                    const latlng = e.geocode.center;
                    setSelectedLocation([latlng.lat, latlng.lng]);
                    map.setView(latlng, 15);
                })
                .addTo(map);

            setTimeout(() => {
                const input = document.querySelector(".leaflet-control-geocoder input");
                if (input) input.style.color = "black";
            }, 500);

            return () => map.removeControl(geocoder);
        }, [map]);

        return null;
    };

    return (
        <div className="map-page">
            {/* Mapa */}
            <div className="map-container">
                <MapContainer
                    center={[43.26755, -1.97581]}
                    zoom={15}
                    style={{ height: "500px", width: "100%" }}
                    whenCreated={(map) => setMapInstance(map)}
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

                    {filteredBusinesses.map((business) => (
                        <Marker
                            key={business.id}
                            position={business.location}
                            icon={businessIcon}
                            eventHandlers={{
                                click: () => setSelectedLocation(business.location),
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

            {/* 🔹 Selector de Tipo de Comercio - Visible en pantallas pequeñas también */}
            <div className="filter-container">
                <select
                    id="business-type"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                >
                    {businessTypes.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {/* Galería de comercios */}
            <div className="gallery">
                <h2>Comercios</h2>
                <div className="gallery-grid">
                    {filteredBusinesses.map((business) => (
                        <div
                            className="gallery-item"
                            key={business.id}
                            onClick={() => handleBusinessClick(business.location)}
                        >
                            <h3>{business.name}</h3>
                            <p><strong>Tipo:</strong> {business.type}</p>
                            <p><strong>Dirección:</strong> {business.address}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapPage;
