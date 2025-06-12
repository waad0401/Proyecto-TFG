docker compose up -d - iniciamos el servicio
docker compose dowm -v  - borramos los contenedores y los volumenes
para añadir la bd al cluster
sudo docker exec -i mysql1 mysql -uadmin -pcositaslindas < script.sql