from bs4 import BeautifulSoup
import requests
import os
import json
from datetime import datetime

class EkhilurCuentasScraper:
    def __init__(self):
        self.login_url = "https://portal.ekhilur.eus/login.php?rr=01"
        self.cuentas_url = "https://portal.ekhilur.eus/?tb=ac"
        self.session = requests.Session()
        
        # Directorio para guardar resultados
        self.data_dir = 'data/scraper'
        os.makedirs(self.data_dir, exist_ok=True)

    def login(self, username, password):
        """
        Reutilizamos el método de login del scraper de perfiles
        """
        try:
            response = self.session.get(self.login_url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            token = soup.find('input', {'name': 'token'})['value']
            f_ses = soup.find('input', {'name': 'f_ses'})['value']
            
            login_data = {
                'userid': username,
                'password': password,
                'token': token,
                'f_ses': f_ses
            }
            
            response = self.session.post('https://portal.ekhilur.eus/acceso.php', data=login_data)
            
            if response.ok:
                profile_response = self.session.get(self.cuentas_url)
                return 'login-box' not in profile_response.text
            return False
            
        except Exception as e:
            print(f"Error en login: {str(e)}")
            return False

    def get_cuentas_data(self):
        """
        Obtiene los datos de las cuentas
        """
        try:
            response = self.session.get(self.cuentas_url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extraer datos de las cuentas
            cuentas_data = {
                "cuentas": []
            }
            
            # Buscar la tabla con las clases correctas
            tabla = soup.find('table', class_='table table-hover')
            if tabla:
                tbody = tabla.find('tbody')
                if tbody:
                    for fila in tbody.find_all('tr'):
                        columnas = fila.find_all('td')
                        if len(columnas) >= 2:
                            try:
                                saldo_texto = columnas[1].text.strip()
                                saldo_texto = saldo_texto.replace(' ', '').replace(',', '.')
                                
                                cuenta = {
                                    "tipo": columnas[0].text.strip(),
                                    "saldo": float(saldo_texto) if saldo_texto else 0.0
                                }
                                cuentas_data["cuentas"].append(cuenta)
                            except Exception as e:
                                print(f"Error procesando fila: {str(e)}")
                    
                    # Calcular el saldo total y redondear a 2 decimales
                    cuentas_data["saldo_total"] = round(sum(cuenta["saldo"] for cuenta in cuentas_data["cuentas"]), 2)
                    
                    return cuentas_data
                else:
                    print("No se encontró el tbody de la tabla")
            else:
                print("No se encontró la tabla de cuentas")
            
            return None
            
        except Exception as e:
            print(f"Error obteniendo datos de cuentas: {str(e)}")
            return None

    def save_results(self, data, username):
        """
        Guarda los resultados en un archivo JSON
        """
        filename = f"cuentas_{username}.json"
        filepath = os.path.join(self.data_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        
        return filepath

def print_menu():
    """
    Muestra el menú de opciones
    """
    print("\n=== MENU SCRAPER CUENTAS EKHILUR ===")
    print("1. Scrapear cuentas de Alomorga")
    print("2. Scrapear cuentas de Ilandatxe")
    print("3. Scrapear cuentas de FotosTorres")
    print("4. Scrapear cuentas de todos los usuarios")
    print("5. Salir")
    print("==========================")

def scrape_user(scraper, username, credentials):
    """
    Realiza el scraping para un usuario específico
    """
    print(f"\nIniciando scraping de cuentas para {username}...")
    creds = credentials[username]
    
    if scraper.login(creds["username"], creds["password"]):
        print("✓ Login exitoso")
        
        cuentas_data = scraper.get_cuentas_data()
        if cuentas_data:
            print("✓ Datos obtenidos correctamente")
            filepath = scraper.save_results(cuentas_data, username)
            print(f"✓ Resultados guardados en: {filepath}")
            return True
        else:
            print("✗ Error obteniendo datos de cuentas")
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
    
    scraper = EkhilurCuentasScraper()
    
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