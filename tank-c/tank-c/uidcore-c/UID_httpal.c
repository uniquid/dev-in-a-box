/*
 * @file   UID_httpal.c
 *
 * @date   09/dec/2017
 * @author M. Palumbi
 */


/**
 * @file UID_httpal.h
 *
 * http access abstraction layer.<br>
 * Here is given an implementation using the curl library.
 * The user of uidcore-c library must give its own implementation
 * if lib curl is not available on the target system.
 */

#include <string.h>
#include <curl/curl.h>
#include "UID_httpal.h"
#include "UID_log.h"

typedef struct  {
    size_t size;
    char  *buffer;
} curl_context;

// callback from curl_easy_perform
static size_t curl_callback(char *buffer, size_t size, size_t nmemb, void *ctx)
{
    size_t l = size*nmemb;

    UID_log(UID_LOG_DEBUG,"httpget callback\n");
    if (l < ((curl_context *)ctx)->size) {
        memcpy(((curl_context *)ctx)->buffer, buffer, l);
        ((curl_context *)ctx)->buffer += l;
        *((curl_context *)ctx)->buffer = 0;
        ((curl_context *)ctx)->size -= l;
        return l;
    }
    else {
        return -1;
    }
}

/**
 * Get data from url
 *
 * @param[in]  curl   pointer to an initialized UID_HttpOBJ struct
 * @param[in]  url    url to contact
 * @param[out] buffer pointer to buffer to be filled
 * @param[in]  size   size of buffer
 *
 * @return     UID_HTTP_OK no error
 */
int UID_httpget(UID_HttpOBJ *curl, char *url, char *buffer, size_t size)
{
    curl_context ctx;

    ctx.buffer = buffer;
    ctx.size = size;

    UID_log(UID_LOG_DEBUG,"enter httpget curl=%p\n", curl);
    CURLcode retval = curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 45L);
    UID_log(UID_LOG_DEBUG,"setopt returns %d\n", retval);
    retval = curl_easy_setopt(curl, CURLOPT_TIMEOUT, 45L);
    UID_log(UID_LOG_DEBUG,"setopt returns %d\n", retval);
    /* Define our callback to get called when there's data to be written */
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, curl_callback);
    /* Set a pointer to our struct to pass to the callback */
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &ctx);
    curl_easy_setopt(curl, CURLOPT_URL, url);

    UID_log(UID_LOG_DEBUG,"calling easy_perform()\n");
    retval = curl_easy_perform(curl);
    UID_log(UID_LOG_DEBUG,"easy_perform() returns %d\n",retval);
    return (retval == CURLE_OK ? UID_HTTP_OK : UID_HTTP_GET_ERROR);
}

typedef struct {
    size_t buffer_size;
    char  *buffer;
} send_tx_context;

/**
 * callback from curl_easy_perform
 * returns the answer for the send from insight-api
 */
static size_t send_tx(char *buffer, size_t size, size_t nmemb, void *ctx)
{
    size_t l = size*nmemb;

    if (l < ((send_tx_context *)ctx)->buffer_size) {
        memcpy(((send_tx_context *)ctx)->buffer, buffer, l);
        ((send_tx_context *)ctx)->buffer += l;
        *((send_tx_context *)ctx)->buffer = 0;
        ((send_tx_context *)ctx)->buffer_size -= l;
        return l;
    }
    else {
        return -1;
    }
}

/**
 * Post data to url
 * with the following format<br>
 * Content-Type: application/x-www-form-urlencoded
 *
 * @param[in]  curl   pointer to an initialized UID_HttpOBJ struct
 * @param[in]  url    url to contact
 * @param[in]  postdata    data to be posted
 * @param[out] ret    pointer to the buffer to be filled
 * @param[in]  size   size of buffer
 *
 * @return     UID_HTTP_OK no error
 */
int UID_httppost(UID_HttpOBJ *curl, char *url, char *postdata, char *ret, size_t size)
{
    send_tx_context ctx;

    /* Define our callback to get called when there's data to be written */
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, send_tx);
    /* Set a pointer to our struct to pass to the callback */
    ctx.buffer_size = size;
    ctx.buffer = ret;
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &ctx);

    curl_easy_setopt(curl, CURLOPT_URL, url);
    /* setup post data */
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, postdata);
    /* perform the request */
    return (CURLE_OK == curl_easy_perform(curl) ? UID_HTTP_OK : UID_HTTP_POST_ERROR);
}

UID_HttpOBJ *UID_httpinit()
{
    return  curl_easy_init();
}

int UID_httpcleanup(UID_HttpOBJ *curl)
{
    curl_easy_cleanup(curl);
    return UID_HTTP_OK;
}
