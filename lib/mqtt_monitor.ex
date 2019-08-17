defmodule MqttMonitor do
  def hooks do
    [
      # Session lifecycle
      {__MODULE__, :on_auth_m5, 3, []},
      {__MODULE__, :on_register, 3, []},
      {__MODULE__, :on_register_m5, 4, []},
      {__MODULE__, :on_client_wakeup, 1, []},
      {__MODULE__, :on_client_offline, 1, []},
      {__MODULE__, :on_client_gone, 1, []},
      # Subscribe flow
      {__MODULE__, :on_subscribe, 3, []},
      {__MODULE__, :on_subscribe_m5, 4, []},
      {__MODULE__, :on_unsubscribe, 3, []},
      {__MODULE__, :on_unsubscribe_m5, 4, []},
      # Publish flow
      {__MODULE__, :on_publish, 6, []},
      {__MODULE__, :on_publish_m5, 7, []},
      {__MODULE__, :on_deliver, 4, []},
      {__MODULE__, :on_deliver_m5, 5, []},
      {__MODULE__, :on_offline_message, 5, []},
      {__MODULE__, :on_message_drop, 3, []}
    ]
  end

  def on_auth_m5(_username, {_, client_id}, properties) do
    publish(%{type: "auth_m5", client_id: client_id, properties: properties})
    :ok
  end

  def on_register(_peer, {_, client_id}, _username) do
    publish(%{type: "register", client_id: client_id})
    :ok
  end

  def on_register_m5(_peer, {_, client_id}, _username, properties) do
    publish(%{type: "register_m5", client_id: client_id, properties: properties})
    :ok
  end

  def on_client_wakeup({_, client_id}) do
    publish(%{type: "client_wakeup", client_id: client_id})
    :ok
  end

  def on_client_offline({_, client_id}) do
    publish(%{type: "client_offline", client_id: client_id})
    :ok
  end

  def on_client_gone({_, client_id}) do
    publish(%{type: "client_gone", client_id: client_id})
    :ok
  end

  def on_subscribe(_, {_, client_id}, topics) do
    publish(%{type: "subscribe", client_id: client_id, topics: dump_topics(topics)})
    :ok
  end

  def on_subscribe_m5(_, {_, client_id}, topics, properties) do
    publish(%{
      type: "subscribe_m5",
      client_id: client_id,
      topics: dump_topics(topics),
      properties: properties
    })

    :ok
  end

  def on_unsubscribe(_, {_, client_id}, topics) do
    publish(%{type: "unsubscribe", client_id: client_id, topics: dump_topics(topics)})
    :ok
  end

  def on_unsubscribe_m5(_, {_, client_id}, topics, properties) do
    publish(%{
      type: "unsubscribe_m5",
      client_id: client_id,
      topics: dump_topics(topics),
      properties: properties
    })

    :ok
  end

  def on_publish(_, {_, client_id}, qos, topic, payload, retain) do
    publish(%{
      type: "publish",
      client_id: client_id,
      topic: topic,
      qos: qos,
      retain: retain,
      payload: payload
    })

    :ok
  end

  def on_publish_m5(_, {_, client_id}, qos, topic, payload, retain, properties) do
    publish(%{
      type: "publish_m5",
      client_id: client_id,
      topic: topic,
      qos: qos,
      retain: retain,
      payload: payload,
      properties: properties
    })

    :ok
  end

  def on_deliver(_, {_, client_id}, topic, payload) do
    publish(%{type: "deliver", client_id: client_id, topic: topic, payload: payload})
    :ok
  end

  def on_deliver_m5(_, {_, client_id}, topic, payload, properties) do
    publish(%{
      type: "deliver",
      client_id: client_id,
      topic: topic,
      payload: payload,
      properties: properties
    })

    :ok
  end

  def on_offline_message({_, client_id}, qos, topic, payload, retain) do
    publish(%{
      type: "offline_message",
      client_id: client_id,
      topic: topic,
      qos: qos,
      retain: retain,
      payload: payload
    })

    :ok
  end

  def on_message_drop({_, client_id}, promise, reason) do
    {topic, qos, payload, properties} =
      case promise.() do
        :error -> {nil, nil, nil, nil}
        other -> other
      end

    publish(%{
      type: "message_drop",
      client_id: client_id,
      reason: reason,
      topic: topic,
      qos: qos,
      payload: payload,
      properties: properties
    })

    :ok
  end

  defp publish(event) do
    event = event |> Map.put(:timestamp, DateTime.to_iso8601(DateTime.utc_now()))

    Registry.dispatch(MqttMonitor.PubSub, "events", fn entries ->
      for {pid, _} <- entries, do: pid |> send({:event, event})
    end)
  end

  defp dump_topics(topics) do
    for {topic, _} <- topics, do: topic
  end
end
