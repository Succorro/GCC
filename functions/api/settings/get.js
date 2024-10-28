export function onRequest(context) {
  return new Response("Hello from Pages Function!", {
    headers: { "Content-Type": "text/plain" },
  });
}