import React from 'react';
import type { CalculationInputs } from '../types';
import InputGroup from './InputGroup';

interface ProductivityLoaderCardProps {
  inputs: CalculationInputs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  productivityLoader: number;
  loadingTime: number;
}

const ProductivityLoaderCard: React.FC<ProductivityLoaderCardProps> = ({
  inputs,
  onInputChange,
  productivityLoader,
  loadingTime,
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-300">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Productivity Loader</h2>
      <div className="space-y-4">
        <InputGroup
          label="Cycletime Loader"
          id="cycletimeLoader"
          unit="detik"
          value={inputs.cycletimeLoader}
          onChange={onInputChange}
        />
        <InputGroup
          label="Jumlah Passing"
          id="jumlahPassing"
          unit="kali"
          value={inputs.jumlahPassing}
          onChange={onInputChange}
        />
        <InputGroup
          label="Loading Time"
          id="loadingTime"
          unit="menit"
          value={loadingTime > 0 ? loadingTime.toFixed(2) : '0.00'}
          isReadOnly={true}
        />
        <InputGroup
          label="Waktu Kerja"
          id="waktuKerjaLoader"
          unit="menit"
          value={inputs.waktuKerjaLoader}
          onChange={onInputChange}
        />
        <hr className="border-slate-300 my-6"/>
        <InputGroup
          label="Productivity Loader"
          id="productivityLoader"
          unit="bcm/jam"
          value={productivityLoader > 0 ? productivityLoader.toFixed(2) : '0.00'}
          isReadOnly={true}
        />
      </div>
    </div>
  );
};

export default ProductivityLoaderCard;