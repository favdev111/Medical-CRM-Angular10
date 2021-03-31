############## common ################
variable "env" {}
variable "region" {}
variable "roche_stack" {}
variable "deployment_group" {}

############## SLL Certificate ################
variable "ui_domain_name" {
  default="*.test.navify.com"
}
variable "ui_cname1" {}
variable "ui_cname2" {}
variable "hosted_zone" {}

############## S3 for store of UI code ################
variable "ui_s3_bucket_acl" {}
variable "ui_bucket_name" {}

############## Cloudfront ################
variable "alias1" {}
variable "alias2" {}
variable "default_root_object" {}

############ Route53 ################
variable "ui_r53_name" {}
variable "load_balancer_dns_name" {}
variable "create_hosted_zone" {}