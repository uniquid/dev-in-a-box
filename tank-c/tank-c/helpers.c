/*
 * main.c
 *
 *  Created on: 27/lug/2016
 *      Author: M. Palumbi
 */






/* 
 * DESCRIPTION
 * some usefull funtions
 * 
 */


#define _GNU_SOURCE

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <stdarg.h>
#include <fcntl.h>
#include <sys/socket.h>
#include <sys/eventfd.h> 
#include <pthread.h>

#include "helpers.h" 

char *program_name;
int dbg_level=7;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// print to standard error if enabled by dbg_level
void _DBG_Print( char *fmt, ... )
{
	va_list ap;
	
	if( (dbg_level & DBG_PRINT_ENABLE) == 0 ) return;
	va_start( ap, fmt );
	fprintf( stderr, "%d:%s: ", getpid(), program_name );
	vfprintf( stderr, fmt, ap );
	va_end( ap );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// error � print a diagnostic and optionally exit 
void error( int status, int err, char *fmt, ... )
{
	va_list ap;

	va_start( ap, fmt );
	fprintf( stderr, "%d:%s: ", getpid(), program_name );
	vfprintf( stderr, fmt, ap );
	va_end( ap );
	if ( err )
		fprintf( stderr, ": %s (%d)\n", strerror( err ), err );
	if ( status )
		exit( status );
}


	

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Read characters from 'fd' until a newline is encountered. If a newline
// character is not encountered in the first (n - 1) bytes, then the excess
// characters are discarded. The returned string placed in 'buf' is
// null-terminated and includes the newline character if it was read in the
// first (n - 1) bytes. The function return value is the number of bytes
// placed in buffer (which includes the newline character if encountered,
// but excludes the terminating null byte). 
ssize_t readLine(int fd, void *buffer, size_t n)
{
    ssize_t numRead;                    /* # of bytes fetched by last read() */
    size_t totRead;                     /* Total bytes read so far */
    char *buf;
    char ch;

    if (n <= 0 || buffer == NULL) {
        errno = EINVAL;
        return -1;
    }

    buf = buffer;                       /* No pointer arithmetic on "void *" */

    totRead = 0;
    for (;;) {
        numRead = read(fd, &ch, 1);

        if (numRead == -1) {
            if (errno == EINTR)         /* Interrupted --> restart read() */
                continue;
            else
                return -1;              /* Some other error */

        } else if (numRead == 0) {      /* EOF */
            if (totRead == 0)           /* No bytes read; return 0 */
                return 0;
            else                        /* Some bytes read; add '\0' */
                break;

        } else {                        /* 'numRead' must be 1 if we get here */
            if (totRead < n - 1) {      /* Discard > (n - 1) bytes */
                totRead++;
                *buf++ = ch;
            }

            if (ch == '\n')
                break;
        }
    }

    *buf = '\0';
    return totRead;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ReadXBytes
// Read x bytes from a socket. Keep reading until
// all the data has been read from the socket.
// This assumes buffer is at least x bytes long,
// and that the socket is blocking.
ssize_t ReadXBytes(int socket, void* buffer, unsigned int x)
{
    unsigned int bytesRead = 0;
    int result;
    while (bytesRead < x)
    {
        result = read(socket, (char *)buffer + bytesRead, x - bytesRead);
        if (result < 1 )
        {
            if (errno == EINTR)         /* Interrupted --> restart read() */
                continue;
            else
                return -1;              /* Some other error */
        }

        bytesRead += result;
    }
	return bytesRead;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WriteXBytes
// Write a buffer full of data to a socket. Keep writing until
// all the data has been put into the socket.
// sock			 I					  the socket to write
// buffer		 I					  the buffer holding the data
// buflen		 I					  the length of the buffer in bytes
// Returns: status code indicating success - 0 = success
int WriteXBytes(const int sock, const char *const buffer, const size_t buflen)
{
	size_t					bytesWritten=0;
	ssize_t					writeResult;
	int						done=0;

	do {
		writeResult=send(sock,buffer+bytesWritten,buflen-bytesWritten,MSG_NOSIGNAL);
		if(writeResult==-1) {
			if(errno==EINTR)
				writeResult=0;
			else {
				bytesWritten=-1;
				done=1;
			}
		}
		else {
			bytesWritten+=writeResult;
			//if(writeResult==0)
			if(bytesWritten == buflen)
				done=1;
		}	
	} while(done==0);

	return bytesWritten;
}

static char address[18] = "X@$!!";
static uint8_t mac[6];
uint8_t *getMacAddress(int fake)
{
    FILE *fd = NULL;

    if(fake) // use fake address
    {   // try to read serial.no
        int uniq = open("serial.no", O_RDWR|O_CREAT, 0644);
        if (read(uniq, mac, sizeof(mac)) != sizeof(mac)) // if we cant read userial.no generate one
        {
            int rnd = open("/dev/random", O_RDONLY);
            if(read(rnd, mac, sizeof(mac)) <= 0) // if we cant read /dev/random use time for seed
                *(int32_t *)mac = time(NULL);
            close(rnd);
            write(uniq, mac, sizeof(mac));
        }
        close(uniq);
    }
    else
    {
		fd = fopen("/sys/class/net/eth0/address", "r");
		fgets(address, sizeof(address), fd);
		fclose(fd);
		sscanf(address, "%hhx:%hhx:%hhx:%hhx:%hhx:%hhx", mac+0, mac+1, mac+2, mac+3, mac+4, mac+5 );
    }
    return mac;
}

FILE *logfile = NULL;

void LOG_print( char *fmt, ... )
{
	va_list ap;

    if (logfile == NULL) logfile = fopen("access.log", "a");
	va_start( ap, fmt );
	fprintf( logfile, "%ld: ", time(NULL) );
	vfprintf( logfile, fmt, ap );
	va_end( ap );
	fflush(logfile);
}

