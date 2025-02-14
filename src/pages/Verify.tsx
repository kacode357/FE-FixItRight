const Verify = () => {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="max-w-sm sm:max-w-md w-full bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
          <div className="text-center">
            {/* Confirmation icon image */}
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8_ylLUaEpVusU4p2ahQuGBu2GNksGRloEoQ&s"
              alt="Confirmation successful"
              className="w-16 h-16 mx-auto mb-4"
            />
  
            {/* Title */}
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Email Confirmation Successful!</h1>
  
            {/* Success message */}
            <p className="text-gray-600 mb-6">
              Your account has been activated. You can start using the service now.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Verify;
  