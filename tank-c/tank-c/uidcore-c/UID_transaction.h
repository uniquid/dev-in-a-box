/**
 * @file   UID_transaction.h
 *
 * @date   12/dec/2016
 * @author M. Palumbi
 */



#ifndef __UID_TRANSACTION_H
#define __UID_TRANSACTION_H

#include <stdint.h>
#include <stdlib.h>
#include "UID_identity.h"

#define UID_CONTRACT_MAX_IN 3

typedef uint8_t UID_ScriptSig[1 /*len*/ + 1 /*OP_PUSH*/ + 72 /*maxDER*/ + 1 /*hash type*/ + 1 /*OP_PUSH*/ + 33 /*pub key*/];

int UID_digestRawTx(uint8_t *rawtx, size_t len, unsigned in, uint8_t address[20], uint8_t hash[32]);
int UID_buildSignedHex(uint8_t *rawtx, size_t len, UID_ScriptSig *scriptsig, char *hextx, size_t olen);
int UID_buildScriptSig(uint8_t *rawtx, size_t rawtx_len, UID_Bip32Path *path, int n_inputs, UID_ScriptSig *scriptsig, int n_script);
void UID_signAndSendContract(char *param, char *result, size_t size);

#endif // __UID_TRANSACTION_H
