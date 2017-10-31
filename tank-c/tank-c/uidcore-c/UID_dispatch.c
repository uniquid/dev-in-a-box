/*
 * @file   UID_dispatch.c
 *
 * @date   27/oct/2016
 * @author M. Palumbi
 */

/**
 * @file UID_dispatch.h
 *
 * RPC execution helpers
 *
 */
#include <stdlib.h>
#include <stdio.h>
#include "UID_dispatch.h"
#include "UID_transaction.h"

static void UID_echo(char *param, char *result, size_t size)
{
	snprintf(result, size, "UID_echo: <%s>", param);
}

UID_SystemFuntion UID_systemFunctions[UID_RPC_RESERVED] = {
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL,
    NULL,
    UID_signAndSendContract,
    UID_echo
};


/**
 * checks the contract for execution permission
 *
 * @param method method to check for permission
 * @param smart_contract the contract
 *
 * @return true if the smart_contract gives execution permission
 *
 * @todo pass smart_contract as reference instead of value
 */
int UID_checkPermission(int method, UID_smart_contract smart_contract)
{
    if(0 != ((1 << (method & 0x07)) & smart_contract.bit_mask[method >> 3])) {
        return 1;
    }
    else return 0;
}

/**
 * Execute the system function "method" with given "params" returning "result"
 *
 * @param[in]  method mthod to execute
 * @param[in]  params parameters to be passed to the function
 * @param[out] result result from the function
 * @param[in]  size   size of the result buffer
 *
 * @return            0 == no error
 */
int UID_performRequest(int method, char *params, char *result, size_t size)
{
    if(UID_RPC_RESERVED <= method) return UID_DISPATCH_NOTEXISTENT;
    if (NULL == UID_systemFunctions[method]) return UID_DISPATCH_NOTEXISTENT;
    UID_systemFunctions[method](params, result, size);
    return UID_DISPATCH_OK;
}
