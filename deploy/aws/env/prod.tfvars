# AthenaIQ AWS settings. The only file you need to edit; then run the "AthenaIQ Infra" workflow with action "apply".

# 12-digit AWS account number (the one you ran deploy/aws/bootstrap.cfn.yml in).
aws_account_id = "855985701754"

aws_region  = "ap-south-1"
environment = "prod"

# Where budget alerts go.
alert_email = "nirmalsharavanan@gmail.com"
budget_usd  = 20

# Custom domain. Register zone_name in Route 53 first (it creates the hosted zone), then apply.
# Leave domain empty to use the *.cloudfront.net address.
zone_name = "presight.click"
domain    = "athenaiq.presight.click"
