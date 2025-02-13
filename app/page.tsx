import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center h-screen font-sans">
      <div className="flex items-center">
        {/* Optimized Image */}
        <Image
          src="/images/rainbow.gif"
          alt="Rainbow GIF"
          width={160} // 10rem equivalent
          height={160}
          className="h-auto"
        />
        {/* Text Section */}
        <div className="ml-6" style={{ width: '20rem' }}>
          <h1 className="text-4xl font-extrabold">Spectrum</h1>
          <p className="text-lg mt-2">Modular content platform</p>
        </div>
      </div>
    </div>
  );
}
