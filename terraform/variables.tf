variable "aws_region" {
  description = "AWS region"
  default     = "ap-south-1"
}

variable "vpc_id" {
  description = "VPC ID where your EC2 is running"
  default     = "vpc-087fc237399138702"
}

variable "ami_id" {
  description = "AMI ID for launch template — use cloudplay-backend-v2 AMI ID"
  default     = "ami-0422cf38a6d823149"
}

variable "instance_type" {
  description = "EC2 instance type for ASG instances"
  default     = "t3.micro"
}

variable "key_pair_name" {
  description = "EC2 key pair name"
  default     = "tic-tac"
}

variable "ec2_security_group_id" {
  description = "Security group ID of existing EC2"
  default     = "sg-049f5c66bc83b7c96"
}

provider "aws" {
  region     = var.aws_region
  access_key = "AKIA4FDIOE3NIM2Q26N6"
  secret_key = "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"
}