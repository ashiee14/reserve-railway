import React, { useState, useEffect } from 'react'
import { Train, Clock, MapPin, Users, IndianRupee, Info } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Train as TrainType } from '../types'

interface TrainListProps {
  onBookTrain: (train: TrainType, travelDate: string) => void
  onViewDetails: (train: TrainType) => void
}

export function TrainList({ onBookTrain, onViewDetails }: TrainListProps) {
  const [trains, setTrains] = useState<TrainType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
    fetchAllTrains()
  }, [])

  const fetchAllTrains = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('trains')
        .select('*')
        //.order('departure_time')

      if (error) throw error
      setTrains(data || [])
    } catch (error) {
      console.error('Error fetching trains:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading trains...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Train className="mr-3 h-6 w-6 text-blue-600" />
          Available Trains
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Travel Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {trains.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No trains available.</p>
          </div>
        ) : (
          trains.map((train) => (
            <div key={train.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
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
                        <span className={`font-medium ${
                          train.available_seats > 10 ? 'text-green-600' : 
                          train.available_seats > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
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
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => onViewDetails(train)}
                      className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    
                    <button
                      onClick={() => onBookTrain(train, selectedDate)}
                      disabled={train.available_seats === 0}
                      className={`px-6 py-2 rounded-md font-medium transition-colors ${
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
            </div>
          ))
        )}
      </div>
    </div>
  )
}