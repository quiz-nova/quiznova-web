data "azurerm_client_config" "current" {}

# ==============================================================================
# Development OIDC & GitHub Actions Credentials
# ==============================================================================

resource "azuread_application" "web_dev" {
  display_name = "github-actions-quiznova-web-dev"
}

resource "azuread_service_principal" "web_dev" {
  client_id = azuread_application.web_dev.client_id
}

resource "azuread_application_federated_identity_credential" "web_dev_env" {
  application_id = azuread_application.web_dev.id
  display_name   = "github-actions-quiznova-web-dev-env"
  description    = "Federated credential for QuizNova Web development environment"
  audiences      = ["api://AzureADTokenExchange"]
  issuer         = "https://token.actions.githubusercontent.com"
  subject        = "repo:${var.github_owner}/${var.repository_name}:environment:development"
}

resource "azuread_application_federated_identity_credential" "web_dev_branch" {
  application_id = azuread_application.web_dev.id
  display_name   = "github-actions-quiznova-web-dev-branch"
  description    = "Federated credential for QuizNova Web develop branch"
  audiences      = ["api://AzureADTokenExchange"]
  issuer         = "https://token.actions.githubusercontent.com"
  subject        = "repo:${var.github_owner}/${var.repository_name}:ref:refs/heads/develop"
}

resource "azurerm_role_assignment" "web_dev_contributor" {
  scope                = "/subscriptions/${var.azure_subscription_id}/resourceGroups/${var.resource_group_name}"
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.web_dev.object_id
}

resource "github_actions_environment_secret" "web_dev_client_id" {
  repository  = var.repository_name
  environment = "development"
  secret_name = "AZURE_CLIENT_ID"
  value       = azuread_application.web_dev.client_id
}

resource "github_actions_environment_secret" "web_dev_tenant_id" {
  repository  = var.repository_name
  environment = "development"
  secret_name = "AZURE_TENANT_ID"
  value       = data.azurerm_client_config.current.tenant_id
}

resource "github_actions_environment_secret" "web_dev_subscription_id" {
  repository  = var.repository_name
  environment = "development"
  secret_name = "AZURE_SUBSCRIPTION_ID"
  value       = var.azure_subscription_id
}

# ==============================================================================
# Staging OIDC & GitHub Actions Credentials
# ==============================================================================

resource "azuread_application" "web_stg" {
  display_name = "github-actions-quiznova-web-stg"
}

resource "azuread_service_principal" "web_stg" {
  client_id = azuread_application.web_stg.client_id
}

resource "azuread_application_federated_identity_credential" "web_stg_env" {
  application_id = azuread_application.web_stg.id
  display_name   = "github-actions-quiznova-web-stg-env"
  description    = "Federated credential for QuizNova Web staging environment"
  audiences      = ["api://AzureADTokenExchange"]
  issuer         = "https://token.actions.githubusercontent.com"
  subject        = "repo:${var.github_owner}/${var.repository_name}:environment:staging"
}

resource "azuread_application_federated_identity_credential" "web_stg_branch" {
  application_id = azuread_application.web_stg.id
  display_name   = "github-actions-quiznova-web-stg-branch"
  description    = "Federated credential for QuizNova Web staging branch"
  audiences      = ["api://AzureADTokenExchange"]
  issuer         = "https://token.actions.githubusercontent.com"
  subject        = "repo:${var.github_owner}/${var.repository_name}:ref:refs/heads/staging"
}

resource "azurerm_role_assignment" "web_stg_contributor" {
  scope                = "/subscriptions/${var.azure_subscription_id}/resourceGroups/${var.resource_group_name}"
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.web_stg.object_id
}

resource "github_actions_environment_secret" "web_stg_client_id" {
  repository  = var.repository_name
  environment = "staging"
  secret_name = "AZURE_CLIENT_ID"
  value       = azuread_application.web_stg.client_id
}

resource "github_actions_environment_secret" "web_stg_tenant_id" {
  repository  = var.repository_name
  environment = "staging"
  secret_name = "AZURE_TENANT_ID"
  value       = data.azurerm_client_config.current.tenant_id
}

resource "github_actions_environment_secret" "web_stg_subscription_id" {
  repository  = var.repository_name
  environment = "staging"
  secret_name = "AZURE_SUBSCRIPTION_ID"
  value       = var.azure_subscription_id
}
