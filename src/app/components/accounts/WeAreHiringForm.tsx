'use client';

import { useState } from 'react';

const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    id: 2,
    title: 'Customer Support Specialist',
    department: 'Support',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
  },
  {
    id: 3,
    title: 'Marketing Coordinator',
    department: 'Marketing',
    location: 'Remote',
    type: 'Part-time',
  },
];

const departments = ['All', 'Engineering', 'Support', 'Marketing'];

export default function WeAreHiringForm() {
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredJobs =
    selectedDept === 'All'
      ? jobs
      : jobs.filter((job) => job.department === selectedDept);

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">We're Hiring!</h2>
        <p className="text-gray-600 max-w-xl mx-auto mt-2">
          Join Time Shoppy and be part of a fast-growing team. We value creativity,
          collaboration, and customer obsession. Browse our current openings below.
        </p>
      </div>

      {/* Department Filter */}
      <div className="flex justify-center">
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm text-gray-700 focus:outline-none"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
            <p className="text-sm text-gray-600">
              Department: {job.department} • {job.location} • {job.type}
            </p>
            <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Apply Now
            </button>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500">No openings in this department.</p>
        )}
      </div>

      {/* Application Form */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Submit Your Application
        </h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded-md shadow-sm"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border px-4 py-2 rounded-md shadow-sm"
              placeholder="johndoe@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Upload CV</label>
            <input
              type="file"
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
