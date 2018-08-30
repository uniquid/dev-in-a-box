#CC        = gcc

#OPTFLAGS  = -O3 -g
OPTFLAGS = -O0 -g -gdwarf-3

CFLAGS   += $(OPTFLAGS) \
            -std=gnu99 \
            -W \
            -Wall \
            -Wextra \
            -Wimplicit-function-declaration \
            -Wredundant-decls \
            -Wstrict-prototypes \
            -Wundef \
            -Wshadow \
            -Wpointer-arith \
            -Wformat \
            -Wreturn-type \
            -Wsign-compare \
            -Wmultichar \
            -Wformat-nonliteral \
            -Winit-self \
            -Wuninitialized \
            -Wformat-security \
            -Werror \
-Wno-missing-field-initializers \
-Wno-missing-braces

CFLAGS += -Iyajl/build/yajl-2.1.1/include -Itrezor-crypto
LIB-YAJL := yajl/build/yajl-2.1.1/lib/libyajl_s.a
LIB-TREZOR := trezor-crypto/libtrezor-crypto.so

SRCS	:= $(shell find -maxdepth 1 -name "UID_*.c")
SRCS  += base64.c
LIBS	+= -L $(dir $(LIB-YAJL)) -l $(patsubst lib%,%, $(basename $(notdir $(LIB-YAJL))))
LIBS	+= -L $(dir $(LIB-TREZOR)) -l $(patsubst lib%,%, $(basename $(notdir $(LIB-TREZOR))))

OBJS   = $(SRCS:.c=.o)

HEADERS   := $(shell find -maxdepth 1 -name "UID_*.h")

all: libuidcore-c.so

yajl/build/Makefile:
	mkdir yajl/build
	cd yajl/build; cmake ..

$(LIB-YAJL): yajl/build/Makefile
	make -C yajl/build

$(LIB-TREZOR):
	make -C trezor-crypto libtrezor-crypto.so

%.o: %.c %.h
	$(CC) $(CFLAGS) -o $@ -c $<


libuidcore-c.so: $(SRCS) $(HEADERS) Makefile $(LIB-YAJL) $(LIB-TREZOR)
	$(CC) $(CFLAGS) -fPIC -shared $(SRCS) -Wl,-rpath='$$ORIGIN' $(LIBS) -o libuidcore-c.so

tests: tests.c libuidcore-c.so
	$(CC) $(CFLAGS) tests.c $(SRCS) $(LIBS) -Wl,-rpath=$(dir $(LIB-TREZOR)) -lcurl -lcunit -ftest-coverage -fprofile-arcs -o tests

run-tests: tests
	./tests
	gcov $(SRCS) -r

.PHONY: docs
docs:
	rm -rf docs
	$(CC) $(CFLAGS) -fsyntax-only example_init.c example_provider.c example_user.c
	doxygen Doxyfile

clean:
	rm -f *.o tests libuidcore-c.so
	rm -rf yajl/build
	make -C trezor-crypto clean
	rm -rf docs
	rm -f *.gcda *.gcno *.gcov
