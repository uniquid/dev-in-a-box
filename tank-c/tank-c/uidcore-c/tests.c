#include <CUnit/CUnit.h>
#include <CUnit/Basic.h>
//#include "CUnit/Automated.h"
//#include "CUnit/Console.h"

#include "UID_identity.h"
#include "UID_bchainBTC.h"
#include "UID_fillCache.h"
#include "UID_message.h"
#include "UID_dispatch.h"
#include "UID_utils.h"
#include "UID_transaction.h"
#include "base64.h"
#include "UID_capBAC.h"
#include "UID_time.h"

#include <stdio.h>  // for printf
#include <unistd.h> // unlink


/**************************** Identity test suite *******************************/

/* Test Suite setup and cleanup functions: */

int init_identity_suite(void)  { return 0; }
int clean_identity_suite(void) { return 0; }

/************* Test case functions ****************/

void test_case_identity1(void)
{
	char *imprinting_tpub;

	unlink("identity.db");

	UID_getLocalIdentity("tprv8ZgxMBicQKsPdoj3tQG8Z2bzNsCTsk9heayJQA1pQStVx2hLEyVwx6gfHZ2p4dSzbvaEw7qrDXnX54vTVbkLghZcB24TXuj1ADXPUCvyfcy");
	imprinting_tpub = UID_getTpub();
	CU_ASSERT_STRING_EQUAL(imprinting_tpub,"tpubDBU6qWBY1xUz9vJ8Mr7fy5wjH5mD5qAMV4ZSHXGmUvjtMyX55fXaRWaQrQCawL6ALkPFdjLhPL48LKRuanDTvXHasnG7zYVE1w45s9P3sP4");

	UID_getLocalIdentity(NULL);
	imprinting_tpub = UID_getTpub();
	CU_ASSERT_STRING_EQUAL(imprinting_tpub,"tpubDBU6qWBY1xUz9vJ8Mr7fy5wjH5mD5qAMV4ZSHXGmUvjtMyX55fXaRWaQrQCawL6ALkPFdjLhPL48LKRuanDTvXHasnG7zYVE1w45s9P3sP4");

	unlink("identity.db");

	UID_getLocalIdentity(NULL);
	imprinting_tpub = UID_getTpub();
	CU_ASSERT_STRING_NOT_EQUAL(imprinting_tpub,"tpubDBU6qWBY1xUz9vJ8Mr7fy5wjH5mD5qAMV4ZSHXGmUvjtMyX55fXaRWaQrQCawL6ALkPFdjLhPL48LKRuanDTvXHasnG7zYVE1w45s9P3sP4");

	unlink("identity.db");
}

void test_case_identity2(void)
{
	unlink("identity.db");
	UID_getLocalIdentity("tprv8ZgxMBicQKsPdoj3tQG8Z2bzNsCTsk9heayJQA1pQStVx2hLEyVwx6gfHZ2p4dSzbvaEw7qrDXnX54vTVbkLghZcB24TXuj1ADXPUCvyfcy");

	{
		uint8_t sig[64] = {0};
		uint8_t hash[32] = "\x0e\x78\xb2\x90\x4c\xff\x87\x87\x30\x04\x2f\x27\xf7\x95\xdc\x85"
						   "\xa6\xa3\x31\x2b\x6d\x84\xf7\xa4\x9d\x44\xa3\xd9\x7e\xba\xa0\xe0";
		uint8_t result[64] = "\xbc\x52\xa0\xa2\x87\xdd\xa0\x3d\x21\x92\xe1\xa5\x5e\xe3\x80\x48\x14\xb2\x88\x58\xb2\x7e\x53\x7b\x71\xae\xc6\x28\x5e\xec\xb9\x55"
							 "\x68\x31\x91\x53\xe5\x72\x6f\x63\x8c\xf1\x9e\xcc\xff\xa3\x8a\xf3\x0a\x3a\x46\x4f\x14\xf9\x35\xba\xf0\xc1\xc9\x45\x98\xd7\xdf\xe0";

		UID_Bip32Path path = {0, 0, 17};
		UID_signAt(&path, hash, sig, NULL);
		CU_ASSERT(0 == memcmp(sig, result, sizeof(result)));
	}

	unlink("identity.db");
}

void test_case_identity3(void)
{
	unlink("identity.db");
	UID_getLocalIdentity("tprv8ZgxMBicQKsPdoj3tQG8Z2bzNsCTsk9heayJQA1pQStVx2hLEyVwx6gfHZ2p4dSzbvaEw7qrDXnX54vTVbkLghZcB24TXuj1ADXPUCvyfcy");

	{
		uint8_t public_key[33] = {0};
		uint8_t result[33] = "\x03\x73\xb7\x84\x15\x0c\x5a\x81\xe6\x4a"
							 "\x82\x88\x80\xa7\xbc\x5e\x50\xee\x91\xa9"
							 "\x8b\x62\xe2\xda\xfa\xd2\x70\xa1\x56\xd8"
							 "\x2e\xb3\xc0";
		UID_Bip32Path path = {1, 0, 15};
		UID_getPubkeyAt(&path, public_key);
		CU_ASSERT(0 == memcmp(public_key, result, sizeof(result)));
	}

	{
		uint8_t public_key[33] = {0};
		uint8_t result[33] = "\x03\x73\xb7\x84\x15\x0c\x5a\x81\xe6\x4a"
							 "\x82\x88\x80\xa7\xbc\x5e\x50\xee\x91\xa9"
							 "\x8b\x62\xe2\xda\xfa\xd2\x70\xa1\x56\xd8"
							 "\x2e\xb3\xc0";
		UID_Bip32Path path = {0, 1, 31};
		UID_getPubkeyAt(&path, public_key);
		CU_ASSERT(0 != memcmp(public_key, result, sizeof(result)));
	}

	{
		uint8_t public_key[33] = {0};
		uint8_t result[33] = "\x02\x81\x47\x69\x00\xc7\x3e\x10\xf7\x6a"
							 "\x0d\xba\x80\x72\xf1\xfa\x17\xb7\x23\x8c"
							 "\xc6\x6a\x5a\x9e\x84\x7a\xa5\xba\x25\x85"
							 "\x40\xab\x4c";
		UID_Bip32Path path = {0, 1, 31};
		UID_getPubkeyAt(&path, public_key);
		CU_ASSERT(0 == memcmp(public_key, result, sizeof(result)));
	}

	unlink("identity.db");
}

void test_case_identity4(void)
{
	unlink("identity.db");
	UID_getLocalIdentity("tprv8ZgxMBicQKsPdoj3tQG8Z2bzNsCTsk9heayJQA1pQStVx2hLEyVwx6gfHZ2p4dSzbvaEw7qrDXnX54vTVbkLghZcB24TXuj1ADXPUCvyfcy");

	{
		char b58addr[BTC_ADDRESS_MAX_LENGHT] = {0};
		UID_Bip32Path path = {1, 0, 7};
		UID_getAddressAt(&path, b58addr, sizeof(b58addr));
		CU_ASSERT_STRING_EQUAL(b58addr, "mmuW9AKkDwapTeAkPmqpgBPSEkMuY2pHy5");
	}

	{
		char b58addr[BTC_ADDRESS_MAX_LENGHT] = {0};
		UID_Bip32Path path = {1, 1, 7};
		UID_getAddressAt(&path, b58addr, sizeof(b58addr));
		CU_ASSERT_STRING_NOT_EQUAL(b58addr, "mmuW9AKkDwapTeAkPmqpgBPSEkMuY2pHy5");
	}

	{
		char b58addr[BTC_ADDRESS_MAX_LENGHT] = {0};
		UID_Bip32Path path = {1, 1, 7};
		UID_getAddressAt(&path, b58addr, sizeof(b58addr));
		CU_ASSERT_STRING_EQUAL(b58addr, "mkSgTpuGsFdQkm4i1rNuydB87AVY1K6CHG");
	}

	unlink("identity.db");
}

/**************************** General test suite *******************************/

/* Test Suite setup and cleanup functions: */

int init_general_suite(void)
{
	extern cache_buffer *current;
	uint8_t bit_mask1[18] = { 0x00, 0x00, 0x00, 0x80     }; // bit 31 ON

    strncpy(current->contractsCache[0].serviceUserAddress, "my3CohS9f57yCqNy4yAPbBRqLaAAJ9oqXV", sizeof(BTC_Address));
    strncpy(current->contractsCache[0].serviceProviderAddress, "mw5oLLjxSNsPRdDgArCZseGEQJVdNYNK5U", sizeof(BTC_Address));
    memcpy(current->contractsCache[0].profile.bit_mask, bit_mask1, sizeof(current->contractsCache[0].profile.bit_mask));
    strncpy(current->contractsCache[1].serviceUserAddress, "myUFCeVGwkJv3PXy4zc1KSWRT8dC5iTvhU", sizeof(BTC_Address));
    strncpy(current->contractsCache[1].serviceProviderAddress, "mtEQ22KCcjpz73hWfNvJoq6tqMEcRUKk3m", sizeof(BTC_Address));
    memset(current->contractsCache[1].profile.bit_mask, 0, sizeof(current->contractsCache[1].profile.bit_mask));
    current->validCacheEntries = 2;
    strncpy(current->clientCache[0].serviceProviderName, "LocalMachine", sizeof(((UID_ClientProfile *)0)->serviceProviderName));
    strncpy(current->clientCache[0].serviceProviderAddress, "mw5oLLjxSNsPRdDgArCZseGEQJVdNYNK5U", sizeof(((UID_ClientProfile *)0)->serviceProviderAddress));
    strncpy(current->clientCache[0].serviceUserAddress, "my3CohS9f57yCqNy4yAPbBRqLaAAJ9oqXV", sizeof(((UID_ClientProfile *)0)->serviceUserAddress));
    strncpy(current->clientCache[1].serviceProviderName, "UID984fee057c6d", sizeof(((UID_ClientProfile *)0)->serviceProviderName));
    strncpy(current->clientCache[1].serviceProviderAddress, "mtEQ22KCcjpz73hWfNvJoq6tqMEcRUKk3m", sizeof(((UID_ClientProfile *)0)->serviceProviderAddress));
    strncpy(current->clientCache[1].serviceUserAddress, "myUFCeVGwkJv3PXy4zc1KSWRT8dC5iTvhU", sizeof(((UID_ClientProfile *)0)->serviceUserAddress));
    strncpy(current->clientCache[2].serviceProviderName, "nocontract", sizeof(((UID_ClientProfile *)0)->serviceProviderName));
    strncpy(current->clientCache[2].serviceProviderAddress, "mtEQ22KCcjpz73hWfNvJoq6tqMEcRUKk3m", sizeof(((UID_ClientProfile *)0)->serviceProviderAddress));
    strncpy(current->clientCache[2].serviceUserAddress, "n1UevZASvVyNhAB2d5Nm9EaHFeooJZbSP7", sizeof(((UID_ClientProfile *)0)->serviceUserAddress));
    current->validClientEntries = 3;


	unlink("identity.db");
	UID_getLocalIdentity("tprv8ZgxMBicQKsPdoj3tQG8Z2bzNsCTsk9heayJQA1pQStVx2hLEyVwx6gfHZ2p4dSzbvaEw7qrDXnX54vTVbkLghZcB24TXuj1ADXPUCvyfcy");
	return 0;
}
int clean_general_suite(void)
{
	unlink("identity.db");
	return 0;
}

/************* Test case functions ****************/

void test_case_general1(void)
{
	UID_ClientChannelCtx u_ctx;

	// user
	CU_ASSERT_NOT_EQUAL(0, UID_createChannel("noName", &u_ctx));
	CU_ASSERT_EQUAL(0, UID_createChannel("LocalMachine", &u_ctx));
	CU_ASSERT_STRING_EQUAL("mw5oLLjxSNsPRdDgArCZseGEQJVdNYNK5U", u_ctx.peerid);
	CU_ASSERT_STRING_EQUAL("my3CohS9f57yCqNy4yAPbBRqLaAAJ9oqXV", u_ctx.myid);
{
	uint8_t msg[500] = {0};
	size_t size = 3;
	int64_t sID0 = 0;
	CU_ASSERT_NOT_EQUAL(0, UID_formatReqMsg(u_ctx.myid, 31, "Test ECHO", msg, &size, &sID0));
}
	uint8_t msg[500] = {0};
	size_t size = sizeof(msg);
	int64_t sID0 = 0;
	CU_ASSERT_EQUAL(0, UID_formatReqMsg(u_ctx.myid, 31, "Test ECHO", msg, &size, &sID0));
	CU_ASSERT_NOT_EQUAL(sizeof(msg), size);
	CU_ASSERT_NOT_EQUAL(0, sID0);

	// provider
	uint8_t fmsg[500] = {0};
	size_t fsize = sizeof(fmsg);
	UID_ServerChannelCtx sctx;
	UID_accept_channel(msg, size, &sctx, fmsg, &fsize);

{
	char sender[35] = {0};
	int method = 0;
	char params[100] = {0};
	int64_t sID1 = 0;
	CU_ASSERT_NOT_EQUAL(0, UID_parseReqMsg((uint8_t *)"Foo bar", fsize, sender, sizeof(sender), &method, params, sizeof(params), &sID1));
}
	char sender[35] = {0};
	int method = 0;
	char params[100] = {0};
	int64_t sID1 = 0;
	CU_ASSERT_EQUAL(0, UID_parseReqMsg(fmsg, fsize, sender, sizeof(sender), &method, params, sizeof(params), &sID1));

	CU_ASSERT_STRING_EQUAL(u_ctx.myid, sender);
	CU_ASSERT_EQUAL(31,method);
	CU_ASSERT_STRING_EQUAL("Test ECHO", params);
	CU_ASSERT_EQUAL(sID0, sID1);
	CU_ASSERT_STRING_EQUAL(sender, sctx.contract.serviceUserAddress);

	CU_ASSERT_NOT_EQUAL(0, UID_checkPermission(method, sctx.contract.profile));
	CU_ASSERT_EQUAL(0, UID_checkPermission(30, sctx.contract.profile));

	char result[100];
	CU_ASSERT_EQUAL(0, UID_performRequest(method, params, result, sizeof(result)));

	CU_ASSERT_STRING_EQUAL("UID_echo: <Test ECHO>", result);

	uint8_t response[500] = {0};
	size_t rsize = sizeof(response);
	CU_ASSERT_EQUAL(0, UID_formatRespMsg(sctx.contract.serviceProviderAddress, result, 0, sID1, response, &rsize));

	CU_ASSERT_NOT_EQUAL(sizeof(response), rsize);

	CU_ASSERT_EQUAL(0, UID_closeServerChannel(&sctx));

	//user
	char r_sender[35] = {0};
	int r_error = -1;
	char r_result[100] = {0};
	int64_t sID2 = 0;
	CU_ASSERT_EQUAL(0, UID_parseRespMsg(response, rsize, r_sender, sizeof(r_sender), &r_error, r_result, sizeof(r_result), &sID2));

	CU_ASSERT_STRING_EQUAL(u_ctx.peerid, r_sender);
	CU_ASSERT_EQUAL(0, r_error);
	CU_ASSERT_STRING_EQUAL("UID_echo: <Test ECHO>", r_result);
	CU_ASSERT_EQUAL(sID1, sID2);

	CU_ASSERT_EQUAL(0, UID_closeChannel(&u_ctx));
}

void test_case_utils1(void)
{
{
	uint8_t buf[30] = {0};
	char str[] = "2e34f2ac6dfe6153";
	uint8_t res[8] = "\x2e\x34\xf2\xac\x6d\xfe\x61\x53";
	CU_ASSERT( sizeof(res) == fromhex(str, buf, sizeof(buf)));
	CU_ASSERT( 0 == memcmp(buf, res, sizeof(res)));
}
{
	uint8_t buf[30] = {0};
	char str[] = "d9e8b23777c1f313e24a35332de3a47f32e99fb9074d0ba532153c05e065";
	uint8_t res[30] = "\xd9\xe8\xb2\x37\x77\xc1\xf3\x13\xe2\x4a\x35\x33\x2d\xe3\xa4"
                      "\x7f\x32\xe9\x9f\xb9\x07\x4d\x0b\xa5\x32\x15\x3c\x05\xe0\x65";
	CU_ASSERT( sizeof(res) == fromhex(str, buf, sizeof(buf)));
	CU_ASSERT( 0 == memcmp(buf, res, sizeof(res)));
}
{
	uint8_t buf[30] = {0};
	char str[] = "53c05e065c7a0349346324f76bbf77abd8f3334f2a2e9f3fb8c4f72b04614102";
	CU_ASSERT( 0 == fromhex(str, buf, sizeof(buf)));
}
}

void test_case_utils2(void)
{
	uint8_t buf[30] = {0};
	char str[] = "2e34f2ac6dfe6153d9e8b237";
	uint8_t res[12] = "\x2e\x34\xf2\xac\x6d\xfe\x61\x53\xd9\xe8\xb2\x37";
	CU_ASSERT( buf == fromnhex(str, buf, 8));
	CU_ASSERT(0 == memcmp(buf, res, 8));
	CU_ASSERT(0 != memcmp(buf, res, sizeof(res)));
}

void test_case_utils3(void)
{
	const uint8_t bin[12] = "\x2e\x34\xf2\xac\x6d\xfe\x61\x53\xd9\xe8\xb2\x37";
	char buf[25] = {0};
	char res[] = "2e34f2ac6dfe6153d9e8b237";

	CU_ASSERT(buf == tohex(bin, 12, buf));
	CU_ASSERT(0 == strcmp(res, buf));
}

void test_case_utils4(void)
{
{
	uint8_t msg[40] = "You can enter an existing BIP39 mnemonic"; //note: this is not NULL terminated!!
	uint8_t privkey[32] = "\x42\x7b\x76\x4d\xb9\x04\x1e\xe7\xc2\x0c\xfe\x94\x49\xe3\x8e\x83"
                          "\xda\x46\x97\x80\x6b\x54\x9d\x76\x2c\xcc\xea\x8e\xf3\x27\x68\xd5";
	uint8_t sig[65] = "\x1F\x92\x2E\xE5\x4B\xA7\x33\x5B\x1B\x7D\xB0\x28\xB5\xAA\x73\x43\x24"
                          "\x6E\xB3\xEF\x3F\x2A\xAF\x61\x53\x31\x24\x78\x8D\x62\x10\x68\xC0"
                          "\x34\x85\x1C\x04\x70\x80\x2A\xE7\x0A\x54\x8D\x79\x5C\x18\x35\xF1"
                          "\xC9\x6E\x1D\x36\x01\x67\x0F\x2F\x5A\xCF\x2C\x2E\x80\x59\x13\x26";
	uint8_t signature[65] = {0};
	CU_ASSERT(0 == cryptoMessageSign(msg, sizeof(msg), privkey, signature));
	CU_ASSERT(0 == memcmp(signature, sig, sizeof(signature)));
}
{
	uint8_t msg[40] = "You can enter an existing BIP39 mnemoniK"; //note: this is not NULL terminated!!
	uint8_t privkey[32] = "\x42\x7b\x76\x4d\xb9\x04\x1e\xe7\xc2\x0c\xfe\x94\x49\xe3\x8e\x83"
                          "\xda\x46\x97\x80\x6b\x54\x9d\x76\x2c\xcc\xea\x8e\xf3\x27\x68\xd5";
	uint8_t sig[65] = "\x1F\x92\x2E\xE5\x4B\xA7\x33\x5B\x1B\x7D\xB0\x28\xB5\xAA\x73\x43\x24"
                          "\x6E\xB3\xEF\x3F\x2A\xAF\x61\x53\x31\x24\x78\x8D\x62\x10\x68\xC0"
                          "\x34\x85\x1C\x04\x70\x80\x2A\xE7\x0A\x54\x8D\x79\x5C\x18\x35\xF1"
                          "\xC9\x6E\x1D\x36\x01\x67\x0F\x2F\x5A\xCF\x2C\x2E\x80\x59\x13\x26";
	uint8_t signature[65] = {0};
	CU_ASSERT(0 == cryptoMessageSign(msg, sizeof(msg), privkey, signature));
	CU_ASSERT(0 != memcmp(signature, sig, sizeof(signature)));
}
{
	uint8_t msg[84] = "The account extended keys can be used for importing to most BIP44 compatible wallets"; //note: this is not NULL terminated!!
	uint8_t privkey[32] = "\xe7\x8b\xd3\xd8\x97\xe9\xce\xc5\xcd\xb5\xda\x72\x80\x5a\x73\x03"
                          "\xd6\x7e\x0d\x18\x0d\xd9\x2b\xb6\xfb\x91\xf4\x72\xb1\xeb\xfc\xca";
	uint8_t sig[65] = "\x1F\xB6\x9D\xCD\xDA\xCC\x10\xB6\x69\x88\x64\xEA\xBA\xC8\xE0\x4E\x00"
                          "\x46\xB2\xCE\x9A\x4A\xB1\x92\xE9\xCB\x68\x31\x39\xF6\x3D\x50\xEC"
                          "\x27\x85\x77\xFA\x62\x7E\xD6\xC4\x3F\x29\x2A\x33\x74\xE0\x2C\x64"
                          "\xBA\x0F\xD9\x18\x72\xE5\xF4\xD7\x1E\x5D\x16\xCE\x93\x5B\xF7\xB6";
	uint8_t signature[65] = {0};
	CU_ASSERT(0 == cryptoMessageSign(msg, sizeof(msg), privkey, signature));
	CU_ASSERT(0 == memcmp(signature, sig, sizeof(signature)));
}
{
	uint8_t msg[263] = "The quick brown fox jumps over the lazy dog "
                       "The quick brown fox jumps over the lazy dog "
                       "The quick brown fox jumps over the lazy dog "
                       "The quick brown fox jumps over the lazy dog "
                       "The quick brown fox jumps over the lazy dog "
                       "The quick brown fox jumps over the lazy dog"; //note: this is not NULL terminated!!
	uint8_t privkey[32] = "\xe7\x8b\xd3\xd8\x97\xe9\xce\xc5\xcd\xb5\xda\x72\x80\x5a\x73\x03"
                          "\xd6\x7e\x0d\x18\x0d\xd9\x2b\xb6\xfb\x91\xf4\x72\xb1\xeb\xfc\xca";
	uint8_t sig[65] = "\x1F\x81\xE1\x9A\x00\xE7\x6C\xB0\x1E\xCA\xA6\x3E\x12\x66\x95\x38\x66"
                          "\xE7\x6C\xC6\x48\x15\xCD\x02\x79\xFD\x31\x1B\x38\x68\xAC\x5A\xFE"
                          "\x38\x9E\x77\xB5\x33\x21\x34\x9A\xEA\xA5\x91\xDC\x2D\xBE\x7D\x80"
                          "\x8F\x71\x32\x39\x39\xC3\x8A\x90\x2E\x02\xCB\x54\x2D\x4E\xAC\x00";
	uint8_t signature[65] = {0};
	CU_ASSERT(0 == cryptoMessageSign(msg, sizeof(msg), privkey, signature));
	CU_ASSERT(0 == memcmp(signature, sig, sizeof(signature)));
}
}

void test_case_utils5(void)
{
{
	uint8_t msg[84] = "The account extended keys can be used for importing to most BIP44 compatible wallets"; //note: this is not NULL terminated!!
	char address[] = "1MeWoTzsbPioXNAi72yArwzULBhDGD7yDP";
	uint8_t sig[65] = "\x1F\xB6\x9D\xCD\xDA\xCC\x10\xB6\x69\x88\x64\xEA\xBA\xC8\xE0\x4E\x00"
                          "\x46\xB2\xCE\x9A\x4A\xB1\x92\xE9\xCB\x68\x31\x39\xF6\x3D\x50\xEC"
                          "\x27\x85\x77\xFA\x62\x7E\xD6\xC4\x3F\x29\x2A\x33\x74\xE0\x2C\x64"
                          "\xBA\x0F\xD9\x18\x72\xE5\xF4\xD7\x1E\x5D\x16\xCE\x93\x5B\xF7\xB6";
	CU_ASSERT(0 == cryptoMessageVerify(msg, sizeof(msg), address, sig));
}
{
	uint8_t msg[84] = "The account extended keys can be used for importing to most BIP44 compatible wallets"; //note: this is not NULL terminated!!
	char address[] = "18BH3UNNuUgHkoKHua2CD2GAZDQQ3Bqrfg";
	uint8_t sig[65] = "\x1F\xB6\x9D\xCD\xDA\xCC\x10\xB6\x69\x88\x64\xEA\xBA\xC8\xE0\x4E\x00"
                          "\x46\xB2\xCE\x9A\x4A\xB1\x92\xE9\xCB\x68\x31\x39\xF6\x3D\x50\xEC"
                          "\x27\x85\x77\xFA\x62\x7E\xD6\xC4\x3F\x29\x2A\x33\x74\xE0\x2C\x64"
                          "\xBA\x0F\xD9\x18\x72\xE5\xF4\xD7\x1E\x5D\x16\xCE\x93\x5B\xF7\xB6";
	CU_ASSERT(0 != cryptoMessageVerify(msg, sizeof(msg), address, sig));
}
{
	uint8_t msg[66] = "Typing your own twelve words will probably not work how you expect"; //note: this is not NULL terminated!!
	char address[] = "n2SXkEhp6tkV6yg8N1pjEazTnm5kG5R2qo";
	uint8_t sig[65] = "\x1F\x0B\x03\xA4\x8D\xE2\xD6\x60\x96\xD4\xF4\x92\x87\x32\x35\x94\x6B"
                          "\xD5\x81\x84\xCA\x87\x83\x85\xF2\x6A\xF5\x8F\x37\x8C\x74\x63\xDD"
                          "\x24\x4C\x8E\xA8\xE6\x40\x16\x36\x37\xAE\x97\x67\x82\x66\xEA\xE2"
                          "\xCB\x87\xDB\xDC\x3E\xBB\xD9\x13\xF8\x05\xC5\x2E\xD4\xFC\xBA\x11";
	CU_ASSERT(0 == cryptoMessageVerify(msg, sizeof(msg), address, sig));
}
}

void test_case_transaction1(void)
{
{
	uint8_t rawtx[200] = {0};
	UID_ScriptSig scriptsig[2] = {{0}};
	UID_Bip32Path path[2] = {{0,1,3},{0,0,2}};
	int len = fromhex("0100000003"
			"d67835ed9b1bcd2946c225e59da4a110476225b3b1fb477fbb9826195cddf312010000001976a9141b2fc485361b251b53579dd8636532e2ebded02c88acffffffff"
			"403eda54f5096fceeb78a91a51a17a727e9d763da2ab48b3d173fa5feaa22d33010000001976a9141d1c309a3051f416cc8b0b389adbeacdd097094c88acffffffff"
			"01f0053101000000001976a914f9c9560f6d4cf2f652e6c75b3f8cf635cbcfc81188ac00000000",rawtx, sizeof(rawtx));
	CU_ASSERT(UID_TX_PARSE_ERROR == UID_buildScriptSig(rawtx, len, path, 2, scriptsig, 2));
}
{
	uint8_t rawtx[200] = {0};
	UID_ScriptSig scriptsig[2] = {{0}};
	UID_Bip32Path path[2] = {{0,1,3},{0,0,2}};
	int len = fromhex("0100000002"
			"d67835ed9b1bcd2946c225e59da4a110476225b3b1fb477fbb9826195cddf312010000001976a9141b2fc485361b251b53579dd8636532e2ebded02c88acffffffff"
			"403eda54f5096fceeb78a91a51a17a727e9d763da2ab48b3d173fa5feaa22d33010000001976a9141d1c309a3051f416cc8b0b389adbeacdd097094c88acffffffff"
			"01f0053101000000001976a914f9c9560f6d4cf2f652e6c75b3f8cf635cbcfc81188ac00000000",rawtx, sizeof(rawtx));
	CU_ASSERT(UID_TX_NOMEM == UID_buildScriptSig(rawtx, len, path, 2, scriptsig, 1));
}
{
	uint8_t rawtx[200] = {0};
	UID_ScriptSig scriptsig[2] = {{0}};
	UID_Bip32Path path[2] = {{0,1,3},{0,0,2}};
	int len = fromhex("0100000002"
			"d67835ed9b1bcd2946c225e59da4a110476225b3b1fb477fbb9826195cddf312010000001976a9141b2fc485361b251b53579dd8636532e2ebded02c88acffffffff"
			"403eda54f5096fceeb78a91a51a17a727e9d763da2ab48b3d173fa5feaa22d33010000001976a9141d1c309a3051f416cc8b0b389adbeacdd097094c88acffffffff"
			"01f0053101000000001976a914f9c9560f6d4cf2f652e6c75b3f8cf635cbcfc81188ac00000000",rawtx, sizeof(rawtx));
	CU_ASSERT(UID_TX_OK == UID_buildScriptSig(rawtx, len, path, 2, scriptsig, 2));
	UID_ScriptSig result0 = {0};
	int rlen0 = fromhex("6a47304402202544737730a824de94a7f91dbf7ef2cf721e6f94be45969fba0b41f313aef75c02202dc2d966c13396142ca2421971dfb2a816d77ea7ff385c5757cc1f924fe1300b01"
			"2103020239b41235f3eea7b904ffe7417900d8b4ff2c4bf6aafc6dce223a62156a2c", (uint8_t *)&result0, sizeof(result0));
	CU_ASSERT(0 == memcmp(&scriptsig[0], &result0, rlen0));
	UID_ScriptSig result1 = {0};
	int rlen1 = fromhex("6a4730440220714a33a79486ff748ecc1a498b3851c82d6775257d4854bfd9ce186c916271a50220146b02394e3708c9748916fa8b175a2d00717fce4fddafa60d794fa6c4b9f0a401"
			"210374acc0a086b7348652408749f3c0b74e81c32918d6c8ff505996ec242d7cbf2d", (uint8_t *)&result1, sizeof(result1));
	CU_ASSERT(0 == memcmp(&scriptsig[1], &result1, rlen1));
}
}

void test_case_transaction2(void)
{
	uint8_t rawtx[200] = {0};
	UID_ScriptSig scriptsig[2] = {{0}};
	char hexeouttx[1000] = {0};
	int len = fromhex("0100000002"
			"d67835ed9b1bcd2946c225e59da4a110476225b3b1fb477fbb9826195cddf312010000001976a9141b2fc485361b251b53579dd8636532e2ebded02c88acffffffff"
			"403eda54f5096fceeb78a91a51a17a727e9d763da2ab48b3d173fa5feaa22d33010000001976a9141d1c309a3051f416cc8b0b389adbeacdd097094c88acffffffff"
			"01f0053101000000001976a914f9c9560f6d4cf2f652e6c75b3f8cf635cbcfc81188ac00000000",rawtx, sizeof(rawtx));
	fromhex("6a47304402202544737730a824de94a7f91dbf7ef2cf721e6f94be45969fba0b41f313aef75c02202dc2d966c13396142ca2421971dfb2a816d77ea7ff385c5757cc1f924fe1300b01"
			"2103020239b41235f3eea7b904ffe7417900d8b4ff2c4bf6aafc6dce223a62156a2c", (uint8_t *)&scriptsig[0], sizeof(UID_ScriptSig));
	fromhex("6a4730440220714a33a79486ff748ecc1a498b3851c82d6775257d4854bfd9ce186c916271a50220146b02394e3708c9748916fa8b175a2d00717fce4fddafa60d794fa6c4b9f0a401"
			"210374acc0a086b7348652408749f3c0b74e81c32918d6c8ff505996ec242d7cbf2d", (uint8_t *)&scriptsig[1], sizeof(UID_ScriptSig));

	CU_ASSERT(676 == UID_buildSignedHex(rawtx, len, scriptsig, hexeouttx, sizeof(hexeouttx)));
	CU_ASSERT_STRING_EQUAL("0100000002"
			"d67835ed9b1bcd2946c225e59da4a110476225b3b1fb477fbb9826195cddf31201000000"
			"6a47304402202544737730a824de94a7f91dbf7ef2cf721e6f94be45969fba0b41f313aef75c02202dc2d966c13396142ca2421971dfb2a816d77ea7ff385c5757cc1f924fe1300b01"
			"2103020239b41235f3eea7b904ffe7417900d8b4ff2c4bf6aafc6dce223a62156a2cffffffff"
			"403eda54f5096fceeb78a91a51a17a727e9d763da2ab48b3d173fa5feaa22d3301000000"
			"6a4730440220714a33a79486ff748ecc1a498b3851c82d6775257d4854bfd9ce186c916271a50220146b02394e3708c9748916fa8b175a2d00717fce4fddafa60d794fa6c4b9f0a401"
			"210374acc0a086b7348652408749f3c0b74e81c32918d6c8ff505996ec242d7cbf2dffffffff"
			"01f0053101000000001976a914f9c9560f6d4cf2f652e6c75b3f8cf635cbcfc81188ac00000000",
			hexeouttx);
}

/**************************** JavaVectors test suite *******************************/

/* Test Suite setup and cleanup functions: */

int init_JavaVectors_suite(void)
{
	unlink("identity.db");
	UID_getLocalIdentity("tprv8ZgxMBicQKsPeUjbnmwN54rKdA1UCsoJsY3ngzhVxyqeTV5pPNo77heffPbSfWVy8vLkTcMwpQHTxJzjz8euKsdDzETM5WKyKFYNLxMAcmQ");
	return 0;
}
int clean_JavaVectors_suite(void)
{
	unlink("identity.db");
	return 0;
}

/************* Test case functions ****************/

void test_case_tprvFromSeed(void)
{
{
    // seed = 01b30b9f68e59936712f0c416ceb1c73f01fa97f665acfa898e6e3c19c5ab577
    uint8_t seed[32] = {0x01,0xb3,0x0b,0x9f,0x68,0xe5,0x99,0x36,0x71,0x2f,0x0c,0x41,0x6c,0xeb,0x1c,0x73,0xf0,0x1f,0xa9,0x7f,0x66,0x5a,0xcf,0xa8,0x98,0xe6,0xe3,0xc1,0x9c,0x5a,0xb5,0x77};
    char tprv[256]={0};

    UID_tprvFromSeed(seed, tprv, sizeof(tprv));
    CU_ASSERT_STRING_EQUAL(
		"tprv8ZgxMBicQKsPeUjbnmwN54rKdA1UCsoJsY3ngzhVxyqeTV5pPNo77heffPbSfWVy8vLkTcMwpQHTxJzjz8euKsdDzETM5WKyKFYNLxMAcmQ",
		tprv);
}
{
    char privateKey[256];
    uint8_t seed[32] = {0};

    fromhex("6ecc96fd114b975295c45ccfbb8bd15390ec1af65f2d5505ad25884166bdcaec",seed, sizeof(seed));
    UID_tprvFromSeed(seed, privateKey, sizeof(privateKey));
    CU_ASSERT_STRING_EQUAL(
		"tprv8ZgxMBicQKsPeF9bnvZrQCjeySPx82J1BpJbrJ4HLLQwDHyNMiQ9uBsKDeh6GhwwmtRAzd142o2ji8M55CcBbcNhgbrUxE1FENw9baLgYnD",
		privateKey);
}

}

void test_case_JavaVectors_signtx(void)
{
{
	uint8_t rawtx[200] = {0};
	UID_ScriptSig scriptsig[2] = {{0}};
	UID_Bip32Path path[2] = {{0,0,0},{0,0,1}};
	char hexeouttx[1000] = {0};
	int len = fromhex("0100000002"
			"47a327c7f5d626a7159c5c0fccf90732ba733ab6e9eea53db24c4829b3cc46a40000000000ffffffff"
			"ced72f216e191ebc3be3b7b8c5d8fc0a7ac52fa934e395f837a28f96df2d8f900100000000ffffffff"
			"0140420f00000000001976a91457c9afb8bc5e4fa738f5b46afcb51b43a48b270988ac00000000",rawtx, sizeof(rawtx));
	CU_ASSERT(UID_TX_OK == UID_buildScriptSig(rawtx, len, path, 2, scriptsig, 2));
	CU_ASSERT(676 == UID_buildSignedHex(rawtx, len, scriptsig, hexeouttx, sizeof(hexeouttx)));
	CU_ASSERT_STRING_EQUAL("0100000002"
			"47a327c7f5d626a7159c5c0fccf90732ba733ab6e9eea53db24c4829b3cc46a400000000"
			"6a473044022014fac39447707341f16cac6fcd9a7258dcc636767016e225c5bb2a2ed4462f4c02202867a07f0695109b47cd9de86d06393c9f3f1f0ebbde5f3f7914f5296edf1be401"
			"2102461fb3538ffec054fd4ee1e9087e7debf8442028f941bda308c24b508cbf69f7ffffffff"
			"ced72f216e191ebc3be3b7b8c5d8fc0a7ac52fa934e395f837a28f96df2d8f9001000000"
			"6a473044022061e3c20622dcbe8ea3a62c66ba56da91c4f1083b11bbd6e912df81bc92826ac50220631d302f309a1c5212933830f910ba2931ff32a5b41a2c9aaa808b926aa9936301"
			"2102ece5ce70796b6893283aa0c8f30273c7dc0ff0b82a75017285387ecd2d767110ffffffff"
			"0140420f00000000001976a91457c9afb8bc5e4fa738f5b46afcb51b43a48b270988ac00000000",
			hexeouttx);
}
}

void test_case_signMessage(void)
{
{
	UID_Bip32Path path = {0,0,0};
	char *msgVector = "Hello World!";
	char *sigVector = "IOAhyp0at0puRgDZD3DJl0S2FjgLEo0q7nBdgzDrWpbDR+B3daIlN3R20lhcpQKZFWl8/ttxUXzQYS0EFso2VLo=";
	char *adrVector = "mj3Ggr43QMSea1s6H3nYJRE3m5GjhGFcLb";

	BTC_Signature signature = {0};
	CU_ASSERT(UID_SIGN_OK == UID_signMessage(msgVector, &path, signature, sizeof(signature)));
	CU_ASSERT_STRING_EQUAL(sigVector, signature);

	uint8_t signature_bin[65] = {0};
	size_t size = 0;
	CU_ASSERT( 0 == mbedtls_base64_decode(signature_bin, sizeof(signature_bin), &size, (unsigned char *)sigVector, strlen(sigVector)) );
	CU_ASSERT( 0 == cryptoMessageVerify((uint8_t *)msgVector, strlen(msgVector), adrVector, signature_bin) );
	CU_ASSERT( UID_SIGN_OK == UID_verifyMessage(msgVector, sigVector, adrVector));
}
{
	UID_Bip32Path path = {1,0,0};
	char *msgVector = "Hello World!";
	char *sigVector = "H3UHssQig0Vef9VIzUmDW0HV37vpm5ZZGF0zbw6xxMMoTTbUm/efPIQDcx5IlOgflC7BcR90aXHsV7BBaQx+b9Q=";
	char *adrVector = "mgXg8FWaYaDVcsvjJq4jW7vrxQCRtjPchs";

	BTC_Signature signature = {0};
	CU_ASSERT(UID_SIGN_OK == UID_signMessage(msgVector, &path, signature, sizeof(signature)));
	CU_ASSERT_STRING_EQUAL(sigVector, signature);

	uint8_t signature_bin[65] = {0};
	size_t size = 0;
	CU_ASSERT( 0 == mbedtls_base64_decode(signature_bin, sizeof(signature_bin), &size, (unsigned char *)sigVector, strlen(sigVector)) );
	CU_ASSERT( 0 == cryptoMessageVerify((uint8_t *)msgVector, strlen(msgVector), adrVector, signature_bin) );
	CU_ASSERT( UID_SIGN_OK == UID_verifyMessage(msgVector, sigVector, adrVector));
}
}

/**************************** Cache test suite *******************************/

/* Test Suite setup and cleanup functions: */

int init_cache_suite(void)
{
	UID_pApplianceURL = "http://explorer.uniquid.co:3001/insight-api";
	UID_pRegistryURL = "http://appliance4.uniquid.co:8080/registry";
	return 0;
}

int clean_cache_suite(void)
{
	unlink("identity.db");
	return 0;
}

/************* Test case functions ****************/

void test_case_cache1(void)
{
	cache_buffer *cache;
//	UID_ClientProfile *profile = NULL;
	UID_SecurityProfile *contract = NULL;

	unlink("identity.db");
	UID_getLocalIdentity("tprv8ZgxMBicQKsPeF9bnvZrQCjeySPx82J1BpJbrJ4HLLQwDHyNMiQ9uBsKDeh6GhwwmtRAzd142o2ji8M55CcBbcNhgbrUxE1FENw9baLgYnD");
	CU_ASSERT(0 == UID_getContracts(&cache));
	CU_ASSERT(4 == cache->validCacheEntries);
	CU_ASSERT(1 == cache->validClientEntries);

//	profile = UID_matchProvider("Node0");
//	CU_ASSERT(NULL != profile);
//	CU_ASSERT_STRING_EQUAL(profile->serviceProviderAddress, "murzfjMUddDbFjir2fEYCis8mpaphrdHKV");

	contract = UID_matchContract("msi5CAqcnMP6aiAQ3Q82W9bUCGj9nMWHTM");
	CU_ASSERT(NULL != contract);
	CU_ASSERT_STRING_EQUAL(contract->serviceProviderAddress, "mvMD34qjTuMSoaHifCmjtjiPLXgfFNtCiV");
	CU_ASSERT_EQUAL(0x40, contract->profile.bit_mask[3]);

	contract = UID_matchContract("n42d4KwDcCKsidov224rsA7GKLtTsVbhoo");
	CU_ASSERT(NULL != contract);
	CU_ASSERT_STRING_EQUAL(contract->serviceProviderAddress, "mhxNWQnP91TJ1AU7j8BUjrxLCTPbjLoU6m");
	CU_ASSERT_EQUAL(0x3e, contract->profile.bit_mask[4]);
}

void test_case_cache2(void)
{
	cache_buffer *cache;

	unlink("identity.db");
	UID_getLocalIdentity("tprv8ZgxMBicQKsPdoj3tQG8Z2bzNsCTsk9heayJQA1pQStVx2hLEyVwx6gfHZ2p4dSzbvaEw7qrDXnX54vTVbkLghZcB24TXuj1ADXPUCvyfcy");
	CU_ASSERT(0 == UID_getContracts(&cache));
	CU_ASSERT( 0 == cache->validCacheEntries);
	CU_ASSERT( 0 == cache->validClientEntries);
}

/* fake imprinter:
 * tprv8ZgxMBicQKsPeEzhahZn1jqJjNyQ3G7HLbEZKU9krP8cdeBXmzVSzt7kCPEofHbmMo5k18mVB7am8rFiQLAzJdchG7zMUWbTUCiJ3w1s9oM
 * @ m/44'/0'/0/1/1/1
 * tx: ebafc4c80422e441bed962f6da1c481051de3f5569b101600ad290699090960e 100 coin
 *
 * mtN3H7sFPC5V5bNy7t4qg9ku9EKSNhKrHE -> mxZ19o2oq6gGVeES1x7rZUHbwxqMkWFBoo
 *                                       mmdJjnUHNiTZTAR46YAdtB4eVB4CeB6Rvb
 */

void test_case_cache3(void)
{
	cache_buffer *cache;

	unlink("identity.db");
	UID_getLocalIdentity("tprv8ZgxMBicQKsPdLB7wadJ2LDnCQ4ra1pyWQrVJGPQNrQkm8XX5K9i6ucFYM6H9aeSEgGCL8JFamvgiVtpmVjBiruNYegiW9LCBL2HCoYWRAa");
	CU_ASSERT(0 == UID_getContracts(&cache));
	CU_ASSERT( 1 == cache->validCacheEntries);
	CU_ASSERT( 0 == cache->validClientEntries);
}

void test_case_signandsend(void)
{
	char result[250] = {0};
	char param[] = "{\"paths\":[\"0/1/1\"],\"tx\":\""
					"01000000"
					"01"
					"fe86ad88cc3b81b365dd56fb3949b030cfc24532771d4d69d09b1f93659e2227"
					"03000000"
					"19"
					"76a914c08e00f694bcd1530043b7eaffa96fd65bdf875588ac"
					"ffffffff"
					"04"
					"10270000000000001976a91447ce8d6c424c45f3519b7f6f7c96abe7b18d715b88ac"
					"0000000000000000536a4c5000000000001c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
					"30750000000000001976a9148bbf7e254925ebd7a4911e7d16cb858341f9e05588ac"
					"50f80c00000000001976a91430fb38483f5a8f035ee955cc2d6684d76a2e3ecc88ac"
					"00000000\"}";

	unlink("identity.db");
	UID_getLocalIdentity("tprv8ZgxMBicQKsPdQNuYWLfbuYng8SAMPaThga8UcwED6ehSFCQNvRdBBV36GLAcxWvZw1etrHfhAAuzJg51xe9JeiV2fcvPkEtr8ZA6QYGpJr");
	UID_signAndSendContract(param, result, sizeof(result));
	CU_ASSERT_STRING_EQUAL(result, "6 - transaction already in block chain. Code:-27");
}

/**************************** CapBAC test suite *******************************/

/* Test Suite setup and cleanup functions: */

int init_capBAC_suite(void)
{
	unlink("identity.db");
	UID_getLocalIdentity("tprv8ZgxMBicQKsPeUjbnmwN54rKdA1UCsoJsY3ngzhVxyqeTV5pPNo77heffPbSfWVy8vLkTcMwpQHTxJzjz8euKsdDzETM5WKyKFYNLxMAcmQ");
	UID_pApplianceURL = "http://explorer.uniquid.co:3001/insight-api";
	UID_pRegistryURL = "http://appliance4.uniquid.co:8080/registry";
	return 0;
}

int clean_capBAC_suite(void)
{
	unlink("identity.db");
	return 0;
}

/************* Test case functions ****************/

void test_case_prepareToSign(void)
{
{
	UID_UniquidCapability capability = {
		"muwk2Z1HiysDAADXC5UMvpvmmCjuZdFnoP",
		"1234",
		"12345",
		{0},
		1234,
		12345,
		{0} };

	char buffer[UID_SERIALIZED_CAPABILITY_SIZE];

	CU_ASSERT(UID_CAPBAC_OK == UID_prepareToSign(&capability, buffer, sizeof(buffer)));
	CU_ASSERT_STRING_EQUAL(buffer,
		"muwk2Z1HiysDAADXC5UMvpvmmCjuZdFnoP12341234500000000000000000000000000000000000000123412345");
}
{
	UID_UniquidCapability capability = {
		"muwk2Z1HiysDAADXC5UMvpvmmCjuZdFnoP",
		"mp246b2KBN5xncctJxtj7UHiEo5GfiewMT",
		"mvmmEz4nduzpLk4KR6JMQn3LyZuHYt6NTc",
		{0,{0,0xFE}},
		0xffffffffffffffff,
		0xffffffffffffffff,
		{0} };

	char buffer[UID_SERIALIZED_CAPABILITY_SIZE];

	CU_ASSERT(UID_CAPBAC_OK == UID_prepareToSign(&capability, buffer, sizeof(buffer)));

	CU_ASSERT_STRING_EQUAL(buffer,
		"muwk2Z1HiysDAADXC5UMvpvmmCjuZdFnoPmp246b2KBN5xncctJxtj7UHiEo5GfiewMTmvmmEz4nduzpLk4KR6JMQn3LyZuHYt6NTc0000fe00000000000000000000000000000000-1-1");
}
{
	UID_UniquidCapability capability = {
		"muwk2Z1HiysDAADXC5UMvpvmmCjuZdFnoP",
		"mp246b2KBN5xncctJxtj7UHiEo5GfiewMT",
		"mvmmEz4nduzpLk4KR6JMQn3LyZuHYt6NTc",
		{0,{0,0xFE}},
		0x7fffffffffffffff,
		0x7fffffffffffffff,
		{0} };

	char buffer[UID_SERIALIZED_CAPABILITY_SIZE];

	CU_ASSERT(UID_CAPBAC_OK == UID_prepareToSign(&capability, buffer, sizeof(buffer)));

	CU_ASSERT_STRING_EQUAL(buffer,
		"muwk2Z1HiysDAADXC5UMvpvmmCjuZdFnoPmp246b2KBN5xncctJxtj7UHiEo5GfiewMTmvmmEz4nduzpLk4KR6JMQn3LyZuHYt6NTc0000fe0000000000000000000000000000000092233720368547758079223372036854775807");
}
}

void test_case_getTime(void)
{
	int64_t time;
	time_t ttime;

	time = UID_getTime();
	ttime = time/1000;
	printf("\n\nCURRENT TIME (please verify)\n%ld => %s and %d ms\n\n", time, ctime(&ttime), (int)(time - (time/1000*1000)));
	// uncomment to verify manually
	//printf("enter y if correct: ");
	//CU_ASSERT('y' == getchar());
}

/************* Test Runner Code goes here **************/

int main ( void )
{
   CU_pSuite pSuite = NULL;

   /* initialize the CUnit test registry */
   if ( CUE_SUCCESS != CU_initialize_registry() )
      return CU_get_error();

   /* add a suite to the registry */
   pSuite = CU_add_suite( "identity test suite", init_identity_suite, clean_identity_suite );
   if ( NULL == pSuite ) {
      CU_cleanup_registry();
      return CU_get_error();
   }

   /* add the tests to the suite */
   if ( (NULL == CU_add_test(pSuite, "test_case_identity1", test_case_identity1)) ||
        (NULL == CU_add_test(pSuite, "test_case_identity2", test_case_identity2)) ||
        (NULL == CU_add_test(pSuite, "test_case_identity3", test_case_identity3)) ||
        (NULL == CU_add_test(pSuite, "test_case_identity4", test_case_identity4))
      )
   {
      CU_cleanup_registry();
      return CU_get_error();
   }

   /* add a suite to the registry */
   pSuite = CU_add_suite( "general test suite", init_general_suite, clean_general_suite );
   if ( NULL == pSuite ) {
      CU_cleanup_registry();
      return CU_get_error();
   }

   /* add the tests to the suite */
   if ( (NULL == CU_add_test(pSuite, "test_case_general1", test_case_general1)) ||
        (NULL == CU_add_test(pSuite, "test_case_utils1", test_case_utils1)) ||
        (NULL == CU_add_test(pSuite, "test_case_utils2", test_case_utils2)) ||
        (NULL == CU_add_test(pSuite, "test_case_utils3", test_case_utils3)) ||
        (NULL == CU_add_test(pSuite, "test_case_utils4", test_case_utils4)) ||
        (NULL == CU_add_test(pSuite, "test_case_utils5", test_case_utils5)) ||
        (NULL == CU_add_test(pSuite, "test_case_transaction1", test_case_transaction1)) ||
        (NULL == CU_add_test(pSuite, "test_case_transaction2", test_case_transaction2))
      )
   {
      CU_cleanup_registry();
      return CU_get_error();
   }

   /* add a suite to the registry */
   pSuite = CU_add_suite( "JavaVectors test suite", init_JavaVectors_suite, clean_JavaVectors_suite );
   if ( NULL == pSuite ) {
      CU_cleanup_registry();
      return CU_get_error();
   }

   /* add the tests to the suite */
   if ( (NULL == CU_add_test(pSuite, "test_case_JavaVectors_signtx", test_case_JavaVectors_signtx)) ||
        (NULL == CU_add_test(pSuite, "test_case_tprvFromSeed", test_case_tprvFromSeed)) ||
        (NULL == CU_add_test(pSuite, "test_case_signMessage", test_case_signMessage))
      )
   {
      CU_cleanup_registry();
      return CU_get_error();
   }

   /* add a suite to the registry */
   pSuite = CU_add_suite( "CapBAC suite", init_capBAC_suite, clean_capBAC_suite );
   if ( NULL == pSuite ) {
      CU_cleanup_registry();
      return CU_get_error();
   }

   /* add the tests to the suite */
   if ( (NULL == CU_add_test(pSuite, "test_case_prepareToSign", test_case_prepareToSign)) ||
        (NULL == CU_add_test(pSuite, "test_case_getTime", test_case_getTime))
      )
   {
      CU_cleanup_registry();
      return CU_get_error();
   }

   /* add a suite to the registry */
   pSuite = CU_add_suite( "cache test suite", init_cache_suite, clean_cache_suite );
   if ( NULL == pSuite ) {
      CU_cleanup_registry();
      return CU_get_error();
   }

   /* add the tests to the suite */
   if ( (NULL == CU_add_test(pSuite, "test_case_cache1", test_case_cache1)) ||
        (NULL == CU_add_test(pSuite, "test_case_cache2", test_case_cache2)) ||
        (NULL == CU_add_test(pSuite, "test_case_cache3", test_case_cache3)) ||
        (NULL == CU_add_test(pSuite, "test_case_signandsend", test_case_signandsend))
      )
   {
      CU_cleanup_registry();
      return CU_get_error();
   }

   // Run all tests using the basic interface
   CU_basic_set_mode(CU_BRM_VERBOSE);
   CU_basic_run_tests();
   printf("\n");
   CU_basic_show_failures(CU_get_failure_list());
   printf("\n\n");
/*
   // Run all tests using the automated interface
   CU_automated_run_tests();
   CU_list_tests_to_file();

   // Run all tests using the console interface
   CU_console_run_tests();
*/
   /* Clean up registry and return */
   CU_cleanup_registry();
   return CU_get_error();

}
