# Customer Managed KMS Key (CMK) for Envelope Encryption
resource "aws_kms_key" "autoera_platform_key" {
  description             = "AutoEra AI KMS CMK for RDS, S3, ElastiCache, and PII Field Encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Name = "autoera-${var.environment}-platform-cmk"
  }
}

resource "aws_kms_alias" "autoera_platform_key_alias" {
  name          = "alias/autoera-${var.environment}-platform-key"
  target_key_id = aws_kms_key.autoera_platform_key.key_id
}

# S3 Bucket: Vehicle Inspection Photos & Video
resource "aws_s3_bucket" "inspection_media" {
  bucket = "autoera-${var.environment}-media-ap-south-1"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media_encryption" {
  bucket = aws_s3_bucket.inspection_media.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.autoera_platform_key.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "media_public_block" {
  bucket = aws_s3_bucket.inspection_media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Lifecycle: Move raw inspection video to Glacier Instant Retrieval after 90 days
resource "aws_s3_bucket_lifecycle_configuration" "media_lifecycle" {
  bucket = aws_s3_bucket.inspection_media.id

  rule {
    id     = "archive-old-inspection-media"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "GLACIER_IR"
    }

    transition {
      days          = 365
      storage_class = "DEEP_ARCHIVE"
    }
  }
}
