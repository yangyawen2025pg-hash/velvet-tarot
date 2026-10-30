# Velvet Tarot — 情绪表达与信件交互优化 V1

本补丁仅覆盖以下 3 个源码文件（基于已合并 Analytics V2 的 main 分支）：
- src/App.tsx — 删除保存信件时的 `trpc.entry.sync` 调用（保留 localStorage）并添加前往时光信笺按钮
- src/sections/CardDrawSection.tsx — 写信 / 暂时不写选择，保存成功反馈
- src/lib/analytics.ts — 新增 `letter_choice`，属性只允许 `choice: write | skip`，保留 `$geoip_disable: true`

## Mac 安装步骤

1. 先创建功能分支：
   cd ~/Downloads/velvet-tarot
   git switch main
   git pull origin main
   git switch -c feature/emotion-letter-ux

2. 下载压缩包到 ~/Downloads，运行：
   unzip -o ~/Downloads/velvet-emotion-letter-ux-v1.zip -d ~/Downloads/velvet-tarot

3. 测试：
   git status --short
   npm run check
   npm run build

4. 检查通过后提交：
   git add src/App.tsx src/sections/CardDrawSection.tsx src/lib/analytics.ts
   git commit -m "feat: improve emotion expression and letter flow"
   git push -u origin feature/emotion-letter-ux

## Vercel Preview 验收
1. 塔罗解析后应看到“写一封给自己的信”和“现在不想写”。
2. 点击写信，写入测试文字并封存，应显示“信件已保存到此设备”；点击查看我的信件进入时光信笺。
3. 刷新页面，检查历史信件仍存在。
4. PostHog 同意统计时应产生 `letter_choice`（choice=write/skip）、`letter_compose_open`、`letter_saved`；不应发送正文。
5. 拒绝统计后不再出现新事件；在浏览器 Network 检查没有 /api/trpc/entry.sync 数据上传。

## 限制
- 这是对原有自动云同步路径的局部修复，**不等于整个站点所有请求均已安全审计**。
- 浏览器 localStorage 不是端到端加密存储，清空浏览器数据可能导致信件丢失，也不适合设备共享环境。
- 历史行为数据中多数为开发测试流量，无法作为具有统计效力的转化率基线；建议记录 V1/V2 时间边界及版本。
- 本交付环境无法安装全部依赖，所以没有在这里声称构建通过。请在 Mac 运行检查后再上 Preview。
