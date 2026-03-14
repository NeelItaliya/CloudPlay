output "alb_dns_name" {
  description = "ALB DNS name — update BASE_URL in App.jsx to this"
  value       = "http://${aws_lb.cloudplay_alb.dns_name}"
}

output "target_group_arn" {
  description = "Target Group ARN"
  value       = aws_lb_target_group.cloudplay_tg.arn
}

output "asg_name" {
  description = "Auto Scaling Group name"
  value       = aws_autoscaling_group.cloudplay_asg.name
}
