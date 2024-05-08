from http.server import BaseHTTPRequestHandler, HTTPServer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import json, random

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'OK')

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        response_data = self.process_post_data(post_data)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(response_data)

    def process_post_data(self, post_data):
        post_data = json.loads(post_data)
        inputs = tokenizer(post_data["code"], return_tensors="pt", max_length=512, truncation=True)
        outputs = model.generate(**inputs)
        vulnerabilities = tokenizer.decode(outputs[0], skip_special_tokens=True)
        vulnerable = vulnerabilities != "CWE0"

        response_data = json.dumps({'vulnerable': vulnerable}).encode('utf-8')
        return response_data

if __name__ == '__main__':
    model_name = "sudonite/Codetective-T5"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    server_address = ('', 8080)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    httpd.serve_forever()