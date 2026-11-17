"""Optional local preview for the static study website. No API or chatbot."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


def make_server(port=8000):
    directory = Path(__file__).resolve().parent / 'web'
    return ThreadingHTTPServer(('127.0.0.1', port), partial(SimpleHTTPRequestHandler, directory=str(directory)))


if __name__ == '__main__':
    server = make_server()
    print('학습 웹: http://127.0.0.1:8000', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
