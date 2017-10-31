
EXEFILE := tank-c
OBJDIR := obj
EXEDIR := bin

LIBS		+= -lcurl -lpthread

EXTRA_LIBS		+= -Wl,-rpath='$$ORIGIN'
EXTRA_LIBS		+= -L./uidcore-c/trezor-crypto -ltrezor-crypto
EXTRA_LIBS		+= -L./uidcore-c -luidcore-c
EXTRA_LIBS		+= -L./paho.mqtt.c/build/output/ -lpaho-mqtt3c


CFLAGS :=
CFLAGS   += -W \
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
            -Werror

EXTRA_CFLAGS	+= -I./uidcore-c -I./paho.mqtt.c/src/ -std=gnu99 -D DEBUG
EXTRA_CFLAGS	+= -I./libqrencode

OBJS := helpers.o main.o mqtt_transport.o tank.o
OBJS += bitstream.o mask.o mmask.o mqrspec.o qrencode.o qrinput.o qrspec.o rscode.o split.o
OBJS := $(addprefix $(OBJDIR)/,$(OBJS))

.PHONY: all
all: $(EXEDIR)/$(EXEFILE)

# build the target
$(EXEDIR)/$(EXEFILE): $(OBJS) uidcore-c/libuidcore-c.so paho.mqtt.c/build/output/libpaho-mqtt3c.so.1
	@mkdir -p $(EXEDIR)
	$(CC) -o $@ $(OBJS) $(LIBS) $(EXTRA_LIBS)
	cp tank-c.ini $(EXEDIR)
	# copy the libraries
	@cp uidcore-c/libuidcore-c.so $(EXEDIR)
	@cp uidcore-c/trezor-crypto/libtrezor-crypto.so $(EXEDIR)
	@cp paho.mqtt.c/build/output/libpaho-mqtt3c.so.1 $(EXEDIR)

# build uidcore-c library
uidcore-c/libuidcore-c.so:
	make -C uidcore-c

# build paho.mqtt.c library
paho.mqtt.c/build/output/libpaho-mqtt3c.so.1:
	make -C paho.mqtt.c

$(OBJDIR)/%.o: %.c
	@mkdir -p $(OBJDIR)
	$(CC) $(CFLAGS) $(EXTRA_CFLAGS) -c -o $@ $<

$(OBJDIR)/%.o: libqrencode/%.c
	@mkdir -p $(OBJDIR)
	$(CC) $(CFLAGS) $(EXTRA_CFLAGS) -D HAVE_CONFIG_H=0 -D HAVE_STRDUP=1 -c -o $@ $<

#
# Utility rules
#
.PHONY: clean
clean:
	make -C uidcore-c clean
	make -C paho.mqtt.c clean
	rm -rf $(OBJDIR)
	rm -rf $(EXEDIR)


