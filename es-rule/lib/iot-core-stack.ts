import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';

const timestamp = new Date().getTime();

export class IoTCoreStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const region = props?.env?.region;
    const accountId = props?.env?.account;

    const provisioningRole = new iam.Role(this, 'test-role-for-provisioning', {
      assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
      roleName: `es-test-role-for-provisioning-${timestamp}`,
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(
          this,
          'AWSIoTThingsRegistration',
          'arn:aws:iam::aws:policy/service-role/AWSIoTThingsRegistration',
        ),
      ],
    });

    const thingPolicy = new iot.CfnPolicy(this, 'test-thing-policy', {
      policyName: `es-test-thing-policy-${timestamp}`,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: 'iot:*',
            Resource: '*',
          },
        ],
      },
    });

    new iot.CfnProvisioningTemplate(this, 'test-provisioning-template', {
      templateName: `es-test-template-${timestamp}`,
      enabled: true,
      provisioningRoleArn: provisioningRole.roleArn,
      preProvisioningHook: {
        targetArn: `arn:aws:lambda:${region}:${accountId}:function:test-es-index-create-pre-hook`,
      },
      templateBody: `
{
  "Parameters": {
    "SerialNumber": {
      "Type": "String"
    },
    "AWS::IoT::Certificate::Id": {
      "Type": "String"
    }
  },
  "Resources": {
    "certificate": {
      "Properties": {
        "CertificateId": {
          "Ref": "AWS::IoT::Certificate::Id"
        },
        "Status": "Active"
      },
      "Type": "AWS::IoT::Certificate"
    },
    "policy": {
      "Properties": {
        "PolicyName": "${thingPolicy.policyName}"
      },
      "Type": "AWS::IoT::Policy"
    },
    "thing": {
      "OverrideSettings": {
        "AttributePayload": "MERGE",
        "ThingGroups": "DO_NOTHING",
        "ThingTypeName": "REPLACE"
      },
      "Properties": {
        "AttributePayload": {},
        "ThingGroups": [],
        "ThingName": {
          "Fn::Join": [
            "",
            [
              "Temp_",
              {
                "Ref": "SerialNumber"
              }
            ]
          ]
        }
      },
      "Type": "AWS::IoT::Thing"
    }
  }
}
      `,
    });

    const ruleRole = new iam.Role(this, 'test-role-for-iot-rule-topic', {
      assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
    });
    ruleRole.addToPolicy(
      new iam.PolicyStatement({ resources: ['*'], actions: ['es:ESHttpPut'] }),
    );

    const esDomain = this.node.tryGetContext('esDomain');
    new iot.CfnTopicRule(this, 'test-topic-rule', {
      topicRulePayload: {
        actions: [
          {
            elasticsearch: {
              endpoint: `https://${esDomain}`,
              id: '${newuuid()}',
              index: '${topic(3)}',
              roleArn: ruleRole.roleArn,
              type: '_doc',
            },
          },
        ],
        sql: 'SELECT * FROM "test/topic/+"',
      },
    });
  }
}
