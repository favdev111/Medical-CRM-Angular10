#get the hosted zone details
data "aws_route53_zone" "ui-cert-zone" {
  name = "${var.hosted_zone}"
  private_zone = false
}

resource "aws_route53_record" "ui_r53" {
  zone_id = data.aws_route53_zone.ui-cert-zone.zone_id
  name    = "${var.roche_stack}-${var.deployment_group}-${var.ui_r53_name}" 
  type    = "CNAME"
  ttl     = "300"
  records = [ "${var.ui_cf_id}" ] # cfid
}

