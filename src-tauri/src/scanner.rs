use std::{
    net::{IpAddr, SocketAddr},
    sync::Arc,
    time::Duration,
};

use tauri::{AppHandle, Emitter};
use tokio::{net::TcpStream, sync::Semaphore, task::JoinSet, time::timeout};

pub async fn verificar_porta(ip: IpAddr, porta: u16) -> bool {
    let endereco = SocketAddr::new(ip, porta);

    let resultado = timeout(Duration::from_millis(500), TcpStream::connect(endereco)).await;

    matches!(resultado, Ok(Ok(_)))
}

#[tauri::command]
pub async fn port_scanner(app: AppHandle, ip: String) -> Result<Vec<u16>, String> {
    let ip: IpAddr = ip.parse().map_err(|_| format!("IP inválido: {ip}"))?;
    
    let limite_ficha = Arc::new(Semaphore::new(500));
    let mut tarefas:JoinSet<(u16,bool)> = JoinSet::new();

    let mut portas_abertas:Vec<u16> = Vec::new();

    for porta in 1..=u16::MAX {
        let limite_ficha = Arc::clone(&limite_ficha);
        let permissao = limite_ficha.acquire_owned().await.unwrap();

        let app = app.clone();
        tarefas.spawn(async move {
            let _permissao = permissao;
            let aberta = verificar_porta(ip, porta).await;

            if aberta {
                println!("Porta {porta} aberta");

                let _ = app.emit("port-open", porta);
            }

            (porta, aberta)
        });
    }

    while let Some(resultado) = tarefas.join_next().await {
        if let Ok((porta, aberta)) = resultado {
            if aberta {
                portas_abertas.push(porta);
            }
        }
    }

    Ok(portas_abertas)
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::net::TcpListener;

    #[tokio::test]
    async fn detecta_porta_aberta() {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();

        let endereco = listener.local_addr().unwrap();

        let ip = endereco.ip();
        let porta = endereco.port();

        let aberta = verificar_porta(ip, porta).await;

        assert!(aberta);
    }
}
