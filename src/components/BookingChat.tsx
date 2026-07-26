"use client";

import { useEffect, useRef } from "react";

/**
 * ORVIQO's booking assistant, embedded from the n8n workflow that actually
 * writes to the calendar. Loaded from a CDN on mount so it never blocks the
 * page, and themed to the ORVIQO palette via the widget's CSS variables.
 */
const WEBHOOK_URL =
  "https://orviqo.app.n8n.cloud/webhook/0e614cff-6c48-46e3-a8bf-6906d718c326/chat";

export default function BookingChat() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      createChat({
        webhookUrl: '${WEBHOOK_URL}',
        target: '#orviqo-chat',
        mode: 'fullscreen',
        showWelcomeScreen: false,
        initialMessages: [
          'Hello — I am ORVIQO\\'s assistant.',
          'Tell me about your business and what you would like to build. I can book you a free consultation right here.'
        ],
        i18n: {
          en: {
            title: '',
            subtitle: '',
            footer: '',
            getStarted: 'Start a conversation',
            inputPlaceholder: 'Tell me about your business…',
            closeButtonTooltip: 'Close'
          }
        }
      });
    `;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="orviqo-chat"
      className="orviqo-chat h-[68vh] min-h-[520px] w-full overflow-hidden rounded-[4px] border border-hairline"
    />
  );
}
