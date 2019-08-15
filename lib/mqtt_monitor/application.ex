defmodule MqttMonitor.Application do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    with {:ok, _} <- start_cowboy() do
      cores_number = System.schedulers_online()

      children = [
        {Registry, name: MqttMonitor.PubSub, keys: :duplicate, partitions: cores_number}
      ]

      Supervisor.start_link(children, strategy: :one_for_one)
    end
  end

  @port 4040
  @routes [{:_, [{"/", MqttMonitor.WebsocketHandler, []}]}]

  defp start_cowboy do
    :cowboy.start_clear(
      :mqtt_monitor_ws_listener,
      [port: @port],
      %{env: %{dispatch: :cowboy_router.compile(@routes)}}
    )
  end
end
