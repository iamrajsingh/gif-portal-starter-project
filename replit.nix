{ pkgs }: {
    deps = [
      pkgs.nodejs
      pkgs.nodejs-16_x
      pkgs.import { defineConfig } from "vite";
      pkgs.nodejs-16_x
          pkgs.nodePackages.typescript-language-server
          pkgs.yarn
          pkgs.replitPackages.jest
    ];
  }