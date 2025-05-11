import React, { useState, useEffect } from 'react';
import TutorCard from '../components/SMALL_components/TutorCard';
import { getAllTutors } from '../api/apiService';
import {
  FiFilter, FiX, FiStar, FiAward, FiBook, FiUser,
  FiDollarSign, FiMapPin
} from 'react-icons/fi';

const FindTutorPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [allTutors, setAllTutors] = useState([]); // For frontend filtering
  const [filters, setFilters] = useState({
    name: '',
    subject: '',
    customSubject: '',
    rating: '',
    minPrice: '',
    maxPrice: '',
    experience: '',
    location: '',
    availability: '',
    educationLevel: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchTutors = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTutors({});
      setAllTutors(data);
      setTutors(data); // Initially show all
    } catch (error) {
      console.error('Failed to fetch tutors', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showFilters]);

  useEffect(() => {
    fetchTutors();
  }, []);

  // Apply filters locally
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = allTutors.filter(tutor => {
        const matchName = filters.name
          ? tutor.fullName?.toLowerCase().includes(filters.name.toLowerCase())
          : true;

        const matchSubject = filters.subject === 'Other'
          ? tutor.subjectsOfExpertise?.some(sub =>
              sub.toLowerCase().includes(filters.customSubject.toLowerCase())
            )
          : filters.subject
            ? tutor.subjectsOfExpertise?.includes(filters.subject)
            : true;

        const matchRating = filters.rating ? tutor.averageRating >= parseFloat(filters.rating) : true;
        const matchMinPrice = filters.minPrice ? tutor.hourlyRate >= parseFloat(filters.minPrice) : true;
        const matchMaxPrice = filters.maxPrice ? tutor.hourlyRate <= parseFloat(filters.maxPrice) : true;
        const matchExperience = filters.experience ? tutor.experienceYears >= parseInt(filters.experience) : true;
        const matchLocation = filters.location
          ? tutor.address?.toLowerCase().includes(filters.location.toLowerCase())
          : true;

        return matchName && matchSubject && matchRating && matchMinPrice && matchMaxPrice && matchExperience && matchLocation;
      });
      setTutors(filtered);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, allTutors]);

  const handleFilterChange = (e, filterType) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      subject: '',
      customSubject: '',
      rating: '',
      minPrice: '',
      maxPrice: '',
      experience: '',
      location: '',
      availability: '',
      educationLevel: ''
    });
  };

  const activeFilters = Object.entries(filters).filter(([key, value]) =>
    value && !(key === 'customSubject' && filters.subject !== 'Other')
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden px-4 py-2 flex items-center justify-between bg-white border-b border-gray-200">
        <h2 className="text-xl font-semibold">Find Tutors</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-indigo-600 font-medium flex items-center"
        >
          <FiFilter className="mr-1" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filter Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white p-4 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:block md:border-r md:h-screen md:w-72`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <FiFilter className="mr-2" /> Filters
          </h2>
          <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800">
            Clear all
          </button>
        </div>

        <div className="space-y-4">
          {/* Name Filter */}
          <FilterSection icon={<FiUser />} title="Name">
            <input
              type="text"
              placeholder="Search by name"
              className="filter-input w-full px-3 py-2 border rounded-md text-sm"
              value={filters.name}
              onChange={(e) => handleFilterChange(e, 'name')}
            />
          </FilterSection>

          {/* Subject Filter */}
          <FilterSection icon={<FiBook />} title="Subject">
            <select
              onChange={(e) => handleFilterChange(e, 'subject')}
              value={filters.subject}
              className="filter-input w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="English">English</option>
              <option value="Other">Other</option>
            </select>
            {filters.subject === 'Other' && (
              <input
                type="text"
                placeholder="Enter subject"
                className="filter-input w-full px-3 py-2 border rounded-md text-sm mt-2"
                value={filters.customSubject}
                onChange={(e) => handleFilterChange(e, 'customSubject')}
              />
            )}
          </FilterSection>

          <FilterSection icon={<FiStar />} title="Minimum Rating">
            <select
              onChange={(e) => handleFilterChange(e, 'rating')}
              value={filters.rating}
              className="filter-input w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </FilterSection>

          <FilterSection icon={<FiDollarSign />} title="Price Range">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="filter-input w-full px-3 py-2 border rounded-md text-sm"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange(e, 'minPrice')}
              />
              <input
                type="number"
                placeholder="Max"
                className="filter-input w-full px-3 py-2 border rounded-md text-sm"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange(e, 'maxPrice')}
              />
            </div>
          </FilterSection>

          <FilterSection icon={<FiAward />} title="Experience (years)">
            <input
              type="number"
              placeholder="Any"
              className="filter-input w-full px-3 py-2 border rounded-md text-sm"
              value={filters.experience}
              onChange={(e) => handleFilterChange(e, 'experience')}
            />
          </FilterSection>

          <FilterSection icon={<FiMapPin />} title="Location">
            <input
              type="text"
              placeholder="City or country"
              className="filter-input w-full px-3 py-2 border rounded-md text-sm"
              value={filters.location}
              onChange={(e) => handleFilterChange(e, 'location')}
            />
          </FilterSection>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Tutor</h1>
          <p className="text-gray-500 mb-6">{tutors.length} tutors available</p>

          {/* Active filters display */}
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(([key, value]) => (
              <FilterPill
                key={key}
                label={getFilterLabel(key, value, filters)}
                onRemove={() => setFilters({ ...filters, [key]: '' })}
              />
            ))}
          </div>

          {/* Results */}
          {isLoading ? (
            <LoadingSpinner />
          ) : tutors.length === 0 ? (
            <NoResultsMessage />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-5 ">
              {tutors.map(tutor => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const FilterSection = ({ icon, title, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      {icon} <span className="ml-2">{title}</span>
    </label>
    {children}
  </div>
);

const FilterPill = ({ label, onRemove }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
    {label}
    <button onClick={onRemove} className="ml-1 text-indigo-400 hover:text-indigo-500">
      <FiX className="w-3 h-3" />
    </button>
  </span>
);

const LoadingSpinner = () => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
    <p className="mt-3 text-sm text-gray-500">Loading tutors...</p>
  </div>
);

const NoResultsMessage = () => (
  <div className="text-center py-8">
    <h3 className="text-md font-medium text-gray-900">No tutors match your filters</h3>
    <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
  </div>
);

// Helper Function
const getFilterLabel = (key, value) => {
  const labels = {
    name: `Name: ${value}`,
    subject: `Subject: ${value}`,
    customSubject: `Subject: ${value}`,
    rating: `Rating: ${value}+`,
    minPrice: `Min Price: $${value}`,
    maxPrice: `Max Price: $${value}`,
    experience: `Experience: ${value}+ years`,
    location: `Location: ${value}`
  };
  return labels[key] || '';
  };
  
  export default FindTutorPage;
