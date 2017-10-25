docker build -t uniquid/dev-tank-java ../tank-java
docker run -d --network uniquid_default uniquid/dev-tank-java
