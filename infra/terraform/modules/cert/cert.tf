#Author: Viswanath Ivatury
#Purpose: Creates AWS Certificate and valdiates the certificate

locals {
  tags = {
    Name        = "${var.domain_name}"
    Environment = "${var.env}"
  }
  cert_sans = ["${var.subject_alternative_names}"]
}

############### Certificate Creation #############################
##################################################################
resource "aws_acm_certificate" "default" {
  #count = "${aws_acm_certificate.default.status == "Issued" ? 1 : 0}"
  
  domain_name               = var.domain_name
  subject_alternative_names = var.subject_alternative_names
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = false
  }

  tags = {
    Environment = "${var.env}"
  }
}

############### route53_record Creation #############################
##################################################################
resource "aws_route53_record" "validation" {
  #count = length(aws_acm_certificate.default.domain_validation_options)  
  count = length(local.cert_sans) + 1
  zone_id = var.hosted_zone_id
  name    = element(aws_acm_certificate.default.domain_validation_options.*.resource_record_name, count.index)
  type    = element(aws_acm_certificate.default.domain_validation_options.*.resource_record_type, count.index)
  records = [element(aws_acm_certificate.default.domain_validation_options.*.resource_record_value, count.index)]
  ttl     = 60

  allow_overwrite = true

  depends_on = [
    aws_acm_certificate.default,
  ]
}

resource "aws_acm_certificate_validation" "default" {
  certificate_arn = aws_acm_certificate.default.arn
  validation_record_fqdns = aws_route53_record.validation.*.fqdn

  #validation_record_fqdns = [for record in aws_route53_record.validation : record.fqdn]
  depends_on = [
    aws_route53_record.validation,
  ]
}
