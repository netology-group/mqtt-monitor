# -------------------------------
# -- Build MQTT Monitor plugin --
# -------------------------------
FROM nesachirou/elixir:1.9_erl21 AS mqtt-monitor
RUN mix local.hex --force && mix local.rebar --force

ENV MIX_ENV prod
WORKDIR /app

COPY mix.* /app/
RUN mix deps.get && mix deps.compile

COPY ./config /app/config
COPY ./rel /app/rel
COPY ./lib /app/lib
RUN mix release

# --------------------
# -- Build frontend --
# --------------------
FROM node:12.8.1-alpine AS frontend

ENV NODE_ENV production
WORKDIR /app

COPY ./frontend/package* /app/
RUN npm install

COPY ./frontend /app
RUN yarn build

# -----------------------------------------------
# -- Bundle the plugin and frontend to VerneMQ --
# -----------------------------------------------
FROM netologygroup/mqtt-gateway:v0.11.1-vmq1.9

ENV APP_AUTHN_ENABLED 0
ENV APP_AUTHZ_ENABLED 0

COPY docker/vernemq.conf /etc/vernemq/vernemq.conf
COPY --from=mqtt-monitor /app/_build/prod/rel/mqtt_monitor /opt/mqtt_monitor/

COPY --from=frontend /app/build /opt/mqtt_monitor/lib/mqtt_monitor-0.1.0/priv/public
