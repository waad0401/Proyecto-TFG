#!/bin/bash
set -x
function menu {
echo "------------  MENU   ------------"
echo "---------------------------------"
echo "1. Instalar todas las depencias"
echo "2. Deplegar el proyecto" 
read -p "Introduzca la opcion 1 o 2: " opcion
}
menu

if [[ $opcion == 1 ]]; then
	if [[ $EUID -ne 0 ]]; then 
		echo "Esta parte del script necesitas ejecuarlo con permisos de administrador para poder descargar las depencias"
		exit 1
	fi
	## INSTALACION AWSCLI
	#############################
	echo "Instalacion aws"
	echo "Actualizando los paquetes ..."
	apt update > /dev/null && apt install unzip -y > /dev/null
	rm -rf /tmp/* > /dev/null
	curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
	unzip /tmp/awscliv2.zip -d /tmp
	/tmp/aws/install

	aws configure set region us-east-1
	aws configure set output json
	export AWS_PAGER=""
	echo "Ahora introduce las credenciales de aws"
	aws configure

	## INSTALACION TERRAFORM
	#############################
	echo "Instalacion de terraform"
	echo "Actualizacion de paquetes y dependencias necesarias"
	sudo apt-get update && sudo apt-get install -y gnupg software-properties-common > /dev/null

	# Install the HashiCorp GPG key.
	wget -O- https://apt.releases.hashicorp.com/gpg | \
	gpg --dearmor | \
	sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null

	# Verify the key's fingerprint.
	gpg --no-default-keyring \
	--keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg \
	--fingerprint

	# Add the official HashiCorp repository to your system.
	echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
	https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
	sudo tee /etc/apt/sources.list.d/hashicorp.list

	echo "Instalamos el paquete de terraform "
	#Download the package information from HashiCorp.
	sudo apt update > /dev/null

	# Install Terraform from the new repository.
	sudo apt-get install terraform -y > /dev/null


	## INSTALACION ANSIBLE
	########################################

	echo "Instalacion de ansible "
	apt install ansible -y 

	echo "Ahora instalaremos lo necesario para los certificados"
	sudo apt install -y certbot python3-certbot-dns-cloudflare

	echo "Ahora vaya a '~/.aws/credentials', modifique ese archivo y ponga sus credencias del aws, se espera confimacion, sin lo le creo la carpeta de .aws, 'vuleva a poner aws configure' "
	read -p "Lo ha echo ya?" nosirve
elif [[ $opcion == 2 ]]; then
	if [[ $EUID -eq 0 ]]; then 
		echo "Para esta no lo ejecute como administrador para que solo funcione correctamente"
		exit 1
	fi
	echo "Proceso de instalacion del Proyecto"
	cd terraform/
	terraform init
	terraform apply -auto-approve
	
	echo "Esperamos a que las maquinas empiecen a tomar forma para coger las variables"
	sleep 30
	# Obtenemos y cambiamos las ips de ansible
	private_ip_nfs=$(terraform output --raw private_ip_nfs)
	private_ip_frnt2=$(terraform output --raw private_ip_frontend-02)
	private_ip_frnt1=$(terraform output --raw private_ip_frontend-01)
	private_ip_back=$(terraform output --raw private_ip_backend)
	private_ip_middle=$(terraform output --raw private_ip_middleware)
	public_ip_middle=$(terraform output --raw public_ip_middleware)
	instance_id_01=$(terraform output --raw instance_id_frontend-01)
	instance_id_02=$(terraform output --raw instance_id_frontend-02)
	sg_load_id=$(terraform output --raw sg_loadbalancer_id)
	vpc_id=$(terraform output --raw vpc_default_id)
	subred_1=$(terraform output --json default_subnets_id | awk -F '"'  '/subnet-/{print $2}')
	subred_2=$(terraform output --json default_subnets_id | awk -F '"'  '/subnet-/{print $4}')
	subred_3=$(terraform output --json default_subnets_id | awk -F '"'  '/subnet-/{print $6}')
	subred_4=$(terraform output --json default_subnets_id | awk -F '"'  '/subnet-/{print $8}')
	subred_5=$(terraform output --json default_subnets_id | awk -F '"'  '/subnet-/{print $10}')
	subred_6=$(terraform output --json default_subnets_id | awk -F '"'  '/subnet-/{print $12}')
			
	cd ..
	echo "Sustituimos las variables"
	sed -i "s/# CHANGE_MASTER_1/$private_ip_frnt1/" ansible/inventario/inventario
	sed -i "s/# CHANGE_FRONT_1/$private_ip_frnt1/" ansible/inventario/inventario
	sed -i "s/# CHANGE_FRONT_2/$private_ip_frnt2/" ansible/inventario/inventario
	sed -i "s/# CHANGE_MIDDLE/$private_ip_middle/" ansible/inventario/inventario
	sed -i "s/# CHANGE_MIDDLE/$public_ip_middle/" ansible/vars/vars.yaml

	sed -i "s/# CHANGE_NFS_1/$private_ip_nfs/" ansible/inventario/inventario
	sed -i "s/# CHANGE_NFS_1/$private_ip_nfs/" ansible/vars/vars.yaml
	sed -i "s/# CHANGE_BACK/$private_ip_back/" ansible/inventario/inventario
	sed -i "s/# CHANGE_BACK/$private_ip_back/" ansible/vars/vars.yaml

	echo "Esperamos 2 mins hasta que las maquinas arranquen"
	# sleep 45
	
	# Instalacion de ansible
	ansible-playbook -i ansible/inventario/inventario ansible/main.yaml

	# Creamos la ami para la creacion de imagenes exactas para el auto-scaling
	ami_id=$(aws ec2 create-image --name "AMI-RealOne" --instance-id $instance_id_01 --description "Prueba Creacion de AMI" --output text)

	
	# Segunda parte de la instalacion de ansible
	ansible-playbook -i ansible/inventario/inventario ansible/mainp2.yaml

	# Ahora creamos la plantilla y el  auto-scaling-group
	template_id=$(aws ec2 create-launch-template --launch-template-name TheTemplate \
		--launch-template-data "{ \"ImageId\": \"$ami_id\",\"InstanceType\": \"t2.small\", \"KeyName\": \"vockey\", 
		\"SecurityGroupIds\": [\"$sg_load_id\"],\"TagSpecifications\":[{\"ResourceType\": \"instance\",\"Tags\":[{\"Key\": \"Proyecto\", \"Value\": \"TheProyect\"}]}] }" \
		--query 'LaunchTemplate.[LaunchTemplateId,LaunchTemplateName]' --output text | awk '{ print $1 }')

	# En los siguientes pasos crearemos un Aplication Loadbalancer, un grupo de destino y un listener para que redija el trafico
	load_id=$(aws elbv2 create-load-balancer --name Loadbalancer --subnets $subred_1 $subred_2 $subred_3 $subred_4 $subred_5 $subred_6  --security-groups $sg_load_id \
		--scheme internet-facing --type application --ip-address-type ipv4 --output text  | awk -F ' ' '/arn:/{print $6}')

	target_gp_id=$(aws elbv2 create-target-group --name grupo-destino  --protocol HTTP --port 80 \
		--vpc-id $vpc_id --target-type instance --output text | awk -F ' ' '/arn:/{print $13}' )

	aws elbv2 register-targets \
		--target-group-arn $target_gp_id\
		--targets Id=$instance_id_01 Id=$instance_id_02
	
	aws elbv2 create-listener \
		--load-balancer-arn "$load_id" \
		--protocol HTTP \
		--port 80 \
		--default-actions Type=forward,TargetGroupArn="$target_gp_id"


	aws autoscaling create-auto-scaling-group --auto-scaling-group-name Grupo-AutoScaling --launch-template LaunchTemplateId=$template_id \
		--min-size 1 --max-size 3 --desired-capacity 2 --vpc-zone-identifier "$subred_1,$subred_2,$subred_3,$subred_4,$subred_5,$subred_6" --health-check-type EC2 \
		--health-check-grace-period 300 --target-group-arns "$target_gp_id" \
		--tags "ResourceId=Grupo-AutoScaling,ResourceType=auto-scaling-group,Key=Entorno,Value=Produccion,PropagateAtLaunch=true"

	auto_gp_id=$(aws autoscaling describe-auto-scaling-groups --output text | awk -F ' ' '/arn:/{print $2}')

	echo "Registre loadbalancer como CNAME : $load_id "

	# Ahora pedimos que el usuario reistre el dominio y cree un 
	while [[ $confirmacion != 'Y' ]]; do
		echo "Debe registrar este nombre de domininio antes de continuar y delegarlo a cloudflare"
		read -p "Introduzaca 'Y' cuando lo haya realizado :" confirmacion
	done

	mkdir -p ~/.secrets
	touch ~/.secrets/cloudflare.ini

	read -p "Introduzca porfavor su token de cloudflare: " token
	echo "dns_cloudflare_api_token = $token" > ~/.secrets/cloudflare.ini
	chmod 600 ~/.secrets/cloudflare.ini
	
	
	echo "-----------------------------------------------------"
	read -p "Introduzca el coreo asignado a cloudflare: " correo
	
	
	echo "-----------------------------------------------------"
	read -p "Ahora introduzca el nombre de dominio: " dominio

	sudo certbot certonly \
	--dns-cloudflare \
	--dns-cloudflare-credentials "/home/ubuntu/.secrets/cloudflare.ini" \
	-d "$dominio" -d "*.$dominio" \
	--dns-cloudflare-propagation-seconds 60 \
	--preferred-challenges dns \
	--agree-tos \
	--non-interactive \
	--email "$correo"

	if [ -f "/etc/letsencrypt/live/$dominio/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/$dominio/privkey.pem" ]; then
	echo "Certificado obtenido correctamente para $dominio"
	else
	echo "Error: No se encontraron los archivos de certificado en /etc/letsencrypt/live/$dominio/" >&2
	exit 1
	fi

	REGION="us-east-1"
	CERT_DIR="/etc/letsencrypt/live/$dominio"
	FULLCHAIN="$CERT_DIR/fullchain.pem"
	PRIVKEY="$CERT_DIR/privkey.pem"
	CHAIN="$CERT_DIR/chain.pem"

	# 1. Importar certificado en ACM
	CERT_ARN=$(aws acm import-certificate \
	--certificate fileb://"$FULLCHAIN" \
	--private-key fileb://"$PRIVKEY" \
	--certificate-chain fileb://"$CHAIN" \
	--region "$REGION" \
	--query CertificateArn --output text) \
	&& echo "Certificado importado en ACM: $CERT_ARN" \
	|| { echo "Error importando certificado en ACM" >&2; exit 1; }

	# Obtener ARN del ALB
	LB_ARN=$(aws elbv2 describe-load-balancers \
	--region "$REGION" \
	--query "LoadBalancers[0].LoadBalancerArn" \
	--output text) \
	&& echo "ARN del" \
	|| { echo "Error obteniendo ARN del ALB" >&2; exit 1; }

	# Obtener ARN del listener HTTPS (puerto 443)
	LISTENER_ARN=$(aws elbv2 describe-listeners \
	--load-balancer-arn "$LB_ARN" \
	--region "$REGION" \
	--query "Listeners[?Protocol=='HTTPS'].ListenerArn" \
	--output text) \
	&& echo "ARN del listener HTTPS: $LISTENER_ARN" \
	|| { echo "Error obteniendo ARN del listener HTTPS" >&2; exit 1; } 

	# Modificar listener para usar el nuevo certificado
	aws elbv2 modify-listener \
	--listener-arn "$LISTENER_ARN" \
	--certificates CertificateArn="$CERT_ARN" \
	--region "$REGION" \
	&& echo "Listener HTTPS actualizado con el nuevo certificado" \
	|| { echo "Error actualizando listener HTTPS" >&2; exit 1; }

else
	echo "No entendi la respuesta vuelva a ejecutarlo"
fi