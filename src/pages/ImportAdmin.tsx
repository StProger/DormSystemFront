import ExcelImportCard from '../components/ExcelImportCard';
import { adminImportRoomsXlsx, adminImportStudentsXlsx } from '../api/client';

export default function ImportAdmin() {
  return (
    <div>
      <h1 className="h1">Импорт из Excel</h1>

      <div style={{display:'grid', gap:12}}>
        <ExcelImportCard
          title="Импорт комнат"
          hint='Файл .xlsx, лист "Rooms", колонки: number, capacity'
          onUpload={adminImportRoomsXlsx}
        />

        <ExcelImportCard
          title="Импорт студентов"
          hint='Файл .xlsx, лист "Students", колонки: email, full_name, password'
          onUpload={adminImportStudentsXlsx}
        />
      </div>
    </div>
  );
}
