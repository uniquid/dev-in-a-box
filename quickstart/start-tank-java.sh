docker build -t uniquid/dev-tank-java ../tank-java
docker run -d --network uniquid_default --name=tank-java-$1 uniquid/dev-tank-java 
