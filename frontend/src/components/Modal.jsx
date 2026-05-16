import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`
        relative bg-white border border-slate-200 shadow-2xl w-full
        ${wide ? 'max-w-2xl' : 'max-w-md'}
        max-h-[92vh] overflow-y-auto
      `}>
        {/* Top gradient accent */}
        <div style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }} className="h-1 w-full" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
