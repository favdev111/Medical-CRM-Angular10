############ Cert Validation ######################
resource "aws_acm_certificate_validation" "gct-ui-cert-validator" {
  certificate_arn = "${var.gct_ui_cert_arn}"
}
