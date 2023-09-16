// defines pins numbers
#define stepPin 12
#define dirPin 13
const int rev_step = 200;                           //1 full revolution of Nema 17 Stepper

void stepperControl(){
  if (state == 0){
    digitalWrite(stepPin,LOW); 
    delay(500);
    Serial.println("Steady");
    countLength();
  }
  else if (state == 1){
    digitalWrite(dirPin,HIGH);
    for(int x = 0; x < 2*rev_step; x++){
      digitalWrite(stepPin,HIGH); 
      delayMicroseconds(625); 
      digitalWrite(stepPin,LOW); 
      delayMicroseconds(625); 
    }
    count_step = count_step - 2*rev_step;
    fbuff.put(count_step);                        //saving last step to the EEPROM
    Serial.println("CW");
    countLength();
  }
  else if (state == 2){
    digitalWrite(dirPin,LOW);
    for(int x = 0; x < 2*rev_step; x++){
      digitalWrite(stepPin,HIGH); 
      delayMicroseconds(625); 
      digitalWrite(stepPin,LOW); 
      delayMicroseconds(625); 
    }
    count_step = count_step + 2*rev_step;
    fbuff.put(count_step);                        //saving last step to the EEPROM
    Serial.println("CCW");
    countLength();
  }
  delay(1500);
}

void countLength(){
  tube_length = (((float)count_step)/(10*rev_step))*2;        // every 10 revstep (2000) is +-4 cm
  //send to MQTT
  char msg_out2[4];
  sprintf(msg_out2,"%.1f",tube_length);
  mqttClient.publish(mqtt_pub_topic2,msg_out2);
}

void calibrateLength(){
  fbuff.erase();
  fbuff.init();
  Serial.println("EEPROM data has been erased");
  count_step = 0;
  tube_length = 0;
  Serial.println("Tube length has been reset");
  action = 0;
}

void stepperSetup(){
  // Sets the two pins as Stepper Outputs
  pinMode(stepPin,OUTPUT); 
  pinMode(dirPin,OUTPUT);
  //getting the last saved tube length (last stepper count_step)
  last_step ls;
  fbuff.getFirst(ls);
  count_step = ls;
}
