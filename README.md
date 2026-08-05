# 贪吃蛇网页游戏 <sub>[日本語](#japanese) | [English](#english)</sub>

一个纯前端贪吃蛇小游戏，支持键盘、鼠标与移动端触控。

## 功能特性

- 键盘（方向键 / WASD）或鼠标点击棋盘四边控制转向
- 移动端：点按棋盘四边转向，滑动屏幕亦可
- 空格开始或暂停；点击棋盘开始 / 继续 / 重开
- 重新开始按钮重置游戏
- 速度滑块调整移动速度
- 实时帧率显示（低于 45fps 变金、低于 30fps 变红）

## 操作

- 方向键或 WASD 控制移动
- 空格开始或暂停
- 重新开始按钮重置游戏
- 速度滑块调整移动速度

## 本地运行

直接打开 `index.html`，或在当前目录启动静态服务器：

```bash
python -m http.server 4173 --bind 127.0.0.1
```

然后访问 `http://127.0.0.1:4173/`。

## 更新日志

详见 [CHANGELOG.md](./CHANGELOG.md)。

<a id="japanese"></a>

## 日本語 <sub>[中文](#readme) | [English](#english)</sub>

キーボードとモバイル用ボタンで操作できる、フロントエンドのスネークゲームです。

### 操作

- 矢印キーまたは WASD で移動
- マウスで盤面の四辺をクリックしても移動
- モバイル: 盤面の四辺をタップ、またはスワイプで方向転換
- スペースキーで開始または一時停止
- リスタートボタンでゲームをリセット
- 速度スライダーで移動速度を調整
- フレームレート表示機能

### ローカルで実行

`index.html` を直接開くか、静的サーバーを起動します：

```bash
python -m http.server 4173 --bind 127.0.0.1
```

その後 `http://127.0.0.1:4173/` にアクセスします。

<a id="english"></a>

## English <sub>[中文](#readme) | [日本語](#japanese)</sub>

A pure frontend snake game with keyboard, mouse and touch controls.

### Controls

- Arrow keys or WASD to move
- Click the four edges of the board (mouse) to turn
- Mobile: tap the four edges of the board to turn, or swipe to steer
- Space to start or pause; tap the board to start / resume / restart
- Restart button to reset the game
- Speed slider to adjust movement speed
- On-screen FPS counter (gold below 45 fps, red below 30 fps)

### Run Locally

Open `index.html` directly, or start a static server in this folder:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:4173/`.
