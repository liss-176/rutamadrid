import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DeliveryProvider } from './context/DeliveryContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { FullMapPage } from './pages/FullMapPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { DeliveriesPage } from './pages/DeliveriesPage';
import { PlanRoutePage } from './pages/PlanRoutePage';

export function App() {
  return (
    <DeliveryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="mapa" element={<FullMapPage />} />
            <Route path="vehiculos" element={<VehiclesPage />} />
            <Route path="repartos" element={<DeliveriesPage />} />
            <Route path="programar" element={<PlanRoutePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DeliveryProvider>
  );
}

export default App;
