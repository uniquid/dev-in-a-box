docker build -t uniquid/dev-tank-java ../tank-java
# MINER_IP=docker inspect uniquid_miner_1 --format "{{.NetworkSettings.Networks.uniquid_macvlan_net.IPAddress}}"
CONTAINER_ID=`docker run --env-file=.env -d  --network uniquid_macvlan_net --ip $1 uniquid/dev-tank-java`
docker network connect uniquid_dev_net $CONTAINER_ID
