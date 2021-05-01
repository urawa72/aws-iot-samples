import { Client } from '@elastic/elasticsearch';
import {
  createAWSConnection,
  awsGetCredentials,
} from '@acuris/aws-es-connection';

const ES_DOMAIN = process.env.ES_DOMAIN ?? '';

interface Event {
  claimCertificateId: 'string';
  certificateId: 'string';
  certificatePem: 'string';
  templateArn: 'string';
  clientId: 'string';
  parameters: {
    SerialNumber: 'string';
  };
}

interface Result {
  allowProvisioning: boolean;
}

export const handler = async (event: Event): Promise<Result> => {
  console.log(event);

  const awsCredentials = await awsGetCredentials();
  const AWSConnection = createAWSConnection(awsCredentials);
  const client = new Client({
    ...AWSConnection,
    node: `https://${ES_DOMAIN}`,
  });

  const res = await client.indices.create({
    index: event.parameters.SerialNumber,
  });
  console.log(res);

  return {
    allowProvisioning: true,
  };
};
