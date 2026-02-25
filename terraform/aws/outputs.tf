output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.tic_tac_toe.public_ip
}

output "app_url" {
  description = "URL for the Tic-Tac-Toe application"
  value       = "http://${aws_instance.tic_tac_toe.public_ip}:5050"
}

output "grafana_url" {
  description = "URL for Grafana dashboard"
  value       = "http://${aws_instance.tic_tac_toe.public_ip}:3001"
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/id_ed25519 ec2-user@${aws_instance.tic_tac_toe.public_ip}"
}
