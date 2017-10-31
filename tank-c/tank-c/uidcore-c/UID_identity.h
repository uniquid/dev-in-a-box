/**
 * @file   UID_identity.h
 *
 * @date   3/aug/2016
 * @author M. Palumbi
 */
 
 
#ifndef __UID_IDENTITY_H
#define __UID_IDENTITY_H

#include <stdint.h>
#include "UID_globals.h"

/// default name for the file used to hold the identity
#define UID_DEFAULT_IDENTITY_FILE "./identity.db"

/**
 * This structure holds the bip32 path used by the identity related functions.<br>
 * It holds only part of the path.<br>
 * The actual path it represents is: m/44'/0'/0/p_u/account/n <br>
 * Both p_u and account may only assume values 0 or 1
 */
typedef struct
{
    unsigned p_u;    ///< provider/user
    unsigned account;///< external/internal
    unsigned n;
} UID_Bip32Path;


void UID_getLocalIdentity(char *keypriv_h);
int UID_getPubkeyAt(UID_Bip32Path *path, uint8_t public_key[33]);
int UID_getAddressAt(UID_Bip32Path *path, char *b58addr, size_t size);
int UID_signAt(UID_Bip32Path *path, uint8_t hash[32], uint8_t sig[64]);
char *UID_getTpub(void);

#endif
