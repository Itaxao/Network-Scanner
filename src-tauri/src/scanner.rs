use clap::Parser;
use std::net::SocketAddr;
use std::net::TcpStream;
use std::thread;
use std::time::Duration;
use std::vec;

#[derive(Parser)]
struct Argumentos {
    ip: String,
}

pub fn port_scanner() {
    let maquina = Argumentos::parse();

    let portas: Vec<u16> = (1_u16..65535).collect();

    for lote in portas.chunks(500) {
        let mut vec_aux = vec![];

        for &porta_atual in lote {
            let endereco_formatado = format!("{}:{}", maquina.ip, porta_atual);
            let handle = thread::spawn(move || {
                // Garante que não vai ter um endereço invalido
                let ipv4_adrr: SocketAddr = match endereco_formatado.parse() {
                    Ok(endereco_validado) => endereco_validado,
                                       Err(_) => panic!("Endereço inexistente ou não acessivível"),
                };
                let duracao = Duration::from_millis(500);

                match TcpStream::connect_timeout(&ipv4_adrr, duracao) {
                    Ok(_) => println!(
                        "Endereço atual {} está com a porta:  {} aberta!",
                        endereco_formatado, porta_atual
                    ),
                    Err(_) => {}
                }
            });

            vec_aux.push(handle);
        }
        for i in vec_aux {
            i.join().unwrap();
        }
    }
}
