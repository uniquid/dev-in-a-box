echo "
rpcbind=$MINER_RPC_IP
rpcallowip=$TABACCHI_IP" | cat /bitcoin/.bitcoin/bitcoin.conf.part - > /bitcoin/.bitcoin/bitcoin.conf
bitcoind
