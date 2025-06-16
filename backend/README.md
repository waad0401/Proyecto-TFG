## Cluster de mysql
Es un cluster de mysql , con la imgen de cluster que debido a ciertas limitacion no podemos hacer que añada directamente las bases de datos empeamos el siguiente metodo no es el mas seguro pero comple su funcion
```bash
sudo docker exec -i mysql1 mysql -uadmin -pcositaslindas < script.sql
```
Para iniciar el servido de docker bastara con poner:  
```bash
docker compose up -d - iniciamos el servicio en segundo plano
```
Y este caso es para borrar los los contenedores y sus corespondiente volumentes
```bash
docker compose down -v  - borramos los contenedores y los volumenes
```
