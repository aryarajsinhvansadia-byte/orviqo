/**
 * Native bridge helpers.
 *
 * orviqo.net runs both as a normal website and inside the ORVIQO app shell.
 * Everything here is lazily imported so web visitors never download the
 * native plugin code, and every call degrades to a sensible web fallback.
 */

let nativeChecked = false;
let isNative = false;

export async function checkNative(): Promise<boolean> {
  if (nativeChecked) return isNative;
  nativeChecked = true;
  try {
    const { Capacitor } = await import("@capacitor/core");
    isNative = Capacitor.isNativePlatform();
  } catch {
    isNative = false;
  }
  return isNative;
}

/** A short tap of feedback. Silent on the web. */
export async function tap(): Promise<void> {
  if (!(await checkNative())) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {}
}

/**
 * Share via the OS sheet in the app, the Web Share API where available,
 * and clipboard as a last resort. Returns how it was handled.
 */
export async function share(opts: {
  title: string;
  text?: string;
  url: string;
}): Promise<"native" | "web" | "copied" | "failed"> {
  if (await checkNative()) {
    try {
      const { Share } = await import("@capacitor/share");
      await Share.share({
        title: opts.title,
        text: opts.text,
        url: opts.url,
        dialogTitle: "Share",
      });
      return "native";
    } catch {
      /* fall through to web */
    }
  }

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: opts.title, text: opts.text, url: opts.url });
      return "web";
    } catch {
      return "failed";
    }
  }

  try {
    await navigator.clipboard.writeText(opts.url);
    return "copied";
  } catch {
    return "failed";
  }
}

/**
 * Ask for notification permission and register the device.
 * Only ever runs inside the app; the web is left alone.
 */
export async function registerPush(
  onToken?: (token: string) => void
): Promise<boolean> {
  if (!(await checkNative())) return false;
  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    const status = await PushNotifications.checkPermissions();
    let granted = status.receive === "granted";
    if (!granted) {
      const asked = await PushNotifications.requestPermissions();
      granted = asked.receive === "granted";
    }
    if (!granted) return false;

    if (onToken) {
      await PushNotifications.addListener("registration", (t) => onToken(t.value));
    }
    await PushNotifications.register();
    return true;
  } catch {
    return false;
  }
}
