import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';
import { Patient } from './patients/page';

export default function PatientsTable({ patients }: { patients: Patient[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Date of Birth</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {patients.map(({ patient_id, full_name, date_of_birth }) => (
          <TableRow key={patient_id}>
            <TableCell>{full_name}</TableCell>
            <TableCell>
              <Text>{new Date(date_of_birth).toLocaleDateString()}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
