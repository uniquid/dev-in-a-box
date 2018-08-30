/*
 * @file   UID_bchainBTC.c
 *
 * @date   5/aug/2016
 * @author M. Palumbi
 */
  
 




/**
 * @file   UID_bchainBTC.h
 *
 * Block chain functions for BTC using insight-api
 *
 */

#include <string.h>
#include "UID_httpal.h"
#include "UID_bchainBTC.h"
#include "UID_fillCache.h"
#include "UID_time.h"
#include "UID_log.h"

/**
 * double buffer for contract cache<br>
 * UID_getContracts may fill seconb while current is read
 */
static cache_buffer cache0 = { { { {0},{0},UID_SMARTC_INITIALIZER } }, 0, { { {0},{0},{0} } }, 0, PTHREAD_MUTEX_INITIALIZER };
static cache_buffer cache1 = { { { {0},{0},UID_SMARTC_INITIALIZER } }, 0, { { {0},{0},{0} } }, 0, PTHREAD_MUTEX_INITIALIZER };
/**
 * capability contract cache
 */
static cache_buffer capDB  = { { { {0},{0},UID_SMARTC_INITIALIZER } }, UID_CONTRACTS_CACHE_SIZE, { { {0},{0},{0} } }, UID_CLIENT_CACHE_SIZE, PTHREAD_MUTEX_INITIALIZER };

/**
 * pointers to the main, secondary and capability buffer
 */
cache_buffer *current = &cache0;
cache_buffer *secondb = &cache1;
cache_buffer *capDBp  = &capDB;

/**
 * Base url of the Insight API appliance
 * to be used to get and send transactions<br>
 * Defaults to http://appliance3.uniquid.co:8080/insight-api
 */
char *UID_pApplianceURL = UID_APPLIANCE;

#ifdef DUMMY_CACHE
int  fillDummyCache(void)
// fill the Contractrs Cache
{
    // fill the dummy cache
    // user (bip32.org Passphrase user weak hash)
    // tprv8ZgxMBicQKsPfMnootPTR6b8KjS1FbN3ikSynKf1wM7Y7cv8RipNDpdDtr2BuT8EKNsVjKvVe1iZc83J7SRu4gvjGiu8bKxhrRuKZfJXMtZ
    // user1
    // tprv8ZgxMBicQKsPeNN7y2mmmFJf6Mh2FLzzNmHn67gmy7CjwQYucmHwdjFugaFU8A1NwMJWjWrC46fxcTUaSYTLpn7H8oyUYneegarrfvHQYF1
    // provider (bip32.org Passphrase provider weak hash)
    // tprv8ZgxMBicQKsPdLmDgjo8Ed2U8c93oN4kJx2B2UfWmB878YcKiBCWu1WnrDqWZxSCzg9fsZASieJajf3nsckqbboJei53SrfqqEwcFz8sUhr
    strncpy(secondb->contractsCache[0].serviceUserAddress, "my3CohS9f57yCqNy4yAPbBRqLaAAJ9oqXV", sizeof(BTC_Address));          // user     m/0'/0/0
    strncpy(secondb->contractsCache[0].serviceProviderAddress, "mw5oLLjxSNsPRdDgArCZseGEQJVdNYNK5U", sizeof(BTC_Address));      // provider m/0'/0/0
    memset(secondb->contractsCache[0].profile.bit_mask, 0, sizeof(secondb->contractsCache[0].profile.bit_mask));
    strncpy(secondb->contractsCache[1].serviceUserAddress, "myUFCeVGwkJv3PXy4zc1KSWRT8dC5iTvhU", sizeof(BTC_Address));          // user1    m/0'/0/1
    strncpy(secondb->contractsCache[1].serviceProviderAddress, "mtEQ22KCcjpz73hWfNvJoq6tqMEcRUKk3m", sizeof(BTC_Address));      // provider m/0'/0/1
    memset(secondb->contractsCache[1].profile.bit_mask, 0xFF, sizeof(secondb->contractsCache[1].profile.bit_mask));
    secondb->validCacheEntries = 2;
    strncpy(secondb->clientCache[0].serviceProviderName, "LocalMachine", sizeof(((UID_ClientProfile *)0)->serviceProviderName));
    strncpy(secondb->clientCache[0].serviceProviderAddress, "mw5oLLjxSNsPRdDgArCZseGEQJVdNYNK5U", sizeof(((UID_ClientProfile *)0)->serviceProviderAddress));// provider m/0'/0/0
    strncpy(secondb->clientCache[0].serviceUserAddress, "my3CohS9f57yCqNy4yAPbBRqLaAAJ9oqXV", sizeof(((UID_ClientProfile *)0)->serviceUserAddress));        // user     m/0'/0/0
    strncpy(secondb->clientCache[1].serviceProviderName, "UID984fee057c6d", sizeof(((UID_ClientProfile *)0)->serviceProviderName));
    strncpy(secondb->clientCache[1].serviceProviderAddress, "mtEQ22KCcjpz73hWfNvJoq6tqMEcRUKk3m", sizeof(((UID_ClientProfile *)0)->serviceProviderAddress));// provider m/0'/0/1
    strncpy(secondb->clientCache[1].serviceUserAddress, "myUFCeVGwkJv3PXy4zc1KSWRT8dC5iTvhU", sizeof(((UID_ClientProfile *)0)->serviceUserAddress));        // user1     m/0'/0/1
    strncpy(secondb->clientCache[2].serviceProviderName, "nocontract", sizeof(((UID_ClientProfile *)0)->serviceProviderName));
    strncpy(secondb->clientCache[2].serviceProviderAddress, "mtEQ22KCcjpz73hWfNvJoq6tqMEcRUKk3m", sizeof(((UID_ClientProfile *)0)->serviceProviderAddress));// provider m/0'/0/1
    strncpy(secondb->clientCache[2].serviceUserAddress, "n1UevZASvVyNhAB2d5Nm9EaHFeooJZbSP7", sizeof(((UID_ClientProfile *)0)->serviceUserAddress));        // user1     m/0'/0/3
    secondb->validClientEntries = 3;
    return UID_CONTRACTS_OK;
}
#endif

/**
 * Updates the contract's db from the block-chain.
 *
 * This function must be called periodically, it may be
 * inside a dedicated thread or scheduled in other ways.
 * The db (contracts cache) is organized in a double buffer
 * structure.
 * This implementation uses pthread mutex to synchronize
 * with the functions that acces the data: UID_matchContract()
 * and UID_matchProvider()
 *
 * @param[out] cache return the address of the valid contract's cache buffer
 *
 * @return     UID_CONTRACTS_OK         no error <br>
 *             UID_CONTRACTS_SERV_ERROR error accessing Insight API server
 */
int UID_getContracts(cache_buffer **cache)
{
    UID_HttpOBJ *curl;
    int res;

    *cache = current; // set *cahe to current in case of error
    curl = UID_httpinit();

    pthread_mutex_lock(&(secondb->in_use));  // lock the resource

#ifdef DUMMY_CACHE
    res = fillDummyCache();
#else
    res = UID_fillCache(curl, secondb);
#endif
    
    pthread_mutex_unlock(&(secondb->in_use));  // unlock the resource
    if (UID_CONTRACTS_OK == res) {
        *cache = secondb;  // swap the buffers
        secondb = current;
        current = *cache;
    }

    /* always cleanup */ 
    UID_httpcleanup(curl);
    
    return res;
}

static UID_SecurityProfile goodContract;

/**
 * Retrieves the matching contract from the Contracts Cache
 *
 * @param[in] serviceUserAddress user address to search for a matching contract
 *
 * @return    pointer to a UID_SecurityProfile structure holding the contract
 *
 * @todo non reentrant code!!! the returned structure is allocated statically
 */
UID_SecurityProfile *UID_matchContract(BTC_Address serviceUserAddress)
{
    int i;
    cache_buffer *ptr = current ;
    UID_SecurityProfile *ret_val = NULL;

    pthread_mutex_lock(&(ptr->in_use));  // lock the resource

    for(i=0; i<(ptr->validCacheEntries); i++)
    {
        if (strcmp((ptr->contractsCache)[i].serviceUserAddress, serviceUserAddress) == 0)
        {   // found the contract
            //if ((ptr->contractsCache)[i].profile == 0) break; // profile == 0 contract revoked! return NULL
            memcpy(&goodContract,  (ptr->contractsCache) + i, sizeof(goodContract)); // copy to goodContract
            ret_val = &goodContract; // return pointer to it
            break;
        }
    }

    pthread_mutex_unlock(&(ptr->in_use));  // unlock the resource
    if (NULL != ret_val)
        return ret_val;

    ptr = capDBp;
    pthread_mutex_lock(&(ptr->in_use));  // lock the resource

    for(i=0; i<(ptr->validCacheEntries); i++)
    {
        if (strcmp((ptr->contractsCache)[i].serviceUserAddress, serviceUserAddress) == 0)
        {   // found the contract
            //if ((ptr->contractsCache)[i].profile == 0) break; // profile == 0 contract revoked! return NULL
            int64_t time = UID_getTime();
            if (time < (ptr->contractsCache)[i].profile.since) {
                UID_log(UID_LOG_ERROR, "In func <%s> " "Contract not yet valid\n", __func__);
                continue;
            }
            if (time > (ptr->contractsCache)[i].profile.until) {
                UID_log(UID_LOG_ERROR, "In func <%s> " "Contract not more valid\n", __func__);
                continue;
            }
            memcpy(&goodContract,  (ptr->contractsCache) + i, sizeof(goodContract)); // copy to goodContract
            ret_val = &goodContract; // return pointer to it
            break;
        }
    }

    pthread_mutex_unlock(&(ptr->in_use));  // unlock the resource
    return ret_val;
}

static UID_ClientProfile clientContract;

/**
 * Retrieves the matching contract from the client Cache
 *
 * @param[in] name provider name to search for a matching contract
 *
 * @return    pointer to a UID_ClientProfile structure holding the contract <br>
 *            NULL if not found
 *
 * @todo non reentrant code!!! the returned structure is allocated statically
 */
UID_ClientProfile *UID_matchProvider(char *name)
{
    int i;
    cache_buffer *ptr = current ;
    UID_ClientProfile *ret_val = NULL;

    pthread_mutex_lock(&(ptr->in_use));  // lock the resource

    for(i=0; i<(ptr->validClientEntries); i++)
    {
        if (strcmp((ptr->clientCache)[i].serviceProviderName, name) == 0)
        {   // found the contract
            memcpy(&clientContract,  (ptr->clientCache) + i, sizeof(clientContract)); // copy to clientContract
            ret_val = &clientContract; // return pointer to it
            break;
        }
    }

    pthread_mutex_unlock(&(ptr->in_use));  // unlock the resource
    return ret_val;
}

/**
 * Insert a channel in the contract DataBase
 *
 * @param[] channel channel to be inserted
 *
 * @return          UID_CDB_OK if no error
 */
int UID_insertProvideChannel(UID_SecurityProfile *channel)
{
    (void)channel;
    pthread_mutex_lock(&(capDBp->in_use));  // lock the resource
    memcpy(&(capDBp->contractsCache[0]), channel, sizeof(UID_SecurityProfile));
    capDBp->validCacheEntries = 1;
    pthread_mutex_unlock(&(capDBp->in_use));  // unlock the resource
    return UID_CDB_OK;
}
