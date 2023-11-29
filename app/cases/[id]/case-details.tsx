import { Callout, Card, Col, Flex, Grid, Text, Title } from '@tremor/react';
import { CaseDetailsModel } from '@/lib/types';

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
              className="h-60 gap-3"
            >
              <Title>{caseDetails.name}</Title>
              <Callout title="Case Details">{caseDetails.details}</Callout>
            </Flex>
          </Card>
        </Col>

        <Col numColSpanLg={2}>
          <div className="space-y-6">
            <Card>
              <div className="h-24">
                <Title>Disease</Title>
                <Text>{caseDetails.disease}</Text>
              </div>
            </Card>
            <Card>
              <div className="h-24">
                <Title>Drug Requested</Title>
                <Text>{caseDetails.drug_requested}</Text>
              </div>
            </Card>
            <Card>
              <div className="h-24" />
            </Card>
          </div>
        </Col>
      </Grid>
    </main>
  );
}
