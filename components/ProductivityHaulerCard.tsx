import React from 'react';
import type { CalculationInputs } from '../types';
import InputGroup from './InputGroup';

interface ProductivityHaulerCardProps {
  inputs: CalculationInputs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  productivityHauler: number;
}

const ProductivityHaulerCard: React.FC<ProductivityHaulerCardProps> = ({
  inputs,
  onInputChange,
  productivityHauler,
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-300">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Productivity Hauler</h2>
      <div className="space-y-4">
        <InputGroup
          label="Cycletime Hauler"
          id="cycletimeHauler"
          unit="menit"
          value={inputs.cycletimeHauler}
          onChange={onInputChange}
        />
        <InputGroup
          label="Konversi Jarak"
          id="konversiJarak"
          unit="km"
          value={inputs.konversiJarak}
          onChange={onInputChange}
        />
        <hr className="border-slate-300 my-6"/>
        <InputGroup
          label="Productivity Hauler"
          id="productivityHauler"
          unit="bcm/Jam/km"
          value={productivityHauler > 0 ? productivityHauler.toFixed(2) : '0.00'}
          isReadOnly={true}
        />
      </div>
    </div>
  );
};

export default ProductivityHaulerCard;