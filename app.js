//dependencias y configuración
import express from "express";
import data from "./data/cuentas.js";

const app = express();
const PORT = 3130;

app.use(express.json());

//Rutas
app.get("/", (req, res) => {
    res.json({
        message: "Servidor Express activo",
        routes: {
            cuentas: "/cuentas",
            cuentaPorId: "/cuenta/:id",
            cuentasBalance: "/cuentasBalance",
        },
    });
});

// Obtener cuentas con filtro 
app.get("/cuentas", (req, res) => {
    const { queryParam } = req.query;

    if (!queryParam) {
        return res.json({ count: data.length, data });
    }

    const lowerQuery = queryParam.toLowerCase();

    const resultado = data.filter((c) =>
        c.id === queryParam ||
        c.client?.toLowerCase().includes(lowerQuery) ||
        c.gender?.toLowerCase() === lowerQuery
    );

    if (resultado.length === 1) {
        return res.json({ finded: true, account: resultado[0] });
    }

    if (resultado.length > 1) {
        return res.json({ finded: true, data: resultado });
    }

    return res.json({ finded: false });
});

// Obtener cuenta por ID
app.get("/cuenta/:id", (req, res) => {
    const { id } = req.params;
    const cuenta = data.find((c) => c.id === id);
    res.json({ finded: !!cuenta, account: cuenta || null });
});

// Obtener el balance total de las cuentas activas
app.get("/cuentasBalance", (req, res) => {
    const activas = data.filter((c) => c.isActive);
    const total = activas.reduce((sum, c) => sum + Number(c.balance.replace(/[^0-9.-]+/g, "")), 0);
    res.json({ status: activas.length > 0, accountBalance: total });
});

//Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});