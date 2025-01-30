import { createContext, useState, useContext } from "react";

const translations = {
  es: {
    transactionTitle: "Transacciones",
    all: "Todas",
    incomes: "Ingresos",
    expenses: "Gastos",
    searchBarInput: "Buscar transacciones",
    filterDate: "Periodo",
    filterImport: "Importe",
    inputImportMin: "Mín.",
    inputImportMax: "Máx.",
  },
  eus: {
    transactionTitle: "Transakzioak",
    all: "Guztiak",
    incomes: "Sarrerak",
    expenses: "Gastuak",
    searchBarInput: "Bilatu transakzioak",
    filterDate: "Denbora-tartea",
    filterImport: "Zenbatekoa",
    inputImportMin: "Min.",
    inputImportMax: "Max.",
  },
};

// Crear el contexto
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es");

  // Cambiar idioma
  const toggleLanguage = () => {
    setLanguage(language === "es" ? "eus" : "es");
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};