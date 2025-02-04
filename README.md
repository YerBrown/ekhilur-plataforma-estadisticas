# Desafío 2: Plataforma de Estadísticas Personalizadas para Usuarios de Ekhilur

## **Descripción General**
Este repositorio contiene el desarrollo de una página web diseñada para proporcionar a los usuarios de Ekhilur estadísticas personalizadas sobre sus transacciones. Utilizando técnicas de **web scraping**, la plataforma recopila y analiza información directamente de las cuentas de los usuarios, ofreciendo una visión clara y detallada de sus actividades.

El objetivo es fomentar una mayor participación y compromiso con el sistema Ekhilur, proporcionando a los usuarios herramientas útiles para entender y gestionar mejor sus transacciones.

---

## **Principales Funciones**
### 1. **Acceso Personalizado**:
- Los usuarios inician sesión con un nombre de usuario y contraseña.
- Tras autenticarse, acceden a estadísticas personalizadas de su cuenta Ekhilur.

### 2. **Indicadores e Informes Personalizados**:
- **Gastos por Categoría**: Muestra una división de los gastos en categorías para facilitar el análisis de consumo.
- **Cantidad de Bonificaciones Recibidas**: Visualiza las bonificaciones acumuladas y utilizadas.
- **Número de Compras Realizadas**: Detalla la frecuencia y cantidad de compras.
- **Número de Ventas Realizadas** (Cuentas Profesionales): Información específica para cuentas profesionales sobre la frecuencia y cantidad de ventas.
- **Otros Indicadores Relevantes**: Información adicional útil para los usuarios, según sus hábitos de transacción.

---

## **Desarrollo Técnico**
### **1. Diseño de la Página Web**
- Interfaz intuitiva, accesible y segura para garantizar una experiencia de usuario óptima.
- Componentes modernos que visualizan las estadísticas de manera clara y atractiva.

### **2. Proceso de Web Scraping**
- Sistema de scraping para extraer datos directamente de las cuentas Ekhilur de los usuarios.
- Métodos seguros y eficientes para proteger la privacidad y la integridad de los datos.

### **3. Cálculo de Indicadores**
- Procesamiento de la información obtenida para generar indicadores clave y visualizaciones personalizadas.
- Informes interactivos que ayudan a los usuarios a comprender mejor su actividad financiera.

---

## **Seguridad**
- **Protección contra fuerza bruta**: Se limitan los intentos de inicio de sesión.
- **Validación de datos de inicio de sesión**: Se comprueban y sanean las entradas de texto para evitar posibles ataques XSS o SQLi
- **Actualización de seguridad**: Se mantienen las librerías y dependencias actualizadas.
- **Auditoria del código**: Se realizan auditorias diarias del las actualizaciones del código a fin de mantener la ciberesiliencia.
- **Monitoreo deseguridad**: Se realizan monitorizaciones de las comunicaciones entre los diferentes endpoints para solucionar los posibles fallos de seguridad en las comunicaciones.
- **Política de Privacidad**: Se cumple con la LOPDGDD (Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales) siguiendo la metodología CIS Controls. 

---

## **Tecnologías Utilizadas**
- **Frontend**: React.js, HTML5, CSS3, Tailwind CSS.
- **Backend**: Node.js, Express.js, MongoDB.
- **Web Scraping**: Puppeteer, Cheerio.
- **Autenticación**: JSON Web Tokens (JWT), bcrypt.js para el manejo de contraseñas.
- **Visualización de Datos**: Chart.js, D3.js para gráficos interactivos.
- **Análisis y protección**: Burpsuite, Wireshark, SonarQube

---

## **Instrucciones de Configuración**
1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/ekhidata.git
   cd ekhidata
