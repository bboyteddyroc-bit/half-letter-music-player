# 半程温柔，予你余生 — Mobile Music Player

一个单页面、手机端优先的极简黑白电影感音乐播放器。

## 功能

- 自适应手机端 / 桌面端
- 中央黑胶唱片封面，播放时旋转
- 自带 MP3 播放、暂停、前后 10 秒与进度拖动
- 中文歌词同步滚动
- 点击 / 触摸屏幕触发星光与雪花粒子
- 歌曲播放结束后自动弹出信纸质感情书
- 可选 GA4 私有观看次数统计：统计只进后台，不展示在网页前端
- 已包含 GitHub Pages 自动部署工作流

## 私有观看次数

GitHub Pages 本身只提供静态文件，不具备可写后端。项目使用 GA4 作为“后台观看次数”方案：

1. 在 Google Analytics 创建 GA4 Web 数据流。
2. 得到类似 `G-ABC1234567` 的 Measurement ID。
3. 打开 `analytics.js`，填入 `GA_MEASUREMENT_ID`。
4. 部署后，每次访问页面会发送 page_view；前端不会显示次数。
5. 在 GA4 的 Realtime / Reports 中查看访问量。

## GitHub Pages

工作流 `.github/workflows/pages.yml` 会在 `main` 分支 push 后自动部署。

首次使用时，请在 GitHub 仓库：

`Settings → Pages → Build and deployment → Source → GitHub Actions`

然后 push 到 `main` 即可。

## 歌词精调

歌词时间轴在 `app.js` 的 `lyricTimeline`。当前已按 03:41 音频时长做初始同步。如果要逐句卡到演唱字头，只需修改每行 `time` 秒数。
