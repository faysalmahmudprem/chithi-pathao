import LZString from "lz-string";

type SharePayload = {
  name: string;
  message: string;
};

export const encodeShareData = (payload: SharePayload) => {
  const json = JSON.stringify({
    name: payload.name,
    message: payload.message,
  });
  return LZString.compressToEncodedURIComponent(json);
};

export const decodeShareData = (data: string): SharePayload | null => {
  if (!data) return null;
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(data);
    if (!decompressed) return null;
    const parsed = JSON.parse(decompressed) as Partial<SharePayload> | null;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      message: typeof parsed.message === "string" ? parsed.message : "",
    };
  } catch {
    return null;
  }
};
