import { useState } from 'react';
import { getAnalyticsConsent, setAnalyticsConsent } from '@/lib/analytics';

/** Visitors can decline analytics or change their choice anytime. */
export default function AnalyticsConsent() {
  const [choice, setChoice] = useState(getAnalyticsConsent);
  const [showPreferences, setShowPreferences] = useState(false);
  const visible = choice === 'unset' || showPreferences;
  const choose = (allow: boolean) => {
    setAnalyticsConsent(allow);
    setChoice(allow ? 'granted' : 'denied');
    setShowPreferences(false);
  };
  return (
    <>
      {visible && (
        <aside aria-label="匿名使用统计设置" className="fixed z-[11000] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md rounded-2xl border border-dusty-rose/30 bg-pearl p-5 shadow-2xl text-ink">
          <p className="font-heading font-semibold text-base mb-2">匿名使用统计</p>
          <p className="text-sm leading-relaxed mb-4">
            经你同意后，我们会使用随机匿名标识统计模块使用次数、完成率、有效停留时长和回访情况，以改善体验。
            我们不会将你的信件、塔罗问题、情绪记录或摄像头画面发送给统计平台。
            拒绝不会影响网站功能，你也可以随时修改选择。
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={() => choose(false)} className="flex-1 rounded-lg border border-dusty-rose/40 px-3 py-2 text-sm">拒绝</button>
            <button type="button" onClick={() => choose(true)} className="flex-1 rounded-lg bg-ink px-3 py-2 text-pearl text-sm">同意匿名统计</button>
          </div>
        </aside>
      )}
      {!visible && (
        <button type="button" onClick={() => setShowPreferences(true)} className="fixed z-[9000] bottom-3 left-3 rounded-full bg-pearl/95 border border-dusty-rose/30 px-3 py-1.5 text-xs text-ink shadow" aria-label="修改匿名统计设置">
          隐私设置
        </button>
      )}
    </>
  );
}
