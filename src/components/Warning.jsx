'use client'
import React from "react";

const Warning = ({ message }) => {
    return (
        <div className="flex items-center p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg" role="alert">
            <svg
                aria-hidden="true"
                className="flex-shrink-0 w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 4a1 1 0 012 0v4a1 1 0 01-2 0V4zm0 8a1 1 0 100 2h2a1 1 0 000-2H9z"
                    clipRule="evenodd"
                />
            </svg>
            <span className="font-medium">{message}</span>
        </div>
    );
};

export default Warning;
