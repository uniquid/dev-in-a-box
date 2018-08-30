/*
 * tank.c
 *
 *  Created on: 29/aug/2016
 *      Author: M. Palumbi
 */
 
 




/* 
 * DESCRIPTION
 * tank simulator
 * tank thread simulates a tank with an in faucet and an out faucet.
 * The tank level rises or lower according with the faucets state
 * 
 */

/* include includes */
#include <stdlib.h>
#include <stdbool.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdint.h>
#include <fcntl.h>
#include "helpers.h"
#include "tank.h"
#include "MQTTClient.h"
#include "mqtt_transport.h"

#define MAX_LEVEL 1000

static int level = 0;
static bool in_faucet = 0;
static bool out_faucet = 0;
static bool status=0;

extern char myname[];

void *tank(void *arg)
{
    int _level;
    int flevel;

    flevel = open("level", O_RDWR | O_CREAT,  0644);
    read(flevel, &level, sizeof level);
    DBG_Print("##### level %d ############\n", level);

    while(1)
    {
        _level = level;
        _level += 1;
//        if ( in_faucet == true) _level += 1; // if in_faucet is open add some wather
//        if (out_faucet == true) _level -= 2; // if out_faucet is open drop some wather
//        _level = _level < MAX_LEVEL ? _level : MAX_LEVEL; // clamp level to MAX_LEVEL
//        _level = _level > 0 ? _level : 0; // clamp level to 0
        level = _level;
        pwrite(flevel, &level, sizeof(level), 0);
        //if (level >= 80) { in_faucet = 0; out_faucet = 1; }
        //if (level <= 20) { in_faucet = 1; out_faucet = 0; }

        usleep(500000); // sleep for 0.5 seconds
    }
    return arg;
}

// serviceUser is passed in ReturnData 
static int OpenInFaucet(char *ReturnData, int ReturnLength)
{
    if(status == false) return -1; // machine closed
    in_faucet = 1;
    return snprintf(ReturnData , ReturnLength, "\nOpening in faucet\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}

// serviceUser is passed in ReturnData 
static int CloseInFaucet(char *ReturnData, int ReturnLength)
{
    if(status == false) return -1; // machine closed
    in_faucet = 0;
    return snprintf(ReturnData , ReturnLength, "\nClosing in faucet\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}

// serviceUser is passed in ReturnData 
static int OpenOutFaucet(char *ReturnData, int ReturnLength)
{
    if(status == false) return -1; // machine closed
    out_faucet = 1;
    return snprintf(ReturnData , ReturnLength, "\nOpening out faucet\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}

// serviceUser is passed in ReturnData 
static int CloseOutFaucet(char *ReturnData, int ReturnLength)
{
    if(status == false) return -1; // machine closed
    out_faucet = 0;
    return snprintf(ReturnData , ReturnLength, "\nClosing out faucet\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}

/**
 */
void user_34_machine(char *param, char *result, size_t size)
{
    (void)param;
	snprintf(result, size, "{\"pod\":\"%s\", \"current\":%d,\"total\":%d}",  myname, 2,  level);
}

/**
 * open/close the input faucet
 * @param[in] param "open" or "close"
 */
void user_35_inputFaucet(char *param, char *result, size_t size)
{
    if (strcmp(param, "open") == 0) {
        OpenInFaucet(result, size);
        return;
    }
    if (strcmp(param, "close") == 0) {
        CloseInFaucet(result, size);
        return;
    }
	snprintf(result, size, "Bad parameter <%s>", param);
}

/**
 * open/close the output faucet
 * @param[in] param "open" or "close"
 */
void user_36_outputFaucet(char *param, char *result, size_t size)
{
    if (strcmp(param, "open") == 0) {
        OpenOutFaucet(result, size);
        return;
    }
    if (strcmp(param, "close") == 0) {
        CloseOutFaucet(result, size);
        return;
    }
	snprintf(result, size, "Bad parameter <%s>", param);
}

/**
 * returns the status
 */
void user_37_status(char *param, char *result, size_t size)
{
    (void) param;
    snprintf(result , size, "\n-- Level %d in faucet = %d out faucet = %d\n", level, in_faucet, out_faucet);
}
