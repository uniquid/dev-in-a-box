echo "    \"tabacchiApiUrl\": \"http://$TABACCHI_IP:8000/\"
  }
}" | cat conf.json.part - > /html/conf.json
nginx -g "daemon off;"
