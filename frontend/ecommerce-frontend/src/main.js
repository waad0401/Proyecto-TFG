// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import { loadConfig } from './services/api';
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Estilos Bootstrap (npm)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// La app se monta sólo después de cargar config.json
(async () => {
  try {
    await loadConfig();                // ← lee /config.json o usa .env
  } catch (err) {
    console.error('Error cargando configuración', err);
  } finally {
    createApp(App)
      .use(createPinia())
      .use(router)
      .mount('#app');
  }
})();


(async () => {
  await loadConfig();
  createApp(App).use(createPinia()).use(router).mount('#app');
  AOS.init({ once: true, duration: 600, easing: 'ease-out-back' });
})();

