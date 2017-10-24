# sed -i '/bc.peers=/d' ./config.properties
# echo "bc.peers=$MINER_RPC_IP" >> ./config.properties
# cat config.properties
java -jar massive-imprinter-0.1-RC1-SNAPSHOT-jar-with-dependencies.jar config.properties
