import React, { useState } from 'react'
import { X, User, Calendar } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import { Booking, Train } from '../types'

interface BookingWithTrain extends Booking {
  trains: Train
}

interface EditBookingModalProps {
  booking: BookingWithTrain
  onClose: () => void
  onSave: () => void
}

interface EditFormData {
  passengerName: string
  passengerAge: number
  passengerGender: string
  travelDate: string
}

export function EditBookingModal({ booking, onClose, onSave }: EditBookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register, handleSubmit, formState: { errors } } = useForm<EditFormData>({
    defaultValues: {
      passengerName: booking.passenger_name,
      passengerAge: booking.passenger_age,
      passengerGender: booking.passenger_gender,
      travelDate: booking.travel_date
    }
  })

  const onSubmit = async (data: EditFormData) => {
    setLoading(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          passenger_name: data.passengerName,
          passenger_age: data.passengerAge,
          passenger_gender: data.passengerGender,
          travel_date: data.travelDate
        })
        .eq('id', booking.id)

      if (updateError) throw updateError
      onSave()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Edit Booking</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Train Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">
              {booking.trains.train_name} ({booking.trains.train_number})
            </h4>
            <p className="text-sm text-blue-700">
              {booking.trains.source_station} → {booking.trains.destination_station}
            </p>
            <p className="text-sm text-blue-700">
              {booking.trains.departure_time} - {booking.trains.arrival_time}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Passenger Name
              </label>
              <input
                {...register('passengerName', { required: 'Passenger name is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.passengerName && (
                <p className="text-red-500 text-sm mt-1">{errors.passengerName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  {...register('passengerAge', { 
                    required: 'Age is required',
                    min: { value: 1, message: 'Age must be at least 1' },
                    max: { value: 120, message: 'Age must be less than 120' }
                  })}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.passengerAge && (
                  <p className="text-red-500 text-sm mt-1">{errors.passengerAge.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  {...register('passengerGender', { required: 'Gender is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.passengerGender && (
                  <p className="text-red-500 text-sm mt-1">{errors.passengerGender.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Travel Date
              </label>
              <input
                {...register('travelDate', { required: 'Travel date is required' })}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.travelDate && (
                <p className="text-red-500 text-sm mt-1">{errors.travelDate.message}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}