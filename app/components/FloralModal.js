import React from 'react'
import Image from 'next/image'

export function FloralModal({ onClose }) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] max-w-4xl relative p-4 md:p-6">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-black text-2xl md:text-3xl"
                >
                    &times;
                </button>
                <div className="flex flex-">
                    <div className="md:w-full">
                        <Image
                            src="/flower.avif" // Replace with actual image path
                            width={500}
                            height={300}
                            className="w-full h-auto"
                            alt="Floral arrangement"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <div className="md:w-1/2 p-2 md:p-4">
                        <h1 className="text-primary text-2xl md:text-3xl font-bold">
                            Fresh Natural Flowers
                        </h1>
                        <div className="w-16 h-1 bg-secondary mt-2"></div>
                        <p className="text-black mt-4">
                            At Gig Cottage, we specialize in creating stunning floral arrangements for all occasions. Our experienced florists craft beautiful wreaths, bouquets, and arrangements that add elegance and beauty to any event.
                        </p>
                        <h2 className="text-primary mt-6 text-xl md:text-2xl">
                            Our Floral Services:
                        </h2>
                        <ul className="list-disc list-inside mt-2 text-black">
                            <li>Custom wedding bouquets and arrangements</li>
                            <li>Memorial and sympathy wreaths</li>
                            <li>Event and venue floral decorations</li>
                            <li>Corporate flower arrangements</li>
                            <li>Seasonal and holiday designs</li>
                        </ul>
                        <h2 className="text-primary mt-6 text-xl md:text-2xl">
                            Contact Us for Floral Services
                        </h2>
                        <p className="text-black mt-2">
                            Call us at 025 744 1441 to discuss your floral needs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}