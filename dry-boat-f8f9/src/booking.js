addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    // Example API route
    if (url.pathname === '/api/hello') {
      return new Response(JSON.stringify({ message: "Hello from Worker!" }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Add more API routes as needed
  }

  // If not an API route, return a 404
  return new Response('Not Found', { status: 404 })
}
export default handleRequest;