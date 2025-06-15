docker-compose up -d
sleep 30
sudo docker exec -i mysql1 mysql -uadmin -pa < script.sql