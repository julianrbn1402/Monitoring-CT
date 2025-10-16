import React from 'react';
import type { SavedRecord } from '../types';

interface HistoryTableProps {
  records: SavedRecord[];
  onExport: () => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ records, onExport }) => {
  if (records.length === 0) {
    return null; // Don't render anything if there are no records
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-slate-300 mt-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-indigo-600">Riwayat Data</h2>
        <button
          onClick={onExport}
          className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors self-start sm:self-center"
        >
          Export to Excel
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-left text-slate-700">
          <thead className="text-xs text-slate-800 uppercase bg-slate-200/50">
            <tr>
              <th scope="col" className="px-4 py-3">Waktu & Tanggal</th>
              <th scope="col" className="px-4 py-3">Lokasi Pit</th>
              <th scope="col" className="px-4 py-3">Unit Loader</th>
              <th scope="col" className="px-4 py-3">CT Loader (detik)</th>
              <th scope="col" className="px-4 py-3">CT Hauler (menit)</th>
              <th scope="col" className="px-4 py-3">Prod. Loader</th>
              <th scope="col" className="px-4 py-3">Prod. Hauler</th>
              <th scope="col" className="px-4 py-3">Match Factor</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="bg-white/50 border-b border-slate-200 last:border-b-0 hover:bg-slate-100/50">
                <td className="px-4 py-3 font-medium whitespace-nowrap">{record.dateTime}</td>
                <td className="px-4 py-3">{record.pitLocation}</td>
                <td className="px-4 py-3">{record.unitLoader}</td>
                <td className="px-4 py-3">{record.cycletimeLoader}</td>
                <td className="px-4 py-3">{record.cycletimeHauler}</td>
                <td className="px-4 py-3">{record.productivityLoader.toFixed(2)}</td>
                <td className="px-4 py-3">{record.productivityHauler.toFixed(2)}</td>
                <td className="px-4 py-3 font-bold">{record.matchFactor.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;