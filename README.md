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

Cuenta dns
mmb18963@toaik.com