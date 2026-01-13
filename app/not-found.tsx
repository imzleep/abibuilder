import Link from 'next/link'

export const runtime = 'edge';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
            <h2 className="text-4xl font-bold mb-4 font-orbitron text-primary">404 - Not Found</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">Could not find requested resource. It might have been deleted or moved.</p>
            <Link href="/" className="px-6 py-3 bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors">
                Return Home
            </Link>
        </div>
    )
}
