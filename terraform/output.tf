output "elastic_ip" {
  value = aws_eip.ip_elastica.public_ip
}

output "private_ip_nfs" {
  value = aws_instance.nfs.private_ip
}
