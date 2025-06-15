import Headers from "../components/header/index"
import Footer from "../components/footer/index"
const Notification = () => {
    return ( 
        <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-gray-200 text-center py-4">
        <h1 className="text-2xl font-bold">My Notifications</h1>
      </header>
      <Headers/>
      

      {/* Notifications Section */}
      <main className="max-w-3xl mx-auto p-4 mt-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">My Notifications</h2>
        <div className="space-y-4">
          
            <div
             
              className="flex items-start justify-between border px-4 py-3 rounded-md border-purple-600"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gray-300 w-10 h-10 rounded-full" />
                <div>
                  <p className="text-blue-600 font-medium"></p>
                  <p className="text-sm text-gray-500"></p>
                </div>
              </div>
              <p className="text-sm text-gray-400"></p>
            </div>
        
        </div>
      </main>

    <Footer/>
    </div>
     );
}
 
export default Notification;