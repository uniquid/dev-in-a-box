/**
 * @file   mqtt_transport.h
 *
 * @date   18/nov/2016
 * @author M. Palumbi
 */

#ifndef __MQTT_TRANSPORT_H
#define __MQTT_TRANSPORT_H

#include <stdint.h>
#include "MQTTClient.h"

#define DEFAULT_MQTT_ADDRESS     "tcp://broker.mqttdashboard.com:1883"
#define MQTT_QOS 1

extern char mqtt_address[256];

typedef struct {
    MQTTClient client;
    char *ClientID;
    char *ServerTopic;
    char *ClientTopic;
} MqttChannel;


//void mqttTest (void);

#define mqttFree(ptr) MQTTClient_free(ptr)

void *mqttWorker(void *ctx);
int mqttUserWaitMsg(uint8_t **msg, size_t *len);
int mqttProviderWaitMsg(uint8_t **msg, size_t *len);
int mqttUserSendMsg(char *send_topic, char *recv_topic, uint8_t *msg, size_t size);
int mqttProviderSendMsg(char *send_topic, uint8_t *msg, size_t size);


#endif //__MQTT_TRANSPORT_H
