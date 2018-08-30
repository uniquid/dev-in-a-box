/**
 * @file   UID_fillCache.h
 *
 * @date   05/jan/2017
 * @author M. Palumbi
 */



#ifndef __UID_FILLCACHE_H
#define __UID_FILLCACHE_H

#include "UID_httpal.h"
#include "UID_bchainBTC.h"

#ifndef UID_CURL_BUFFER_SIZE
    #define UID_CURL_BUFFER_SIZE 100000
#endif // #ifndef UID_CURL_BUFFER_SIZE
#define UID_REGISTRY "http://appliance4.uniquid.co:8080/registry"

extern int UID_confirmations;
extern char *UID_pRegistryURL;

int UID_fillCache(UID_HttpOBJ *curl, cache_buffer *secondb);
int UID_sendTx(char *signed_tx, char *ret, size_t size);

#endif // __UID_FILLCACHE_H
