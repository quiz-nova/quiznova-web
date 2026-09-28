terraform {
  required_version = ">= 1.5.0"

  required_providers {
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

provider "github" {
  token = var.github_token
  owner = var.github_owner
}

provider "namedotcom" {
  username = var.namedotcom_username
  token    = var.namedotcom_token
}
