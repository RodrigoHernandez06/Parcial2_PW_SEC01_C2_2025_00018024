import express from "express";
import { data } from "./data/cuentas.js";

const app = express();
const PORT = 3130;


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:3130"
  );
  next();
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Servidor Express activo</h1>
    <p>Rutas disponibles:</p>
    <ul>
      <li><a href="/cuentas">/cuentas</a></li>
      <li><a href="/cuentasBalance">/cuentasBalance</a></li>
      <li><a href="/cuenta/1">/cuenta/:id</a></li>
    </ul>
  `);
});


app.get("/cuentas", (req, res) => {
  const { queryParam } = req.query;
  if (!queryParam) return res.json({ count: data.length, data });

  const resultado = data.filter(c =>
    c.id === queryParam ||
    c.name.toLowerCase().includes(queryParam.toLowerCase()) ||
    c.gender.toLowerCase() === queryParam.toLowerCase()
  );

  if (resultado.length === 1)
    return res.json({ finded: true, account: resultado[0] });
  if (resultado.length > 1)
    return res.json({ finded: true, data: resultado });

  return res.json({ finded: false });
});

app.get("/cuenta/:id", (req, res) => {
  const { id } = req.params;
  const cuenta = data.find(c => c.id === id);
  res.json({ finded: !!cuenta, account: cuenta || null });
});

app.get("/cuentasBalance", (req, res) => {
  const activas = data.filter(c => c.isActive);
  const total = activas.reduce((sum, c) => sum + c.balance, 0);
  res.json({ status: activas.length > 0, accountBalance: total });
});


app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
});
