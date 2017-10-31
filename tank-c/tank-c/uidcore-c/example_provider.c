#include <stdint.h>
#include <stdio.h>
#include <string.h>

#include "UID_message.h"
#include "UID_dispatch.h"

// example of user-defined method
void user_33(char *param, char *result, size_t size)
{
	snprintf(result, size, "you request: <%s>", param);
}


int perform_request(uint8_t *buffer, size_t size, uint8_t *response, size_t *rsize, UID_ServerChannelCtx *channel_ctx)
{
    int ret;
	int method;
	int64_t sID;
	BTC_Address sender;
	char params[1024];
    char result[1024] = {0};
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
 * thread implementing a Service Provider
 */
void* service_provider(void *arg)
{
	(void)arg;
	int ret;

	// Provider infinite loop
	while(1)
	{
		uint8_t msg[1024] = {0};
		size_t size = 0;

//		< Wait_for_Msg_from_user(msg, &size) >

		// create the contest for the communication (contract, identities of the peers, etc)
		UID_ServerChannelCtx sctx;
		uint8_t sbuffer[1024];
		size_t ssize = sizeof(sbuffer);
		ret = UID_accept_channel(msg, size, &sctx, sbuffer, &ssize);

		if ( UID_MSG_OK != ret) {

//			< manage_error(ret) >

			continue;
		}

		// perform the request
		uint8_t response[1024];
		size_t respsize = sizeof(response);
		if ( UID_MSG_OK != (ret = perform_request(sbuffer, ssize, response, &respsize, &sctx))) {

//			< manage_error(ret) >

			continue;
		}

//		< Send_Msg_to_user(response, respsize - 1) >

		UID_closeServerChannel(&sctx);
	}

	return NULL;
}
