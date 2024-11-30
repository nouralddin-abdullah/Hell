// expr to detect language 
const ARABIC_PATTERN = /[\u0600-\u06FF\u0750-\u077F]/;
const ENGLISH_PATTERN = /[a-zA-Z]/;

// has arabic? 
const hasArabic = (text: string): boolean => {
  return ARABIC_PATTERN.test(text);
};

// has english?
const hasEnglish = (text: string): boolean => {
  return ENGLISH_PATTERN.test(text);
};

// words english near arabic and el 3akc
const wrapIsolatedWords = (text: string): string => {
    return text.split(/\s+/).map(word => {
      // Remove surrounding punctuation for better detection
      const cleanWord = word.replace(/^[^\w]+|[^\w]+$/g, '');
  
      if (hasEnglish(cleanWord) && !hasArabic(cleanWord)) {
        return `\u200E${word}`;
      }
      if (hasArabic(cleanWord) && !hasEnglish(cleanWord)) {
        return `\u200F${word}`;
      }
      return word;
    }).join(' ');
  };
  

//formating the kosm el string
export const formatBidirectionalText = (text: string): {
  formattedText: string;
  direction: 'rtl' | 'ltr';
} => {
  const hasArabicText = hasArabic(text);
  const hasEnglishText = hasEnglish(text);

  // base direction
  const direction = hasArabicText ? 'rtl' : 'ltr';
  
  // text based on content
  if (hasArabicText && hasEnglishText) {
    // mixed content - wrap isolated words
    return {
      formattedText: wrapIsolatedWords(text),
      direction
    };
  }

  // single language content
  return {
    formattedText: text,
    direction
  };
};
