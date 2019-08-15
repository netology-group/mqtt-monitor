# MQTT Monitor

A plugin for VerneMQ that serves broker events by websocket in JSON format.

## Usage

1. Run `./docker/develop.run.sh`. This will build the plugin, install it to VerneMQ and start the broker.
2. Open frontend/index.html in your browser.
3. Try to interact with the broker with mosquitto or another client.
4. The page should show JSON objects representing broker events.
