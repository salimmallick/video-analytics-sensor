import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [customRange, setCustomRange] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const presetRanges = [
    { label: 'Last 24 hours', days: 1, description: 'Previous 24 hour period' },
    { label: 'Last 7 days', days: 7, description: 'Previous 7 days' },
    { label: 'Last 30 days', days: 30, description: 'Previous 30 days' },
    { label: 'Last 90 days', days: 90, description: 'Previous 90 days' },
    { label: 'Custom Range', days: 0, description: 'Select custom date range' }
  ];

  const handlePresetSelect = (days: number) => {
    if (days === 0) {
      setCustomRange(true);
      return;
    }

    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setSelectedRange({ start, end });
    onChange({ start, end });
    setIsOpen(false);
    setCustomRange(false);
  };

  const handleCustomRangeSelect = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(selectedRange);
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const isSelectedDate = (date: Date) => {
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = isSelectedDate(date);
      const isTodayDate = isToday(date);

      days.push(
        <button
          key={day}
          onClick={() => {
            if (customRange) {
              if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
                setSelectedRange({ start: date, end: date });
              } else {
                setSelectedRange({
                  start: selectedRange.start,
                  end: date > selectedRange.start ? date : selectedRange.start
                });
              }
            }
          }}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors
            ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
            ${isTodayDate && !isSelected ? 'border border-blue-600 text-blue-600' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Calendar className="w-4 h-4" />
        <span className="font-medium">
          {formatDate(selectedRange.start)} - {formatDate(selectedRange.end)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[680px] bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="flex divide-x">
            {/* Presets panel */}
            <div className="w-64 p-4 bg-gray-50 rounded-l-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Select</h3>
              <div className="space-y-2">
                {presetRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handlePresetSelect(range.days)}
                    className="w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                      hover:bg-white hover:shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="font-medium text-gray-900">{range.label}</div>
                    <div className="text-xs text-gray-500">{range.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar panel */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs text-gray-500 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>

              {customRange && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Selected: {formatDate(selectedRange.start)} - {formatDate(selectedRange.end)}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCustomRange(false);
                        setIsOpen(false);
                      }}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCustomRangeSelect}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Apply Range
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}