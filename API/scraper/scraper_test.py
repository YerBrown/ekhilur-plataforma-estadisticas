import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import os

class EkhilurScraper:
    def __init__(self):
        self.login_url = "https://portal.ekhilur.eus/login.php?rr=01"
        self.profile_url = "https://portal.ekhilur.eus/"
        self.session = requests.Session()
        
        # Directorio para guardar resultados
        self.data_dir = 'data/scraper'
        os.makedirs(self.data_dir, exist_ok=True)

    def login(self, username, password):
        """
        Realiza el login y retorna True si fue exitoso
        """
        try:
            # Primero obtener el token y f_ses del formulario
            response = self.session.get(self.login_url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            token = soup.find('input', {'name': 'token'})['value']
            f_ses = soup.find('input', {'name': 'f_ses'})['value']
            
            # Realizar el login con los campos correctos
            login_data = {
                'userid': username,
                'password': password,
                'token': token,
                'f_ses': f_ses
            }
            
            # Hacer el POST a la URL correcta
            response = self.session.post('https://portal.ekhilur.eus/acceso.php', data=login_data)
            
            # Verificar si el login fue exitoso
            if response.ok:
                # Intentar acceder a la página del perfil para verificar
                profile_response = self.session.get(self.profile_url)
                return 'login-box' not in profile_response.text
            return False
            
        except Exception as e:
            print(f"Error en login: {str(e)}")
            return False

    def get_profile_data(self):
        """
        Obtiene los datos del perfil
        """
        try:
            response = self.session.get(self.profile_url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extraer datos del perfil
            profile_data = {}
            
            # Obtener el nombre de usuario del título
            title_text = soup.find('div', class_='box-header').text.strip()
            if title_text:
                profile_data['nombre_usuario'] = title_text
            
            # Buscar el contenedor principal para el resto de datos
            main_container = soup.find('div', class_='box-body')
            if main_container:
                try:
                    # Teléfono
                    tel_div = main_container.find('dt', string=lambda x: x and 'Teléfono' in x)
                    if tel_div and tel_div.find_next('dd'):
                        profile_data['telefono'] = tel_div.find_next('dd').text.strip()

                    # Email
                    email_div = main_container.find('dt', string=lambda x: x and 'Email' in x)
                    if email_div and email_div.find_next('dd'):
                        profile_data['email'] = email_div.find_next('dd').text.strip()

                    # Dirección - con formato especial
                    dir_div = main_container.find('dt', string=lambda x: x and 'Dirección' in x)
                    if dir_div and dir_div.find_next('dd'):
                        direccion_completa = dir_div.find_next('dd').text.strip()
                        
                        # Separar la dirección en sus componentes
                        partes = direccion_completa.split('Zarautz')
                        if len(partes) > 0:
                            calle = partes[0].strip()
                            profile_data['direccion'] = {
                                'calle': calle,
                                'municipio': 'Zarautz',
                                'cp': '20800'
                            }
                        else:
                            profile_data['direccion'] = direccion_completa

                    # Fecha Nacimiento
                    fecha_div = main_container.find('dt', string=lambda x: x and 'Fecha Nacimiento' in x)
                    if fecha_div and fecha_div.find_next('dd'):
                        profile_data['fecha_nacimiento'] = fecha_div.find_next('dd').text.strip()

                    # Ocupación
                    ocup_div = main_container.find('dt', string=lambda x: x and 'Ocupación' in x)
                    if ocup_div and ocup_div.find_next('dd'):
                        profile_data['ocupacion'] = ocup_div.find_next('dd').text.strip()

                    # IBAN
                    iban_div = main_container.find('dt', string=lambda x: x and 'IBAN' in x)
                    if iban_div and iban_div.find_next('dd'):
                        profile_data['iban'] = iban_div.find_next('dd').text.strip()

                    # Capital social abonado
                    capital_div = main_container.find('dt', string='Capital social abonado')
                    if capital_div:
                        dd = capital_div.find_next('dd', class_='ellip')
                        if dd:
                            profile_data['capital_social_abonado'] = dd.text.strip()

                except Exception as e:
                    print(f"Error extrayendo campo específico: {str(e)}")

                # Debug: mostrar datos encontrados
                print("Datos encontrados:", profile_data)
                
                # Verificar que tenemos todos los datos
                required_fields = [
                    'nombre_usuario', 'telefono', 'email', 'direccion', 
                    'fecha_nacimiento', 'ocupacion', 'iban', 'capital_social_abonado'
                ]
                
                if all(field in profile_data for field in required_fields):
                    return profile_data
                else:
                    print("Datos incompletos. Campos encontrados:", list(profile_data.keys()))
                    return None
            else:
                print("No se encontró el contenedor principal")
                return None
            
        except Exception as e:
            print(f"Error obteniendo datos del perfil: {str(e)}")
            return None

    def save_results(self, data, username):
        """
        Guarda los resultados en un archivo JSON, sobreescribiendo si existe
        """
        filename = f"profile_{username}.json"  # Quitamos el timestamp para que siempre use el mismo nombre
        filepath = os.path.join(self.data_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        
        return filepath

def print_menu():
    """
    Muestra el menú de opciones
    """
    print("\n=== MENU SCRAPER EKHILUR ===")
    print("1. Scrapear datos de Alomorga")
    print("2. Scrapear datos de Ilandatxe")
    print("3. Scrapear datos de FotosTorres")
    print("4. Scrapear datos de todos los usuarios")
    print("5. Salir")
    print("==========================")

def scrape_user(scraper, username, credentials):
    """
    Realiza el scraping para un usuario específico
    """
    print(f"\nIniciando scraping para {username}...")
    creds = credentials[username]
    
    if scraper.login(creds["username"], creds["password"]):
        print("✓ Login exitoso")
        
        profile_data = scraper.get_profile_data()
        if profile_data:
            print("✓ Datos obtenidos correctamente")
            filepath = scraper.save_results(profile_data, username)
            print(f"✓ Resultados guardados en: {filepath}")
            return True
        else:
            print("✗ Error obteniendo datos del perfil")
    else:
        print("✗ Error en el login")
    return False

def main():
    # Credenciales
    credentials = {
        "alomorga": {"username": "alomorga", "password": "111111"},
        "ilandatxe": {"username": "ilandatxe", "password": "111111"},
        "fotostorres": {"username": "FotosTorres", "password": "123456"}
    }
    
    scraper = EkhilurScraper()
    
    while True:
        print_menu()
        try:
            opcion = int(input("Seleccione una opción (1-5): "))
            
            if opcion == 1:
                scrape_user(scraper, "alomorga", credentials)
            
            elif opcion == 2:
                scrape_user(scraper, "ilandatxe", credentials)
            
            elif opcion == 3:
                scrape_user(scraper, "fotostorres", credentials)
            
            elif opcion == 4:
                print("\nIniciando scraping automático para todos los usuarios...")
                for username in credentials.keys():
                    print(f"\n=== Procesando {username} ===")
                    scrape_user(scraper, username, credentials)
                print("\n✓ Scraping automático completado")
            
            elif opcion == 5:
                print("\nSaliendo del programa...")
                break
            
            else:
                print("\n✗ Opción no válida. Por favor, seleccione una opción entre 1 y 5.")
            
            input("\nPresione Enter para continuar...")
            
        except ValueError:
            print("\n✗ Por favor, introduzca un número válido.")
            input("\nPresione Enter para continuar...")

if __name__ == "__main__":
    main() 