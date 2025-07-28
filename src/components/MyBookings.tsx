import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, User, CreditCard, AlertCircle, Edit, Trash2, DollarSign, X } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Booking, Train } from '../types'
import { EditBookingModal } from './EditBookingModal'

interface BookingWithTrain extends Booking {
  trains: Train
}

export function MyBookings() {
  const [bookings, setBookings] = useState<BookingWithTrain[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBooking, setEditingBooking] = useState<BookingWithTrain | null>(null)
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all')
  const { user } = useAuth()

  useEffect(() => {
    fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trains (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (bookingId: string, trainId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    
    try {
      // Update booking status
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (bookingError) throw bookingError

      // Increment available seats
      const train = bookings.find(b => b.id === bookingId)?.trains
      if (train) {
        const { error: trainError } = await supabase
          .from('trains')
          .update({ available_seats: train.available_seats + 1 })
          .eq('id', trainId)

        if (trainError) throw trainError
      }

      // Refresh bookings
      fetchBookings()
    } catch (error) {
      console.error('Error cancelling booking:', error)
    }
  }

  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return
    
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) throw error
      fetchBookings()
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  const handlePayment = async (bookingId: string) => {
    // Simulate payment process
    alert('Payment functionality would be integrated here with a payment gateway like Stripe or Razorpay')
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">My Bookings</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'confirmed' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'cancelled' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            History ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No bookings found' : `No ${filter} bookings`}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You haven't made any train bookings yet." 
              : `You don't have any ${filter} bookings.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mr-4">
                      {booking.trains.train_name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded text-sm font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{booking.trains.source_station} → {booking.trains.destination_station}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{booking.trains.departure_time} - {booking.trains.arrival_time}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Travel: {format(new Date(booking.travel_date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-2" />
                        <span>{booking.passenger_name} (Seat: {booking.seat_number})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Amount: ₹{booking.amount}</span>
                  </div>
                </div>
                
                <div className="lg:ml-6 lg:flex-shrink-0 mt-4 lg:mt-0">
                  <div className="text-right mb-3">
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-medium text-gray-900">{booking.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Booked: {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => setEditingBooking(booking)}
                          className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handlePayment(booking.id)}
                          className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Pay
                        </button>
                        <button
                          onClick={() => cancelBooking(booking.id, booking.trains.id)}
                          className="flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={() => {
            setEditingBooking(null)
            fetchBookings()
          }}
        />
      )}
    </div>
  )
}