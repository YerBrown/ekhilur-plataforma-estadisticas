const mockData = [
    {
        "fecha": "2024-12-09",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "15,00",
        "concepto": "Ekhilur kuota urtebete",
        "usuario_asociado": "Ekhilur S.Coop.",
        "saldo": "15,00",
        "cuenta": "Ekhi Hernani"
    },
    {
        "fecha": "2024-12-09",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "1,00",
        "concepto": "Froga",
        "usuario_asociado": "Alejandro Lopez Morgado",
        "saldo": "16,00",
        "cuenta": "Ekhi"
    },
    {
        "fecha": "2024-12-09",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "-1,00",
        "concepto": "froga",
        "usuario_asociado": "Alejandro Lopez Morgado",
        "saldo": "15,00",
        "cuenta": "Ekhi"
    },
    {
        "fecha": "2024-12-13",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "-1,00",
        "concepto": "froga",
        "usuario_asociado": "Herrilur Kontsumo Elkartea",
        "saldo": "14,00",
        "cuenta": "Ekhi Hernani"
    },
    {
        "fecha": "2024-12-13",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "1,00",
        "concepto": "",
        "usuario_asociado": "Herrilur Kontsumo Elkartea",
        "saldo": "15,00",
        "cuenta": "Ekhi"
    },
    {
        "fecha": "2024-12-17",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Recarga por tarjeta",
        "cantidad": "50,00",
        "concepto": "",
        "usuario_asociado": "",
        "saldo": "65,00",
        "cuenta": "Euro"
    },
    {
        "fecha": "2024-12-17",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "-32,55",
        "concepto": "aliprox",
        "usuario_asociado": "Aliprox",
        "saldo": "32,45",
        "cuenta": "Euro"
    },
    {
        "fecha": "2024-12-19",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "-1,40",
        "concepto": "",
        "usuario_asociado": "Tripontzi Jatetxea",
        "saldo": "31,05",
        "cuenta": "Euro"
    },
    {
        "fecha": "2024-12-20",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Recarga por tarjeta",
        "cantidad": "100,00",
        "concepto": "",
        "usuario_asociado": "",
        "saldo": "131,05",
        "cuenta": "Euro"
    },
    {
        "fecha": "2024-12-23",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "-7,30",
        "concepto": "",
        "usuario_asociado": "On Bit Informatika",
        "saldo": "123,75",
        "cuenta": "Ekhi Hernani"
    },
    {
        "fecha": "2024-12-23",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "-1,00",
        "concepto": "froga",
        "usuario_asociado": "Herrilur Kontsumo Elkartea",
        "saldo": "122,75",
        "cuenta": "Ekhi"
    },
    {
        "fecha": "2024-12-23",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "1,00",
        "concepto": "Bueltan",
        "usuario_asociado": "Herrilur Kontsumo Elkartea",
        "saldo": "123,75",
        "cuenta": "Ekhi Hernani"
    },
    {
        "fecha": "2024-12-24",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "-1,00",
        "concepto": "froga",
        "usuario_asociado": "Galarreta Pilotalekua",
        "saldo": "122,75",
        "cuenta": "Euro"
    },
    {
        "fecha": "2024-12-24",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "1,00",
        "concepto": "froga buelta",
        "usuario_asociado": "Galarreta Pilotalekua",
        "saldo": "123,75",
        "cuenta": "Ekhi"
    },
    {
        "fecha": "2024-12-24",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "-1,00",
        "concepto": "droga",
        "usuario_asociado": "Ereñozuko denda (Coviran)",
        "saldo": "122,75",
        "cuenta": "Ekhi"
    },
    {
        "fecha": "2024-12-24",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "1,00",
        "concepto": "Devolucion",
        "usuario_asociado": "Ereñozuko denda (Coviran)",
        "saldo": "123,75",
        "cuenta": "Ekhi"
    },
    {
        "fecha": "2024-12-25",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "-15,94",
        "concepto": "",
        "usuario_asociado": "Artola Harategia",
        "saldo": "107,81",
        "cuenta": "Euro"
    },
    {
        "fecha": "2024-12-27",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "-1,00",
        "concepto": "froga",
        "usuario_asociado": "Gaindituz Fisioterapia",
        "saldo": "106,81",
        "cuenta": "Euro"
    },
    {
        "fecha": "2024-12-27",
        "mes": "12",
        "año": "2024",
        "hora": "11:11",
        "movimiento": "Pago a usuario",
        "cantidad": "1,00",
        "concepto": "",
        "usuario_asociado": "Gaindituz Fisioterapia",
        "saldo": "107,81",
        "cuenta": "Ekhi"
    }
];

export default mockData;