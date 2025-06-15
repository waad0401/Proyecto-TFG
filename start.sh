#!/bin/bash
set -x
if [[ $EUID -ne 0 ]]; then 
	echo "Este script solo se puede ejecutar con sudo o como root"
	exit 1
fi
read -p "Tiene el aws descargado y configurado?(y/n): " respuesta
if [[ $respuesta == 'n' ]]; then 
########################################
#####	Instalacion AWS CLI	   #####
########################################

	echo "Instalacion casi de atendida solo se necesitan para aws que es ahora , se espera confirmacion de que lo a entendido"
	read p
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
	echo "Ahora vaya a '~/.aws/credentials', modifique ese archivo y ponga sus credencias del aws, se espera confimacion "
	read -p "Introduzaca 'Y' cuando lo haya realizado :" confirmacion
elif [[ $respuesta == 'y' ]]; then

	########################################
	#####          Terraform           #####
	########################################


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


	########################################
	#####          Ansible	           #####
	########################################

	echo "Instalacion de ansible "
	apt install ansible -y 

	# ###################################################

	cd terraform/
	terraform init
	terraform apply -auto-approve

	# Obtenemos y cambiamos las ips de ansible
	private_ip_nfs=$(terraform output --raw private_ip_nfs)
	private_ip_frnt2=$(terraform output --raw private_ip_frontend-02)
	private_ip_frnt1=$(terraform output --raw private_ip_frontend-01)
	private_ip_back=$(terraform output --raw private_ip_backend)
	private_ip_middle=$(terraform output --raw private_ip_middleware)
	instance_id_01=$(terraform output --raw instance_id_frontend-01)
	instance_id_02=$(terraform output --raw instance_id_frontend-02)
	sg_load_id=$(terraform output --raw sg_loadbalancer_id)
	vpc_id=$(terraform output --raw vpc_default_id)
	subred_1=$(terraform output --json default_subnets_id | awk -F '"'  '/subnet-/{print $2}')
	subred_2=$(terraform output --json default_subnets_id | awk -F '"'  '/subnet-/{print $6}')

	cd ..
	sed -i "s/# CHANGE_MASTER_1/$private_ip_frnt1/" ansible/inventario/inventario
	sed -i "s/# CHANGE_FRONT_1/$private_ip_frnt1/" ansible/inventario/inventario
	sed -i "s/# CHANGE_FRONT_2/$private_ip_frnt2/" ansible/inventario/inventario
	sed -i "s/# CHANGE_MIDDLE/$private_ip_middle/" ansible/inventario/inventario
	sed -i "s/# CHANGE_MIDDLE/$private_ip_middle/" ansible/vars/vars.yaml

	sed -i "s/# CHANGE_NFS_1/$private_ip_nfs/" ansible/inventario/inventario
	sed -i "s/# CHANGE_NFS_1/$private_ip_nfs/" ansible/vars/vars.yaml
	sed -i "s/# CHANGE_BACK/$private_ip_back/" ansible/inventario/inventario
	sed -i "s/# CHANGE_BACK/$private_ip_back/" ansible/vars/vars.yaml

	# Instalacion de ansible
	ansible-playbook -i ansible/inventario/inventario ansible/main.yaml

	# Creamos la ami para la creacion de imagenes exactas para el auto-scaling
	ami_id=$(aws ec2 create-image --name "AMI-RealOne" --instance-id $instance_id_01 --description "Prueba Creacion de AMI" --output text)

	
	
	ansible-playbook -i ansible/inventario/inventario ansible/mainp2.yaml


	# En los siguientes pasos crearemos un Aplication Loadbalancer, un grupo de destino y un listener para que redija el trafico
	load_id=$(aws elbv2 create-load-balancer --name Loadbalancer --subnets $subred_1 $subred_2 --security-groups $sg_load_id \
		--scheme internet-facing --type application --ip-address-type ipv4 --output text  | awk -F ' ' '/arn:/{print $6}')


	# Ahora creamos la plantilla y el  auto-scaling-group
	template_id=$(aws ec2 create-launch-template --launch-template-name TheTemplate \
	--launch-template-data "{ \"ImageId\": \"$ami_id\",\"InstanceType\": \"t2.small\", \"KeyName\": \"vockey\", 
	\"SecurityGroupIds\": [\"$sg_load_id\"],\"TagSpecifications\":[{\"ResourceType\": \"instance\",\"Tags\":[{\"Key\": \"Proyecto\", \"Value\": \"TheProyect\"}]}] }" \
	--query 'LaunchTemplate.[LaunchTemplateId,LaunchTemplateName]' --output text | awk '{ print $1 }')

	aws autoscaling create-auto-scaling-group --auto-scaling-group-name Grupo-AutoScaling --launch-template LaunchTemplateId=$template_id \
		--min-size 1 --max-size 3 --desired-capacity 2 --vpc-zone-identifier "$subred_1,$subred_2" --health-check-type EC2 \
		--health-check-grace-period 300 --target-group-arns $target_gp_id \
		--tags "ResourceId=Grupo-AutoScaling,ResourceType=auto-scaling-group,Key=Entorno,Value=Produccion,PropagateAtLaunch=true"

	auto_gp_id=$(aws autoscaling describe-auto-scaling-groups --output text | awk -F ' ' '/arn:/{print $2}')

	# Ahora pedimos que el usuario reistre el dominio y cree un 
	while [[ $confirmacion != 'Y' ]]; do
		echo "Debe registrar este nombre de domininio antes de continuar"
		read -p "Introduzaca 'Y' cuando lo haya realizado :" confirmacion
	done
	sudo apt install certbot -y 
	read -p "Introduzca el nombre de dominio que ha registrado" DOMINIO
	REGION="eu-west-1"                 # ← MODIFICABLE: región de AWS

	# Ruta donde se guardará temporalmente el certificado
	DIRECTORIO_CERT="/etc/letsencrypt/live/$DOMINIO"

	# ===== FUNCIÓN: Solicitar certificado con Certbot (modo manual DNS) =====
	echo "▶ Solicitando certificado SSL para $DOMINIO con Certbot..."
	certbot certonly --manual --preferred-challenges dns -d "$DOMINIO"

	if [ $? -ne 0 ]; then
	echo "❌ Error durante la generación del certificado."
	exit 1
	fi

	echo "Certificado generado correctamente."
	echo "Ruta del certificado: $DIRECTORIO_CERT"

	# ===== FUNCIÓN: Subir el certificado a ACM =====
	echo "▶ Subiendo certificado a AWS ACM..."

	certificate_id=$(aws acm import-certificate \
	--certificate "fileb://$DIRECTORIO_CERT/cert.pem" \
	--private-key "fileb://$DIRECTORIO_CERT/privkey.pem" \
	--certificate-chain "fileb://$DIRECTORIO_CERT/fullchain.pem" \
	--region "$REGION" \
	--query CertificateArn --output text)

	if [ -z "$certificate_id" ]; then
	echo " Fallo en la subida del certificado a ACM."
	exit 1
	fi

	target_gp_id=$(aws elbv2 create-target-group --name grupo-destino  --protocol HTTP --port 80 \
		--vpc-id $vpc_id --target-type instance --output text | awk -F ' ' '/arn:/{print $13}' )

	aws elbv2 create-listener \
	--load-balancer-arn $load_id \
	--protocol HTTP \
	--port 80 \
	--default-actions Type=redirect,RedirectConfig='{"Protocol":"HTTPS","Port":"443","StatusCode":"HTTP_301"}'


	aws elbv2 create-listener --load-balancer-arn $load_id --protocol HTTPS -port 443 --certificates CertificateArn=$certificate_id \
	--default-actions Type=forward,TargetGroupArn=$target_gp_id
else
	echo "No entendi la respuesta vuelva a ejecutarlo"
fi