/**
 * @file   UID_dispatch.h
 *
 * @date   27/oct/2016
 * @author M. Palumbi
 */

#ifndef __UID_DISPATCH_H
#define __UID_DISPATCH_H

#include "UID_bchainBTC.h"

//#define UID_RPC_TABLE_SIZE (40*8)
#define UID_RPC_RESERVED 32

typedef void (*UID_SystemFuntion)(char *param, char *result, size_t size);


int UID_checkPermission(int method, UID_smart_contract smart_contract);

int UID_performRequest(int method, char *params, char *result, size_t size);

#endif //__UID_DISPATCH_H
