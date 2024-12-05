export function generateVCF(contacts: Array<{name: string; lastname: string; phone: string}>) {
  let vcf = '';
  contacts.forEach(contact => {
    vcf += 'BEGIN:VCARD\n';
    vcf += 'VERSION:3.0\n';
    vcf += `FN:${contact.name} ${contact.lastname}\n`;
    vcf += `N:${contact.lastname};${contact.name};;;\n`;
    vcf += `TEL;TYPE=CELL:${contact.phone}\n`;
    vcf += 'END:VCARD\n';
  });
  return vcf;
}

export function downloadVCF(vcfContent: string, filename: string = 'contacts.vcf') {
  const blob = new Blob([vcfContent], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}