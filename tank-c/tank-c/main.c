/*
 * main.c
 *
 *  Created on: 27/lug/2016
 *      Author: M. Palumbi
 */
 
 




/* 
 * DESCRIPTION
 * Sample implementation of a Service Provider (machine)
 * 
 */

/* include includes */
#include "UID_message.h"

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <unistd.h>
#include <string.h>
#include <fcntl.h>
#include <malloc.h>
#include <sys/wait.h>
#include <pthread.h>

#include "tank.h"
#include "helpers.h"
#include "UID_identity.h"
#include "UID_utils.h"
#include "UID_bchainBTC.h"
#include "UID_fillCache.h"
#include "UID_dispatch.h"
#include "MQTTClient.h"
#include "UID_capBAC.h"
#include "yajl/yajl_tree.h"
#include "mqtt_transport.h"
#include "qrencode.h"

#define _EVER_ ;;
//#define MAX_SIZEOF(var1, var2)  ( (sizeof((var1)) > sizeof((var2)) )? sizeof((var1)) : sizeof((var2)) )
//static char buf[MAX_SIZEOF(pIdentity->keyPair.privateKey, pIdentity->keyPair.publicKey)*2+1];
#define DEFAULT_INI_FILE "./tank-c.ini"
#define DEFAULT_ANNOUNCE_TOPIC "UID/announce"
#define DEFAULT_NAME_PREFIX "UID"

char *pAnnounceTopic = DEFAULT_ANNOUNCE_TOPIC;
char *pNamePrefix = DEFAULT_NAME_PREFIX;

// Update Cache Thread
// gets contracts from the BlockChain and updates the local cache
void *updateCache(void *arg)
{
	cache_buffer *cache;
	int fd;
	int ret;

	while(1)
	{
		ret = UID_getContracts(&cache);
		if ( UID_CONTRACTS_OK == ret) {
			fd = creat("ccache.bin", 0666);
			write(fd, cache->contractsCache, sizeof(UID_SecurityProfile)*(cache->validCacheEntries));
			close(fd);

			fd = creat("clicache.bin", 0666);
			write(fd, cache->clientCache, sizeof(UID_ClientProfile)*(cache->validClientEntries));
			close(fd);
		}
		else {
			DBG_Print("UID_getContracts() return %d\n", ret);
		}

	    int i;
	    char buf[161];
	    for (i = 0; i<cache->validCacheEntries;i++) {
	        printf("[[ %s %s %s ]]\n",
	            cache->contractsCache[i].serviceProviderAddress,
	            cache->contractsCache[i].serviceUserAddress,
	            tohex((uint8_t *)&(cache->contractsCache[i].profile), 80, buf));
	    }
	    for (i = 0; i<cache->validClientEntries;i++) {
	        printf("[[ %s %s <%s> ]]\n",
	            cache->clientCache[i].serviceProviderAddress,
	            cache->clientCache[i].serviceUserAddress,
	            cache->clientCache[i].serviceProviderName);
	    }
        printf("\n");

		sleep(60);
	}
	return arg;
}


void load_contracts_cache(void)
{
	int fd;

	//load the contracts cache
	extern cache_buffer *current;
	fd = open("ccache.bin", O_RDONLY);
	if (fd >= 0)
	{	// load disk cache
		(current->validCacheEntries)=0;
		while ( sizeof(UID_SecurityProfile) == read(fd, (current->contractsCache) + (current->validCacheEntries), sizeof(UID_SecurityProfile)) )
			(current->validCacheEntries)++;
		close(fd);
	}
	//load the client cache
	//extern cache_buffer *current;
	fd = open("clicache.bin", O_RDONLY);
	if (fd >= 0)
	{	// load disk cache
		(current->validClientEntries)=0;
		while ( sizeof(UID_ClientProfile) == read(fd, (current->clientCache) + (current->validClientEntries), sizeof(UID_ClientProfile)) )
			(current->validClientEntries)++;
		close(fd);
	}
	printf("loaded %d valid contracts and %d valid providers from cache\n", current->validCacheEntries, current->validClientEntries);
}

int MY_parse_result(uint8_t *buffer, size_t size, UID_ClientChannelCtx *ctx, char *res, size_t rsize, int64_t id)
{
	BTC_Address sender;
	int error = 0;
	int64_t sID;

	int ret = UID_parseRespMsg(buffer, size, sender, sizeof(sender), &error, res, rsize, &sID);
	if ( ret ) return ret;
	if (error) return UID_MSG_RPC_ERROR | error;
	if (strcmp(sender, ctx->peerid)) return UID_MSG_INVALID_SENDER;
	if (sID != id) return UID_MSG_ID_MISMATCH;
	return 0;
}

/**
 * thread implementing a Service User
 */
void *service_user(void *arg)
{
	int ret;

	char machine[UID_NAME_LENGHT] = {0};
	int method ;
	char param[250] = {0};

    DBG_Print("Address %s ClientIID %s\n\n", mqtt_address, "myname");


	while(1)
	{

		DBG_Print("\n\n------------ enter request (es. UID984fee057c6d 33 {\"hello\":\"world\"} -----------------\n\n");
		#define _STR(a) #a
		#define STR(a) _STR(a)
		if (3 != scanf("%" STR(UID_NAME_LENGHT) "s %d %" STR(sizeof(param)) "s", machine, &method, param)) continue;

		// client
		UID_ClientChannelCtx ctx;
		if ( UID_MSG_OK != (ret = UID_createChannel(machine, &ctx)) ) {
			error(0, 0, "UID_open_channel(%s) return %d\n", machine, ret);
			continue;
		}

		uint8_t buffer[1024];
		size_t size = sizeof(buffer);
		int64_t id;
		if ( UID_MSG_OK != (ret = UID_formatReqMsg(ctx.myid, method, param, buffer, &size, &id)) ) {
			error(0, 0, "UID_format_request() return %d\n", ret);
			continue;
		}
		DBG_Print("UID_format_request %s -- %d ret = %d\n",buffer,size, ret);

		mqttUserSendMsg(machine, ctx.myid, buffer, size - 1);

		uint8_t *msg;
		DBG_Print("-->\n");
		mqttUserWaitMsg(&msg, &size);
		DBG_Print("<--\n");

		DBG_Print("--------->> %s\n", msg);

		// client
		char result[1024] = "";
		if ( UID_MSG_OK != (ret = MY_parse_result(msg, size, &ctx, result, sizeof(result), id))) {
			error(0, 0, "UID_parse_result() return %d\n", ret);
			continue;
		}
		DBG_Print("UID_parse_result() %s\n", result);

		free(msg);

		UID_closeChannel(&ctx);
	}

	return arg;
}

void user_33(char *param, char *result, size_t size)
{
	snprintf(result, size, "mi hai chiesto: <%s>", param);
}

int MY_perform_request(uint8_t *buffer, size_t size, uint8_t *response, size_t *rsize, UID_ServerChannelCtx *channel_ctx)
{
    int ret;
	int method;
	int64_t sID;
	BTC_Address sender;
	char params[1024];
    char result[1024] = {0}; // must find a better way to allocate the buffer!!!
	int error;

	// parse the request
	ret = UID_parseReqMsg(buffer, size, sender, sizeof(sender), &method, params, sizeof(params), &sID);
	if (ret) return ret;
	if (strcmp(sender,channel_ctx->contract.serviceUserAddress)) return UID_MSG_INVALID_SENDER;

	// check the contract for permission
    if(UID_checkPermission(method, channel_ctx->contract.profile)) {
		if (UID_RPC_RESERVED > method) {
			// Uniquid method. call UID_performRequest
		    error = UID_performRequest(method, params, result, sizeof(result));
		}
		else {
			// user method.
			switch(method) {
				case 33:
					user_33(params, result, sizeof(result));
					error = 0;
					break;
				case F_machine:
					user_34_machine(params, result, sizeof(result));
					error = 0;
					break;
				case F_inputFaucet:
					user_35_inputFaucet(params, result, sizeof(result));
					error = 0;
					break;
				case F_outputFaucet:
					user_36_outputFaucet(params, result, sizeof(result));
					error = 0;
					break;
				case F_status:
					user_37_status(params, result, sizeof(result));
					error = 0;
					break;
				default:
					error = UID_DISPATCH_NOTEXISTENT;
					break;
			}
		}
    }
    else {
		// no permission for the method
		error = UID_DISPATCH_NOPERMISSION;
    }


	// format the response message
	ret = UID_formatRespMsg(channel_ctx->contract.serviceProviderAddress, result, error, sID, response, rsize);
	if (ret) return ret;

    return UID_MSG_OK;
}

/**
 * Check the message for capability
 */
int decodeCapability(uint8_t *msg)
{
	UID_UniquidCapability cap = {0};
	yajl_val node, v;
	int ret = 0;

	const char * assigner[] = { "assigner", (const char *) 0 };
	const char * resourceID[] = { "resourceID", (const char *) 0 };
	const char * assignee[] = { "assignee", (const char *) 0 };
	const char * rights[] = { "rights", (const char *) 0 };
	const char * since[] = { "since", (const char *) 0 };
	const char * until[] = { "until", (const char *) 0 };
	const char * assignerSignature[] = { "assignerSignature", (const char *) 0 };

    // parse message
	node = yajl_tree_parse((char *)msg, NULL, 0);
    if (node == NULL) return 0; // parse error. not a capability

    v = yajl_tree_get(node, assigner, yajl_t_string);
    if (v == NULL) goto clean_return;
    if (sizeof(cap.assigner) <= (size_t)snprintf(cap.assigner, sizeof(cap.assigner), "%s", YAJL_GET_STRING(v)))
		goto clean_return;

    v = yajl_tree_get(node, resourceID, yajl_t_string);
    if (v == NULL) goto clean_return;
    if (sizeof(cap.resourceID) <= (size_t)snprintf(cap.resourceID, sizeof(cap.resourceID), "%s", YAJL_GET_STRING(v)))
		goto clean_return;

    v = yajl_tree_get(node, assignee, yajl_t_string);
    if (v == NULL) goto clean_return;
    if (sizeof(cap.assignee) <= (size_t)snprintf(cap.assignee, sizeof(cap.assignee), "%s", YAJL_GET_STRING(v)))
		goto clean_return;

    v = yajl_tree_get(node, rights, yajl_t_string);
    if (v == NULL) goto clean_return;
	if (sizeof(cap.rights) != fromhex(YAJL_GET_STRING(v), (uint8_t *)&(cap.rights), sizeof(cap.rights)))
		goto clean_return;

    v = yajl_tree_get(node, since, yajl_t_number);
    if (v == NULL) goto clean_return;
	cap.since = YAJL_GET_INTEGER(v);

    v = yajl_tree_get(node, until, yajl_t_number);
    if (v == NULL) goto clean_return;
	cap.until = YAJL_GET_INTEGER(v);

    v = yajl_tree_get(node, assignerSignature, yajl_t_string);
    if (v == NULL) goto clean_return;
    if (sizeof(cap.assignerSignature) <= (size_t)snprintf(cap.assignerSignature, sizeof(cap.assignerSignature), "%s", YAJL_GET_STRING(v)))
		goto clean_return;

	// parsing OK. Will return 1
    ret = 1;

	// receive the capability
	int recv = UID_receiveProviderCapability(&cap);
	if (recv != UID_CAPBAC_OK) {
		DBG_Print("ERROR receiving capability: UID_receiveProviderCapability() returns %d\n", recv);
	}
	else {
		DBG_Print("Valid capability received!!\n");
	}

clean_return:
    if (NULL != node) yajl_tree_free(node);
    return ret;
}

/**
 * thread implementing a Service Provider
 */
void* service_provider(void *arg)
{
	int ret;

	// Provider infinite loop
	while(1)
	{
		uint8_t *msg;
		size_t size;
		mqttProviderWaitMsg(&msg, &size);
		if(decodeCapability(msg)) {
			// got capability
			free(msg);
			continue;
		}
		// server
		UID_ServerChannelCtx sctx;
		uint8_t sbuffer[1024];
		size_t ssize = sizeof(sbuffer);
		ret = UID_accept_channel(msg, size, &sctx, sbuffer, &ssize);

		free(msg);

		if ( UID_MSG_OK != ret) {
			error(0, 0, "UID_accept_channel() return %d\n", ret);
			continue;
		}
		DBG_Print("contract %s %s %d\n", sctx.contract.serviceUserAddress, sctx.contract.serviceProviderAddress, sctx.contract.profile.bit_mask[0]);

		DBG_Print("UID_accept_channel %s -- %d\n", sbuffer, ssize);
		uint8_t response[1024];
		size_t respsize = sizeof(response);
		if ( UID_MSG_OK != (ret = MY_perform_request(sbuffer, ssize, response, &respsize, &sctx))) {
			error(0, 0, "UID_perform_request() return %d\n", ret);
			continue;
		}
		DBG_Print("UID_perform_request %s - %d\n", response, respsize);

		mqttProviderSendMsg(sctx.contract.serviceUserAddress, response, respsize - 1);

		UID_closeServerChannel(&sctx);
	}

	return arg;
}

static int fake = 0;
static char lbuffer[1024];
static char applianceUrl[256]= {0};
static char registryUrl[256]= {0};
static char announceTopic[256] = {0};
static char namePrefix[UID_NAME_LENGHT - 12 - 1] = {0};

/**
 * loads configuration parameters from ini_file - ./tank-c.ini
 *
 * es file format:
 *
 * debug level: 7
 * fake MAC: 1
 * name_prefix: UID
 * mqtt_address: tcp://10.0.0.4:1883
 * announce_topic: UID/announce
 * UID_appliance: http://appliance3.uniquid.co:8080/insight-api
 * UID_registry: http://appliance4.uniquid.co:8080/registry
 * UID_confirmations: 1
 */
void loadConfiguration(char *ini_file)
{
	FILE *f_ini;
	char format[64];

	if (NULL == ini_file) ini_file = DEFAULT_INI_FILE;
	if ((f_ini = fopen(ini_file, "r")) != NULL) {
		while(fgets(lbuffer, sizeof(lbuffer), f_ini) != NULL) {
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wformat-nonliteral"

			snprintf(format, sizeof(format),  "mqtt_address: %%%zus\n", sizeof(mqtt_address) - 1);
			sscanf(lbuffer, format,  mqtt_address);

			snprintf(format, sizeof(format),  "UID_appliance: %%%zus\n", sizeof(applianceUrl) - 1);
			if (1 == sscanf(lbuffer, format,  applianceUrl)) UID_pApplianceURL = applianceUrl;

			snprintf(format, sizeof(format),  "UID_registry: %%%zus\n", sizeof(registryUrl) - 1);
			if (1 == sscanf(lbuffer, format,  registryUrl)) UID_pRegistryURL = registryUrl;

			snprintf(format, sizeof(format),  "announce_topic: %%%zus\n", sizeof(announceTopic) - 1);
			if (1 == sscanf(lbuffer, format,  announceTopic)) pAnnounceTopic = announceTopic;

			snprintf(format, sizeof(format),  "name_prefix: %%%zus\n", sizeof(namePrefix) - 1);
			if (1 == sscanf(lbuffer, format,  namePrefix)) pNamePrefix = namePrefix;

#pragma GCC diagnostic pop

			sscanf(lbuffer, "fake MAC: %d\n", &fake);
			sscanf(lbuffer, "debug level: %d\n", &dbg_level);
			sscanf(lbuffer, "UID_confirmations: %d\n", &UID_confirmations);
		}
		fclose(f_ini);
	}
	else {
		DBG_Print("ini file %s not found\n", ini_file);
	}
}

char *bw[4] = {
    " ",
    "\xe2\x96\x80",
    "\xe2\x96\x84",
    "\xe2\x96\x88"
    };

char *wb[4] = {
    "\xe2\x96\x88",
    "\xe2\x96\x84",
    "\xe2\x96\x80",
    " "
    };

void text_qr(QRcode *qr, char *dot[])
{
	int i,j,w;
	int ddcode;

	w = qr->width;

	for(j=0;j<(w + 8);j++) {
		printf("%s", dot[0]);
	}
	printf("\n");
	for(j=0;j<(w + 8);j++) {
		printf("%s", dot[0]);
	}
	printf("\n");

	for (i=1;i<w;i+=2) {
		printf("%s%s%s%s", dot[0], dot[0], dot[0], dot[0] );
		for(j=0;j<w;j++) {
			ddcode = (qr->data[(i-1)*w+j]&0x1) + ((qr->data[i*w+j]&0x1)<<1);
			printf( "%s", dot[ddcode] );
		}
		printf("%s%s%s%s\n", dot[0], dot[0], dot[0], dot[0] );
	}
	printf("%s%s%s%s", dot[0], dot[0], dot[0], dot[0] );
	for(j=0;j<w;j++) {
		ddcode = (qr->data[(i-1)*w+j]&0x1);
		printf( "%s", dot[ddcode] );
	}
	printf("%s%s%s%s\n", dot[0], dot[0], dot[0], dot[0] );

	for(j=0;j<(w + 8);j++) {
		printf("%s", dot[0]);
	}
	printf("\n");
	for(j=0;j<(w + 8);j++) {
		printf("%s", dot[0]);
	}
	printf("\n");
}

char myname[UID_NAME_LENGHT];

/**
 * main - simple tank simulator featuring a "Uniquid Machine" reference implemetation
 */
int main( int argc, char **argv )
{
	pthread_t thr;

	DBG_Print("Hello!!!!\n");

	(program_name=strrchr(argv[0],'/'))?program_name++ :(program_name=argv[0]);
	loadConfiguration(NULL);

	printf ("fake MAC %d\n",fake);
	printf ("debug level %d\n",dbg_level);
	printf ("MQTT broker address %s\n", mqtt_address);

	if ( argc != 1 ) {
		printf("Usage: %s\n", program_name);
		printf("es: %s\n\n", program_name);
		exit(1);
	}

	UID_getLocalIdentity(NULL);

	DBG_Print("tpub: %s\n", UID_getTpub());

	uint8_t *mac = getMacAddress(fake);
	snprintf(myname, sizeof(myname), "%s%02x%02x%02x%02x%02x%02x",pNamePrefix, mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
	DBG_Print("Uniqe name %s\n", myname);

	signal(SIGCHLD, SIG_IGN);  // prevents the child process to become zombies
	//restarts the machine if it dies (es. if it is called some error exit)
	pid_t pid;
	while(1) if ((pid = fork()) == 0) break;
			else wait(NULL);

    // start the mqttWorker thread
	pthread_create(&thr, NULL, mqttWorker, myname);

	snprintf(lbuffer, sizeof(lbuffer), "{\"name\":\"%s\",\"xpub\":\"%s\"}", myname, UID_getTpub());
	QRcode *qr = QRcode_encodeString(lbuffer, 0, 1, QR_MODE_8, 1);
	text_qr(qr, bw);
	text_qr(qr, wb);
	mqttProviderSendMsg(pAnnounceTopic, (uint8_t *)lbuffer, strlen(lbuffer));
	DBG_Print("%s\n", lbuffer);

	load_contracts_cache();
	// start the the thread that updates the 
	// contracts cache from the blockchiain
	pthread_create(&thr, NULL, updateCache, NULL);

	// start the tank thread
	pthread_create(&thr, NULL, tank, NULL);

	// start the "user" thread
	pthread_create(&thr, NULL, service_user, NULL);

	// start the "provider" thread
	pthread_create(&thr, NULL, service_provider, NULL);

	for(_EVER_) sleep(100); // wait for ever

	exit( 0 );
}

/**
 * test for the UID_matchContract() and UID_matchProvider
 */
void test_match(void)
{
	UID_SecurityProfile *contract;
	char *uaddr = "my3CohS9f57yCqNy4yAPbBRqLaAAJ9oqXV";
	if (NULL == (contract = UID_matchContract(uaddr))) printf("UID_matchContract(%s) return NULL\n", uaddr);
	else printf("%s %s %d\n",contract->serviceUserAddress, contract->serviceProviderAddress, contract->profile.bit_mask[3]);
	uaddr = "pappo";
	if (NULL == (contract = UID_matchContract(uaddr))) printf("UID_matchContract(%s) return NULL\n", uaddr);
	else printf("%s %s %d\n",contract->serviceUserAddress, contract->serviceProviderAddress, contract->profile.bit_mask[3]);
	uaddr = "myUFCeVGwkJv3PXy4zc1KSWRT8dC5iTvhU";
	if (NULL == (contract = UID_matchContract(uaddr))) printf("UID_matchContract(%s) return NULL\n", uaddr);
	else printf("%s %s %d\n\n",contract->serviceUserAddress, contract->serviceProviderAddress, contract->profile.bit_mask[3]);

	UID_ClientProfile *client;
	uaddr = "LocalMachine";
	if (NULL == (client = UID_matchProvider(uaddr))) printf("UID_matchProvider(%s) return NULL\n", uaddr);
	else printf("%s %s %s\n\n", client->serviceProviderName, client->serviceUserAddress, client->serviceProviderAddress);
}

/**
 * Test code for the message functions of the library
 */
void test_message(char *machine, int method, char *param)
{
		int ret;
		// client
		//char *machine = argv[1];//"LocalMachine";
		UID_ClientChannelCtx ctx;
		if ( UID_MSG_OK != (ret = UID_createChannel(machine, &ctx)) ) {
			error(1, 0, "UID_open_channel(%s) return %d\n", machine, ret);
		}

		uint8_t buffer[1024];
		size_t size = sizeof(buffer);
		int64_t id;
		if ( UID_MSG_OK != (ret = UID_formatReqMsg(ctx.myid, method, param, buffer, &size,  &id)) ) {
			error(1, 0, "UID_format_request() return %d\n", ret);
		}
		DBG_Print("UID_format_request %s -- %d ret = %d\n",buffer,size, ret);

		// server
		UID_ServerChannelCtx sctx;
		uint8_t sbuffer[1024];
		size_t ssize = sizeof(sbuffer);
		if ( UID_MSG_OK != (ret = UID_accept_channel(buffer, size, &sctx, sbuffer, &ssize))) {
			error(1, 0, "UID_accept_channel() return %d\n", ret);
		}
		DBG_Print("contract %s %s %d\n", sctx.contract.serviceUserAddress, sctx.contract.serviceProviderAddress, sctx.contract.profile.bit_mask[0]);

		DBG_Print("UID_accept_channel %s -- %d\n", sbuffer, ssize);
		uint8_t response[1024];
		size_t respsize = sizeof(response);
		if ( UID_MSG_OK != (ret = MY_perform_request(sbuffer, ssize, response, &respsize, &sctx))) {
			error(1, 0, "UID_perform_request() return %d\n", ret);
		}
		DBG_Print("UID_perform_request %s - %d\n", response, respsize);

		UID_closeServerChannel(&sctx);

		// client
		char result[1024] = "";
		if ( UID_MSG_OK != (ret = MY_parse_result(response, respsize, &ctx, result, sizeof(result), id))) {
			error(1, 0, "UID_parse_result() return %d\n", ret);
		}
		DBG_Print("UID_parse_result() %s\n", result);

		UID_closeChannel(&ctx);
}
