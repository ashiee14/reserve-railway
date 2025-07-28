import React, { useState, useEffect } from 'react'
import { Search, MapPin, Clock, Users, IndianRupee } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import { Train } from '../types'

interface SearchFormData {
  from: string
  to: string
  date: string
}

interface TrainSearchProps {
  onBookTrain: (train: Train, travelDate: string) => void
}

export function TrainSearch({ onBookTrain }: TrainSearchProps) {
  const [trains, setTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>()

  const onSubmit = async (data: SearchFormData) => {
    setLoading(true)
    setSearchPerformed(true)
    
    try {
      const { data: trainsData, error } = await supabase
        .from('trains')
        .select('*')
        .ilike('source_station', `%${data.from}%`)
        .ilike('destination_station', `%${data.to}%`)
        .order('departure_time')

      if (error) throw error
      setTrains(trainsData || [])
    } catch (error) {
      console.error('Error searching trains:', error)
      setTrains([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Search className="mr-3 h-6 w-6 text-blue-600" />
          Search Trains
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                {...register('from', { required: 'Source station is required' })}
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Source station"
              />
            </div>
            {errors.from && (
              <p className="text-red-500 text-sm mt-1">{errors.from.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                {...register('to', { required: 'Destination station is required' })}
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Destination station"
              />
            </div>
            {errors.to && (
              <p className="text-red-500 text-sm mt-1">{errors.to.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Date
            </label>
            <input
              {...register('date', { required: 'Travel date is required' })}
              type="date"
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Searching...' : 'Search Trains'}
            </button>
          </div>
        </form>
      </div>

      {searchPerformed && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching for trains...</p>
            </div>
          ) : trains.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No trains found for your search criteria.</p>
            </div>
          ) : (
            trains.map((train) => (
              <div key={train.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-4">
                        {train.train_name}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        {train.train_number}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">From</p>
                        <p className="font-medium">{train.source_station}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {train.departure_time}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">To</p>
                        <p className="font-medium">{train.destination_station}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {train.arrival_time}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Available Seats</p>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-green-600" />
                          <span className="font-medium text-green-600">
                            {train.available_seats}/{train.total_seats}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:ml-6 lg:flex-shrink-0">
                    <div className="text-right mb-4">
                      <div className="flex items-center justify-end text-2xl font-bold text-gray-900">
                        <IndianRupee className="h-6 w-6" />
                        {train.price}
                      </div>
                      <p className="text-sm text-gray-600">per person</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        const form = document.querySelector('form') as HTMLFormElement
                        const formData = new FormData(form)
                        const travelDate = formData.get('date') as string
                        onBookTrain(train, travelDate)
                      }}
                      disabled={train.available_seats === 0}
                      className={`w-full px-6 py-2 rounded-md font-medium transition-colors ${
                        train.available_seats === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {train.available_seats === 0 ? 'Sold Out' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}