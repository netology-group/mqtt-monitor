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

  @routes [
    {:_,
     [
       {"/ws", MqttMonitor.WebsocketHandler, []},
       {"/", :cowboy_static,
        {:priv_file, :mqtt_monitor, "public/index.html", [{:mimetypes, {"text", "html", []}}]}},
       {"/[...]", :cowboy_static,
        {:priv_dir, :mqtt_monitor, "public", [{:mimetypes, :cow_mimetypes, :web}]}}
     ]}
  ]

  defp start_cowboy do
    :cowboy.start_clear(
      :mqtt_monitor,
      [port: @port],
      %{env: %{dispatch: :cowboy_router.compile(@routes)}}
    )
  end
end
