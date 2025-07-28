import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AuthForm } from './components/AuthForm'
import { Navbar } from './components/Navbar'
import { TrainSearch } from './components/TrainSearch'
import { TrainList } from './components/TrainList'
import { TrainDetails } from './components/TrainDetails'
import { BookingForm } from './components/BookingForm'
import { BookingSuccess } from './components/BookingSuccess'
import { MyBookings } from './components/MyBookings'
import { Train } from './types'

type View = 'search' | 'trains' | 'train-details' | 'bookings' | 'booking-form' | 'booking-success'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState<View>('search')
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null)
  const [travelDate, setTravelDate] = useState('')

  const handleBookTrain = (train: Train, date: string) => {
    setSelectedTrain(train)
    setTravelDate(date)
    setCurrentView('booking-form')
  }

  const handleViewTrainDetails = (train: Train) => {
    setSelectedTrain(train)
    setCurrentView('train-details')
  }

  const handleBookingComplete = () => {
    setCurrentView('booking-success')
  }

  const handleBackToSearch = () => {
    setSelectedTrain(null)
    setTravelDate('')
    setCurrentView('search')
  }

  const handleBackToTrains = () => {
    setSelectedTrain(null)
    setCurrentView('trains')
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="py-8">
        {currentView === 'search' && (
          <TrainSearch onBookTrain={handleBookTrain} />
        )}
        
        {currentView === 'trains' && (
          <TrainList 
            onBookTrain={handleBookTrain} 
            onViewDetails={handleViewTrainDetails}
          />
        )}
        
        {currentView === 'train-details' && selectedTrain && (
          <TrainDetails
            train={selectedTrain}
            onBack={handleBackToTrains}
            onBookTrain={handleBookTrain}
          />
        )}
        
        {currentView === 'bookings' && <MyBookings />}
        
        {currentView === 'booking-form' && selectedTrain && (
          <BookingForm
            train={selectedTrain}
            travelDate={travelDate}
            onBack={handleBackToSearch}
            onBookingComplete={handleBookingComplete}
          />
        )}
        
        {currentView === 'booking-success' && (
          <BookingSuccess onBackToSearch={handleBackToSearch} />
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App