# UrbanIQ AWS settings. The only file you need to edit; then run the "UrbanIQ Infra" workflow with action "apply".

# 12-digit AWS account number (the one you ran deploy/aws/bootstrap.cfn.yml in).
aws_account_id = "855985701754"

aws_region  = "ap-south-1"
environment = "prod"

# Where budget alerts go.
alert_email = "nirmalsharavanan@gmail.com"
budget_usd  = 20

# Optional custom domain. Needs an ACM certificate in us-east-1; leave both empty to use the *.cloudfront.net address.
domain          = ""
certificate_arn = ""
