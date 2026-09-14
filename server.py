import http.server
import socketserver
import os

PORT = 3600

class ProxyFixHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Se viene richiesto l'index o la root, iniettiamo il tag <base>
        clean_path = self.path.split('?')[0]
        if clean_path in ['/', '/index.html', f'/proxy/{PORT}/', f'/proxy/{PORT}/index.html']:
            filepath = self.translate_path('/index.html')
            if os.path.exists(filepath):
                with open(filepath, 'rb') as f:
                    content = f.read().decode('utf-8', errors='ignore')
                
                # Inietta <base href="/proxy/3600/"> nell'head dell'HTML
                base_tag = f'<base href="/proxy/{PORT}/">'
                if '<head>' in content:
                    content = content.replace('<head>', f'<head>\n  {base_tag}', 1)
                else:
                    content = base_tag + content
                
                encoded = content.encode('utf-8')
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(encoded)))
                self.end_headers()
                self.wfile.write(encoded)
                return

        super().do_GET()

    def translate_path(self, path):
        # Normalizza i percorsi rimuovendo il prefisso del proxy di code-server
        clean_path = path
        prefix = f'/proxy/{PORT}'
        if clean_path.startswith(prefix):
            clean_path = clean_path[len(prefix):]
        elif clean_path.startswith('/proxy'):
            clean_path = clean_path[len('/proxy'):]

        if not clean_path or clean_path == '/':
            clean_path = '/index.html'

        return super().translate_path(clean_path)

socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("127.0.0.1", PORT), ProxyFixHandler) as httpd:
    print(f"Server attivo su 127.0.0.1:{PORT} con riscrittura base-href automatica")
    httpd.serve_forever()
