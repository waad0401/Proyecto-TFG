#!/bin/bash
set -ex
cd terraform/
instance_id=$(terraform output --raw instance_id_frontend)

cd ..
echo "$instance_id"
aws ec2 create-image --name "AMI-COSITASLINDAS" --instance-id $instance_id --description "Prueba Creacion de AMI" --output text
