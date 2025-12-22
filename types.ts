
export interface SubFunction {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface MainModule {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  subFunctions: SubFunction[];
}

export interface Room {
  id: string;
  name: string;
  type: string;
  status: 'empty' | 'occupied' | 'maintenance';
  price: number;
}

export interface Invoice {
  id: string;
  roomName: string;
  tenant: string;
  amount: number;
  status: 'paid' | 'pending';
  date: string;
}
