import React, { useState, useEffect, RefObject } from 'react';

interface DistributorModalProps {
  productsRef: RefObject<HTMLDivElement>;
  footerRef: RefObject<HTMLDivElement>;
}

const DistributorModal: React.FC<DistributorModalProps> = ({ productsRef, footerRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
  const [hasShownForProducts, setHasShownForProducts] = useState(false);
  const [hasShownForFooter, setHasShownForFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (productsRef.current && !hasShownForProducts) {
        const rect = productsRef.current.getBoundingClientRect();
        const isAtBottom = rect.bottom <= window.innerHeight;
        if (isAtBottom && !isVisible) {
          setIsVisible(true);
          setHasShownForProducts(true);
        }
      }
      if (footerRef.current && !hasShownForFooter) {
        const rect = footerRef.current.getBoundingClientRect();
        const isAtBottom = rect.bottom <= window.innerHeight;
        if (isAtBottom && !isVisible) {
          setIsVisible(true);
          setHasShownForFooter(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [productsRef, footerRef, isVisible, hasShownForProducts, hasShownForFooter]);

  const handleYesClick = () => {
    const message = encodeURIComponent("Hi, I'm interested in becoming a distributor for your premium bakery products. Can we discuss details?");
    const whatsappUrl = `https://wa.me/918111928999?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setIsVisible(false);
  };

  const handleNoClick = () => {
    setIsClosing(true);
    setHasBeenDismissed(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleNoClick();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className={`bg-[#F8F1E9] rounded-lg p-8 max-w-md w-full mx-4 shadow-xl transform transition-all duration-300 ease-out ${
          isClosing ? 'animate-fadeOut' : ''
        }`}
        style={{
          fontFamily: 'Arial, sans-serif',
          animation: isClosing ? 'fadeOut 0.3s ease-in forwards' : 'fadeIn 0.3s ease-out'
        }}
      >
        <h2
          id="modal-title"
          className="text-2xl font-bold text-gray-800 mb-4 text-center"
        >
          Ready to Partner with Us?
        </h2>
        <p
          id="modal-description"
          className="text-gray-600 mb-6 text-center leading-relaxed"
        >
          Become an exclusive distributor for our premium bakery products and grow your business with delicious, high-quality treats. Interested?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleYesClick}
            className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 flex items-center justify-center gap-2"
            aria-label="Click here to message on WhatsApp"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
            </svg>
            Click Here to Message
          </button>
          <button
            onClick={handleNoClick}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            aria-label="No thanks, close the modal"
          >
            No Thanks
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};

export default DistributorModal;
