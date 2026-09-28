variable "github_token" {
  type        = string
  description = "GitHub Personal Access Token with repo administration permissions (defaults to GITHUB_TOKEN environment variable if null)"
  sensitive   = true
  default     = null
}

variable "github_owner" {
  type        = string
  description = "GitHub organization or user account owning the repository"
  default     = "quiz-nova"
}

variable "repository_name" {
  type        = string
  description = "Name of the frontend repository"
  default     = "quiznova-web"
}

variable "custom_domain" {
  type        = string
  description = "Custom domain for GitHub Pages and DNS records"
  default     = "quiznova.dev"
}

variable "namedotcom_username" {
  type        = string
  description = "Name.com account username (defaults to NAMEDOTCOM_USERNAME environment variable if null)"
  default     = null
}

variable "namedotcom_token" {
  type        = string
  description = "Name.com API production token (defaults to NAMEDOTCOM_TOKEN environment variable if null)"
  sensitive   = true
  default     = null
}
