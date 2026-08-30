import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./App.css";

function App() {
  const [ip, setIp] = useState("");
  const [portas, setPortas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [config, setConfig] = useState({
    modo:  "range",

    porta_inicial: "1",
    porta_final: "65535",

    portas_especificas: "",


    timeoutMS: "500",
    concorrencia: "500",
  });


  useEffect(() => {
    let unlisten;
    let cancelado = false;

    async function ouvir_portas() {
      const parar_de_ouvir = await listen("port-open", (evento) => {
        const porta = evento.payload;

        setPortas((portasAtuais) => [...portasAtuais, porta]);
      });

      if (cancelado) {
        parar_de_ouvir();
      } else {
        unlisten = parar_de_ouvir;
      }
    }

    ouvir_portas();

    return () => {
      cancelado = true;

      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  async function escanear() {
    const scan_config = {
      ip:  ip.trim(),

      modo: config.modo,

      porta_inicial:
        config.modo === "range"
        ? Number(config.porta_inicial)
        : null,

      porta_final: 
        config.modo === "range" 
        ? Number(config.porta_final)
        : null,

        portas: 
          config.modo === "lista"
          ? config.portas_especificas
            .split(",")
            .map((porta) => Number(porta.trim()))
          : [],

        timeout_ms: Number(config.timeoutMS),
        concorrencia: Number(config.concorrencia),
    } 

    console.log(scan_config)

   setCarregando(true);
    setErro("");
    setPortas([]);



    // try {
    //   await invoke("port_scanner", {
    //     ip: ip,
    //   });
    // } catch (erro) {
    //   setErro(String(erro));
    // } finally {
    //   setCarregando(false);
    // }
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
      <div>
        <label> Modo:</label>
        <select
          value={config.modo}
          onChange={(e) => 
            setConfig({
              ...config,
              modo: e.target.value,
            })
          }
        >
          <option value="range"> Range</option>
          <option value="lista"> Lista</option>
        </select>
      </div>

      {config.modo === "range" ?(
        <>
        <div>
          <label>Porta Incial: </label>
          <input 
            type="number"
            min="1"
            max="65535"  
            value={config.porta_inicial}
            onChange={(e) => 
              setConfig({
                ...config,
                porta_inicial: e.target.value,
              })
            }
            />
        </div>
        <div>
          <label>Porta Final: </label>
          <input 
            type="number"
            min = "1"
            max = "65535"
            value={config.porta_final}
            onChange={(e) =>
              setConfig({
                ...config,
                porta_final: e.target.value,
              })
            }
          />
        </div>
        </>

      ): (
        <div>
          <label >Portas: </label>
          <input 
            type="text"
            placeholder="22, 45, 80, 443, 8080"
            value={config.portas_especificas}
            onChange={(e) =>
              setConfig({
                ...config,
                portas_especificas: e.target.value,
              })
            }
          />
        </div>
      )}

      <div>
        <label>Timeout: </label>
        <input 
          type="number" 
          value={config.timeoutMS}
          onChange={(e) =>
            setConfig({
              ...config,
              timeoutMS: e.target.value,
            })
          }
          />

          <span>ms</span>
      </div>

      <div>
        <label> Concorrência: </label>

        <input type="number"
          value={config.concorrencia}
          onChange={(e) =>
            setConfig({
              ...config,
              concorrencia: e.target.value,
            })
          }
        />
      </div>

      {erro && <p>{erro}</p>}

      <h2>Portas abertas</h2>
      <table>
        <thead>
          <tr>
            <th> Porta </th>
            <th> Status </th>
          </tr>
        </thead>

        <tbody>
          {portas.map((porta) => (
            <tr key={porta}>
              <td>{porta}</td>
              <td>Open</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
