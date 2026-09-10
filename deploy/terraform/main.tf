terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  backend "s3" {
    bucket         = "autoera-terraform-state-prod"
    key            = "platform/production/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "autoera-terraform-lock"
  }
}

# Primary Region: India (Mumbai)
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "AutoEra-AI-ERP"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Compliance  = "DPDP-Act-2023"
    }
  }
}

# Secondary Region: Middle East / UAE (Dubai) for Global Expansion
provider "aws" {
  alias  = "middle_east"
  region = "me-central-1"

  default_tags {
    tags = {
      Project     = "AutoEra-AI-ERP"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Market      = "GCC"
    }
  }
}

# Multi-AZ Production VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "autoera-${var.environment}-vpc"
  cidr = var.vpc_cidr

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  database_subnets = ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true
  enable_vpn_gateway     = false

  enable_dns_hostnames = true
  enable_dns_support   = true

  public_subnet_tags = {
    "kubernetes.io/role/elb"                      = "1"
    "kubernetes.io/cluster/autoera-${var.environment}" = "shared"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb"             = "1"
    "kubernetes.io/cluster/autoera-${var.environment}" = "shared"
  }
}
