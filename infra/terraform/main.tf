# Author: Viswanath Ivatury
# Purpose: main terraform file that drives the setup for resources needed for exposing  UI

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
}

# Additional provider configuration for west coast region; resources can
# reference this as `aws.west`.
provider "aws" {
  alias  = "west"
  region = "us-west-2"
}

# Only create the resource if the hosted zone is set to true in tfvars file : create_hosted_zone
resource "aws_route53_zone" "aws_hosted_zone_check_create"{
  name  = "${var.hosted_zone}"
  count = "${var.create_hosted_zone == "true" ? 1 : 0}"
}

data "aws_route53_zone" "ui-cert-zone" {
  name = "${var.hosted_zone}"
  private_zone = false
}

module "cert" {
  source = "./modules/cert"
  #source = "github.com/azavea/terraform-aws-acm-certificate"

  domain_name                       = "*.${var.roche_stack}-${var.deployment_group}-${var.ui_domain_name}"  #"${var.ui_domain_name}"
  subject_alternative_names         = ["${var.ui_cname1}"]
  hosted_zone_id                    = data.aws_route53_zone.ui-cert-zone.zone_id
  validation_record_ttl             = 60 
  allow_validation_record_overwrite = true
  deployment_group = "${var.deployment_group}"
  roche_stack = "${var.roche_stack}" 
  env = "${var.env}"
}


########### generate cert for the ui com,ponent to####################
# module "ui_cert" {
#   providers = {
#     aws.acm_account     = "aws.certificates"
#     aws.route53_account = "aws.west"
#   }

#   source = "./modules/cert"
#   env = "${var.env}"
#   ui_domain_name = "${var.ui_domain_name}"
#   dns_zones = "aws.dns_zones"
#   ui_cname1 = "${var.ui_cname1}"
#   ui_cname2 = "${var.ui_cname2}"
#   deployment_group = "${var.deployment_group}"
#   roche_stack = "${var.roche_stack}" 
#   hosted_zone = "${var.hosted_zone}" 
#   hosted_zone_id = data.aws_route53_zone.ui-cert-zone.zone_id
# }


########### S3 Bucket for the UI code to be deployed to####################
########### this also creates aws Param store value ##################
module "ui_s3"{
    source = "./modules/s3"
    ui_bucket_name = "${var.ui_bucket_name}"
    ui_s3_bucket_acl = "${var.ui_s3_bucket_acl}"
    deployment_group = "${var.deployment_group}"
    roche_stack = "${var.roche_stack}"   
    providers = {
        aws = aws.west
    }
}

########### AWS Cloudfront creation fior U for the UI code to be deployed to####################
module "ui_cf" {
  depends_on = [ module.cert ]
  source = "./modules/cf"
  env = "${var.env}"
  cf_ssl_certificate_arm = "${module.cert.arn}"
  ui_s3_domain_name = "${module.ui_s3.ui_s3_domain_name}"
  deployment_group = "${var.deployment_group}"
  roche_stack = "${var.roche_stack}" 
  cf_ui_s3_logs = ""  
  ui_s3_origin_id = "${module.ui_s3.ui_s3_origin_id}"
  default_root_object = "${var.default_root_object}"
  alias1 = "${var.alias1}"
  alias2 = "${var.alias2}"
  providers = {
    aws = aws.west
  }
}

########### generate cert for the ui com,ponent to####################
module "ui_route53" {
  depends_on = [ module.ui_cf ]
  source = "./modules/route53"
  load_balancer_dns_name = "${var.load_balancer_dns_name}"
  providers = {
      aws = aws.west
  }

  deployment_group = "${var.deployment_group}"
  roche_stack = "${var.roche_stack}" 
  ui_r53_name = "${var.ui_r53_name}"  
  ui_cf_id = "${module.ui_cf.ui_cf_id}"
  hosted_zone = "${var.hosted_zone}"
}