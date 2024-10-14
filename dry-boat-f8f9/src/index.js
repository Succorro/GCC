/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
*/
addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
	const url = new URL(request.url)
	console.log(`Received request for: ${url.pathname}`)

	// Handle API requests
	if (url.pathname.startsWith('/api/')) {
		// Example API route
		if (url.pathname === '/api/hello') {
			console.log('Responding to /api/hello')
			return new Response(JSON.stringify({ message: "Hello from Worker!" }), {
				headers: { 'Content-Type': 'application/json' }
			})
		}
		
		console.log(`No handler for API route: ${url.pathname}`)
	}

	// If not an API route, return a 404
	console.log(`Returning 404 for: ${url.pathname}`)
	return new Response('Not Found', { status: 404 })
}

export default {
	async fetch(request, env, ctx) {
		return new Response('Hello World?');
	},
	
};

