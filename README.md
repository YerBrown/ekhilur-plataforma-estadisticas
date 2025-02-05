# Plataforma de Estadísticas Personalizadas para Usuarios de Ekhilur

## **Descripción General**
Este proyecto tiene como objetivo mejorar la experiencia de los usuarios de Ekhilur proporcionando una visualización clara y organizada de la información de sus cuentas. 

Ekhilur es una plataforma que impulsa el comercio local conectando a los negocios con sus clientes. Los usuarios que compran en comercios asociados reciben bonificaciones que pueden utilizar en cualquier otra tienda dentro del sistema. Sin embargo, la información presentada a los usuarios hasta ahora era confusa y poco estructurada.

Nuestra solución transforma esta experiencia optimizando y organizando la información clave, brindando una interfaz visualmente atractiva que permite a los usuarios conocer en todo momento el estado de su cuenta, el total de bonificaciones obtenidas, y sus movimientos de ingresos y gastos.

---

## **Principales Funciones**
1. **Acceso Personalizado**:
   - Los usuarios inician sesión con un nombre de usuario y contraseña.
   - Tras autenticarse, acceden a estadísticas personalizadas de su cuenta Ekhilur.

2. **Indicadores e Informes Personalizados**:
   - **Gastos por Categoría**: Muestra una división de los gastos en categorías para facilitar el análisis de consumo.
   - **Cantidad de Bonificaciones Recibidas**: Visualiza las bonificaciones acumuladas y utilizadas.
   - **Número de Compras Realizadas**: Detalla la frecuencia y cantidad de compras.
   - **Número de Ventas Realizadas** (Cuentas Profesionales): Información específica para cuentas profesionales sobre la frecuencia y cantidad de ventas.
   - **Otros Indicadores Relevantes**: Información adicional útil para los usuarios, según sus hábitos de transacción.

---

## **Desarrollo Técnico**
### **1. Diseño de la Página Web**
- Interfaz intuitiva, accesible y segura para garantizar una experiencia de usuario óptima.
- Uso de Material UI para una apariencia moderna y consistente.

### **2. Visualización de Datos**
- Implementación de gráficos interactivos con **Chart.js**, **Recharts** y **react-chartjs-2**.
- Uso de **chartjs-plugin-datalabels** para mejorar la legibilidad de la información en los gráficos.

### **3. Mapa de Ubicaciones**
- Uso de **Leaflet**, **react-leaflet**, **leaflet-control-geocoder** y **leaflet-routing-machine** para la geolocalización de comercios asociados.
- Integración con **Google Maps API** mediante **@react-google-maps/api** y **@vis.gl/react-google-maps**.

### **4. Gestión de Estado y Navegación**
- Manejo de rutas con **react-router-dom**.
- Gestión de autenticación y sesiones mediante **js-cookie**.

### **5. Seguridad y Cifrado**
- Implementación de **crypto-js** para encriptar datos sensibles.
- Uso de **JSON Web Tokens (JWT)** para la autenticación segura.

### **6. Configuración y Desarrollo**
- Desarrollo basado en **React.js** con **Vite** para una compilación rápida y eficiente.
- Estilización con **Emotion (styled y react)**.
- Control de calidad del código con **ESLint**.

---

## **Tecnologías Utilizadas**
### **Frontend**
- **React.js**
- **Vite**
- **Material UI**
- **Emotion (styled y react)**
- **React Router DOM**
- **React Icons**
- **React Datepicker**

### **Visualización de Datos**
- **Chart.js**
- **Recharts**
- **react-chartjs-2**
- **chartjs-plugin-datalabels**

### **Mapas y Geolocalización**
- **Leaflet**
- **react-leaflet**
- **leaflet-control-geocoder**
- **leaflet-routing-machine**
- **Google Maps API** mediante **@react-google-maps/api** y **@vis.gl/react-google-maps**

### **Backend y Seguridad**
- **Node.js**
- **Express.js**
- **MongoDB**
- **Crypto-js**
- **JSON Web Tokens (JWT)**

### **Configuración y Desarrollo**
- **ESLint**
- **Vite**

---

## **Instrucciones de Configuración**
1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/ekhilur-plataforma-estadisticas.git
   cd ekhilur-plataforma-estadisticas
   ```
2. Instrucciones de Configuración

1. Clonar el repositorio

git clone https://github.com/tu-usuario/ekhilur-plataforma-estadisticas.git
cd ekhilur-plataforma-estadisticas

2. Configuración del entorno

Crea un archivo .env en la raíz del proyecto y copia el siguiente contenido:

PORT=3000
MONGO_HOST=mongo_ekhidata
MONGO_USER=ekhidata_admin
MONGO_PASSWORD=iv9VL1DL0DmIPQc
MONGO_DATABASE=ekhidata
MONGO_PORT=27018
API_PORT=5000
APP_HOST=express_ekhidata
APP_PORT=3000
JWT_SECRET=iv9VL1DL0DmIPQc
CLIENT_URL=http://localhost:5173

3. Levantar el proyecto con Docker Compose

Asegúrate de tener Docker y Docker Compose instalados. Luego, ejecuta:

docker-compose up --build

Esto iniciará los siguientes servicios:

MongoDB: Base de datos para almacenamiento de datos.

Backend (Express.js): API REST que gestiona la autenticación y la lógica de negocio.

API (Flask): Servicio adicional para procesamiento de datos.

4. Acceder a la aplicación

Frontend: http://localhost:5173

Backend: http://localhost:3000

API: http://localhost:5000

5. Parar los contenedores

Para detener los servicios, usa:

docker-compose down

Esto cerrará todos los contenedores sin eliminar volúmenes de datos.

