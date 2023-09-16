void setup() {
  Serial.begin(BAUD);
  delay(1000); // Safety
  eepromSetup();
  mqttSetup();
  stepperSetup();
  slmSetup();
}

void loop() {
  if( !mqttClient.connected() ){
    while( !mqttClient.connected() ){
      if( mqttClient.connect(mqtt_client_name) ){
        Serial.println("MQTT Connected!");
        mqttClient.subscribe(mqtt_sub_topic1);          //stepper_move
        mqttClient.subscribe(mqtt_sub_topic2);          //action (calibration)
      }
      else{
        Serial.print(".");
      }
    }
  }
  mqttClient.loop();
  stepperControl();
  // calibration
  // getting input from serial monitor (but now we can calibrate via mqtt)
  if (Serial.available()) {
    action = Serial.parseInt();
  }
  if (action == 1){
    calibrateLength();
  }
}
