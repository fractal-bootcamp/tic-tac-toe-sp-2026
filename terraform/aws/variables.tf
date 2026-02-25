variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "key_pair_name" {
  description = "Name of the SSH key pair in AWS"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance (Amazon Linux 2023)"
  type        = string
  default     = ""  # Will use data source if not specified
}
