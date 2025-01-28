import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import L from "leaflet";

// Iconos personalizados
const userLocationIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const defaultLocationIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const MapPage = () => {
    const [userLocation, setUserLocation] = useState(null); // Coordenadas del usuario
    const [selectedLocation, setSelectedLocation] = useState(null); // Coordenada seleccionada para la ruta
    const [showInstructions, setShowInstructions] = useState(true); // Estado para mostrar/ocultar instrucciones

    // Coordenadas predeterminadas para Basauri
    const defaultLocations = [
        { id: 1, position: [43.237, -2.889], title: "Centro de Basauri" },
        { id: 2, position: [43.24, -2.885], title: "Parque Bizkotxalde" },
        { id: 3, position: [43.234, -2.892], title: "Estación de Tren Basauri" },
        { id: 4, position: [43.238, -2.895], title: "Iglesia de San Pedro" },
    ];

    // Obtener la ubicación en tiempo real del usuario
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]); // Actualizar la ubicación del usuario
                },
                (error) => {
                    console.error("Error al obtener la ubicación:", error);
                }
            );
        } else {
            console.error("La geolocalización no es compatible con este navegador.");
        }
    }, []);

    // Componente para agregar el enrutamiento
    const RoutingMachine = () => {
        const map = useMap();

        useEffect(() => {
            if (!userLocation || !selectedLocation) return;

            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLocation), // Ubicación del usuario
                    L.latLng(selectedLocation), // Ubicación seleccionada
                ],
                routeWhileDragging: true, // Permitir mover puntos en tiempo real
                showAlternatives: true, // Mostrar rutas alternativas
                language: "es", // Idioma de las indicaciones (castellano)
                lineOptions: {
                    styles: [{ color: "#007bff", weight: 4 }], // Estilo de la línea
                },
                createMarker: () => null, // Evitar marcadores por defecto
            }).addTo(map);

            // Mostrar u ocultar instrucciones personalizadas
            const instructions = document.querySelector(".leaflet-routing-container");
            if (instructions) {
                instructions.style.display = showInstructions ? "block" : "none"; // Mostrar/ocultar
                instructions.style.backgroundColor = "rgba(255, 255, 255, 0.9)"; // Fondo blanco semitransparente
                instructions.style.color = "black"; // Texto negro
                instructions.style.borderRadius = "8px"; // Bordes redondeados
                instructions.style.padding = "10px"; // Espaciado interno
                instructions.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.2)"; // Sombra
                instructions.style.zIndex = "1000"; // Asegurar que estén encima
            }

            return () => map.removeControl(routingControl); // Limpia la ruta al desmontar
        }, [map, userLocation, selectedLocation, showInstructions]);

        return null;
    };

    // Componente para la barra de búsqueda (Geocoder)
    const Geocoder = () => {
        const map = useMap();

        useEffect(() => {
            const geocoder = L.Control.geocoder({
                defaultMarkGeocode: true,
            })
                .on("markgeocode", (e) => {
                    const latlng = e.geocode.center;
                    L.marker(latlng).addTo(map).bindPopup(e.geocode.name).openPopup();
                    map.setView(latlng, map.getZoom());
                })
                .addTo(map);

            return () => map.removeControl(geocoder);
        }, [map]);

        return null;
    };

    return (
        <div style={{ height: "100vh", width: "100%", position: "relative" }}>
            <button
                onClick={() => setShowInstructions(!showInstructions)}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 1001,
                    padding: "10px 15px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {showInstructions ? "Cerrar Instrucciones" : "Mostrar Instrucciones"}
            </button>

            <MapContainer center={[43.237, -2.889]} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Barra de búsqueda */}
                <Geocoder />

                {/* Agregar enrutamiento */}
                <RoutingMachine />

                {/* Marcador para la ubicación del usuario */}
                {userLocation && (
                    <Marker position={userLocation} icon={userLocationIcon}>
                        <Popup>
                            <strong>¡Aquí estás!</strong>
                        </Popup>
                    </Marker>
                )}

                {/* Renderizar las ubicaciones predeterminadas */}
                {defaultLocations.map((location) => (
                    <Marker
                        key={location.id}
                        position={location.position}
                        icon={defaultLocationIcon}
                        eventHandlers={{
                            click: () => setSelectedLocation(location.position), // Seleccionar ubicación al hacer clic
                        }}
                    >
                        <Popup>
                            {location.title} <br />
                            <button
                                onClick={() => setSelectedLocation(location.position)}
                                style={{
                                    marginTop: "5px",
                                    padding: "5px 10px",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                ¿Cómo llegar?
                            </button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapPage;
