# Dedicated blob container for quiznova-web Terraform state
resource "azurerm_storage_container" "web_tfstate" {
  name                  = "quiznova-web-tfstate"
  storage_account_name  = "stquiznova"
  container_access_type = "private"

  lifecycle {
    prevent_destroy = true
  }
}
