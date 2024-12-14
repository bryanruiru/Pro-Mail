import { useState, useCallback, useEffect } from 'react';
import { Send, Calendar, Mail, Mailbox } from 'lucide-react';

interface CampaignSchedulerProps {
  onSchedule: (scheduleTime: Date | null, campaignType: 'email' | 'postal') => void;
  onClose: () => void;
  initialScheduleTime?: Date | null;
}

export default function CampaignScheduler({ 
  onSchedule, 
  onClose, 
  initialScheduleTime = null 
}: CampaignSchedulerProps) {
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>(initialScheduleTime ? 'later' : 'now');
  const [campaignType, setCampaignType] = useState<'email' | 'postal'>('email');
  const [scheduleDate, setScheduleDate] = useState(initialScheduleTime ? 
    initialScheduleTime.toISOString().split('T')[0] : 
    '');
  const [scheduleTime, setScheduleTime] = useState(initialScheduleTime ? 
    initialScheduleTime.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5) : 
    '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (scheduleType === 'now') {
      setScheduleDate('');
      setScheduleTime('');
      setError('');
    }
  }, [scheduleType]);

  const validateSchedule = useCallback((): boolean => {
    if (scheduleType === 'now') return true;

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const now = new Date();

    if (isNaN(scheduledDateTime.getTime())) {
      setError('Invalid date or time format');
      return false;
    }

    if (scheduledDateTime <= now) {
      setError('Schedule time must be in the future');
      return false;
    }

    setError('');
    return true;
  }, [scheduleDate, scheduleTime, scheduleType]);

  const handleSchedule = useCallback(() => {
    if (!validateSchedule()) return;

    if (scheduleType === 'now') {
      onSchedule(null, campaignType);
    } else {
      const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      onSchedule(scheduledDateTime, campaignType);
    }
  }, [scheduleType, scheduleDate, scheduleTime, onSchedule, validateSchedule, campaignType]);

  const isScheduleDisabled = scheduleType === 'later' && (!scheduleDate || !scheduleTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-medium text-gray-100">Send Campaign</h3>
        
        <div className="mb-6 space-y-4">
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setCampaignType('email')}
              className={`flex flex-1 flex-col items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                campaignType === 'email'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Mail className="mb-2 h-5 w-5" />
              Email Campaign
            </button>
            <button
              type="button"
              onClick={() => setCampaignType('postal')}
              className={`flex flex-1 flex-col items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                campaignType === 'postal'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Mailbox className="mb-2 h-5 w-5" />
              Postal Mail
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setScheduleType('now')}
              className={`flex flex-1 flex-col items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                scheduleType === 'now'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Send className="mb-2 h-5 w-5" />
              Send Now
            </button>
            <button
              type="button"
              onClick={() => setScheduleType('later')}
              className={`flex flex-1 flex-col items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                scheduleType === 'later'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Calendar className="mb-2 h-5 w-5" />
              Schedule
            </button>
          </div>

          {scheduleType === 'later' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-200">
                  Date
                </label>
                <input
                  id="schedule-date"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-200">
                  Time
                </label>
                <input
                  id="schedule-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSchedule}
            disabled={isScheduleDisabled}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {scheduleType === 'now' ? 'Send Now' : 'Schedule Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}