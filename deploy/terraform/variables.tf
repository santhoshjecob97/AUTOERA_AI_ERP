variable "aws_region" {
  description = "Primary AWS region for AutoEra production"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the production VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "cluster_name" {
  description = "Name of the EKS Kubernetes cluster"
  type        = string
  default     = "autoera-prod-ap-south-1"
}

variable "kubernetes_version" {
  description = "Target Kubernetes version for Amazon EKS"
  type        = string
  default     = "1.30"
}

variable "rds_instance_class" {
  description = "Aurora PostgreSQL database instance class"
  type        = string
  default     = "db.r6g.xlarge"
}

variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.m6g.large"
}
