import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Granted AI — AI Grant Writing Tool'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0A1628 0%, #152238 50%, #0A1628 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Accent circles */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(245, 207, 73, 0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(245, 207, 73, 0.06)',
          }}
        />

        {/* Gold rule */}
        <div
          style={{
            width: 80,
            height: 4,
            background: '#F5CF49',
            borderRadius: 2,
            marginBottom: 32,
          }}
        />

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 700,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: 900,
            letterSpacing: '-0.02em',
          }}
        >
          Granted AI
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            marginTop: 16,
            maxWidth: 700,
          }}
        >
          AI Grant Writing Tool — Draft Proposals in Hours
        </div>

        {/* Gold rule bottom */}
        <div
          style={{
            width: 80,
            height: 4,
            background: '#F5CF49',
            borderRadius: 2,
            marginTop: 32,
          }}
        />

        {/* URL */}
        <div
          style={{
            display: 'flex',
            fontSize: 18,
            color: 'rgba(245, 207, 73, 0.7)',
            marginTop: 24,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
          }}
        >
          grantedai.com
        </div>
      </div>
    ),
    { ...size }
  )
}
