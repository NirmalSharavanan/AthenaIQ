# Deploying AthenaIQ on AWS

AthenaIQ is a static site, so AWS hosts it as a private S3 bucket behind CloudFront (HTTPS, global cache). GitHub Actions signs in with OIDC; no AWS keys are stored in GitHub. Cost is a few dollars a month at demo traffic.

## One-time setup

1. **Bootstrap** (AWS Console → CloudFormation → Create stack, region `ap-south-1`): upload `deploy/aws/bootstrap.cfn.yml`.
   - If the account already has a GitHub OIDC provider (this account does: UrbanIQ created it), keep the default ARN in `ExistingOidcProviderArn`; an account can hold only one.
   - Creates the state bucket and the roles `athenaiq-github-infra` and `athenaiq-github-deploy`, trusted only for this repo on `main`. `GitHubRepo` must match the OIDC `sub` claim exactly: `NirmalSharavanan@29374886/AthenaIQ@1472475212` (owner and repo IDs included; check with `gh api repos/NirmalSharavanan/AthenaIQ/actions/oidc/customization/sub`).
2. **Edit** `deploy/aws/env/prod.tfvars` (account number, alert email, optional domain) and commit to `main`.
3. **GitHub → Actions → AthenaIQ Infra** → run with `plan`, read the summary, then run with `apply`. It prints the site address.
4. Confirm the budget alert email from AWS.

## Everyday use

The **AthenaIQ Deploy** workflow runs on every push to `main`, and again after the data-build workflows (Build twin data, Build region data, Add buildings, Fetch media) finish, because their commits use `GITHUB_TOKEN` and do not trigger push events. It syncs the site to S3 (excluding `tools/`, `docs/`, `.github/`), then invalidates CloudFront. You can also run it manually.

## Notes

- GitHub Pages (`jekyll-gh-pages.yml`) still works in parallel; delete it when you cut over.
- `config.js` holds API keys in the browser, as before; AWS does not change that.
- The `live-data` branch workflow is unchanged. If the site fetches it from GitHub, that keeps working; moving it to S3 is a later step.
- Custom domain (`athenaiq.presight.click`): uses the `presight.click` hosted zone UrbanIQ already uses. Infra then creates the certificate (us-east-1), the DNS validation records and the alias records. Infra `destroy` removes only the AthenaIQ records; leave the hosted zone, UrbanIQ needs it.
- Remove everything: run AthenaIQ Infra with `destroy` and `DELETE-ATHENAIQ`.
