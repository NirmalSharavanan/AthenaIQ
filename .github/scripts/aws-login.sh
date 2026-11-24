#!/usr/bin/env bash
# Sign in to AWS with GitHub's OIDC token (no stored keys). usage: bash .github/scripts/aws-login.sh infra|deploy
# Needs: permissions: id-token: write. Publishes AWS_* credentials and the UrbanIQ settings to $GITHUB_ENV.
set -euo pipefail
KIND=${1:?infra or deploy}
case "$KIND" in infra|deploy) ;; *) echo "::error::role must be infra or deploy"; exit 1 ;; esac
[ -n "${ACTIONS_ID_TOKEN_REQUEST_URL:-}" ] || { echo "::error::Needs 'permissions: id-token: write'."; exit 1; }

FILE=deploy/aws/env/prod.tfvars
get() { sed -n -E "s/^[[:space:]]*$1[[:space:]]*=[[:space:]]*\"?([^\"#]*)\"?.*$/\1/p" "$FILE" | head -1 | sed 's/[[:space:]]*$//'; }
ACCOUNT=$(get aws_account_id); REGION=$(get aws_region); ENVIRONMENT=$(get environment)
[[ "$ACCOUNT" =~ ^[0-9]{12}$ ]] || { echo "::error file=$FILE::Set aws_account_id to your 12-digit AWS account number."; exit 1; }
{
  echo "AWS_ACCOUNT_ID=$ACCOUNT"; echo "AWS_REGION=$REGION"; echo "AWS_DEFAULT_REGION=$REGION"
  echo "URBANIQ_ENV=$ENVIRONMENT"
  echo "STATE_BUCKET=urbaniq-tfstate-$ACCOUNT"
  echo "SITE_BUCKET=urbaniq-$ENVIRONMENT-site-$ACCOUNT"
} >>"$GITHUB_ENV"

token=$(curl -fsS -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \
  "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=sts.amazonaws.com" | jq -r .value)
echo "::add-mask::$token"
# Show the claims AWS checks against the role's trust policy (never the token itself).
payload=$(cut -d. -f2 <<<"$token" | tr '_-' '/+')
while [ $((${#payload} % 4)) -ne 0 ]; do payload="$payload="; done
base64 -d <<<"$payload" 2>/dev/null | jq -c '{sub, aud, repository, ref}' || true
creds=$(aws sts assume-role-with-web-identity \
  --role-arn "arn:aws:iam::$ACCOUNT:role/urbaniq-github-$KIND" \
  --role-session-name "github-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT" \
  --web-identity-token "$token" --duration-seconds 3600 --region "$REGION" \
  --query Credentials --output json)
for f in AccessKeyId SecretAccessKey SessionToken; do echo "::add-mask::$(jq -r .$f <<<"$creds")"; done
{
  echo "AWS_ACCESS_KEY_ID=$(jq -r .AccessKeyId <<<"$creds")"
  echo "AWS_SECRET_ACCESS_KEY=$(jq -r .SecretAccessKey <<<"$creds")"
  echo "AWS_SESSION_TOKEN=$(jq -r .SessionToken <<<"$creds")"
} >>"$GITHUB_ENV"
echo "Signed in to $ACCOUNT as urbaniq-github-$KIND"
