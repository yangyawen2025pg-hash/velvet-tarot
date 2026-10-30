# Velvet Tarot AI 解析前端接入 V1

1. `git switch main && git pull origin main && git switch -c feature/ai-tarot-reading`
2. 解压此 ZIP 到项目根目录；从项目根目录运行 `python3 apply_ai_patch.py`
3. `npm run check && npm run build`
4. 只提交 `src/components/AiTarotReading.tsx`、`src/sections/CardDrawSection.tsx`、`src/lib/analytics.ts`，以及必要的 README。
5. 在 Vercel Project Settings > Environment Variables 添加公开的 `VITE_TURNSTILE_SITE_KEY`（不是 Turnstile Secret）。Vite 构建时读取，添加后需要重新部署。
6. 注意：当前 Worker 只允许 `https://velvet-tarot.vercel.app` 和 Turnstile 同一 hostname。**预览域名不被允许**，因此 Preview 只能检查 UI 和关闭状态，不能测试真实 AI 调用。真正端到端测试前，要为测试环境配置明确允许的预览域名和 Turnstile hostname，或使用正式域名进行受控测试。
7. 直到验证 D1 原子限额、防刷能力、API 调用账单前保持 `AI_ENABLED=false`。不要把 DEEPSEEK_API_KEY 或 TURNSTILE_SECRET 放入前端环境变量。
8. 本补丁不会自动把 AI 结果存到历史信件，也不会把问题或结果发送给 PostHog。
9. 风险：此 Worker 当前只有每日全站总配额，没有单个访问者的频率限制。正式开放前应增加 Cloudflare Rate Limiting 等防滥用措施。D1 额度是调用次数上限，不是美元支出硬上限。
10. 注意：更改问题后旧 AI 结果不会自动重算。建议每轮问好问题再抽牌，并在后续版本为问题编辑添加重置逻辑。
