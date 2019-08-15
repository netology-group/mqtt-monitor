document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket('ws://localhost:4040');
  setInterval(() => socket.send("ping"), 10000);

  socket.addEventListener('message', event => {
    let json = JSON.parse(event.data);
    if (json.type === 'pong') return;

    document.write(`<pre><time>${json.timestamp}</time><br />`);
    document.write(JSON.stringify(json, null, 2));
    document.write("</pre><br />");
  });
});
