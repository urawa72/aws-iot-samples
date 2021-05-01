import * as cdk from '@aws-cdk/core';
import * as es from '@aws-cdk/aws-elasticsearch';
import * as iam from '@aws-cdk/aws-iam';

const timestamp = new Date().getTime();

export class EsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const region = props?.env?.region;
    const accountId = props?.env?.account;

    const statement = new iam.PolicyStatement({ effect: iam.Effect.ALLOW });
    statement.addArnPrincipal('*');
    statement.addActions('es:*');
    statement.addCondition('IpAddress', { 'aws:SourceIp': 'Ip Address' });
    statement.addResources(
      `arn:aws:es:${region}:${accountId}:domain/my-test-${timestamp}/*`,
    );

    new es.Domain(this, 'test-domain', {
      domainName: `my-test-${timestamp}`,
      version: es.ElasticsearchVersion.V7_9,
      capacity: {
        dataNodeInstanceType: 't2.small.elasticsearch',
        dataNodes: 1,
      },
      accessPolicies: [statement],
    });
  }
}
