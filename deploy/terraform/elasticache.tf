# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name       = "autoera-${var.environment}-redis-subnet-group"
  subnet_ids = module.vpc.database_subnets
}

# Redis Security Group
resource "aws_security_group" "redis_sg" {
  name        = "autoera-${var.environment}-redis-sg"
  description = "Allows Redis access from EKS workers"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "Redis from private subnets"
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = module.vpc.private_subnets_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Multi-Node Redis Replication Group
resource "aws_elasticache_replication_group" "redis_cluster" {
  replication_group_id       = "autoera-${var.environment}-redis"
  description                = "AutoEra AI Redis cluster for Celery, rate limits & caching"
  node_type                  = var.redis_node_type
  port                       = 6379
  parameter_group_name       = "default.redis7"
  subnet_group_name          = aws_elasticache_subnet_group.redis_subnet_group.name
  security_group_ids         = [aws_security_group.redis_sg.id]

  num_cache_clusters         = 2
  automatic_failover_enabled = true
  multi_az_enabled           = true

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  kms_key_id                 = aws_kms_key.autoera_platform_key.arn

  apply_immediately          = false
}
