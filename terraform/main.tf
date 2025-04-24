provider "aws" {
  region = var.region
}

# Creacion de los grupos de seguridad
resource "aws_security_group" "frontend" {
  name        = var.sg_frontend
  description = var.sg_description
}
resource "aws_security_group" "loadbalancer" {
  name        = var.sg_loadbalancer
  description = var.sg_description
}
resource "aws_security_group" "nfs" {
  name        = var.sg_nfs
  description = var.sg_description
}
resource "aws_security_group" "backend" {
  name        = var.sg_backend
  description = var.sg_description
}

# Añadimos las reglas para los grupos de seguridad
resource "aws_security_group_rule" "ingress_frontend" {
  security_group_id = aws_security_group.frontend.id
  type              = "ingress"

  count       = length(var.Puerto_frontend)
  from_port   = var.Puerto_frontend[count.index]
  to_port     = var.Puerto_frontend[count.index]
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ingress_backend" {
  security_group_id = aws_security_group.backend.id
  type              = "ingress"

  count       = length(var.Puerto_backend)
  from_port   = var.Puerto_backend[count.index]
  to_port     = var.Puerto_backend[count.index]
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ingress_loadbalancer" {
  security_group_id = aws_security_group.loadbalancer.id
  type              = "ingress"

  count       = length(var.Puerto_loadbalancer)
  from_port   = var.Puerto_loadbalancer[count.index]
  to_port     = var.Puerto_loadbalancer[count.index]
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ingress_nfs" {
  security_group_id = aws_security_group.nfs.id
  type              = "ingress"

  count       = length(var.Puerto_nfs)
  from_port   = var.Puerto_nfs[count.index]
  to_port     = var.Puerto_nfs[count.index]
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

# Ahora introducimos la reglas de salida para todo el trafico

resource "aws_security_group_rule" "egress" {
  for_each = { 
    loadbalancer = aws_security_group.loadbalancer.id,
    nfs = aws_security_group.nfs.id,
    frontend = aws_security_group.frontend.id,
    backend = aws_security_group.backend.id
  }

  security_group_id = each.value
  type              = "egress"
  from_port   = 0
  to_port     = 0
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}


# Creamos las instancias
resource "aws_instance" "backend" {
  ami             = var.ami_id
  instance_type   = var.tipo_instancia
  key_name        = var.key_name
  security_groups = [aws_security_group.backend.name]

  tags = {
    Name = var.instancia_backend
  }
}

resource "aws_instance" "frontend-02" {
  ami             = var.ami_id
  instance_type   = var.tipo_instancia
  key_name        = var.key_name
  security_groups = [aws_security_group.frontend.name]

  tags = {
    Name = "frontend-02"
  }
}

resource "aws_instance" "frontend-01" {
  ami             = var.ami_id
  instance_type   = var.tipo_instancia
  key_name        = var.key_name
  security_groups = [aws_security_group.frontend.name]

  tags = {
    Name = "frontend-01"
  }
}

resource "aws_instance" "nfs" {
  ami             = var.ami_id
  instance_type   = var.tipo_instancia
  key_name        = var.key_name
  security_groups = [aws_security_group.nfs.name]

  tags = {
    Name = var.instancia_nfs
  }
}

resource "aws_instance" "loadbalancer" {
  ami             = var.ami_id
  instance_type   = var.tipo_instancia
  key_name        = var.key_name
  security_groups = [aws_security_group.loadbalancer.name]

  tags = {
    Name = var.instancia_loadbalancer
  }
}

# Asignamos ip elastica al load balancer
resource "aws_eip" "ip_elastica" {
  instance = aws_instance.loadbalancer.id
}