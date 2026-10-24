"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

// Shown if room data can't be loaded (for example a brief internet outage).
// Error pages aren't cached, so the real page returns as soon as the connection does.
const messages = [
  { lang: "en", title: "We couldn't load this page", text: "Please check your connection and try again.", retry: "Try again" },
  { lang: "km", title: "មិនអាចបើកទំព័រនេះបានទេ", text: "សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត ហើយព្យាយាមម្តងទៀត។", retry: "ព្យាយាមម្តងទៀត" },
  { lang: "zh", title: "页面暂时无法加载", text: "请检查网络连接后重试。", retry: "重试" },
];

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const { lang } = useParams<{ lang: string }>();
  const t = messages.find((m) => m.lang === lang) ?? messages[0];

  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">L2 Angkor</p>
      <h1 className="display mt-5 text-4xl sm:text-5xl">{t.title}</h1>
      <p className="mt-3 max-w-md">{t.text}</p>
      <button type="button" onClick={() => retry()} className="btn btn-dark mt-10">
        {t.retry}
      </button>
    </section>
  );
}
