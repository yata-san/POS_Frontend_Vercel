# Githubリポジトリの初期化→プッシュまで

## 1. カレントディレクトリをGitリポジトリとして初期化
git init

## 2. ファイルをステージングエリアに追加
git add .

## 3. コミットを作成
git commit -m "commit"

## 4. リモートリポジトリのURLを追加（URLは実際のものに置き換えてください）
git remote set-url origin your-repository-url

## 5. ローカルのmainブランチをリモートにプッシュ
git push -u origin main

## 環境変数備忘
NODE_ENV:production
NEXT_PUBLIC_API_ENDPOINT:

# Vercelでのデプロイについて
このプロジェクトはVercelでデプロイされます。
Vercelの管理画面から直接デプロイを行ってください。

Framework Preset: Next.js
Root Directory: Frontend/
Build Command: npm run build
Output Directory: .next
