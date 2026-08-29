// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod scanner;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            scanner::port_scanner
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
