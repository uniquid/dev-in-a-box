docker build -t uniquid/dev-tank-java ../tank-java
docker run -d --network uniquid_default --name=java_tank_$1 -v=java_tank_$1_volume:/db/ uniquid/dev-tank-java 
