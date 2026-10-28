# Velvet Tarot · 埋点 V2（增量修改）

## 已接入的真实行为
- `site_visit` / `site_exit`：在用户同意统计后，记录访问、关闭或导航离开（离开事件可能因浏览器关闭而丢失）。
- `module_open` / `module_close`：四大操作页的进入和离开。`module` 是 draw/crystal/past/index。
- `module_active_time`：页面实际可见时在该模块的累计秒数；切换后台时上报当段时间、恢复后重新计时，退出模块时再次上报。此指标需在 PostHog 求和，而非简单计数。
- `tarot_start` / `tarot_complete`：抽牌模式 `method=gesture|automatic`，完成数 `card_count=4`。
- `tarot_interpretation_view`：查看解读。
- `letter_compose_open` / `letter_saved`：塔罗解读后打开写信弹窗、保存完成（现有写信入口在塔罗页）。
- `weekly_report_view` / `weekly_archive_expand`：进入情绪报告、展开历史周。

## 尚未实现，因此没有虚构的埋点
当前 `CrystalBallSection` 仅展示历史记录，没有“写/不写”选择；`PastMemoriesSection` 仅展示全部信件，不存在独立的“新建未来信件 / 设定开启日期 / 点击打开历史信件”操作；心情图目前没有独立的日期切换控件。上述功能未来真实上线后再增加事件。

## 隐私控制
- 用户未同意前不发送统计事件，拒绝后 `opt_out_capturing`，关闭自动采集、页面自动追踪、会话录制与调查。
- 只允许代码中固定事件及有限的 `module/method/card_count/duration_seconds` 属性；`before_send` 丢弃 SDK 附加的 URL、referrer、浏览器参数等字段，仅保留投递所需的匿名标识及令牌元数据。
- 不记录问题、信件、情绪分数、卡牌身份、邮箱姓名、摄像头画面；PostHog 的匿名标识仍是一种用于统计的可持久化标识。
- 注意原 `App.tsx` 仍有单独的 `trpc.entry.sync` 云同步代码，**它不是 PostHog**；这次未改变该用户数据路径，不能宣称全站绝不会上传私人记录。静态部署该接口可能不可用，需独立检查。

## 配置及测试
1. `npm install && npm run check && npm run build`。在新分支提交，先测试 Vercel Preview。
2. Vercel Preview 需要设置 `VITE_POSTHOG_PROJECT_TOKEN`、`VITE_POSTHOG_HOST` 并重新部署。
3. 在未同意状态检查 Network 无 PostHog `/e` 或 `/batch` 事件 POST；同意后操作四模块检查 PostHog Events。展开事件属性，确认无 `current_url`、`$current_url`、`$pathname`、`question`、`text`、`score`、邮箱等。
4. 进入模块后切换后台数秒再返回，退出模块，验证 `module_active_time` 数值大致符合可见时长。拒绝后再操作验证不新增事件。
5. 只对已同意的样本计算留存；5–6 人、3–7 天的结果主要用于发现可用性问题。
