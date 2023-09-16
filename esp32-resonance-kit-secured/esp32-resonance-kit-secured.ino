#define BAUD 115200

//GLOBAL VARIABLE
//from stepper
int action = 0;         //for calibration, 1 for reset the tube length to zero and erase EEPROM data
int count_step = 0;     //number of stepper step movement
float tube_length = 0;  //length of the tube, in cm
int state = 0;          //stepper movement state, 0 if it's steady, 1 CW (shortend), and 2 CCW (elongated)

//from i2s SLM
uint32_t Leq_samples = 0;
double Leq_sum_sqr = 0;
double Leq_dB = 0;
