let
  pkgs = import <nixpkgs> {};
in
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    pkg-config
    gobject-introspection
  ];
  buildInputs = with pkgs; [
    cargo
    rustc
    nodejs
    glib
    gtk3
    webkitgtk_4_1
    librsvg
  ];
}
