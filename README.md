UNIQUID  Dev-in-a-box [0.0.1]
====================
Description
------------


UniquID Dev-in-a-box is a containerized environment that allow the developers to start experiments with the UniquID BLAST ecosystem.
This box provide a base set with:

* **[Dashboard]**
* **[Massive Imprinter]**
* **[Orchestrator Backend]**
* **[Registry Backend]**
* **[Legatus Backend]**
* **[Mosquito MQTT]**

Released as a `docker-compose` project

System requirements
-------------------
- [docker engine](https://docs.docker.com/engine/installation/)
- [docker-compose](https://docs.docker.com/compose/install/)
- internet connection for accessing our blockchain infrastructure

Quick start
-----------

Clone repo and build docker images
```
git clone https://github.com/uniquid/dev-in-a-box.git
cd quickstart
./build.sh
```
Start system
```
docker-compose up
```
When the system is up you may want to start some [Java tank simulator](https://github.com/uniquid/tank-java) acting as IOT device.
The tank start script takes an id as argument, appended to the newly started tank-java container's name
```
# starts a java tank container named tank-java-1

./start-tank-java.sh 1
```

