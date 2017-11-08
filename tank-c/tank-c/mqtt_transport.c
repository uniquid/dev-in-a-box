/*
 * mqtt_transport.c
 *
 *  Created on: 18/nov/2016
 *      Author: M. Palumbi
 */
 
 




/* 
 * DESCRIPTION
 * worker to manage the MQTT transport
 * 
 */

/* include includes */
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include <string.h>
#include "mqtt_transport.h"
#include "helpers.h"

#define SYNCOBJECT_INITIALIZER { PTHREAD_MUTEX_INITIALIZER, PTHREAD_COND_INITIALIZER, 0 }
typedef struct {
    pthread_mutex_t mtx;
    pthread_cond_t var;
    unsigned val;
} SyncObject;

char mqtt_address[256] = DEFAULT_MQTT_ADDRESS;

//mqtt channel staus variables
static MQTTClient client = NULL;
static char *ClientID = NULL;
static char *ServerTopic = NULL;
static char *ClientTopic = NULL;


// receive buffers and synchronization variables
// Provider
static SyncObject prvdRcvSync = SYNCOBJECT_INITIALIZER;
static uint8_t   *prvdRcvMsg = NULL; //provider receive buffer
static size_t     prvdRcvLen = 0;
// User
static SyncObject usrRcvSync = SYNCOBJECT_INITIALIZER;
static uint8_t   *usrRcvMsg = NULL; //provider receive buffer
static size_t     usrRcvLen = 0;

/**
 * callback called from the MQTT library when a message arrives
 */
static int msgarrvd(void *context_, char *topicName, int topicLen, MQTTClient_message *message)
{
(void)topicLen;(void)context_;

    if (0 == strcmp(topicName, ServerTopic)) {
        // message for the provider
        pthread_mutex_lock(&(prvdRcvSync.mtx));
        if (prvdRcvSync.val) {
            // previous message still queued.
            // lets remove it
            free(prvdRcvMsg);
        }
        prvdRcvLen = message->payloadlen+1;
        prvdRcvMsg = malloc(prvdRcvLen);
        memcpy(prvdRcvMsg, message->payload, message->payloadlen);
        prvdRcvMsg[message->payloadlen] = 0;
        MQTTClient_freeMessage(&message);
        MQTTClient_free(topicName);
        prvdRcvSync.val = 1;
        pthread_cond_signal(&(prvdRcvSync.var));
        pthread_mutex_unlock(&(prvdRcvSync.mtx));
        return 1;
    }
    if (0 == strcmp(topicName, ClientTopic)) {
        // message for the user
        pthread_mutex_lock(&(usrRcvSync.mtx));
        if (usrRcvSync.val) {
            // previous message still queued.
            // lets remove it
            free(usrRcvMsg);
        }
        usrRcvLen = message->payloadlen+1;
        usrRcvMsg = malloc(usrRcvLen);
        memcpy(usrRcvMsg, message->payload, message->payloadlen);
        usrRcvMsg[message->payloadlen] = 0;
        MQTTClient_freeMessage(&message);
        MQTTClient_free(topicName);
        usrRcvSync.val = 1;
        pthread_cond_signal(&(usrRcvSync.var));
        pthread_mutex_unlock(&(usrRcvSync.mtx));
        return 1;
    }

    MQTTClient_freeMessage(&message);
    MQTTClient_free(topicName);
    return 1;
}

int mqttUserWaitMsg(uint8_t **msg, size_t *len)
{
    pthread_mutex_lock(&(usrRcvSync.mtx));
    while(0 == usrRcvSync.val) // wait for a message
        pthread_cond_wait(&(usrRcvSync.var), &(usrRcvSync.mtx));

    *msg = usrRcvMsg;
    *len = usrRcvLen;
    usrRcvSync.val = 0;
    pthread_mutex_unlock(&(usrRcvSync.mtx));
    return 0;
}

int mqttProviderWaitMsg(uint8_t **msg, size_t *len)
{
    pthread_mutex_lock(&(prvdRcvSync.mtx));
    while(0 == prvdRcvSync.val) // wait for a message
        pthread_cond_wait(&(prvdRcvSync.var), &(prvdRcvSync.mtx));

    *msg = prvdRcvMsg;
    *len = prvdRcvLen;
    prvdRcvSync.val = 0;
    pthread_mutex_unlock(&(prvdRcvSync.mtx));
    return 0;
}


static void connlost(void *context, char *cause)
{
(void)context;
    DBG_Print("\nConnection lost\n");
    DBG_Print("     cause: %s\n", cause);
    exit(-1);
}


static void mqttConnect(void)
{
    int rc;
	MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;

    // Create connection
    if (NULL == client) {
        MQTTClient_create(&client, mqtt_address, ClientID, MQTTCLIENT_PERSISTENCE_NONE, NULL);
    }
    if (NULL == client)
    {
        DBG_Print("Failed to create mqtt client\n");
        exit(-1);
    }

    if (MQTTClient_isConnected(client)) return ;
    
    MQTTClient_setCallbacks(client, NULL, connlost, msgarrvd, NULL/*delivered*/);

    // Try to connect 
    conn_opts.keepAliveInterval = 20;
    conn_opts.cleansession = 1;
    if ((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
    {
        DBG_Print("Failed to connect, return code %d\n", rc);
        exit(-1);
    }

    MQTTClient_unsubscribe(client, "#");
    if(NULL != ServerTopic) {
        MQTTClient_subscribe(client, ServerTopic, MQTT_QOS);
    }
    if(NULL != ClientTopic) {
        MQTTClient_subscribe(client, ClientTopic, MQTT_QOS);
    }

    return ;
}


// send buffers and synchronization variables
#define PROVIDER_BUFFER_HAS_DATA 1
#define USER_BUFFER_HAS_DATA 2
static SyncObject sync_msg = SYNCOBJECT_INITIALIZER;
// User
static uint8_t *usrSndMsg = NULL; //user buffer
static size_t usrSndLen = 0;
static char *usrStopic = NULL;
static char *usrRtopic = NULL;
//Provider
static uint8_t *prvdSndMsg = NULL; //provider buffer
static size_t prvdSndLen = 0;
static char *prvdStopic = NULL;

int mqttUserSendMsg(char *send_topic, char *recv_topic, uint8_t *msg, size_t size)
{

    pthread_mutex_lock(&(sync_msg.mtx));
    if (sync_msg.val & USER_BUFFER_HAS_DATA) {
        // previous message not sent. return error.
        pthread_cond_signal(&(sync_msg.var));
        pthread_mutex_unlock(&(sync_msg.mtx));
        return 1;
    }
    // flush the user receive queue
    pthread_mutex_lock(&(usrRcvSync.mtx));
    if (usrRcvSync.val) {
        // previous message still queued.
        // lets remove it
        MQTTClient_free(usrRcvMsg);
        usrRcvSync.val = 0;
    }
    pthread_mutex_unlock(&(usrRcvSync.mtx));
    usrSndMsg = malloc(size);
    usrSndLen = size;
    memcpy(usrSndMsg, msg, size);
    usrStopic = strdup(send_topic);
    usrRtopic = strdup(recv_topic);
    sync_msg.val |= USER_BUFFER_HAS_DATA;
    pthread_cond_signal(&(sync_msg.var));
    pthread_mutex_unlock(&(sync_msg.mtx));
   return 0;
}

int mqttProviderSendMsg(char *send_topic, uint8_t *msg, size_t size)
{

    pthread_mutex_lock(&(sync_msg.mtx));
    if (sync_msg.val & PROVIDER_BUFFER_HAS_DATA) {
        // previous message not sent. return error.
        pthread_cond_signal(&(sync_msg.var));
        pthread_mutex_unlock(&(sync_msg.mtx));
        return 1;
    }
    prvdSndMsg = malloc(size);
    prvdSndLen = size;
    memcpy(prvdSndMsg, msg, size);
    prvdStopic = strdup(send_topic);
    sync_msg.val |= PROVIDER_BUFFER_HAS_DATA;
    pthread_cond_signal(&(sync_msg.var));
    pthread_mutex_unlock(&(sync_msg.mtx));
   return 0;
}


/**
 * mqtt worker.
 * @param ctx point to a string used for both ClientID and the main receive topic
 */
void *mqttWorker(void *ctx)
{
    (void)ctx;

    ClientID = ctx;
    ServerTopic = ctx;
    mqttConnect();

    pthread_mutex_lock(&(sync_msg.mtx));
    while(1) {
        if (sync_msg.val & USER_BUFFER_HAS_DATA) {
            // I have an user message! working on it
            
            if(NULL != ClientTopic) {
                MQTTClient_unsubscribe(client, ClientTopic);
                free(ClientTopic);
            }
            ClientTopic = usrRtopic;
            MQTTClient_subscribe(client, ClientTopic, MQTT_QOS);

            MQTTClient_publish(client, usrStopic, usrSndLen, usrSndMsg, MQTT_QOS, 0, NULL);

            free(usrStopic);
            usrStopic = NULL;
            free(usrSndMsg);
            usrSndMsg = NULL;
            usrSndLen = 0;
            sync_msg.val ^= USER_BUFFER_HAS_DATA;
        }
        if (sync_msg.val & PROVIDER_BUFFER_HAS_DATA) {
            // I have a provider message! working on it
            
            MQTTClient_publish(client, prvdStopic, prvdSndLen, prvdSndMsg, MQTT_QOS, 0, NULL);

            free(prvdStopic);
            prvdStopic = NULL;
            free(prvdSndMsg);
            prvdSndMsg = NULL;
            prvdSndLen = 0;
            sync_msg.val ^= PROVIDER_BUFFER_HAS_DATA;
        }
        pthread_cond_wait(&(sync_msg.var), &(sync_msg.mtx));
    }
    return 0;
}


