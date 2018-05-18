sed -i "s/\$LOCAL_IP/$LOCAL_IP/g" /html/configs/services.json 

#https://github.com/nginxinc/docker-nginx/blob/f8fad321cf58d5cbcafa3d9fa15314b8a77b5e65/mainline/stretch/Dockerfile
nginx -g "daemon off;"