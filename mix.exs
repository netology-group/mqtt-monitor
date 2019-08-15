defmodule MqttMonitor.MixProject do
  use Mix.Project

  def project do
    [
      app: :mqtt_monitor,
      version: "0.1.0",
      elixir: "~> 1.9",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger],
      mod: {MqttMonitor.Application, []},
      env: [{:vmq_plugin_hooks, MqttMonitor.hooks()}]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:cowboy, "~> 2.6"},
      {:jason, "~> 1.1"},
      {:distillery, "~> 2.1", runtime: false}
    ]
  end
end
