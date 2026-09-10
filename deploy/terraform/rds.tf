# DB Subnet Group
resource "aws_db_subnet_group" "aurora_subnet_group" {
  name       = "autoera-${var.environment}-aurora-subnet-group"
  subnet_ids = module.vpc.database_subnets

  tags = {
    Name = "autoera-${var.environment}-aurora-subnet-group"
  }
}

# Database Security Group
resource "aws_security_group" "aurora_sg" {
  name        = "autoera-${var.environment}-aurora-sg"
  description = "Controls access to Aurora PostgreSQL from EKS cluster"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "PostgreSQL access from EKS workers"
    from_port   = 5432
    to_port     = 5432
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

# Aurora PostgreSQL 16 Multi-AZ Cluster
resource "aws_rds_cluster" "aurora_cluster" {
  cluster_identifier      = "autoera-${var.environment}-aurora-pg"
  engine                  = "aurora-postgresql"
  engine_version          = "16.1"
  database_name           = "autoera_production_db"
  master_username         = "autoera_admin"
  manage_master_user_password = true

  db_subnet_group_name    = aws_db_subnet_group.aurora_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.aurora_sg.id]

  backup_retention_period = 35
  preferred_backup_window = "19:00-21:00"
  storage_encrypted       = true
  kms_key_id              = aws_kms_key.autoera_platform_key.arn
  deletion_protection     = true
  skip_final_snapshot     = false
  final_snapshot_identifier = "autoera-prod-final-snapshot"

  serverlessv2_scaling_configuration {
    min_capacity = 2.0
    max_capacity = 16.0
  }
}

# Multi-AZ Cluster Instances (Primary Writer + Reader Replica)
resource "aws_rds_cluster_instance" "aurora_instances" {
  count              = 2
  identifier         = "autoera-${var.environment}-aurora-instance-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.aurora_cluster.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.aurora_cluster.engine
  engine_version     = aws_rds_cluster.aurora_cluster.engine_version
  publicly_accessible = false
}
