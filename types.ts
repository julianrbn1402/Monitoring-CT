export interface CalculationInputs {
  cycletimeLoader: number | string;
  waktuKerjaLoader: number | string;
  jumlahPassing: number | string;
  cycletimeHauler: number | string;
  konversiJarak: number | string;
  jumlahHD: number | string;
}

export interface SavedRecord extends CalculationInputs {
  id: string;
  dateTime: string;
  pitLocation: string;
  unitLoader: string;
  loadingTime: number;
  productivityLoader: number;
  productivityHauler: number;
  matchFactor: number;
  timestamp: string;
}
