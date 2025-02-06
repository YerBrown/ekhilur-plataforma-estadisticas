import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import os
from os.path import join, dirname, abspath
import time
import re
from playwright.sync_api import sync_playwright
import pandas as pd

class AutoScraper:
    def __init__(self):
        self.session = requests.Session()
        self.login_url = "https://portal.ekhilur.eus/login.php?rr=01"
        self.base_url = "https://portal.ekhilur.eus/"
        
        # Headers básicos
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
        })
        
        # Configurar directorio para datos
        self.base_dir = dirname(dirname(abspath(__file__)))
        self.data_dir = join(self.base_dir, 'data', 'scraper', 'analisis')
        os.makedirs(self.data_dir, exist_ok=True)
        
        print(f"Directorio de datos: {self.data_dir}")

        self.credentials = {
            "alomorga": {"username": "alomorga", "password": "111111"},
            "ilandatxe": {"username": "ilandatxe", "password": "111111"},
            "fotostorres": {"username": "FotosTorres", "password": "123456"}
        }

    def login(self, username, password):
        """Realiza el login"""
        try:
            # 1. Primero necesitamos obtener la página de login para obtener el token CSRF
            print("\nPaso 1: Obteniendo página de login...")
            response = self.session.get(self.login_url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 2. Encontrar el formulario y todos sus campos ocultos
            form = soup.find('form')
            if not form:
                print("Error: No se encontró el formulario")
                return False
            
            # 3. Recoger todos los campos del formulario, incluyendo los ocultos
            login_data = {}
            for input_field in form.find_all('input'):
                name = input_field.get('name')
                value = input_field.get('value', '')
                if name:
                    login_data[name] = value
            
            # 4. Actualizar con las credenciales
            login_data.update({
                'userid': username,
                'password': password,
                'login': 'Entrar'  # Este es el botón de submit
            })
            
            # 5. Obtener la URL correcta del action del formulario
            form_action = form.get('action', '')
            login_post_url = form_action if form_action.startswith('http') else f"https://portal.ekhilur.eus/{form_action}"
            
            print(f"Datos de login: {login_data}")
            print(f"URL de login: {login_post_url}")
            
            # 6. Realizar el POST con todos los datos necesarios
            response = self.session.post(login_post_url, data=login_data)
            
            # 7. Verificar el login
            if self.check_login():
                print("✓ Login exitoso")
                return True
            else:
                print("✗ Login fallido")
                print(f"URL después del intento: {response.url}")
                print(f"Status code: {response.status_code}")
                # Imprimir mensaje de error si existe
                soup = BeautifulSoup(response.text, 'html.parser')
                error = soup.find('div', class_='alert-danger')
                if error:
                    print(f"Error mostrado: {error.text.strip()}")
                return False
            
        except Exception as e:
            print(f"Error en login: {str(e)}")
            return False

    def check_login(self):
        """Verifica si el login fue exitoso"""
        try:
            response = self.session.get(self.base_url)
            return 'login.php' not in response.url
        except:
            return False

    def analyze_page(self):
        """Menú de análisis de la página"""
        while True:
            print("\n=== MENÚ DE ANÁLISIS ===")
            print("1. Buscar scripts de DataTable")
            print("2. Analizar estructura HTML")
            print("3. Buscar endpoints AJAX")
            print("4. Analizar eventos JavaScript")
            print("5. Buscar iframes y contenido dinámico")
            print("6. Analizar red (Network)")
            print("7. Analizar AJAX de DataTables")
            print("8. Volver al menú principal")
            
            opcion = input("Seleccione una opción (1-8): ").strip()
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            if opcion == "1":
                result = self.analyze_datatable_scripts()
                self.save_analysis(result, f"datatable_analysis_{timestamp}.json")
            elif opcion == "2":
                result = self.analyze_html_structure()
                self.save_analysis(result, f"html_structure_{timestamp}.json")
            elif opcion == "3":
                result = self.analyze_ajax_endpoints()
                self.save_analysis(result, f"ajax_endpoints_{timestamp}.json")
            elif opcion == "4":
                result = self.analyze_javascript_events()
                self.save_analysis(result, f"js_events_{timestamp}.json")
            elif opcion == "5":
                result = self.analyze_dynamic_content()
                self.save_analysis(result, f"dynamic_content_{timestamp}.json")
            elif opcion == "6":
                result = self.analyze_network()
                self.save_analysis(result, f"network_analysis_{timestamp}.json")
            elif opcion == "7":
                result = self.analyze_datatable_ajax()
                self.save_analysis(result, f"datatable_ajax_analysis_{timestamp}.json")
            elif opcion == "8":
                break
            else:
                print("Opción no válida")

    def save_analysis(self, data, filename):
        """Guarda los resultados del análisis en un archivo JSON"""
        try:
            filepath = join(self.data_dir, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print(f"\n✓ Análisis guardado en: {filepath}")
        except Exception as e:
            print(f"Error guardando análisis: {str(e)}")

    def analyze_datatable_scripts(self):
        """Busca scripts relacionados con DataTables"""
        print("\nBuscando scripts de DataTable...")
        response = self.session.get(self.base_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        results = {
            "datatable_scripts": [],
            "table_configurations": [],
            "jquery_includes": []
        }
        
        scripts = soup.find_all('script')
        for script in scripts:
            src = script.get('src', '')
            if src:
                if 'datatable' in src.lower():
                    results["datatable_scripts"].append(src)
                elif 'jquery' in src.lower():
                    results["jquery_includes"].append(src)
            
            if script.string:
                if any(term in script.string.lower() for term in 
                    ['datatable', 'datatables', 'table.data']):
                    results["table_configurations"].append(script.string[:500])
        
        print(f"✓ Encontrados {len(results['datatable_scripts'])} scripts de DataTable")
        return results

    def analyze_javascript_events(self):
        """Analiza eventos JavaScript relacionados con tablas"""
        print("\nAnalizando eventos JavaScript...")
        response = self.session.get(self.base_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        results = {
            "onclick_events": [],
            "onload_events": [],
            "event_listeners": []
        }
        
        # Buscar elementos con eventos
        for element in soup.find_all(True):
            for attr in element.attrs:
                if attr.startswith('on'):
                    results["onclick_events"].append({
                        "element": str(element.name),
                        "event": attr,
                        "handler": element[attr]
                    })
        
        # Buscar scripts con addEventListener
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string and 'addEventListener' in script.string:
                results["event_listeners"].append(script.string[:200])
        
        return results

    def analyze_dynamic_content(self):
        """Analiza iframes y contenido dinámico"""
        print("\nAnalizando contenido dinámico...")
        response = self.session.get(self.base_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        results = {
            "iframes": [],
            "dynamic_divs": [],
            "ajax_containers": []
        }
        
        # Buscar iframes
        for iframe in soup.find_all('iframe'):
            results["iframes"].append({
                "src": iframe.get('src', ''),
                "id": iframe.get('id', ''),
                "name": iframe.get('name', '')
            })
        
        # Buscar divs que podrían contener contenido dinámico
        for div in soup.find_all('div'):
            if any(term in str(div.get('class', [])) for term in 
               ['dynamic', 'ajax', 'load', 'content']):
                results["dynamic_divs"].append({
                    "id": div.get('id', ''),
                    "class": div.get('class', []),
                    "data_attributes": {k:v for k,v in div.attrs.items() 
                                     if k.startswith('data-')}
                })
        
        return results

    def analyze_network(self):
        """Analiza peticiones de red relacionadas con tablas"""
        print("\nAnalizando peticiones de red...")
        
        results = {
            "ajax_requests": [],
            "data_urls": [],
            "api_endpoints": []
        }
        
        # Hacer una petición y analizar las redirecciones
        response = self.session.get(self.base_url, allow_redirects=True)
        for resp in response.history:
            results["ajax_requests"].append({
                "url": resp.url,
                "status_code": resp.status_code,
                "headers": dict(resp.headers)
            })
        
        # Buscar URLs en el HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        for script in soup.find_all('script'):
            if script.string:
                # Buscar patrones de URL
                urls = re.findall(r'url:\s*[\'"]([^\'"]+)[\'"]', script.string)
                results["data_urls"].extend(urls)
                
                # Buscar endpoints de API
                apis = re.findall(r'api/[^\'"]+', script.string)
                results["api_endpoints"].extend(apis)
        
        return results

    def analyze_ajax_endpoints(self):
        """Analiza y busca endpoints AJAX y peticiones de datos"""
        print("\nAnalizando endpoints AJAX...")
        response = self.session.get(self.base_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        results = {
            "ajax_urls": [],
            "data_endpoints": [],
            "form_actions": [],
            "websocket_endpoints": []
        }
        
        # 1. Buscar URLs en scripts
        print("Buscando URLs en scripts...")
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string:
                # Buscar URLs AJAX
                ajax_patterns = [
                    r'url:\s*[\'"]([^\'"]+)[\'"]',
                    r'\.ajax\(\s*[\'"]([^\'"]+)[\'"]',
                    r'\.get\(\s*[\'"]([^\'"]+)[\'"]',
                    r'\.post\(\s*[\'"]([^\'"]+)[\'"]',
                    r'fetch\([\'"]([^\'"]+)[\'"]\)',
                    r'new\s+XMLHttpRequest\([\'"]([^\'"]+)[\'"]\)'
                ]
                
                for pattern in ajax_patterns:
                    urls = re.findall(pattern, script.string)
                    for url in urls:
                        if url not in results["ajax_urls"]:
                            results["ajax_urls"].append(url)
                            print(f"Encontrada URL AJAX: {url}")
        
        # 2. Buscar endpoints en atributos data-
        print("\nBuscando endpoints en atributos data-...")
        for element in soup.find_all(True):
            for attr, value in element.attrs.items():
                if attr.startswith('data-'):
                    if isinstance(value, str) and ('/' in value or '?' in value):
                        if value not in results["data_endpoints"]:
                            results["data_endpoints"].append(value)
                            print(f"Encontrado endpoint en data-: {value}")
        
        # 3. Buscar acciones de formularios
        print("\nBuscando acciones de formularios...")
        forms = soup.find_all('form')
        for form in forms:
            action = form.get('action')
            if action:
                if action not in results["form_actions"]:
                    results["form_actions"].append(action)
                    print(f"Encontrada acción de formulario: {action}")
        
        # 4. Buscar configuración de WebSocket
        print("\nBuscando configuración de WebSocket...")
        for script in scripts:
            if script.string and 'websocket' in script.string.lower():
                ws_urls = re.findall(r'(?:ws|wss)://[^\'"]+', script.string)
                for url in ws_urls:
                    if url not in results["websocket_endpoints"]:
                        results["websocket_endpoints"].append(url)
                        print(f"Encontrado endpoint WebSocket: {url}")
        
        # Resumen
        print("\nResumen del análisis:")
        print(f"- URLs AJAX encontradas: {len(results['ajax_urls'])}")
        print(f"- Endpoints en data-: {len(results['data_endpoints'])}")
        print(f"- Acciones de formularios: {len(results['form_actions'])}")
        print(f"- Endpoints WebSocket: {len(results['websocket_endpoints'])}")
        
        return results

    def analyze_datatable_ajax(self):
        """Analiza específicamente las configuraciones AJAX de DataTables"""
        print("\nAnalizando configuración AJAX de DataTables...")
        response = self.session.get(self.base_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        results = {
            "datatable_configs": [],
            "ajax_urls": [],
            "table_ids": [],
            "network_requests": []
        }
        
        # 1. Buscar configuraciones de DataTable
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string:
                # Buscar inicializaciones de DataTable
                if 'DataTable' in script.string:
                    print("\nEncontrada configuración DataTable:")
                    config = script.string
                    results["datatable_configs"].append(config)
                    
                    # Buscar configuraciones AJAX
                    ajax_patterns = [
                        r'ajax:\s*[\'"]([^\'"]+)[\'"]',  # URL directa
                        r'ajax:\s*{[^}]*url:\s*[\'"]([^\'"]+)[\'"]',  # Configuración objeto
                        r'sAjaxSource:\s*[\'"]([^\'"]+)[\'"]',  # Versiones antiguas
                        r'ajax\.url\([\'"]([^\'"]+)[\'"]\)',  # API moderna
                    ]
                    
                    for pattern in ajax_patterns:
                        urls = re.findall(pattern, config)
                        for url in urls:
                            print(f"✓ Encontrada URL AJAX: {url}")
                            results["ajax_urls"].append(url)
        
        # 2. Buscar tablas con atributos data-ajax
        tables = soup.find_all('table')
        for table in tables:
            table_id = table.get('id', '')
            if table_id:
                results["table_ids"].append(table_id)
                print(f"\nAnalizando tabla: {table_id}")
                
                # Buscar atributos relacionados con AJAX
                ajax_attrs = {k:v for k,v in table.attrs.items() 
                             if 'ajax' in k.lower() or 'source' in k.lower()}
                if ajax_attrs:
                    print(f"✓ Encontrados atributos AJAX: {ajax_attrs}")
                    results["datatable_configs"].append(ajax_attrs)
        
        # 3. Analizar red en busca de peticiones XHR
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                
                # Capturar peticiones XHR
                xhr_requests = []
                page.on("request", lambda request: xhr_requests.append(request.url) 
                       if request.resource_type == "xhr" else None)
                
                # Cargar página y esperar a que la tabla se inicialice
                page.goto(self.base_url)
                page.wait_for_selector('#table_datos_movs')
                page.wait_for_timeout(5000)  # Esperar posibles peticiones AJAX
                
                # Registrar peticiones encontradas
                for url in xhr_requests:
                    print(f"✓ Detectada petición XHR: {url}")
                    results["network_requests"].append(url)
                
                browser.close()
        except Exception as e:
            print(f"Error analizando red: {str(e)}")
        
        # Guardar resultados
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.save_analysis(results, f"datatable_ajax_analysis_{timestamp}.json")
        
        return results

    def get_table_data(self, username, password, fecha_inicio=None, fecha_fin=None, page=None):
        """Obtiene todos los datos históricos de la tabla usando Playwright"""
        should_close_browser = False
        browser = None
        
        try:
            if page is None:
                # Si no se proporciona una página, crear una nueva sesión
                playwright = sync_playwright().start()
                browser = playwright.chromium.launch(headless=True)
                context = browser.new_context()
                page = context.new_page()
                should_close_browser = True
            
            # Login
            print("Realizando login...")
            page.goto(self.login_url)
            page.fill('input[name="userid"]', username)
            page.fill('input[name="password"]', password)
            page.click('button[type="submit"]')
            
            # Capturar las navegaciones y formularios
            form_data = None
            def handle_request(request):
                if request.method == "POST" or "rango_fecha" in request.url:
                    nonlocal form_data
                    form_data = {
                        "url": request.url,
                        "method": request.method,
                        "data": request.post_data if request.method == "POST" else request.url
                    }
            
            page.on("request", handle_request)
            
            # Ir a la página con la tabla
            print("Accediendo a la página de movimientos...")
            page.goto(self.base_url)
            
            # Primero configurar para mostrar todos los registros
            print("\nConfigurando visualización de todos los registros...")
            try:
                # Esperar a que el selector esté disponible
                page.wait_for_selector('select[name="table_datos_movs_length"]')
                # Seleccionar la opción "Todos"
                page.select_option('select[name="table_datos_movs_length"]', '-1')
                # Esperar a que la tabla se actualice
                page.wait_for_load_state("networkidle")
                page.wait_for_timeout(2000)
                print("✓ Configurado para mostrar todos los registros")
            except Exception as e:
                print(f"⚠ Error al configurar número de registros: {str(e)}")
            
            # Configurar rango de fechas si se proporciona
            if fecha_inicio and fecha_fin:
                print(f"\nConfigurando rango de fechas: {fecha_inicio} - {fecha_fin}")
                try:
                    # Esperar y hacer click en el input de fechas
                    date_input = page.wait_for_selector('input#rango_fecha_movs', timeout=5000)
                    date_input.click()
                    page.wait_for_timeout(1000)
                    
                    # Limpiar el input
                    page.keyboard.press("Control+A")
                    page.keyboard.press("Backspace")
                    
                    # Escribir la fecha de inicio
                    date_input.type(fecha_inicio)
                    page.wait_for_timeout(500)
                    
                    # Escribir el separador
                    page.keyboard.type(" - ")
                    page.wait_for_timeout(500)
                    
                    # Escribir la fecha fin
                    date_input.type(fecha_fin)
                    page.wait_for_timeout(500)
                    
                    # Buscar y hacer click en el botón "Aplicar"
                    apply_button = page.get_by_text("Aplicar")
                    if apply_button:
                        apply_button.click()
                    else:
                        # Si no encuentra el botón, intentar con Enter
                        page.keyboard.press("Enter")
                    
                    # Esperar a que la página se actualice
                    page.wait_for_load_state("networkidle")
                    page.wait_for_timeout(3000)
                    
                    # Verificar que los datos son del rango correcto
                    first_date = page.query_selector('#table_datos_movs tbody tr:first-child td:first-child')
                    if first_date:
                        print(f"Primera fecha encontrada: {first_date.inner_text()}")
                    
                    # Después de configurar las fechas, asegurarse de nuevo que se muestran todos los registros
                    page.select_option('select[name="table_datos_movs_length"]', '-1')
                    page.wait_for_load_state("networkidle")
                    page.wait_for_timeout(2000)
                    
                except Exception as e:
                    print(f"⚠ Error al configurar fechas: {str(e)}")
                    return None
            
            # Extraer datos de la tabla (ahora solo necesitamos procesar una página)
            print("\nExtrayendo datos...")
            # Esperar a que los datos estén presentes
            page.wait_for_selector('#table_datos_movs tbody tr')
            
            # Extraer datos
            all_data = page.evaluate('''() => {
                const rows = Array.from(document.querySelectorAll('#table_datos_movs tbody tr'));
                return rows.map(row => {
                    const cells = Array.from(row.querySelectorAll('td'));
                    const fechaCompleta = cells[0]?.innerText || '';
                    
                    // Procesar fecha y hora
                    let fecha = '', hora = '';
                    if (fechaCompleta.includes('Hoy')) {
                        const hoy = new Date();
                        fecha = hoy.toISOString().split('T')[0];  // YYYY-MM-DD
                        hora = fechaCompleta.split(' ')[1] || '';
                    } else if (fechaCompleta.includes('Ayer')) {
                        const ayer = new Date();
                        ayer.setDate(ayer.getDate() - 1);
                        fecha = ayer.toISOString().split('T')[0];  // YYYY-MM-DD
                        hora = fechaCompleta.split(' ')[1] || '';
                    } else {
                        const partes = fechaCompleta.split(' ');
                        if (partes[0]) {
                            // Convertir DD/MM/YYYY a YYYY-MM-DD
                            const [dia, mes, anio] = partes[0].split('/');
                            fecha = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
                        }
                        hora = partes[1] || '';
                    }
                    
                    return {
                        fecha: fecha,
                        hora: hora,
                        movimiento: cells[1]?.innerText || '',
                        cantidad: cells[2]?.innerText || '',
                        concepto: cells[3]?.innerText || '',
                        usuario_asociado: cells[4]?.innerText || '',
                        saldo: cells[5]?.innerText || '',
                        cuenta: cells[6]?.innerText || ''
                    };
                });
            }''')
            
            print(f"\nExtracción completada:")
            print(f"- Total de registros obtenidos: {len(all_data)}")
            
            return all_data
            
        except Exception as e:
            print(f"\n✗ Error durante la extracción: {str(e)}")
            return None
        
        finally:
            if should_close_browser and browser:
                browser.close()

    def extract_all_users_data(self):
        """Extrae datos de todos los usuarios desde una fecha inicial hasta hoy"""
        # Cargar categorías
        categories = self.load_categories()
        
        # Configurar fechas
        fecha_fin = datetime.now().strftime("%d/%m/%Y")
        fecha_inicio = "01/01/2020"
        
        print("\n=== Extracción Automática de Datos ===")
        print(f"Rango de fechas: {fecha_inicio} - {fecha_fin}")
        
        for username, creds in self.credentials.items():
            print(f"\nProcesando usuario: {username}")
            try:
                # Extraer datos
                data = self.get_table_data(
                    creds["username"],
                    creds["password"],
                    fecha_inicio,
                    fecha_fin
                )
                
                if data:
                    # Añadir categoría a cada movimiento
                    for movimiento in data:
                        usuario = movimiento['usuario_asociado']
                        movimiento['categoria'] = categories.get(usuario, 'Sin categoría')
                    
                    # Guardar datos
                    filename = f"movimientos_{username}.json"
                    filepath = join(self.data_dir, filename)
                    
                    # Backup si existe
                    if os.path.exists(filepath):
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        backup_filename = f"movimientos_{username}_backup_{timestamp}.json"
                        backup_filepath = join(self.data_dir, backup_filename)
                        os.rename(filepath, backup_filepath)
                        print(f"✓ Backup creado: {backup_filename}")
                    
                    # Guardar nuevos datos
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=4, ensure_ascii=False)
                    print(f"✓ Datos guardados en: {filename}")
                    print(f"  Total registros: {len(data)}")
                    
                    # Mostrar resumen de categorías
                    df = pd.DataFrame(data)
                    print("\nResumen por categorías:")
                    print(df['categoria'].value_counts())
                
            except Exception as e:
                print(f"✗ Error procesando {username}: {str(e)}")

    def load_categories(self):
        """Carga el mapeo de comercios a categorías desde el CSV"""
        categories = {}
        csv_path = join(dirname(self.base_dir), 'docs', 'comercio_categoria.csv')
        
        try:
            # Leer CSV con encoding correcto para caracteres especiales
            df = pd.read_csv(csv_path, sep=';', encoding='latin-1')
            # Crear diccionario de comercio -> categoría
            categories = dict(zip(df['Comercio'], df['Categoria compra']))
            print(f"✓ Cargadas {len(categories)} categorías de comercios")
            return categories
        except Exception as e:
            print(f"✗ Error cargando categorías: {str(e)}")
            return {}

def main():
    """Función principal"""
    scraper = AutoScraper()
    
    while True:
        print("\n=== MENÚ PRINCIPAL ===")
        print("1. Login con usuario predefinido")
        print("2. Login manual")
        print("3. Extraer datos de la tabla")
        print("4. Extraer datos por rango de fechas")
        print("5. Extraer datos de todos los usuarios")
        print("6. Salir")
        
        opcion = input("Seleccione una opción (1-6): ").strip()
        
        if opcion == "1":
            username = input("Usuario predefinido (alomorga/ilandatxe/fotostorres): ").strip().lower()
            if username in scraper.credentials:
                if scraper.login(scraper.credentials[username]["username"], 
                               scraper.credentials[username]["password"]):
                    scraper.analyze_page()
            else:
                print("Usuario no válido")
                
        elif opcion == "2":
            print("\n=== Login Manual ===")
            username = input("Introduce el nombre de usuario: ").strip()
            password = input("Introduce la contraseña: ").strip()
            if scraper.login(username, password):
                scraper.analyze_page()
                
        elif opcion == "3":
            print("\n=== Extracción de Datos ===")
            username = input("Usuario (alomorga/ilandatxe/fotostorres): ").strip().lower()
            if username in scraper.credentials:
                print("Extrayendo datos de la tabla...")
                data = scraper.get_table_data(
                    scraper.credentials[username]["username"],
                    scraper.credentials[username]["password"]
                )
                if data:
                    # Guardar datos en JSON
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filename = f"tabla_datos_{timestamp}.json"
                    filepath = join(scraper.data_dir, filename)
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=4, ensure_ascii=False)
                    print(f"\n✓ Datos guardados en: {filepath}")
                    
                    # Convertir a DataFrame y mostrar resumen
                    df = pd.DataFrame(data)
                    print("\nResumen de datos extraídos:")
                    print(f"Total de registros: {len(df)}")
                    print("\nPrimeros 5 registros:")
                    print(df.head())
            else:
                print("Usuario no válido")
                
        elif opcion == "4":
            print("\n=== Extracción de Datos por Fechas ===")
            username = input("Usuario (alomorga/ilandatxe/fotostorres): ").strip().lower()
            if username in scraper.credentials:
                fecha_inicio = input("Fecha inicio (DD/MM/YYYY): ").strip()
                fecha_fin = input("Fecha fin (DD/MM/YYYY): ").strip()
                
                print("Extrayendo datos de la tabla...")
                data = scraper.get_table_data(
                    scraper.credentials[username]["username"],
                    scraper.credentials[username]["password"],
                    fecha_inicio,
                    fecha_fin
                )
                if data:
                    # Crear nombre de archivo con el usuario
                    filename = f"movimientos_{username}.json"
                    filepath = join(scraper.data_dir, filename)
                    
                    # Verificar si el archivo existe y hacer backup si es necesario
                    if os.path.exists(filepath):
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        backup_filename = f"movimientos_{username}_backup_{timestamp}.json"
                        backup_filepath = join(scraper.data_dir, backup_filename)
                        os.rename(filepath, backup_filepath)
                        print(f"✓ Backup del archivo anterior creado: {backup_filepath}")
                    
                    # Guardar nuevos datos
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=4, ensure_ascii=False)
                    print(f"\n✓ Datos guardados en: {filepath}")
                    
                    # Convertir a DataFrame y mostrar resumen
                    df = pd.DataFrame(data)
                    print("\nResumen de datos extraídos:")
                    print(f"Total de registros: {len(df)}")
                    print("\nPrimeros 5 registros:")
                    print(df.head())
            else:
                print("Usuario no válido")
                
        elif opcion == "5":
            scraper.extract_all_users_data()
            
        elif opcion == "6":
            print("Saliendo...")
            break
            
        else:
            print("Opción no válida")

if __name__ == "__main__":
    main() 