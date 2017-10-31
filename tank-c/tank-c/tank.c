/*
 * tank.c
 *
 *  Created on: 29/aug/2016
 *      Author: M. Palumbi
 */
 
 




/* 
 * DESCRIPTION
 * tank simulator
 * tank thread simulates a tank with an in faucet and an out faucet.
 * The tank level rises or lower according with the faucets state
 * 
 */

/* include includes */
#include <stdlib.h>
#include <stdbool.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdint.h>
#include <fcntl.h>
#include "helpers.h"
#include "tank.h"
#include "MQTTClient.h"
#include "mqtt_transport.h"

#define MAX_LEVEL 1000

static int level = 0;
static bool in_faucet = 0;
static bool out_faucet = 0;
static bool status=0;

//#define ADDRESS     "tcp://broker.mqttdashboard.com:1883"
//#define ADDRESS "ns:iothub-ns-uniquidhub-65876-ba1f839590.servicebus.windows.net"
//#define ADDRESS     "tcp://mqtt.thingstud.io:1883"
#define ADDRESS     mqtt_address
extern char myname[];
#define CLIENTID    (myname + 3) //"clientId-e3oi7mTt7M"
#define QOS         1
#define TIMEOUT     10000L

static char topic[50];
static MQTTClient client;
static MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;

static int CloseMachine(char *ReturnData, int ReturnLength);

void *tank(void *arg)
{
    int _level;
    int flevel;
//    int rc;
    int count = 0;
    char payload[200];
    MQTTClient_message pubmsg = MQTTClient_message_initializer;

    snprintf(topic,sizeof(topic),"/outbox/%s/status",myname);

    flevel = open("level", O_RDWR | O_CREAT,  0644);
    read(flevel, &level, sizeof level);
    DBG_Print("##### level %d ############\n", level);

    MQTTClient_create(&client, ADDRESS, CLIENTID, MQTTCLIENT_PERSISTENCE_NONE, NULL);

//    conn_opts.keepAliveInterval = 20;
//    conn_opts.cleansession = 1;
//    if ((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
//    {
//        printf("Failed to connect, return code %d\n", rc);
//        exit(-1);
//    }
    
    while(1)
    {
        _level = level;
        if ( in_faucet == true) _level += 1; // if in_faucet is open add some wather
        if (out_faucet == true) _level -= 2; // if out_faucet is open drop some wather
        _level = _level < MAX_LEVEL ? _level : MAX_LEVEL; // clamp level to MAX_LEVEL
        _level = _level > 0 ? _level : 0; // clamp level to 0
        level = _level;
        pwrite(flevel, &level, sizeof(level), 0);
        //if (level >= 80) { in_faucet = 0; out_faucet = 1; }
        //if (level <= 20) { in_faucet = 1; out_faucet = 0; }

        if (((0x01&count++) == 0) && status) // publish on mqtt
        {
            pubmsg.payload = payload;
            pubmsg.payloadlen = snprintf(payload, sizeof(payload), "{\"series\":[%d],\"message\":\"in %s out %s\"}", level, in_faucet?"ON":"OFF", out_faucet?"ON":"OFF");
            pubmsg.qos = QOS;
            pubmsg.retained = 0;
            if(MQTTClient_publishMessage(client, topic, &pubmsg, NULL) != 0) // lost connection to the broker. close the machine
            {
                //CloseMachine("", 0);
            }
        }

        usleep(500000); // sleep for 0.5 seconds
    }
    return arg;
}

// serviceUser is passed in ReturnData 
static int OpenInFaucet(char *ReturnData, int ReturnLength)
{
    if(status == false) return -1; // machine closed
    in_faucet = 1;
    return snprintf(ReturnData , ReturnLength, "\nOpening in faucet\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}

// serviceUser is passed in ReturnData 
static int CloseInFaucet(char *ReturnData, int ReturnLength)
{
    if(status == false) return -1; // machine closed
    in_faucet = 0;
    return snprintf(ReturnData , ReturnLength, "\nClosing in faucet\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}

// serviceUser is passed in ReturnData 
static int OpenOutFaucet(char *ReturnData, int ReturnLength)
{
    if(status == false) return -1; // machine closed
    out_faucet = 1;
    return snprintf(ReturnData , ReturnLength, "\nOpening out faucet\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}

// serviceUser is passed in ReturnData 
static int CloseOutFaucet(char *ReturnData, int ReturnLength)
{
    if(status == false) return -1; // machine closed
    out_faucet = 0;
    return snprintf(ReturnData , ReturnLength, "\nClosing out faucet\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}

static char closeMsg[] = "{\"series\":[0],\"message\":\"CLOSED\"}";
static MQTTClient_willOptions will = {{'M','Q','T','W'}, 0, "", closeMsg, 1, 2 };


static char info[] = "{\"deviceInfo\":{\"name\":\"TankSimulator\",\"endPoints\":{\"status\":{\"values\":{\"labels\": [\" \"],\"series\": [0],\"message\":\"CLOSED\"},\"total\": 1000,\"centerSum\": 1,\"card-type\": \"crouton-chart-donut\"}},\"description\": \"Uniquid Tank Simulator\",\"status\": \"good\"}}";
// serviceUser is passed in ReturnData 
static int OpenMachine(char *ReturnData, int ReturnLength)
{
    int rc;
    char deviceinfo[50];

    will.topicName = topic;
    conn_opts.keepAliveInterval = 20;
    conn_opts.cleansession = 1;
    conn_opts.username = "guest";
    conn_opts.password = "guest";
    conn_opts.will = &will;

    if ((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
    {
        printf("Failed to connect, return code %d\n", rc);
    }
    status = true;
    snprintf(deviceinfo,sizeof(deviceinfo),"/outbox/%s/deviceInfo",myname);
    MQTTClient_publish(client, deviceinfo, strlen(info), info, MQTT_QOS, 0, NULL);

    LOG_print("OpenMachine from %s\n",  ReturnData);
    return snprintf(ReturnData , ReturnLength, "\nOpening Machine\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}

// serviceUser is passed in ReturnData 
static int CloseMachine(char *ReturnData, int ReturnLength)
{
    MQTTClient_message pubmsg = MQTTClient_message_initializer;

    status = false;
    in_faucet = false;
    out_faucet = false;

    pubmsg.payload = closeMsg;
    pubmsg.payloadlen = sizeof(closeMsg)-1;
    pubmsg.qos = 1;
    pubmsg.retained = 1;
    MQTTClient_publishMessage(client, topic, &pubmsg, NULL); // publish close message

    MQTTClient_disconnect(client, 10000);
    LOG_print("CloseMachine from %s\n",  ReturnData);
    return snprintf(ReturnData , ReturnLength, "\nClosing Machine\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}

/**
 * open/close the machine
 * @param[in] param "open" or "close"
 */
void user_34_machine(char *param, char *result, size_t size)
{
    if (strcmp(param, "open") == 0) {
        OpenMachine(result, size);
        return;
    }
    if (strcmp(param, "close") == 0) {
        CloseMachine(result, size);
        return;
    }
	snprintf(result, size, "Bad parameter <%s>", param);
}

/**
 * open/close the input faucet
 * @param[in] param "open" or "close"
 */
void user_35_inputFaucet(char *param, char *result, size_t size)
{
    if (strcmp(param, "open") == 0) {
        OpenInFaucet(result, size);
        return;
    }
    if (strcmp(param, "close") == 0) {
        CloseInFaucet(result, size);
        return;
    }
	snprintf(result, size, "Bad parameter <%s>", param);
}

/**
 * open/close the output faucet
 * @param[in] param "open" or "close"
 */
void user_36_outputFaucet(char *param, char *result, size_t size)
{
    if (strcmp(param, "open") == 0) {
        OpenOutFaucet(result, size);
        return;
    }
    if (strcmp(param, "close") == 0) {
        CloseOutFaucet(result, size);
        return;
    }
	snprintf(result, size, "Bad parameter <%s>", param);
}

/**
 * returns the status
 */
void user_37_status(char *param, char *result, size_t size)
{
    (void) param;
    snprintf(result , size, "\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}
