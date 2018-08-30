/**
 * @file   UID_utils.h
 *
 * @date   29/lug/2016
 * @author M. Palumbi
 */
 
 
#ifndef __UID_UTILS_H
#define __UID_UTILS_H

#include "UID_identity.h"

size_t fromhex(const char *str, uint8_t *buf, size_t len);
uint8_t *fromnhex(const char *str, uint8_t *buf, size_t len);

char *tohex(const uint8_t *bin, size_t l, char *buf);
int cryptoMessageSign(const uint8_t *message, size_t message_len, const uint8_t *privkey, uint8_t *signature);
int cryptoMessageVerify(const uint8_t *message, size_t message_len, const char *address_raw, const uint8_t *signature);
int UID_signMessage(char *message, UID_Bip32Path *path, char *b64signature, size_t ssize);
int UID_verifyMessage(char *message, char *b64signature, char *address);



#endif
