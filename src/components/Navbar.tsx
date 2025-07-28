import React from 'react'
import { Train, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function Navbar({ currentView, onViewChange }: NavbarProps) {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Train className="h-8 w-8 text-orange-400" />
            <span className="text-xl font-bold">RailReserve</span>
          </div>
          
          {user && (
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onViewChange('search')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'search' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Search Trains
              </button>
              <button
                onClick={() => onViewChange('trains')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'trains' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                All Trains
              </button>
              <button
                onClick={() => onViewChange('bookings')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'bookings' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                My Bookings
              </button>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5" />
                <span className="text-sm">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="p-2 hover:bg-blue-800 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}