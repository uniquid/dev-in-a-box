/**
 * @file   UID_capBAC.h
 *
 * @date   7/mar/2018
 * @author M. Palumbi
 */

#ifndef __UID_CAPBAC_H
#define __UID_CAPBAC_H

#include <stdint.h>
#include <stdlib.h>
#include "UID_globals.h"

/**
 * Max lenght of the serialized capability string
 * (including the C string \0 terminating byte)
 */
#define UID_SERIALIZED_CAPABILITY_SIZE (3*(sizeof(BTC_Address)-1) + 2*sizeof(UID_Rights) + 2*20 + 1)
#define UID_CAPABILITY_BIT 29

typedef struct {
    uint8_t version;
    uint8_t bit_mask[18];
} UID_Rights;

/**
 * Capability object
 */
typedef struct {
    BTC_Address assigner;   // Authority (owner) Address

    BTC_Address resourceID; // serviceProviderAddress
    BTC_Address assignee;   // serviceUserAddress
	UID_Rights rights;
	int64_t since;
	int64_t until;

	BTC_Signature assignerSignature; // signature
} UID_UniquidCapability;

int UID_prepareToSign(UID_UniquidCapability *cap, char *buffer, size_t size);
int UID_receiveProviderCapability(UID_UniquidCapability *cap);

#endif
