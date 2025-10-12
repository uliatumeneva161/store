import React from 'react'
import { Link } from 'react-router-dom'

const Categors: React.FC = () => {
    return (
        <div className="bg-gray-light border-gray-medium border-t mt-auto">
            <div className="container mx-auto px-4 py-8">
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-main bg-clip-text mb-6">
                        Категории
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Object.entries({
                            'Телефоны': 'https://i.pinimg.com/736x/0e/f3/01/0ef301e5a6993f668bb723859c08ed96.jpg',
                            'Ноутбуки': 'https://i.pinimg.com/1200x/09/51/ee/0951ee936783e1d82dcdc6a452b7088a.jpg',
                            'Мониторы': 'https://i.pinimg.com/1200x/c8/93/ef/c893efb3660f21ed3f1a5a472b945570.jpg',
                            'Карты памяти': 'https://i.pinimg.com/1200x/1a/b7/7f/1ab77fde2b568850512745a8873b35cd.jpg',
                            'Аксессуары': 'https://i.pinimg.com/1200x/37/15/73/371573cf82304303a55bc56695fe005e.jpg',
                            'Наушники': 'https://i.pinimg.com/1200x/68/30/84/683084dae1575d55c8482d83456616dc.jpg'
                        }).map(([category, img]) => (
                            <Link
                                key={category}
                                to={`/products?category=${encodeURIComponent(category)}`}
                                className="text-center shadow-neon hover:shadow-neon-hover hover:scale-105 transition-all duration-300 bg-white rounded-lg overflow-hidden flex flex-col h-48"
                            >
                                <div className="flex-1 relative overflow-hidden">
                                    <img
                                        src={img}
                                        alt={category}
                                        className="w-full h-full object-cover absolute inset-0"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                        <h3 className="font-semibold text-white text-sm px-2 py-1 bg-black bg-opacity-50 rounded">
                                            {category}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )

}

export default Categors