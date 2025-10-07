"use client";

export function AboutSection() {
    return (
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        About New Technology Center
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Your trusted partner for quality technology products and office supplies
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {/* Mission Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
                        <p className="text-gray-600">
                            To provide high-quality technology products and office supplies that empower businesses
                            and individuals to achieve their goals efficiently.
                        </p>
                    </div>

                    {/* Quality Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Products</h3>
                        <p className="text-gray-600">
                            We carefully curate our collection to ensure every product meets our high standards
                            for quality, durability, and performance.
                        </p>
                    </div>

                    {/* Service Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer First</h3>
                        <p className="text-gray-600">
                            Our dedicated team is committed to providing exceptional service and support
                            to ensure your complete satisfaction.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                        <div className="text-gray-600">Office Products</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-green-600 mb-2">300+</div>
                        <div className="text-gray-600">School Supplies</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-purple-600 mb-2">200+</div>
                        <div className="text-gray-600">Electronics</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-orange-600 mb-2">1000+</div>
                        <div className="text-gray-600">Happy Customers</div>
                    </div>
                </div>

                {/* Contact/Team Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* About the Founder/Team */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Meet the Team</h3>
                            <p className="text-gray-600 mb-6">
                                Founded with a passion for technology and education, New Technology Center
                                has been serving the community with dedication and integrity.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-gray-700">
                                        <span className="font-semibold">Cyusa Chrispin</span> - CREATOR
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h3>
                            <p className="text-gray-600 mb-6">
                                Have questions? We'd love to hear from you. Reach out to us anytime!
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <div className="font-semibold text-gray-900">Email</div>
                                        <a href="mailto:chrispincyusa9@gmail.com" className="text-blue-600 hover:underline">
                                            chrispincyusa9@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <div className="font-semibold text-gray-900">Location</div>
                                        <span className="text-gray-600">Kigali, Rwanda</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}