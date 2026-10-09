data "azurerm_storage_account" "state" {
  name                = var.storage_account_name
  resource_group_name = var.resource_group_name
}

# Dedicated blob container for quiznova-web Terraform state
resource "azurerm_storage_container" "web_tfstate" {
  name                  = "quiznova-web-tfstate"
  storage_account_id    = data.azurerm_storage_account.state.id
  container_access_type = "private"

  lifecycle {
    prevent_destroy = true
  }
}
