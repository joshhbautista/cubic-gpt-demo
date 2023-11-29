import {
  Badge,
  Callout,
  Card,
  Col,
  Flex,
  Grid,
  Subtitle,
  Text,
  Title
} from '@tremor/react';
import { CaseDetailsModel } from '@/lib/types';

const statusIdToBadgeMap: Record<number, string> = {
  1: 'neutral',
  2: 'success',
  3: 'warning',
  4: 'error',
  5: 'info',
  6: 'primary'
};

interface CaseDetailsProps {
  caseDetails: CaseDetailsModel;
}

export default function CaseDetails({ caseDetails }: CaseDetailsProps) {
  return (
    <main>
      <Grid numItemsLg={6} className="gap-6 mt-6">
        <Col numColSpanLg={4}>
          <Card className="h-full">
            <Flex
              flexDirection="col"
              alignItems="start"
              justifyContent="start"
              className="h-auto gap-3"
            >
              <Flex alignItems="start" className="h-auto gap-3">
                <Flex justifyContent="start" className="gap-3">
                  <Title>{caseDetails.name}</Title>
                  <Subtitle>#{caseDetails.case_id}</Subtitle>
                </Flex>
                <Badge
                  color={statusIdToBadgeMap[caseDetails.status_id]}
                  size="lg"
                >
                  {caseDetails.label}
                </Badge>
              </Flex>
              <Flex
                flexDirection="col"
                alignItems="start"
                justifyContent="start"
                className="gap-1"
              >
                <Text>
                  {new Date(caseDetails.date_of_birth).toLocaleDateString(
                    'en-us',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }
                  )}
                </Text>
                <Text>{caseDetails.address}</Text>
                <Text>{caseDetails.phone_number}</Text>
              </Flex>
              <Title>Case Notes</Title>
              {JSON.parse(caseDetails.case_notes).map(
                (note: { date: string; note: string }, index: number) => (
                  <Card key={index}>
                    <Text>{note.date}</Text>
                    <Text>{note.note}</Text>
                  </Card>
                )
              )}
            </Flex>
          </Card>
        </Col>

        <Col numColSpanLg={2}>
          <div className="space-y-6">
            <Card>
              <div className="h-auto">
                <Title>Details</Title>
                <Badge size="lg">{caseDetails.decision}</Badge>
                <Text>{caseDetails.details}</Text>
              </div>
            </Card>
            <Card>
              <div className="h-auto">
                <Title>Disease</Title>
                <Text>{caseDetails.disease}</Text>
                <Callout className="mt-3" title="Medical History">
                  {caseDetails.medical_history}
                </Callout>
              </div>
            </Card>
            <Card>
              <div className="h-12">
                <Title>Drug Requested</Title>
                <Text>{caseDetails.drug_requested}</Text>
              </div>
            </Card>
          </div>
        </Col>
      </Grid>
    </main>
  );
}
