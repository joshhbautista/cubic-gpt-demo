import { sql } from '@vercel/postgres';
import { Col, Grid, Text, Title } from '@tremor/react';
import { CaseDetailsModel } from '@/lib/types';
import Chat from '@/components/chat';
import { AssistantSelect } from '@/components/select';
import CaseDetails from './case-details';

export const fetchCache = 'force-no-store';

interface CaseDetailsPageProps {
  params: {
    id: string;
  };
  searchParams: { assistantId: string };
}

export default async function CaseDetailsPage({
  params,
  searchParams
}: CaseDetailsPageProps) {
  const caseId = params.id;
  const assistantId =
    searchParams.assistantId ?? 'asst_F51hdzctFpAuSTtGV035oxp8';
  const { rows } = await sql<CaseDetailsModel>`
    SELECT *
    FROM cases
    LEFT JOIN patients ON cases.patient_id = patients.patient_id
    LEFT JOIN status ON cases.status_id = status.status_id
    WHERE case_id = ${caseId};
  `;
  const caseDetails = rows[0];

  return (
    <main className="p-4 md:p-10 mx-auto max-w-screen-2xl">
      <Grid numItems={5} className="gap-6">
        <Col numColSpan={3}>
          <Title>Case Details</Title>
          <Text className="mb-6">
            View the details of a case in the database.
          </Text>

          <CaseDetails caseDetails={caseDetails} />
        </Col>
        <Col numColSpan={2}>
          <Title>AI Assistants + Chat</Title>
          <Text className="mb-6">Chat with a specialized AI Assistant.</Text>
          <AssistantSelect activeAssistantId={assistantId} />
          <div className="flex flex-col">
            <main className="flex flex-col flex-1 bg-muted/50">
              <Chat assistantId={assistantId} caseId={caseId} />
            </main>
          </div>
        </Col>
      </Grid>
    </main>
  );
}
