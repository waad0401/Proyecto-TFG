# Vue 3 + Vite
```
delichoc3d-frontend/
├── public/
│   ├── index.html         # Punto de entrada HTML de la SPA
│   ├── config.json        # Configuración runtime (URLs de API e imágenes)
│   └── .htaccess          # Reglas de servidor para history-mode y MIME
├── src/
│   ├── main.js            # Bootstrapping: carga config, monta App
│   ├── App.vue            # Layout global: Navbar + transición de vistas
│   ├── router/
│   │   └── index.js       # Definición de rutas y guardas de autenticación
│   ├── store/
│   │   ├── auth.js        # Store Pinia para manejo de sesión (JWT, user)
│   │   └── cart.js        # Store Pinia para carrito (fetch, add, remove)
│   ├── services/
│   │   └── api.js         # Instancia Axios con interceptores y carga de config
│   ├── components/        # Componentes reutilizables
│   │   ├── Navbar.vue
│   │   ├── ProductList.vue
│   │   ├── ProductDetail.vue
│   │   ├── Cart.vue
│   │   ├── Checkout.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   └── OrderHistory.vue
│   └── views/             # Páginas completas (opcionalmente usan components)
│       ├── Home.vue
│       └── About.vue
├── .env.development       # Variables de entorno para modo dev (VITE_*)
├── .env.production        # Variables de entorno para modo prod
├── package.json           # Dependencias y scripts npm
└── vite.config.js         # Configuración de Vite (alias, proxy, build)
```

## Dentro de public/
### index.html
Archivo HTML principal, este contiene <div id="app"></div> para que VUE monte la app , este tambien debe incluir una referencia el archivo javascriot principal **src/main-js**

### config.json
Archivo globar donde debes indicar la ruta donde a hacer las consultas a la api disitintas maneras de hacerlo
1º Manera, este caso debes tener un proxy inverso en tu frontend para que te rediriga las consultas a la api por tu frontend
```json
    {
    "apiBaseUrl": "/api",
    "imageBaseUrl": "/images"
    }
```
2º Manera, la empleada, esta manera rediriges la consutla de la api directamente al middleware
```json

    {
    "apiBaseUrl": "http:/ipmaquina/api",
    "imageBaseUrl": "/images"
    }
```
Este archivo luego se importa, en tiempo de ejecucion mediante un fech para cargar la configuraciones deseadas

###  .htaccess
Para este archivo necesitamos tener muy importante habilidado el modulo de rewrite y en el que hacer que nos devuelva las peticiones en vez de formato 'text/html' a 'aplication/javascript', porque es necesario porque simplemente la app no lo lee corectamente y busca otros archivos en su lugar el index-(hash).js , este has se generado aleatorio con la compilacion, que es convirtiendo los archivos .vue en archivos que pueden mostrar en un apache/ngix

```javascript
npm run build
```
## Bootstrap de la App
### src/main.js
Este archivo sirve para montar todo lo necesario , cargar la configuracion de nuestro config a las variables correspondientes en los distintos componentes

### src/services/api.js
Este archivo se encarga de toda la logica de gestion de nuestro JWT

## Stores
Estos archivos se encargan de la gestion propiamente dicha del la pagina la parte del login son a los que llamos los otros archivos
- src/store/auth.js , se encarga de la gestion de token del usuario, eliminarla cuando pasen 3 dias o haga log out, cargar el carrito debido a que tienes que estar autenticado para que te lo carge
- src/store/cart.js, este se encarga de la gestion del carrito eliminar productos, redirigirte al login sin no estas autenticado

## Componentes
Son las plantillas que vamos moviendo a nuestro gusto con forme navegamos entre la pagina solo llaman a las funciones relevante anteriormente mencionada pero no tienen otro papel fundamente exceptuando el de mostrar el contenido y llamar a las funciones

## vite.config.js
Este es un archivo de configuracion general, especificar alias por ejemplos que envez de poner toda la ruta con poner **@**/ruta no tienes que navegar entre los directorios, configuracion de ese estilo nada relevante pero importante a su vez porque debe existir al menos con la configuracion base, que se te genera cuando crear un nuevo proyecto
