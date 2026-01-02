/**
 * Sanitizes user input for use in WhatsApp messages.
 * Removes WhatsApp markdown characters and limits string length.
 */
export function sanitizeForWhatsApp(text: string, maxLength: number = 500): string {
  if (!text) return "";
  
  // Remove WhatsApp markdown characters that could break formatting
  const sanitized = text
    .replace(/[*_~`]/g, "") // Remove markdown characters
    .replace(/[\r\n]+/g, " ") // Replace newlines with spaces to prevent message manipulation
    .trim();
  
  // Limit length to prevent URL length issues
  return sanitized.substring(0, maxLength);
}

/**
 * Builds a safe WhatsApp URL with sanitized form data.
 * Ensures the final URL doesn't exceed safe length limits.
 */
export function buildWhatsAppUrl(
  phoneNumber: string,
  formData: {
    name?: string;
    cakeType?: string;
    occasion?: string;
    servingSize?: string;
    budget?: string;
    timeframe?: string;
    tiers?: string;
    shape?: string;
    customShape?: string;
    flavour?: string;
    otherFlavour?: string;
    filling?: string;
    finish?: string;
    delivery?: string;
    deliveryLocation?: string;
    notes?: string;
  }
): string {
  const sanitize = (text: string | undefined, maxLen: number = 100) => 
    sanitizeForWhatsApp(text || "", maxLen);

  // Build message with sanitized fields
  const messageParts = [
    "Hi Melody! 🎂",
    "",
    "I just submitted an order inquiry on your website. Here are my details:",
    "",
    `Name: ${sanitize(formData.name)}`,
    `Cake Type: ${sanitize(formData.cakeType)}`,
    `Occasion: ${sanitize(formData.occasion)}`,
    `Serving Size: ${sanitize(formData.servingSize)}`,
    `Budget: ${sanitize(formData.budget)}`,
    `Timeframe: ${sanitize(formData.timeframe)}`,
    `Tiers: ${sanitize(formData.tiers)}`,
    `Shape: ${sanitize(formData.shape)}${formData.customShape ? ` (${sanitize(formData.customShape, 50)})` : ""}`,
    `Flavour: ${sanitize(formData.flavour)}${formData.otherFlavour ? ` (${sanitize(formData.otherFlavour, 50)})` : ""}`,
    `Filling: ${sanitize(formData.filling)}`,
    `Finish: ${sanitize(formData.finish)}`,
    `Delivery: ${sanitize(formData.delivery)}`,
  ];

  if (formData.deliveryLocation) {
    messageParts.push(`Delivery Location: ${sanitize(formData.deliveryLocation, 200)}`);
  }

  if (formData.notes) {
    messageParts.push("");
    messageParts.push(`Additional Notes: ${sanitize(formData.notes, 300)}`);
  }

  messageParts.push("");
  messageParts.push("Looking forward to hearing from you! 💜");

  const message = messageParts.join("\n");
  
  // Ensure the encoded URL doesn't exceed safe limits (WhatsApp URLs should be under 2048 chars)
  const encodedMessage = encodeURIComponent(message);
  const baseUrl = `https://wa.me/${phoneNumber}?text=`;
  
  // If URL would be too long, truncate the message
  const maxMessageLength = 2000 - baseUrl.length;
  const finalMessage = encodedMessage.length > maxMessageLength 
    ? encodeURIComponent(message.substring(0, 1500) + "\n\n[Message truncated - please provide more details in chat]")
    : encodedMessage;

  return `${baseUrl}${finalMessage}`;
}
