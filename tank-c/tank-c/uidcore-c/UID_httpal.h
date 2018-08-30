/**
 * @file   UID_httpal.h
 *
 * @date   09/dec/2017
 * @author M. Palumbi
 */

#ifndef __UID_HTTPAL_H
#define __UID_HTTPAL_H

#include "UID_globals.h"
typedef void  UID_HttpOBJ;


int UID_httpget(UID_HttpOBJ *curl, char *url, char *buffer, size_t size);
int UID_httppost(UID_HttpOBJ *curl, char *url, char *postdata, char *ret, size_t size);

UID_HttpOBJ *UID_httpinit(void);
int UID_httpcleanup(UID_HttpOBJ *curl);

#endif // __UID_HTTPAL_H