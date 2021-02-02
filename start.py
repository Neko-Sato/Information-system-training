import ssl
import http.server

PORT = 50194#8000
Handler = http.server.SimpleHTTPRequestHandler

ctx = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ctx.load_cert_chain('server.crt', keyfile='server.key')
ctx.options |= ssl.OP_NO_TLSv1 | ssl.OP_NO_TLSv1_1

with http.server.HTTPServer(("", PORT), Handler) as httpd:
    httpd.socket = ctx.wrap_socket(httpd.socket)
    httpd.serve_forever()