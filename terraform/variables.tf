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

variable "github_owner_id" {
  type        = string
  description = "GitHub organization numeric ID for immutable OIDC subject claims"
  default     = "325215040"
}

variable "github_repository_id" {
  type        = string
  description = "GitHub repository numeric ID for immutable OIDC subject claims"
  default     = "1392648820"
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

variable "azure_subscription_id" {
  type        = string
  description = "The Azure subscription ID"
  default     = "83ab56f5-88ee-436d-87a5-994d3185bf00"
}

variable "resource_group_name" {
  type        = string
  description = "The name of the Azure resource group"
  default     = "quiznova-rg"
}

variable "storage_account_name" {
  type        = string
  description = "The name of the platform storage account"
  default     = "stquiznova"
}

variable "container_cpu" {
  type        = number
  description = "CPU core allocation for the frontend container apps"
  default     = 0.25
}

variable "container_memory" {
  type        = string
  description = "Memory allocation for the frontend container apps"
  default     = "0.5Gi"
}

variable "container_image" {
  type        = string
  description = "Default initial container image for the frontend container apps"
  default     = "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
}

variable "min_replicas" {
  type        = number
  description = "Minimum replicas for preview container apps (0 enables scale-to-zero at $0 idle cost)"
  default     = 0
}

variable "max_replicas" {
  type        = number
  description = "Maximum replicas for preview container apps"
  default     = 2
}

# ==============================================================================
# Metadata & Governance Tags
# ==============================================================================

variable "common_tags" {
  type        = map(string)
  description = "Baseline metadata tags applied to all web cloud resources"
  default = {
    Project    = "quiznova"
    Service    = "quiznova-web"
    Tier       = "frontend"
    ManagedBy  = "terraform"
    Repository = "quiznova-web"
    Owner      = "moamenelbarky"
  }
}
