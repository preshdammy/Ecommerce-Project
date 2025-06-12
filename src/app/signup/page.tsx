
const Signup = () => {
    return (  
       <div className="bg-gray-100">
  
  <div className="bg-gray-200 text-center py-4">
    <h1 className="text-2xl font-bold">Sign up</h1>
  </div>

  <div className="flex justify-center items-center min-h-screen px-4">
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-blue-300">
      <h2 className="text-xl font-semibold text-center text-blue-600 mb-6">Join Time Shoppy</h2>

     
      <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-md mb-4 hover:bg-gray-50">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
        <span>Sign up with Google</span>
      </button>

      <div className="text-center text-sm text-gray-500 mb-4">OR</div>

    
      <form>
        <input type="text" placeholder="Enter full name" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="email" placeholder="Enter email address" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="password" placeholder="Enter password" className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="password" placeholder="Confirm password" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Register</button>
      </form>

    
      <p className="text-xs text-center text-gray-500 mt-4">
        By clicking register, you agree to the
        <a href="#" className="text-blue-600 underline">Terms of Service</a>
        and
        <a href="#" className="text-blue-600 underline">Privacy Policy</a>, including
        <a href="#" className="text-blue-600 underline">Cookie Use</a>.
      </p>

     
      <p className="text-sm text-center mt-4">
        Have an account already?
        <a href="#" className="text-blue-600 font-medium hover:underline">Log in</a>
      </p>
    </div>
  </div>
</div>
    );
}
 
export default Signup;