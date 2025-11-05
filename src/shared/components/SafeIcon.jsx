import React from 'react'
import logger from '@shared/utils/logger'

const SafeIcon = ({ svgHtml, className = '' }) => {
  const iconRef = React.useRef(null)

  React.useEffect(() => {
    if (!svgHtml || !iconRef.current) return;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgHtml, 'image/svg+xml');

      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        logger.error('SVG parsing error:', parserError.textContent);
        return;
      }

      iconRef.current.innerHTML = '';

      const svgElement = doc.documentElement;
      if (svgElement && svgElement.tagName === 'svg') {
        svgElement.removeAttribute('onload');
        svgElement.removeAttribute('onerror');
        svgElement.removeAttribute('onclick');
        iconRef.current.appendChild(svgElement);
      }
    } catch (error) {
      logger.error('Error rendering SVG icon:', error);
    }
  }, [svgHtml]);

  return <span ref={iconRef} className={className} />;
};

export default SafeIcon;
