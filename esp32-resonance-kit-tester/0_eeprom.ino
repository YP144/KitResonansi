//EEPROM
#include <EEPROM.h>
#include <TFFlashBuffer.h>                            //need to install the library first

#define last_step int                                 //variable to store the last step of the stepper
// FlashBuffer 
#define N_FLASH 2                                     //EEPROM Size, actually we only need 1
#define ADDR_FLASH 0                                  //EEPROM address
  
FlashBuffer<N_FLASH, last_step> fbuff(ADDR_FLASH);    //create the flash buffer a.k.a EEPROM

void eepromSetup(){
  // starting the EEPROM
  unsigned mem_size = fbuff.memSize();
  EEPROM.begin(mem_size);
  if (fbuff.load()) {
    Serial.println("EEPROM already contains data");
  }
  else {
    Serial.println("No data records");
    fbuff.init(); // empty data initialization
  }
}
