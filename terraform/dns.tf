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

# Apex A records pointing to GitHub Pages IPv4
resource "namedotcom_record" "apex_ipv4" {
  for_each    = toset(local.github_pages_ipv4)
  domain_name = var.custom_domain
  host        = ""
  record_type = "A"
  answer      = each.value
}

# Apex AAAA records pointing to GitHub Pages IPv6
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
