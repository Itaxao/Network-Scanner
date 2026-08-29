import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [ip, setIp] = useState("");
  const [portas, setPortas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function escanear() {
    setCarregando(true);
    setErro("");
    setPortas([]);

    try {
      const resultado = await invoke("port_scanner", {
        ip: ip,
      });

      setPortas(resultado);
    } catch (erro) {
      setErro(String(erro));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="container">
      <h1>Network Scanner</h1>

      <input
        type="text"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="192.168.0.1"
      />

      <button onClick={escanear} disabled={carregando}>
        {carregando ? "Escaneando..." : "Escanear"}
      </button>

      {erro && <p>{erro}</p>}

      <h2>Portas abertas</h2>

      <ul>
        {portas.map((porta) => (
          <li key={porta}>{porta}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;