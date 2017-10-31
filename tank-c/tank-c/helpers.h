/*
 * helpers.h
 *
 *  Created on: 29/lug/2016
 *      Author: M. Palumbi
 */
 
 

#pragma once
#ifndef __HELPERS_H__
#define __HELPERS_H__



typedef int SOCKET;


/** 
\debug levels
*/
#define DBG_PRINT_ENABLE 1
#define MONITOR_DATA_ENABLE 2
#define OUTPUT_ON_FILE_ENABLE 4
extern int dbg_level;
extern char *program_name;

void _DBG_Print( char *fmt, ... );

#ifdef DEBUG
	#define DBG_Print( ... ) _DBG_Print(__VA_ARGS__)
#else
	#define DBG_Print( ... )
#endif

/* error - print a diagnostic and optionally exit */
void error( int status, int err, char *fmt, ... );


// socket IO functions
ssize_t readLine(int fd, void *buffer, size_t n);
ssize_t ReadXBytes(int socket, void* buffer, unsigned int x);
int WriteXBytes(const int sock, const char *const buffer, const size_t buflen);

uint8_t *getMacAddress(int fake);

void LOG_print( char *fmt, ... );

#endif