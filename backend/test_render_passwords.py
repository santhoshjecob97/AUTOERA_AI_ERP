import urllib.request
import urllib.error
import json

def test_login(pwd):
    data = json.dumps({'username': 'gm_apex', 'password': pwd}).encode('utf-8')
    req = urllib.request.Request('https://autoera-backend-w0lf.onrender.com/api/v1/auth/login/', data=data, headers={'Content-Type': 'application/json'})
    try:
        res = urllib.request.urlopen(req)
        print(f'Password "{pwd}" -> Status: {res.status}')
    except urllib.error.HTTPError as e:
        print(f'Password "{pwd}" -> HTTPError: {e.code} {e.read().decode("utf-8")}')

test_login('AutoEra2026!')
test_login('AutoEra2026!Secure')
