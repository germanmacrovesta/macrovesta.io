import React from 'react';

const ContactForm = () => {
    return (
        <form className="max-w-md mx-auto">
            <div className="mb-4">
                <label
                    htmlFor="first-name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    First Name
                </label>
                <input
                    type="text"
                    id="first-name"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your first name"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="last-name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Last Name
                </label>
                <input
                    type="text"
                    id="last-name"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your last name"
                />
            </div>
            {/* Add more fields here */}
            <div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default ContactForm;
