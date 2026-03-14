# CloudPlay Terraform — ALB + ASG

Use this to spin up and tear down your ALB + ASG on demand to save AWS credits.

## One-time setup

### 1. Install Terraform on your Mac
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

### 2. Install AWS CLI and configure credentials
```bash
brew install awscli
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Region: ap-south-1
# Output format: json
```

To get AWS credentials:
```
AWS Console → IAM → Users → your user
→ Security credentials → Create access key
```

### 3. Update your AMI ID in variables.tf
```
AWS Console → EC2 → AMIs → cloudplay-backend-v2 → copy AMI ID
```
Replace `YOUR_AMI_ID` in `variables.tf` with your actual AMI ID.

---

## Daily usage

### Spin everything UP (before presentation or testing)
```bash
cd terraform
terraform init      # only needed first time
terraform apply
```
Type `yes` when prompted. Takes ~3 minutes.
ALB DNS will be printed at the end — update BASE_URL in App.jsx if it changes.

### Tear everything DOWN (after presentation to save credits)
```bash
cd terraform
terraform destroy
```
Type `yes` when prompted. Deletes ALB + ASG + security groups.
Your EC2 stays running (Redis and backend still live).

---

## Cost savings
- ALB costs ~$18/month
- Running it only when needed (e.g. 5 days/month) = ~$3 instead of $18
- Your EC2 t3.micro = ~$8/month (always on)
