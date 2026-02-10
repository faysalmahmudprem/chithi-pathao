type SharePayload = {
  name: string;
  message: string;
};

export const encodeShareData = (payload: SharePayload) => {
  const json = JSON.stringify({
    name: payload.name,
    message: payload.message,
  });
  const utf8 = unescape(encodeURIComponent(json));
  return btoa(utf8);
};

export const decodeShareData = (data: string): SharePayload | null => {
  if (!data) return null;
  try {
    const json = decodeURIComponent(escape(atob(data)));
    const parsed = JSON.parse(json) as Partial<SharePayload> | null;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      message: typeof parsed.message === "string" ? parsed.message : "",
    };
  } catch {
    return null;
  }
};
