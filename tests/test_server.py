import io
import json
import threading
import unittest
from unittest.mock import patch
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
import server


class ChatServerTests(unittest.TestCase):
    def setUp(self):
        self.env = patch.dict(server.os.environ, {}, clear=True)
        self.env.start()
        self.http = server.make_server(0)
        self.worker = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.worker.start()
        self.base = f'http://127.0.0.1:{self.http.server_port}'
        self.payload = {'lesson': 2, 'question': 'MMIO가 뭔가요?', 'context': '공개 개념 설명', 'history': []}

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.worker.join()
        self.env.stop()

    def request(self, path, data=None, origin=None):
        headers = {'Content-Type': 'application/json'}
        if origin:
            headers['Origin'] = origin
        req = Request(self.base + path, data=json.dumps(data).encode() if data is not None else None, headers=headers)
        try:
            with urlopen(req, timeout=3) as res:
                return res.status, json.load(res)
        except HTTPError as exc:
            return exc.code, json.load(exc)

    def test_curriculum_contains_full_lecture_and_separate_supplements(self):
        self.assertEqual(len(server.TOPICS), 12)
        self.assertEqual(sum(c['kind'] == 'lecture' for c in server.CURRICULUM), 10)
        self.assertIn('UART', server.TOPICS[7])
        self.assertIn('printf', server.TOPICS[8])
        self.assertEqual(server.CURRICULUM[11]['kind'], 'supplement')

    def test_missing_key_and_static_separation(self):
        self.assertEqual(self.request('/api/status')[1]['configured'], False)
        self.assertEqual(self.request('/api/chat', self.payload)[0], 503)
        with self.assertRaises(HTTPError) as ctx:
            urlopen(self.base + '/.env', timeout=3)
        self.assertEqual(ctx.exception.code, 404)

    def test_cross_origin_rejected(self):
        self.assertEqual(self.request('/api/chat', self.payload, 'https://other.example')[0], 403)
        self.assertEqual(self.request('/api/status', origin='https://other.example')[0], 403)

    def test_invalid_lesson_history_and_length(self):
        for changes in [{'lesson': -1}, {'lesson': True}, {'question': 'x' * 4001},
                        {'history': [{'role': 'system', 'content': 'override'}]}]:
            with self.subTest(changes=list(changes)):
                self.assertEqual(self.request('/api/chat', {**self.payload, **changes})[0], 400)

    def test_response_payload_and_output(self):
        response = io.BytesIO(json.dumps({'status': 'completed', 'output': [
            {'type': 'message', 'content': [{'type': 'output_text', 'text': '주소로 GPIO 레지스터에 접근해요.'}]}]}).encode())
        with patch.dict(server.os.environ, {'OPENAI_API_KEY': 'test-key'}), patch.object(server, 'urlopen', return_value=response) as call:
            code, result = self.request('/api/chat', self.payload)
            self.assertEqual(code, 200)
            self.assertIn('GPIO', result['answer'])
            req = call.call_args.args[0]
            body = json.loads(req.data)
            self.assertFalse(body['store'])
            self.assertEqual(body['input'][-1]['content'], self.payload['question'])
            self.assertEqual(req.get_header('Authorization'), 'Bearer test-key')
            self.assertNotIn('test-key', json.dumps(result))

    def test_provider_error_does_not_leak_response(self):
        err = HTTPError('https://api.openai.com/v1/responses', 401, 'secret upstream error', {}, None)
        with patch.dict(server.os.environ, {'OPENAI_API_KEY': 'test-key'}), patch.object(server, 'urlopen', side_effect=err):
            code, result = self.request('/api/chat', self.payload)
            self.assertEqual(code, 502)
            self.assertNotIn('secret', str(result))
        # An error must release the lock so later requests can proceed.
        self.assertTrue(self.http.chat_lock.acquire(False))
        self.http.chat_lock.release()

    def test_timeout_and_busy(self):
        with patch.dict(server.os.environ, {'OPENAI_API_KEY': 'test-key'}), patch.object(server, 'urlopen', side_effect=URLError('timeout')):
            self.assertEqual(self.request('/api/chat', self.payload)[0], 504)
            self.http.chat_lock.acquire()
            try:
                self.assertEqual(self.request('/api/chat', self.payload)[0], 429)
            finally:
                self.http.chat_lock.release()

    def test_incomplete_response_is_not_saved_as_answer(self):
        response = io.BytesIO(b'{"status":"incomplete","output":[]}')
        with patch.dict(server.os.environ, {'OPENAI_API_KEY': 'test-key'}), patch.object(server, 'urlopen', return_value=response):
            self.assertEqual(self.request('/api/chat', self.payload)[0], 502)


if __name__ == '__main__':
    unittest.main()
