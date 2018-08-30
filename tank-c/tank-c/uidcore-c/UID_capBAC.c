/*
 * @file   UID_capBAC.c
 *
 * @date   7/mar/2018
 * @author M. Palumbi
 */


/**
 * @file   UID_capBAC.h
 *
 * Capability access implementation
 *
 */

#include <stdio.h>
#include <string.h>
#include <inttypes.h>
#include "UID_bchainBTC.h"
#include "UID_dispatch.h"
#include "UID_capBAC.h"
#include "UID_utils.h"
#include "UID_log.h"

/**
 * Serializes the capability in order to sign it
 *
 * @param[in]  cap    capability to be serialized
 * @param[out] buffer buffer to be filled with the serialized capability
 * @param[in]  size   size of the output buffer
 *
 * @return           UID_CAPBAC_OK if no error
 */
int UID_prepareToSign(UID_UniquidCapability *cap, char *buffer, size_t size)
{
    char hexbuf[2*sizeof(UID_Rights)+1] = {0};

    tohex((uint8_t *)&(cap->rights), sizeof(UID_Rights), hexbuf);
    int ret = snprintf(buffer, size, "%s%s%s%s%" PRId64 "%" PRId64, cap->assigner, cap->resourceID, cap->assignee, hexbuf, cap->since, cap->until );

    if (ret < 0) return UID_CAPBAC_SER_ERROR;
    if ((size_t)ret < size) return UID_CAPBAC_OK;
    return UID_CAPBAC_SMALL_BUFFER;
}

/**
 * Valdate the capabiliy and insert the information in the Contract cache
 *
 * @param[in] cap the capability
 *
 * @return        UID_CAPBAC_OK if no error
 */
int UID_receiveProviderCapability(UID_UniquidCapability *cap)
{
	char buffer[UID_SERIALIZED_CAPABILITY_SIZE];
    UID_SecurityProfile channel = {0};
    int ret;

    // Verify the signature
	UID_prepareToSign(cap, buffer, sizeof(buffer));
    ret = UID_verifyMessage(buffer, cap->assignerSignature, cap->assigner);
    if (UID_SIGN_OK != ret) {
        UID_log(UID_LOG_ERROR, "In func <%s> " "UID_verifyMessage() return %d\n", __func__, ret);
        return ret;
    }

    UID_SecurityProfile *profile;
    profile = UID_matchContract(cap->assigner);
    if (NULL == profile) {
        UID_log(UID_LOG_ERROR, "In func <%s> " "UID_matchContract(%s) return NULL\n", __func__, cap->assigner);
        return UID_CAPBAC_UNTRUSTED_AUTH;
    }

    if (0 == UID_checkPermission(UID_CAPABILITY_BIT, profile->profile)) {
        UID_log(UID_LOG_ERROR, "In func <%s> " "UID_checkPermission() return 0\n", __func__);
        return UID_CAPBAC_UNTRUSTED_AUTH;
    }

    if (0 != strncmp(profile->serviceProviderAddress, cap->resourceID, sizeof(BTC_Address))) {
        UID_log(UID_LOG_ERROR, "In func <%s> " "serviceProviderAddress and resourceID mismatch\n", __func__);
        return UID_CAPBAC_MALFORMED;
    }

    memcpy(channel.serviceProviderAddress, cap->resourceID, sizeof(BTC_Address));
    memcpy(channel.serviceUserAddress, cap->assignee, sizeof(BTC_Address));
    memcpy(&(channel.profile.version), &(cap->rights), sizeof(UID_Rights));
    channel.profile.since = cap->since;
    channel.profile.until = cap->until;
    ret = UID_insertProvideChannel(&channel);
    if (ret != UID_CDB_OK) {
        UID_log(UID_LOG_ERROR, "In func <%s> " "UID_insertProvideChannel() return %d\n", __func__, ret);
        return ret;
    }

    return UID_CAPBAC_OK;
}