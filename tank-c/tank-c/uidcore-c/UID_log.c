/*
 * @file   UID_log.c
 *
 * @date   11/dec/2017
 * @author M. Palumbi
 */

/*
 * @file UID_log.h
 */

#include <unistd.h>
#include <stdarg.h>
#include <string.h>
#include <stdio.h>

#include "UID_log.h"

/**
 * Actual log function implementation.<br>
 * Here is given an implementation using vprintf().
 * This function should be customized to use the facility of the specific embedded environment.
 *
 * @param[in]  fmt printf style format sring
 * @param[in]  ... printf style inputs
 */
void UID_logImplement( char *fmt, ... )
{
	va_list ap;

	va_start( ap, fmt );
	vprintf( fmt, ap );
	va_end( ap );
}
