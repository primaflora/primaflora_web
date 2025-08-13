/**
 * Утилиты для транслитерации текста
 */

// Карта транслитерации кириллицы в латиницу
const transliterationMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
  
  // Украинские буквы
  'ґ': 'g', 'є': 'ye', 'і': 'i', 'ї': 'yi',
  'Ґ': 'G', 'Є': 'Ye', 'І': 'I', 'Ї': 'Yi',
  
  // Пробелы и специальные символы
  ' ': '_', '-': '_', '.': '.', '_': '_'
};

/**
 * Транслитерация текста с кириллицы на латиницу
 */
export const transliterate = (text: string): string => {
  return text
    .split('')
    .map(char => transliterationMap[char] || char)
    .join('')
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Заменяем все неподдерживаемые символы на подчеркивания
    .replace(/_+/g, '_') // Убираем множественные подчеркивания
    .replace(/^_|_$/g, ''); // Убираем подчеркивания в начале и конце
};

/**
 * Транслитерация имени файла с сохранением расширения
 */
export const transliterateFileName = (fileName: string): string => {
  // Разделяем имя файла и расширение
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return transliterate(fileName);
  }
  
  const name = fileName.substring(0, lastDotIndex);
  const extension = fileName.substring(lastDotIndex);
  
  return transliterate(name) + extension;
};

/**
 * Проверяет, содержит ли строка кириллические символы
 */
export const hasCyrillic = (text: string): boolean => {
  return /[а-яё]/i.test(text);
};

/**
 * Безопасное отображение имени файла - показывает оригинальное имя,
 * но при необходимости может показать транслитерированную версию
 */
export const getSafeFileName = (originalName: string, showTransliterated: boolean = false): string => {
  if (showTransliterated && hasCyrillic(originalName)) {
    return transliterate(originalName);
  }
  return originalName;
};

/**
 * Создает безопасное имя файла для загрузки
 */
export const createSafeFileName = (originalName: string): string => {
  if (!hasCyrillic(originalName)) {
    return originalName;
  }
  
  return transliterateFileName(originalName);
};

/**
 * Примеры транслитерации для тестирования
 */
export const getTransliterationExamples = () => {
  return [
    { original: 'тест.jpg', transliterated: transliterateFileName('тест.jpg') },
    { original: 'моя фотография.png', transliterated: transliterateFileName('моя фотография.png') },
    { original: 'файл-123.jpeg', transliterated: transliterateFileName('файл-123.jpeg') },
    { original: 'Привет мир!.gif', transliterated: transliterateFileName('Привет мир!.gif') },
    { original: 'україна.webp', transliterated: transliterateFileName('україна.webp') }
  ];
};
