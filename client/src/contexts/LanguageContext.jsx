import { createContext, useState, useContext } from "react";

const translations = {
  es: {
    transactionTitle: "Transacciones",
    bonificationTitle: "Bonificaciones",
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
    dateTranslations: {},
  },
  eus: {
    transactionTitle: "Transakzioak",
    bonificationTitle: "???",
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