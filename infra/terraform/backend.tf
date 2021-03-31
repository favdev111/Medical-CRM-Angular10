terraform {
  backend "s3" {
    region = "us-west-2"
    bucket = "cds-gct-ui-terraform-dev"
    key    = "cdsgctuidev_terraform.tfstate"
  }
}