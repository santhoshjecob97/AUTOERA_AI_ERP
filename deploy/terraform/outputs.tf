output "vpc_id" {
  description = "ID of the AutoEra Production VPC"
  value       = module.vpc.vpc_id
}

output "eks_cluster_name" {
  description = "Name of the deployed Amazon EKS cluster"
  value       = aws_eks_cluster.autoera_eks.name
}

output "eks_cluster_endpoint" {
  description = "Kubernetes API endpoint for the EKS cluster"
  value       = aws_eks_cluster.autoera_eks.endpoint
}

output "aurora_endpoint" {
  description = "Writer endpoint for the Aurora PostgreSQL cluster"
  value       = aws_rds_cluster.aurora_cluster.endpoint
}

output "aurora_reader_endpoint" {
  description = "Reader endpoint for load-balanced read queries"
  value       = aws_rds_cluster.aurora_cluster.reader_endpoint
}

output "elasticache_primary_endpoint" {
  description = "Primary Redis endpoint for Celery and rate limiting"
  value       = aws_elasticache_replication_group.redis_cluster.primary_endpoint_address
}

output "media_bucket_name" {
  description = "S3 bucket for vehicle inspection media and photos"
  value       = aws_s3_bucket.inspection_media.id
}
