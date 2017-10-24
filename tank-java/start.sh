sed -i '/bc.peers=/d' ./config.properties
echo "bc.peers=$MINER_RPC_IP" >> ./config.properties
cat config.properties
java -jar tank-java-0.1-RC1-SNAPSHOT-jar-with-dependencies.jar config.properties
