FROM nesachirou/elixir:1.9_erl21 AS mqtt-monitor
RUN mix local.hex --force && mix local.rebar --force

ENV MIX_ENV prod
WORKDIR /build

COPY mix.* /build/
RUN mix deps.get && mix deps.compile

COPY . /build
RUN mix release

# --------------------------------------------------------------------------------------------------

FROM netologygroup/mqtt-gateway:v0.11.1-vmq1.9

ENV APP_AUTHN_ENABLED 0
ENV APP_AUTHZ_ENABLED 0

COPY docker/vernemq.conf /etc/vernemq/vernemq.conf
COPY --from=mqtt-monitor /build/_build/prod/rel/mqtt_monitor /opt/mqtt_monitor/
