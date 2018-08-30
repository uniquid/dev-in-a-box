/**
 * @file   UID_globals.h
 *
 * @date   3/aug/2016
 * @author M. Palumbi
 */
 
 
#ifndef __UID_GLOBALS_H
#define __UID_GLOBALS_H

#include <stdint.h>

#define BTC_ADDRESS_MIN_LENGHT 26
#define BTC_ADDRESS_MAX_LENGHT 35
#define BTC_SIGNATURE_LENGHT 88
// overestimation of the lenght of the ASCII representation of the integer type
#define ASCII_DECIMAL_LENGHT(type) ((sizeof(type)*8 - 1 + 10) / 10 * 3 + 1) 

typedef char BTC_Address[BTC_ADDRESS_MAX_LENGHT+1]; //address base58 coded
typedef uint8_t BTC_PublicKey[33];  //compressed public key
typedef uint8_t BTC_PrivateKey[32]; //Private key
typedef char BTC_Signature[BTC_SIGNATURE_LENGHT+1]; //(recovery byte + signature) base64 encoded

/* error codes for the library functions */
#define UID_OK 0
#define UID_CONTRACTS_OK			UID_OK
#define UID_CONTRACTS_SERV_ERROR	1
#define UID_CONTRACTS_NO_TX			2

#define UID_DISPATCH_OK				UID_OK
//#define UID_DISPATCH_NOCONTRACT	3
#define UID_DISPATCH_NOPERMISSION	4
#define UID_DISPATCH_NOTEXISTENT	5
#define UID_DISPATCH_RESERVED		6
#define UID_DISPATCH_INUSE			7

#define UID_MSG_OK					UID_OK
#define UID_MSG_NOT_FOUND			8
#define UID_MSG_GEN_ALLOC_FAIL		9
#define UID_MSG_GEN_FAIL			10
#define UID_MSG_SMALL_BUFFER		11
#define UID_MSG_JPARSE_ERROR		12
#define UID_MSG_NO_CONTRACT			13
#define UID_MSG_INVALID_SENDER		14
#define UID_MSG_ID_MISMATCH			15
#define UID_MSG_RPC_ERROR			0x100

#define UID_TX_OK					UID_OK
#define UID_TX_INDEX_OUT_RANGE		16
#define UID_TX_NOMEM				17
#define UID_TX_PARSE_ERROR			18

#define UID_HTTP_OK					UID_OK
#define UID_HTTP_GET_ERROR  		19
#define UID_HTTP_POST_ERROR  		20
#define UID_HTTP_CLEANUP_ERROR 		21

#define UID_SIGN_OK                 UID_OK
#define UID_SIGN_FAILED             22
#define UID_SIGN_SMALL_BUFFER       23
#define UID_SIGN_INVALID_CHARACTER  24
#define UID_SIGN_VERIFY_ERROR       25

#define UID_CAPBAC_OK               UID_OK
#define UID_CAPBAC_SMALL_BUFFER     26
#define UID_CAPBAC_SER_ERROR        27
#define UID_CAPBAC_UNTRUSTED_AUTH   28
#define UID_CAPBAC_MALFORMED        29

#define UID_CDB_OK                  UID_OK

typedef struct
{
    BTC_PrivateKey privateKey;
    BTC_PublicKey publicKey;
} UID_KeyPair;


#endif
