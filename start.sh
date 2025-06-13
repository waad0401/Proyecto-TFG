#!/bin/bash
set -x
if [[ $EUID -ne 0 ]]; then 
	echo "Este script solo se puede ejecutar con sudo o como root"
	exit 1
fi

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

aws configure set region us-ea



aws configure set output json
export AWS_PAGER=""
echo "Ahora introduce las credenciales de aws"
aws configure


echo "Ahora vaya a '~/.aws/credentials', modifique ese archivo y ponga sus credencias del aws, se espera confimacion "
while [[ $confirmacion != 'yes' ]]; do
        read -p "Introduzaca 'yes' cuando lo haya realizado :" confirmacion
done


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
apt install ansible -y > /dev/null

###################################################
#!/bin/bash
set -x
cd terraform/
terraform init
terraform apply -auto-approve
# Now we change the ips of the Ansible invetory
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

# # Now proceed with the ansible instalation
ansible-playbook -i ansible/inventario/inventario ansible/main.yaml

# Now we need create the new ami with the frontend content
ami_id=$(aws ec2 create-image --name "AMI-RealOne" --instance-id $instance_id_01 --description "Prueba Creacion de AMI" --output text)

# En los siguientes pasos crearemos un Aplication Loadbalancer, un grupo de destino y un listener para que redija el trafico
load_id=$(aws elbv2 create-load-balancer --name Loadbalancer --subnets $subred_1 $subred_2 --security-groups $sg_load_id \
	--scheme internet-facing --type application --ip-address-type ipv4 --output text  | awk -F ' ' '/arn:/{print $6}')

target_gp_id=$(aws elbv2 create-target-group --name grupo-destino  --protocol HTTP --port 80 \
	--vpc-id $vpc_id --target-type instance --output text | awk -F ' ' '/arn:/{print $13}' )
certificate_id=$(aws acm request-certificate --domain-name www.paginapruebatfg.com --validation-method DNS \
	--options CertificateTransparencyLoggingPreference=ENABLED --output text | awk '{ print $1 }')

aws elbv2 create-listener --load-balancer-arn $load_id --protocol HTTPS -port 443 --certificates CertificateArn=$certificate_id \
  --default-actions Type=forward,TargetGroupArn=$target_gp_id


# Now we proceed to create a launch-template and the auto-scaling-group

template_id=$(aws ec2 create-launch-template --launch-template-name TheTemplate \
  --launch-template-data "{ \"ImageId\": \"$ami_id\",\"InstanceType\": \"t2.small\", \"KeyName\": \"vockey\", 
  \"SecurityGroupIds\": [\"$sg_load_id\"],\"TagSpecifications\":[{\"ResourceType\": \"instance\",\"Tags\":[{\"Key\": \"Proyecto\", \"Value\": \"TheProyect\"}]}] }" \
  --query 'LaunchTemplate.[LaunchTemplateId,LaunchTemplateName]' --output text | awk '{ print $1 }')

aws autoscaling create-auto-scaling-group --auto-scaling-group-name Grupo-AutoScaling --launch-template LaunchTemplateId=$template_id \
	--min-size 1 --max-size 3 --desired-capacity 2 --vpc-zone-identifier "$subred_1,$subred_2" --health-check-type EC2 \
	--health-check-grace-period 300 --target-group-arns $target_gp_id \
	--tags "ResourceId=Grupo-AutoScaling,ResourceType=auto-scaling-group,Key=Entorno,Value=Produccion,PropagateAtLaunch=true"

auto_gp_id=$(aws autoscaling describe-auto-scaling-groups --output text | awk -F ' ' '/arn:/{print $2}')

echo "Debe registrar este nombre de domininio antes de continuar"