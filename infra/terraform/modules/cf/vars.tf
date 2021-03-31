
########## common ##############
variable "roche_stack" {}
variable "deployment_group" {}
variable "env" {}


########### CF values ##############
variable "default_root_object" {}
variable "cf_ui_s3_logs" {}
variable "cf_ssl_certificate_arm" {}
variable "alias1" {}
variable "alias2" {}

########### S3 specific values ##############
variable "ui_s3_domain_name" {}
variable "ui_s3_origin_id" {}
