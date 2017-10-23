# usage :
# ./uniquid_docker_setup.sh <network_name> <subnet_mask> <gateway_ip>
# ie: ./uniquid_docker_setup.sh enxa0cec8129a6b 192.168.1.0/24 192.168.1.1
NETWORK_NAME=devinabox_uniquid_net
docker network rm $NETWORK_NAME 2> /dev/null
docker network create -d macvlan -o parent=$1 --subnet=$2 --gateway=$3 $NETWORK_NAME
