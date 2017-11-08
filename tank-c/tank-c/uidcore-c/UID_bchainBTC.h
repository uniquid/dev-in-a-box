/**
 * @file   UID_bchainBTC.h
 *
 * @date   5/aug/2016
 * @author M. Palumbi
 */
 
 
#ifndef __UID_BCHAINBTC_H
#define __UID_BCHAINBTC_H

#include <stdint.h>
#include <pthread.h>
#include "UID_globals.h"
#include "UID_identity.h"

#define CONTRACTS_CACHE_SIZE 200 // number of locally cached contracts
#define CLIENT_CACHE_SIZE 50 // number of locally cached client contracts
#define PROFILE_SIZE 80 // OP_RETURN lenght...
#define UID_NAME_LENGHT 32

#define UID_APPLIANCE "http://appliance3.uniquid.co:8080/insight-api"
//#define UID_APPLIANCE "http://appliance1.uniquid.co:3001/insight-api"
//#define UID_APPLIANCE "http://appliance4.uniquid.co:3001/insight-api"

#define UID_GETTXS "%s/addr/%s", UID_pApplianceURL
#define UID_SENDTX "%s/tx/send", UID_pApplianceURL
#define UID_GETCONTRACT "%s/tx/%s", UID_pApplianceURL

extern char *UID_pApplianceURL;

typedef struct {
    uint8_t version;
    uint8_t bit_mask[18];
    uint8_t n_di_n;
    uint8_t guarantor[3][20];
} UID_smart_contract;

/// trick to raise a compiler error if the size of the struct is different than expected
typedef char assertion_on_mystruct[(   sizeof(UID_smart_contract)==PROFILE_SIZE   )*2-1 ];

typedef struct
{
    BTC_Address serviceUserAddress;
    BTC_Address serviceProviderAddress;
    UID_smart_contract profile;
} UID_SecurityProfile;

typedef struct
{
    char serviceProviderName[UID_NAME_LENGHT];
    BTC_Address serviceProviderAddress;
    BTC_Address serviceUserAddress;
} UID_ClientProfile;

typedef struct {
    UID_SecurityProfile contractsCache[CONTRACTS_CACHE_SIZE];
    int validCacheEntries;
    UID_ClientProfile clientCache[CLIENT_CACHE_SIZE];
    int validClientEntries;
    pthread_mutex_t in_use;
} cache_buffer;

int UID_getContracts(cache_buffer **cache);
UID_SecurityProfile *UID_matchContract(BTC_Address serviceUserAddress);
UID_ClientProfile *UID_matchProvider(char *name);
int UID_sendTx(char *signed_tx, char *ret, size_t size);

#endif

