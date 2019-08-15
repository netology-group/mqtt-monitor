defmodule MqttMonitor.WebsocketHandler do
  if Code.ensure_loaded?(:cowboy_websocket_handler) do
    @behaviour :cowboy_websocket_handler
  end

  @initial_state %{}
  @idle_timeout 60_000

  def init(req, _opts) do
    {:cowboy_websocket, req, @initial_state, %{idle_timeout: @idle_timeout}}
  end

  def websocket_init(state) do
    with {:ok, _} <- Registry.register(MqttMonitor.PubSub, "events", []) do
      {:ok, state}
    end
  end

  @ping Jason.encode!(%{type: "ping"})
  @pong Jason.encode!(%{type: "pong"})

  def websocket_handle({:text, @ping}, state) do
    {:reply, {:text, @pong}, state}
  end

  def websocket_handle(_message, state) do
    {:ok, state}
  end

  def websocket_info({:event, %{} = event}, state) do
    {:reply, {:text, Jason.encode!(event)}, state}
  end

  def websocket_info(_message, state) do
    {:ok, state}
  end
end
