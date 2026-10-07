terraform {
  required_version = ">= 1.5.0"

  backend "azurerm" {
    resource_group_name  = "quiz-nova-resource-group"
    storage_account_name = "stquiznova"
    container_name       = "quiznova-web-tfstate"
    key                  = "terraform.tfstate"
    use_azuread_auth     = true
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
    namedotcom = {
      source  = "lexfrei/namedotcom"
      version = "~> 4.1"
    }
  }
}

provider "azurerm" {
  subscription_id                 = var.azure_subscription_id
  resource_provider_registrations = "none"
  features {}
}

provider "github" {
  token = var.github_token
  owner = var.github_owner
}

provider "namedotcom" {
  username = var.namedotcom_username
  token    = var.namedotcom_token
}
