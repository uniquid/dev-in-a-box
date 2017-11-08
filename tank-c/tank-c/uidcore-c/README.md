# uidcore-c

#### Reference C implementation of the core Uniquid library ####

This implementation is aimed to be simple and easy to be embedded

it depends on the following libraries:

- __trezor_crypto__ (block-chain related cryptography)
- __yajl__ (JSON parser)
- __curl__ (block-chain access)
- __pthread__ (for the synchronization mutex)

There is no use of malloc() in the library code, though
yajl and curl use malloc in their implementations.<br>
yajl offers a way to implement your own malloc().

It is planned to delete dependencies from __yajl__ and __curl__ library

### How to build ###

Because of the large number of environments that the library targets
we give a simple make build system that builds for Linux

just run

__make__<br>
to build the the shared library

__make docs__<br>
to build the Doxygen documentation

__make run-tests__<br>
to build and run the test suite


### example code ###

see<br>
[example_init.c](example_init.c) for an example of entity initialization<br>
[example_provider.c](example_provider.c) for an example of provider code<br>
[example_user.c](example_user.c) for an example of user code<br>
