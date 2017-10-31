/*
 * @file   UID_utils.c
 *
 * @date   29/lug/2016
 * @author M. Palumbi
 */
 
 




/**
 * @file   UID_utils.h
 *
 * Utilities functions to support IAM library
 * 
 */
 
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <stdbool.h>
#include "sha2.h"
#include "ecdsa.h"
#include "secp256k1.h"
#include "base58.h"
#include "UID_utils.h"

/**
 * Converts an hex string to a binary buffer
 *
 * buf must be provided at least strlen(str) / 2 bytes long
 *
 * @param[in]  str string in hex format to convert
 * @param[out] buf binary out buffer
 * @param[in]  len size in bytes of the out buffer
 *
 * @return         number of bytes converted on success
 *                 0 if buffer too small
 */
size_t fromhex(const char *str, uint8_t *buf, size_t len)
{
	uint8_t c;
	size_t l = strlen(str) / 2;
	if (l > len) return 0;
	for (size_t i = 0; i < l; i++) {
		c = 0;
		if (str[i*2] >= '0' && str[i*2] <= '9') c += (str[i*2] - '0') << 4;
		if (str[i*2] >= 'a' && str[i*2] <= 'f') c += (10 + str[i*2] - 'a') << 4;
		if (str[i*2] >= 'A' && str[i*2] <= 'F') c += (10 + str[i*2] - 'A') << 4;
		if (str[i*2+1] >= '0' && str[i*2+1] <= '9') c += (str[i*2+1] - '0');
		if (str[i*2+1] >= 'a' && str[i*2+1] <= 'f') c += (10 + str[i*2+1] - 'a');
		if (str[i*2+1] >= 'A' && str[i*2+1] <= 'F') c += (10 + str[i*2+1] - 'A');
		buf[i] = c;
	}
	return l;
}

/**
 * Converts len bytes from an hex string to a binary buffer
 *
 * buf must be provided at least len bytes long
 *
 * @param[in]  str string in hex format to be converted
 * @param[out] buf binary out buffer
 * @param[in]  len number of bytes to be converted
 *
 * @return         address of the output buffer
 */
uint8_t *fromnhex(const char *str, uint8_t *buf, size_t len)
{
	uint8_t c;
	for (size_t i = 0; i < len; i++) {
		c = 0;
		if (str[i*2] >= '0' && str[i*2] <= '9') c += (str[i*2] - '0') << 4;
		if (str[i*2] >= 'a' && str[i*2] <= 'f') c += (10 + str[i*2] - 'a') << 4;
		if (str[i*2] >= 'A' && str[i*2] <= 'F') c += (10 + str[i*2] - 'A') << 4;
		if (str[i*2+1] >= '0' && str[i*2+1] <= '9') c += (str[i*2+1] - '0');
		if (str[i*2+1] >= 'a' && str[i*2+1] <= 'f') c += (10 + str[i*2+1] - 'a');
		if (str[i*2+1] >= 'A' && str[i*2+1] <= 'F') c += (10 + str[i*2+1] - 'A');
		buf[i] = c;
	}
	return buf;
}

/**
 * Converts a binary buffer to a string in hexadecimal ascii representation
 *
 * buf must be provided at least 2 * l + 1 bytes long
 *
 * @param[in]  bin input binary buffer
 * @param[in]  l   number of bytes to be converted
 * @param[out] buf buffer to be filled with the result
 *
 * @return         string buffer holding the result
 */
char *tohex(const uint8_t *bin, size_t l, char *buf)
{
//	char *buf = (char *)malloc(l * 2 + 1);
	static char digits[] = "0123456789abcdef";
	for (size_t i = 0; i < l; i++) {
		buf[i*2  ] = digits[(bin[i] >> 4) & 0xF];
		buf[i*2+1] = digits[bin[i] & 0xF];
	}
	buf[l * 2] = 0;
	return buf;
}

/**
 * Encode a varint (variable-lenght integer)
 *
 * out buffer must be at least 5 bytes in size
 *
 * @param[in]  len unsigned integer to be converted
 * @param[out] out buffer to be filled with the varint
 *
 * @return         the varint lenght in bytes
 */
uint32_t ser_length(uint32_t len, uint8_t *out)
{
	if (len < 253) {
		out[0] = len & 0xFF;
		return 1;
	}
	if (len < 0x10000) {
		out[0] = 253;
		out[1] = len & 0xFF;
		out[2] = (len >> 8) & 0xFF;
		return 3;
	}
	out[0] = 254;
	out[1] = len & 0xFF;
	out[2] = (len >> 8) & 0xFF;
	out[3] = (len >> 16) & 0xFF;
	out[4] = (len >> 24) & 0xFF;
	return 5;
}

/**
 * Compute the signature of a bitcoin message
 *
 * @param[in]  message     buffer holding the message to be signed
 * @param[in]  message_len lenght of the message
 * @param[in]  privkey     32 byte long buffer holding the private key (raw binary)
 * @param[out] signature   65 bytes long buffer to be filled with the signature
 *
 * @return                 0 == no error
 */
int cryptoMessageSign(const uint8_t *message, size_t message_len, const uint8_t *privkey, uint8_t *signature)
{
    SHA256_CTX ctx;
	sha256_Init(&ctx);
	sha256_Update(&ctx, (const uint8_t *)"\x18" "Bitcoin Signed Message:" "\n", 25);
	uint8_t varint[5];
	uint32_t l = ser_length(message_len, varint);
	sha256_Update(&ctx, varint, l);
	sha256_Update(&ctx, message, message_len);
	uint8_t hash[32];
	sha256_Final(&ctx, hash);
	sha256_Raw(hash, 32, hash);
	uint8_t pby;
	int result = ecdsa_sign_digest(&secp256k1, privkey, hash, signature + 1, &pby);
	if (result == 0) {
		signature[0] = 27 + pby + 4;
	}
	return result;
}

/**
 * Verify the signature of a bitcoin message
 *
 * @param[in] message     buffer holding the message to be verified
 * @param[in] message_len lenght of the message
 * @param[in] address     bitcoin address against which verify the signature
 * @param[in] signature   65 bytes long buffer holding the signature
 *
 * @return                0 == signature match
 */
int cryptoMessageVerify(const uint8_t *message, size_t message_len, const char *address, const uint8_t *signature)
{
  bignum256 r, s, e;
  curve_point cp, cp2;
  SHA256_CTX ctx;
  uint8_t pubkey[65], addr_raw[21], data[21], hash[32];

  uint8_t nV = signature[0];
  if (nV < 27 || nV >= 35) {
          return 1;
  }
  bool compressed;
  compressed = (nV >= 31);
  if (compressed) {
          nV -= 4;
  }
  uint8_t recid = nV - 27;
  // read r and s
  bn_read_be(signature + 1, &r);
  bn_read_be(signature + 33, &s);
  // x = r
  memcpy(&cp.x, &r, sizeof(bignum256));
  // compute y from x
  uncompress_coords(&secp256k1, recid % 2, &cp.x, &cp.y);
  // calculate hash
  sha256_Init(&ctx);
  sha256_Update(&ctx, (const uint8_t *)"\x18" "Bitcoin Signed Message:" "\n", 25);
  uint8_t varint[5];
  uint32_t l = ser_length(message_len, varint);
  sha256_Update(&ctx, varint, l);
  sha256_Update(&ctx, message, message_len);
  sha256_Final(&ctx, hash);
  sha256_Raw(hash, 32, hash);
  // e = -hash
  bn_read_be(hash, &e);
  bn_subtract(&secp256k1.order, &e, &e);
  // r = r^-1
  bn_inverse(&r, &secp256k1.order);
  point_multiply(&secp256k1, &s, &cp, &cp);
  scalar_multiply(&secp256k1, &e, &cp2);
  point_add(&secp256k1, &cp2, &cp);
  point_multiply(&secp256k1, &r, &cp, &cp);
  pubkey[0] = 0x04;
  bn_write_be(&cp.x, pubkey + 1);
  bn_write_be(&cp.y, pubkey + 33);
  // check if the address is correct
  if (compressed) {
          pubkey[0] = 0x02 | (cp.y.val[0] & 0x01);
  }
  memset(data,0,sizeof(data));
  base58_decode_check(address, data, sizeof(data));
  ecdsa_get_address_raw(pubkey, data[0], addr_raw);
  if (memcmp(addr_raw, data, 21) != 0) {
          return 2;
  }
  // check if signature verifies the digest
  if (ecdsa_verify_digest(&secp256k1, pubkey, signature + 1, hash) != 0) {
          return 3;
  }
  return 0;
}
