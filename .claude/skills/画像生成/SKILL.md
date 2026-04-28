# スキル定義：画像生成

## スキル名
**画像生成** - Flux 2 Max を使った実写感重視の画像生成

## 目的
AIっぽさを極限まで排除し、実写に近い画像を生成する汎用スキル。
食品・商品・人物・空間など幅広いジャンルに対応。

---

## 起動時の動作

```
/画像生成 [ジャンル] [内容説明] [保存先パス]
例：/画像生成 食品 "肉じゃがカレーのボウル" 02_APOLLOS/a-curry/output/post_001.jpg
```

ユーザーの説明をもとに最適なプロンプトを生成し、画像生成.pyを呼び出す。

---

## 実写感を出すための鉄則

### ✅ 必ず含めるもの
- **カメラ・レンズ指定**：`shot on Sony A7R IV with 85mm f/1.4 lens`
- **自然光**：`soft diffused natural window light` / `overcast daylight`
- **フィルム質感**：`subtle film grain, Kodak Portra 400 style`
- **不完全さ**：`slight imperfections, natural texture`
- **スタイル指定**：`editorial photography` / `documentary style`

### ❌ 絶対に使わない言葉
- perfect / flawless / stunning / beautiful
- premium / luxury（AI感が強くなる）
- dramatic lighting / golden hour（嘘くさくなる）
- 4K / 8K / ultra HD（AI画像の典型的な言葉）

---

## ジャンル別プロンプトテンプレート

### 食品（Food Photography）
```
[料理の説明], served in [器の説明],
shot on Sony A7R IV with 85mm f/1.4 lens,
soft diffused natural window light from the left,
shallow depth of field, slight bokeh background,
matte surface, natural imperfections,
subtle film grain, Kodak Portra 400 style,
editorial food photography, documentary style,
no artificial lighting, no retouching feel
```

### 商品（Product Photography）
```
[商品の説明], placed on [背景・素材],
shot on Canon EOS R5 with 50mm f/2 lens,
natural diffused light, soft shadows,
minimal styling, honest product shot,
subtle film grain, slightly imperfect composition,
commercial product photography, no CGI feel
```

### 空間・シーン（Lifestyle）
```
[シーンの説明],
shot on Leica M10 with 35mm f/2 lens,
available light only, natural shadows,
candid lifestyle photography,
grain texture, imperfect framing,
documentary style, no posed feel
```

---

## プロセス

1. ユーザーから「ジャンル・内容・保存先」を受け取る
2. 上記テンプレートをベースにプロンプトを組み立てる
3. 生成前にプロンプトをユーザーに見せて確認する（省略可）
4. `python3 .claude/tools/画像生成.py` を呼び出して生成
5. 結果画像を確認してフィードバックを受け取る
6. 必要に応じてプロンプトを調整して再生成

---

## 改善サイクル

生成後に必ず確認する：
- AI感が残っている場合 → どこがAIっぽいか特定して調整
- 方向性がずれた場合 → 構図・光・素材の言葉を変える
- OKな場合 → プロンプトをmemory.mdに保存

---

## 対応ツール
- **Flux 2 Max**（デフォルト・実写最優先）
- 将来的にはイラスト系モデルも追加予定

---

## クレジット管理

- 生成のたびに残高を自動確認する
- **200クレジット以下**になったら警告を出す
- 購入URL：`https://dashboard.bfl.ai/`
- 1クレジット ≒ 1円（$10 = 1,000クレジット）
- 警告が出たらケイスケさんに知らせてから継続する

---

## 実績・改良記録
- **初版作成日：** 2026年4月
- 食品写真でAI感排除を最優先課題として設計
