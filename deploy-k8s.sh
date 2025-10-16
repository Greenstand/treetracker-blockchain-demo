#!/bin/bash

# Deploy TreeTracker Web application to Kubernetes

echo "🚀 Deploying TreeTracker Web to Kubernetes..."

# Create namespace
echo "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Apply ConfigMap
echo "Creating ConfigMap..."
kubectl apply -f k8s/configmap.yaml

# Deploy application
echo "Creating deployment..."
kubectl apply -f k8s/deployment.yaml

# Create service
echo "Creating NodePort service..."
kubectl apply -f k8s/service.yaml

# Wait for deployment to be ready
echo "Waiting for deployment to be ready..."
kubectl rollout status deployment/treetracker-web -n treetracker-webapp-mvp

# Get service information
echo "📋 Deployment completed!"
echo "Namespace: treetracker-webapp-mvp"
echo "Service: treetracker-web-service"
echo "NodePort: 30000"

# Display pods
echo "📦 Pods:"
kubectl get pods -n treetracker-webapp-mvp

# Display services
echo "🌐 Services:"
kubectl get services -n treetracker-webapp-mvp

# Get node IP for accessing the application
echo "🔗 Access your application at:"
echo "http://<NODE_IP>:30000"
echo ""
echo "To get your node IP, run:"
echo "kubectl get nodes -o wide"