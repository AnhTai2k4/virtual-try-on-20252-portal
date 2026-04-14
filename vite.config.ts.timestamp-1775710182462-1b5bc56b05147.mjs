// vite.config.ts
import { defineConfig } from "file:///D:/HUST/Intern/OE/shopify/virtual-try-on-20252-portal/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/HUST/Intern/OE/shopify/virtual-try-on-20252-portal/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import svgLoader from "file:///D:/HUST/Intern/OE/shopify/virtual-try-on-20252-portal/node_modules/vite-svg-loader/index.js";
import path from "path";
import tailwindcss from "file:///D:/HUST/Intern/OE/shopify/virtual-try-on-20252-portal/node_modules/@tailwindcss/vite/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\HUST\\Intern\\OE\\shopify\\virtual-try-on-20252-portal";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    tailwindcss()
  ],
  define: {
    "process.env": {}
  },
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "./node_modules"),
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@icons": path.resolve(__vite_injected_original_dirname, "./node_modules/@shopify/polaris-icons/dist/svg")
    }
  },
  server: {
    // https://github.com/vitejs/vite/issues/4259
    hmr: {
      protocol: "ws",
      host: "localhost"
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/main.ts"),
      name: "Scaffolding portal",
      fileName: () => "portal.js",
      formats: ["umd"]
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxIVVNUXFxcXEludGVyblxcXFxPRVxcXFxzaG9waWZ5XFxcXHZpcnR1YWwtdHJ5LW9uLTIwMjUyLXBvcnRhbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcSFVTVFxcXFxJbnRlcm5cXFxcT0VcXFxcc2hvcGlmeVxcXFx2aXJ0dWFsLXRyeS1vbi0yMDI1Mi1wb3J0YWxcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0hVU1QvSW50ZXJuL09FL3Nob3BpZnkvdmlydHVhbC10cnktb24tMjAyNTItcG9ydGFsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJyAvLyAxLiBJbXBvcnQgcGx1Z2luIG1cdTFFREJpXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgc3ZnTG9hZGVyKCksXHJcbiAgICB0YWlsd2luZGNzcygpLCBcclxuICBdLFxyXG4gIGRlZmluZToge1xyXG4gICAgJ3Byb2Nlc3MuZW52Jzoge30sXHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnfic6ICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9ub2RlX21vZHVsZXMnKSxcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgICAgJ0BpY29ucyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL25vZGVfbW9kdWxlcy9Ac2hvcGlmeS9wb2xhcmlzLWljb25zL2Rpc3Qvc3ZnJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUvaXNzdWVzLzQyNTlcclxuICAgIGhtcjoge1xyXG4gICAgICBwcm90b2NvbDogJ3dzJyxcclxuICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY3NzOiB7XHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBhcGk6ICdtb2Rlcm4tY29tcGlsZXInXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXHJcbiAgICBsaWI6IHtcclxuICAgICAgZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbWFpbi50cycpLFxyXG4gICAgICBuYW1lOiAnU2NhZmZvbGRpbmcgcG9ydGFsJyxcclxuICAgICAgZmlsZU5hbWU6ICgpID0+ICdwb3J0YWwuanMnLFxyXG4gICAgICBmb3JtYXRzOiBbJ3VtZCddLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcblxyXG5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VixTQUFTLG9CQUFvQjtBQUMxWCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGlCQUFpQjtBQUp4QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZUFBZSxDQUFDO0FBQUEsRUFDbEI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQU0sS0FBSyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLE1BQzlDLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyxVQUFVLEtBQUssUUFBUSxrQ0FBVyxnREFBZ0Q7QUFBQSxJQUNwRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQTtBQUFBLElBRU4sS0FBSztBQUFBLE1BQ0gsVUFBVTtBQUFBLE1BQ1YsTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxjQUFjO0FBQUEsSUFDZCxLQUFLO0FBQUEsTUFDSCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDNUMsTUFBTTtBQUFBLE1BQ04sVUFBVSxNQUFNO0FBQUEsTUFDaEIsU0FBUyxDQUFDLEtBQUs7QUFBQSxJQUNqQjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sc0JBQXNCO0FBQUEsTUFDeEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
