import React from 'react'
import { ArrowLeft, Train, MapPin, Clock, Users, IndianRupee, Calendar, Wifi, Coffee, Car } from 'lucide-react'
import { Train as TrainType } from '../types'

interface TrainDetailsProps {
  train: TrainType
  onBack: () => void
  onBookTrain: (train: TrainType, travelDate: string) => void
}

export function TrainDetails({ train, onBack, onBookTrain }: TrainDetailsProps) {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split('T')[0]
  )

  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Coffee, label: 'Food Service' },
    { icon: Car, label: 'AC Coaches' },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Train Details</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Train Info */}
          <div className="lg:col-span-2">
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <Train className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">{train.train_name}</h3>
                  <p className="text-blue-700">Train Number: {train.train_number}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold">Departure</span>
                  </div>
                  <p className="text-lg font-medium">{train.source_station}</p>
                  <div className="flex items-center text-blue-700">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{train.departure_time}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold">Arrival</span>
                  </div>
                  <p className="text-lg font-medium">{train.destination_station}</p>
                  <div className="flex items-center text-blue-700">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{train.arrival_time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Availability */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Seat Availability</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{train.available_seats}</p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-600">{train.total_seats}</p>
                  <p className="text-sm text-gray-600">Total Seats</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Occupancy</span>
                  <span>{Math.round(((train.total_seats - train.available_seats) / train.total_seats) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${((train.total_seats - train.available_seats) / train.total_seats) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h4>
              <div className="grid grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <amenity.icon className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-700">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-blue-200 rounded-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center text-3xl font-bold text-blue-900 mb-2">
                  <IndianRupee className="h-8 w-8" />
                  {train.price}
                </div>
                <p className="text-gray-600">per person</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => onBookTrain(train, selectedDate)}
                disabled={train.available_seats === 0}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                  train.available_seats === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {train.available_seats === 0 ? 'Sold Out' : 'Book This Train'}
              </button>

              {train.available_seats <= 5 && train.available_seats > 0 && (
                <p className="text-red-600 text-sm mt-2 text-center">
                  Only {train.available_seats} seats left!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}