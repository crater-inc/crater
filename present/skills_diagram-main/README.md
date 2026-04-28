# diagram — 図解生成プロンプト作成スキル for Claude Code

記事・スライド・SNS用の図解（フロー図・比較表・マトリクス等）の**画像生成AIプロンプトを作成する** Claude Code カスタムスキルです。画像そのものは生成しません。

## 何をするスキルか

- 記事のH2セクションごとに図解プロンプトを自動設計
- 型カタログ（フロー・比較・ピラミッド・マトリクス・リスト・放射・タイムライン・因果関係）から最適な型を選択
- 生成したプロンプトは画像生成AI（Midjourney・Firefly・Skywork等）にそのままペースト可能
- 脱AIデザイン原則に基づき「AIっぽい均一なビジュアル」を回避

## セットアップ

### 1. スキルファイルを配置

```bash
git clone https://github.com/kawai-developer/skills_diagram.git
mv skills_diagram ~/.claude/skills/diagram
```

### 2. Claude Code のスキルとして登録

`~/.claude/settings.json` に以下を追加:

```json
{
  "skills": [
    {
      "name": "diagram",
      "path": "~/.claude/skills/diagram/SKILL.md"
    }
  ]
}
```

### 3. 呼び出し

```
/diagram [記事パス or テーマ or セクション内容]
```

## 使用例

```
/diagram 記事「生成AIの使い方5選」のH2セクションごとに図解プロンプトを作成して
/diagram SNS投稿用にClaudeとChatGPTの比較図解を作って
/diagram ~/projects/article/draft.md
```

## ファイル構成

```
diagram/
├── SKILL.md              # スキル本体（Claude Codeが読む）
└── references/
    ├── diagram-types.md  # 図解型カタログ（D1〜D8）
    ├── anti-ai-design.md # 脱AIデザイン原則
    ├── flowchart_step.txt
    ├── comparison_two_choice.txt
    ├── matrix_2x2.txt
    ├── concept_pyramid.txt
    ├── ranking.txt
    ├── timeline_horizontal.txt
    ├── relationship_network.txt
    ├── mindmap.txt
    ├── checklist.txt
    ├── tool_comparison_branch.txt
    ├── bar_chart_comparison.txt
    ├── glossary_card.txt
    ├── comic_4panel.txt
    ├── table.txt
    ├── before_after.txt
    └── claude_code_install_guide.md  # 使用例サンプル
```

## 出力ルール

- 出力ファイルには**画像生成AIにそのままペーストできるプロンプトのみ**を記載
- 複数図解は `---` で区切る
- 記事プロジェクト配下の場合: `{記事フォルダ}/図解.md` に保存

## 動作要件

- Claude Code（CLI）
- カスタムスキル機能が有効な環境
