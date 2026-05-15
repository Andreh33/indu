import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Industrial Fighters · De donde venimos se lucha cada día';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#050505',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 70,
          fontFamily: 'system-ui, sans-serif',
          color: '#FAFAF7',
          position: 'relative',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontSize: 18,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#9F9C8E',
            display: 'flex',
          }}
        >
          INDUSTRIAL FIGHTERS · EST. 2019
        </div>

        {/* Slogan */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 110,
            lineHeight: 0.92,
            letterSpacing: -2,
            fontWeight: 900,
            textTransform: 'uppercase',
          }}
        >
          <span>De donde venimos</span>
          <span>
            se lucha{' '}
            <span style={{ color: '#ED2939' }}>cada día.</span>
          </span>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 16,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#7A7768',
          }}
        >
          <span>Equipamiento de combate · Hecho a mano</span>
          <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span
              style={{
                width: 10,
                height: 10,
                background: '#ED2939',
                display: 'flex',
              }}
            />
            INDUSTRIALFIGHTERS.COM
          </span>
        </div>
      </div>
    ),
    size,
  );
}
