resource "github_repository_pages" "web_pages" {
  repository = var.repository_name
  cname      = var.custom_domain

  source {
    branch = "gh-pages"
    path   = "/"
  }
}
