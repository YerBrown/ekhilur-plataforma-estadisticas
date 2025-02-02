import { createContext, useState, useContext } from "react";

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
    category1: "Alimentación",
    category2: "Hostelería",
    category3: "Moda y Complementos",
    category4: "Salud y Estética",
    category5: "Servicios y Comercio General",
    category6: "Industria y Construcción",
    category7: "Arte y Cultura",
    category8: "Deporte y Ocio",
    category9: "Asociaciones y Cooperativas",
    months: {},
    monthsAbbreviations: {},
    dateTranslations: {},
  },
  eus: {
    welcome: "Ongi etorri",
    transactionTitle: "Transakzioak",
    bonificationTitle: "???",
    statisticsTitle: "Estatistikak",
    all: "Guztiak",
    incomes: "Sarrerak",
    expenses: "Gastuak",
    emmited: "???",
    received: "???",
    searchBarInput: "Bilatu transakzioak",
    filterDate: "Denbora-tartea",
    filterImport: "Zenbatekoa",
    inputImportMin: "Min.",
    inputImportMax: "Max.",
    logout: "Saioa Itxi",
    viewProfile: "Ikusi Profila",
    wallet: "Diru-zorroa",
    salesTitle: "Salmentak",
    statisticsTitle: "Estatistikak",
    categoriesTitle: "Kategoriak",
    category1: "Alimentazioa",
    category2: "Ostalaritza",
    category3: "Moda eta Osagarriak",
    category4: "Osasun eta Estetika",
    category5: "Zerbitzuak eta Merkataritza Orokorra",
    category6: "Industria eta Eraikuntza",
    category7: "Artea eta Kultura",
    category8: "Kirola eta Aisialdia",
    category9: "Elkarteak eta kooperatibak",
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
  const setSpanish = () => setLanguage("es");
  const setBasque = () => setLanguage("eus");

  return (
    <LanguageContext.Provider value={{ language, setSpanish, setBasque, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};