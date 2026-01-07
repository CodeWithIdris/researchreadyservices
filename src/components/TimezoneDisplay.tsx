import { useState, useEffect } from "react";
import { Clock, Globe } from "lucide-react";

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

const businessHoursNigeria: BusinessHours[] = [
  { day: "Monday", open: "09:00", close: "18:00" },
  { day: "Tuesday", open: "09:00", close: "18:00" },
  { day: "Wednesday", open: "09:00", close: "18:00" },
  { day: "Thursday", open: "09:00", close: "18:00" },
  { day: "Friday", open: "09:00", close: "18:00" },
  { day: "Saturday", open: "10:00", close: "14:00" },
  { day: "Sunday", open: "00:00", close: "00:00", isClosed: true },
];

const TimezoneDisplay = () => {
  const [visitorTimezone, setVisitorTimezone] = useState<string>("");
  const [currentTimeLocal, setCurrentTimeLocal] = useState<string>("");
  const [currentTimeNigeria, setCurrentTimeNigeria] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [localBusinessHours, setLocalBusinessHours] = useState<BusinessHours[]>([]);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setVisitorTimezone(timezone);

    const updateTimes = () => {
      const now = new Date();
      
      // Local time
      setCurrentTimeLocal(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: timezone 
      }));
      
      // Nigeria time (WAT = Africa/Lagos)
      setCurrentTimeNigeria(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Africa/Lagos' 
      }));

      // Check if currently open
      const nigeriaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
      const dayIndex = nigeriaTime.getDay();
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
      const todayHours = businessHoursNigeria.find(h => h.day === dayName);
      
      if (todayHours && !todayHours.isClosed) {
        const currentHour = nigeriaTime.getHours();
        const currentMinute = nigeriaTime.getMinutes();
        const [openHour, openMinute] = todayHours.open.split(':').map(Number);
        const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
        
        const currentMinutes = currentHour * 60 + currentMinute;
        const openMinutes = openHour * 60 + openMinute;
        const closeMinutes = closeHour * 60 + closeMinute;
        
        setIsOpen(currentMinutes >= openMinutes && currentMinutes < closeMinutes);
      } else {
        setIsOpen(false);
      }

      // Convert business hours to local timezone
      const convertedHours = businessHoursNigeria.map(hours => {
        if (hours.isClosed) return hours;
        
        const openDate = new Date();
        const [openHour, openMinute] = hours.open.split(':').map(Number);
        openDate.setHours(openHour, openMinute, 0, 0);
        
        const closeDate = new Date();
        const [closeHour, closeMinute] = hours.close.split(':').map(Number);
        closeDate.setHours(closeHour, closeMinute, 0, 0);

        // Convert from Nigeria time to local time
        const nigeriaOffset = 1; // WAT is UTC+1
        const localOffset = -now.getTimezoneOffset() / 60;
        const offsetDiff = localOffset - nigeriaOffset;

        const localOpenHour = openHour + offsetDiff;
        const localCloseHour = closeHour + offsetDiff;

        return {
          ...hours,
          open: `${String(Math.floor((localOpenHour + 24) % 24)).padStart(2, '0')}:${String(openMinute).padStart(2, '0')}`,
          close: `${String(Math.floor((localCloseHour + 24) % 24)).padStart(2, '0')}:${String(closeMinute).padStart(2, '0')}`,
        };
      });
      
      setLocalBusinessHours(convertedHours);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime12h = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Business Hours</h3>
        <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
          isOpen ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
        }`}>
          {isOpen ? 'Open Now' : 'Closed'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-secondary/50 rounded-lg">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Your Time</p>
          <p className="text-lg font-bold text-foreground">{currentTimeLocal}</p>
          <p className="text-xs text-muted-foreground truncate">{visitorTimezone}</p>
        </div>
        <div className="text-center border-l border-border">
          <p className="text-xs text-muted-foreground mb-1">Nigeria (WAT)</p>
          <p className="text-lg font-bold text-foreground">{currentTimeNigeria}</p>
          <p className="text-xs text-muted-foreground">Africa/Lagos</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="w-4 h-4" />
          <span>Hours in your timezone ({visitorTimezone.split('/').pop()?.replace('_', ' ')})</span>
        </div>
        {localBusinessHours.map((hours) => (
          <div key={hours.day} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{hours.day}</span>
            <span className={hours.isClosed ? 'text-red-500' : 'text-foreground font-medium'}>
              {hours.isClosed ? 'Closed' : `${formatTime12h(hours.open)} - ${formatTime12h(hours.close)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimezoneDisplay;