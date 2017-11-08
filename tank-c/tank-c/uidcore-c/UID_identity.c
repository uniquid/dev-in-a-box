/*
 * @file   UID_identity.c
 *
 * @date   1/aug/2016
 * @author M. Palumbi
 */


/**
 * @file   UID_identity.h
 *
 * identity functions
 *
 */
#include <string.h>
#include <stdint.h>
#include <stdio.h>
#include <time.h>
#include <inttypes.h>
#include "curves.h"
#include "secp256k1.h"
#include "bip32.h"
#include "UID_utils.h"
#include "UID_identity.h"
#include "rand.h"

#ifdef UID_EMBEDDED
#include "UID_persistence.h"
#else
#include <fcntl.h>

char *identityDB = UID_DEFAULT_IDENTITY_FILE;
static char lbuffer[1024];

static char *load_tprv(char *privateKey, size_t size)
{
    FILE *id;
    char format[64];
    char *tprv = NULL;

    if ((id = fopen(identityDB, "r")) != NULL)
    {
        while(fgets(lbuffer, sizeof(lbuffer), id) != NULL)
        {
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wformat-nonliteral"
            snprintf(format, sizeof(format),  "privateKey: %%%zus\n", size - 1);
            if (sscanf(lbuffer, format,  privateKey) == 1) tprv = privateKey; // if read OK assign to tprv

#pragma GCC diagnostic pop

        }
        fclose(id);
    }
    return tprv;
}

static void store_tprv(char *privateKey)
{
    FILE *id;
    if ((id = fopen(identityDB, "w")) != NULL)
    {
        fprintf(id, "privateKey: %s\n", privateKey);
        fclose(id);
    }
}
#endif

static HDNode node_m;

static HDNode node_m_44H_0H;  // imprinting
static char tpub[120];
static HDNode node_m_44H_0H_0;  // orchestrator
static HDNode node_m_44H_0H_0_x[2][2];
        //                      ^  ^
        // provider/user________|  |
        // intern/extern___________|

static HDNode *UID_deriveAt(UID_Bip32Path *path, HDNode *node)
{
    if (path->p_u > 1 )
        return NULL;
    if (path->account > 1 )
        return NULL;
    memcpy( node, &node_m_44H_0H_0_x[path->p_u][path->account], sizeof(HDNode));
    hdnode_private_ckd(node, path->n);
//    hdnode_fill_public_key(node);
    return node;
}

static void derive_m_44H_0H_x(void)
{
	uint32_t fingerprint;

    // [Chain m/44']
    memcpy(&node_m_44H_0H, &node_m, sizeof(HDNode));
    hdnode_private_ckd_prime(&node_m_44H_0H, 44);

    // [Chain m/44'/0']
    fingerprint = hdnode_fingerprint(&node_m_44H_0H);
    //memcpy(&node_m_44H_0H, &node_m_44H_0H, sizeof(HDNode));
    hdnode_private_ckd_prime(&node_m_44H_0H, 0);
	hdnode_fill_public_key(&node_m_44H_0H);
	hdnode_serialize_public(&node_m_44H_0H, fingerprint, tpub, sizeof(tpub));

    // [Chain m/44'/0'/0]
    memcpy(&node_m_44H_0H_0, &node_m_44H_0H, sizeof(HDNode));
    hdnode_private_ckd(&node_m_44H_0H_0, 0);


    // [Chain m/44'/0'/0/0]
    memcpy(&node_m_44H_0H_0_x[0][0], &node_m_44H_0H_0, sizeof(HDNode));
    hdnode_private_ckd(&node_m_44H_0H_0_x[0][0], 0);
    memcpy(&node_m_44H_0H_0_x[0][1], &node_m_44H_0H_0_x[0][0], sizeof(HDNode));

    // [Chain m/44'/0'/0/0/0]
    hdnode_private_ckd(&node_m_44H_0H_0_x[0][0], 0);

    // [Chain m/44'/0'/0/0/1]
    hdnode_private_ckd(&node_m_44H_0H_0_x[0][1], 1);

    // [Chain m/44'/0'/0/1]
    memcpy(&node_m_44H_0H_0_x[1][0], &node_m_44H_0H_0, sizeof(HDNode));
    hdnode_private_ckd(&node_m_44H_0H_0_x[1][0], 1);
    memcpy(&node_m_44H_0H_0_x[1][1], &node_m_44H_0H_0_x[1][0], sizeof(HDNode));

    // [Chain m/44'/0'/0/1/0]
    hdnode_private_ckd(&node_m_44H_0H_0_x[1][0], 0);

    // [Chain m/44'/0'/0/1/1]
    hdnode_private_ckd(&node_m_44H_0H_0_x[1][1], 1);
}

/**
 * load/create and store the identity of the Entity (xprv @ node m).<br>
 * this function must be called before all other library functions.
 *
 * if the file named identityDB exists, the identity is loaded from it
 * else a new identity is created from random.<br>
 * the identity is then saved in the file named identityDB.
 *
 * @param[in]   tprv  if != NULL the value is used to force the identity (identityDB take precedence).
 *
 */
void UID_getLocalIdentity(char *tprv)
{
    char privateKey[256]; 

    if (load_tprv(privateKey, sizeof(privateKey)) != NULL)
        tprv = privateKey; // if read OK assign to tprv

    if(tprv == NULL) 
    {
        uint8_t seed[32];
        random_buffer(seed, sizeof(seed));
        hdnode_from_seed(seed, sizeof(seed), SECP256K1_NAME, &node_m);
    }
	else
	{
	    hdnode_deserialize(tprv, &node_m);
	}

	derive_m_44H_0H_x();

    if (tprv != privateKey) {
        memset(privateKey, 0, sizeof(privateKey));
        hdnode_serialize_private(&node_m, 0 /*uint32_t fingerprint*/, privateKey, sizeof(privateKey));
        store_tprv(privateKey);
    }
}

/**
 * Returns the xpub for imprinting
 *
 * @return xpub @ m/44'/0'
 */
char *UID_getTpub(void)
{
    return tpub;
}

/**
 * Signs a 32 byte digest with the key @ a given bip32 path
 * of the identity.
 *
 * @param[in]  path bip32 path of the private-key to use
 * @param[in]  hash 32 bytes long buffer holding the digest to be signed
 * @param[out] sig  pointer to a 64 bytes long buffer to be filled with the signature
 * @return          0 == no error
 *
 * \todo improve error handling
 */
int UID_signAt(UID_Bip32Path *path, uint8_t hash[32], uint8_t sig[64])
{
    uint8_t pby = 0;
    HDNode node;

    UID_deriveAt(path, &node);
    ecdsa_sign_digest(&secp256k1, node.private_key, hash, sig, &pby);
    return 0;
}

/**
 * Returns the public key @ a given bip32 path
 * of the identity.
 *
 * @param[in]  path       bip32 path of the private-key to use
 * @param[out] public_key pointer to a 33 bytes long buffer
 *                        to be filled with the public key
 * @return                0 == no error
 *
 * \todo improve error handling
 */
int UID_getPubkeyAt(UID_Bip32Path *path, uint8_t public_key[33])
{
    HDNode node;
    UID_deriveAt(path, &node);
    hdnode_fill_public_key(&node);
    memcpy(public_key, node.public_key, 33);
    return 0;
}

/**
 * Returns the address @ a given bip32 path
 * of the identity.
 *
 * @param[in]  path    bip32 path of the private-key to use
 * @param[out] b58addr pointer to a buffer to be filled with
 * 					   the address
 * @param[in]  size	   size of the buffer pointed by b58addr
 * @return             0 == no error
 *
 * \todo improve error handling
 */
int UID_getAddressAt(UID_Bip32Path *path, char *b58addr, size_t size)
{
    HDNode node;
    UID_deriveAt(path, &node);
    hdnode_fill_public_key(&node);
    ecdsa_get_address(node.public_key, /*version*/ NETWORK_BYTE, b58addr, size);
    return 0;
}
