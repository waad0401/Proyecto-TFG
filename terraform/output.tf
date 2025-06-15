# Datos necesarios para la automatizacion del despliegue
output "private_ip_nfs" {
  value = aws_instance.nfs.private_ip
}

output "private_ip_frontend-02" {
  value = aws_instance.frontend-02.private_ip
}

output "private_ip_middleware" {
  value = aws_instance.middleware.private_ip
}

output "public_ip_middleware" {
  value = aws_eip.ip_elastica.public_ip
}

output "private_ip_frontend-01" {
  value = aws_instance.frontend-01.private_ip
}

output "private_ip_backend" {
  value = aws_instance.backend.private_ip
}


output "instance_id_frontend-02" {
  value = aws_instance.frontend-02.id
}

output "instance_id_frontend-01" {
  value = aws_instance.frontend-01.id
}

output "sg_loadbalancer_id" {
  value = aws_security_group.loadbalancer.id
}


output "vpc_default_id" {
  value = data.aws_vpc.default.id
}

output "default_subnets_id" {   
  value = data.aws_subnets.default.ids
}

