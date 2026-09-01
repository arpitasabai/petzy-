/* International Phone Number Input Component with Global Country Codes & Flags */

export const COUNTRY_CODES = [
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼' },
  { code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲' },
  { code: 'BH', name: 'Bahrain', dial: '+973', flag: '🇧🇭' },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
  { code: 'LK', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', dial: '+977', flag: '🇳🇵' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', dial: '+51', flag: '🇵🇪' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮' },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱' },
  { code: 'GR', name: 'Greece', dial: '+30', flag: '🇬🇷' },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' },
  { code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦' },
  { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱' },
  { code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷' },
  { code: 'HK', name: 'Hong Kong', dial: '+852', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwan', dial: '+886', flag: '🇹🇼' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' }
];

/**
 * Parse an existing phone string into country code and local number
 */
export function splitPhoneNumber(rawPhone) {
  if (!rawPhone) return { dial: '+91', number: '' };
  const str = String(rawPhone).trim();

  // Try matching known dial codes (sort by length descending to match +971 before +9)
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (str.startsWith(c.dial)) {
      const rest = str.slice(c.dial.length).trim();
      return { dial: c.dial, number: rest };
    }
  }

  // Generic plus prefix
  const plusMatch = str.match(/^(\+\d{1,4})\s*(.*)$/);
  if (plusMatch) {
    return { dial: plusMatch[1], number: plusMatch[2] };
  }

  return { dial: '+91', number: str };
}

/**
 * Render an international phone input HTML string with country selector
 */
export function renderIntlPhoneInput({
  id = 'user-phone',
  countrySelectId = null,
  name = 'phone',
  value = '',
  required = true,
  placeholder = 'Enter phone number'
} = {}) {
  const cSelectId = countrySelectId || `${id}-country`;
  const parsed = splitPhoneNumber(value);

  const optionsHtml = COUNTRY_CODES.map(c => {
    const isSelected = (c.dial === parsed.dial);
    return `<option value="${c.dial}" ${isSelected ? 'selected' : ''}>${c.flag} ${c.dial} (${c.code})</option>`;
  }).join('');

  return `
    <div class="intl-phone-wrapper">
      <select id="${cSelectId}" class="intl-country-select" aria-label="Country Dial Code" title="Select Country Code">
        ${optionsHtml}
      </select>
      <input
        type="tel"
        id="${id}"
        name="${name}"
        class="form-input intl-phone-field"
        placeholder="${placeholder}"
        value="${parsed.number || ''}"
        ${required ? 'required' : ''}
        autocomplete="tel-national"
      >
    </div>
  `;
}

/**
 * Get full formatted international phone number from the input elements
 */
export function getIntlPhoneValue(phoneInputId, countrySelectId = null) {
  const pInput = document.getElementById(phoneInputId);
  if (!pInput) return '';
  const cSelect = document.getElementById(countrySelectId || `${phoneInputId}-country`);
  const dial = cSelect ? cSelect.value : '';
  const num = pInput.value.trim();
  if (!num) return '';
  if (dial) {
    return `${dial} ${num}`;
  }
  return num;
}
