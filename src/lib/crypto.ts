export function generateRandomString(options?: {
  length?: number;
  characters?: string;
}) {
  const {
    length = 10,
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  } = options ?? {};

  return Array.from({ length })
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join("");
}

export function uint8ArrayToBase64(uint8Array: Uint8Array) {
  const binaryString = Array.from(uint8Array, (byte) =>
    String.fromCharCode(byte)
  ).join("");

  const result = btoa(binaryString); // Convert binary string to

  return result;
}

export function base64ToUint8Array(base64String: string) {
  const binaryString = atob(base64String); // Decode Base64 to binary string

  const result = new Uint8Array(
    [...binaryString].map((char) => char.charCodeAt(0))
  );

  return result;
}
