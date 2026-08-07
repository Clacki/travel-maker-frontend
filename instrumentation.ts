export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { server } = await import('./mocks/server')
    server.listen({
      onUnhandledRequest(request, print) {
        if (new URL(request.url).hostname === 'travelmaker.demo')
          print.warning()
      },
    })
  }
}
