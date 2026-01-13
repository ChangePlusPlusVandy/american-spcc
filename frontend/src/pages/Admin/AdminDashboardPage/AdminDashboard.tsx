// src/pages/Admin/AdminDashboard.tsx
export default function AdminDashboard() {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
  
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <p className="text-gray-500 mt-2">
              Coming soon
            </p>
          </div>
  
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">Content Management</h2>
            <p className="text-gray-500 mt-2">
              Coming soon
            </p>
          </div>
        </div>
      </div>
    );
  }
  