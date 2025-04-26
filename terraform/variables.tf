variable "region" {
  description = "Región de AWS donde se creará la instancia"
  type        = string
  default     = "us-east-1"
}

variable "Puerto_loadbalancer" {
  description = "Puertos de loadbalancer"
  type        = list(number)
  default     = [80, 443]
}
variable "Puerto_frontend" {
  description = "Puertos de frontend"
  type        = list(number)
  default     = [22, 80, 443]
}

variable "Puerto_backend" {
  description = "Puertos de backend"
  type        = list(number)
  default     = [22, 3306]
}

variable "Puerto_nfs" {
  description = "Puertos de nfs"
  type        = list(number)
  default     = [22, 2049]
}

variable "sg_frontend" {
  description = "grupo seguridad frontend"
  type        = string
  default     = "sg_frontend"
}

variable "sg_backend" {
  description = "grupo seguridad backend"
  type        = string
  default     = "sg_backend"
}

variable "sg_nfs" {
  description = "grupo seguridad nfs"
  type        = string
  default     = "sg_nfs"
}

variable "sg_description" {
  description = "Descripción del grupo de seguridad"
  type        = string
  default     = "Descripcion del grupo de seguridad"
}

variable "sg_loadbalancer" {
  description = "Descripción del grupo de seguridad"
  type        = string
  default     = "sg_loadbalancer"
}

variable "ami_id" {
  description = "Identificador de la AMI"
  type        = string
  default     = "ami-04b4f1a9cf54c11d0"
}

variable "tipo_instancia" {
  description = "Tipo de instancia"
  type        = string
  default     = "t2.small"
}

variable "key_name" {
  description = "Nombre de la clave pública"
  type        = string
  default     = "vockey"
}

#variable "instancia_loadbalancer" {
#  description = "Nombre de la instancia"
#  type        = string
#  default     = "loadbalancer"
#}
variable "instancia_nfs" {
  description = "Nombre de la instancia"
  type        = string
  default     = "nfs"
}

variable "instancia_backend" {
  description = "Nombre de la instancia"
  type        = string
  default     = "backend"
}
