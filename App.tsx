import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { CalculationInputs, SavedRecord } from './types';
import ProductivityLoaderCard from './components/ProductivityLoaderCard';
import ProductivityHaulerCard from './components/ProductivityHaulerCard';
import MatchFactorCard from './components/MatchFactorCard';
import DetailMonitoringCard from './components/DetailMonitoringCard';
import HistoryTable from './components/HistoryTable';

const getFormattedDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  const time = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(/\./g, ':'); // Ensure time uses colons
  return `${date}, ${time}`;
};


const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    cycletimeLoader: '',
    waktuKerjaLoader: '',
    jumlahPassing: '',
    cycletimeHauler: '',
    konversiJarak: '',
    jumlahHD: '',
  });

  // State for the new monitoring details card
  const [dateTime, setDateTime] = useState(getFormattedDateTime());
  const [pitLocation, setPitLocation] = useState('');
  const [unitLoader, setUnitLoader] = useState('');
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);
  
  // Load and filter data from LocalStorage on mount
  useEffect(() => {
    try {
        const storedData = localStorage.getItem('monitoringData');
        if (storedData) {
            const records: SavedRecord[] = JSON.parse(storedData);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const recentRecords = records.filter(record => new Date(record.timestamp) > sevenDaysAgo);
            setSavedRecords(recentRecords);
            // Update localStorage with only the recent records
            localStorage.setItem('monitoringData', JSON.stringify(recentRecords));
        }
    } catch (error) {
        console.error("Failed to load or parse data from LocalStorage", error);
        localStorage.removeItem('monitoringData');
    }
  }, []);

  // Effect to update the date and time every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setDateTime(getFormattedDateTime());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);
  
  // Data for the dependent dropdowns
  const pitLoaderOptions = useMemo(() => ({
    'Pit 13HW': ['EX1827', 'EX1848', 'EX1873', 'EX1875'],
    'Pit 24': [], // Options to be added later as requested
  }), []);

  const handlePitLocationChange = useCallback((newPitLocation: string) => {
    setPitLocation(newPitLocation);
    setUnitLoader(''); // Reset unit loader selection when pit changes
  }, []);
  
  const handleUnitLoaderChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnitLoader(e.target.value);
  }, []);

  const currentLoaderOptions = useMemo(() => {
    if (!pitLocation) return [];
    return pitLoaderOptions[pitLocation as keyof typeof pitLoaderOptions] || [];
  }, [pitLocation, pitLoaderOptions]);


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value,
    }));
  }, []);

  const loadingTime = useMemo(() => {
    const cl = parseFloat(String(inputs.cycletimeLoader));
    const jp = parseFloat(String(inputs.jumlahPassing));
    if (cl > 0 && jp > 0) {
      return (cl * jp) / 60; // Formula: (Cycletime Loader [s] * Jumlah Passing) / 60 -> minutes
    }
    return 0;
  }, [inputs.cycletimeLoader, inputs.jumlahPassing]);

  const productivityLoader = useMemo(() => {
    // Revised formula as per user request: 42 * (waktu kerja / Loading time)
    const wk = parseFloat(String(inputs.waktuKerjaLoader));
    const lt = loadingTime;

    if (wk > 0 && lt > 0) {
      return 42 * (wk / lt);
    }
    return 0;
  }, [inputs.waktuKerjaLoader, loadingTime]);

  const productivityHauler = useMemo(() => {
    const ch = parseFloat(String(inputs.cycletimeHauler));
    const kj = parseFloat(String(inputs.konversiJarak));
    if (ch > 0 && kj > 0) {
      return (42 * 60) / (ch * kj);
    }
    return 0;
  }, [inputs.cycletimeHauler, inputs.konversiJarak]);

  const matchFactor = useMemo(() => {
    // Revised formula as per user request: (Jumlah HD * Productivity Hauler) / Productivity Loader
    const nh = parseFloat(String(inputs.jumlahHD));
    const pl = productivityLoader;
    const ph = productivityHauler;

    if (nh > 0 && ph > 0 && pl > 0) {
      return (nh * ph) / pl;
    }
    return 0;
  }, [inputs.jumlahHD, productivityLoader, productivityHauler]);

  const handleSave = useCallback(() => {
    // Validation
    if (productivityLoader <= 0 || !pitLocation || !unitLoader || matchFactor <= 0) {
      alert('Harap lengkapi semua data monitoring dan kalkulasi sebelum menyimpan.');
      return;
    }

    const newRecord: SavedRecord = {
        id: new Date().toISOString() + Math.random(), // simple unique id
        dateTime,
        pitLocation,
        unitLoader,
        ...inputs,
        loadingTime,
        productivityLoader,
        productivityHauler,
        matchFactor,
        timestamp: new Date().toISOString(),
    };

    const updatedRecords = [...savedRecords, newRecord];
    setSavedRecords(updatedRecords);
    localStorage.setItem('monitoringData', JSON.stringify(updatedRecords));
    alert('Data berhasil disimpan!');
  }, [inputs, dateTime, pitLocation, unitLoader, loadingTime, productivityLoader, productivityHauler, matchFactor, savedRecords]);

  const handleExport = useCallback(() => {
      if (savedRecords.length === 0) {
          alert('Tidak ada data untuk diekspor.');
          return;
      }

      const escapeCsvCell = (cell: any): string => {
        const cellString = String(cell ?? '').trim();
        if (/[";\n\r]/.test(cellString)) {
            const escapedString = cellString.replace(/"/g, '""');
            return `"${escapedString}"`;
        }
        return cellString;
      };

      const headers = [
          'Waktu dan Tanggal', 'Lokasi Pit', 'Unit Loader', 
          'Cycletime Loader (detik)', 'Jumlah Passing (kali)', 'Loading Time (menit)', 'Waktu Kerja (menit)', 'Productivity Loader (bcm/jam)',
          'Cycletime Hauler (menit)', 'Konversi Jarak (km)', 'Productivity Hauler (bcm/Jam/km)',
          'Jumlah HD (unit)', 'Match Factor'
      ];

      const rows = savedRecords.map(record => [
          record.dateTime,
          record.pitLocation,
          record.unitLoader,
          record.cycletimeLoader,
          record.jumlahPassing,
          record.loadingTime.toFixed(2),
          record.waktuKerjaLoader,
          record.productivityLoader.toFixed(2),
          record.cycletimeHauler,
          record.konversiJarak,
          record.productivityHauler.toFixed(2),
          record.jumlahHD,
          record.matchFactor.toFixed(2)
      ].map(escapeCsvCell).join(';'));

      // Prepend BOM for better Excel compatibility
      const csvContent = "\uFEFF" + [headers.map(escapeCsvCell).join(';'), ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "monitoring_ct_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  }, [savedRecords]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <div className="flex justify-center items-center gap-2 sm:gap-4">
            {/* PC2000 Logo (Excavator) */}
            <div>
              <svg viewBox="0 0 100 80" className="w-24 sm:w-32 h-auto drop-shadow-lg">
                <rect x="5" y="60" width="90" height="15" rx="5" fill="#B45309" />
                <rect x="55" y="35" width="40" height="25" fill="#F59E0B" />
                <rect x="30" y="45" width="25" height="15" fill="#FBBF24" />
                <path d="M55,45 L30,20 L10,30 L20,40 Z" stroke="#F59E0B" strokeWidth="6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                <path d="M10,30 C 0,30 0,45 10,45" stroke="#B45309" strokeWidth="5" fill="none" />
              </svg>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-5xl font-bold text-indigo-600 whitespace-nowrap">
                Monitoring CT
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                WEST AREA
              </p>
            </div>

            {/* HD785 Logo (Haul Truck) */}
            <div>
               <svg viewBox="0 0 100 70" className="w-24 sm:w-32 h-auto drop-shadow-lg">
                <circle cx="25" cy="55" r="10" fill="#92400E"/>
                <circle cx="75" cy="55" r="10" fill="#92400E"/>
                <path d="M5,40 L5,55 L95,55 L95,25 L55,25 L45,40 Z" fill="#FBBF24"/>
                <path d="M50,25 L95,25 L85,10 L40,10 Z" fill="#F59E0B"/>
                <path d="M5,40 L45,40 L45,25 L20,25 Q10,25 5,30 Z" fill="#F59E0B"/>
                <rect x="10" y="30" width="15" height="10" fill="#FEF3C7" fillOpacity="0.8"/>
              </svg>
            </div>
          </div>
        </header>
        
        <main className="flex flex-col items-center w-full">
          <div className="w-full max-w-xl space-y-6">
            <DetailMonitoringCard
              dateTime={dateTime}
              pitLocation={pitLocation}
              onPitLocationChange={handlePitLocationChange}
              pitOptions={Object.keys(pitLoaderOptions)}
              unitLoader={unitLoader}
              onUnitLoaderChange={handleUnitLoaderChange}
              loaderOptions={currentLoaderOptions}
            />
            <ProductivityLoaderCard
              inputs={inputs}
              onInputChange={handleInputChange}
              productivityLoader={productivityLoader}
              loadingTime={loadingTime}
            />
            <ProductivityHaulerCard
              inputs={inputs}
              onInputChange={handleInputChange}
              productivityHauler={productivityHauler}
            />
            <MatchFactorCard
              inputs={inputs}
              onInputChange={handleInputChange}
              productivityLoader={productivityLoader}
              productivityHauler={productivityHauler}
              matchFactor={matchFactor}
            />
            
            <div className="flex justify-center pt-2">
              <button
                  onClick={handleSave}
                  className="w-full max-w-xs bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
              >
                  SAVE
              </button>
            </div>

            <HistoryTable records={savedRecords} onExport={handleExport} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;