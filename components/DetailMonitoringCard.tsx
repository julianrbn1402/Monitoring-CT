import React from 'react';
import InputGroup from './InputGroup';
import SelectGroup from './SelectGroup';

interface DetailMonitoringCardProps {
  dateTime: string;
  pitLocation: string;
  onPitLocationChange: (pit: string) => void;
  pitOptions: string[];
  unitLoader: string;
  onUnitLoaderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loaderOptions: string[];
}

const DetailMonitoringCard: React.FC<DetailMonitoringCardProps> = ({
  dateTime,
  pitLocation,
  onPitLocationChange,
  pitOptions,
  unitLoader,
  onUnitLoaderChange,
  loaderOptions,
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-300">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Detail Monitoring</h2>
      <div className="space-y-4">
        <InputGroup
          label="Waktu dan Tanggal"
          id="dateTime"
          unit=""
          value={dateTime}
          isReadOnly={true}
        />
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Lokasi Pit
          </label>
          <div className="flex space-x-2 rounded-lg">
            {pitOptions.map(pit => (
              <button
                key={pit}
                type="button"
                onClick={() => onPitLocationChange(pit)}
                className={`flex-1 py-2 px-3 text-sm font-semibold transition-all duration-150 ease-in-out border
                  ${pitLocation === pit
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                    : 'bg-white/80 text-slate-700 border-slate-300 hover:bg-slate-200/60 hover:border-slate-400'
                  }
                  first:rounded-l-md last:rounded-r-md
                `}
              >
                {pit}
              </button>
            ))}
          </div>
        </div>
        <SelectGroup
          label="Unit Loader"
          id="unitLoader"
          value={unitLoader}
          onChange={onUnitLoaderChange}
          options={loaderOptions}
          placeholder="Pilih Unit Loader"
        />
      </div>
    </div>
  );
};

export default DetailMonitoringCard;