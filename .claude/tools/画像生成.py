#!/usr/bin/env python3
"""
Flux 2 Max 画像生成スクリプト
使い方: python3 画像生成.py "プロンプト" 保存先パス
例: python3 画像生成.py "a bowl of curry" 02_APOLLOS/a-curry/output/post_001.jpg
"""

import sys
import os
import requests
import time

# クレジット警告ライン
CREDIT_WARNING = 200  # この残高を下回ったら警告
CREDIT_PURCHASE_URL = "https://dashboard.bfl.ai/"  # クレジット購入URL

# .envからAPIキーを読み込む
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), "../../.env")
    env_path = os.path.abspath(env_path)
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip()

load_env()

API_KEY = os.environ.get("BFL_API_KEY")
if not API_KEY:
    print("エラー: BFL_API_KEY が .env に見つかりません")
    sys.exit(1)

def check_credits():
    """クレジット残高を確認して警告を出す"""
    try:
        response = requests.get(
            "https://api.bfl.ai/v1/user",
            headers={"X-Key": API_KEY}
        )
        if response.status_code == 200:
            data = response.json()
            credits = data.get("credits", None)
            if credits is not None:
                print(f"クレジット残高: {credits}")
                if credits <= CREDIT_WARNING:
                    print(f"⚠️  残高が少なくなっています（{credits}クレジット）")
                    print(f"購入はこちら: {CREDIT_PURCHASE_URL}")
    except Exception:
        pass  # クレジット確認失敗は無視して生成を続ける

def generate_image(prompt: str, output_path: str):
    # 生成前にクレジット確認
    check_credits()

    print(f"生成中: {prompt[:50]}...")

    # 画像生成リクエスト
    response = requests.post(
        "https://api.bfl.ai/v1/flux-pro-1.1",
        headers={
            "X-Key": API_KEY,
            "Content-Type": "application/json"
        },
        json={
            "prompt": prompt,
            "width": 1024,
            "height": 1024,
        }
    )

    if response.status_code != 200:
        print(f"エラー: {response.status_code} {response.text}")
        sys.exit(1)

    task_id = response.json().get("id")
    print(f"タスクID: {task_id} - 完了待ち...")

    # 完了を待つ（ポーリング）
    for _ in range(60):
        time.sleep(3)
        result = requests.get(
            f"https://api.bfl.ai/v1/get_result?id={task_id}",
            headers={"X-Key": API_KEY}
        )
        data = result.json()
        status = data.get("status")

        if status == "Ready":
            image_url = data["result"]["sample"]
            # 画像をダウンロード
            img_data = requests.get(image_url).content
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(img_data)
            print(f"✓ 保存完了: {output_path}")
            return
        elif status == "Error":
            print(f"エラー: {data}")
            sys.exit(1)
        else:
            print(f"  状態: {status}...")

    print("タイムアウト: 生成に時間がかかりすぎています")
    sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("使い方: python3 画像生成.py 'プロンプト' '保存先パス'")
        sys.exit(1)

    prompt = sys.argv[1]
    output_path = sys.argv[2]
    generate_image(prompt, output_path)
