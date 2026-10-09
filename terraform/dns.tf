locals {
  github_pages_ipv4 = [
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153"
  ]

  github_pages_ipv6 = [
    "2606:50c0:8000::153",
    "2606:50c0:8001::153",
    "2606:50c0:8002::153",
    "2606:50c0:8003::153"
  ]
}

# Apex A records pointing to GitHub Pages IPv4 (Production)
resource "namedotcom_record" "apex_ipv4" {
  for_each    = toset(local.github_pages_ipv4)
  domain_name = var.custom_domain
  host        = ""
  record_type = "A"
  answer      = each.value
}

# Apex AAAA records pointing to GitHub Pages IPv6 (Production)
resource "namedotcom_record" "apex_ipv6" {
  for_each    = toset(local.github_pages_ipv6)
  domain_name = var.custom_domain
  host        = ""
  record_type = "AAAA"
  answer      = each.value
}

# CNAME record for www subdomain pointing to GitHub Pages host
resource "namedotcom_record" "www" {
  domain_name = var.custom_domain
  host        = "www"
  record_type = "CNAME"
  answer      = "${var.github_owner}.github.io."
}

# CNAME record for dev subdomain pointing to Azure Container App
resource "namedotcom_record" "dev" {
  domain_name = var.custom_domain
  host        = "dev"
  record_type = "CNAME"
  answer      = "${azurerm_container_app.web_dev.ingress[0].fqdn}."
}

# Domain verification TXT record for Azure Container Apps Dev
resource "namedotcom_record" "dev_asuid" {
  domain_name = var.custom_domain
  host        = "asuid.dev"
  record_type = "TXT"
  answer      = azurerm_container_app.web_dev.custom_domain_verification_id
}

# CNAME record for staging subdomain pointing to Azure Container App
resource "namedotcom_record" "staging" {
  domain_name = var.custom_domain
  host        = "staging"
  record_type = "CNAME"
  answer      = "${azurerm_container_app.web_stg.ingress[0].fqdn}."
}

# Domain verification TXT record for Azure Container Apps Staging
resource "namedotcom_record" "staging_asuid" {
  domain_name = var.custom_domain
  host        = "asuid.staging"
  record_type = "TXT"
  answer      = azurerm_container_app.web_stg.custom_domain_verification_id
}
