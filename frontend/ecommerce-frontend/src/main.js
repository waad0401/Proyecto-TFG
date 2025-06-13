import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import { loadConfig } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

(async () => {
  await loadConfig();
  createApp(App).use(createPinia()).use(router).mount('#app');
})();
