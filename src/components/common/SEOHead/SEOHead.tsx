import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  defaultTitle?: string;
  defaultDescription?: string;
}

export const SEOHead = ({ 
  title, 
  description, 
  defaultTitle = "Primaflora", 
  defaultDescription = "Інтернет-магазин добавок" 
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Устанавливаем title
    const finalTitle = title || defaultTitle;
    document.title = finalTitle;
    
    // Устанавливаем или обновляем meta description
    const finalDescription = description || defaultDescription;
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    
    if (metaDescription) {
      metaDescription.setAttribute('content', finalDescription);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = finalDescription;
      document.getElementsByTagName('head')[0].appendChild(metaDescription);
    }

    // Устанавливаем или обновляем Open Graph теги
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (ogTitle) {
      ogTitle.setAttribute('content', finalTitle);
    } else {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.content = finalTitle;
      document.getElementsByTagName('head')[0].appendChild(ogTitle);
    }

    let ogDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (ogDescription) {
      ogDescription.setAttribute('content', finalDescription);
    } else {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.content = finalDescription;
      document.getElementsByTagName('head')[0].appendChild(ogDescription);
    }

    // Twitter Card теги
    let twitterTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement;
    if (twitterTitle) {
      twitterTitle.setAttribute('content', finalTitle);
    } else {
      twitterTitle = document.createElement('meta');
      twitterTitle.name = 'twitter:title';
      twitterTitle.content = finalTitle;
      document.getElementsByTagName('head')[0].appendChild(twitterTitle);
    }

    let twitterDescription = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement;
    if (twitterDescription) {
      twitterDescription.setAttribute('content', finalDescription);
    } else {
      twitterDescription = document.createElement('meta');
      twitterDescription.name = 'twitter:description';
      twitterDescription.content = finalDescription;
      document.getElementsByTagName('head')[0].appendChild(twitterDescription);
    }

  }, [title, description, defaultTitle, defaultDescription]);

  return null; // Этот компонент не рендерит ничего визуального
};