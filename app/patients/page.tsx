import { sql } from '@vercel/postgres';
import { Card, Title, Text } from '@tremor/react';
import Search from '../search';
import PatientsTable from '../table';

export interface Patient {
  patient_id: string;
  full_name: string;
  date_of_birth: Date;
  medical_record: any;
}

export default async function PatientsPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';
  const result = await sql`
    SELECT patient_id, full_name, date_of_birth, medical_record
    FROM patients
    WHERE full_name ILIKE ${'%' + search + '%'};
  `;
  const patients = result.rows as Patient[];

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Patients</Title>
      <Text>A list of patients retrieved from a Postgres database.</Text>

      <Search />
      <Card className="mt-6">
        <PatientsTable patients={patients} />
      </Card>
    </main>
  );
}
