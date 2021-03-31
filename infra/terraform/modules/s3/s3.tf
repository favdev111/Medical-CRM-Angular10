#Create S3 buckets
resource "aws_s3_bucket" "ui_live_bucket" {
  bucket = "${var.roche_stack}-${lower(var.deployment_group)}-${var.ui_bucket_name}"
  acl    = "${var.ui_s3_bucket_acl}"
  tags = {
      Roche_Stack = var.roche_stack
      Project = var.deployment_group
  }

  #enable encryption  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

}

#Adding bucket name to paramstore 
# resource "aws_ssm_parameter" "ui-s3-bucket-name" {
#   name        = "/cds/${var.roche_stack}/${var.deployment_group}/gct/gctui.s3.bucket-name"
#   type        = "String"
#   value       = aws_s3_bucket.ui_live_bucket.id
#   overwrite   = true
#   tags = {
#     roche_stack = var.roche_stack
#     Project = var.deployment_group
#   }
# }

output "ui_s3_origin_id" {
  description = "ui_s3_origin_id"
  value = "${aws_s3_bucket.ui_live_bucket.arn}"
}

output "ui_s3_domain_name" {
  description = "ui_s3_domain_name"
  value = "${aws_s3_bucket.ui_live_bucket.bucket_regional_domain_name}"
}