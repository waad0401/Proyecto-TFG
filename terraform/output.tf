output "private_ip_nfs" {
  value = aws_instance.nfs.private_ip
}

output "private_ip_frontend-02" {
  value = aws_instance.frontend-02.private_ip
}


output "private_ip_frontend-01" {
  value = aws_instance.frontend-01.private_ip
}

output "private_ip_backend" {
  value = aws_instance.backend.private_ip
}


output "instance_id_frontend" {
  value = aws_instance.frontend-02.id
}
