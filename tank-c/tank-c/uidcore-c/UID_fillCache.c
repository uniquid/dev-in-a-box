/*
 * @file   UID_fillCache.c
 *
 * @date   05/jan/2016
 * @author M. Palumbi
 */


/**
 * @file UID_fillCache.h
 *
 * The module implements the filling of cache crontracts from
 * the blockchain
 *
 */

#include <stdio.h>
#include <string.h>
#include "yajl/yajl_tree.h"
#include "yajl/yajl_parse.h"
#include "UID_fillCache.h"
#include "UID_utils.h"
#include "UID_identity.h"
#include "UID_dispatch.h"

/// disable debug output
#define printf(...)

typedef struct  {
    size_t size;
    char  *buffer;
} curl_context;

/**
 * Base url of the Name Registry appliance<br>
 * Defaults to http://appliance4.uniquid.co:8080/registry
 */
char *UID_pRegistryURL = UID_REGISTRY;

// callback from curl_easy_perform
static size_t curl_callback(void *buffer, size_t size, size_t nmemb, curl_context *ctx)
{
    size_t l = size*nmemb;

    if (l < ctx->size) {
        memcpy(ctx->buffer, buffer, l);
        ctx->buffer += l;
        *ctx->buffer = 0;
        ctx->size -= l;
        return l;
    }
    else {
        return -1;
    }
}

/**
 * Get data from url
 *
 * @param[in]  curl   pointer to an initialized CURL struct
 * @param[in]  url    url to contact
 * @param[out] buffer pointer to buffer to be filled
 * @param[in]  size   size of buffer
 *
 * @return     CURLE_OK no error (see curl documentation)
 */
CURLcode curlget(CURL *curl, char *url, char *buffer, size_t size)
{
    curl_context ctx;

    ctx.buffer = buffer;
    ctx.size = size;

    /* Define our callback to get called when there's data to be written */ 
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, curl_callback);
    /* Set a pointer to our struct to pass to the callback */ 
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &ctx);
    curl_easy_setopt(curl, CURLOPT_URL, url);

    return curl_easy_perform(curl);
}

/**
 * check the "n" vout to be a valid imprinting
 *
 * @return 0 not valid 1 valid
 */
static int check_vout(int n, yajl_val vout, UID_SecurityProfile *sp)
{
    yajl_val addresses;

    // check validity (vout n not spent)
    const char * path[] = { "spentIndex", (const char *) 0, (const char *) 0 };
    if (NULL != yajl_tree_get(vout->u.array.values[n], path, yajl_t_number)) {
        printf("        ### spent!!\n");
        return 0;  // vout spent
    }
    printf("        ### not spent!!\n");

    // get the addresses of the first vout (array)
    path[0] = "scriptPubKey";
    path[1] = "addresses";
    addresses = yajl_tree_get(vout->u.array.values[n], path, yajl_t_array);
    if (NULL == addresses) {
        return 0;
    }
    // get the address
    char *s = YAJL_GET_STRING(addresses->u.array.values[0]);
    if (NULL == s) {
        return 0;
    }
    // check if it match the address we are looking for
    if (0 != strcmp(s, sp->serviceProviderAddress)) {
        return 0;
    }
    printf("        %s %s\n", s, sp->serviceProviderAddress);
    return 1;
}

/**
 * Parse for a valid IMPRINTING transaction
 *
 * @return 1 if valid
 */
static int parse_imprinting(yajl_val jnode, UID_SecurityProfile *sp)
{
    yajl_val vin, vout, str;
    unsigned i;

    // get the vout array
    const char * path[] = { "vout", (const char *) 0, (const char *) 0 };
    vout = yajl_tree_get(jnode, path, yajl_t_array);
    if (NULL == vout) {
        return 0;
    }

    for (i=0; i<vout->u.array.len; i++) {
        if ( 0 != check_vout(i, vout, sp) ) break;
    }
    if ( i >= vout->u.array.len) return 0;
    // if ( 0 == check_vout(0, vout, sp) )
    //     if (0 == check_vout(1, vout, sp) )
    //         return 0;

    // get the vin array
    path[0] = "vin";
    path[1] = NULL;
    vin = yajl_tree_get(jnode, path, yajl_t_array);
    if (NULL == vin) {
        return 0;
    }
    // get the addr of the first input (imprinting orchestrator)
    path[0] = "addr";
    str = yajl_tree_get(vin->u.array.values[0], path, yajl_t_string);
    char *s =  YAJL_GET_STRING(str);
    if ( NULL == s ) {
        return 0;
    }
    printf("        user:  %s\n", s);
    strncpy(sp->serviceUserAddress, s, sizeof(sp->serviceUserAddress));
    memset(&(sp->profile), 0x00, sizeof(sp->profile));
    memset(&(sp->profile.bit_mask), 0xFF, UID_RPC_RESERVED/8);

    return 1;

}

/**
 * Parse for a valid PROVIDER transaction
 *
 * @return 1 if valid
 */
static int parse_provider(yajl_val jnode, UID_SecurityProfile *sp)
{
    yajl_val vin, vout, str, addresses;

    // get the vin array
    const char * path[] = { "vin", (const char *) 0, (const char *) 0 };
    vin = yajl_tree_get(jnode, path, yajl_t_array);
    if (NULL == vin) {
        return 0;
    }
    // get the addr of the first input (provider)
    path[0] = "addr";
    str = yajl_tree_get(vin->u.array.values[0], path, yajl_t_string);
    char *s =  YAJL_GET_STRING(str);
    if ( NULL == s ) {
        return 0;
    }
    // check if it match the address we are looking for
    if (0 != strcmp(s, sp->serviceProviderAddress)) {
        return 0;
    }
    printf("        %s %s\n", s, sp->serviceProviderAddress);
    // get the vout array
    path[0] = "vout";
    vout = yajl_tree_get(jnode, path, yajl_t_array);
    if (NULL == vout) {
        return 0;
    }
    // check validity (vout n 2 not spent)
    path[0] = "spentIndex";
    if (NULL != yajl_tree_get(vout->u.array.values[2], path, yajl_t_number)) {
        printf("        ### spent!!\n");
        return 0;  // vout spent
    }
    printf("        ### not spent!!\n");
    // get the addresses of the first vout (array)
    path[0] = "scriptPubKey";
    path[1] = "addresses";
    addresses = yajl_tree_get(vout->u.array.values[0], path, yajl_t_array);
    if (NULL == addresses) {
        return 0;
    }
    // get the address of the user
    s = YAJL_GET_STRING(addresses->u.array.values[0]);
    if (NULL == s) {
        return 0;
    }
    printf("        user:  %s\n", s);
    strncpy(sp->serviceUserAddress, s, sizeof(sp->serviceUserAddress));
    // get the OP_RETURN (smart contract)
    path[0] = "scriptPubKey";
    path[1] = "hex";
    s = YAJL_GET_STRING(yajl_tree_get(vout->u.array.values[1], path, yajl_t_string));
    if ((NULL == s) || (166 != strlen(s))) {
        return 0;
    }
    printf("        <%s>\n", s + 6);
    fromhex(s + 6, (uint8_t *)&(sp->profile), sizeof(sp->profile));

    return 1;
}

/**
 * Parse for a valid USER transaction
 *
 * @return 1 if valid
 */
static int parse_user(yajl_val jnode, UID_ClientProfile *cp)
{
    yajl_val vin, vout, str, addresses;

    // get the vout array
    const char * path[] = { "vout", (const char *) 0, (const char *) 0 };
    vout = yajl_tree_get(jnode, path, yajl_t_array);
    if (NULL == vout) {
        return 0;
    }
    // get the addresses of the first vout (array)
    path[0] = "scriptPubKey";
    path[1] = "addresses";
    addresses = yajl_tree_get(vout->u.array.values[0], path, yajl_t_array);
    if (NULL == addresses) {
        return 0;
    }
    // get the address of the user
    char *s = YAJL_GET_STRING(addresses->u.array.values[0]);
    if (NULL == s) {
        return 0;
    }
    printf("        user:  %s\n", s);
    // check if it match the address we are looking for
    if (0 != strcmp(s, cp->serviceUserAddress)) {
        return 0;
    }
    printf("        %s %s\n", s, cp->serviceUserAddress);
    // get the OP_RETURN (smart contract)
    path[0] = "scriptPubKey";
    path[1] = "hex";
    s = YAJL_GET_STRING(yajl_tree_get(vout->u.array.values[1], path, yajl_t_string));
    if ((NULL == s) || (166 != strlen(s))) {
        return 0;
    }
    printf("        <%s>\n", s + 6);
    // check validity (vout n 2 not spent)
    path[0] = "spentIndex";
    path[1] = NULL;
    if (NULL != yajl_tree_get(vout->u.array.values[2], path, yajl_t_number)) {
        printf("        ### spent!!\n");
        return 0;  // vout spent
    }
    printf("        ### not spent!!\n");

    // get the vin array
    path[0] =  "vin";
    vin = yajl_tree_get(jnode, path, yajl_t_array);
    if (NULL == vin) {
        return 0;
    }
    // get the addr of the first input (provider)
    path[0] = "addr";
    str = yajl_tree_get(vin->u.array.values[0], path, yajl_t_string);
    s =  YAJL_GET_STRING(str);
    if ( NULL == s ) {
        return 0;
    }
    strncpy(cp->serviceProviderAddress, s, sizeof(cp->serviceProviderAddress));
    memset(cp->serviceProviderName, 0x00, sizeof(cp->serviceProviderName));

    return 1;
}

static char curlbuffer[100000];

#define USER 0
#define PROVIDER 1
#define IMPRINTING 2

/**
 * Minimum confirmations required to accept the contract<br>
 * Defaults to 1
 */
int UID_confirmations = 1;

/**
 * check the tx for a valid contract of type "type"
 * if found add it to the cache buffer
 *
 * @param[in]  curl    pointer to an initialized CURL struct
 * @param[out] secondb pointer to the contracts cache buffer
 *                     to be filled
 * @param[in]  tx      transaction to check
 * @param[in]  type    type of contract to look for: PROVIDER IMPRINTING USER
 *
 * @return     UID_CONTRACTS_OK no error <br>
 *             UID_CONTRACTS_SERV_ERROR error contacting the server
 */
static int check_contract(CURL *curl, cache_buffer *secondb, char * tx, char *address, int type)
{
    yajl_val jnode, v;
    char url[256];

    snprintf(url, sizeof(url), UID_GETCONTRACT, tx);
    if(CURLE_OK != curlget(curl, url, curlbuffer, sizeof(curlbuffer)))
        return UID_CONTRACTS_SERV_ERROR;

	jnode = yajl_tree_parse(curlbuffer, NULL, 0);
	if (NULL == jnode)
        return UID_CONTRACTS_SERV_ERROR;

    const char * path[] = { "confirmations", (const char *) 0, (const char *) 0 };
    v = yajl_tree_get(jnode, path, yajl_t_number);
    if (NULL == v) {
        yajl_tree_free(jnode);
        return UID_CONTRACTS_SERV_ERROR;
    }
    printf("    confirmations: %lld\n", YAJL_GET_INTEGER(v));
    if(UID_confirmations <= YAJL_GET_INTEGER(v)) {

        if (type == IMPRINTING) {
            UID_SecurityProfile *sp = &(secondb->contractsCache)[secondb->validCacheEntries];
            // fill the provider field
            strncpy(sp->serviceProviderAddress, address, sizeof(sp->serviceProviderAddress));

            if (parse_imprinting(jnode, sp))
                secondb->validCacheEntries++;
        }
        if (type == PROVIDER) {
            UID_SecurityProfile *sp = &(secondb->contractsCache)[secondb->validCacheEntries];
            // fill the provider field
            strncpy(sp->serviceProviderAddress, address, sizeof(sp->serviceProviderAddress));

            if (parse_provider(jnode, sp))
                secondb->validCacheEntries++;
        }
        if (type == USER) {
            UID_ClientProfile *cp = &(secondb->clientCache)[secondb->validClientEntries];
            strncpy(cp->serviceUserAddress, address, sizeof(cp->serviceUserAddress));

            if (parse_user(jnode, cp))
                secondb->validClientEntries++;
        }

    }

    yajl_tree_free(jnode);

    return UID_CONTRACTS_OK;
}

/**
 * lookup the Block-Chain for a given address to see
 * if it received transactions. If some TX exists for the address,
 * call check_contract() to look for valid contracts
 *
 * @param[in]  curl    pointer to an initialized CURL struct
 * @param[out] secondb pointer to the contracts cache buffer
 *                     to be filled
 * @param[in]  type    type of contract to look for: PROVIDER IMPRINTING USER
 *
 * @return     UID_CONTRACTS_OK transaction exists for the given address <br>
 *             UID_CONTRACTS_NO_TX no transactions for the given address <br>
 *             UID_CONTRACTS_SERV_ERROR error contacting the server
 */
static int check_address(CURL *curl, cache_buffer *secondb, char *address, int type)
{
    int res;
    unsigned i;
    char url[256];
    yajl_val jnode, transactions;//, v;

    printf("==>> %s\n", address);
    snprintf(url, sizeof(url), UID_GETTXS, address);
    if(CURLE_OK != curlget(curl, url, curlbuffer, sizeof(curlbuffer)))
        return UID_CONTRACTS_SERV_ERROR;

	jnode = yajl_tree_parse(curlbuffer, NULL, 0);
	if (NULL == jnode)
        return UID_CONTRACTS_SERV_ERROR;

    const char * path[] = { "transactions",(const char *) 0 };
    transactions = yajl_tree_get(jnode, path, yajl_t_array);
    if (NULL != transactions) {
        res = UID_CONTRACTS_NO_TX;
        if (type == IMPRINTING) {
            printf("    @@ check for imprinting @@\n");
            i = transactions->u.array.len;
            if (i > 0) {
                // first tx (last on the array)
                char *str = YAJL_GET_STRING(transactions->u.array.values[i-1]);
                printf("    ---> %s ---\n", str);
                res = check_contract(curl, secondb, str, address, type);
            }
        }
        else {
            for (i = 0; i < transactions->u.array.len; i++) {
                char *str = YAJL_GET_STRING(transactions->u.array.values[i]);
                printf("    ---> %s ---\n", str);
                res = check_contract(curl, secondb, str, address, type);
                if (res != UID_CONTRACTS_OK)
                    break;
            }
        }
    }
    else {
        res = UID_CONTRACTS_SERV_ERROR;
        printf("    parse error, no transactions field\n");
    }

    yajl_tree_free(jnode);

    return res;
}

/**
 * Gets the providers name of the contracts from the Registry
 *
 * @param[in]  curl    pointer to an initialized CURL struct
 * @param[out] secondb pointer to the contracts cache buffer
 *                     to be filled with the names
 */
static int get_providers_name(CURL *curl, cache_buffer *secondb)
{
    yajl_val jnode, v;
    int i;
    size_t j;
    char *s;

    if(CURLE_OK != curlget(curl, UID_pRegistryURL, curlbuffer, sizeof(curlbuffer)))
        return 1;

	jnode = yajl_tree_parse(curlbuffer, NULL, 0);
	if (NULL == jnode)
        return 1;

    if (!YAJL_IS_ARRAY(jnode)) {
        yajl_tree_free(jnode);
        return 1;
    }

    const char * path[] = { NULL, (const char *) 0 };
    for (i=0; i<secondb->validClientEntries;i++) {
        for (j=0; j<jnode->u.array.len; j++) {
            path[0] = "provider_address";
            v = yajl_tree_get(jnode->u.array.values[j], path, yajl_t_string);
            s = YAJL_GET_STRING(v);
            if (!strcmp(s, secondb->clientCache[i].serviceProviderAddress)) {
                path[0] = "provider_name";
                v = yajl_tree_get(jnode->u.array.values[j], path, yajl_t_string);
                s = YAJL_GET_STRING(v);
                strncpy(secondb->clientCache[i].serviceProviderName, s, sizeof(secondb->clientCache[i].serviceProviderName));
            }
        }
    }

    yajl_tree_free(jnode);
    return 0;
}

/**
 * Lookup all the Bip32 addresses looking for contracts
 *
 * - imprinting contract <br>
 * - provider contracts <br>
 * - user contracts <br>
 *
 * @param[in]  curl    pointer to an initialized CURL struct
 * @param[out] secondb pointer to the contracts cache buffer
 *                     to be filled
 *
 * @return     UID_CONTRACTS_OK no error <br>
 *             UID_CONTRACTS_SERV_ERROR error contacting the server
 *
 * @todo handle errors from get_providers_name
 */
int UID_fillCache(CURL *curl, cache_buffer *secondb)
{
    int res, gap;
    char b58addr[36];
    UID_Bip32Path path;

    (secondb->validCacheEntries) = 0; // void the cache
    (secondb->validClientEntries) = 0; // void the cache

    printf("================================================================\n");
    // look for contract on the first external addresses
    path.p_u = 0;  //provider
    path.account = 0;
    path.n = 0;
    UID_getAddressAt(&path, b58addr, sizeof(b58addr));
    res = check_address(curl, secondb, b58addr, PROVIDER);
    if ( UID_CONTRACTS_SERV_ERROR == res )
        return UID_CONTRACTS_SERV_ERROR;

    printf("----------------------------------------------------------------\n");
    // look for contracts on all internal addresses
    path.p_u = 0;  //provider
    path.account = 1;
    for (path.n = 0, gap = 0; gap < 5; path.n++) {
        UID_getAddressAt(&path, b58addr, sizeof(b58addr));
        res = check_address(curl, secondb, b58addr, PROVIDER);
        if ( UID_CONTRACTS_SERV_ERROR == res )
            return UID_CONTRACTS_SERV_ERROR;
        if ( UID_CONTRACTS_NO_TX == res )
            gap ++;
        else
            gap = 0;
    }
    printf("----------------------------------------------------------------\n");
    // look for imprinting on the first external addresses
    if (0 == secondb->validCacheEntries) {
        path.p_u = 0;  //provider
        path.account = 0;
        path.n = 0;
        UID_getAddressAt(&path, b58addr, sizeof(b58addr));
        res = check_address(curl, secondb, b58addr, IMPRINTING);
        if ( UID_CONTRACTS_SERV_ERROR == res )
            return UID_CONTRACTS_SERV_ERROR;
    }
    printf("----------------------------------------------------------------\n");
    path.p_u = 1;  //user
    path.account = 0;
    for (path.n = 0, gap = 0; gap < 5; path.n++) {
        UID_getAddressAt(&path, b58addr, sizeof(b58addr));
        res = check_address(curl, secondb, b58addr, USER);
        if ( UID_CONTRACTS_SERV_ERROR == res )
            return UID_CONTRACTS_SERV_ERROR;
        if ( UID_CONTRACTS_NO_TX == res )
            gap ++;
        else
            gap = 0;
    }

    get_providers_name(curl, secondb);

    return UID_CONTRACTS_OK;
}
