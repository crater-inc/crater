#!/usr/bin/env python3
"""Claudeの出力からMarkdownのコードフェンス(```json ... ```)を剥がし、
妥当なJSONか検証してから同じファイルに上書き保存する。"""
import json
import re
import sys

path = sys.argv[1]
content = open(path, encoding="utf-8").read().strip()
content = re.sub(r"^```(?:json)?\s*\n?", "", content)
content = re.sub(r"\n?```\s*$", "", content)

parsed = json.loads(content)  # 不正なら例外を投げて exit code != 0 にする

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
