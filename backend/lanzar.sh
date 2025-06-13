docker compose up -d
sudo docker exec mysql1 sh -c 'mysql -u admin -ppa < script.sql'