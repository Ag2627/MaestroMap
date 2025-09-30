import React from 'react';
import { Button } from './ui/button';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
              <i className="fas fa-magic"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Ringmaster's Roundtable</h1>
          </div>
          <Button 
            onClick={onLogin}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg"
            data-testid="header-login-btn"
          >
            <i className="fab fa-google mr-2"></i>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Uniting Scouts, Gazers & Planners
              <span className="block text-4xl text-orange-600 mt-2">for the Perfect Tour</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Planning the grand tour for the Circus of Wonders relies on expert agents: 
              the <span className="font-semibold text-orange-600">Sky Gazer</span> for weather, 
              the <span className="font-semibold text-red-600">Trailblazer</span> for routes, 
              and the <span className="font-semibold text-amber-600">Quartermaster</span> for costs. 
              Your mission is to unite them all.
            </p>
          </div>

          <div className="mb-12">
            <Button 
              onClick={onLogin}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105"
              data-testid="hero-get-started-btn"
            >
              <i className="fas fa-rocket mr-2"></i>
              Start Planning Your Grand Tour
            </Button>
          </div>

          {/* Agent Cards */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-testid="weather-agent-card">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-cloud-sun text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sky Gazer</h3>
              <p className="text-gray-600">Weather forecasts and climate insights for perfect timing</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-testid="maps-agent-card">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-map-marked-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trailblazer</h3>
              <p className="text-gray-600">Optimal routes and travel time calculations</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-testid="events-agent-card">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-star text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Event Scout</h3>
              <p className="text-gray-600">Local events and entertainment opportunities</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-testid="budget-agent-card">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-coins text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quartermaster</h3>
              <p className="text-gray-600">Budget optimization and cost breakdowns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How the Roundtable Works</h2>
            <p className="text-xl text-gray-600">Multi-agent orchestration for seamless travel planning</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="step-1">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Input Your Vision</h3>
              <p className="text-gray-600 text-lg">Tell us your destination, dates, budget, and interests. Our Grand Orchestrator listens.</p>
            </div>

            <div className="text-center" data-testid="step-2">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Agents Collaborate</h3>
              <p className="text-gray-600 text-lg">Weather, Maps, Events, and Budget agents work together, sharing insights and data.</p>
            </div>

            <div className="text-center" data-testid="step-3">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfect Plan Delivered</h3>
              <p className="text-gray-600 text-lg">Receive a comprehensive itinerary optimized for weather, budget, and unforgettable experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Unite the Circus Council?</h2>
          <p className="text-xl text-orange-100 mb-8">Join thousands of travelers who trust our multi-agent platform for perfect tour planning.</p>
          <Button 
            onClick={onLogin}
            className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105"
            data-testid="cta-login-btn"
          >
            <i className="fab fa-google mr-2"></i>
            Sign In & Start Planning
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 bg-gray-900 text-center">
        <p className="text-gray-400">
          © 2025 Ringmaster's Roundtable. Powered by multi-agent AI orchestration.
        </p>
      </footer>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-300/20 to-red-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-amber-300/20 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-red-200/10 to-orange-200/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default LandingPage;
