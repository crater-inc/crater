#!/usr/bin/env python3
# BFL Flux API で画像生成する簡易スクリプト
import os, sys, time, json, urllib.request, urllib.error

def load_env(path):
    if os.path.exists(path):
        for line in open(path):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

load_env("/Users/cratermacbookpro/Projects/claude/.env")
KEY = os.environ.get("BFL_API_KEY")
if not KEY:
    print("NO_KEY"); sys.exit(1)

prompt = sys.argv[1]
out = sys.argv[2]
width = int(sys.argv[3]) if len(sys.argv) > 3 else 1440
height = int(sys.argv[4]) if len(sys.argv) > 4 else 896
model = sys.argv[5] if len(sys.argv) > 5 else "flux-pro-1.1"

def post(url, data):
    req = urllib.request.Request(url, data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json", "x-key": KEY}, method="POST")
    return json.loads(urllib.request.urlopen(req, timeout=60).read())

def get(url):
    req = urllib.request.Request(url, headers={"x-key": KEY})
    return json.loads(urllib.request.urlopen(req, timeout=60).read())

try:
    sub = post(f"https://api.bfl.ai/v1/{model}",
               {"prompt": prompt, "width": width, "height": height,
                "output_format": "jpeg", "safety_tolerance": 6})
except urllib.error.HTTPError as e:
    print("SUBMIT_ERR", e.code, e.read().decode()[:300]); sys.exit(2)

pid = sub.get("id"); poll = sub.get("polling_url")
print("submitted", pid)
for _ in range(120):
    time.sleep(2)
    r = get(poll)
    st = r.get("status")
    if st == "Ready":
        img_url = r["result"]["sample"]
        data = urllib.request.urlopen(img_url, timeout=120).read()
        open(out, "wb").write(data)
        print("SAVED", out, len(data))
        sys.exit(0)
    elif st in ("Error", "Failed", "Content Moderated", "Request Moderated"):
        print("FAIL", st, json.dumps(r)[:300]); sys.exit(3)
print("TIMEOUT"); sys.exit(4)
