# tank-c - tank simulator

## C implementation of a Uniquid node

tank-c is an application that demonstarte the Uniquid Identity and Access Management sdk using the uidcore-c library.

It builds on generic Linux

It requires:

* libcurl
* libpthread
* uidcore-c
* libpaho-mqtt

These packages should be enaugh to compile on a fresh installed Ubuntu 17.10<br>
build-essential<br>
cmake<br>
libcurl4-openssl-dev<br>

## download
clone with --recurse-submodules:<br>
git clone --recurse-submodules git@github.com:uniquid/tank-c.git -b simplified-node<br>
cd tank-c
## build the project:
make
## run
cd bin<br>
./tank-c

## how to use
**provider**

**tank-c** implements a Uniquid node with provider and user capabilities.
This is a simplified version of the tank-c used for the stress test of the infrastructure.
As user it can send rpc requests to another Uniquid node.

The provider, in addition to the systems reserved, implements the following RPC functions:<br>

**RPC 33** - echo<br>
&nbsp;&nbsp;&nbsp;&nbsp;parameters:
- "string to be echoed" -

**RPC 34** - returns status information<br>
&nbsp;&nbsp;&nbsp;&nbsp;parameters:
- "" - none

**RPC 35** - input faucet<br>
&nbsp;&nbsp;&nbsp;&nbsp;parameters:
- "open" - open the input faucet
- "close" - closes the input faucet

**RPC 36** - output faucet<br>
&nbsp;&nbsp;&nbsp;&nbsp;parameters:
- "open" - open the output faucet
- "close" - closes the output faucet

**RPC 37** - returns the tank status<br>
&nbsp;&nbsp;&nbsp;&nbsp;parameters:
- "" - none

**user**

The user functionality is accessed from the console command line.<br>
Type:<br>
"ProviderName" "Method" "parameter"<br>
to request the node "ProviderName" to execute method "Method" passing "parameter" to the method.<br>
Es.<br>
UID984fee057c6d 33 {\"hello\":\"world\"}
