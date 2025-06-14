import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { loadConfig } from './services/api';

(async () => {
  await loadConfig();
  createApp(App)
    .use(createPinia())
    .use(router)
    .mount('#app');
  AOS.init({ once: true, duration: 600, easing: 'ease-out-back' });  //animacion
})();
