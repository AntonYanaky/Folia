// src-tauri/src/main.rs

// This line prevents a console window from showing up on Windows in release mode.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// --- FIX: Import both Manager and Listener traits ---
use tauri::{Listener, Manager};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            if let Some(main_window) = app.get_webview_window("main") {
                let window_clone = main_window.clone();

                main_window.listen("frontend-ready", move |_event| {
                    println!("Frontend is ready, showing window.");
                    window_clone.show().unwrap();
                    window_clone.set_focus().unwrap();
                });
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}