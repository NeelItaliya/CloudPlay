# provider "aws" {
#   region = var.aws_region
# }

# ─── Data: reference existing VPC and subnets ──────────────────────────────

data "aws_subnets" "public" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }
}

# ─── Security Group: ALB only ──────────────────────────────────────────────

resource "aws_security_group" "alb_sg" {
  name        = "cloudplay-alb-sg"
  description = "Allow HTTP inbound to ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "cloudplay-alb-sg"
  }
}

# ─── Target Group ──────────────────────────────────────────────────────────

resource "aws_lb_target_group" "cloudplay_tg" {
  name        = "cloudplay-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    path                = "/health"
    protocol            = "HTTP"
    port                = "8000"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "cloudplay-tg"
  }
}

# ─── Application Load Balancer ─────────────────────────────────────────────

resource "aws_lb" "cloudplay_alb" {
  name               = "cloudplay-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = data.aws_subnets.public.ids

  tags = {
    Name = "cloudplay-alb"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.cloudplay_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.cloudplay_tg.arn
  }
}

# ─── Launch Template ───────────────────────────────────────────────────────

resource "aws_launch_template" "cloudplay_lt" {
  name          = "cloudplay-launch-template"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_pair_name

  # Reuse your existing EC2 security group
  vpc_security_group_ids = [var.ec2_security_group_id]

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "cloudplay-asg-instance"
    }
  }
}

# ─── Auto Scaling Group ────────────────────────────────────────────────────

resource "aws_autoscaling_group" "cloudplay_asg" {
  name                = "cloudplay-asg"
  desired_capacity    = 1
  min_size            = 1
  max_size            = 3
  vpc_zone_identifier = data.aws_subnets.public.ids
  target_group_arns   = [aws_lb_target_group.cloudplay_tg.arn]
  health_check_type   = "ELB"

  launch_template {
    id      = aws_launch_template.cloudplay_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "cloudplay-asg-instance"
    propagate_at_launch = true
  }
}

# ─── Auto Scaling Policy ───────────────────────────────────────────────────

resource "aws_autoscaling_policy" "scale_policy" {
  name                   = "cloudplay-request-scaling"
  autoscaling_group_name = aws_autoscaling_group.cloudplay_asg.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ALBRequestCountPerTarget"
      resource_label         = "${aws_lb.cloudplay_alb.arn_suffix}/${aws_lb_target_group.cloudplay_tg.arn_suffix}"
    }
    target_value = 3
  }
}
