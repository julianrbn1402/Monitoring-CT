import React from 'react';
import type { CalculationInputs } from '../types';
import InputGroup from './InputGroup';

interface MatchFactorCardProps {
  inputs: CalculationInputs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  productivityLoader: number;
  productivityHauler: number;
  matchFactor: number;
}

const MatchFactorCard: React.FC<MatchFactorCardProps> = ({
  inputs,
  onInputChange,
  productivityLoader,
  productivityHauler,
  matchFactor,
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-300">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Match Factor (MF)</h2>
      <div className="space-y-4">
        <InputGroup
          label="Jumlah HD"
          id="jumlahHD"
          unit="unit"
          value={inputs.jumlahHD}
          onChange={onInputChange}
        />
        <InputGroup
          label="Productivity Loader"
          id="mfProductivityLoader"
          unit="bcm/jam"
          value={productivityLoader > 0 ? productivityLoader.toFixed(2) : '0.00'}
          isReadOnly={true}
        />
        <InputGroup
          label="Productivity Hauler"
          id="mfProductivityHauler"
          unit="bcm/Jam/km"
          value={productivityHauler > 0 ? productivityHauler.toFixed(2) : '0.00'}
          isReadOnly={true}
        />
        <hr className="border-slate-300 my-6"/>
        <InputGroup
          label="Match Factor"
          id="matchFactor"
          unit=""
          value={matchFactor > 0 ? matchFactor.toFixed(2) : '0.00'}
          isReadOnly={true}
        />
      </div>
    </div>
  );
};

export default MatchFactorCard;