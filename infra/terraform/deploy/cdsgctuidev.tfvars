env="dev"
roche_stack="cdsgctdev"
deployment_group="Astack"
region="us-west-2"
cert_region="us-east-1"

#========CERT===========
ui_domain_name= "ui.gct.hi5.cds.platform.navify.com"
ui_cname1 = "*.gct.hi5.cds.platform.navify.com"
ui_cname2 = "*.gct.hi5.cds.platform.navify.com"
# this will create the hosted zone in R53 space and then A-records can be added
hosted_zone = "gct.hi5.cds.platform.navify.com"
create_hosted_zone="false"

# ======== S3 ================
ui_bucket_name = "cds-gctui-dev"
ui_s3_bucket_acl = "public-read"

# ======== route53 ================
ui_r53_name = "cds-gctui-dev"
load_balancer_dns_name = "ui.gct.hi5.cds.platform.navify.com"

# ======== default object ================
default_root_object = "index.html"

# ======== cloudfront object ================
alias1 = "*.ui.gct.hi5.cds.platform.navify.com"
alias2 = "*.gct.hi5.cds.platform.navify.com"


