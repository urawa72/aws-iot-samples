#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EsStack } from '../lib/es-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { IoTCoreStack } from '../lib/iot-core-stack';

const app = new cdk.App();
new EsStack(app, 'es-test-es-stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
new LambdaStack(app, 'es-test-lambda-stack');
new IoTCoreStack(app, 'es-test-iot-core-stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
