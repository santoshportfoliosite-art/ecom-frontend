import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Eye, EyeOff, Plus, X, Upload, CheckCircle, RefreshCw } from 'lucide-react';

const SliderManagement = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    imageTitle: '',
    imageDescription: '',
    buttonTitle: '',
    buttonLink: '',
    imageIndex: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CORRECT: Your backend URL without extra 
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  console.log('Backend URL:', backendUrl);

  // Fetch all sliders - FIXED URL
  const fetchSliders = async () => {
    try {
      setLoading(true);
      setError('');
     
      const response = await axios.get(`${backendUrl}/sliders`);
      console.log('Fetched sliders:', response.data);
      setSliders(response.data.sliders || []);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      setError('Failed to fetch sliders: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum 5MB allowed.');
        e.target.value = '';
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Only images (JPEG, PNG, GIF, WebP) are allowed.');
        e.target.value = '';
        return;
      }
      
      setFormData({
        ...formData,
        image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      image: null,
      imageTitle: '',
      imageDescription: '',
      buttonTitle: '',
      buttonLink: '',
      imageIndex: ''
    });
    setPreviewUrl('');
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSuccess('');
    setIsSubmitting(false);
    
    // Clear file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  // Handle form submit - CORRECTLY MATCHES BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Authentication required. Please login again.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Validate form data (matches backend validation)
      if (!formData.imageTitle || !formData.imageDescription || 
          !formData.buttonTitle || !formData.buttonLink || !formData.imageIndex) {
        throw new Error('All fields are required');
      }

      const imageIndexNum = parseInt(formData.imageIndex);
      if (isNaN(imageIndexNum) || imageIndexNum < 1 || imageIndexNum > 5) {
        throw new Error('Image Index must be a number between 1 and 5');
      }

      // Create FormData object (MUST match backend field names)
      const formDataToSend = new FormData();
      
      // Append text fields (EXACT field names from backend)
      formDataToSend.append('imageTitle', formData.imageTitle.trim());
      formDataToSend.append('imageDescription', formData.imageDescription.trim());
      formDataToSend.append('buttonTitle', formData.buttonTitle.trim());
      formDataToSend.append('buttonLink', formData.buttonLink.trim());
      formDataToSend.append('imageIndex', imageIndexNum.toString());
      
      // Append image file (MUST be named 'image' to match req.files.image)
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      } else if (!editingId) {
        throw new Error('Image is required for new sliders');
      }

      // Debug: Log FormData contents
      console.log('Sending FormData with entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value instanceof File ? 
          `${value.name} (${value.type}, ${value.size} bytes)` : value);
      }

      // CORRECT URL PATHS (matches your server.js routes)
      const url = editingId 
        ? `${backendUrl}/sliders/${editingId}`  // PUT
        : `${backendUrl}/sliders`;              // POST
      
      const method = editingId ? 'PUT' : 'POST';
      
      console.log(`Making ${method} request to:`, url);
      console.log('Auth token present:', !!token);

      const response = await axios({
        method: method,
        url: url,
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000
      });

      console.log('Response received:', response.data);
      
      // Check success flag (matches backend response format)
      if (response.data.success) {
        setSuccess(editingId ? 'Slider updated successfully!' : 'Slider created successfully!');
        resetForm();
        fetchSliders();
      } else {
        throw new Error(response.data.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Detailed error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Extract error message from backend response
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Something went wrong';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit slider
  const handleEdit = (slider) => {
    setFormData({
      image: null,
      imageTitle: slider.imageTitle,
      imageDescription: slider.imageDescription,
      buttonTitle: slider.buttonTitle,
      buttonLink: slider.buttonLink,
      imageIndex: slider.imageIndex.toString()
    });
    setPreviewUrl(slider.image.url);
    setEditingId(slider._id);
    setShowForm(true);
  };

  // Delete slider - CORRECT URL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slider?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      await axios.delete(`${backendUrl}/sliders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Slider deleted successfully!');
      fetchSliders();
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      setError('Failed to delete slider: ' + (err.response?.data?.message || err.message));
    }
  };

  // Toggle slider status - CORRECT URL
  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }
      
      await axios.patch(`${backendUrl}/sliders/${id}/toggle-status`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess(`Slider ${currentStatus ? 'deactivated' : 'activated'}!`);
      fetchSliders();
    } catch (err) {
      console.error('Toggle error:', err.response?.data || err.message);
      setError('Failed to toggle slider status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-emerald-300">Loading sliders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Slider Management</h1>
              <p className="text-emerald-200">Manage up to 5 slider images for your website</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  Backend: {backendUrl}
                </span>
                <span className="text-xs text-emerald-300 bg-emerald-900/30 px-2 py-1 rounded">
                  {sliders.length}/5 sliders
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchSliders()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-300"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-emerald-900/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                disabled={sliders.length >= 5}
              >
                <Plus size={20} />
                Add New Slider ({sliders.length}/5)
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg backdrop-blur-sm animate-fadeIn">
            <div className="flex items-start gap-2 text-red-300">
              <X size={20} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Error</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
              <button 
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-300"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-700/50 rounded-lg backdrop-blur-sm animate-fadeIn">
            <div className="flex items-center justify-between text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} />
                <p>{success}</p>
              </div>
              <button 
                onClick={() => setSuccess('')}
                className="text-emerald-400 hover:text-emerald-300"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Slider Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-8 text-center backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-900/30 rounded-full mb-4">
                  <Upload className="text-emerald-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Sliders Found</h3>
                <p className="text-gray-400 mb-4">Start by adding your first slider image</p>
                <button 
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                >
                  Add First Slider
                </button>
              </div>
            </div>
          ) : (
            sliders.map((slider) => (
              <div 
                key={slider._id} 
                className={`bg-gradient-to-br from-gray-800 to-gray-900 border rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                  slider.isActive 
                    ? 'border-emerald-700/50 hover:border-emerald-600' 
                    : 'border-red-700/50 hover:border-red-600'
                }`}
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={slider.image.url} 
                    alt={slider.imageTitle}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200/1f2937/6ee7b7?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-900/80 text-emerald-100 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                      #{slider.imageIndex}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {slider.isActive ? (
                      <span className="bg-emerald-900/80 text-emerald-100 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-1">
                        <Eye size={12} />
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-900/80 text-red-100 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-1">
                        <EyeOff size={12} />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                    {slider.imageTitle}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {slider.imageDescription}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Button:</span>
                      <span className="text-emerald-300 font-medium">{slider.buttonTitle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Link:</span>
                      <span className="text-emerald-300 font-mono text-sm truncate max-w-[150px]">
                        {slider.buttonLink}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-700/50">
                    <button
                      onClick={() => toggleStatus(slider._id, slider.isActive)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        slider.isActive 
                          ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200' 
                          : 'bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 hover:text-emerald-200'
                      }`}
                    >
                      {slider.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                      {slider.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(slider)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 hover:text-blue-200 rounded-lg text-sm font-semibold transition-all duration-300"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slider._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 rounded-lg text-sm font-semibold transition-all duration-300"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-emerald-700/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gray-800/90 backdrop-blur-sm border-b border-emerald-700/30 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingId ? 'Edit Slider' : 'Add New Slider'}
                    </h2>
                    <p className="text-emerald-200 text-sm mt-1">
                      {editingId ? 'Update slider details' : 'Fill in all required fields'}
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-300"
                  >
                    <X className="text-gray-400 hover:text-white" size={24} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Image {!editingId && <span className="text-red-400">*</span>}
                  </label>
                  <div className="border-2 border-dashed border-emerald-700/30 rounded-xl p-6 text-center hover:border-emerald-600/50 transition-colors duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required={!editingId}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="text-emerald-400 mb-3" size={40} />
                        <p className="text-white font-medium mb-1">
                          {previewUrl ? 'Change Image' : 'Click to upload'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          PNG, JPG, GIF, WebP up to 5MB
                        </p>
                      </div>
                    </label>
                  </div>
                  {previewUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-300 mb-2">Preview:</p>
                      <div className="relative rounded-lg overflow-hidden border border-emerald-700/30">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Image Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="imageTitle"
                    value={formData.imageTitle}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter a compelling title"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Image Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Image Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="imageDescription"
                    value={formData.imageDescription}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe what this slider represents"
                    rows="3"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                {/* Button Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Button Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="buttonTitle"
                      value={formData.buttonTitle}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Shop Now"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Button Link <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., /home, /products"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Image Index <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="imageIndex"
                      value={formData.imageIndex}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="5"
                      placeholder="1 to 5"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-700/50">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg font-semibold transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-emerald-900/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        {editingId ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : (
                      editingId ? 'Update Slider' : 'Create Slider'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderManagement;