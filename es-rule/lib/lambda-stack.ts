import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as es from '@aws-cdk/aws-elasticsearch';
import * as lambda from '@aws-cdk/aws-lambda';

export class LambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const esDomain = this.node.tryGetContext('esDomain');

    const func = new lambda.Function(this, 'test-pre-hook-function', {
      code: lambda.Code.fromAsset('lambda/dist/preHookFunction'),
      functionName: 'test-es-index-create-pre-hook',
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: { ES_DOMAIN: esDomain },
    });

    func.addPermission('test-permission', {
      principal: new iam.ServicePrincipal('iot.amazonaws.com'),
    });

    const domain = es.Domain.fromDomainEndpoint(
      this,
      'test-es-domain',
      `https://${esDomain}`,
    );
    domain.grantReadWrite(func);
  }
}
