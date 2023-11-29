import { sql } from '@vercel/postgres';
import { Card, Col, Flex, Grid, Text, Title } from '@tremor/react';
import { CaseDetailsModel, StatusModel } from '@/lib/types';
import Chat from '@/components/chat';
import { AssistantSelect } from '@/components/select';
import CasesTable from '@/components/table';
import Generate from './generate';
import Search from './search';
import Tabs from './tabs';

interface IndexPageProps {
  searchParams: { q: string; statusId: string; assistantId: string };
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
  const search = searchParams.q ?? '';
  const statusId = searchParams.statusId ?? '1';
  const assistantId =
    searchParams.assistantId ?? 'asst_F51hdzctFpAuSTtGV035oxp8';

  const { rows: cases } = await sql<CaseDetailsModel>`
    SELECT *
    FROM cases
    LEFT JOIN patients ON cases.patient_id = patients.patient_id
    LEFT JOIN status ON cases.status_id = status.status_id
    WHERE name ILIKE ${'%' + search + '%'} AND
      status.status_id = ${statusId};
  `;
  const { rows: statuses } = await sql<StatusModel>`
    SELECT *
    FROM status
  `;

  return (
    <main className="p-4 md:p-10 mx-auto max-w-screen-2xl">
      <Grid numItems={5} className="gap-6">
        <Col numColSpan={3}>
          <Title>Cases</Title>
          <Text className="mb-6">
            A table displaying all of the cases in the database.
          </Text>

          <Tabs activeTabId={statusId} tabs={statuses} />
          <Flex className="w-full mt-6">
            <Search />
            <Generate />
          </Flex>
          <Card className="mt-6">
            <CasesTable cases={cases} />
          </Card>
        </Col>
        <Col numColSpan={2}>
          <Title>AI Assistants + Chat</Title>
          <Text className="mb-6">Chat with a specialized AI Assistant.</Text>
          <AssistantSelect activeAssistantId={assistantId} />
          <div className="flex flex-col min-h-screen">
            <main className="flex flex-col flex-1 bg-muted/50">
              <Chat assistantId={assistantId} />
            </main>
          </div>
        </Col>
      </Grid>
    </main>
  );
}
