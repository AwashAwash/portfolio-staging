
                         ┌──────────────────────────────┐
                         │         End Users            │
                         │  (Browser / Internet Traffic)│
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │        Cloudflare            │
                         │  - DNS                       │
                         │  - HTTPS / SSL               │
                         │  - WAF / Proxy               │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │          Nginx               │
                         │  (Reverse Proxy on VPS)      │
                         │  - Routing by domain         │
                         │  - SSL termination           │
                         └───────┬─────────┬────────────┘
                                 │         │
                ┌────────────────┘         └────────────────┐
                ▼                                           ▼
   ┌──────────────────────────┐              ┌──────────────────────────┐
   │   Production Container   │              │   Staging Container      │
   │   (portfolio-app)        │              │   (portfolio-staging)    │
   │   Port: 8080             │              │   Port: 8082             │
   └──────────────────────────┘              └──────────────────────────┘


                ┌─────────────────────────────────────────────┐
                │                CI/CD PIPELINE               │
                │                 (Jenkins)                   │
                │                                             │
                │  1. Clone GitHub Repo                      │
                │  2. Build Docker Image                     │
                │  3. Security Scan (Trivy)                  │
                │  4. (Optional) SonarQube Analysis          │
                │  5. Deploy Container                       │
                └─────────────────────────────────────────────┘
                                   │
                                   ▼
                         ┌──────────────────────────────┐
                         │          Docker              │
                         │  - Image Build               │
                         │  - Container Runtime         │
                         └──────────────────────────────┘


                ┌─────────────────────────────────────────────┐
                │           Monitoring & Observability        │
                │                                             │
                │  Prometheus  ───► Metrics Collection        │
                │  Grafana     ───► Dashboards (UI)           │
                │                                             │
                └─────────────────────────────────────────────┘


                ┌─────────────────────────────────────────────┐
                │              Security Layer                 │
                │                                             │
                │  - Trivy (Image Vulnerability Scan)         │
                │  - Fail2Ban (Brute-force protection)        │
                │  - SSH Hardening (Key-based auth)           │
                │  - Cloudflare WAF                           │
                └─────────────────────────────────────────────┘


Architecture Overview
Traffic is routed through Cloudflare, providing DNS, HTTPS, and security.
Nginx acts as a reverse proxy, routing requests to:
Production environment
Staging environment
Internal tools (Jenkins, Grafana)
Applications are containerized using Docker.
Jenkins CI/CD pipeline automates:
Code checkout
Image build
Security scanning (Trivy)
Deployment
Prometheus + Grafana provide monitoring and observability.
Security is enforced using:
Trivy (vulnerability scanning)
Fail2Ban (intrusion prevention)
SSH hardening
Cloudflare protections



<img width="1536" height="1024" alt="pipline fail" src="https://github.com/user-attachments/assets/d7ebad89-75e4-48d0-a2f4-5461d0eee58c" />






#  DevSecOps Portfolio Platform

A production-grade, self-managed **DevSecOps platform** built from scratch on a VPS, designed to simulate real-world enterprise infrastructure, CI/CD workflows, security integration, and observability.


  Overview

This project demonstrates a complete **end-to-end DevSecOps lifecycle**, evolving from a basic portfolio website into a **multi-environment, containerized, secure, and observable system**.

It reflects modern industry practices across:

 Infrastructure engineering
 CI/CD automation
 Containerization
 Security integration
 Monitoring & observability

---

 Architecture

High-level system flow:

```
User
 ↓
Cloudflare (DNS / SSL / Security)
 ↓
Nginx Reverse Proxy (VPS)
 ↓
Docker Containers
 ├── Portfolio (Production)
 ├── Portfolio (Staging)
 ├── Jenkins (CI/CD)
 └── Grafana (Monitoring)
```

 Monitoring Flow

```
Node Exporter → Prometheus → Grafana
```

  Security Flow

```
Code → Jenkins → Docker Build → Trivy Scan → Deploy
```
 Architecture diagrams and screenshots available in:

```
/opt/portfolio-staging/docs/screenshots


---

  Tech Stack

 Infrastructure

* Rocky Linux (RHEL-based)
* VPS (cloud-hosted)
* Nginx (reverse proxy + SSL termination)
* Cloudflare (DNS, HTTPS, edge security)

  Containerization

* Docker (multi-container setup)

 CI/CD

* Jenkins (pipeline automation)
* GitHub (source of truth)

  Security (DevSecOps)

* Trivy (container vulnerability scanning)
* SonarQube (on-demand code analysis)
* OWASP ZAP *(planned for DAST)*

  Monitoring & Observability

* Node Exporter
* Prometheus
* Grafana

---

##  Features

  Multi-environment setup (**Production + Staging**)
  Fully containerized deployment
  Automated CI/CD pipeline (Jenkins)
  Integrated security scanning (Trivy)
  Reverse proxy with HTTPS (Cloudflare + Nginx)
  Monitoring stack (Prometheus + Grafana)
  System hardening (firewall, SSH, Fail2Ban)
  Domain-based routing with subdomains

---

  CI/CD Pipeline

Pipeline flow:

1. Code pushed to GitHub
2. Jenkins pipeline triggered
3. Docker image built
4. Security scan using Trivy
5. Old container removed
6. New container deployed

```groovy
pipeline {
  agent any
  stages {
    stage('Clone Repo') {
      steps {
        git branch: 'main', url: '<repo-url>'
      }
    }
    stage('Build') {
      steps {
        sh 'docker build -t portfolio-app .'
      }
    }
    stage('Deploy') {
      steps {
        sh '''
        docker rm -f portfolio || true
        docker run -d -p 8080:80 portfolio-app
        '''
      }
    }
  }
}
```

---

  Environments

| Environment | Port | Purpose         |
| ----------- | ---- | --------------- |
| Production  | **** | Live deployment |
| Staging     | **** | Testing changes |
| Jenkins     | *** | CI/CD           |
| Grafana     | **** | Monitoring      |

---

  Security Implementation

 Container vulnerability scanning via **Trivy**
 HTTPS enforced via **Cloudflare + Origin Certificates**
 Nginx reverse proxy with secure headers
 Basic authentication for admin services
 System hardening:

   Firewall rules
   Fail2Ban
   SSH security practices

---

##  Monitoring Stack

Node Exporter → system metric
Prometheus → metrics collection
Grafana → dashboards & visualization

 Example dashboards:

```
/opt/portfolio-staging/docs/screenshots

```

---

 Key DevSecOps Practices Applied

 Separation of environments (prod vs staging)
 Infrastructure as reproducible setup
 CI/CD-driven deployments
 Security integrated into pipeline
 Observability-first architecture
 Reverse proxy routing with domain segmentation

---
  Challenges & Lessons Learned

Key real-world issues solved:

 Cloudflare 521 errors (origin connectivity)
 SSL misconfiguration (Flexible vs Full Strict)
 Docker container port exposure issues
 Jenkins container permission limitations
 Nginx misrouting across subdomains
 Large file handling in Git

  Example Insight

> Git is not optimized for large binary files. Videos and PDFs should be excluded using `.gitignore` or moved to external storage (e.g., S3/CDN).

---

  Repository Structure

```
.
├── assets/
├── Dockerfile
├── Jenkinsfile
├── index.html
├── .gitignore
├── .dockerignore
└── docs/
    ├── architecture/
    └── screenshots/
```

---

  Optimization Practices

 `.gitignore` used to exclude large assets (videos, PDFs)
 `.dockerignore` used to reduce build context size
 Docker image size reduced significantly through cleanup
 External asset strategy (VPS → future S3/CDN)

---

  Future Improvements (portfolio phase 2)

 OWASP ZAP integration (DAST)
 Full SonarQube pipeline integration
 Migration to S3 + CDN for assets
 Infrastructure as Code (Terraform)
 Kubernetes-based orchestration
 Ansible ( Configuration Management)
 

---

 Documentation

Full detailed documentation (with commands, diagrams, and troubleshooting):


https://www.linkedin.com/posts/activity-7424926449561686018-tUq3?utm_source=share&utm_medium=member_desktop&rcm=ACoAACY74gkBUtwskDdA_IAvKNLeRaESUXIyFis
https://www.linkedin.com/posts/activity-7412107817433812992-Q2Bd?utm_source=share&utm_medium=member_desktop&rcm=ACoAACY74gkBUtwskDdA_IAvKNLeRaESUXIyFis
youtube link - phase 1 ( shared ) phase 2 ( ubuntu ) phase 3 ( rocky linux )
documenation - pdf for all the code integration for all bundled

---

 ‍ Author

DevSecOps Engineer | Infrastructure & Automation Enthusiast

Focused on building secure, scalable, and production-ready systems aligned with enterprise practices.

---

 Final Note

This project is not just a portfolio website—it is a complete DevSecOps ecosystem, demonstrating practical implementation of:

Infrastructure → CI/CD → Security → Monitoring

in a real-world, production-style environment.

---

