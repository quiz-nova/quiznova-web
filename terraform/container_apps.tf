# ==============================================================================
# Container App Environments (Reusing Existing Sweden Central Environments)
# ==============================================================================

data "azurerm_container_app_environment" "env_dev" {
  name                = "quiznova-env-dev"
  resource_group_name = var.resource_group_name
}

data "azurerm_container_app_environment" "env_stg" {
  name                = "quiznova-env-stg"
  resource_group_name = var.resource_group_name
}

data "azurerm_key_vault" "kv_dev" {
  name                = "quiznova-kv-dev"
  resource_group_name = var.resource_group_name
}

data "azurerm_key_vault_secret" "ghcr_token_dev" {
  name         = "ghcr-token"
  key_vault_id = data.azurerm_key_vault.kv_dev.id
}

data "azurerm_key_vault" "kv_stg" {
  name                = "quiznova-kv-stg"
  resource_group_name = var.resource_group_name
}

data "azurerm_key_vault_secret" "ghcr_token_stg" {
  name         = "ghcr-token"
  key_vault_id = data.azurerm_key_vault.kv_stg.id
}

# ==============================================================================
# Development Web Client Container App (Scale to 0 = $0 Cost)
# ==============================================================================

resource "azurerm_container_app" "web_dev" {
  name                         = "quiznova-web-dev"
  container_app_environment_id = data.azurerm_container_app_environment.env_dev.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"

  tags = merge(var.common_tags, {
    Environment = "dev"
    Component   = "web"
  })

  secret {
    name  = "ghcr-token"
    value = data.azurerm_key_vault_secret.ghcr_token_dev.value
  }

  registry {
    server               = "ghcr.io"
    username             = var.github_owner
    password_secret_name = "ghcr-token"
  }

  ingress {
    external_enabled = true
    target_port      = 80
    transport        = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = var.min_replicas
    max_replicas = var.max_replicas

    container {
      name   = "quiznova-web"
      image  = var.container_image
      cpu    = var.container_cpu
      memory = var.container_memory

      readiness_probe {
        port      = 80
        transport = "HTTP"
        path      = "/"
      }

      liveness_probe {
        port      = 80
        transport = "HTTP"
        path      = "/"
      }
    }
  }

  lifecycle {
    ignore_changes = [
      workload_profile_name,
      template[0].cooldown_period_in_seconds,
      template[0].polling_interval_in_seconds,
      template[0].http_scale_rule,
      template[0].container[0].image,
      template[0].container[0].liveness_probe,
      template[0].container[0].readiness_probe,
      ingress[0].traffic_weight
    ]
  }
}

# ==============================================================================
# Staging Web Client Container App (Scale to 0 = $0 Cost)
# ==============================================================================

resource "azurerm_container_app" "web_stg" {
  name                         = "quiznova-web-stg"
  container_app_environment_id = data.azurerm_container_app_environment.env_stg.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"

  tags = merge(var.common_tags, {
    Environment = "stg"
    Component   = "web"
  })

  secret {
    name  = "ghcr-token"
    value = data.azurerm_key_vault_secret.ghcr_token_stg.value
  }

  registry {
    server               = "ghcr.io"
    username             = var.github_owner
    password_secret_name = "ghcr-token"
  }

  ingress {
    external_enabled = true
    target_port      = 80
    transport        = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = var.min_replicas
    max_replicas = var.max_replicas

    container {
      name   = "quiznova-web"
      image  = var.container_image
      cpu    = var.container_cpu
      memory = var.container_memory

      readiness_probe {
        port      = 80
        transport = "HTTP"
        path      = "/"
      }

      liveness_probe {
        port      = 80
        transport = "HTTP"
        path      = "/"
      }
    }
  }

  lifecycle {
    ignore_changes = [
      workload_profile_name,
      template[0].cooldown_period_in_seconds,
      template[0].polling_interval_in_seconds,
      template[0].http_scale_rule,
      template[0].container[0].image,
      template[0].container[0].liveness_probe,
      template[0].container[0].readiness_probe,
      ingress[0].traffic_weight
    ]
  }
}

# ==============================================================================
# Outputs
# ==============================================================================

output "web_dev_fqdn" {
  description = "Default FQDN for the Dev frontend container app"
  value       = azurerm_container_app.web_dev.ingress[0].fqdn
}

output "web_stg_fqdn" {
  description = "Default FQDN for the Staging frontend container app"
  value       = azurerm_container_app.web_stg.ingress[0].fqdn
}
