/*
 * @file   UID_time.c
 *
 * @date   18/mar/2018
 * @author M. Palumbi
 */


/**
 * @file   UID_time.h
 *
 * Time related functions
 *
 */

#include <time.h>
#include "UID_time.h"
/**
 * Returns the current RTC clock in ms since the EPOCH<br>
 * Here is given an implementation using clock_gettime().
 * This function should be customized to use the facility of the specific embedded environment.
 *
 * @return current time in milliseconds since the EPOCH
 */
int64_t UID_getTime(void)
{
    struct timespec spec;

    clock_gettime(CLOCK_REALTIME, &spec);
    return (int64_t)(spec.tv_sec)*1000 + spec.tv_nsec/1000000;
}