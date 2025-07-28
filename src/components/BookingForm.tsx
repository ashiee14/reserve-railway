import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeft, User, Calendar, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { Train } from '../types'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface BookingFormData {
  passengerName: string
  passengerAge: number
  passengerGender: string
}

interface BookingFormProps {
  train: Train
  travelDate: string
  onBack: () => void
  onBookingComplete: () => void
}

export function BookingForm({ train, travelDate, onBack, onBookingComplete }: BookingFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>()

  const onSubmit = async (data: BookingFormData) => {
    if (!user) return
    
    setLoading(true)
    setError('')

    try {
      // Generate seat number (simplified)
      const seatNumber = `S${Math.floor(Math.random() * train.total_seats) + 1}`
      
      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          train_id: train.id,
          passenger_name: data.passengerName,
          passenger_age: data.passengerAge,
          passenger_gender: data.passengerGender,
          seat_number: seatNumber,
          travel_date: travelDate,
          amount: train.price,
          status: 'confirmed'
        })

      if (bookingError) throw bookingError

      // Update available seats
      const { error: updateError } = await supabase
        .from('trains')
        .update({ available_seats: train.available_seats - 1 })
        .eq('id', train.id)

      if (updateError) throw updateError

      onBookingComplete()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Book Your Ticket</h2>
        </div>

        {/* Train Details */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-lg text-blue-900 mb-2">
            {train.train_name} ({train.train_number})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">From: <span className="font-medium">{train.source_station}</span></p>
              <p className="text-blue-700">Departure: <span className="font-medium">{train.departure_time}</span></p>
            </div>
            <div>
              <p className="text-blue-700">To: <span className="font-medium">{train.destination_station}</span></p>
              <p className="text-blue-700">Arrival: <span className="font-medium">{train.arrival_time}</span></p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center text-blue-700">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Travel Date: {format(new Date(travelDate), 'PPP')}</span>
            </div>
            <div className="flex items-center text-blue-900 font-semibold">
              <CreditCard className="h-4 w-4 mr-1" />
              <span>₹{train.price}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Passenger Details Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Passenger Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  {...register('passengerName', { required: 'Passenger name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter passenger full name"
                />
                {errors.passengerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.passengerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  {...register('passengerAge', { 
                    required: 'Age is required',
                    min: { value: 1, message: 'Age must be at least 1' },
                    max: { value: 120, message: 'Age must be less than 120' }
                  })}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Age"
                />
                {errors.passengerAge && (
                  <p className="text-red-500 text-sm mt-1">{errors.passengerAge.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  {...register('passengerGender', { required: 'Gender is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.passengerGender && (
                  <p className="text-red-500 text-sm mt-1">{errors.passengerGender.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Fare</span>
                <span>₹{train.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>₹0</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>₹{train.price}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Search
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}