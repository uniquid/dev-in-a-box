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
cd dev-in-a-box/quickstart
./build.sh
```
Start system
```
docker-compose up
```
When the system is up you may want to start some [Java tank simulator](https://github.com/uniquid/tank-java) or [C tank simulator](https://github.com/uniquid/tank-c) acting as Uniquid Nodes.
```
# usage:
# tank {java|c} {start|stop|kill|rm} from_index [to_index]
#
# examples:
#
# start a java tank container named tank-java-1
./tank java start 1
# start 3 c tank containers named tank-c-2 ... tank-c-4
./tank c start 2 4
# stop from tank-java-3 to tank-java-5
./tank c stop 3 5
# kill tank-java-3
./tank java kill 3
# remove tank-java-2 to tank-java-6
./tank java rm 2 6
```

Open your browser at `http://localhost:8081/` and start using the [Orchestrator's Dashboard](https://github.com/uniquid/orchestrator) and watch bitcoin transactions describing the contracts between nodes at our infrastructure [bc-insight](http://52.167.211.151:3001/insight)

