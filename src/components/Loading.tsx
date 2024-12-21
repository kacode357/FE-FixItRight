import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/loadingfix.json';

interface LoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({ isLoading, children }) => {
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {/* Hiển thị loading khi isLoading = true */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10,
          }}
        >
          <Lottie animationData={animationData} style={{ height: 200, width: 200 }} />
        </div>
      )}

      {/* Nội dung chính */}
      <div style={{ opacity: isLoading ? 0.5 : 1 }}>{children}</div>
    </div>
  );
};

export default Loading;
