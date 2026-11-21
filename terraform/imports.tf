import {
  to = azurerm_role_assignment.web_dev_state_blob
  id = "/subscriptions/83ab56f5-88ee-436d-87a5-994d3185bf00/resourceGroups/quiznova-rg/providers/Microsoft.Storage/storageAccounts/stquiznova/providers/Microsoft.Authorization/roleAssignments/9e027d90-0244-4c15-9b70-bf572ce34838"
}

import {
  to = azurerm_role_assignment.web_stg_state_blob
  id = "/subscriptions/83ab56f5-88ee-436d-87a5-994d3185bf00/resourceGroups/quiznova-rg/providers/Microsoft.Storage/storageAccounts/stquiznova/providers/Microsoft.Authorization/roleAssignments/7db941c7-c4e0-42e1-ad5e-5ebed783b6bc"
}

import {
  to = azuread_application.web_prd
  id = "/applications/80137933-3889-4e77-976f-5a812e1812b6"
}

import {
  to = azuread_service_principal.web_prd
  id = "/servicePrincipals/67512edd-7835-4b8f-9ab8-3095b2723158"
}

import {
  to = azuread_application_federated_identity_credential.web_prd_env
  id = "80137933-3889-4e77-976f-5a812e1812b6/federatedIdentityCredentials/e690b7bc-2df4-41c4-a694-9ad6f391a661"
}

import {
  to = azuread_application_federated_identity_credential.web_prd_main
  id = "80137933-3889-4e77-976f-5a812e1812b6/federatedIdentityCredentials/f0cd0623-31d6-4010-a561-d007d65e3eed"
}

import {
  to = azurerm_role_assignment.web_prd_contributor
  id = "/subscriptions/83ab56f5-88ee-436d-87a5-994d3185bf00/resourceGroups/quiznova-rg/providers/Microsoft.Authorization/roleAssignments/37bf749c-ff7c-4aa7-a889-f7d241235be1"
}

import {
  to = azurerm_role_assignment.web_prd_state_blob
  id = "/subscriptions/83ab56f5-88ee-436d-87a5-994d3185bf00/resourceGroups/quiznova-rg/providers/Microsoft.Storage/storageAccounts/stquiznova/providers/Microsoft.Authorization/roleAssignments/33c74f73-9ce0-4478-a856-2b8a31d67ffc"
}

import {
  to = github_actions_environment_secret.web_prd_client_id
  id = "quiznova-web:production:AZURE_CLIENT_ID"
}

import {
  to = github_actions_environment_secret.web_prd_tenant_id
  id = "quiznova-web:production:AZURE_TENANT_ID"
}

import {
  to = github_actions_environment_secret.web_prd_subscription_id
  id = "quiznova-web:production:AZURE_SUBSCRIPTION_ID"
}
