UNIQUID  Dev-in-a-box
=====================
Description
------------


UniquID Dev-in-a-box is a containerized environment that allow the developers to start experiments with the UniquID BLAST ecosystem.
This box provide a base set with:

* **[Dashboard]**
* **[Massive Imprinter]**
* **[Registry Backend]**
* **[Legatus Backend]**
* **[Mosquito MQTT]**

Released as a `docker-compose` project

System requirements
-------------------
- [docker engine](https://docs.docker.com/engine/installation/) v17.06+
- [docker-compose](https://docs.docker.com/compose/install/) v1.14+
- internet connection for accessing our blockchain infrastructure

Quick start
-----------

Clone repo and build docker images
```
git clone https://github.com/uniquid/dev-in-a-box.git
cd dev-in-a-box/quickstart
./uniquid build
```

Start Uniquid System
```
./uniquid start $LOCAL_IP
```
where $LOCAL_IP is a local machine ip visible from the Orchestrator App to let it access the containerized infrastructure.

Start Tank examples
-------------------
When the system is up you may want to start some [Java tank simulator](https://github.com/uniquid/tank-java) or [C tank simulator](https://github.com/uniquid/tank-c) acting as Uniquid Nodes.
`tank` script is what you need
```
# usage:
# tank {java|c} {start|stop|kill|rm} from_index [to_index]
#
# examples:

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

Tank Manager
------------
The dev-in-a-box provide a mobile application to manage the tanks provided as example.
This application called  **Tank Manager** enable you  manage the basic tank's operation

Tank manger system requirment:

* Android 6.0 or higher


How install :
* Download the [package](tank-manager/TankManager.apk)
* Connect the device to you computer
* Copy the APK on your device and launch


Check System Components
-----------------------
When system is up components are exposed to the host machine on the respective published ports:

| service          | port                      | port             |
|------------------|---------------------------|------------------|
| Imprinter        | 8090 - HTTP Services      |                  |
| Registry         | 8080 - HTTP Services      |                  |
| Legatus          | 3000 - WebSocket Services |                  |
| MQTT - Mosquitto | 1883 - TCP                | 1884 - WebSocket |
| Dashboard        | 8081 - Web Client         |                  |

### Imprinter
Check Imprinter is up on your browser at `http://localhost:8090/`

### Registry
Check Registry is up on your browser at `http://localhost:8080/`

### Legatus
Check Legatus is up on your browser at `http://localhost:3000/`

### MQTT
You may want to check MQTT is up using a web client like http://www.hivemq.com/demos/websocket-client/ and specifying host to `localhost` and the port `1884`

### Dashboard
Open your browser at `http://localhost:8081/` and start using the [Orchestrator's Dashboard](https://github.com/uniquid/orchestrator)

### Blockchain
The system is currently using our Blockchain network infrastructure.
It will be likely embedded in the box in future releases.
You may want to watch bitcoin transactions representing the contracts between nodes at our bitcoin network infrastructure  [bc-insight](http://52.167.211.151:3001/insight)

Manage System
-------------
In `quickstart` folder you'll find `uniquid` bash script, use it to manage Uniquid services, images and containers  
A few commands are available in `uniquid` script, as shown in usage help
```
Usage: ./uniquid {clean|purge|build|log|start|stop|kill}

Script for managing Uniquid dev-in-a-box
start <LOCAL_IP>: starts Uniquid system, LOCAL_IP argument is the IP of the local machine that is visible by the orchestrator app
purge: kills and removes all Uniquid's containers, images and networks
clean {imprinter|registry}: cleanup of Uniquid service's state
build: builds Uniquid's images
stop: stops Uniquid system
kill: kills Uniquid system
log: logs from Uniquid system
```
### Module configurations
`quickstart/.env` file defines a set of env variables specifying wich configuration files are injected into modules on containers' startup.
