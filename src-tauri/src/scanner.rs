use std::{
    net::{SocketAddr, TcpStream},
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};
#[tauri::command]
pub fn port_scanner(ip: String) -> Vec<u16> {
    let portas_abertas = Arc::new(Mutex::new(Vec::new()));

    let mut handles = Vec::new();

    let portas: Vec<u16> = (1..=u16::MAX).collect();

    for lote in portas.chunks(500) {
        let lote = lote.to_vec();

        let ip_clone = ip.clone();

        let portas_abertas_clone = Arc::clone(&portas_abertas);

        let handle = thread::spawn(move || {
            for porta_atual in lote {
                let endereco_formatado =
                    format!("{}:{}", ip_clone, porta_atual);

                let ipv4_addr: SocketAddr =
                    match endereco_formatado.parse() {
                        Ok(endereco) => endereco,
                        Err(_) => continue,
                    };

                let duracao = Duration::from_millis(500);

                if TcpStream::connect_timeout(
                    &ipv4_addr,
                    duracao
                )
                .is_ok()
                {
                    portas_abertas_clone
                        .lock()
                        .unwrap()
                        .push(porta_atual);
                }
            }
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    let mut resultado =
        portas_abertas.lock().unwrap().clone();

    resultado.sort();

    resultado
}