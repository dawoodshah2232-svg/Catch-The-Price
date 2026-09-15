import { ImageResponse } from 'next/og';
import logo from '../public/images/logo.png';

export const size = {
  width: 128,
  height: 128,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '128px',
          height: '128px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          background: '#071015',
          borderRadius: '24px',
        }}
      >
        <img
          src={logo.src}
          width="610"
          height="223"
          alt=""
          style={{
            position: 'absolute',
            left: '-20px',
            top: '-37px',
            maxWidth: 'none',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
