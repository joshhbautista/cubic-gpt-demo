import { sql } from '@vercel/postgres';
import { Card, Title, Text } from '@tremor/react';

interface CaseDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function CaseDetailsPage({
  params
}: CaseDetailsPageProps) {
  const caseId = params.id;
  const { rows } = await sql`
    SELECT *
    FROM cases
    WHERE case_id = ${caseId};
  `;

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Case</Title>
      <Text>A list of patients retrieved from a Postgres database.</Text>

      {JSON.stringify(rows)}
    </main>
  );
}
