/*
 * tank.c
 *
 *  Created on: 29/aug/2016
 *      Author: M. Palumbi
 */
 
 




#pragma once
#ifndef __TANK_H__
#define __TANK_H__

#define F_machine 34
#define F_inputFaucet 35
#define F_outputFaucet 36
#define F_status 37

//#define TOPIC       "TankSimulator/"

void *tank(void *arg);

void user_34_machine(char *param, char *result, size_t size);
void user_35_inputFaucet(char *param, char *result, size_t size);
void user_36_outputFaucet(char *param, char *result, size_t size);
void user_37_status(char *param, char *result, size_t size);

#endif // __TANK_H__
