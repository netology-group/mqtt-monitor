# MQTT Monitor

A plugin for VerneMQ that visualizes MQTT events for each session.

## Usage

1. Run `./docker/develop.run.sh`. This will build the plugin, install it to VerneMQ and start the broker.
2. Open http://localhost:4040.
3. Try to interact with the broker with mosquitto or another client.
4. The page should visualize events that happen inside the broker.

## Development

### Frontend

1. Run `./docker/develop.run.sh` to start the backend.
2. Run `cd frontend && yarn start`. It will start the development server with hot code reload and open up the browser.

### Backend

1. Run `mix deps.get && mix compile` to build the backend.
2. Run `iex -S mix` to start the plugin without the broker.
3. Run `cd frontend && yarn start` to start the frontend.
4. Simulate broker events by manually invoking callbacks from `MqttMonitor` module in iex.
