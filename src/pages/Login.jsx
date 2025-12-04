import React from 'react';

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form>
          <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" required />
          <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" required />
          <button type="submit" className="w-full bg-[#262C53] text-white p-2 rounded hover:bg-[#1a1f3a]">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
