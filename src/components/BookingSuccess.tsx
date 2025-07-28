import React from 'react'
import { CheckCircle, Download, ArrowLeft } from 'lucide-react'

interface BookingSuccessProps {
  onBackToSearch: () => void
}

export function BookingSuccess({ onBackToSearch }: BookingSuccessProps) {
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your train ticket has been successfully booked. You will receive a confirmation email shortly.
        </p>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </button>
          
          <button
            onClick={onBackToSearch}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </button>
        </div>
      </div>
    </div>
  )
}