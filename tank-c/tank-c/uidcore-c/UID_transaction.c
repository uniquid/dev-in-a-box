/*
 * @file   UID_transaction.c
 *
 * @date   12/dec/2016
 * @author M. Palumbi
 */


/**
 * @file UID_transaction.h
 *
 * The module implements functions related to transaction signing.
 *
 */

#include <stdio.h>
#include <string.h>
#include "sha2.h"
#include "yajl/yajl_tree.h"
#include "UID_transaction.h"
#include "UID_bchainBTC.h"
#include "UID_utils.h"
#include "UID_identity.h"
#include "ecdsa.h"

/**
 * Takes in input a varint and outputs it as uint64_t
 *
 * @param[in]  stream varint to be decoded
 * @param[out] dest   decoded varint
 *
 * @return            if  > 0 number of bytes of the varint
 *                    if == 0 error. "varint overflow"
 */
size_t decode_varint(uint8_t *stream, uint64_t *dest)
{
    uint8_t byte;
    uint8_t bitpos = 0;
    uint64_t result = 0;
    int len=0;
    
    do
    {
        if (bitpos >= 64)
            return 0; // error! "varint overflow"
        
        byte = stream[len];
        len++;

        result |= (uint64_t)(byte & 0x7F) << bitpos;
        bitpos = (uint8_t)(bitpos + 7);
    } while (byte & 0x80);
    
    *dest = result;
    return len;
}



static uint8_t script[26] = { 0x19, 0x76, 0xa9, 0x14, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0x88, 0xac };
/**
 * takes a raw tx (with/without full input scripts) and
 * compute the digest [sha256(sha256())] for the "in" input of the transaction.
 * If address is != NULL, use it to build a pay2address script for the input
 * else uses the script in the tx
 *
 * @param[in]  rawtx    tx in binary form.
 * @param[in]  len      len of the raw tx
 * @param[in]  in       input for wich calculate the digest
 * @param[in]  address  raw bitcoin address (20 bytes)
 * @param[out] hash     returns the digest (sha256(sha256()))
 *
 * @return     UID_TX_INDEX_OUT_RANGE index exceed the number of inputs <br>
 *             UID_TX_PARSE_ERROR     error parsing the tx <br>
 *             UID_TX_OK              no error <br>
 */
int UID_digestRawTx(uint8_t *rawtx, size_t len, unsigned in, uint8_t address[20], uint8_t hash[32])
{
    uint8_t *ptr,*out;
    uint64_t n_inputs, i, l;
    size_t s;
	SHA256_CTX	context;

	sha256_Init(&context);

    s = decode_varint(rawtx+4, &n_inputs);
    if (in >= n_inputs) return UID_TX_INDEX_OUT_RANGE;
	sha256_Update(&context, rawtx, 4 + s);

    ptr = rawtx + 4 + s;  // points to the beginning of first input

    for (i = 0; i < n_inputs; i++) {
    	sha256_Update(&context, ptr, 36);
    	ptr += 36;
        s = decode_varint(ptr, &l);

        if (in == i)
            if (NULL == address) {
                sha256_Update(&context, ptr, l + s); // hash the script
            }
            else {  // build pay2address script
                memcpy(script + 4, address, 20);
                sha256_Update(&context, script, sizeof(script)); // hash the script
            }
        else 
            sha256_Update(&context, (uint8_t *)"", 1); // hash 0
        ptr += l + s;
        sha256_Update(&context, ptr, 4);
        ptr += 4;
    }
    // parse outputs to find the len
    out = ptr;
    s = decode_varint(ptr, &n_inputs);
    ptr += s;  // points to the beginning of first output
    for (i = 0; i < n_inputs; i++) {
        ptr += 8;  // amount
        s = decode_varint(ptr, &l);
        ptr += l + s;  // scripsig
    }
    ptr += 4;  //lock time

    if(len < (unsigned)(ptr - rawtx)) return UID_TX_PARSE_ERROR;
    sha256_Update(&context, out, (ptr - out));
    sha256_Update(&context, (uint8_t *)"\x1\x0\x0\x0", 4); // hash code type

	sha256_Final(&context, hash);
	sha256_Raw(hash, 32, hash);

    return UID_TX_OK;
}

/**
 * Build the signed transaction (hex coded)
 *
 * @param[in]  rawtx     unsigned tx in binary form
 * @param[in]  len       length of the unsigned tx
 * @param[in]  scriptsig array of the signed input scripts
 * @param[out] hexouttx  buffer to be filled with the
 *                       signed transaction (hex coded)
 * @param[in]  olen      length of the hexouttx buffer
 *
 * @return     return the length of the hexouttx string
 *             (binary tx length is return/2)
 *
 * @todo  check the length of the out buffer during the build
 *        and improve all the error checking
 */
int UID_buildSignedHex(uint8_t *rawtx, size_t len, UID_ScriptSig *scriptsig, char *hexouttx, size_t olen)
{
(void)olen;(void)len;
    size_t s;
    uint8_t *ptr,*out;
    char *hextx;
    uint64_t n_inputs, i, l;

    hextx = hexouttx;
    s = decode_varint(rawtx+4, &n_inputs);
	tohex(rawtx, 4 + s, hextx);
	ptr = rawtx + 4 + s;
	hextx += 2*(4 + s);

    for (i = 0; i < n_inputs; i++) {
        tohex(ptr, 36, hextx);
        ptr += 36;
        hextx += 72;
        s = decode_varint(ptr, &l);
        ptr += l + s;

        s = decode_varint(scriptsig[i], &l);
        tohex(scriptsig[i], 2*(l + s), hextx);

        hextx += 2*(l + s);
        tohex(ptr, 4, hextx);
        ptr += 4;
        hextx += 8;
    }
    // parse outputs to find the len
    out = ptr;
    s = decode_varint(ptr, &n_inputs);
    ptr += s;  // points to the beginning of first output
    for (i = 0; i < n_inputs; i++) {
        ptr += 8;  // amount
        s = decode_varint(ptr, &l);
        ptr += l + s;  // scripsig
    }
    ptr += 4;  //lock time

    s = (ptr - out);  // skip the hash code type if present
	tohex(out, s, hextx);
	hextx[2*s] = 0;

    return hextx - hexouttx + 2*s;
}

/**
 * Build the array of the signed input scripts
 * for P2PKH transactions
 *
 * @param[in]  rawtx     unsigned tx in binary form
 * @param[in]  rawtx_len length of the unsigned tx
 * @param[in]  path      array of the BIP32 paths to be
 *                       used to build and sign the scripts
 * @param[in]  n_inputs  elements in the path array
 * @param[out] scriptsig array of UID_ScriptSig to be
 *                       filled with the sgned scripts
 * @param[in]  n_script  elements in the scriptsig array
 *
 * @return     UID_TX_OK              no error <br>
 *             UID_TX_NOMEM           not enough elements in scriptsig array <br>
 *             UID_TX_INDEX_OUT_RANGE index exceed the number of inputs <br>
 *             UID_TX_PARSE_ERROR     error parsing the tx <br>
 */
int UID_buildScriptSig(uint8_t *rawtx, size_t rawtx_len, UID_Bip32Path *path, int n_inputs, UID_ScriptSig *scriptsig, int n_script)
{
    int i;
    int res;
    uint8_t public_key[33];
    uint8_t pubkeyhash[20];
	uint8_t hash[32];
    uint8_t sig[64] = {0};
	uint8_t len_der;

    if(n_script < n_inputs) return UID_TX_NOMEM;
    for( i=0; i<n_inputs; i++) {
        UID_getPubkeyAt(&path[i], public_key); //ecdsa_get_public_key33(&secp256k1, private_key, public_key);
        ecdsa_get_pubkeyhash(public_key, pubkeyhash);
        res = UID_digestRawTx(rawtx, rawtx_len, i, pubkeyhash, hash);
        if (UID_TX_OK != res) return res;
        UID_signAt(&path[i], hash, sig);  // ecdsa_sign_digest(&secp256k1, private_key, hash, sig, &pby);

        len_der = ecdsa_sig_to_der(sig, scriptsig[i]+2); // OP_PUSH(len of DER) || DER
        scriptsig[i][0] = 1 + len_der + 1 + 1 + 33;      // len script: OP_PUSH(len of DER) DER hash-type OP_PUSH(len of pubkey) pubkey
        scriptsig[i][1] = len_der + 1;                   // OP_PUSH(len of pubkey)
        scriptsig[i][len_der+2] = 0x01;                  // hash-type
        scriptsig[i][len_der+3] = 33;                    // OP_PUSH(len of pubkey)
        memcpy(scriptsig[i]+2+len_der+1+1, public_key, 33);
    }
    return UID_TX_OK;
}
/*
 * TODO: this code goes in segmentation fault
 {
	uint8_t rawtx[200] = {0};
	UID_ScriptSig scriptsig[2] = {{0}};
	UID_Bip32Path path[2] = {{0,1,3},{0,0,2}};
	int len = fromhex("0100000001"
			"d67835ed9b1bcd2946c225e59da4a110476225b3b1fb477fbb9826195cddf312010000001976a9141b2fc485361b251b53579dd8636532e2ebded02c88acffffffff"
			"403eda54f5096fceeb78a91a51a17a727e9d763da2ab48b3d173fa5feaa22d33010000001976a9141d1c309a3051f416cc8b0b389adbeacdd097094c88acffffffff"
			"01f0053101000000001976a914f9c9560f6d4cf2f652e6c75b3f8cf635cbcfc81188ac00000000",rawtx, sizeof(rawtx));
	CU_ASSERT(UID_TX_OK == UID_buildScriptSig(rawtx, len, path, 2, scriptsig, 2));
}
* improve rawtx parsing!!!
*/

static UID_ScriptSig scriptsig[UID_CONTRACT_MAX_IN];
static UID_Bip32Path bip32path[UID_CONTRACT_MAX_IN];
#define TX_OFFSET 6
static char jsontransaction[3000] = "rawtx=";
static char *transaction = jsontransaction+TX_OFFSET; //point to end of -->rawtx=<--
static uint8_t rawtx[1500];
static size_t rawtx_len;
static char errbuf[1024];

/**
 * System RPC function used to sign and send a contract on the blockchain
 *
 * In input takes a JSON with the list of bip32 paths to
 * be used to sign and the raw transction to be signed.
 * If ok the signed transaction is sent on the blockchain
 * and the txid is returned
 *
 * @param[in]  param  contract to sign and send: {"paths":["0/0/1","0/1/5"],"tx":"01000000028a9799dcc44b529aa2c4dd......"}
 * @param[out] result if all ok returns the transaction ID: <br>
 *                    "0 - 3cd0f12a587945c75edde69e8989260fb4126b6ae803cb26de751e62a47137be"
 * @param[in]  size   size of result buffer
 *
 * @todo function is not thread safe!!
 */
void UID_signAndSendContract(char *param, char *result, size_t size)
{
    yajl_val jnode, paths, v;
    char *str;
    unsigned i, res;

	jnode = yajl_tree_parse(param, errbuf, sizeof(errbuf));
    if (jnode == NULL) {
        snprintf(result, size, "1 - parse_error: %s", strlen(errbuf)?"unknown error":errbuf);
        return;
    }

    const char * path[] = { "paths",(const char *) 0 };
    paths = yajl_tree_get(jnode, path, yajl_t_array);
    if (paths == NULL) {
        snprintf(result, size, "2 - UID_signAndSendContract() parse error: \"%s\" array not found", path[0]);
        goto clean_return;
    }
    if (UID_CONTRACT_MAX_IN < paths->u.array.len) {
        snprintf(result, size, "3 - UID_signAndSendContract() too many inputs <%zd>", paths->u.array.len);
        goto clean_return;
    }
    for(i=0;i<paths->u.array.len;i++) {
        v = paths->u.array.values[i];
        str = YAJL_GET_STRING(v);
        sscanf(str,"%u/%u/%u", &bip32path[i].p_u, &bip32path[i].account, &bip32path[i].n);
    }

    path[0] = "tx";
    v = yajl_tree_get(jnode, path, yajl_t_string);
    if (v == NULL) {
        snprintf(result, size, "4 - UID_signAndSendContract() parse error: \"%s\" string not found", path[0]);
        goto clean_return;
    }
    str = YAJL_GET_STRING(v);

    rawtx_len = fromhex(str, rawtx, sizeof(rawtx));
    UID_buildScriptSig(rawtx, rawtx_len, bip32path, i, scriptsig, UID_CONTRACT_MAX_IN);
    UID_buildSignedHex(rawtx, rawtx_len, scriptsig, transaction, sizeof(jsontransaction)-TX_OFFSET);
    strcpy(result, "6 - ");
    res = UID_sendTx(jsontransaction, result + 4, size - 4);
    if (0 == res) {
        yajl_tree_free(jnode);
        jnode = yajl_tree_parse(result + 4, errbuf, sizeof(errbuf));
        if ( NULL != jnode) {
            path[0] = "txid";
            v = yajl_tree_get(jnode, path, yajl_t_string);
            if ( NULL != v) {
                str = YAJL_GET_STRING(v);
                snprintf(result, size, "0 - %s", str);
            }
        }
    }
    else {
        snprintf(result, size, "5 - UID_sendTx() return <%d>", res);
    }

clean_return:
    yajl_tree_free(jnode);
    return;
}
