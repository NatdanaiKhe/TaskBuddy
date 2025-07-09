import { useState } from "react";
import ProviderService from "@/components/ProviderService";
import ProviderBooking from "@/components/ProviderBooking";
function ProviderDashboard(){
  const [activeTab, setActiveTab] = useState("services");

  return (
    <main className="h-auto min-h-[calc(100vh-64px)] flex-grow bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Provider Dashboard
          </h1>
          <p className="text-gray-600">Manage your services and bookings</p>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("services")}
                className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === "services" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === "bookings" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
              >
                Bookings
              </button>
            </nav>
          </div>
        </div>

        {/* Services Tab */}
        {activeTab === "services" && <ProviderService />}
        
        {/* Bookings Tab */}
        {activeTab === "bookings" && <ProviderBooking />}
      </div>
    </main>
  );
};


export default ProviderDashboard;
