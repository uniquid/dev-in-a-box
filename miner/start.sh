# echo "rpcbind=$(getent hosts miner | awk '{ print $1 }')
# rpcallowip=$(getent hosts tabacchi | awk '{ print $1 }')" | cat /bitcoin/.bitcoin/bitcoin.conf.part - > /bitcoin/.bitcoin/bitcoin.conf
# echo "rpcbind=172.18.0.10
# rpcallowip=172.18.0.0/16" | cat /bitcoin/.bitcoin/bitcoin.conf.part - > /bitcoin/.bitcoin/bitcoin.conf
# cat /bitcoin/.bitcoin/bitcoin.conf
bitcoind -conf=/bitcoin/bitcoin.conf
