import MiniDrawer from './components/sideBar'
import HomePage from './Pages/HomePage'
import Master from './Pages/Master/Master'
import MockData from './Pages/MockData'
import Login from './Pages/Login'
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider, createTheme } from '@mui/material'
import SHUConfigList from './Pages/Master/Laporan/SHUSettings/SHUConfigList'
import SHUConfigDetail from './Pages/Master/Laporan/SHUSettings/SHUConfigDetail'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import DataTable from './Pages/TableView'
import PinjamanForm from './Pages/Transaksi/PinjamanForm'
import MemberDetail from './Pages/Detail/MemberDetails'
import AngsuranForm from './Pages/Transaksi/AngsuranForm'
import SimpananForm from './Pages/Transaksi/SimpananForm'
import MemberMaster from './Pages/Master/Master.Member'
import PinjamanMaster from './Pages/Master/Master.Pinjaman'
import SimpananMaster from './Pages/Master/Master.Simpanan'
import LoanDetail from './Pages/Detail/LoanDetails'
import Settings from './Pages/Settings/Settings'
import LoanSetting from './Pages/Settings/Loan/Loan.Settings'
import ModalForm from './Pages/Master/Master.Modal'
import CashbookList from './Pages/Master/Master.CashBook'
import SHUPage from './Pages/Master/Master.Laporan'
import MemberForm from './Pages/Master/MemberForm'
import SHUConfigCreate from './Pages/Master/Laporan/SHUSettings/SHUConfigCreate'

function App() {

  const theme = createTheme({
    typography: {
      fontFamily: 'Roboto, Monstserrat',
    },
    palette: {
      primary: {
        main: '#052831',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MiniDrawer />
                </ProtectedRoute>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="master" element={<Master />} />
              <Route path="master/member" element={<MemberMaster />} />
              <Route path="master/member/create" element={<MemberForm />} />
              <Route path="master/simpanan" element={<SimpananMaster />} />
              <Route path="master/pinjaman" element={<PinjamanMaster />} />
              <Route path="master/rekap" element={<MockData />} />
              <Route path="transaksi/pinjaman" element={<PinjamanForm />} />
              <Route path="transaksi/simpanan" element={<SimpananForm />} />
              <Route path="transaksi/angsuran/:memberId?" element={<AngsuranForm />} />
              <Route path="detail/member/:id" element={<MemberDetail />} />
              <Route path="detail/pinjaman/:id" element={<LoanDetail />} />
              <Route path="laporan" element={<MockData />} />
              <Route path="pengaturan" element={<Settings />} />
              <Route path="pengaturan/pinjaman" element={<LoanSetting />} />
              <Route path="master/modal" element={<ModalForm />} />
              <Route path="master/kas" element={<CashbookList />} />
              <Route path="master/laporan" element={<SHUPage />} />
              <Route path="master/shu-config" element={<SHUConfigList />} />
              <Route path="master/shu-config/:id" element={<SHUConfigDetail />} />
              <Route path="master/shu-config/create" element={<SHUConfigCreate />} />


            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
