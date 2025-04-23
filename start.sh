#!/bin/bash

if [[ $EUID -ne 0 ]]; then 
	echo "Este script solo se puede ejecutar con sudo o como root"
	exit 1
fi

########################################
########################################
#####				   #####
#####	Instalacion AWS CLI	   #####
#####				   #####
########################################
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


########################################
########################################
#####                              #####
#####          Terraform           #####
#####                              #####
########################################
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
########################################
#####                              #####
#####          Ansible	           #####
#####                              #####
########################################
########################################

echo "Instalacion de ansible "
apt install ansible -y > /dev/null
