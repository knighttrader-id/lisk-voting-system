import React, { useState } from 'react';
import { Plus, Trash2, Clock, CheckCircle, HelpCircle, Users } from 'lucide-react';
import { CreatePollData } from '../types';

interface CreatePollProps {
  onCreatePoll: (pollData: CreatePollData) => Promise<boolean>;
  loading: boolean;
}

export const CreatePoll: React.FC<CreatePollProps> = ({ onCreatePoll, loading }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(24);
  const [showForm, setShowForm] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert('Please fill in all fields');
      return;
    }

    const success = await onCreatePoll({
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      duration,
    });

    if (success) {
      setQuestion('');
      setOptions(['', '']);
      setDuration(24);
      setShowForm(false);
    }
  };

  if (!showForm) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-blue-300 font-semibold mb-2">🎯 How to Create a Poll</h3>
          <div className="text-sm text-blue-200 space-y-1 text-left max-w-md mx-auto">
            <p>1. Click "Create New Poll" button below</p>
            <p>2. Enter your question and options</p>
            <p>3. Set poll duration</p>
            <p>4. Submit to blockchain</p>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Create Your Poll</h2>
          <p className="text-white/70 mb-6">
            Create transparent, secure polls on the blockchain. Anyone can vote, and results are immutable.
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg px-8 py-4 font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>🚀 Create New Poll</span>
        </button>
        
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <h3 className="font-semibold text-sm mb-1">Secure Voting</h3>
            <p className="text-xs text-white/70">Blockchain ensures vote integrity</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <h3 className="font-semibold text-sm mb-1">Public Access</h3>
            <p className="text-xs text-white/70">Anyone with a wallet can vote</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-sm mb-1">Time Limited</h3>
            <p className="text-xs text-white/70">Set custom poll duration</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <span>Create New Poll</span>
        </h2>
        <button
          onClick={() => setShowTips(!showTips)}
          className="text-white/60 hover:text-white transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
      
      {showTips && (
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <h3 className="font-semibold text-blue-300 mb-2">💡 Tips for Better Polls</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Keep questions clear and specific</li>
            <li>• Provide balanced, distinct options</li>
            <li>• Consider your audience when setting duration</li>
            <li>• Shorter polls get more engagement</li>
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Poll Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What's your favorite programming language?"
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Options</label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1} (e.g., ${index === 0 ? 'JavaScript' : index === 1 ? 'Python' : 'TypeScript'})`}
                  className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addOption}
            className="mt-3 text-sm text-purple-300 hover:text-purple-200 flex items-center space-x-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Option</span>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Duration (hours)</span>
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
          >
            <option value={1}>1 hour</option>
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours</option>
            <option value={48}>48 hours</option>
            <option value={168}>1 week</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 rounded-lg px-6 py-3 font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Creating Poll...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Create Poll</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};