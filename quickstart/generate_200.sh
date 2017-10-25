. ./.env
docker exec uniquid_tabacchi_1 bitcoin-cli --rpcuser=$MINER_RPC_USER --rpcpassword=$MINER_RPC_PASSWORD --rpcconnect=$MINER_RPC_IP -rpcport=18332 -regtest generate 200
