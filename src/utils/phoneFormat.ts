export function formatPhoneForWhatsApp(phone: string | number | null | undefined): string {
  // Null veya undefined kontrolü
  if (!phone) {
    return '';
  }

  // Sayı tipini stringe çevir
  const phoneStr = String(phone);

  // Boşlukları ve özel karakterleri temizle
  const cleaned = phoneStr.replace(/\s+/g, '').replace(/[^\d+]/g, '');
  
  // Sadece + yoksa ekle
  if (!cleaned.startsWith('+')) {
    return '+' + cleaned;
  }
  
  return cleaned;
}