# TreeTracker Web Kubernetes Deployment

This directory contains Kubernetes manifests to deploy the TreeTracker Web application in a Kubernetes cluster.

## 🚀 Quick Deployment

The application is now deployed in the `treetracker-webapp-mvp` namespace and accessible via NodePort.

### Current Status
- **Namespace**: `treetracker-webapp-mvp`
- **Service**: `treetracker-web-service`
- **NodePort**: `30000`
- **Replicas**: 2 pods
- **Image**: nginx:alpine (demo - replace with actual TreeTracker image)

### Access the Application
```bash
# Get node external IP
kubectl get nodes -o wide

# Access via any node IP:
http://<NODE_IP>:30000
```

## 📋 Deployment Commands

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy ConfigMap
kubectl apply -f k8s/configmap.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml

# Create service
kubectl apply -f k8s/service.yaml

# Or use the deployment script
./deploy-k8s.sh
```

## 🔧 Deployed Resources

### Pods
```bash
kubectl get pods -n treetracker-webapp-mvp
```

### Services
```bash
kubectl get services -n treetracker-webapp-mvp
```

### Full Status
```bash
kubectl get all -n treetracker-webapp-mvp
```

## 🐳 Using Actual TreeTracker Image

To deploy the actual TreeTracker application instead of the demo nginx:

### Option 1: Push to Registry
```bash
# Tag and push to Docker Hub
docker tag treetracker-web:latest your-username/treetracker-web:latest
docker push your-username/treetracker-web:latest

# Update deployment.yaml
sed -i 's|nginx:alpine|your-username/treetracker-web:latest|g' k8s/deployment.yaml
sed -i 's|containerPort: 80|containerPort: 3000|g' k8s/deployment.yaml
sed -i 's|port: 80|port: 3000|g' k8s/deployment.yaml

# Redeploy
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Option 2: Local Registry
```bash
# Start local registry
docker run -d -p 5000:5000 --restart=always --name registry registry:2

# Tag and push
docker tag treetracker-web:latest localhost:5000/treetracker-web:latest
docker push localhost:5000/treetracker-web:latest

# Update deployment to use local registry
sed -i 's|nginx:alpine|localhost:5000/treetracker-web:latest|g' k8s/deployment.yaml
```

## 🔍 Monitoring & Debugging

### View Logs
```bash
kubectl logs -n treetracker-webapp-mvp -l app=treetracker-web
```

### Describe Pods
```bash
kubectl describe pods -n treetracker-webapp-mvp
```

### Port Forward (for testing)
```bash
kubectl port-forward -n treetracker-webapp-mvp service/treetracker-web-service 3000:80
```

### Scale Deployment
```bash
kubectl scale deployment treetracker-web --replicas=3 -n treetracker-webapp-mvp
```

## 🌐 External Access

The service is configured as NodePort on port 30000. Access options:

1. **Direct Node Access**: `http://<NODE_IP>:30000`
2. **Load Balancer**: Configure an external load balancer pointing to node IPs
3. **Ingress**: Set up an Ingress controller for domain-based routing

### Example Ingress (Optional)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: treetracker-web-ingress
  namespace: treetracker-webapp-mvp
spec:
  rules:
  - host: treetracker.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: treetracker-web-service
            port:
              number: 80
```

## 🔧 Configuration

### Environment Variables
Configured via ConfigMap (`k8s/configmap.yaml`):
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_HYPERLEDGER_ENDPOINT`
- `NEXT_PUBLIC_MAP_DEFAULT_LAT`
- `NEXT_PUBLIC_MAP_DEFAULT_LNG`
- `NEXT_PUBLIC_MAP_DEFAULT_ZOOM`

### Resource Limits
- **CPU**: 250m request, 500m limit
- **Memory**: 256Mi request, 512Mi limit

## 🗑️ Cleanup

```bash
# Delete all resources
kubectl delete namespace treetracker-webapp-mvp

# Or delete individual resources
kubectl delete -f k8s/service.yaml
kubectl delete -f k8s/deployment.yaml
kubectl delete -f k8s/configmap.yaml
kubectl delete -f k8s/namespace.yaml
```

## 📊 Current Node Information

Your cluster nodes:
```
NAME                             STATUS   ROLES    AGE     VERSION   EXTERNAL-IP
cloud-services-node-pool-pys00   Ready    <none>   7d19h   v1.31.9   165.227.31.112
cloud-services-node-pool-pys01   Ready    <none>   7d19h   v1.31.9   159.89.146.66
cloud-services-node-pool-pys0d   Ready    <none>   7d19h   v1.31.9   178.128.5.14
cloud-services-node-pool-pys0z   Ready    <none>   7d19h   v1.31.9   159.89.130.99
default-node-pool-pyspl          Ready    <none>   7d19h   v1.31.9   138.68.48.19
microservices-node-pool-pys95    Ready    <none>   7d19h   v1.31.9   165.22.139.100
microservices-node-pool-pys9h    Ready    <none>   7d19h   v1.31.9   206.189.212.232
microservices-node-pool-pys9k    Ready    <none>   7d19h   v1.31.9   138.68.41.39
monitoring-node-pool-py537       Ready    <none>   7d19h   v1.31.9   138.68.56.158
```

**Access your application at any of these URLs:**
- http://165.227.31.112:30000
- http://159.89.146.66:30000
- http://178.128.5.14:30000
- http://159.89.130.99:30000
- http://138.68.48.19:30000
- http://165.22.139.100:30000
- http://206.189.212.232:30000
- http://138.68.41.39:30000
- http://138.68.56.158:30000