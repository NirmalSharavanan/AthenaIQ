variable "aws_account_id" { type = string }
variable "aws_region" { type = string }
variable "environment" { type = string }
variable "alert_email" { type = string }
variable "budget_usd" { type = number }
variable "domain" {
  type    = string
  default = ""
}
variable "zone_name" {
  type    = string
  default = ""
}
