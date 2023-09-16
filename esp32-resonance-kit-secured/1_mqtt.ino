#include <WiFi.h>
#include <PubSubClient.h>                         //Need to install the library first

const char* ssid = "yosaider";                    //change this to the approriate WiFi ssid
const char* password = "87654321";                //change this to the approriate WiFi password

// Local MQTT broker
char* mqttServer = "iot.tf.itb.ac.id";
int mqttPort = 1883;

//publish and subscribe topic
const char* mqtt_client_name = "Yosep";
const char* mqtt_pub_topic1 = "db";
const char* mqtt_pub_topic2 = "tube_length";
const char* mqtt_sub_topic1 = "stepper_move";
const char* mqtt_sub_topic2 = "action";

WiFiClient client;
PubSubClient mqttClient(client);

void callback(char* topic, byte* payload, unsigned int length) {
  //getting payload data from MQTT
  String payloadTemp;
  for(int i=0;i<length;i++){
    payloadTemp += (char)payload[i];
  }
  Serial.println();

  //adding the payload to the approriate variable based on the topic
  if (String(topic)==mqtt_sub_topic1){
      Serial.print("State: ");
      Serial.println(payloadTemp);
      state = payloadTemp.toInt();
  }
  else if (String(topic)==mqtt_sub_topic2){
      Serial.print("action: ");
      Serial.println(payloadTemp);
      action = payloadTemp.toInt();
  }
}

void mqttSetup(){
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while( WiFi.status() != WL_CONNECTED ) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected to: ");
  Serial.println(ssid);
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  delay(2000);
  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(callback);
}
