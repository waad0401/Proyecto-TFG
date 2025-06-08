# PR

Para sacar el private ip y meterlo en una variable use lo siguiente:
```
$ip_nfs = $(terraform output --raw private_ip_nfs)
```
La salida de eso es solo la ip privada del NFS server, se puede aplicar de la misma manera dependiendo del lo que tengas en el **outputs.tf** de terraform, alamacena como una especie de datos y los puedes llamar cuando quieras y dale el formato deseado

## COSAS POR HACER
[x] Terraform
[] Ansible
[]	├─ deploy_backend.yaml
[]	├─ deploy_frontend.yaml
[]	├─ install_backend.yaml 
[x]	├─ install_frontend.yaml
[x]	├─ plantilla.yaml
[x]	├─ setup_nfs_client.yaml
[x]	└─ setup_nfs_server.yaml

[] Script Automatizacion
[] La pagina Web
[] El backend
[] Loadbalancer y grupo destino
[] El AUTO-SCALING


para instalar el angular: npm install -g @angular/cli


sudo apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs
node -v
Info sacada de aqui: https://github.com/nodesource/distributions/blob/master/README.md


Para iniciar el proyecto 
ng new ecommers \
  --routing=true \                # Crea AppRoutingModule para gestionar rutas  
  --style=scss \                  # Usa SCSS en lugar de CSS (mejor modularidad y variables)  
  --strict=true \                 # Activa el modo estricto de compilación y plantillas  
  --prefix=ec \                   # Prefijo “ec” para todos los selectores (<ec-*> en lugar de <app-*>)  
  --inline-style=false \          # Mantén los ficheros .scss externos (no incrustados)  
  --inline-template=false \       # Mantén los ficheros .html externos  
  --skip-tests=false \            # Genera ficheros de test (Karma/Jasmine)  
  --skip-git=false \              # Inicializa un repositorio Git automáticamente  
  --package-manager=npm   


Hay que instalar el bootstrap y luego en el angular.json hay que tenerlo asi
```json
"styles": [
  "src/styles.css",
  "node_modules/bootstrap/dist/css/bootstrap.min.css"
],
```

para instalarlo se necesita
```shell
npm install bootstrap --save
```
-----
-----
-----
para instalar todas las dependias usar 
```shell
npm install
```
-----
-----
EXPLIACION DE ESTA PARTE
¿Qué sucede al ejecutar npm install bootstrap --save?
Cuando escribes npm install bootstrap --save, npm realiza dos acciones principales: descarga e instala la librería Bootstrap en la carpeta local node_modules/ de tu proyecto, y además añade automáticamente la dependencia a la sección "dependencies" de tu archivo package.json para que quede registrada 
stackoverflow.com
.

Paralelamente, npm actualiza (o crea) el package-lock.json que captura el árbol exacto de dependencias instalado, de modo que futuras instalaciones reproduzcan la misma versión y estructura de módulos 
docs.npmjs.com
.

¿Y al mover el proyecto a otra máquina?
node_modules/ no suele versionarse: esa carpeta, que contiene todo el código de Bootstrap (y demás paquetes), normalmente está listada en .gitignore, por lo que no se comparte por defecto en tu repositorio. 
reddit.com

Al clonar o copiar el proyecto en otro equipo, sólo tendrás los archivos package.json y package-lock.json. Para reinstalar todas las dependencias (incluyendo Bootstrap) basta con ejecutar npm install, que leerá esos ficheros y descargará lo necesario automáticamente, sin que tengas que instalar cada paquete por separado 
docs.npmjs.com

-----
-----
-----

## Core  
Módulo que agrupa servicios y configuraciones que deben instanciarse una sola vez en toda la aplicación.  
- **CoreModule**: importarlo **únicamente** en `AppModule`, nunca en otros módulos.  
- **Servicios singleton** (AuthService, LoggerService, ConfigService) y **error handlers** globales (p. ej. un `HttpErrorInterceptor`) se declaran aquí. :contentReference[oaicite:0]{index=0}  

## Guards  
Controlan el acceso a rutas según la lógica de negocio o estado de la aplicación.  
- **AuthGuard**: bloquea rutas protegidas (`/cart`, `/orders`) si el usuario no está autenticado.  
- **AdminGuard** (opcional): solo permite usuarios con rol de administrador en determinadas rutas.  
- **CanDeactivateGuard** (opcional): evita que el usuario abandone un formulario con cambios no guardados. :contentReference[oaicite:1]{index=1}  

## Interceptors  
Interceptores HTTP que se ejecutan antes o después de cada petición para aplicar comportamientos transversales.  
- **TokenInterceptor**: añade el header `Authorization: Bearer <token>` a todas las peticiones.  
- **LoadingInterceptor** (opcional): muestra un spinner de carga mientras esperan las respuestas.  
- **ErrorInterceptor** (opcional): captura errores globales (401, 500…) y muestra notificaciones o redirige. :contentReference[oaicite:2]{index=2}  

## Models  
Interfaces TypeScript que definen las entidades de dominio, separan la forma de los datos de la lógica.  
- **User.ts**: `{ id, name, email, exp }` (expiración del JWT).  
- **Product.ts**: `{ id, name, description, price, stock, imageUrl? }`.  
- **CartItem.ts**: `{ product: Product, quantity: number }`.  
- **Order.ts**: `{ id, items: CartItem[], total, date, status }`. :contentReference[oaicite:3]{index=3}  

## Services  
Clases que usan `HttpClient` para encapsular llamadas a la API y lógica de negocio.  
- **AuthService**: métodos `login()`, `register()`, `logout()`, `isAuthenticated()`.  
- **ProductService**: `getAll()`, `getById()`.  
- **CartService**: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`.  
- **OrderService**: `placeOrder()`, `getUserOrders()`.  
- **NotificationService** (opcional): toasts o alerts globales. :contentReference[oaicite:4]{index=4}  

## Shared  
Módulo para componentes, directivas y pipes reutilizables en toda la app.  
- **SharedModule**: declara y exporta elementos compartidos.  
- **Componentes genéricos**: `SpinnerComponent`, `ModalComponent`, `AlertComponent`.  
- **Directivas**: `HighlightDirective`, `AutoFocusDirective`.  
- **Pipes**: `DateAgoPipe`, `CurrencyCustomPipe`. :contentReference[oaicite:5]{index=5}  

-----
-----
para crear los componentes se ha usado el 
```
ng generate component components/navbar
```
Los archivos generados , el .spec.ts es el archivos para los test