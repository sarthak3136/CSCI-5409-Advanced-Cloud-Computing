data "google_client_config" "default" {}

provider "google" {
  #credentials = file("/Users/sarthakpatel/Documents/Advanced-Cloud-Computing/A1/container-1/terraform/csci5409kubernetes-53731e4fb743.json")
  project     = "csci5409kubernetes"
  region      = "us-central1"
}

provider "kubernetes" {
  host                   = "https://${module.gke.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(module.gke.ca_certificate)
}

module "gke" {
  source                     = "terraform-google-modules/kubernetes-engine/google"
  project_id                 = "csci5409kubernetes"
  name                       = "fresh-cluster"
  region                     = "us-central1"
  zones                      = ["us-central1-c"]
  network                    = "default"
  subnetwork                 = "default"
  ip_range_pods              = "cluster-pods"
  ip_range_services          = "cluster-services"
  http_load_balancing        = false
  network_policy             = false
  horizontal_pod_autoscaling = true
  filestore_csi_driver       = false
  

  node_pools = [
    {
      name                      = "default-node-pool"
      machine_type              = "e2-medium"
      node_locations            = "us-central1-c"
      min_count                 = 1
      max_count                 = 5
      local_ssd_count           = 0
      spot                      = false
      disk_size_gb              = 100
      disk_type                 = "pd-standard"
      image_type                = "COS_CONTAINERD"
      enable_gcfs               = false
      enable_gvnic              = false
      auto_repair               = true
      auto_upgrade              = true
      service_account           = "591874835214-compute@developer.gserviceaccount.com"
      preemptible               = false
      initial_node_count        = 1
    },
  ]
 
}