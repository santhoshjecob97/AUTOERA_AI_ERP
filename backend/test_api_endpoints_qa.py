import urllib.request
import urllib.error
import json

BASE = 'http://127.0.0.1:8000'

def run():
    # 1. Login to get token
    login_data = json.dumps({'username': 'gm_apex', 'password': 'AutoEra2026!Secure'}).encode('utf-8')
    req = urllib.request.Request(f'{BASE}/api/v1/auth/login/', data=login_data, headers={'Content-Type': 'application/json'})
    try:
        res = urllib.request.urlopen(req)
        tokens = json.loads(res.read().decode('utf-8'))
        token = tokens['access']
        print('[PASS] Login OK. Token obtained.')
    except Exception as e:
        print(f'[FAIL] Login failed: {e}')
        return

    def test_get(endpoint):
        try:
            r = urllib.request.Request(f'{BASE}{endpoint}', headers={'Authorization': f'Bearer {token}'})
            resp = urllib.request.urlopen(r)
            data = resp.read().decode('utf-8')
            sample = data[:80].replace('\n', ' ')
            print(f'[PASS] {endpoint} -> {resp.status} (bytes: {len(data)}) Sample: {sample}')
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8', errors='ignore')[:120]
            print(f'[FAIL] {endpoint} -> {e.code}: {err_body}')
        except Exception as ex:
            print(f'[ERROR] {endpoint} -> {ex}')

    endpoints = [
        '/api/v1/health/',
        '/api/v1/auth/me/',
        '/api/v1/customers/',
        '/api/v1/vehicles/',
        '/api/v1/sales/leads/',
        '/api/v1/service/job-cards/',
        '/api/v1/inventory/parts/',
        '/api/v1/finance/invoices/',
        '/api/v1/insurance/policies/',
        '/api/v1/organization/branches/',
        '/api/v1/used-cars/appraisals/',
        '/api/v1/ev/battery-data/',
        '/api/v1/fleet/vehicles/',
        '/api/v1/ai/top-actions/',
        '/api/v1/ai/sla-summary/',
    ]

    for ep in endpoints:
        test_get(ep)

if __name__ == '__main__':
    run()
