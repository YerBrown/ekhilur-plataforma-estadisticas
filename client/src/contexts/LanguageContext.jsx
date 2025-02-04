import { createContext, useState, useContext, useEffect } from "react";

const translations = {
  es: {
    welcome: "Bienvenido",
    transactionTitle: "Transacciones",
    bonificationTitle: "Bonificaciones",
    statisticsTitle: "Estadísticas",
    all: "Todas",
    incomes: "Ingresos",
    expenses: "Gastos",
    emmited: "Emitidas",
    received: "Recibidas",
    searchBarInput: "Buscar transacciones",
    filterDate: "Periodo",
    filterImport: "Importe",
    inputImportMin: "Mín.",
    inputImportMax: "Máx.",
    logout: "Cerrar sesión",
    viewProfile: "Ver perfil",
    wallet: "Monedero",
    salesTitle: "Ventas",
    statisticsTitle: "Estadísticas",
    categoriesTitle: "Categorias",
    "Alimentación": "Alimentación",
    "Hostelería": "Hostelería",
    "Moda y Complementos": "Moda y Complementos",
    "Salud y Estética": "Salud y Estética",
    "Servicios y Comercio General": "Servicios y Comercio General",
    "Industria y Construcción": "Industria y Construcción",
    "Arte y Cultura": "Arte y Cultura",
    "Deporte y Ocio": "Deporte y Ocio",
    "Asociaciones y Cooperativas": "Asociaciones y Cooperativas",
    months: {},
    monthsAbbreviations: {},
    dateTranslations: {},
  },
  eus: {
    welcome: "Ongi etorri",
    transactionTitle: "Transakzioak",
    bonificationTitle: "Bonifikazioak",
    statisticsTitle: "Estatistikak",
    all: "Guztiak",
    incomes: "Diru-Sarrerak",
    expenses: "Gastuak",
    emmited: "Igorriak",
    received: "Jasotakoak",
    searchBarInput: "Bilatu transakzioak",
    filterDate: "Denbora-tartea",
    filterImport: "Zenbatekoa",
    inputImportMin: "Min.",
    inputImportMax: "Max.",
    logout: "Saioa Itxi",
    viewProfile: "Ikusi Profila",
    wallet: "Diru-zorroa",
    salesTitle: "Salmentak",
    categoriesTitle: "Kategoriak",
    "Alimentación": "Elikadura",
    "Hostelería": "Ostalaritza",
    "Moda y Complementos": "Moda eta Osagarriak",
    "Salud y Estética": "Osasun eta Estetika",
    "Servicios y Comercio General": "Zerbitzuak eta Merkataritza Orokorra",
    "Industria y Construcción": "Industria eta Eraikuntza",
    "Arte y Cultura": "Artea eta Kultura",
    "Deporte y Ocio": "Kirola eta Aisialdia",
    "Asociaciones y Cooperativas": "Elkarteak eta kooperatibak",
    months: {
      enero: "Urtarrila",
      febrero: "Otsaila",
      marzo: "Martxoa",
      abril: "Apirila",
      mayo: "Maiatza",
      junio: "Ekaina",
      julio: "Uztaila",
      agosto: "Abuztua",
      septiembre: "Iraila",
      octubre: "Urria",
      noviembre: "Azaroa",
      diciembre: "Abendua",
    },
    monthsAbbreviations: {
      ene: 'urt', 
      feb: 'ots', 
      mar: 'mar', 
      abr: 'api', 
      may: 'mai', 
      jun: 'eka', 
      jul: 'uzt', 
      ago: 'abu', 
      sep: 'ira', 
      oct: 'urr', 
      nov: 'aza', 
      dic: 'abe',
    },
    dateTranslations: {
      Monday: "astelehena", Tuesday: "asteartea", Wednesday: "asteazkena", Thursday: "osteguna", Friday: "ostirala", Saturday: "larunbata", Sunday: "igandea",
      January: "urtarrilak", February: "otsailak", March: "martxoak", April: "apirilak", May: "maiatzak", June: "ekainak", July: "uztailak", August: "abuztuak", September: "irailak", October: "urriak", November: "azaroak", December: "abenduak",
    },
  },
};

// Crear el contexto
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es");

  // Cambiar idioma
  const setSpanish = () => saveLanguage("es");
  const setBasque = () => saveLanguage("eus");

  function saveLanguage(language) {
    localStorage.setItem("language", language);
    setLanguage(language);
  }

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setSpanish, setBasque, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};