'use client';
import * as React from "react"
import { Button } from "./button";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-lg m-4 border border-gray-200 dark:border-gray-800" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
                    <Button variant="ghost" className="p-1 h-auto" onClick={onClose}><X className="w-5 h-5" /></Button>
                </div>
                <div className="p-6 text-slate-900 dark:text-slate-50">{children}</div>
            </div>
        </div>
    );
};
Modal.displayName = "Modal"
export { Modal }