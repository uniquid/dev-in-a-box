#include <unistd.h>
#include <stdio.h>
#include <string.h>



#include "UID_bchainBTC.h"
#include "UID_fillCache.h"
#include "UID_identity.h"

// Update Cache Thread
// gets contracts from the BlockChain and updates the local cache
void *updateCache(void *arg)
{
	cache_buffer *cache;
	int ret;

	while(1)
	{
		ret = UID_getContracts(&cache);

//		< manage cache persistence if needed >

		sleep(60);
	}
	return NULL;
	(void)arg;(void)ret;
}

int main(void)
{
	pthread_t thr;
	char imprinting[1024];

//		...

	// set up the URL to insight-api appliance
	UID_pApplianceURL = "http://explorer.uniquid.co:3001/insight-api";
	// set up the URL to the registry appliance
	UID_pRegistryURL = "http://appliance4.uniquid.co:8080/registry";
	// generate or load the identity
	UID_getLocalIdentity(NULL);
	// build the imprinting string
	snprintf(imprinting, sizeof(imprinting), "{\"name\":\"%s\",\"xpub\":\"%s\"}", "Entity NAME", UID_getTpub());

//	< manage imprinting information >

	// start the the thread that updates the
	// contracts cache from the block-chain
	// here we are using pthread, but is up to the user of the library
	// to chose how to schedule the execution of UID_getContracts()
	pthread_create(&thr, NULL, updateCache, NULL);

//		...
}
